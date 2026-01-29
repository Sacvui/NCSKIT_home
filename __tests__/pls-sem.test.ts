/**
 * PLS-SEM Functions Test Suite
 * Tests all 10 PLS-SEM analysis functions
 */

import { describe, test, expect, beforeAll } from '@jest/globals';
import { initWebR } from '../lib/webr/core';
import {
    runMcDonaldOmega,
    runOutlierDetection,
    runHTMTMatrix,
    runVIFCheck,
    runPLSSEM,
    runBootstrapping,
    runMediationModeration,
    runIPMA,
    runMGA,
    runBlindfolding
} from '../lib/webr/pls-sem';

// Test data generators
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

function generateCorrelatedData(n: number, nVars: number, correlation: number = 0.7): number[][] {
    const data: number[][] = [];
    for (let i = 0; i < n; i++) {
        const row: number[] = [];
        const base = Math.random() * 10;
        for (let j = 0; j < nVars; j++) {
            const noise = (Math.random() - 0.5) * 2 * (1 - correlation);
            row.push(base * correlation + noise * 10);
        }
        data.push(row);
    }
    return data;
}

// Increase timeout for WebR initialization
jest.setTimeout(120000); // 2 minutes

describe('PLS-SEM Functions - Comprehensive Test Suite', () => {

    beforeAll(async () => {
        console.log('🔧 Initializing WebR for PLS-SEM tests...');
        await initWebR();
        console.log('✅ WebR initialized successfully');
    });

    // ==================== PHASE 1: FOUNDATION ====================
    describe('Phase 1: Foundation (Cleaning & Reliability)', () => {

        test('1.1 runMcDonaldOmega - should calculate omega correctly', async () => {
            const data = generateLikertData(100, 5, 1, 5);
            const columns = ['item1', 'item2', 'item3', 'item4', 'item5'];

            const result = await runMcDonaldOmega(data, columns, 'TestScale');

            // Check basic structure
            expect(result.omega).toBeDefined();
            expect(result.omega_h).toBeDefined();
            expect(result.alpha).toBeDefined();

            // Check ranges
            expect(result.omega).toBeGreaterThanOrEqual(0);
            expect(result.omega).toBeLessThanOrEqual(1);
            expect(result.alpha).toBeGreaterThanOrEqual(0);
            expect(result.alpha).toBeLessThanOrEqual(1);

            // Check metadata
            expect(result.nItems).toBe(5);
            expect(result.scaleName).toBe('TestScale');
            expect(result.columns).toEqual(columns);

            // Check R code
            expect(result.rCode).toContain('omega(');
            expect(result.rCode).toContain('alpha(');
        });

        test('1.2 runMcDonaldOmega - should handle high reliability data', async () => {
            // Create highly correlated items (high reliability)
            const data = generateCorrelatedData(100, 5, 0.9);
            const columns = ['v1', 'v2', 'v3', 'v4', 'v5'];

            const result = await runMcDonaldOmega(data, columns, 'HighReliability');

            expect(result.omega).toBeGreaterThan(0.7); // Good reliability
            expect(result.alpha).toBeGreaterThan(0.7);
        });

        test('1.3 runOutlierDetection - should detect outliers', async () => {
            const data = generateLikertData(50, 4, 1, 5);
            // Add clear outliers
            data.push([100, 100, 100, 100]); // Extreme outlier
            data.push([0, 0, 0, 0]); // Another outlier

            const columns = ['v1', 'v2', 'v3', 'v4'];

            const result = await runOutlierDetection(data, columns);

            // Check structure
            expect(result.outliers).toBeDefined();
            expect(result.mahalanobisDistances).toBeDefined();
            expect(result.threshold).toBeDefined();

            // Should detect at least the 2 outliers we added
            expect(result.outliers.length).toBeGreaterThanOrEqual(2);

            // Check metadata
            expect(result.nOutliers).toBe(result.outliers.length);
            expect(result.percentOutliers).toBeGreaterThan(0);
            expect(result.columns).toEqual(columns);

            // Check R code
            expect(result.rCode).toContain('mahalanobis');
        });

        test('1.4 runOutlierDetection - should handle clean data', async () => {
            const data = generateLikertData(50, 4, 2, 4); // Narrow range, no outliers
            const columns = ['v1', 'v2', 'v3', 'v4'];

            const result = await runOutlierDetection(data, columns);

            // Should detect few or no outliers
            expect(result.percentOutliers).toBeLessThan(10); // Less than 10%
        });
    });

    // ==================== PHASE 2: MEASUREMENT MODEL ====================
    describe('Phase 2: Measurement Model Validation', () => {

        test('2.1 runHTMTMatrix - should calculate HTMT correctly', async () => {
            const data = generateLikertData(100, 6, 1, 5);
            const factorStructure = {
                'Factor1': ['v1', 'v2', 'v3'],
                'Factor2': ['v4', 'v5', 'v6']
            };
            const threshold = 0.85;

            const result = await runHTMTMatrix(data, factorStructure, threshold);

            // Check structure
            expect(result.htmtMatrix).toBeDefined();
            expect(result.htmtMatrix).toHaveLength(2); // 2 factors
            expect(result.htmtMatrix[0]).toHaveLength(2);

            // Check diagonal (should be 1 or undefined)
            expect(result.htmtMatrix[0][0]).toBeUndefined(); // Self-correlation

            // Check threshold
            expect(result.threshold).toBe(0.85);

            // Check discriminant validity
            expect(result.discriminantValidity).toBeDefined();
            expect(typeof result.discriminantValidity).toBe('boolean');

            // Check problematic pairs
            expect(result.problematicPairs).toBeDefined();
            expect(Array.isArray(result.problematicPairs)).toBe(true);

            // Check metadata
            expect(result.factorNames).toEqual(['Factor1', 'Factor2']);

            // Check R code
            expect(result.rCode).toContain('cor(');
        });

        test('2.2 runHTMTMatrix - should detect discriminant validity issues', async () => {
            // Create highly correlated factors (poor discriminant validity)
            const data = generateCorrelatedData(100, 6, 0.95);
            const factorStructure = {
                'F1': ['v1', 'v2', 'v3'],
                'F2': ['v4', 'v5', 'v6']
            };

            const result = await runHTMTMatrix(data, factorStructure, 0.85);

            // With high correlation, might have discriminant validity issues
            if (!result.discriminantValidity) {
                expect(result.problematicPairs.length).toBeGreaterThan(0);
            }
        });

        test('2.3 runVIFCheck - should calculate VIF correctly', async () => {
            const data = generateLikertData(100, 4, 1, 5);
            const dependentVar = 'Y';
            const independentVars = ['X1', 'X2', 'X3'];

            const result = await runVIFCheck(data, dependentVar, independentVars);

            // Check structure
            expect(result.vifValues).toBeDefined();
            expect(result.vifValues).toHaveLength(3);

            // Check each VIF entry
            result.vifValues.forEach(vif => {
                expect(vif.variable).toBeDefined();
                expect(vif.vif).toBeGreaterThan(0);
                expect(vif.tolerance).toBeGreaterThan(0);
                expect(vif.tolerance).toBeLessThanOrEqual(1);
                expect(vif.status).toMatch(/Good|Acceptable|Problematic/);
            });

            // Check summary
            expect(result.maxVIF).toBeGreaterThan(0);
            expect(result.hasMulticollinearity).toBeDefined();
            expect(typeof result.hasMulticollinearity).toBe('boolean');

            // Check metadata
            expect(result.dependentVar).toBe('Y');
            expect(result.independentVars).toEqual(independentVars);

            // Check R code
            expect(result.rCode).toContain('vif(');
        });

        test('2.4 runVIFCheck - should detect multicollinearity', async () => {
            // Create highly correlated predictors
            const data = generateCorrelatedData(100, 4, 0.95);
            const dependentVar = 'Y';
            const independentVars = ['X1', 'X2', 'X3'];

            const result = await runVIFCheck(data, dependentVar, independentVars);

            // With high correlation, should detect multicollinearity
            expect(result.maxVIF).toBeGreaterThan(5); // Likely high VIF

            // At least one variable should be problematic
            const problematic = result.vifValues.filter(v => v.status === 'Problematic');
            expect(problematic.length).toBeGreaterThan(0);
        });
    });

    // ==================== PHASE 3: STRUCTURAL MODEL ====================
    describe('Phase 3: Structural Model (Advanced)', () => {

        test('3.1 runBootstrapping - should perform bootstrap', async () => {
            const data = generateLikertData(50, 3, 1, 5);
            const columns = ['X', 'M', 'Y'];
            const nBootstrap = 100; // Small number for testing

            const result = await runBootstrapping(data, columns, nBootstrap);

            // Check structure
            expect(result.bootstrapResults).toBeDefined();
            expect(result.confidenceIntervals).toBeDefined();

            // Check CI structure
            result.confidenceIntervals.forEach(ci => {
                expect(ci.parameter).toBeDefined();
                expect(ci.original).toBeDefined();
                expect(ci.lower).toBeDefined();
                expect(ci.upper).toBeDefined();
                expect(ci.lower).toBeLessThanOrEqual(ci.upper);
            });

            // Check metadata
            expect(result.nBootstrap).toBe(nBootstrap);
            expect(result.columns).toEqual(columns);

            // Check R code
            expect(result.rCode).toContain('boot(');
        });

        test('3.2 runMediationModeration - should analyze mediation', async () => {
            const data = generateLikertData(100, 3, 1, 5);
            const columns = ['X', 'M', 'Y'];
            const iv = 'X';
            const mediator = 'M';
            const dv = 'Y';

            const result = await runMediationModeration(data, columns, iv, mediator, dv);

            // Check paths
            expect(result.paths).toBeDefined();
            expect(result.paths.a).toBeDefined(); // X -> M
            expect(result.paths.b).toBeDefined(); // M -> Y
            expect(result.paths.c).toBeDefined(); // X -> Y (total)
            expect(result.paths.cPrime).toBeDefined(); // X -> Y (direct)

            // Check indirect effect
            expect(result.indirectEffect).toBeDefined();
            expect(result.indirectEffect.estimate).toBeDefined();

            // Check mediation type
            expect(result.mediationType).toMatch(/Full|Partial|None/);

            // Check R code
            expect(result.rCode).toContain('lm(');
        });

        test('3.3 runPLSSEM - should run basic PLS-SEM', async () => {
            const data = generateLikertData(100, 6, 1, 5);
            const measurementModel = {
                'LV1': ['v1', 'v2', 'v3'],
                'LV2': ['v4', 'v5', 'v6']
            };
            const structuralModel = [
                { from: 'LV1', to: 'LV2' }
            ];

            const result = await runPLSSEM(data, measurementModel, structuralModel);

            // Check structure
            expect(result.loadings).toBeDefined();
            expect(result.pathCoefficients).toBeDefined();
            expect(result.rSquared).toBeDefined();

            // Check R² range
            Object.values(result.rSquared).forEach(r2 => {
                expect(r2).toBeGreaterThanOrEqual(0);
                expect(r2).toBeLessThanOrEqual(1);
            });

            // Check R code
            expect(result.rCode).toBeDefined();
        });
    });

    // ==================== PHASE 4: ADVANCED ANALYSIS ====================
    describe('Phase 4: Advanced Analysis', () => {

        test('4.1 runIPMA - should calculate importance-performance', async () => {
            const data = generateLikertData(100, 4, 1, 5);
            const targetConstruct = 'Performance';
            const predictors = ['Quality', 'Price', 'Service'];

            const result = await runIPMA(data, targetConstruct, predictors);

            // Check structure
            expect(result.ipmaMatrix).toBeDefined();
            expect(result.ipmaMatrix).toHaveLength(3);

            // Check each entry
            result.ipmaMatrix.forEach(entry => {
                expect(entry.construct).toBeDefined();
                expect(entry.importance).toBeDefined();
                expect(entry.performance).toBeDefined();
                expect(entry.performance).toBeGreaterThanOrEqual(0);
                expect(entry.performance).toBeLessThanOrEqual(100);
            });

            // Check metadata
            expect(result.targetConstruct).toBe('Performance');

            // Check R code
            expect(result.rCode).toContain('cor(');
        });

        test('4.2 runMGA - should perform multi-group analysis', async () => {
            const group1Data = generateLikertData(50, 3, 1, 5);
            const group2Data = generateLikertData(50, 3, 1, 5);
            const columns = ['X', 'M', 'Y'];

            const result = await runMGA(group1Data, group2Data, columns);

            // Check structure
            expect(result.group1Results).toBeDefined();
            expect(result.group2Results).toBeDefined();
            expect(result.differences).toBeDefined();

            // Check differences
            result.differences.forEach(diff => {
                expect(diff.path).toBeDefined();
                expect(diff.group1Coef).toBeDefined();
                expect(diff.group2Coef).toBeDefined();
                expect(diff.difference).toBeDefined();
                expect(diff.pValue).toBeDefined();
            });

            // Check R code
            expect(result.rCode).toContain('lm(');
        });

        test('4.3 runBlindfolding - should calculate Q²', async () => {
            const data = generateLikertData(100, 4, 1, 5);
            const measurementModel = {
                'LV1': ['v1', 'v2'],
                'LV2': ['v3', 'v4']
            };
            const targetConstruct = 'LV2';
            const omissionDistance = 7;

            const result = await runBlindfolding(data, measurementModel, targetConstruct, omissionDistance);

            // Check structure
            expect(result.qSquared).toBeDefined();
            expect(result.qSquared).toBeGreaterThan(-1); // Q² can be negative

            // Check predictive relevance
            expect(result.predictiveRelevance).toMatch(/Good|Moderate|Poor/);

            // Check metadata
            expect(result.targetConstruct).toBe('LV2');
            expect(result.omissionDistance).toBe(7);

            // Check R code
            expect(result.rCode).toBeDefined();
        });
    });

    // ==================== ERROR HANDLING ====================
    describe('Error Handling', () => {

        test('5.1 Should handle empty data', async () => {
            const data: number[][] = [];
            const columns = ['v1', 'v2'];

            await expect(
                runMcDonaldOmega(data, columns, 'Test')
            ).rejects.toThrow();
        });

        test('5.2 Should handle insufficient data', async () => {
            const data = [[1, 2], [3, 4]]; // Only 2 rows
            const columns = ['v1', 'v2'];

            await expect(
                runMcDonaldOmega(data, columns, 'Test')
            ).rejects.toThrow();
        });

        test('5.3 Should handle mismatched columns', async () => {
            const data = generateLikertData(50, 3, 1, 5);
            const columns = ['v1', 'v2']; // Only 2 columns for 3-column data

            await expect(
                runMcDonaldOmega(data, columns, 'Test')
            ).rejects.toThrow();
        });
    });

    // ==================== INTEGRATION TESTS ====================
    describe('Integration Tests', () => {

        test('6.1 Complete PLS-SEM workflow', async () => {
            // Generate data
            const data = generateLikertData(100, 9, 1, 5);

            // Step 1: Check reliability (Omega)
            const omegaResult = await runMcDonaldOmega(
                data.map(row => row.slice(0, 3)),
                ['v1', 'v2', 'v3'],
                'Construct1'
            );
            expect(omegaResult.omega).toBeGreaterThan(0);

            // Step 2: Check outliers
            const outlierResult = await runOutlierDetection(
                data,
                ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9']
            );
            expect(outlierResult.nOutliers).toBeGreaterThanOrEqual(0);

            // Step 3: Check discriminant validity (HTMT)
            const htmtResult = await runHTMTMatrix(
                data.map(row => row.slice(0, 6)),
                {
                    'F1': ['v1', 'v2', 'v3'],
                    'F2': ['v4', 'v5', 'v6']
                },
                0.85
            );
            expect(htmtResult.discriminantValidity).toBeDefined();

            // Step 4: Check multicollinearity (VIF)
            const vifResult = await runVIFCheck(
                data.map(row => row.slice(0, 4)),
                'v1',
                ['v2', 'v3', 'v4']
            );
            expect(vifResult.hasMulticollinearity).toBeDefined();

            console.log('✅ Complete workflow test passed!');
        });
    });
});

// Export for manual testing
export { generateLikertData, generateCorrelatedData };
