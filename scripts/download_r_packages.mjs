import fs from 'fs';
import path from 'path';
import https from 'https';

const R_VERSION = '4.5';
const FALLBACK_VERSION = '4.4';
const BASE_PKG_URL = `https://repo.r-wasm.org/bin/emscripten/contrib/${R_VERSION}`;
const MAIN_PKG_URL = `https://repo.r-wasm.org/bin/emscripten/main/${R_VERSION}`;
const FALLBACK_PKG_URL = `https://repo.r-wasm.org/bin/emscripten/contrib/${FALLBACK_VERSION}`;
const TARGET_DIR = path.join(process.cwd(), 'public', 'webr_repo_v3', 'bin', 'emscripten', 'contrib', R_VERSION);

// Essential packages and their recursive dependencies
const PACKAGES = [
  'psych',
  'jsonlite',
  'mnormt',
  'lattice',
  'nlme',
  'foreign',
  'GPArotation',
  'lavaan',
  'quadprog',
  'MASS',
  'pbivnorm',
  'numDeriv',
  'cluster',
  'boot',
  'class',
  'nnet',
  'rpart',
  'survival'
];

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
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
    }).on('on_error', (err) => {
      reject(err);
    });
  });
}

async function downloadWithRetry(url, dest, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await downloadFile(url, dest);
      return true;
    } catch (err) {
      if (i === retries - 1) return false;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  return false;
}

async function start() {
  console.log('[WebR Bundler] Starting WebR package local bundling...');
  
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // 1. Download PACKAGES index files
  console.log('[WebR Bundler] Downloading PACKAGES index files...');
  
  let combinedPackages = '';
  for (const baseUrl of [BASE_PKG_URL, MAIN_PKG_URL]) {
    const tempPackagesPath = path.join(TARGET_DIR, `PACKAGES_${baseUrl.includes('main') ? 'main' : 'contrib'}`);
    const success = await downloadWithRetry(`${baseUrl}/PACKAGES`, tempPackagesPath);
    if (success) {
      combinedPackages += fs.readFileSync(tempPackagesPath, 'utf8') + '\n';
      if (baseUrl === BASE_PKG_URL) {
          fs.copyFileSync(tempPackagesPath, path.join(TARGET_DIR, 'PACKAGES'));
          await downloadWithRetry(`${baseUrl}/PACKAGES.gz`, path.join(TARGET_DIR, 'PACKAGES.gz'));
          await downloadWithRetry(`${baseUrl}/PACKAGES.rds`, path.join(TARGET_DIR, 'PACKAGES.rds'));
      }
    }
  }
  
  // Download FALLBACK index
  const fallbackPath = path.join(TARGET_DIR, 'PACKAGES_fallback');
  let fallbackPackages = '';
  if (await downloadWithRetry(`${FALLBACK_PKG_URL}/PACKAGES`, fallbackPath)) {
      fallbackPackages = fs.readFileSync(fallbackPath, 'utf8');
  }

  console.log('[WebR Bundler] Index files processed');

  // 2. Download each package
  for (const pkgName of PACKAGES) {
    // Find in combined packages (4.5)
    let pkgMatch = combinedPackages.match(new RegExp(`Package: ${pkgName}\\r?\\nVersion: (.*?)\\r?\\n`, 's'));
    let currentBaseUrl = null;
    let version = null;

    if (pkgMatch) {
        version = pkgMatch[1].trim();
        // Determine which 4.5 repo it was in
        // Simplified: try contrib then main
    } else {
        // Try fallback (4.4)
        console.log(`[WebR Bundler] ${pkgName} not found in 4.5, trying 4.4 fallback...`);
        pkgMatch = fallbackPackages.match(new RegExp(`Package: ${pkgName}\\r?\\nVersion: (.*?)\\r?\\n`, 's'));
        if (pkgMatch) {
            version = pkgMatch[1].trim();
            currentBaseUrl = FALLBACK_PKG_URL;
        }
    }
    
    if (pkgMatch) {
      const filename = `${pkgName}_${version}.tgz`;
      let downloaded = false;

      const sources = currentBaseUrl ? [currentBaseUrl] : [BASE_PKG_URL, MAIN_PKG_URL];
      
      for (const baseUrl of sources) {
          console.log(`[WebR Bundler] Trying ${pkgName} v${version} from ${baseUrl}...`);
          if (await downloadWithRetry(`${baseUrl}/${filename}`, path.join(TARGET_DIR, filename))) {
              console.log(`[WebR Bundler] Saved ${pkgName} v${version}`);
              downloaded = true;
              break;
          }
      }
      
      if (!downloaded) {
          console.error(`[WebR Bundler] FAILED to download ${pkgName} from all sources`);
      }
    } else {
      console.warn(`[WebR Bundler] Could not find ${pkgName} in any PACKAGES index.`);
    }
  }

  console.log('\n[WebR Bundler] Local WebR repository updated successfully!');
}

start();
