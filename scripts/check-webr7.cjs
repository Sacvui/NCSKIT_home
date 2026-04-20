const fs = require('fs');

const worker = fs.readFileSync('public/webr_core_v3/webr-worker.js', 'utf8');

// Find Tt function - this is what loads R.js
const ttMatch = worker.match(/function Tt\([^)]*\)\s*\{[^}]{0,1000}\}/);
console.log('=== Tt function (R.js loader) ===');
if (ttMatch) console.log(ttMatch[0]);

// Also check the alternative - it might be an arrow function
const ttArrow = worker.match(/[,;]Tt\s*=\s*[^;]+/);
if (ttArrow) console.log('Tt arrow:', ttArrow[0].slice(0, 300));

// Check if it uses importScripts  
const importScriptsUsage = worker.match(/importScripts\([^)]*\)/g);
console.log('\nimportScripts calls:', importScriptsUsage);

// Check the init message handler to understand the full boot sequence
const initMsg = worker.match(/type:"init"[^}]{0,1000}/);
//console.log('\nInit handler:', initMsg ? initMsg[0].slice(0, 500) : 'not found');

// CRITICAL: Check what X.baseUrl gets set to
const xBaseUrl = worker.match(/X\.baseUrl[^;]{0,200}/g);
console.log('\nX.baseUrl assignments:');
if (xBaseUrl) xBaseUrl.forEach((r, i) => console.log(`[${i}]:`, r.slice(0, 200)));

// Find how X is populated from init config
const xAssign = worker.match(/X\s*=[^;]{0,200}/g);
console.log('\nX assignments:');
if (xAssign) xAssign.slice(0, 5).forEach((r, i) => console.log(`[${i}]:`, r.slice(0, 200)));

// The real question: does the Worker see the correct baseUrl?
// When created via ee() with Blob URL, the Worker's location is blob:// 
// which means relative URLs won't work properly
// When created directly with new Worker(url), the Worker's location is the real URL

// Check ee() - the Blob URL worker creator - again more carefully
const webrMjs = fs.readFileSync('node_modules/webr/dist/webr.mjs', 'utf8');
const seFunc = webrMjs.match(/function Se\([^)]*\)\{[^}]+\}/);
console.log('\n=== Se() function ===');
if (seFunc) console.log(seFunc[0]);

// Se() checks if origin differs. For localhost:3100 with baseUrl like '/webr_core_v3/'
// Se() would evaluate: same host, same port, same protocol → returns false
// So it creates Worker directly with new Worker(url)
// The Worker then runs importScripts(baseUrl + 'R.js') = importScripts('/webr_core_v3/R.js')
// This is served by Next.js dev server

// Let's check what Next.js serves for /webr_core_v3/R.js
console.log('\n=== Testing if Next.js correctly serves R.js ===');
console.log('(run manually: fetch http://localhost:3100/webr_core_v3/R.js and check Content-Type)');

// Check if there's a next.config.js rule that could interfere
const nextConfig = fs.readFileSync('next.config.js', 'utf8');
// Check for rewrites/redirects that could affect webr paths
const webrConfig = nextConfig.match(/webr[^}]{0,500}/gi);
console.log('\nnext.config.js webr references:');
if (webrConfig) webrConfig.forEach((r, i) => console.log(`[${i}]:`, r.slice(0, 200)));
