import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname, '../node_modules/webr/dist');
const dest = path.join(__dirname, '../public/webr_core');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    console.log('[WebR Installer] Copying WebR core binaries to public directory for deployment...');
    copyDir(source, dest);
    console.log('[WebR Installer] WebR binaries copied successfully!');
} catch (e) {
    console.error('[WebR Installer] Failed to copy WebR binaries:', e);
    process.exit(1);
}
