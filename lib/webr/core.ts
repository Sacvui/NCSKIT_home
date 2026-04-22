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

let evaluationLock: Promise<void> = Promise.resolve();

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

const BASE_URL = '/webr_core_v3/';

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

export function setProgressCallback(callback: (msg: string) => void) {
    onProgressCallback = callback;
}

function updateProgress(msg: string): void {
    initProgress = msg;
    if (onProgressCallback) {
        onProgressCallback(msg);
    }
}

export function resetWebR(): void {
    webRInstance = null;
    isInitializing = false;
    initPromise = null;
    initProgress = '';
    lastError = null;
    initAttempts = 0;
    evaluationLock = Promise.resolve();
    resetLoadedPackages();
    updateProgress('WebR reset - ready for reinitialization');
}

export async function clearWebRStorage(): Promise<void> {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('webr_fs_broken');
    }
    
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
                idb.deleteDatabase('emscripten_fs');
                idb.deleteDatabase('webr_fs');
                idb.deleteDatabase('IDBFS');
            }
        } catch (e) {
            logger.warn('[WebR] Could not flag storage for wipe:', e);
        }
    }
    
    resetWebR();
    window.location.reload();
}

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
                const webR = new WebR({
                    baseUrl: typeof window !== 'undefined' ? (window.location.origin + BASE_URL) : BASE_URL,
                    channelType: 3,
                });

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

                updateProgress('📂 Đang kết nối bộ nhớ...');
                let storageSane = false;

                if (typeof localStorage !== 'undefined' && localStorage.getItem('webr_fs_wipe_requested') === 'true') {
                    logger.warn('[WebR] Force wipe requested. Resetting persistent storage...');
                    localStorage.removeItem('webr_fs_wipe_requested');
                    localStorage.removeItem('webr_fs_broken');
                }

                const isFsBroken = typeof localStorage !== 'undefined' ? localStorage.getItem('webr_fs_broken') === 'true' : false;

                try {
                    try { await webR.FS.mkdir('/home/web_user'); } catch (e) {}
                    try { await webR.FS.mkdir(persistentLib); } catch (e) {}
                    
                    logger.debug('[WebR] Attempting to mount IDBFS storage...');
                    await webR.FS.mount('IDBFS', {}, persistentLib);
                    await webR.FS.syncfs(true);

                    if (isFsBroken) {
                        logger.warn('[WebR] FATAL CORRUPTION DETECTED! Nuking IDBFS...');
                        try {
                            await webR.evalR(`unlink("${persistentLib}", recursive = TRUE); dir.create("${persistentLib}", recursive = TRUE)`);
                            await webR.FS.syncfs(false);
                            if (typeof localStorage !== 'undefined') localStorage.removeItem('webr_fs_broken');
                        } catch (e) {}
                    }    
                    const sanityCheck = await webR.evalR(`dir.exists("${persistentLib}") && file.access("${persistentLib}", 2) == 0`);
                    const isHealthy = unpackWebRObject(await sanityCheck.toJs());
                    
                    if (isHealthy === true) {
                        storageSane = true;
                    } else {
                        logger.warn('[WebR] IDBFS Health check failed.');
                    }
                } catch (fsErr) {
                    logger.warn('[WebR] IDBFS mount failed:', fsErr);
                    try { await webR.FS.unmount(persistentLib); } catch(u) {}
                    const errMsg = String(fsErr);
                    const isRealIDBFSFailure = errMsg.includes('IDBFS') || errMsg.includes('mount') || errMsg.includes('syncfs');
                    if (isRealIDBFSFailure && typeof localStorage !== 'undefined') {
                        localStorage.setItem('webr_fs_broken', 'true');
                    }
                }
                
                if (!storageSane) {
                    logger.warn('[WebR] Falling back to slow memory-only mode.');
                }

                const fallbackRepo = "https://repo.r-wasm.org/";
                const localRepo = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin + "/webr_repo_v2" : "https://ncskit.org/webr_repo_v2";

                await runLocked(async () => {
                    await webR.evalR(`
                        if (dir.exists("${persistentLib}")) {
                            .libPaths(c('${persistentLib}', .libPaths()))
                        }
                        options(repos = c(CRAN = "https://repo.r-wasm.org/"))
                        options(pkgType = "binary")
                        options(warn = -1)
                        options(webr.repo_quiet = TRUE)
                        options(timeout = 300)
                        options(download.file.extra = "--no-cache") 
                        psych_exists <- dir.exists("${persistentLib}/psych")
                        r_version <- paste0(R.version$major, ".", R.version$minor)
                    `);
                });

                const rVersionObj = await runLocked(() => webR.evalR('r_version'));
                const rVersion = unpackWebRObject(await rVersionObj.toJs());
                logger.debug(`[WebR] R Engine Version: ${rVersion}`);

                updateProgress('📦 Đang thiết lập công cụ...');
                const existsProxy = await runLocked(() => webR.evalR('psych_exists'));
                const existsVal = unpackWebRObject(await existsProxy.toJs());
                if (existsProxy && typeof (existsProxy as any).destroy === 'function') (existsProxy as any).destroy();

                const corePackages = ['psych', 'jsonlite', 'mnormt', 'GPArotation', 'lattice', 'nlme'];

                if (existsVal === true) {
                    try {
                        logger.debug('[WebR] Loading core libraries...');
                        await runLocked(() => webR.evalR('library(psych); library(jsonlite)'));
                        corePackages.forEach(pkg => markPackageLoaded(pkg));
                    } catch (e) {
                        logger.warn('[WebR] Core loading failed! Wiping...', e);
                        try {
                            await runLocked(() => webR.evalR(`unlink("${persistentLib}", recursive = TRUE); dir.create("${persistentLib}", recursive = TRUE)`));
                            await webR.FS.syncfs(false); 
                        } catch (wipeErr) {}
                    }
                } else {
                    updateProgress('🌐 Đang tải thư viện R...');
                    try {
                        await runLocked(async () => {
                            await webR.evalR(`webr::install("psych", repos="${localRepo}", lib="${persistentLib}")`);
                            await webR.evalR(`webr::install("jsonlite", repos="${localRepo}", lib="${persistentLib}")`);
                            await webR.evalR('library(psych); library(jsonlite)');
                        });
                        corePackages.forEach(pkg => markPackageLoaded(pkg));
                        await webR.FS.syncfs(false);
                    } catch (installErr) {
                        logger.error('[WebR] Install failed:', installErr);
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
                captureWebRError(error, { phase: 'init' });
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

function unpackWebRObject(obj: any): any {
    if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
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
        if (method) {
            const required = getRequiredPackages(method);
            const needsLoad = required.some(pkg => !isPackageLoaded(pkg));
            if (needsLoad) await loadPackagesForMethod(method);
        }

        if (csvData && csvData.length > 0) {
            updateProgress('📊 Đang nạp dữ liệu...');
        }

        const executionPromise = runLocked(async () => {
            if (csvData && csvData.length > 0) {
                const CHUNK_SIZE = 500;
                const numRows = csvData.length;

                if (numRows <= CHUNK_SIZE) {
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

        if (errorMsg.includes('Timeout after')) {
            logger.error('[WebR] Execution timeout. Resetting engine...');
            resetWebR();
            throw new Error(`Phân tích quá thời gian. Hệ thống đã reset, vui lòng thử lại.`);
        }

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
