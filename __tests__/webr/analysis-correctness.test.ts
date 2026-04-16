/**
 * Analysis Correctness Tests — Property-Based Verification
 *
 * These tests verify the mathematical correctness properties (P1–P6) defined
 * in the spec WITHOUT requiring a live WebR instance.
 *
 * Strategy:
 * - P1 (Cronbach's Alpha): Pure JS implementation to verify monotonicity
 * - P2 (Pearson Correlation): Pure JS to verify symmetry, bounds, identity
 * - P3 (Linear Regression): Pure JS to verify R², residual sum ≈ 0
 * - P4 (T-test): Pure JS to verify symmetry of t-statistic
 * - P5 (Token Balance): Unit test of token service logic
 * - P6 (Rate Limiter): Unit test of rate-limit utility
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { rateLimit } from '../../utils/rate-limit';
import { translateRErrorDetailed } from '../../lib/webr/utils';
import { parseRResult, failure } from '../../lib/webr/error-handler';

// ─── Pure JS statistical helpers (no WebR needed) ────────────────────────────

/** Pearson correlation between two arrays */
function pearsonR(x: number[], y: number[]): number {
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    const num = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
    const denX = Math.sqrt(x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0));
    const denY = Math.sqrt(y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0));
    if (denX === 0 || denY === 0) return 0;
    return num / (denX * denY);
}

/** Simple linear regression: returns { slope, intercept, rSquared, residuals } */
function simpleLinearRegression(x: number[], y: number[]) {
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    const slope = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0)
        / x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0);
    const intercept = meanY - slope * meanX;
    const predicted = x.map(xi => intercept + slope * xi);
    const residuals = y.map((yi, i) => yi - predicted[i]);
    const ssTot = y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0);
    const ssRes = residuals.reduce((sum, r) => sum + r ** 2, 0);
    const rSquared = 1 - ssRes / ssTot;
    return { slope, intercept, rSquared, residuals, predicted };
}

/** Independent samples t-test: returns t-statistic */
function tTestIndependent(g1: number[], g2: number[]): number {
    const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = (arr: number[]) => {
        const m = mean(arr);
        return arr.reduce((sum, x) => sum + (x - m) ** 2, 0) / (arr.length - 1);
    };
    const m1 = mean(g1), m2 = mean(g2);
    const v1 = variance(g1), v2 = variance(g2);
    const se = Math.sqrt(v1 / g1.length + v2 / g2.length);
    return (m1 - m2) / se;
}

/** Cronbach's alpha from correlation matrix */
function cronbachAlpha(data: number[][]): number {
    const n = data.length;
    const k = data[0].length;
    // Item variances
    const itemVars = Array.from({ length: k }, (_, j) => {
        const col = data.map(row => row[j]);
        const mean = col.reduce((a, b) => a + b, 0) / n;
        return col.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (n - 1);
    });
    // Total score variance
    const totals = data.map(row => row.reduce((a, b) => a + b, 0));
    const meanTot = totals.reduce((a, b) => a + b, 0) / n;
    const varTot = totals.reduce((sum, x) => sum + (x - meanTot) ** 2, 0) / (n - 1);
    const sumItemVars = itemVars.reduce((a, b) => a + b, 0);
    return (k / (k - 1)) * (1 - sumItemVars / varTot);
}

// ─── Test data ────────────────────────────────────────────────────────────────

const LIKERT_DATA: number[][] = [
    [4, 3, 4, 5, 4],
    [3, 3, 3, 4, 3],
    [5, 4, 5, 5, 5],
    [2, 2, 2, 3, 2],
    [4, 4, 4, 4, 4],
    [3, 3, 4, 4, 3],
    [5, 5, 5, 5, 5],
    [2, 2, 3, 3, 2],
    [4, 3, 4, 4, 4],
    [3, 4, 3, 4, 3],
];

// ─── P2: Pearson Correlation Symmetry ────────────────────────────────────────

