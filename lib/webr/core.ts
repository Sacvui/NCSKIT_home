import { WebR } from 'webr';
import { translateRError } from './utils';
import { getCachedWebRState, setCachedWebRState } from './cache';
import { getRequiredPackages, isPackageLoaded, markPackageLoaded } from './package-registry';

let webRInstance: WebR | null = null;
let isInitializing = false;
let initPromise: Promise<WebR> | null = null;
let initProgress: string = '';
let onProgressCallback: ((msg: string) => void) | null = null;
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 3;

// Error recovery state
let lastError: Error | null = null;

/**
 * Standardized path for WebR assets in production
 * Using 'webr_core_v2' to bypass aggressive browser caching
 */
const BASE_URL = '/webr_core_v2/';

// Get current WebR loading status
export function getWebRStatus(): {
    isReady: boolean;
    isLoading: boolean;
    progress: string;
    lastError: string | null;
    canRetry: boolean;
} {
    return {
        isReady: webRInstance !== null,
        isLoading: isInitializing,
        progress: initProgress,
        lastError: lastError?.message || null,
        canRetry: initAttempts < MAX_INIT_ATTEMPTS && !isInitializing
    };
}

// Set callback for progress updates
export function setProgressCallback(callback: (msg: string) => void) {
    onProgressCallback = callback;
}

/**
 * Internal helper to update progress
 */
function updateProgress(msg: string): void {
    initProgress = msg;
    if (onProgressCallback) {
        onProgressCallback(msg);
    }
}

/**
 * Reset WebR instance and clear error state
 */
export function resetWebR(): void {
    webRInstance = null;
    isInitializing = false;
    initPromise = null;
    initProgress = '';
    lastError = null;
    initAttempts = 0;
    updateProgress('WebR reset - ready for reinitialization');
}

/**
 * Force clear the persistent storage and reset flags
 */
export async function clearWebRStorage(): Promise<void> {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('webr_fs_broken');
    }
    
    // Clear IndexedDB 'WebR' database if possible
    if (typeof window !== 'undefined' && window.indexedDB) {
        try {
            console.log('[WebR] Deleting ALL IndexedDB databases to ensure a fresh WebR file system...');
            const idb: any = window.indexedDB;
            if (typeof idb.databases === 'function') {
                const dbs = await idb.databases();
                dbs.forEach((db: any) => {
                    if (db.name) {
                        try {
                            idb.deleteDatabase(db.name);
                            console.log(`[WebR] Deleted DB: ${db.name}`);
                        } catch(e) {}
                    }
                });
            } else {
                // Fallback for older browsers: WebR typically uses these names
                idb.deleteDatabase('emscripten_fs');
                idb.deleteDatabase('webr_fs');
                idb.deleteDatabase('IDBFS');
            }
        } catch (e) {
            console.warn('[WebR] Could not flag storage for wipe:', e);
        }
    }
    
    resetWebR();
    window.location.reload(); // Hard reload is safest after storage wipe
}

/**
 * Initialize WebR instance (singleton with promise caching and retry logic)
 */
