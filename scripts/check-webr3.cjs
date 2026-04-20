const fs = require('fs');

// Check if Turbopack is intercepting new Worker() calls 
// by looking at how the worker is actually loaded
const webrMjs = fs.readFileSync('node_modules/webr/dist/webr.mjs', 'utf8');

// Find the exact Worker creation for PostMessage (xe class)
// The xe class is PostMessage channel
const xeStart = webrMjs.lastIndexOf('var xe=class extends ne{');
const xeSlice = webrMjs.slice(xeStart, xeStart + 3000);

// Find where it creates the Worker
const workerCreate = xeSlice.match(/new\s+Worker\([^)]+\)/g);
console.log('PostMessage Worker creation:', workerCreate);

// Find the blob URL worker creation in ee()
const eeStart = webrMjs.indexOf('function ee(');
const eeSlice = webrMjs.slice(eeStart, eeStart + 500);
console.log('\nee() full:', eeSlice);

// Check what happens inside the worker when it receives init with channelType PostMessage
const workerJs = fs.readFileSync('public/webr_core_v3/webr-worker.js', 'utf8');
const initHandler = workerJs.match(/type:\"init\"[^}]{0,500}/);
console.log('\n=== Worker init handler ===');
if (initHandler) console.log(initHandler[0].slice(0, 300));

// Find where ASM_CONSTS is populated in R.js
const rjs = fs.readFileSync('public/webr_core_v3/R.js', 'utf8');
const asmDef = rjs.match(/var ASM_CONSTS\s*=\s*\{[^}]+\}/);
console.log('\n=== ASM_CONSTS Definition ===');
if (asmDef) console.log(asmDef[0]);

// Find the runEmAsmFunction  
const runEm = rjs.match(/function runEmAsmFunction[^}]+\}/);
console.log('\n=== runEmAsmFunction ===');
if (runEm) console.log(runEm[0]);

// Check if R.js self-references or expects to be in a specific context
const moduleCheck = rjs.match(/Module\[['"]asm['"]\]/g);
console.log('\n=== Module["asm"] references ===', moduleCheck ? moduleCheck.length : 0);

// Check if R.js has import/export that Turbopack might transform
const hasImport = rjs.includes('import ') || rjs.includes('export ');
console.log('R.js has import/export:', hasImport);

// Check if R.js expects globalThis.Module 
const globalModule = rjs.match(/globalThis\.Module/g);
console.log('globalThis.Module refs:', globalModule ? globalModule.length : 0);