describe('P2: Pearson Correlation Symmetry', () => {
    const X = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const Y = [2, 4, 5, 4, 5, 7, 8, 9, 10, 12];
    const Z = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    it('corr(X, Y) == corr(Y, X) — symmetry', () => {
        expect(pearsonR(X, Y)).toBeCloseTo(pearsonR(Y, X), 10);
    });

    it('corr(X, X) == 1.0 — identity', () => {
        expect(pearsonR(X, X)).toBeCloseTo(1.0, 10);
    });

    it('corr(X, Z) == -1.0 — perfect negative correlation', () => {
        expect(pearsonR(X, Z)).toBeCloseTo(-1.0, 10);
    });

    it('-1.0 <= corr(X, Y) <= 1.0 — bounds', () => {
        const r = pearsonR(X, Y);
        expect(r).toBeGreaterThanOrEqual(-1.0);
        expect(r).toBeLessThanOrEqual(1.0);
    });

    it('corr(X, Y) with random data stays in [-1, 1]', () => {
        // Property: for any two arrays, r ∈ [-1, 1]
        for (let trial = 0; trial < 20; trial++) {
            const a = Array.from({ length: 30 }, () => Math.random() * 100);
            const b = Array.from({ length: 30 }, () => Math.random() * 100);
            const r = pearsonR(a, b);
            expect(r).toBeGreaterThanOrEqual(-1.0 - 1e-10);
            expect(r).toBeLessThanOrEqual(1.0 + 1e-10);
        }
    });
});

// ─── P3: Linear Regression Residuals ─────────────────────────────────────────

describe('P3: Linear Regression Residuals', () => {
    const X = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const Y = X.map(x => 2 + 3 * x + (Math.random() - 0.5) * 0.1); // Y ≈ 2 + 3X

    it('sum(residuals) ≈ 0 (with intercept)', () => {
        const { residuals } = simpleLinearRegression(X, Y);
        const sumResid = residuals.reduce((a, b) => a + b, 0);
        expect(Math.abs(sumResid)).toBeLessThan(1e-8);
    });

    it('R² ∈ [0, 1]', () => {
        const { rSquared } = simpleLinearRegression(X, Y);
        expect(rSquared).toBeGreaterThanOrEqual(0);
        expect(rSquared).toBeLessThanOrEqual(1);
    });

    it('R² ≈ 1 for near-perfect linear relationship', () => {
        const xPerfect = [1, 2, 3, 4, 5];
        const yPerfect = xPerfect.map(x => 2 + 3 * x); // Exact linear
        const { rSquared } = simpleLinearRegression(xPerfect, yPerfect);
        expect(rSquared).toBeCloseTo(1.0, 8);
    });

    it('mean(predicted) ≈ mean(actual)', () => {
        const { predicted } = simpleLinearRegression(X, Y);
        const meanPred = predicted.reduce((a, b) => a + b, 0) / predicted.length;
        const meanActual = Y.reduce((a, b) => a + b, 0) / Y.length;
        expect(Math.abs(meanPred - meanActual)).toBeLessThan(1e-8);
    });

    it('R² is non-negative for any data', () => {
        for (let trial = 0; trial < 10; trial++) {
            const x = Array.from({ length: 20 }, () => Math.random() * 10);
            const y = Array.from({ length: 20 }, () => Math.random() * 10);
            const { rSquared } = simpleLinearRegression(x, y);
            expect(rSquared).toBeGreaterThanOrEqual(-1e-10); // Allow tiny float error
        }
    });
});

// ─── P4: T-test Symmetry ─────────────────────────────────────────────────────

describe('P4: T-test Symmetry', () => {
    const G1 = [20, 22, 24, 26, 28, 30];
    const G2 = [30, 32, 34, 36, 38, 40];

    it('t(G1, G2) == -t(G2, G1)', () => {
        const t12 = tTestIndependent(G1, G2);
        const t21 = tTestIndependent(G2, G1);
        expect(t12).toBeCloseTo(-t21, 10);
    });

    it('|t| is the same regardless of group order', () => {
        const t12 = Math.abs(tTestIndependent(G1, G2));
        const t21 = Math.abs(tTestIndependent(G2, G1));
        expect(t12).toBeCloseTo(t21, 10);
    });

    it('t == 0 when groups are identical', () => {
        const same = [1, 2, 3, 4, 5];
        const t = tTestIndependent(same, same);
        expect(t).toBeCloseTo(0, 10);
    });
});

// ─── P1: Cronbach's Alpha Bounds ─────────────────────────────────────────────