export async function initWebR(maxRetries: number = 3): Promise<WebR> {
    if (webRInstance) return webRInstance;
    if (initPromise) return initPromise;

    isInitializing = true;
    updateProgress('R-Engine Loading...');

    initPromise = (async () => {
        isInitializing = true;
        updateProgress('⚙️ Đang khởi động R-Engine...');
        const startTime = performance.now();

        const initTimeout = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('R-Engine initialization timed out (180s)')), 180000)
        );

        const performInit = (async (): Promise<WebR> => {
            try {
                // Use the standardized webr_core folder for consistent resolution
                const webR = new WebR({
                    baseUrl: BASE_URL,
                    // channelType 3 = PostMessage: required for IDBFS (permanent package caching)
                    // If set to 0 (Auto) with strict security headers, it will pick SharedArrayBuffer (1),
                    // which completely disables IDBFS and forces re-downloading 30MB of libraries every time.
                    channelType: 3,
                    serviceWorkerUrl: '/webr-serviceworker.js'
                });

                // SW registration
                if (typeof window !== 'undefined' && navigator.serviceWorker) {
                    try {
                        await navigator.serviceWorker.register('/webr-serviceworker.js');
                    } catch (e) {
                        console.warn('[WebR] SW Register failed:', e);
                    }
                }

                console.log('[WebR] Calling webR.init()...');
                await webR.init();
                const persistentLib = '/home/web_user/library';

                // Prepare Storage with Sanity Check
                updateProgress('📂 Đang kết nối bộ nhớ...');
                let storageSane = false;

                // Handle manual wipe request
                if (typeof localStorage !== 'undefined' && localStorage.getItem('webr_fs_wipe_requested') === 'true') {
                    console.warn('[WebR] Force wipe requested. Resetting persistent storage...');
                    localStorage.removeItem('webr_fs_wipe_requested');
                    localStorage.removeItem('webr_fs_broken');
                }

                // Auto-heal legacy false-positive corruption flags
                const isFsBroken = false;
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem('webr_fs_broken');
                }

                try {
                    // Ensure recursive-like folder creation
                    try { await webR.FS.mkdir('/home/web_user'); } catch (e) {}
                    try { await webR.FS.mkdir(persistentLib); } catch (e) {}
                    
                    if (!isFsBroken) {
                        console.log('[WebR] Attempting to mount IDBFS storage...');
                        await webR.FS.mount('IDBFS', {}, persistentLib);
                        await webR.FS.syncfs(true);
                        
                        // Sanity check for IDBFS
                        await webR.evalR(`writeLines("sane", "${persistentLib}/sanity.txt")`);
                        const sanity = await webR.evalR(`readLines("${persistentLib}/sanity.txt")`);
                        const sanityVal = unpackWebRObject(await sanity.toJs());
                        
                        if (sanityVal === "sane") {
                            storageSane = true;
                            console.log('[WebR] IDBFS Sanity check passed! Storage is healthy.');
                            // SELF-HEALING: If it's working now, remove the broken flag if it existed
                            if (typeof localStorage !== 'undefined' && localStorage.getItem('webr_fs_broken')) {
                                console.log('[WebR] Clearing previous corruption flag. High-speed caching restored.');
                                localStorage.removeItem('webr_fs_broken');
                            }
                        }
                    } else {
                        console.warn('[WebR] Skipping IDBFS due to previous corruption flag. Performance will be degraded.');
                    }
                } catch (fsErr) {
                    console.warn('[WebR] IDBFS mount or sanity check failed:', fsErr);
                    try { await webR.FS.unmount(persistentLib); } catch(u) {}
                    // If we tried to use IDBFS and it failed, flag it (unless already flagged)
                    if (!isFsBroken && typeof localStorage !== 'undefined') {
                        localStorage.setItem('webr_fs_broken', 'true');
                    }
                }
                
                if (!storageSane) {
                    console.warn('[WebR] Falling back to slow memory-only mode. Every page load will require re-downloading packages.');
                }

                // 2. Configure Environment
                updateProgress('🛠️ Cấu hình hệ thống...');
                await webR.evalR(`
                    if (dir.exists("${persistentLib}")) {
                        .libPaths(c('${persistentLib}', .libPaths()))
                    }
                    
                    # Resilience: Use R-Universe which has 4.5 binaries
                    options(repos = c(
                        CRAN = "https://cran.r-universe.dev",
                        WASM = "https://repo.r-wasm.org"
                    ))
                    
                    # Core configuration for WASM
                    options(pkgType = "binary")
                    options(mc.cores = 1)
                    
                    # Pre-check psych existence
                    psych_exists <- dir.exists("${persistentLib}/psych")
                    
                    # Check R version for diagnostics
                    r_version <- paste0(R.version$major, ".", R.version$minor)
                `);

                const rVersionObj = await webR.evalR('r_version');
                const rVersion = unpackWebRObject(await rVersionObj.toJs());
                console.log(`[WebR] R Engine Version: ${rVersion}`);

                // 3. Load or Install Psych (Critical Core)
                updateProgress('📦 Đang thiết lập công cụ...');
                const existsProxy = await webR.evalR('psych_exists');
                const existsVal = unpackWebRObject(await existsProxy.toJs());
                if (existsProxy && typeof (existsProxy as any).destroy === 'function') (existsProxy as any).destroy();

                if (existsVal === true) {
                    try {
                        console.log('[WebR] Loading psych from persistent lib...');
                        await webR.evalR('library(psych)');
                        markPackageLoaded('psych');
                    } catch (e) {
                        console.warn('[WebR] Psych loading failed! Wiping library folder...', e);
                        updateProgress('🧹 Đang làm sạch bộ nhớ...');
                        try {
                            await webR.evalR(`
                                unlink("${persistentLib}", recursive = TRUE)
                                dir.create("${persistentLib}", recursive = TRUE)
                            `);
                            await webR.FS.syncfs(false); 
                        } catch (wipeErr) {
                            console.error('[WebR] Wipe failed:', wipeErr);
                        }
                        
                        try {
                            updateProgress('🌐 Đang tải lại thư viện...');
                            console.log('[WebR] Attempting re-install of psych...');
                            await webR.evalR(`webr::install("psych", lib="${persistentLib}")`);
                            await webR.evalR('library(psych)');
                            markPackageLoaded('psych');
                            await webR.FS.syncfs(false);
                        } catch(reInstallErr) {
                            console.error('[WebR] Re-install failed:', reInstallErr);
                            throw new Error("Không thể khởi tạo thư viện R. Vui lòng bấm 'Khôi phục ngay'.");
                        }
                    }
                } else {
                    updateProgress('🌐 Đang tải thư viện R (lần đầu)...');
                    console.log('[WebR] Initial installation of psych...');
                    try {
                        await webR.evalR(`webr::install("psych", lib="${persistentLib}")`);
                        await webR.evalR('library(psych)');
                        markPackageLoaded('psych');
                        await webR.FS.syncfs(false);
                    } catch (installErr) {
                        console.error('[WebR] Initial install failed:', installErr);
                        // Emergency fallback to 4.4 if R-Universe 4.5 also fails (unlikely now)
                        await webR.evalR(`
                            message("Standard install failed, trying emergency 4.4 fallback...")
                            install.packages("psych", lib="${persistentLib}", repos=NULL, 
                                             contriburl="https://repo.r-wasm.org/bin/emscripten/contrib/4.4", 
                                             type="binary", dependencies=TRUE)
                        `);
                        await webR.evalR('library(psych)');
                        markPackageLoaded('psych');
                        await webR.FS.syncfs(false);
                    }
                }

                const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
                console.log(`[WebR] Engine Loaded in ${elapsed}s`);
                updateProgress('✅ R-Engine sẵn sàng');
                
                webRInstance = webR;
                isInitializing = false;
                initAttempts = 0;
                return webRInstance;

            } catch (error: any) {
                console.error('[WebR] Init Failure:', error);
                isInitializing = false;
                initPromise = null;
                lastError = error;
                initAttempts++;
                updateProgress('❌ Lỗi khởi tạo R-Engine');
                throw error;
            }
        });

        return Promise.race([performInit(), initTimeout]);
    })();

    return initPromise;
}

