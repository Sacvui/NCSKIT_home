import { WebR } from 'webr';
import { translateRError } from './utils';
import { getCachedWebRState, setCachedWebRState } from './cache';
import { getRequiredPackages, isPackageLoaded, markPackageLoaded, resetLoadedPackages } from './package-registry';
import { logger } from '@/utils/logger';
import { captureWebRError } from '@/lib/monitoring';

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
 * Mutex for R evaluations to prevent concurrency issues
 * (Critical for PostMessage channel)
 */
let evaluationLock: Promise<void> = Promise.resolve();

/**
 * Optimized helper to run a task with the evaluation lock
 */
async function runLocked<T>(task: () => Promise<T>): Promise<T> {
    const previousLock = evaluationLock;
    let resolveLock: () => void;
    evaluationLock = new Promise(resolve => { resolveLock = resolve; });
    
    try {
        await previousLock;
        return await task();
    } finally {
        // @ts-ignore
        resolveLock!();
    }
}

/**
 * Standardized path for WebR assets in production
 * Using 'webr_core_v3' to bypass aggressive browser caching
 */
const BASE_URL = '/webr_core_v3/';

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
    // Flush the lock
    evaluationLock = Promise.resolve();
    // CRITICAL: Clear package registry — new R session has no packages loaded
    // Without this, loadPackagesForMethod() skips install thinking packages exist
    resetLoadedPackages();
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
            logger.debug('[WebR] Deleting ALL IndexedDB databases to ensure a fresh WebR file system...');
            const idb: any = window.indexedDB;
            if (typeof idb.databases === 'function') {
                const dbs = await idb.databases();
                dbs.forEach((db: any) => {
                    if (db.name) {
                        try {
                            idb.deleteDatabase(db.name);
                            logger.debug(`[WebR] Deleted DB: ${db.name}`);
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
            logger.warn('[WebR] Could not flag storage for wipe:', e);
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
                    // MUST BE Channel 3 (PostMessage) to support IDBFS persistent storage caching!
                    // SharedArrayBuffer (Channel 0) DOES NOT support IDBFS asynchronous I/O yet.
                    channelType: 3,
                });

                // UNREGISTER old broken service workers that intercept WebR requests
                if (typeof window !== 'undefined' && navigator.serviceWorker) {
                    try {
                        const regs = await navigator.serviceWorker.getRegistrations();
                        for (let reg of regs) {
                            if (reg.active?.scriptURL.includes('webr')) {
                                await reg.unregister();
                                logger.info('[WebR] Unregistered broken ServiceWorker cache.');
                            }
                        }
                    } catch (e) {
                        logger.warn('[WebR] Error unregistering SW:', e);
                    }
                }

                logger.debug('[WebR] Calling webR.init()...');
                await webR.init();
                const persistentLib = '/home/web_user/library';

                // Prepare Storage with Sanity Check
                updateProgress('📂 Đang kết nối bộ nhớ...');
                let storageSane = false;

                // Handle manual wipe request
                if (typeof localStorage !== 'undefined' && localStorage.getItem('webr_fs_wipe_requested') === 'true') {
                    logger.warn('[WebR] Force wipe requested. Resetting persistent storage...');
                    localStorage.removeItem('webr_fs_wipe_requested');
                    localStorage.removeItem('webr_fs_broken');
                }

                // Auto-heal legacy false-positive corruption flags
                const isFsBroken = typeof localStorage !== 'undefined' ? localStorage.getItem('webr_fs_broken') === 'true' : false;

                try {
                    // Ensure recursive-like folder creation
                    try { await webR.FS.mkdir('/home/web_user'); } catch (e) {}
                    try { await webR.FS.mkdir(persistentLib); } catch (e) {}
                    
                    logger.debug('[WebR] Attempting to mount IDBFS storage...');
                    await webR.FS.mount('IDBFS', {}, persistentLib);
                    await webR.FS.syncfs(true);

                    // If flagged as completely corrupted by a fatal `FileReaderSync` error, Nuke the folder.
                    if (isFsBroken) {
                        logger.warn('[WebR] FATAL CORRUPTION DETECTED! Nuking IDBFS to restore high-speed cache...');
                        try {
                            await webR.evalR(`unlink("${persistentLib}", recursive = TRUE); dir.create("${persistentLib}", recursive = TRUE)`);
                            await webR.FS.syncfs(false); // Commit the wipe to IndexedDB
                            if (typeof localStorage !== 'undefined') localStorage.removeItem('webr_fs_broken');
                            logger.debug('[WebR] Wipe successful! Fresh DB ready.');
                        } catch (e) {
                            logger.error('[WebR] Failed to wipe corrupted IDBFS:', e);
                        }
                    }    
                    // Sanity check for IDBFS
                    await webR.evalR(`writeLines("sane", "${persistentLib}/sanity.txt")`);
                    const sanity = await webR.evalR(`readLines("${persistentLib}/sanity.txt")`);
                    const sanityVal = unpackWebRObject(await sanity.toJs());
                    
                    if (sanityVal === "sane") {
                        storageSane = true;
                        logger.debug('[WebR] IDBFS Sanity check passed! Storage is healthy.');
                    } else {
                        throw new Error('[WebR] IDBFS Sanity check failed - incorrect value read back');
                    }
                } catch (fsErr) {
                    logger.warn('[WebR] IDBFS mount or sanity check failed:', fsErr);
                    try { await webR.FS.unmount(persistentLib); } catch(u) {}
                    // Only flag as broken for actual IDBFS mount/IO failures
                    // NOT for race conditions (FileReaderSync) which are handled separately
                    const errMsg = String(fsErr);
                    const isRealIDBFSFailure = errMsg.includes('IDBFS') || errMsg.includes('mount') || 
                                               errMsg.includes('syncfs') || errMsg.includes('sanity');
                    if (isRealIDBFSFailure && typeof localStorage !== 'undefined') {
                        localStorage.setItem('webr_fs_broken', 'true');
                    }
                }
                
                if (!storageSane) {
                    logger.warn('[WebR] Falling back to slow memory-only mode. Every page load will require re-downloading packages.');
                }

                const fallbackRepo = "https://repo.r-wasm.org/";
                const localRepo = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin + "/webr_repo_v2" : "https://ncskit.org/webr_repo_v2";
                logger.debug(`[WebR] Using repositories. Local: ${localRepo} Official: ${fallbackRepo}`);

                await runLocked(async () => {
                    await webR.evalR(`
                        if (dir.exists("${persistentLib}")) {
                            .libPaths(c('${persistentLib}', .libPaths()))
                        }
                        
                        # Set repo to official CRAN WebR mirror
                        options(repos = c(CRAN = "https://repo.r-wasm.org/"))
                        
                        # Core configuration for WASM
                        options(pkgType = "binary")
                        options(warn = -1) # Suppress minor warnings like missing .rds files
                        options(webr.repo_quiet = TRUE) # Silence repo download warnings
                        options(timeout = 300) # 5 minute timeout
                        
                        # Prevent R from trying to download .rds if it fails once
                        # This helps avoid the "Download failed" flood in console
                        options(download.file.extra = "--no-cache") 
                        
                        # Pre-check psych existence
                        psych_exists <- dir.exists("${persistentLib}/psych")
                        
                        # Check R version for diagnostics
                        r_version <- paste0(R.version$major, ".", R.version$minor)
                    `);
                });

                const rVersionObj = await runLocked(() => webR.evalR('r_version'));
                const rVersion = unpackWebRObject(await rVersionObj.toJs());
                logger.debug(`[WebR] R Engine Version: ${rVersion}`);

                // 3. Load or Install Core Packages
                updateProgress('📦 Đang thiết lập công cụ...');
                const existsProxy = await runLocked(() => webR.evalR('psych_exists'));
                const existsVal = unpackWebRObject(await existsProxy.toJs());
                if (existsProxy && typeof (existsProxy as any).destroy === 'function') (existsProxy as any).destroy();

                const corePackages = ['psych', 'jsonlite', 'mnormt', 'GPArotation', 'lattice', 'nlme'];

                if (existsVal === true) {
                    try {
                        logger.debug('[WebR] Loading core libraries from persistent lib...');
                        await runLocked(() => webR.evalR('library(psych); library(jsonlite)'));
                        // Success! Mark ALL as loaded to prevent redundant checks later
                        corePackages.forEach(pkg => markPackageLoaded(pkg));
                    } catch (e) {
                        logger.warn('[WebR] Core loading failed! Wiping library folder...', e);
                        updateProgress('🧹 Đang làm sạch bộ nhớ...');
                        try {
                            await runLocked(() => webR.evalR(`unlink("${persistentLib}", recursive = TRUE); dir.create("${persistentLib}", recursive = TRUE)`));
                            await webR.FS.syncfs(false); 
                        } catch (wipeErr) {}
                        
                        try {
                            updateProgress('🌐 Đang tải lại thư viện...');
                            logger.debug('[WebR] Attempting re-install of core libraries from official repo:', fallbackRepo);
                            // Try local repo first, fallback to official CRAN mirror
                            await runLocked(async () => {
                                const installCmd = `
                                    suppressWarnings(tryCatch({
                                        webr::install("psych", repos="${localRepo}", lib="${persistentLib}")
                                    }, error = function(e) {
                                        webr::install("psych", repos="${fallbackRepo}", lib="${persistentLib}")
                                    }))
                                `;
                                await webR.evalR(installCmd);
                                await webR.evalR(`
                                    suppressWarnings(tryCatch({
                                        webr::install("jsonlite", repos="${localRepo}", lib="${persistentLib}")
                                    }, error = function(e) {
                                        webr::install("jsonlite", repos="${fallbackRepo}", lib="${persistentLib}")
                                    }))
                                `);
                                await webR.evalR('library(psych); library(jsonlite)');
                            });
                            corePackages.forEach(pkg => markPackageLoaded(pkg));
                            await webR.FS.syncfs(false);
                        } catch(reInstallErr) {
                            logger.error('[WebR] Re-install failed:', reInstallErr);
                        }
                    }
                } else {
                    updateProgress('🌐 Đang tải thư viện R (lần đầu)...');
                    logger.debug('[WebR] Initial installation of core libraries from official CRAN mirror:', fallbackRepo);
                    try {
                        await runLocked(async () => {
                            // Try local repo first, fallback to official CRAN mirror
                            const installCmd = `
                                    suppressWarnings(tryCatch({
                                        webr::install("psych", repos="${localRepo}", lib="${persistentLib}")
                                    }, error = function(e) {
                                        webr::install("psych", repos="${fallbackRepo}", lib="${persistentLib}")
                                    }))
                                `;
                            await webR.evalR(installCmd);
                            await webR.evalR(`
                                    suppressWarnings(tryCatch({
                                        webr::install("jsonlite", repos="${localRepo}", lib="${persistentLib}")
                                    }, error = function(e) {
                                        webr::install("jsonlite", repos="${fallbackRepo}", lib="${persistentLib}")
                                    }))
                                `);
                            await webR.evalR('library(psych); library(jsonlite)');
                        });
                        corePackages.forEach(pkg => markPackageLoaded(pkg));
                        await webR.FS.syncfs(false);
                    } catch (installErr) {
                        logger.error('[WebR] Initial install failed from local repo:', installErr);
                    }
                }

                const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
                logger.debug(`[WebR] Engine Loaded in ${elapsed}s`);
                updateProgress('✅ R-Engine sẵn sàng');
                
                webRInstance = webR;
                isInitializing = false;
                initAttempts = 0;
                return webRInstance;

            } catch (error: any) {
                logger.error('[WebR] Init Failure:', error);
                // Report to Sentry with WebR context
                captureWebRError(error, {
                    phase: 'init',
                    browser: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : undefined,
                });
                isInitializing = false;
                initPromise = null;
                lastError = error;
                initAttempts++;
                updateProgress('âŒ Lá»—i khá»Ÿi táº¡o R-Engine');
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
    const officialRepo = "https://repo.r-wasm.org/";
    const localRepo = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin + "/webr_repo_v2" : "https://ncskit.org/webr_repo_v2";

    for (const pkg of required) {
        if (isPackageLoaded(pkg)) continue;

        try {
            updateProgress(`Installing ${pkg}...`);
            await runLocked(async () => {
                // Use local repo first, fallback to official CRAN mirror
                await webR.evalR(`
                    if (!require("${pkg}", character.only = TRUE, quietly = TRUE)) {
                        suppressWarnings(tryCatch({
                            webr::install("${pkg}", repos="${localRepo}")
                        }, error = function(e) {
                            webr::install("${pkg}", repos="${officialRepo}")
                        }))
                        library("${pkg}", character.only = TRUE)
                    }
                `);
            });
            markPackageLoaded(pkg);
        } catch (error) {
            logger.error(`Failed to load ${pkg}:`, error);
        }
    }
}

/**
 * Recursively unpacks WebR objects
 */
function unpackWebRObject(obj: any): any {
    if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
    
    // Prevent recursion on binary buffers/typed arrays (which are objects but should be treated as values)
    if (obj instanceof Uint8Array || obj instanceof Uint16Array || obj instanceof Uint32Array || 
        obj instanceof Int8Array || obj instanceof Int16Array || obj instanceof Int32Array || 
        obj instanceof Float32Array || obj instanceof Float64Array) {
        return obj;
    }

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
        // NOTE: Callers (runCronbachAlpha, runEFA, etc.) already call loadPackagesForMethod
        // before executeRWithRecovery. Only load here if method is provided AND packages
        // are not yet loaded (avoids double runLocked() calls).
        if (method) {
            const required = getRequiredPackages(method);
            const needsLoad = required.some(pkg => !isPackageLoaded(pkg));
            if (needsLoad) await loadPackagesForMethod(method);
        }

        // Prepare CSV data outside the lock (encoding is CPU-only, no WebR channel needed)
        // NOTE: csvEncoded removed in v2.9.0 — data now injected via evalR, not FS.writeFile
        if (csvData && csvData.length > 0) {
            updateProgress('📊 Đang nạp dữ liệu...');
        }

        // v2.9.0 - Single unified runLocked() block, NO FS.writeFile
        // CRITICAL: webR.FS.writeFile(Uint8Array) triggers FileReaderSync.readAsArrayBuffer()
        // inside the WebR worker, which ONLY accepts Blob — not Uint8Array.
        // FIX: Inject CSV data directly via evalR() — bypasses VFS/FileReaderSync entirely.
        // For large datasets (>500 rows), use chunked injection to avoid R parser limits.
        const executionPromise = runLocked(async () => {
            // Step 1: Inject CSV data directly into R via evalR (no FS.writeFile needed)
            if (csvData && csvData.length > 0) {
                const CHUNK_SIZE = 500; // rows per chunk — safe for R parser
                const numRows = csvData.length;

                if (numRows <= CHUNK_SIZE) {
                    // Small data: single evalR call
                    const csvText = csvData.map(row =>
                        row.map(v => (v === null || v === undefined || Number.isNaN(v as number)) ? 'NA' : v).join(',')
                    ).join('\n');
                    const escapedCsv = csvText.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                    await webR.evalR(`
                        .csv_text <- "${escapedCsv}"
                        raw_data <- as.matrix(read.csv(text = .csv_text, header = FALSE, stringsAsFactors = FALSE))
                        rm(.csv_text)
                    `);
                } else {
                    // Large data: chunked injection, rbind in R
                    await webR.evalR(`raw_data <- NULL`);
                    for (let i = 0; i < numRows; i += CHUNK_SIZE) {
                        const chunk = csvData.slice(i, i + CHUNK_SIZE);
                        const chunkText = chunk.map(row =>
                            row.map(v => (v === null || v === undefined || Number.isNaN(v as number)) ? 'NA' : v).join(',')
                        ).join('\n');
                        const escapedChunk = chunkText.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                        await webR.evalR(`
                            .chunk <- as.matrix(read.csv(text = "${escapedChunk}", header = FALSE, stringsAsFactors = FALSE))
                            raw_data <- if(is.null(raw_data)) .chunk else rbind(raw_data, .chunk)
                            rm(.chunk)
                        `);
                    }
                }
            }

            // Step 2: Execute R analysis code + capture output via VFS
            const wrappedCode = `
                tryCatch({
                    .res <- { ${rCode} }
                    if (is.list(.res)) {
                        attributes(.res)$call <- NULL
                        attributes(.res)$model <- NULL
                    }
                    .json <- jsonlite::toJSON(.res, auto_unbox = TRUE, force = TRUE, digits = 8)
                    writeLines(as.character(.json), "/home/web_user/output.json")
                    TRUE
                }, error = function(e) {
                    writeLines(paste("ERROR:", e$message), "/home/web_user/output.json")
                    FALSE
                })
            `;

            await webR.evalR(wrappedCode);

            // Step 3: Read result via evalR — avoids FS.readFile which also triggers FileReaderSync
            const resultProxy = await webR.evalR(`readLines("/home/web_user/output.json")`);
            const resultLines = await resultProxy.toJs();
            const finalStr = Array.isArray(resultLines?.values)
                ? resultLines.values.join('\n')
                : String(resultLines?.values ?? '');

            if (finalStr.startsWith("ERROR:")) {
                throw new Error(finalStr.replace("ERROR:", "").trim());
            }

            try {
                return JSON.parse(finalStr);
            } catch {
                return finalStr;
            }
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout after ${timeoutMs / 1000}s`)), timeoutMs)
        );

        return await Promise.race([executionPromise, timeoutPromise]);

    } catch (error: any) {
        const errorMsg = error?.message || String(error);
        logger.warn('[WebR] Execution Error:', errorMsg);

        // Fatal WebR worker state — only reset for true worker-level crashes
        // DO NOT include broad strings like 'Blob' — they match R-side error messages too
        const isFatalWorkerError = 
            errorMsg.includes('promise already under evaluation') ||
            errorMsg.includes('FileReaderSync') ||
            errorMsg.includes('webr-worker') ||
            errorMsg.includes('Worker terminated') ||
            errorMsg.includes('PostMessage channel');
        
        if (isFatalWorkerError) {
            logger.error('[WebR] Fatal worker state. Resetting engine...');
            resetWebR();
            throw new Error("Hệ thống R đang bận. Tôi đã tự động khởi động lại, vui lòng thực hiện lại phân tích sau vài giây.");
        }

        // Timeout error — engine may be stuck, reset and let user retry
        if (errorMsg.includes('Timeout after')) {
            logger.error('[WebR] Execution timeout. Resetting engine...');
            resetWebR();
            throw new Error(`Phân tích quá thời gian. Hệ thống đã reset, vui lòng thử lại.`);
        }

        // Self-healing for missing packages
        if (errorMsg.includes('there is no package called') && retryCount < maxRetries) {
            const match = errorMsg.match(/no package called ['"]?([^'"]+)['"]?/);
            const missingPkg = match ? match[1] : null;
            if (missingPkg) {
                logger.warn(`Auto-installing missing package: ${missingPkg}`);
                updateProgress(`Setting up ${missingPkg}...`);
                const officialRepo = "https://repo.r-wasm.org/";
                const localRepo = (typeof window !== 'undefined' && window.location.origin)
                    ? window.location.origin + "/webr_repo_v2"
                    : "https://ncskit.org/webr_repo_v2";
                await runLocked(async () => {
                    await webR.evalR(`
                        if (!require("${missingPkg}", character.only = TRUE, quietly = TRUE)) {
                            suppressWarnings(tryCatch({
                                webr::install("${missingPkg}", repos="${localRepo}")
                            }, error = function(e) {
                                webr::install("${missingPkg}", repos="${officialRepo}")
                            }))
                            library("${missingPkg}", character.only = TRUE)
                        }
                    `);
                });
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

