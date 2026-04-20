const fs = require('fs');

// The key insight: webr-worker.js loads R.js at runtime.
// Let's check HOW it loads R.js - does it use importScripts() or import()?
const worker = fs.readFileSync('public/webr_core_v3/webr-worker.js', 'utf8');

// Find where R.js is loaded
const rjsRefs = [];
let idx = 0;
while ((idx = worker.indexOf('R.js', idx)) !== -1) {
    rjsRefs.push(worker.slice(Math.max(0, idx - 200), idx + 50));
    idx += 4;
}
console.log('R.js references in worker:', rjsRefs.length);
rjsRefs.forEach((r, i) => console.log(`\n[${i}]:`, r));

// Check if worker uses importScripts
const hasImportScripts = worker.includes('importScripts');
console.log('\nWorker uses importScripts:', hasImportScripts);

// Check how worker resolves baseUrl
const baseUrlRefs = worker.match(/baseUrl[^;]{0,200}/g);
console.log('\nbaseUrl references:');
if (baseUrlRefs) baseUrlRefs.forEach((r, i) => console.log(`[${i}]:`, r.slice(0, 200)));

// Check if worker uses locateFile
const locateFile = worker.match(/locateFile[^;]{0,200}/g);
console.log('\nlocateFile references:');
if (locateFile) locateFile.forEach((r, i) => console.log(`[${i}]:`, r.slice(0, 200)));

// THE KEY: Check how R.js locates R.wasm - this is where the mismatch might happen
const rjs = fs.readFileSync('public/webr_core_v3/R.js', 'utf8');
const locateFileInRjs = rjs.match(/locateFile[^;]{0,200}/g);
console.log('\nR.js locateFile:');
if (locateFileInRjs) locateFileInRjs.slice(0, 3).forEach((r, i) => console.log(`[${i}]:`, r.slice(0, 200)));

const wasmBinaryFile = rjs.match(/wasmBinaryFile[^;]{0,200}/g);
console.log('\nR.js wasmBinaryFile:');
if (wasmBinaryFile) wasmBinaryFile.slice(0, 3).forEach((r, i) => console.log(`[${i}]:`, r.slice(0, 200)));

// Check if there's any cross-origin or CORS check
const corsCheck = worker.match(/(crossOrigin|CORS|cross.origin)[^;]{0,100}/gi);
console.log('\nCORS references in worker:', corsCheck);
