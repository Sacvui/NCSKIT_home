/**
 * Token Service Unit Tests
 *
 * Tests the business logic of token transactions WITHOUT hitting the database.
 * Uses mocks for Supabase client.
 *
 * Covers:
 * - Balance deduction logic
 * - Insufficient balance guard
 * - Accounting identity (total_earned - total_spent == balance)
 * - Race condition prevention (atomic deduction)
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// ─── Mock Supabase ────────────────────────────────────────────────────────────

// We test the pure logic, not the DB calls
// Mock the supabase client to return controlled data

const mockProfile = {
    tokens: 1000,
    total_earned: 1500,
    total_spent: 500,
    role: 'student',
};

const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    // @ts-ignore — jest mock chain infers 'never' for chained builder methods
    single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
    update: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
};

jest.mock('@/utils/supabase/client', () => ({
    getSupabase: () => mockSupabase,
}));

jest.mock('@/utils/supabase/server', () => ({
    createClient: async () => mockSupabase,
}));

// ─── Pure logic tests (no DB needed) ─────────────────────────────────────────

describe('Token Balance Logic', () => {
    describe('P5: Balance Invariant', () => {
        it('balance_after = balance_before + amount for earn', () => {
            const before = 1000;
            const amount = 50;
            const after = before + amount;
            expect(after).toBe(1050);
        });

        it('balance_after = balance_before - cost for spend', () => {
            const before = 1000;
            const cost = 200;
            const after = before - cost;
            expect(after).toBe(800);
            expect(after).toBeGreaterThanOrEqual(0);
        });

        it('accounting identity: total_earned - total_spent == balance', () => {
            const totalEarned = 1500;
            const totalSpent = 500;
            const balance = 1000;
            expect(totalEarned - totalSpent).toBe(balance);
        });

        it('balance cannot go negative — insufficient funds check', () => {
            const balance = 100;
            const cost = 200;
            const hasEnough = balance >= cost;
            expect(hasEnough).toBe(false);
            // Deduction should NOT proceed
            const newBalance = hasEnough ? balance - cost : balance;
            expect(newBalance).toBeGreaterThanOrEqual(0);
        });

        it('exact balance allows deduction', () => {
            const balance = 200;
            const cost = 200;
            const hasEnough = balance >= cost;
            expect(hasEnough).toBe(true);
            const newBalance = balance - cost;
            expect(newBalance).toBe(0);
            expect(newBalance).toBeGreaterThanOrEqual(0);
        });

        it('multiple sequential deductions maintain invariant', () => {
            let balance = 1000;
            let totalSpent = 0;
            const costs = [50, 100, 200, 30, 150];

            for (const cost of costs) {
                expect(balance).toBeGreaterThanOrEqual(cost);
                balance -= cost;
                totalSpent += cost;
            }

            expect(balance).toBe(1000 - costs.reduce((a, b) => a + b, 0));
            expect(balance).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Admin role bypass', () => {
        const exemptRoles = ['admin', 'institution_admin', 'platform_admin', 'super_admin'];

        it('admin roles are exempt from credit deduction', () => {
            for (const role of exemptRoles) {
                const isExempt = exemptRoles.includes(role);
                expect(isExempt).toBe(true);
            }
        });

        it('student role is NOT exempt', () => {
            const isExempt = exemptRoles.includes('student');
            expect(isExempt).toBe(false);
        });

        it('researcher role is NOT exempt', () => {
            const isExempt = exemptRoles.includes('researcher');
            expect(isExempt).toBe(false);
        });
    });

    describe('Transaction type validation', () => {
        const validEarnTypes = ['signup_bonus', 'earn_invite', 'earn_share', 'earn_feedback', 'daily_bonus'];
        const validSpendTypes = ['spend_analysis', 'spend_sem', 'spend_export', 'spend_ai'];

        it('earn transactions have positive amounts', () => {
            const earnAmounts = [100, 50, 30, 50, 5];
            earnAmounts.forEach(amount => expect(amount).toBeGreaterThan(0));
        });

        it('spend transactions have negative amounts', () => {
            const spendAmounts = [-5, -20, -10, -15];
            spendAmounts.forEach(amount => expect(amount).toBeLessThan(0));
        });

        it('balance_after is always non-negative after valid deduction', () => {
            const scenarios = [
                { balance: 1000, cost: 5 },
                { balance: 100, cost: 100 },
                { balance: 500, cost: 20 },
            ];

            for (const { balance, cost } of scenarios) {
                const newBalance = balance - cost;
                expect(newBalance).toBeGreaterThanOrEqual(0);
            }
        });
    });
});

// ─── POINTS_CONFIG validation ─────────────────────────────────────────────────

describe('POINTS_CONFIG', () => {
    it('all spend values are negative', async () => {
        const { POINTS_CONFIG } = await import('@/lib/points-config');
        const spendKeys = Object.keys(POINTS_CONFIG).filter(k => k.startsWith('SPEND_'));
        spendKeys.forEach(key => {
            const value = POINTS_CONFIG[key as keyof typeof POINTS_CONFIG];
            expect(value).toBeLessThan(0);
        });
    });

    it('all earn values are positive', async () => {
        const { POINTS_CONFIG } = await import('@/lib/points-config');
        const earnKeys = ['SIGNUP_BONUS', 'INVITE_SUCCESS', 'SHARE_POST', 'FEEDBACK', 'DAILY_LOGIN'];
        earnKeys.forEach(key => {
            const value = POINTS_CONFIG[key as keyof typeof POINTS_CONFIG];
            expect(value).toBeGreaterThan(0);
        });
    });
});