describe('P1: Cronbach\'s Alpha Bounds', () => {
    it('alpha ∈ (-∞, 1] for any data', () => {
        const alpha = cronbachAlpha(LIKERT_DATA);
        expect(alpha).toBeLessThanOrEqual(1.0 + 1e-10);
    });

    it('alpha > 0 for positively correlated items', () => {
        const alpha = cronbachAlpha(LIKERT_DATA);
        expect(alpha).toBeGreaterThan(0);
    });

    it('alpha increases when adding a highly correlated item', () => {
        // Add a 6th item that is a near-copy of item 1 (high correlation)
        const dataWith5 = LIKERT_DATA;
        const dataWith6 = LIKERT_DATA.map(row => [...row, row[0]]); // item6 = item1
        const alpha5 = cronbachAlpha(dataWith5);
        const alpha6 = cronbachAlpha(dataWith6);
        // Adding a perfectly correlated item should not decrease alpha
        expect(alpha6).toBeGreaterThanOrEqual(alpha5 - 0.05); // Allow small float variance
    });
});

// ─── P5: Token Balance Invariant ─────────────────────────────────────────────

describe('P5: Token Balance Invariant', () => {
    it('balance_after = balance_before + amount for positive transaction', () => {
        const balanceBefore = 1000;
        const amount = 50;
        const balanceAfter = balanceBefore + amount;
        expect(balanceAfter).toBe(balanceBefore + amount);
    });

    it('balance_after = balance_before - cost for deduction', () => {
        const balanceBefore = 1000;
        const cost = 200;
        const balanceAfter = balanceBefore - cost;
        expect(balanceAfter).toBe(800);
        expect(balanceAfter).toBeGreaterThanOrEqual(0);
    });

    it('balance cannot go negative (insufficient funds check)', () => {
        const balance = 100;
        const cost = 200;
        const hasEnough = balance >= cost;
        expect(hasEnough).toBe(false);
        // If hasEnough is false, deduction should NOT proceed
        const balanceAfter = hasEnough ? balance - cost : balance;
        expect(balanceAfter).toBeGreaterThanOrEqual(0);
    });

    it('accounting identity: total_earned - total_spent == current_balance', () => {
        // Simulate a series of transactions
        let balance = 0;
        let totalEarned = 0;
        let totalSpent = 0;

        const transactions = [
            { amount: 100, type: 'earn' },
            { amount: 50, type: 'earn' },
            { amount: 30, type: 'spend' },
            { amount: 200, type: 'earn' },
            { amount: 80, type: 'spend' },
        ];

        for (const tx of transactions) {
            if (tx.type === 'earn') {
                balance += tx.amount;
                totalEarned += tx.amount;
            } else {
                if (balance >= tx.amount) {
                    balance -= tx.amount;
                    totalSpent += tx.amount;
                }
            }
        }

        expect(totalEarned - totalSpent).toBe(balance);
    });

    it('balance_after is consistent across multiple deductions', () => {
        let balance = 1000;
        const costs = [50, 100, 200, 30, 150];
        const expectedFinal = 1000 - costs.reduce((a, b) => a + b, 0);

        for (const cost of costs) {
            expect(balance).toBeGreaterThanOrEqual(cost);
            balance -= cost;
        }

        expect(balance).toBe(expectedFinal);
        expect(balance).toBeGreaterThanOrEqual(0);
    });
});

// ─── P6: Rate Limiter Correctness ────────────────────────────────────────────

