/**
 * Comprehensive WebR Functions Test Suite
 * Tests all statistical analysis functions with real data
 */

import { describe, test, expect, beforeAll } from '@jest/globals';

// Import all analysis functions
import { runDescriptiveStats, validateData } from '../lib/webr/analyses/descriptive';
import { runCronbachAlpha, runEFA, runCFA } from '../lib/webr/analyses/reliability';
import {
    runCorrelation,
    runTTestIndependent,
    runTTestPaired,
    runOneWayANOVA,
    runMannWhitneyU,
    runChiSquare,
    runKruskalWallis,
    runWilcoxonSignedRank
} from '../lib/webr/analyses/hypothesis';
import { runLinearRegression, runLogisticRegression } from '../lib/webr/analyses/regression';
import { runClusterAnalysis, runTwoWayANOVA } from '../lib/webr/analyses/multivariate';
import { runMediationAnalysis, runModerationAnalysis } from '../lib/webr/analyses/mediation';
import { runLavaanAnalysis } from '../lib/webr/analyses/sem';
import { initWebR } from '../lib/webr/core';

// Test data generators
function generateNormalData(n: number, mean: number = 0, sd: number = 1): number[] {
    const data: number[] = [];
    for (let i = 0; i < n; i++) {
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        data.push(mean + z * sd);
    }
    return data;
}

