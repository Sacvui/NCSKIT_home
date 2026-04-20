const fs = require('fs');

const rjs = fs.readFileSync('public/webr_core_v3/R.js', 'utf8');

// Check what kind of import/export R.js has
const lines = rjs.split('\n');
for (let i = 0; i < Math.min(20, lines.length); i++) {
    console.log(`Line ${i}: ${lines[i].slice(0, 200)}`);
}
console.log('---');
for (let i = Math.max(0, lines.length - 10); i < lines.length; i++) {
    console.log(`Line ${i}: ${lines[i].slice(0, 200)}`);
}

// Count total ASM_CONSTS entries
const asmMatch = rjs.match(/ASM_CONSTS\s*=\s*\{([^}]+)\}/);
if (asmMatch) {
    const entries = asmMatch[1].split(',').filter(e => e.includes('=>'));
    console.log('\nTotal ASM_CONSTS entries:', entries.length);
    entries.forEach((e, i) => console.log(`  Entry ${i}: ${e.trim().slice(0, 100)}`));
}

// Check _emscripten_asm_const_int
const emMatch = rjs.match(/function _emscripten_asm_const_int[^}]+\}/);
if (emMatch) console.log('\n_emscripten_asm_const_int:', emMatch[0].slice(0, 300));

const runEm = rjs.match(/function runEmAsmFunction[^}]+\}/);
if (runEm) console.log('\nrunEmAsmFunction:', runEm[0].slice(0, 300));

// How many lines does R.js have?
console.log('\nR.js total lines:', lines.length);
console.log('R.js total chars:', rjs.length);

// Check: is R.js an ES module or a script meant to run in worker context?
const hasExportDefault = rjs.includes('export default');
const hasExportNamed = rjs.match(/export\s+\{/);
const hasImportFrom = rjs.match(/import\s+.*\s+from/);
console.log('\nexport default:', hasExportDefault);
console.log('export {}:', !!hasExportNamed);
console.log('import from:', !!hasImportFrom);

// Check the actual import/export content
const importExports = rjs.match(/(import|export)\s+[^;]+/g);
if (importExports) {
    console.log('\nAll import/export statements:');
    importExports.forEach((ie, i) => console.log(`  [${i}]: ${ie.slice(0, 150)}`));
}
