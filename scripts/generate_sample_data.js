import fs from 'fs';
import path from 'path';

/**
 * Script này tạo ra 2 file CSV dữ liệu mẫu (300 và 500 quan sát)
 * Chuẩn quốc tế cho mô hình SEM/CFA: 
 * 5 Independent (X) with 5 items each, 
 * 1 Mediator (M) with 4 items, 
 * 1 Dependent (Y) with 5 items.
 */

function generateData(rows, fileName) {
    const headers = [];
    
    // Gen Headers: X1.1 to X5.5, M.1 to M.4, Y.1 to Y.5
    for(let i=1; i<=5; i++) {
        for(let j=1; j<=5; j++) headers.push(`X${i}_${j}`);
    }
    for(let j=1; j<=4; j++) headers.push(`M_${j}`);
    for(let j=1; j<=5; j++) headers.push(`Y_${j}`);
    
    const csvContent = [headers.join(',')];
    
    for (let r = 0; r < rows; r++) {
        const rowData = [];
        // Simulate a 'Strong Correlation' model
        // Base latent factors (between 3.5 and 4.5 effectively)
        const latentX = Math.random() * 2 + 3; 
        
        // Items for X (34 items total in this simplified calc)
        for (let i = 0; i < 25; i++) {
            // Factor loading + Noise (Likert 1-5)
            let val = latentX + (Math.random() - 0.5) * 1.5;
            rowData.push(Math.min(5, Math.max(1, Math.round(val * 10) / 10)));
        }
        
        // Mediator - Influenced by X
        const latentM = (latentX * 0.7) + (Math.random() * 1.2);
        for (let i = 0; i < 4; i++) {
            let val = latentM + (Math.random() - 0.5) * 1.2;
            rowData.push(Math.min(5, Math.max(1, Math.round(val * 10) / 10)));
        }
        
        // Dependent - Influenced by X and M
        const latentY = (latentX * 0.4) + (latentM * 0.5) + (Math.random() * 1.0);
        for (let i = 0; i < 5; i++) {
            let val = latentY + (Math.random() - 0.5) * 1.0;
            rowData.push(Math.min(5, Math.max(1, Math.round(val * 10) / 10)));
        }
        
        csvContent.push(rowData.join(','));
    }
    
    const outputDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    
    fs.writeFileSync(path.join(outputDir, fileName), csvContent.join('\n'));
    console.log(`Generated: ${fileName} with ${rows} rows.`);
}

generateData(300, 'ncsstat_sample_300.csv');
generateData(500, 'ncsstat_sample_500.csv');
