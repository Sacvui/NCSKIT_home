import { WebR } from 'webr';
import { translateRError } from './utils';
import { getCachedWebRState, setCachedWebRState } from './cache';
import { getRequiredPackages, isPackageLoaded, markPackageLoaded } from './package-registry';
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
                const isFsBroken = false;
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem('webr_fs_broken');
                }

                try {
                    // Ensure recursive-like folder creation
                    try { await webR.FS.mkdir('/home/web_user'); } catch (e) {}
                    try { await webR.FS.mkdir(persistentLib); } catch (e) {}
                    
                    if (!isFsBroken) {
                        logger.debug('[WebR] Attempting to mount IDBFS storage...');
                        await webR.FS.mount('IDBFS', {}, persistentLib);
                        await webR.FS.syncfs(true);
                        
                        // Sanity check for IDBFS
                        await webR.evalR(`writeLines("sane", "${persistentLib}/sanity.txt")`);
                        const sanity = await webR.evalR(`readLines("${persistentLib}/sanity.txt")`);
                        const sanityVal = unpackWebRObject(await sanity.toJs());
                        
                        if (sanityVal === "sane") {
                            storageSane = true;
                            logger.debug('[WebR] IDBFS Sanity check passed! Storage is healthy.');
                            // SELF-HEALING: If it's working now, remove the broken flag if it existed
                            if (typeof localStorage !== 'undefined' && localStorage.getItem('webr_fs_broken')) {
                                logger.debug('[WebR] Clearing previous corruption flag. High-speed caching restored.');
                                localStorage.removeItem('webr_fs_broken');
                            }
                        }
                    } else {
                        logger.warn('[WebR] Skipping IDBFS due to previous corruption flag. Performance will be degraded.');
                    }
                } catch (fsErr) {
                    logger.warn('[WebR] IDBFS mount or sanity check failed:', fsErr);
                    try { await webR.FS.unmount(persistentLib); } catch(u) {}
                    // If we tried to use IDBFS and it failed, flag it (unless already flagged)
                    if (!isFsBroken && typeof localStorage !== 'undefined') {
                        localStorage.setItem('webr_fs_broken', 'true');
                    }
                }
                
                if (!storageSane) {
                    logger.warn('[WebR] Falling back to slow memory-only mode. Every page load will require re-downloading packages.');
                }

                const fallbackRepo = "https://repo.r-wasm.org/";
                const localRepo = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin + "/webr_repo_v2" : "https://ncskit.org/webr_repo_v2";
                logger.debug("[WebR] Using repositories. Local:", localRepo, "Official:", fallbackRepo);

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
                                    tryCatch({
                                        webr::install("psych", repos="${localRepo}", lib="${persistentLib}")
                                    }, error = function(e) {
                                        webr::install("psych", repos="${fallbackRepo}", lib="${persistentLib}")
                                    })
                                `;
                                await webR.evalR(installCmd);
                                await webR.evalR(`
                                    tryCatch({
                                        webr::install("jsonlite", repos="${localRepo}", lib="${persistentLib}")
                                    }, error = function(e) {
                                        webr::install("jsonlite", repos="${fallbackRepo}", lib="${persistentLib}")
                                    })
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
                                    tryCatch({
                                        webr::install("psych", repos="${localRepo}", lib="${persistentLib}")
                                    }, error = function(e) {
                                        webr::install("psych", repos="${fallbackRepo}", lib="${persistentLib}")
                                    })
                                `;
                            await webR.evalR(installCmd);
                            await webR.evalR(`
                                    tryCatch({
                                        webr::install("jsonlite", repos="${localRepo}", lib="${persistentLib}")
                                    }, error = function(e) {
                                        webr::install("jsonlite", repos="${fallbackRepo}", lib="${persistentLib}")
                                    })
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

    for (const pkg of required) {
        if (isPackageLoaded(pkg)) continue;

        try {
            updateProgress(`Installing ${pkg}...`);
            await runLocked(async () => {
                // Use official CRAN mirror only to avoid 404 errors from missing local repo
                await webR.evalR(`
                    if (!require("${pkg}", character.only = TRUE, quietly = TRUE)) {
                        webr::install("${pkg}", repos="${officialRepo}")
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
        if (method) await loadPackagesForMethod(method);

        if (csvData && csvData.length > 0) {
            updateProgress('📊 Đang nạp dữ liệu...');
            // Convert data to a CSV formatted string
            const csvText = csvData.map(row => 
                row.map(v => (v === null || v === undefined || Number.isNaN(v as number)) ? 'NA' : v).join(',')
            ).join('\n');
            
            // v2.5.0 - Bi-directional VFS Pipe
            // Inject data via standard filesystem to bypass Blob serialization issues in webR.bind()
            const encodedData = new TextEncoder().encode(csvText);
            await webR.FS.writeFile('/home/web_user/data.csv', encodedData);
            await runLocked(async () => {
                await webR.evalR(`raw_data <- as.matrix(read.csv('/home/web_user/data.csv', header = FALSE, stringsAsFactors = FALSE))`);
            });
        }

        let output: any;
        const executionPromise = runLocked(async () => {
            // Enhanced wrap with automated cleanup and result stripping to keep size small
            const wrappedCode = `
                tryCatch({
                    .res <- { ${rCode} }
                    # Strip heavy attributes that crash toJs (like environments, calls, large models)
                    if (is.list(.res)) {
                        attributes(.res)$call <- NULL
                        attributes(.res)$model <- NULL
                    }
                    # Convert to JSON and save to VFS for ultra-stable transfer
                    .json <- jsonlite::toJSON(.res, auto_unbox = TRUE, force = TRUE, digits = 8)
                    writeLines(as.character(.json), "/home/web_user/output.json")
                    TRUE # Return success flag
                }, error = function(e) {
                    writeLines(paste("ERROR:", e$message), "/home/web_user/output.json")
                    FALSE # Return failure flag
                })
            `;
            
            await webR.evalR(wrappedCode);
            
            // v2.4.0 - VFS-based Ultra-stable Pipeline
            // Bypasses R-JS object serialization entirely for the payload
            const rawBinary = await webR.FS.readFile("/home/web_user/output.json");
            const finalStr = new TextDecoder().decode(rawBinary);
            
            logger.debug('[WebR] Engine System v2.4.0 - VFS-File Data Pipe Active');

            try {
                // Check for R-side errors encoded in the binary/string stream
                if (finalStr.startsWith("ERROR:")) {
                    throw new Error(finalStr);
                }

                return JSON.parse(finalStr);
            } catch (e: any) {
                // If it's already an error we threw (e.g. from R script), re-throw it
                if (e.message && e.message.startsWith('ERROR:')) throw new Error(e.message.replace("ERROR:", "").trim());
                return finalStr;
            }
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout after ${timeoutMs / 1000}s`)), timeoutMs)
        );

        output = await Promise.race([executionPromise, timeoutPromise]);
        return output;
    } catch (error: any) {
        const errorMsg = error?.message || String(error);

        logger.warn('[WebR] Execution Error:', errorMsg);

        // Recursive evaluation error is fatal to the current worker state -> Force Restart
        if (errorMsg.includes('promise already under evaluation') || 
            errorMsg.includes('FileReaderSync') || 
            errorMsg.includes('Blob')) {
             logger.error('[WebR] Fatal R state. Resetting engine...');
             resetWebR(); // Clear the hung instance
             throw new Error("Hệ thống R đang bận. Tôi đã tự động khởi động lại, vui lòng thực hiện lại phân tích sau vài giây.");
        }

        // SELF-HEALING for missing packages
        if (errorMsg.includes('there is no package called') && retryCount < maxRetries) {
            const match = errorMsg.match(/no package called .(.*)./);
            const missingPkg = match ? match[1] : null;

            if (missingPkg) {
                logger.warn(`Auto-installing missing package: ${missingPkg}`);
                updateProgress(`Setting up ${missingPkg}...`);
                const officialRepo = "https://repo.r-wasm.org/";
                const localRepo = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin + "/webr_repo_v2" : "https://ncskit.org/webr_repo_v2";
                
                // Try local repo first, fallback to official CRAN mirror
                await runLocked(async () => {
                    await webR.evalR(`
                        if (!require("${missingPkg}", character.only = TRUE, quietly = TRUE)) {
                            tryCatch({
                                webr::install("${missingPkg}", repos="${localRepo}")
                            }, error = function(e) {
                                webr::install("${missingPkg}", repos="${officialRepo}")
                            })
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

