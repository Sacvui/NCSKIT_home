/**
 * Shared credit-safe analysis wrapper.
 *
 * Pattern:
 *  1. Check balance
 *  2. Deduct BEFORE running (atomic via RPC, falls back to non-atomic)
 *  3. Run analysis
 *  4. If analysis fails → refund credits
 *  5. Log usage on success
 *
 * This eliminates the race condition where analysis succeeds but deduction
 * fails (user gets free result) or analysis fails after deduction (user
 * loses credits for nothing).
 */

import { getAnalysisCost, checkBalance, deductCreditsAtomic } from './ncs-credits';
import { logAnalysisUsage } from './activity-logger';
import { getSupabase } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

interface CreditSafeOptions {
    user: User | null;
    analysisKey: string;
    costKey: string;
    logDesc: string;
    /** Called when user has insufficient credits */
    onInsufficientCredits: (cost: number) => void;
    /** Called to update displayed balance */
    onBalanceUpdate: (newBalance: number) => void;
    /** Called on any toast notification */
    onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

/**
 * Wraps an analysis function with pre-deduction and refund-on-failure logic.
 *
 * @returns The analysis result, or throws if analysis failed (credits refunded).
 */
export async function runWithCredits<T>(
    action: () => Promise<T>,
    options: CreditSafeOptions
): Promise<T | null> {
    const { user, analysisKey, costKey, logDesc, onInsufficientCredits, onBalanceUpdate, onToast } = options;

    let cost = 0;
    let creditDeducted = false;

    if (user) {
        cost = await getAnalysisCost(costKey);

        if (cost > 0) {
            const { hasEnough } = await checkBalance(user.id, cost);
            if (!hasEnough) {
                onInsufficientCredits(cost);
                return null;
            }

            // Deduct BEFORE running — atomic via RPC
            const { success, isExempt, newBalance, error: deductError } = await deductCreditsAtomic(user.id, cost, logDesc);
            if (!success) {
                onToast(deductError || 'Không đủ NCS để thực hiện phân tích', 'error');
                return null;
            }
            creditDeducted = true;
            if (!isExempt) onBalanceUpdate(newBalance);
        }
    }

    try {
        const result = await action();

        // Log usage on success (credits already deducted)
        if (user && cost > 0) {
            await logAnalysisUsage(user.id, analysisKey, cost);
        }

        return result;
    } catch (err) {
        // Refund credits if analysis failed after deduction
        if (user && cost > 0 && creditDeducted) {
            try {
                const supabase = getSupabase();
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('tokens')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    const refundedBalance = (profile.tokens || 0) + cost;
                    await supabase
                        .from('profiles')
                        .update({ tokens: refundedBalance, updated_at: new Date().toISOString() })
                        .eq('id', user.id);
                    await supabase.from('token_transactions').insert({
                        user_id: user.id,
                        amount: cost,
                        type: 'refund_analysis',
                        description: `Hoàn tiền: ${analysisKey} thất bại`,
                        balance_after: refundedBalance,
                    });
                    onBalanceUpdate(refundedBalance);
                }
            } catch (refundErr) {
                console.error('[Credits] Refund failed:', refundErr);
            }
        }
        throw err; // Re-throw so caller can show error toast
    }
}