/**
 * Load packages on-demand for specific analysis method
 */
export async function loadPackagesForMethod(method: string): Promise<void> {
    const webR = await initWebR();
    const required = getRequiredPackages(method);

    for (const pkg of required) {
        if (isPackageLoaded(pkg)) continue;

        try {
            updateProgress(`Installing ${pkg}...`);
            await webR.installPackages([pkg]);
            await webR.evalR(`library(${pkg})`);
            markPackageLoaded(pkg);
        } catch (error) {
            console.error(`Failed to load ${pkg}:`, error);
        }
    }
}

/**
 * Recursively unpacks WebR objects
 */
function unpackWebRObject(obj: any): any {
    if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(unpackWebRObject);

    if (obj.type && obj.values !== undefined) {
        if (Array.isArray(obj.values)) {
            if (obj.values.length === 1) return unpackWebRObject(obj.values[0]);
            return obj.values.map(unpackWebRObject);
        }
        return unpackWebRObject(obj.values);
    }

    if (obj.type === 'list' && obj.names && obj.values) {
        const result: any = {};
        for (let i = 0; i < obj.names.length; i++) {
            result[obj.names[i]] = unpackWebRObject(obj.values[i]);
        }
        return result;
    }

    const result: any = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) result[key] = unpackWebRObject(obj[key]);
    }
    return result;
}

