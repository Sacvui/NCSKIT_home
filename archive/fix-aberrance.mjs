import fs from 'fs';
import path from 'path';

const dirs = ['4.3', '4.4', '4.5'];
for (const dir of dirs) {
    const p = path.join(process.cwd(), 'public', 'webr_repo_v4', 'bin', 'emscripten', 'contrib', dir, 'PACKAGES');
    let content = fs.readFileSync(p, 'utf8');
    
    // Find Package: aberrance and replace its MD5sum back to normal
    const blocks = content.split('\n\n');
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].startsWith('Package: aberrance\n') || blocks[i].startsWith('Package: abbyyR\n')) {
            // wait, the first package was abbyyR? Let's just fix the broken MD5 string
        }
    }
    
    content = content.replace(/MD5sum: a8973a7771661a27ac651a62e3b7dd6ee77e00edc0c12536ed941301dc9a7fb/g, 'MD5sum: 1e77e00edc0c12536ed941301dc9a7fb');
    
    fs.writeFileSync(p, content);
    console.log('Fixed aberrance', p);
}
