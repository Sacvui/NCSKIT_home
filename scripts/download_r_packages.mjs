import fs from 'fs';
import path from 'path';
import https from 'https';

const R_VERSION = '4.5';
const BASE_PKG_URL = `https://repo.r-wasm.org/bin/emscripten/contrib/${R_VERSION}`;
const TARGET_DIR = path.join(process.cwd(), 'public', 'webr_repo_v3', 'bin', 'emscripten', 'contrib', R_VERSION);

// Essential packages and their recursive dependencies for 'psych'
const PACKAGES = [
  'psych',
  'jsonlite',
  'mnormt',
  'lattice',
  'nlme',
  'foreign',
  'GPArotation'
];

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle Redirects (301, 302)
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function start() {
  console.log('🚀 Starting WebR package local bundling...');
  
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // 1. Download PACKAGES index file (WebR needs this to find versions)
  console.log('📥 Downloading PACKAGES index...');
  try {
    await downloadFile(`${BASE_PKG_URL}/PACKAGES`, path.join(TARGET_DIR, 'PACKAGES'));
    await downloadFile(`${BASE_PKG_URL}/PACKAGES.gz`, path.join(TARGET_DIR, 'PACKAGES.gz'));
  } catch (e) {
    console.error('❌ Failed to download index files:', e.message);
    return;
  }

  // 2. Read PACKAGES file to get exact filenames (with versions)
  const packagesContent = fs.readFileSync(path.join(TARGET_DIR, 'PACKAGES'), 'utf8');
  
  for (const pkgName of PACKAGES) {
    // Find the line that starts with "Package: pkgName" and subsequent "File: ..."
    const pkgMatch = packagesContent.match(new RegExp(`Package: ${pkgName}\\nVersion: (.*?)\\n`, 's'));
    if (pkgMatch) {
      const version = pkgMatch[1].trim();
      const filename = `${pkgName}_${version}.tgz`;
      console.log(`📦 Downloading ${filename}...`);
      
      try {
        await downloadFile(`${BASE_PKG_URL}/${filename}`, path.join(TARGET_DIR, filename));
        console.log(`✅ Saved ${pkgName}`);
      } catch (e) {
        console.error(`❌ Failed to download ${pkgName}:`, e.message);
      }
    } else {
      console.warn(`⚠️ Could not find ${pkgName} in PACKAGES index.`);
    }
  }

  console.log('\n✨ WebR packages are now hosted locally in /public/webr_repo_v3!');
  console.log('You can now use: options(repos = c(CRAN = window.location.origin + "/webr_packages"))');
}

start();
