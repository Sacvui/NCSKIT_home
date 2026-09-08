const fs = require('fs');
const content = fs.readFileSync('lib/interpretation-templates.ts', 'utf8');

// Find sections using the comments
const splitByComment = (keyword) => {
    return content.indexOf('// ===== ' + keyword + ' =====');
};

const utilIdx = splitByComment('UTILITY FUNCTIONS');
const cronbachIdx = splitByComment("CRONBACH'S ALPHA");
const corrIdx = splitByComment('CORRELATION');
const ttestIdx = splitByComment('T-TEST');
const anovaIdx = splitByComment('ANOVA');
const efaIdx = splitByComment('EFA');
const cfaIdx = splitByComment('CFA');
const linRegIdx = splitByComment('LINEAR REGRESSION');
const logRegIdx = splitByComment('LOGISTIC REGRESSION');
const chiIdx = splitByComment('CHI-SQUARE');
const nonParamIdx = splitByComment('NON-PARAMETRIC');
const medIdx = splitByComment('MEDIATION');
const modIdx = splitByComment('MODERATION');
const clusIdx = splitByComment('CLUSTER');
const descIdx = splitByComment('DESCRIPTIVE');
const vifIdx = splitByComment('VIF');
const outlierIdx = splitByComment('OUTLIER');
const htmtIdx = splitByComment('HTMT');

// Extract
const sharedCode = content.substring(0, cronbachIdx);

// Grouping
const factorKeys = ["CRONBACH'S ALPHA", 'EFA', 'CFA', 'HTMT'];
const basicKeys = ['CORRELATION', 'T-TEST', 'ANOVA', 'CHI-SQUARE', 'NON-PARAMETRIC', 'DESCRIPTIVE'];
const regressionKeys = ['LINEAR REGRESSION', 'LOGISTIC REGRESSION', 'MEDIATION', 'MODERATION', 'VIF', 'OUTLIER', 'CLUSTER'];

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

const sharedHeader = "import { formatPValue, formatCoef, formatNum, InterpretationResult, AnalysisType } from './shared';\n\n";

fs.writeFileSync('lib/asig/shared.ts', sharedCode);
fs.writeFileSync('lib/asig/factor.ts', sharedHeader + extractBlocks(factorKeys));
fs.writeFileSync('lib/asig/basic.ts', sharedHeader + extractBlocks(basicKeys));
fs.writeFileSync('lib/asig/regression.ts', sharedHeader + extractBlocks(regressionKeys));

const indexContent = `export * from './shared';
export * from './factor';
export * from './basic';
export * from './regression';
`;
fs.writeFileSync('lib/asig/index.ts', indexContent);

console.log('Successfully split ASIG files.');
