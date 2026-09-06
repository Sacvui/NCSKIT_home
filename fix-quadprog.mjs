import fs from 'fs';
import path from 'path';

const dirs = ['4.3', '4.4', '4.5'];
for (const dir of dirs) {
    const p = path.join(process.cwd(), 'public', 'webr_repo_v4', 'bin', 'emscripten', 'contrib', dir, 'PACKAGES');
    let content = fs.readFileSync(p, 'utf8');
    
    // Find Package: quadprog and replace its MD5sum
    const blocks = content.split('\n\n');
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].startsWith('Package: quadprog\n')) {
            blocks[i] = blocks[i].replace(/MD5sum: 1/, 'MD5sum: a8973a7771661a27ac651a62e3b7dd6e');
        }
    }
    
    fs.writeFileSync(p, blocks.join('\n\n'));
    console.log('Fixed', p);
}
