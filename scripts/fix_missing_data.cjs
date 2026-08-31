const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, '../components/analyze/views');
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.tsx'));

const replacement = "((v) => (v === null || v === undefined || v === '' || v === 'NA' ? null : (isNaN(Number(v)) ? null : Number(v))))($1)";

for (const file of files) {
    const filePath = path.join(viewsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Match Number(row[col]) || 0 or Number(row[c]) || 0 etc.
    // Regex matches: Number(row[xxx]) || 0
    const newContent = content.replace(/Number\((row\[[^\]]+\])\)\s*\|\|\s*0/g, replacement);
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${file}`);
    }
}
