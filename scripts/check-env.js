const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split('\n');
    console.log('Keys in .env.local:');
    lines.forEach(line => {
        const match = line.match(/^([^=]+)=/);
        if (match) {
            console.log(match[1]);
        }
    });
} else {
    console.log('.env.local not found');
}