/**
 * High-reliability R executor for production with Self-Healing packages
 */
export async function executeRWithRecovery(
    rCode: string,
    method?: string,
    retryCount: number = 0,
    maxRetries: number = 2,
    timeoutMs: number = 120000,
    csvData?: number[][] 
): Promise<any> {
    const webR = await initWebR();

    try {
        if (method) await loadPackagesForMethod(method);

        // ============================================================================
        // BULLETPROOF STRING BUILDER (BYPASSES WEBR BLOB/TYPEDARRAY CRASH)
        // Limits every single postMessage payload to 500 bytes.
        // ============================================================================
        const buildAndEvalLargeString = async (largeStr: string) => {
            const MAX_CHUNK = 500;
            await webR.evalR(`ncs_script_buf <- ""`);
            for (let i = 0; i < largeStr.length; i += MAX_CHUNK) {
                const chunk = largeStr.substring(i, i + MAX_CHUNK);
                const safeChunk = chunk
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"')
                    .replace(/\n/g, '\\n')
                    .replace(/\r/g, '\\r')
                    .replace(/\t/g, '\\t');
                await webR.evalR(`ncs_script_buf <- paste0(ncs_script_buf, "${safeChunk}")`);
            }
            return await webR.evalR(`eval(parse(text=ncs_script_buf))`);
        };

        if (csvData && csvData.length > 0) {
            const cols = csvData[0].length;
            const flat = csvData.flat().map(v => (v === null || v === undefined || Number.isNaN(v as number)) ? 'NA' : v).join(',');
            const matBuilder = `raw_data <- matrix(c(${flat}), ncol=${cols}, byrow=TRUE)`;
            await buildAndEvalLargeString(matBuilder);
        }

        let rResultPromise;
        if (rCode.length > 500) {
            rResultPromise = buildAndEvalLargeString(rCode);
        } else {
            rResultPromise = webR.evalR(rCode);
        }

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout after ${timeoutMs / 1000}s`)), timeoutMs)
        );

        const rResult: any = await Promise.race([rResultPromise, timeoutPromise]);
        const output = await rResult.toJs();

        if (rResult && typeof (rResult as any).destroy === 'function') {
            (rResult as any).destroy();
        }

        return output;
    } catch (error: any) {
        const errorMsg = error?.message || String(error);

        console.warn('[WebR] Execution Error:', errorMsg);

        // Recursive evaluation error is fatal to the current worker state -> Force Restart
        if (errorMsg.includes('promise already under evaluation') || 
            errorMsg.includes('FileReaderSync') || 
            errorMsg.includes('Blob')) {
             console.error('[WebR] Fatal R state. Resetting engine...');
             resetWebR(); // Clear the hung instance
             throw new Error("Hệ thống R đang bận. Tôi đã tự động khởi động lại, vui lòng thực hiện lại phân tích sau vài giây.");
        }

        // SELF-HEALING for missing packages
        if (errorMsg.includes('there is no package called') && retryCount < maxRetries) {
            const match = errorMsg.match(/no package called .(.*)./);
            const missingPkg = match ? match[1] : null;

            if (missingPkg) {
                console.warn(`Auto-installing missing package: ${missingPkg}`);
                updateProgress(`Setting up ${missingPkg}...`);
                await webR.installPackages([missingPkg]);
                markPackageLoaded(missingPkg);
                return executeRWithRecovery(rCode, method, retryCount + 1, maxRetries, timeoutMs, csvData);
            }
        }

        if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            return executeRWithRecovery(rCode, method, retryCount + 1, maxRetries, timeoutMs, csvData);
        }

        throw error;
    }
}
