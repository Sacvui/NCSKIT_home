const fs = require('fs');
const path = require('path');

const dirs = ['4.3', '4.4', '4.5'];
const textToAppend = `
Package: quadprog
Version: 1.5-8
Depends: R (>= 3.0.0)
License: GPL-2
MD5sum: 1
`; // MD5sum added just to be safe, though WebR might ignore it.

for (const dir of dirs) {
    const pkgPath = path.join(__dirname, 'public', 'webr_repo_v3', 'bin', 'emscripten', 'contrib', dir, 'PACKAGES');
    if (!fs.existsSync(pkgPath)) continue;
    
    // Read file as string ignoring encoding issues (just taking the good part)
    const content = fs.readFileSync(pkgPath, 'utf8');
    const zzliteIndex = content.lastIndexOf('Package: zzlite');
    if (zzliteIndex !== -1) {
        // Find the end of the zzlite block (double newline)
        const endOfZzlite = content.indexOf('\n\n', zzliteIndex);
        if (endOfZzlite !== -1) {
            const cleanContent = content.substring(0, endOfZzlite + 2);
            fs.writeFileSync(pkgPath, cleanContent + textToAppend.trim() + '\n\n', 'utf8');
            console.log(`Fixed ${pkgPath}`);
        }
    }
}
