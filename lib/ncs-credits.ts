/**
 * NCS Credits Management Library
 * Handles credit balance checks, deductions, and configuration
 */

import { getSupabase } from '@/utils/supabase/client';

// Cache for analysis costs (avoid excessive DB calls)
let costCache: { data: Record<string, number>; expiresAt: number } | null = null;
const CACHE_TTL = 60 * 1000; // 1 minute

/**
 * Analysis types and their display names
 */
export const ANALYSIS_TYPES = {
    descriptive: 'Thống kê mô tả',
    cronbach: "Cronbach's Alpha",
    correlation: 'Tương quan',
    ttest: 'T-Test',
    'ttest-indep': 'Independent T-Test',
    'ttest-paired': 'Paired T-Test',
    anova: 'ANOVA',
    efa: 'EFA',
    cfa: 'CFA',
    sem: 'SEM',
    regression: 'Hồi quy',
    chisquare: 'Chi-Square',
    'mann-whitney': 'Mann-Whitney U',
    'kruskal-wallis': 'Kruskal-Wallis',
    'wilcoxon': 'Wilcoxon Signed Rank',
    ai_explain: 'AI Giải thích',
    export_pdf: 'Xuất PDF'
} as const;

export type AnalysisType = keyof typeof ANALYSIS_TYPES;

/**
 * Get analysis costs from database (with caching)
 */
export async function getAnalysisCosts(): Promise<Record<string, number>> {
    // Check cache first
    if (costCache && Date.now() < costCache.expiresAt) {
        return costCache.data;
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'analysis_costs')
        .maybeSingle();

    if (error || !data) {
        console.warn('Failed to fetch analysis costs, using defaults');
        return getDefaultCosts();
    }

    const costs = typeof data.value === 'string'
        ? JSON.parse(data.value)
        : data.value;

    // Update cache
    costCache = {
        data: costs,
        expiresAt: Date.now() + CACHE_TTL
    };

    return costs;
}

/**
 * Get cost for a specific analysis type
 */
export async function getAnalysisCost(analysisType: string): Promise<number> {
    const costs = await getAnalysisCosts();
    return costs[analysisType] ?? 0;
}

/**
 * Get default NCS balance for new users
 */
export async function getDefaultBalance(): Promise<number> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'default_ncs_balance')
        .maybeSingle();

    if (error || !data) {
        console.warn('Failed to fetch default balance, using 100000');
        return 100000;
    }

    return typeof data.value === 'number'
        ? data.value
        : parseInt(data.value as string) || 100000;
}

/**
 * Check if user has enough credits for an analysis
 */
export async function checkBalance(userId: string, cost: number): Promise<{
    hasEnough: boolean;
    currentBalance: number;
    required: number;
    isExempt?: boolean;
}> {
    const supabase = getSupabase();
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('tokens, role')
        .eq('id', userId)
        .single();

    if (error || !profile) {
        console.error('Error checking balance:', error);
        return { hasEnough: false, currentBalance: 0, required: cost };
    }

    // Check if role is exempt (admin roles)
    // Mapping roles level >= 7: institution_admin, platform_admin, super_admin
    const exemptRoles = ['institution_admin', 'platform_admin', 'super_admin'];
    const isExempt = exemptRoles.includes(profile.role) || profile.role === 'admin';

    if (isExempt) {
        return { 
            hasEnough: true, 
            currentBalance: profile.tokens || 0, 
            required: cost,
            isExempt: true 
        };
    }

    const currentBalance = profile.tokens || 0;
    return {
        hasEnough: currentBalance >= cost,
        currentBalance,
        required: cost,
        isExempt: false
    };
}

/**
 * Deduct credits from user balance
 * Returns true if successful, false if insufficient funds or error
 */
