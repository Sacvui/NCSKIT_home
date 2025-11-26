const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
    let content = fs.readFileSync(envPath, 'utf-8');
    // Remove BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    // Also handle possible UTF-16 LE (FF FE) or BE (FE FF) if read as binary, but 'utf-8' might have garbled it.
    // If we see diamond questions marks, it might be double encoded.

    // Let's just try to clean it up.
    // If the file was UTF-16, fs.readFileSync(..., 'utf-8') would look like garbage with nulls.
    // If it looks like "N", it's likely UTF-16 LE read as ANSI/UTF-8.

    // Let's try reading as buffer.
    const buffer = fs.readFileSync(envPath);

    let cleanContent = '';

    // Check for UTF-16 LE BOM
    if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
        console.log('Detected UTF-16 LE BOM, converting to UTF-8...');
        cleanContent = buffer.subarray(2).toString('utf16le');
    } else if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
        console.log('Detected UTF-8 BOM, removing...');
        cleanContent = buffer.subarray(3).toString('utf8');
    } else {
        console.log('No BOM detected, assuming UTF-8');
        cleanContent = buffer.toString('utf8');
    }

    fs.writeFileSync(envPath, cleanContent, 'utf-8');
    console.log('Fixed .env.local encoding');
}
