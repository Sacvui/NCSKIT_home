require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { runSEM } = require('./lib/webr/analyses/sem');

async function main() {
    const csvData = fs.readFileSync('./public/data/ncsstat_sample_500.csv', 'utf8');
    const records = parse(csvData, { columns: true, skip_empty_lines: true });
    
    // Select a few columns
    const columns = ['BEH1', 'BEH2', 'BEH3', 'ATT1', 'ATT2', 'ATT3'];
    const data = records.map(row => columns.map(c => {
        const v = row[c];
        return (v === null || v === undefined || v === '' || v === 'NA' ? null : (isNaN(Number(v)) ? null : Number(v)));
    }));

    const modelSyntax = `
        BEH =~ BEH1 + BEH2 + BEH3
        ATT =~ ATT1 + ATT2 + ATT3
        BEH ~ ATT
    `;

    console.log("Running SEM...");
    try {
        const res = await runSEM(data, columns, modelSyntax);
        console.log("Success! Fit Measures:", res.fitMeasures);
    } catch (e) {
        console.error("Error:", e);
    }
    
    process.exit(0);
}

main();
