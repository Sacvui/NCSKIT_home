/**
 * Manual Test Script for WebR Functions
 * Run this to quickly test all major functions
 */

// Import functions
import { runDescriptiveStats } from './lib/webr/analyses/descriptive';
import { runCronbachAlpha, runEFA, runCFA } from './lib/webr/analyses/reliability';
import { runCorrelation, runTTestIndependent } from './lib/webr/analyses/hypothesis';
import { runLinearRegression } from './lib/webr/analyses/regression';
import { runLavaanAnalysis } from './lib/webr/analyses/sem';
import { initWebR } from './lib/webr/core';

// Test data
function generateLikertData(n: number, nItems: number): number[][] {
    const data: number[][] = [];
    for (let i = 0; i < n; i++) {
        const row: number[] = [];
        for (let j = 0; j < nItems; j++) {
            row.push(Math.floor(Math.random() * 5) + 1);
        }
        data.push(row);
    }
    return data;
}

async function runAllTests() {
    console.log('🚀 Starting WebR Functions Test...\n');

    try {
        // Initialize WebR
        console.log('1️⃣ Initializing WebR...');
        await initWebR();
        console.log('✅ WebR initialized\n');

        // Test 1: Descriptive Stats
        console.log('2️⃣ Testing Descriptive Statistics...');
        const descData = [[10, 20], [15, 25], [20, 30]];
        const descResult = await runDescriptiveStats(descData);
        console.log('   Mean:', descResult.mean);
        console.log('   SD:', descResult.sd);
        console.log('✅ Descriptive Stats OK\n');

        // Test 2: Cronbach Alpha
        console.log('3️⃣ Testing Cronbach Alpha...');
        const alphaData = generateLikertData(50, 5);
        const alphaResult = await runCronbachAlpha(alphaData, 1, 5);
        console.log('   Alpha:', alphaResult.alpha.toFixed(3));
        console.log('   Items:', alphaResult.nItems);
        console.log('✅ Cronbach Alpha OK\n');

        // Test 3: EFA (Critical - was broken)
        console.log('4️⃣ Testing EFA (Previously broken - df_clean error)...');
        const efaData = generateLikertData(100, 6);
        const efaResult = await runEFA(efaData, 2, 'varimax');
        console.log('   KMO:', efaResult.kmo.toFixed(3));
        console.log('   Bartlett p:', efaResult.bartlettP.toFixed(4));
        console.log('   Factors used:', efaResult.nFactorsUsed);
        console.log('✅ EFA OK (df_clean bug fixed!)\n');

        // Test 4: CFA (Critical - was broken)
        console.log('5️⃣ Testing CFA (Previously broken - JSON.stringify error)...');
        const cfaData = generateLikertData(100, 6);
        const columns = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'];
        const model = `
            F1 =~ v1 + v2 + v3
            F2 =~ v4 + v5 + v6
        `;
        const cfaResult = await runCFA(cfaData, columns, model);
        console.log('   CFI:', cfaResult.fitMeasures.cfi.toFixed(3));
        console.log('   RMSEA:', cfaResult.fitMeasures.rmsea.toFixed(3));
        console.log('   Estimates:', cfaResult.estimates.length);
        console.log('✅ CFA OK (JSON.stringify bug fixed!)\n');

        // Test 5: SEM (Critical - was broken)
        console.log('6️⃣ Testing SEM/Lavaan (Previously broken - JSON.stringify error)...');
        const semData = generateLikertData(100, 6);
        const semResult = await runLavaanAnalysis(semData, columns, model);
        console.log('   CFI:', semResult.fitMeasures.cfi.toFixed(3));
        console.log('   TLI:', semResult.fitMeasures.tli.toFixed(3));
        console.log('   RMSEA:', semResult.fitMeasures.rmsea.toFixed(3));
        console.log('✅ SEM OK (JSON.stringify bug fixed!)\n');

        // Test 6: Correlation
        console.log('7️⃣ Testing Correlation...');
        const corrData = [[1, 2], [2, 4], [3, 6], [4, 8]];
        const corrResult = await runCorrelation(corrData, 'pearson');
        console.log('   Correlation matrix:', corrResult.correlationMatrix);
        console.log('✅ Correlation OK\n');

        // Test 7: T-Test
        console.log('8️⃣ Testing Independent T-Test...');
        const group1 = [20, 22, 24, 26, 28];
        const group2 = [30, 32, 34, 36, 38];
        const ttestResult = await runTTestIndependent(group1, group2);
        console.log('   Mean diff:', ttestResult.meanDiff.toFixed(2));
        console.log('   p-value:', ttestResult.pValue.toFixed(4));
        console.log('   Effect size:', ttestResult.effectSize.toFixed(3));
        console.log('✅ T-Test OK\n');

        // Test 8: Linear Regression
        console.log('9️⃣ Testing Linear Regression...');
        const regData = [
            [17, 1, 3],
            [22, 2, 4],
            [27, 3, 5],
            [32, 4, 6]
        ];
        const regNames = ['Y', 'X1', 'X2'];
        const regResult = await runLinearRegression(regData, regNames);
        console.log('   R²:', regResult.modelFit.rSquared.toFixed(3));
        console.log('   Coefficients:', regResult.coefficients.length);
        console.log('✅ Regression OK\n');

        // Summary
        console.log('═══════════════════════════════════════');
        console.log('🎉 ALL TESTS PASSED!');
        console.log('═══════════════════════════════════════');
        console.log('✅ Descriptive Statistics: OK');
        console.log('✅ Cronbach Alpha: OK');
        console.log('✅ EFA: OK (df_clean bug FIXED)');
        console.log('✅ CFA: OK (JSON.stringify bug FIXED)');
        console.log('✅ SEM: OK (JSON.stringify bug FIXED)');
        console.log('✅ Correlation: OK');
        console.log('✅ T-Test: OK');
        console.log('✅ Regression: OK');
        console.log('═══════════════════════════════════════\n');

        return true;

    } catch (error: any) {
        console.error('❌ TEST FAILED!');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        return false;
    }
}

// Run tests
runAllTests().then(success => {
    if (success) {
        console.log('✅ Test suite completed successfully');
        process.exit(0);
    } else {
        console.log('❌ Test suite failed');
        process.exit(1);
    }
}).catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
