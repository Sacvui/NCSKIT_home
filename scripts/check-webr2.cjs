const fs = require('fs');

// Check how PostMessage channel works in webr 0.5.8
const webrMjs = fs.readFileSync('node_modules/webr/dist/webr.mjs', 'utf8');

// Find the PostMessage channel class
const pmStart = webrMjs.indexOf('PostMessage');
console.log('=== PostMessage Channel Analysis ===');

// Find channel creation function (cr)
const crMatch = webrMjs.match(/function\s+cr\s*\([^)]*\)\s*\{[^}]{0,1000}/);
if (crMatch) console.log('cr function:', crMatch[0].slice(0, 500));

// Find the channelType switch/if
const ctMatch = webrMjs.match(/channelType[^;]{0,500}/g);
if (ctMatch) {
    console.log('\n=== ChannelType References ===');
    ctMatch.forEach((m, i) => console.log(`[${i}]:`, m.slice(0, 200)));
}

// Check enum values
const enumMatch = webrMjs.match(/var U;[^;]+;/g) || webrMjs.match(/\(function\s*\(U\)[^}]+\}/);
if (enumMatch) console.log('\n=== ChannelType Enum ===', enumMatch[0]);

// Find numeric channel type mapping  
const numMatch = webrMjs.match(/U\[[^\]]*\]\s*=\s*\d/g);
console.log('\n=== Enum Values ===', numMatch);

// Check if PostMessage needs ServiceWorker
const pmSection = webrMjs.slice(
    webrMjs.indexOf('class extends ne{constructor(t){super();this.close=()=>{};this.emit=()=>{}'),
    webrMjs.indexOf('class extends ne{constructor(t){super();this.close=()=>{};this.emit=()=>{}') + 2000
);
console.log('\n=== PostMessage Channel Constructor ===');
console.log(pmSection.slice(0, 500));

// Check what Se() function does (used to detect if baseUrl is a blob)
const seMatch = webrMjs.match(/function\s+Se\s*\([^)]*\)\s*\{[^}]+\}/);
if (seMatch) console.log('\n=== Se() function ===', seMatch[0]);

// Check ee() function (worker loader)
const eeMatch = webrMjs.match(/function\s+ee\s*\([^)]*\)\s*\{[^}]{0,1000}/);
if (eeMatch) console.log('\n=== ee() worker loader ===', eeMatch[0].slice(0, 500));