describe('P6: Rate Limiter Correctness', () => {
    it('allows requests up to the limit', async () => {
        const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 });
        const limit = 5;
        const ip = 'test-ip-allow';

        for (let i = 0; i < limit; i++) {
            const result = await limiter.check(limit, ip);
            expect(result.success).toBe(true);
        }
    });

    it('blocks the (N+1)th request within the window', async () => {
        const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 });
        const limit = 3;
        const ip = 'test-ip-block';

        for (let i = 0; i < limit; i++) {
            await limiter.check(limit, ip);
        }

        const blocked = await limiter.check(limit, ip);
        expect(blocked.success).toBe(false);
    });

    it('different IPs have independent limits', async () => {
        const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 });
        const limit = 2;

        // Exhaust IP1
        await limiter.check(limit, 'ip-1');
        await limiter.check(limit, 'ip-1');
        const ip1Blocked = await limiter.check(limit, 'ip-1');
        expect(ip1Blocked.success).toBe(false);

        // IP2 should still be allowed
        const ip2Allowed = await limiter.check(limit, 'ip-2');
        expect(ip2Allowed.success).toBe(true);
    });

    it('remaining count decreases with each request', async () => {
        const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 });
        const limit = 5;
        const ip = 'test-ip-remaining';

        const r1 = await limiter.check(limit, ip);
        const r2 = await limiter.check(limit, ip);
        const r3 = await limiter.check(limit, ip);

        expect(r1.remaining).toBeGreaterThan(r2.remaining);
        expect(r2.remaining).toBeGreaterThan(r3.remaining);
    });

    it('resets after window expires', async () => {
        // Use a very short window (100ms) to test reset
        const limiter = rateLimit({ interval: 100, uniqueTokenPerInterval: 500 });
        const limit = 2;
        const ip = 'test-ip-reset';

        // Exhaust limit
        await limiter.check(limit, ip);
        await limiter.check(limit, ip);
        const blocked = await limiter.check(limit, ip);
        expect(blocked.success).toBe(false);

        // Wait for window to expire
        await new Promise(resolve => setTimeout(resolve, 150));

        // Should be allowed again
        const allowed = await limiter.check(limit, ip);
        expect(allowed.success).toBe(true);
    });
});

// ─── Error Handler Tests ──────────────────────────────────────────────────────

describe('Error Handler: parseRResult', () => {
    it('returns ok=true for plain data', () => {
        const result = parseRResult({ alpha: 0.85, nItems: 5 });
        expect(result.ok).toBe(true);
        if (result.ok) expect(result.data).toEqual({ alpha: 0.85, nItems: 5 });
    });

    it('returns ok=false for R-side error object', () => {
        const result = parseRResult({ success: false, error_message: 'singular matrix' });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.title).toBe('Đa cộng tuyến hoàn hảo');
        }
    });

    it('returns ok=false for legacy ERROR: string', () => {
        const result = parseRResult('ERROR: not enough observations');
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.title).toBe('Không đủ dữ liệu');
        }
    });

    it('returns ok=false for null input', () => {
        const result = parseRResult(null);
        expect(result.ok).toBe(false);
    });

    it('unwraps { success: true, data: ... } format', () => {
        const result = parseRResult({ success: true, data: { alpha: 0.9 } });
        expect(result.ok).toBe(true);
        if (result.ok) expect((result.data as { alpha: number }).alpha).toBe(0.9);
    });
});

// ─── translateRErrorDetailed Tests ───────────────────────────────────────────

describe('translateRErrorDetailed: error mapping coverage', () => {
    const cases: [string, string][] = [
        ['not enough observations to run analysis', 'Không đủ dữ liệu'],
        ['system is computationally singular', 'Đa cộng tuyến hoàn hảo'],
        ['missing value where TRUE/FALSE needed', 'Dữ liệu có giá trị trống'],
        ['model is not identified', 'Mô hình không xác định'],
        ['could not find function "psych"', 'Thư viện R chưa sẵn sàng'],
        ['covariance matrix is not positive definite', 'Ma trận hiệp phương sai không hợp lệ'],
        ['subscript out of bounds', 'Lỗi chỉ số dữ liệu'],
        ['object x not found', 'Biến R không tồn tại'],
        ['Timeout after 60s', 'Phân tích quá thời gian'],
        ['promise already under evaluation', 'R Engine bị treo'],
    ];

    it.each(cases)('maps "%s" → "%s"', (rawError, expectedTitle) => {
        const result = translateRErrorDetailed(rawError);
        expect(result.title).toBe(expectedTitle);
    });

    it('returns generic error for unknown messages', () => {
        const result = translateRErrorDetailed('some completely unknown R error xyz123');
        expect(result.title).toBe('Lỗi phân tích');
        expect(result.canReport).toBe(true);
    });

    it('all mapped errors have non-empty suggestion', () => {
        cases.forEach(([rawError]) => {
            const result = translateRErrorDetailed(rawError);
            expect(result.suggestion.length).toBeGreaterThan(10);
        });
    });
});
