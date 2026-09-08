import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('lib/pdf-exporter.ts', 'utf8');

const blocks = [
    { type: 'comparison', keywords: ['ttest-indep', 'ttest-paired', 'anova', 'twoway-anova', 'mann-whitney', 'kruskal-wallis', 'wilcoxon'] },
    { type: 'regression', keywords: ['regression', 'logistic'] },
    { type: 'factor', keywords: ['efa', 'sem', 'cluster'] }, // cluster here
    { type: 'descriptive', keywords: ['descriptive', 'chisquare', 'correlation'] },
    { type: 'autopilot', keywords: ['auto-pilot'] }
];

const lines = content.split('\n');

let currentBlock = '';
let currentFile = '';
let bracketCount = 0;
let inBranch = false;
let branchContent = [];

const results = {};

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (!inBranch && line.includes('if (analysisType ===') && !line.includes('cronbach')) {
        inBranch = true;
        bracketCount = 0;
        
        let found = false;
        for (const b of blocks) {
            for (const k of b.keywords) {
                if (line.includes(`'${k}'`)) {
                    currentFile = b.type;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        if (!found) currentFile = 'other';
    }
    
    if (inBranch) {
        branchContent.push(line);
        
        // count brackets
        for (let j = 0; j < line.length; j++) {
            if (line[j] === '{') bracketCount++;
            if (line[j] === '}') bracketCount--;
        }
        
        if (bracketCount === 0) {
            // End of branch
            inBranch = false;
            if (!results[currentFile]) results[currentFile] = [];
            
            // Clean up the first line `else if` to just `if` to make it clean?
            // Actually, just push the block
            let blockStr = branchContent.join('\n');
            if (blockStr.trim().startsWith('else ')) {
                blockStr = blockStr.replace(/^\s*else\s+if/, 'if');
            }
            results[currentFile].push(blockStr);
            branchContent = [];
        }
    }
}

// Write the files
for (const [file, blocks] of Object.entries(results)) {
    if (file === 'other') continue;
    
    const fileContent = `import autoTable from 'jspdf-autotable';
import { PDFContext } from '../core';

export const generate${file.charAt(0).toUpperCase() + file.slice(1)}PDF = (ctx: PDFContext) => {
    const { doc, options, commonTableOptions } = ctx;
    const { results, columns = [], analysisType, title } = options;
    let { yPos } = ctx;
    const checkPageBreak = ctx.checkPageBreak;

${blocks.join('\n\n')}

    ctx.yPos = yPos;
};
`;
    fs.writeFileSync(`lib/pdf/generators/${file}.ts`, fileContent);
}

console.log("Extraction done");
