const fs = require('fs');
const content = fs.readFileSync('lib/interpretation-templates.ts', 'utf8');

const splitByComment = (keyword) => content.indexOf('// ===== ' + keyword + ' =====');

const factorKeys = ["CRONBACH'S ALPHA", 'EFA', 'CFA'];
const basicKeys = [
    'CORRELATION', 'INDEPENDENT T-TEST', 'ONE-WAY ANOVA', 
    'PAIRED T-TEST', 'MANN-WHITNEY U TEST', 'KRUSKAL-WALLIS TEST', 
    'WILCOXON SIGNED RANK TEST', 'TWO-WAY ANOVA', 'CHI-SQUARE'
];
const regressionKeys = [
    'LINEAR REGRESSION', 'LOGISTIC REGRESSION', 
    'MEDIATION ANALYSIS', 'MODERATION ANALYSIS', 'CLUSTER ANALYSIS'
];
const mainKey = ['MAIN GENERATOR'];

const extractBlocks = (keys) => {
    let result = '';
    keys.forEach((key) => {
        const start = splitByComment(key);
        if (start === -1) {
            console.log("Could not find section:", key);
            return;
        }
        
        let end = content.length;
        // Find next section
        const match = content.substring(start + 5).match(/\/\/\s*=====\s*([A-Z0-9' -]+)\s*=====/);
        if (match) {
            end = start + 5 + match.index;
        }
        result += content.substring(start, end) + '\n';
    });
    return result;
}

const sharedCode = content.substring(0, splitByComment("CRONBACH'S ALPHA"));
fs.writeFileSync('lib/asig/shared.ts', sharedCode);

const sharedHeader = "import { formatPValue, formatCoef, formatNum, InterpretationResult, AnalysisType } from './shared';\n\n";

fs.writeFileSync('lib/asig/factor.ts', sharedHeader + extractBlocks(factorKeys));
fs.writeFileSync('lib/asig/basic.ts', sharedHeader + extractBlocks(basicKeys));
fs.writeFileSync('lib/asig/regression.ts', sharedHeader + extractBlocks(regressionKeys));

const generatorHeader = "import { AnalysisType, InterpretationResult } from './shared';\n" +
"import { interpretCronbachAlpha, interpretEFA, interpretCFA } from './factor';\n" +
"import { interpretCorrelation, interpretTTest, interpretANOVA, interpretPairedTTest, interpretMannWhitney, interpretKruskalWallis, interpretWilcoxon, interpretTwoWayANOVA, interpretChiSquare } from './basic';\n" +
"import { interpretLinearRegression, interpretLogisticRegression, interpretMediation, interpretModeration, interpretCluster } from './regression';\n\n";

fs.writeFileSync('lib/asig/generator.ts', generatorHeader + extractBlocks(mainKey));

const indexContent = `export * from './shared';
export * from './factor';
export * from './basic';
export * from './regression';
export * from './generator';
`;
fs.writeFileSync('lib/asig/index.ts', indexContent);

console.log('Successfully split ASIG files.');