export async function deductCredits(
    userId: string,
    amount: number,
    reason: string,
    analysisType?: string
): Promise<{ success: boolean; newBalance: number; error?: string; isExempt?: boolean }> {
    const supabase = getSupabase();

    // First check current balance and role
    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('tokens, total_spent, role')
        .eq('id', userId)
        .single();

    if (fetchError || !profile) {
        return { success: false, newBalance: 0, error: 'Không thể lấy thông tin tài khoản' };
    }

    // Admin Bypass Logic: level >= 7 (platform_admin=8, super_admin=9, institution_admin=7)
    const exemptRoles = ['institution_admin', 'platform_admin', 'super_admin', 'admin'];
    const isExempt = exemptRoles.includes(profile.role);

    if (isExempt) {
        // Log the transaction as zero cost for admin
        supabase.from('token_transactions').insert({
            user_id: userId,
            amount: 0,
            type: 'spend_analysis',
            description: `[Admin Bypass] ${reason}`,
            balance_after: profile.tokens || 0
        }).then(({ error }: any) => {
            if (error) console.warn('Failed to log admin transaction:', error);
        });

        return { success: true, newBalance: profile.tokens || 0, isExempt: true };
    }

    const currentBalance = profile.tokens || 0;
    if (currentBalance < amount) {
        return {
            success: false,
            newBalance: currentBalance,
            error: `Không đủ NCS. Cần ${amount.toLocaleString()}, hiện có ${currentBalance.toLocaleString()}`
        };
    }

    const newBalance = currentBalance - amount;
    const newTotalSpent = (profile.total_spent || 0) + amount;

    // Update balance
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            tokens: newBalance,
            total_spent: newTotalSpent,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId);

    if (updateError) {
        console.error('Error deducting credits:', updateError);
        return { success: false, newBalance: currentBalance, error: 'Lỗi trừ điểm' };
    }

    // Log the transaction (non-blocking)
    supabase.from('token_transactions').insert({
        user_id: userId,
        amount: -amount,
        type: 'spend_analysis',
        description: reason,
        balance_after: newBalance
    }).then(({ error }: any) => {
        if (error) console.warn('Failed to log transaction silently:', error);
    });

    return { success: true, newBalance, isExempt: false };
}

/**
 * Get user's current NCS balance
 */
export async function getUserBalance(userId: string): Promise<number> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('profiles')
        .select('tokens')
        .eq('id', userId)
        .single();

    if (error || !data) {
        return 0;
    }

    return data.tokens || 0;
}

/**
 * Update analysis costs (admin only)
 */