function generateLikertData(n: number, nItems: number, min: number = 1, max: number = 5): number[][] {
    const data: number[][] = [];
    for (let i = 0; i < n; i++) {
        const row: number[] = [];
        for (let j = 0; j < nItems; j++) {
            row.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        data.push(row);
    }
    return data;
}

// Increase timeout for WebR initialization
jest.setTimeout(120000); // 2 minutes

describe('WebR Statistical Functions - Comprehensive Test Suite', () => {

    beforeAll(async () => {
        console.log('🔧 Initializing WebR...');
        await initWebR();
        console.log('✅ WebR initialized successfully');
    });

    // ==================== DESCRIPTIVE STATISTICS ====================
    describe('1. Descriptive Statistics', () => {

        test('1.1 validateData - should pass for valid data', () => {
            const data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
            expect(() => validateData(data, 2, 'Test')).not.toThrow();
        });

        test('1.2 validateData - should throw for empty data', () => {
            expect(() => validateData([], 1, 'Test')).toThrow('Dữ liệu trống');
        });

        test('1.3 validateData - should throw for constant column', () => {
            const data = [[5, 10], [5, 20], [5, 30]];
            expect(() => validateData(data, 1, 'Test')).toThrow('giá trị không đổi');
        });

        test('1.4 runDescriptiveStats - should calculate correct statistics', async () => {
            const data = [
                [10, 20, 30],
                [15, 25, 35],
                [20, 30, 40]
            ];

            const result = await runDescriptiveStats(data);

            expect(result.mean).toHaveLength(3);
            expect(result.mean[0]).toBeCloseTo(15, 1); // Mean of [10, 15, 20]
            expect(result.mean[1]).toBeCloseTo(25, 1); // Mean of [20, 25, 30]
            expect(result.mean[2]).toBeCloseTo(35, 1); // Mean of [30, 35, 40]
            expect(result.N).toEqual([3, 3, 3]);
        });
    });

    // ==================== RELIABILITY ANALYSIS ====================
    describe('2. Reliability Analysis', () => {

        test('2.1 runCronbachAlpha - should calculate alpha correctly', async () => {
            const data = generateLikertData(50, 5, 1, 5);

            const result = await runCronbachAlpha(data, 1, 5);

            expect(result.alpha).toBeGreaterThan(0);
            expect(result.alpha).toBeLessThanOrEqual(1);
            expect(result.nItems).toBe(5);
            expect(result.itemTotalStats).toHaveLength(5);
            expect(result.rCode).toContain('alpha(data');
        });

        test('2.2 runEFA - should run without df_clean error', async () => {
            const data = generateLikertData(100, 6, 1, 5);

            const result = await runEFA(data, 2, 'varimax');

            expect(result.kmo).toBeGreaterThan(0);
            expect(result.loadings).toBeDefined();
            expect(result.eigenvalues).toBeDefined();
            expect(result.nFactorsUsed).toBeGreaterThan(0);
            expect(result.rCode).toContain('df_clean'); // Should have df_clean defined
        });

        test('2.3 runCFA - should run without JSON.stringify error', async () => {
            const data = generateLikertData(100, 6, 1, 5);
            const columns = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'];
            const model = `
                F1 =~ v1 + v2 + v3
                F2 =~ v4 + v5 + v6
            `;

            const result = await runCFA(data, columns, model);

            expect(result.fitMeasures).toBeDefined();
            expect(result.estimates).toBeDefined();
            expect(result.rCode).toContain('colnames');
            expect(result.rCode).not.toContain('["v1"'); // Should not have JSON array syntax
        });
    });

    // ==================== HYPOTHESIS TESTING ====================
    describe('3. Hypothesis Testing', () => {

        test('3.1 runCorrelation - should calculate correlation matrix', async () => {
            const data = [
                [1, 2, 3],
                [2, 4, 6],
                [3, 6, 9],
                [4, 8, 12]
            ];

            const result = await runCorrelation(data, 'pearson');

            expect(result.correlationMatrix).toBeDefined();
            expect(result.correlationMatrix.length).toBe(3);
            expect(result.correlationMatrix[0][0]).toBeCloseTo(1, 1); // Diagonal should be 1
        });

        test('3.2 runTTestIndependent - should detect difference', async () => {
            const group1 = [20, 22, 24, 26, 28]; // Mean = 24
            const group2 = [30, 32, 34, 36, 38]; // Mean = 34

            const result = await runTTestIndependent(group1, group2);

            expect(result.meanDiff).toBeCloseTo(-10, 0);
            expect(result.pValue).toBeLessThan(0.05); // Should be significant
            expect(result.effectSize).toBeGreaterThan(0.8); // Large effect
        });

        test('3.3 runTTestPaired - should detect paired difference', async () => {
            const before = [20, 22, 24, 26, 28];
            const after = [25, 27, 29, 31, 33]; // +5 increase

            const result = await runTTestPaired(before, after);

            expect(result.meanDiff).toBeCloseTo(-5, 0);
            expect(result.pValue).toBeLessThan(0.05);
        });

        test('3.4 runOneWayANOVA - should detect group differences', async () => {
            const group1 = [20, 22, 24, 26, 28];
            const group2 = [30, 32, 34, 36, 38];
            const group3 = [40, 42, 44, 46, 48];

            const result = await runOneWayANOVA([group1, group2, group3]);

            expect(result.F).toBeGreaterThan(10); // Large F-statistic
            expect(result.pValue).toBeLessThan(0.001); // Highly significant
            expect(result.postHoc).toBeDefined();
        });

        test('3.5 runMannWhitneyU - non-parametric test', async () => {
            const group1 = [1, 2, 3, 4, 5];
            const group2 = [6, 7, 8, 9, 10];

            const result = await runMannWhitneyU(group1, group2);

            expect(result.statistic).toBeGreaterThan(0);
            expect(result.pValue).toBeLessThan(0.05);
        });

        test('3.6 runChiSquare - categorical association', async () => {
            const data = [
                ['Yes', 'Male'],
                ['Yes', 'Male'],
                ['Yes', 'Male'],
                ['No', 'Female'],
                ['No', 'Female'],
                ['No', 'Female']
            ];

            const result = await runChiSquare(data);

            expect(result.statistic).toBeGreaterThan(0);
            expect(result.cramersV).toBeGreaterThanOrEqual(0);
            expect(result.cramersV).toBeLessThanOrEqual(1);
        });
    });

    // ==================== REGRESSION ANALYSIS ====================
    describe('4. Regression Analysis', () => {

        test('4.1 runLinearRegression - should estimate coefficients', async () => {
            // Y = 2 + 3*X1 + 5*X2
            const data = [
                [17, 1, 3],  // Y, X1, X2
                [22, 2, 4],
                [27, 3, 5],
                [32, 4, 6],
                [37, 5, 7]
            ];
            const names = ['Y', 'X1', 'X2'];

            const result = await runLinearRegression(data, names);

            expect(result.coefficients).toHaveLength(3); // Intercept + 2 predictors
            expect(result.modelFit.rSquared).toBeGreaterThan(0.9); // Excellent fit
            expect(result.coefficients[0].term).toBe('(Intercept)');
            expect(result.coefficients[1].vif).toBeDefined();
        });

        test('4.2 runLogisticRegression - binary outcome', async () => {
            const data = [
                [0, 1, 2],
                [0, 2, 3],
                [0, 3, 4],
                [1, 5, 6],
                [1, 6, 7],
                [1, 7, 8]
            ];
            const names = ['Y', 'X1', 'X2'];

            const result = await runLogisticRegression(data, names);

            expect(result.coefficients).toBeDefined();
            expect(result.coefficients[0].oddsRatio).toBeGreaterThan(0);
            expect(result.modelFit.mcfaddenR2).toBeGreaterThan(0);
            expect(result.confusionMatrix).toBeDefined();
        });
    });

    // ==================== MULTIVARIATE ANALYSIS ====================
    describe('5. Multivariate Analysis', () => {

        test('5.1 runClusterAnalysis - K-Means clustering', async () => {
            // Create 2 clear clusters
            const cluster1 = [[1, 1], [2, 2], [1.5, 1.5]];
            const cluster2 = [[10, 10], [11, 11], [10.5, 10.5]];
            const data = [...cluster1, ...cluster2];
            const columns = ['X', 'Y'];

            const result = await runClusterAnalysis(data, 2, 'kmeans', columns);

            expect(result.clusters).toHaveLength(6);
            expect(result.centers).toHaveLength(2);
            expect(result.size).toHaveLength(2);
            expect(result.betweensSS / result.totalSS).toBeGreaterThan(0.8); // High separation
        });

        test('5.2 runTwoWayANOVA - interaction effects', async () => {
            const y = [20, 22, 30, 32, 40, 42, 50, 52];
            const f1 = ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B'];
            const f2 = ['X', 'X', 'Y', 'Y', 'X', 'X', 'Y', 'Y'];

            const result = await runTwoWayANOVA(y, f1, f2, 'Factor1', 'Factor2', 'Outcome');

            expect(result.table).toBeDefined();
            expect(result.table.length).toBeGreaterThan(0);
            // interactionPlot not returned — table contains all ANOVA sources including interaction
        });
    });

    // ==================== MEDIATION & MODERATION ====================
    describe('6. Mediation & Moderation', () => {

        test('6.1 runMediationAnalysis - indirect effects', async () => {
            // X -> M -> Y
            const data = [
                [1, 2, 3],
                [2, 3, 4],
                [3, 4, 5],
                [4, 5, 6],
                [5, 6, 7]
            ];
            const columns = ['X', 'M', 'Y'];

            const result = await runMediationAnalysis(data, columns, 'X', 'M', 'Y', 100);

            expect(result.paths.a).toBeDefined();
            expect(result.paths.b).toBeDefined();
            expect(result.paths.c).toBeDefined();
            expect(result.bootstrap).toBeDefined();
        });

        test('6.2 runModerationAnalysis - interaction', async () => {
            const data = [
                [10, 1, 1],
                [15, 2, 1],
                [25, 1, 2],
                [35, 2, 2],
                [12, 1.5, 1],
                [30, 1.5, 2]
            ];
            const columns = ['Y', 'X', 'M'];

            const result = await runModerationAnalysis(data, columns, 'X', 'M', 'Y');

            expect(result.coefficients).toBeDefined();
            expect(result.slopes).toBeDefined();
            expect(result.slopes).toHaveLength(3); // -1 SD, Mean, +1 SD
        });
    });

    // ==================== SEM ====================
    describe('7. SEM (Structural Equation Modeling)', () => {

        test('7.1 runLavaanAnalysis - should run without JSON.stringify error', async () => {
            const data = generateLikertData(100, 6, 1, 5);
            const columns = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'];
            const model = `
                F1 =~ v1 + v2 + v3
                F2 =~ v4 + v5 + v6
            `;

            const result = await runLavaanAnalysis(data, columns, model);

            expect(result.fitMeasures).toBeDefined();
            expect(result.fitMeasures.cfi).toBeGreaterThanOrEqual(0);
            expect(result.fitMeasures.cfi).toBeLessThanOrEqual(1);
            expect(result.estimates).toBeDefined();
            expect(result.rCode).toContain('colnames');
            expect(result.rCode).not.toContain('["v1"'); // Should not have JSON array
        });
    });
});

// Export for manual testing
export { generateNormalData, generateLikertData };
