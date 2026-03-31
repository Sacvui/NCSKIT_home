import fs from 'fs';
import path from 'path';

/**
 * ncsStat International Standard Generator v2.0 (ESM)
 * 11 Factors (F1-F11) x 5 Items each = 55 Columns total.
 */

function generateMasterData(rows, fileName) {
    const headers = [];
    for(let i=1; i<=11; i++) {
        for(let j=1; j<=5; j++) headers.push(`F${i}_${j}`);
    }
    headers.push('Gender', 'Age_Group', 'Education');
    const csvContent = [headers.join(',')];
    
    for (let r = 0; r < rows; r++) {
        const rowData = [];
        const latentBase = Math.random() * 1.5 + 3.0;
        for (let i = 1; i <= 11; i++) {
            const factorLatent = latentBase + (Math.random() - 0.5) * 0.8;
            for (let j = 1; j <= 5; j++) {
                let val = factorLatent + (Math.random() - 0.5) * 1.2;
                rowData.push(Math.min(5, Math.max(1, Math.round(val * 10) / 10)));
            }
        }
        rowData.push(Math.random() > 0.5 ? 'Male' : 'Female');
        rowData.push(Math.floor(Math.random() * 4) + 1);
        rowData.push(Math.floor(Math.random() * 3) + 1);
        csvContent.push(rowData.join(','));
    }
    
    const outputDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, fileName), csvContent.join('\n'));
    console.log(`[MASTER DATA] Generated ${fileName} with ${rows} rows and 58 columns.`);
}

generateMasterData(300, 'ncsstat_sample_300.csv');
generateMasterData(500, 'ncsstat_sample_500.csv');
