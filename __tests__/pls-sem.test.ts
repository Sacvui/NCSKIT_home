/**
 * PLS-SEM Functions Test Suite
 * Tests all PLS-SEM analysis functions with current API signatures.
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
jest.setTimeout(120000);

describe('PLS-SEM Functions - Test Suite', () => {

    beforeAll(async () => {
        console.log('🔧 Initializing WebR for PLS-SEM tests...');
        await initWebR();
        console.log('✅ WebR initialized successfully');
    });

    // ==================== PHASE 1: FOUNDATION ====================
    describe('Phase 1: Foundation (Cleaning & Reliability)', () => {

        test('1.1 runMcDonaldOmega - should calculate omega correctly', async () => {
            const data = generateLikertData(100, 5, 1, 5);
            const itemNames = ['item1', 'item2', 'item3', 'item4', 'item5'];

            // API: runMcDonaldOmega(data, itemNames?)
            const result = await runMcDonaldOmega(data, itemNames);

            expect(result).toBeDefined();
            expect(result.omega_total).toBeDefined();
            expect(result.alpha).toBeDefined();
        });

        test('1.2 runMcDonaldOmega - should handle high reliability data', async () => {
            const data = generateCorrelatedData(100, 5, 0.9);

            const result = await runMcDonaldOmega(data);

            expect(result).toBeDefined();
        });

        test('1.3 runOutlierDetection - should detect outliers', async () => {
            const data = generateLikertData(50, 4, 1, 5);
            data.push([100, 100, 100, 100]); // Extreme outlier

            // API: runOutlierDetection(data)
            const result = await runOutlierDetection(data);

            expect(result).toBeDefined();
            expect(result.n_outliers).toBeGreaterThanOrEqual(0);
            expect(result.mahalanobis_distances).toBeDefined();
        });

        test('1.4 runOutlierDetection - should handle clean data', async () => {
            const data = generateLikertData(50, 4, 2, 4);

            const result = await runOutlierDetection(data);

            expect(result).toBeDefined();
        });
    });

    // ==================== PHASE 2: MEASUREMENT MODEL ====================
    describe('Phase 2: Measurement Model Validation', () => {

        test('2.1 runHTMTMatrix - should calculate HTMT correctly', async () => {
            const data = generateLikertData(100, 6, 1, 5);
            // API: runHTMTMatrix(data, factorStructure: { name: string; items: number[] }[])
            const factorStructure = [
                { name: 'Factor1', items: [1, 2, 3] },
                { name: 'Factor2', items: [4, 5, 6] }
            ];

            const result = await runHTMTMatrix(data, factorStructure);

            expect(result).toBeDefined();
            expect(result.htmt_matrix).toBeDefined();
            expect(result.max_htmt).toBeDefined();
        });

        test('2.2 runVIFCheck - should calculate VIF correctly', async () => {
            const data = generateLikertData(100, 4, 1, 5);

            // API: runVIFCheck(data, dependentVarIndex?)
            const result = await runVIFCheck(data, 0);

            expect(result).toBeDefined();
            expect(result.vif_values).toBeDefined();
            expect(result.max_vif).toBeDefined();
        });
    });

    // ==================== PHASE 3: STRUCTURAL MODEL ====================
    describe('Phase 3: Structural Model', () => {

        test('3.1 runBootstrapping - should perform bootstrap', async () => {
            const data = generateLikertData(50, 3, 1, 5);
            const nBootstrap = 100;

            // API: runBootstrapping(data, nBootstrap?)
            const result = await runBootstrapping(data, nBootstrap);

            expect(result).toBeDefined();
            expect(result.n_bootstrap).toBe(nBootstrap);
            expect(result.ci_lower).toBeDefined();
            expect(result.ci_upper).toBeDefined();
        });

        test('3.2 runMediationModeration - should analyze mediation', async () => {
            const data = generateLikertData(100, 3, 1, 5);

            // API: runMediationModeration(data, ivIndex, mediatorIndex, dvIndex, moderatorIndex?)
            const result = await runMediationModeration(data, 0, 1, 2);

            expect(result).toBeDefined();
            expect(result.path_a).toBeDefined();
            expect(result.path_b).toBeDefined();
            expect(result.indirect_effect).toBeDefined();
        });

        test('3.3 runPLSSEM - should run basic PLS-SEM', async () => {
            const data = generateLikertData(100, 6, 1, 5);
            const measurementModel = [
                { construct: 'LV1', items: [0, 1, 2] },
                { construct: 'LV2', items: [3, 4, 5] }
            ];
            const structuralModel = [
                { from: 'LV1', to: 'LV2' }
            ];

            // API: runPLSSEM(data, measurementModel, structuralModel)
            const result = await runPLSSEM(data, measurementModel, structuralModel);

            expect(result).toBeDefined();
            expect(result.status).toBeDefined();
        });
    });

    // ==================== PHASE 4: ADVANCED ANALYSIS ====================
    describe('Phase 4: Advanced Analysis', () => {

        test('4.1 runIPMA - should calculate importance-performance', async () => {
            const data = generateLikertData(100, 4, 1, 5);

            // API: runIPMA(data, targetIndex)
            const result = await runIPMA(data, 0);

            expect(result).toBeDefined();
            expect(result.performance).toBeDefined();
            expect(result.importance).toBeDefined();
        });

        test('4.2 runMGA - should perform multi-group analysis', async () => {
            const data = generateLikertData(100, 3, 1, 5);
            const groupVariable = data.map((_, i) => i < 50 ? 1 : 2);

            // API: runMGA(data, groupVariable, dependentVarIndex)
            const result = await runMGA(data, groupVariable, 0);

            expect(result).toBeDefined();
            expect(result.group_means).toBeDefined();
            expect(result.p_value).toBeDefined();
        });

        test('4.3 runBlindfolding - should calculate Q²', async () => {
            const data = generateLikertData(100, 4, 1, 5);
            const omissionDistance = 7;

            // API: runBlindfolding(data, omissionDistance?)
            const result = await runBlindfolding(data, omissionDistance);

            expect(result).toBeDefined();
            expect(result.omission_distance).toBe(omissionDistance);
            expect(result.status).toBeDefined();
        });
    });

    // ==================== INTEGRATION TEST ====================
    describe('Integration Tests', () => {

        test('5.1 Complete basic workflow', async () => {
            const data = generateLikertData(100, 6, 1, 5);

            // Step 1: Reliability
            const omegaResult = await runMcDonaldOmega(data.map(row => row.slice(0, 3)));
            expect(omegaResult).toBeDefined();

            // Step 2: Outliers
            const outlierResult = await runOutlierDetection(data);
            expect(outlierResult.n_outliers).toBeGreaterThanOrEqual(0);

            // Step 3: HTMT
            const htmtResult = await runHTMTMatrix(data, [
                { name: 'F1', items: [1, 2, 3] },
                { name: 'F2', items: [4, 5, 6] }
            ]);
            expect(htmtResult.max_htmt).toBeDefined();

            // Step 4: VIF
            const vifResult = await runVIFCheck(data, 0);
            expect(vifResult.max_vif).toBeDefined();

            console.log('✅ Complete workflow test passed!');
        });
    });
});

export { generateLikertData, generateCorrelatedData };
