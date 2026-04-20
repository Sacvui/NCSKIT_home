const fs = require('fs');
const pkg = require('../node_modules/webr/package.json');
console.log('webr npm version:', pkg.version);

// Check if webr.mjs exports channelType enum
const webrMjs = fs.readFileSync('node_modules/webr/dist/webr.mjs', 'utf8');
const hasPostMessage = webrMjs.includes('PostMessage');
const hasSharedArrayBuffer = webrMjs.includes('SharedArrayBuffer');
console.log('webr.mjs has PostMessage channel:', hasPostMessage);
console.log('webr.mjs has SharedArrayBuffer channel:', hasSharedArrayBuffer);

// Check if worker references ServiceWorker
const worker = fs.readFileSync('public/webr_core_v3/webr-worker.js', 'utf8');
const swRef = worker.includes('serviceWorker');
const swRegister = worker.includes('ServiceWorkerChannel');
console.log('worker references serviceWorker:', swRef);
console.log('worker has ServiceWorkerChannel:', swRegister);

// Check channel type enum values
const chMatch = webrMjs.match(/ChannelType\[.+?\]\s*=\s*(\d)/g);
console.log('ChannelType enums:', chMatch);

// Most importantly: check what channelType 3 actually maps to
const lines = webrMjs.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('ChannelType')) {
        console.log(`Line ${i}: ${lines[i].trim()}`);
    }
}

// Check how WebR resolves the worker URL
const workerUrlMatches = webrMjs.match(/worker.*url/gi);
console.log('Worker URL references:', workerUrlMatches);

// Check if R.js expects ASM_CONSTS
const rjs = fs.readFileSync('public/webr_core_v3/R.js', 'utf8');
const asmCount = (rjs.match(/ASM_CONSTS/g) || []).length;
console.log('R.js ASM_CONSTS references:', asmCount);

// Check the specific function that crashes
const asmConstsDef = rjs.match(/var ASM_CONSTS\s*=\s*\{[^}]{0,500}/);
console.log('ASM_CONSTS definition (first 500 chars):', asmConstsDef ? asmConstsDef[0].slice(0, 300) : 'NOT FOUND');