export async function updateAnalysisCosts(costs: Record<string, number>): Promise<boolean> {
    const supabase = getSupabase();
    const { error } = await supabase
        .from('system_config')
        .upsert({
            key: 'analysis_costs',
            value: costs,
            updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

    if (!error) {
        // Clear cache
        costCache = null;
    }

    return !error;
}

/**
 * Update default balance (admin only)
 */
export async function updateDefaultBalance(balance: number): Promise<boolean> {
    const supabase = getSupabase();
    const { error } = await supabase
        .from('system_config')
        .upsert({
            key: 'default_ncs_balance',
            value: balance,
            updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

    return !error;
}

/**
 * Default costs (fallback if DB fails)
 */
function getDefaultCosts(): Record<string, number> {
    return {
        descriptive: 100,
        cronbach: 500,
        omega: 500, // Same as cronbach
        correlation: 300,
        ttest: 400,
        'ttest-indep': 400,
        'ttest-paired': 400,
        anova: 600,
        efa: 1000,
        cfa: 2000,
        sem: 3000,
        regression: 800,
        chisquare: 400,
        'mann-whitney': 400,
        'kruskal-wallis': 600,
        'wilcoxon': 400,
        ai_explain: 1500,
        export_pdf: 200
    };
}

/**
 * Clear cost cache (call when admin updates costs)
 */
export function clearCostCache(): void {
    costCache = null;
}

/**
 * Get referral reward amount from database
 */
export async function getReferralReward(): Promise<number> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'referral_reward')
        .maybeSingle();

    if (error || !data) {
        console.warn('Failed to fetch referral reward, using 5000');
        return 5000;
    }

    return typeof data.value === 'number'
        ? data.value
        : parseInt(data.value as string) || 5000;
}

/**
 * Update referral reward amount (admin only)
 */
export async function updateReferralReward(amount: number): Promise<boolean> {
    const supabase = getSupabase();
    const { error } = await supabase
        .from('system_config')
        .upsert({
            key: 'referral_reward',
            value: amount,
            updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

    return !error;
}

/**
 * Atomic credit deduction via Supabase RPC.
 *
 * Calls a DB stored procedure that checks balance AND deducts in a single
 * transaction — eliminates the race condition where analysis succeeds but
 * deduction fails (or vice versa).
 *
 * Falls back to the non-atomic deductCredits() if the RPC is not available.
 *
 * SQL to create the RPC (run once in Supabase SQL Editor):
 *
 * CREATE OR REPLACE FUNCTION public.deduct_credits_atomic(
 *   p_user_id uuid,
 *   p_amount   integer,
 *   p_reason   text
 * )
 * RETURNS jsonb
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   v_tokens      integer;
 *   v_role        text;
 *   v_new_balance integer;
 *   v_exempt      boolean := false;
 *   v_exempt_roles text[] := ARRAY['admin','institution_admin','platform_admin','super_admin'];
 * BEGIN
 *   SELECT tokens, role INTO v_tokens, v_role
 *   FROM public.profiles
 *   WHERE id = p_user_id
 *   FOR UPDATE;                          -- row-level lock
 *
 *   IF NOT FOUND THEN
 *     RETURN jsonb_build_object('success', false, 'error', 'User not found');
 *   END IF;
 *
 *   v_exempt := v_role = ANY(v_exempt_roles);
 *
 *   IF v_exempt THEN
 *     RETURN jsonb_build_object('success', true, 'new_balance', v_tokens, 'exempt', true);
 *   END IF;
 *
 *   IF v_tokens < p_amount THEN
 *     RETURN jsonb_build_object('success', false, 'error', 'Insufficient credits',
 *                               'current_balance', v_tokens);
 *   END IF;
 *
 *   v_new_balance := v_tokens - p_amount;
 *
 *   UPDATE public.profiles
 *   SET tokens = v_new_balance,
 *       total_spent = COALESCE(total_spent, 0) + p_amount,
 *       updated_at = now()
 *   WHERE id = p_user_id;
 *
 *   INSERT INTO public.token_transactions(user_id, amount, type, description, balance_after)
 *   VALUES (p_user_id, -p_amount, 'spend_analysis', p_reason, v_new_balance);
 *
 *   RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance, 'exempt', false);
 * END;
 * $$;
 */
export async function deductCreditsAtomic(
    userId: string,
    amount: number,
    reason: string
): Promise<{ success: boolean; newBalance: number; isExempt?: boolean; error?: string }> {
    if (amount === 0) {
        // Free analysis — no deduction needed
        return { success: true, newBalance: 0, isExempt: false };
    }

    const supabase = getSupabase();

    const { data, error } = await supabase.rpc('deduct_credits_atomic', {
        p_user_id: userId,
        p_amount: amount,
        p_reason: reason,
    });

    if (error) {
        // RPC not available yet — fall back to non-atomic version
        console.warn('[Credits] RPC deduct_credits_atomic not available, falling back:', error.message);
        return deductCredits(userId, amount, reason);
    }

    const result = data as { success: boolean; new_balance?: number; exempt?: boolean; error?: string; current_balance?: number };

    if (!result.success) {
        return {
            success: false,
            newBalance: result.current_balance ?? 0,
            error: result.error ?? 'Deduction failed',
        };
    }

    return {
        success: true,
        newBalance: result.new_balance ?? 0,
        isExempt: result.exempt ?? false,
    };
}
