const fs = require('fs');

const rjs = fs.readFileSync('public/webr_core_v3/R.js', 'utf8');

// The ASM_CONSTS is on line 1821 which is the mega-minified Emscripten output
// Let's check if ASM_CONSTS really only has 1 entry or if our regex was wrong
const line1821 = rjs.split('\n')[1821];
console.log('Line 1822 length:', line1821 ? line1821.length : 'N/A');

// Search for ASM_CONSTS more carefully - it might be defined differently in minified code
const allAsmConsts = rjs.match(/ASM_CONSTS\s*=\s*\{/g);
console.log('ASM_CONSTS definitions:', allAsmConsts);

// Get the full ASM_CONSTS object - it may span across { } with nested functions
const asmIdx = rjs.indexOf('ASM_CONSTS=');
if (asmIdx > -1) {
    // Find matching closing brace
    let depth = 0;
    let start = rjs.indexOf('{', asmIdx);
    let end = start;
    for (let i = start; i < rjs.length && i < start + 5000; i++) {
        if (rjs[i] === '{') depth++;
        if (rjs[i] === '}') depth--;
        if (depth === 0) { end = i; break; }
    }
    const asmConsts = rjs.slice(start, end + 1);
    console.log('\nFull ASM_CONSTS (length):', asmConsts.length);
    console.log('Full ASM_CONSTS:', asmConsts.slice(0, 1000));
    
    // Count entries by counting =>
    const arrowCount = (asmConsts.match(/=>/g) || []).length;
    console.log('Arrow function entries:', arrowCount);
}

// Also check the npm version of R.js for comparison
const rjsNpm = fs.readFileSync('node_modules/webr/dist/R.js', 'utf8');
const asmIdxNpm = rjsNpm.indexOf('ASM_CONSTS=');
if (asmIdxNpm > -1) {
    let depth = 0;
    let start = rjsNpm.indexOf('{', asmIdxNpm);
    let end = start;
    for (let i = start; i < rjsNpm.length && i < start + 5000; i++) {
        if (rjsNpm[i] === '{') depth++;
        if (rjsNpm[i] === '}') depth--;
        if (depth === 0) { end = i; break; }
    }
    const asmConstsNpm = rjsNpm.slice(start, end + 1);
    console.log('\nNPM R.js ASM_CONSTS (length):', asmConstsNpm.length);
    console.log('NPM R.js ASM_CONSTS:', asmConstsNpm.slice(0, 1000));
    
    const arrowCount = (asmConstsNpm.match(/=>/g) || []).length;
    console.log('NPM Arrow function entries:', arrowCount);
}

// Also check the _emscripten_asm_const_int function more carefully
const emIdx = rjs.indexOf('_emscripten_asm_const_int');
if (emIdx > -1) {
    console.log('\n_emscripten_asm_const_int context:');
    console.log(rjs.slice(Math.max(0, emIdx - 100), emIdx + 300));
}
