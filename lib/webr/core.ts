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

// Storage keys for crash monitoring
const CRASH_COUNTER_KEY = 'webr_crash_count';
const REPO_VERSION = 'webr_repo_v6';

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

export const BASE_URL = typeof window !== 'undefined' 
    ? window.location.origin + '/webr_core_v3/' 
    : '/webr_core_v3/';

export const getOptimalChannelType = (): 0 | 1 | 3 => {
    if (typeof window === 'undefined') return 3;
    
    // Tối ưu nhất: SharedArrayBuffer cho phép tốc độ cao nhất (nếu có COOP/COEP headers)
    if (typeof SharedArrayBuffer !== 'undefined' && window.crossOriginIsolated) return 0;
    
    // TRÁNH SỬ DỤNG SERVICE WORKER (Channel 1) trên Safari/iOS vì lỗi FileReaderSync!
    // Safari có bug nội tại với đồng bộ XHR (Sync XHR) khi bị Service Worker chặn lại.
    // Do đó, nếu không có SharedArrayBuffer, fallback an toàn nhất trên mọi trình duyệt là PostMessage (3).
    return 3;
};

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

/**
 * Aggressive environment cleanup
 */
export async function clearWebRStorage(): Promise<void> {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('webr_fs_broken');
        localStorage.removeItem(CRASH_COUNTER_KEY);
    }
    
    if (typeof window !== 'undefined' && window.indexedDB) {
        try {
            logger.debug('[WebR] DEEP CLEAN: Deleting all potential IndexedDB corruptions...');
            const idb: any = window.indexedDB;
            const targetDBs = ['emscripten_fs', 'webr_fs', 'IDBFS', 'WebR'];
            
            for (const dbName of targetDBs) {
                try { idb.deleteDatabase(dbName); } catch(err) {}
            }

            if (typeof idb.databases === 'function') {
                const dbs = await idb.databases();
                dbs.forEach((db: any) => {
                    if (db.name?.toLowerCase().includes('webr') || db.name?.toLowerCase().includes('fs')) {
                        idb.deleteDatabase(db.name);
                    }
                });
            }
        } catch (e) {
            logger.warn('[WebR] Cleanup skipped or restricted:', e);
        }
    }

    if (typeof window !== 'undefined' && navigator.serviceWorker) {
        try {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (let reg of regs) { await reg.unregister(); }
        } catch(e) {}
    }
    
    resetWebR();
    if (typeof window !== 'undefined') window.location.reload();
}

/**
 * Main WebR Initialization with Rapid Recovery
 */
export async function initWebR(maxRetries: number = 3): Promise<WebR> {
    if (webRInstance) return webRInstance;
    if (initPromise) return initPromise;

    // Monitor consecutive crashes in this session
    let crashCount = 0;
    if (typeof sessionStorage !== 'undefined') {
        crashCount = parseInt(sessionStorage.getItem(CRASH_COUNTER_KEY) || '0');
        if (crashCount >= 5) {
            logger.error('[WebR] Critical failure loop detected! Triggering deep reset.');
            sessionStorage.setItem(CRASH_COUNTER_KEY, '0');
            await clearWebRStorage();
            return new Promise(() => {}); // Stop execution, page will reload
        }
    }

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
                logger.info('[WebR] Initializing WebR instance...');
                updateProgress('🚀 Đang kết nối máy chủ R...');
                
                const webR = new WebR({
                    baseUrl: BASE_URL,
                    channelType: getOptimalChannelType(),
                });

                // Aggressively clean up ServiceWorker before init to prevent deadlocks
                // from persisting across page reloads.
                if (typeof window !== 'undefined' && navigator.serviceWorker) {
                    try {
                        const regs = await navigator.serviceWorker.getRegistrations();
                        for (let reg of regs) {
                            if (reg.active?.scriptURL.includes('webr')) {
                                await reg.unregister();
                                logger.info('[WebR] Cleaned up previous ServiceWorker to prevent deadlock.');
                            }
                        }
                    } catch (e) {}
                }

                logger.debug('[WebR] Created instance, waiting for worker...');
                
                // CRITICAL: Safety timeout for webR.init()
                await Promise.race([
                    webR.init(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('WebR worker init timeout (Next.js server is likely compiling or lagging)')), 120000))
                ]);
                
                logger.info('[WebR] Worker online.');
                const persistentLib = '/home/web_user/library';

                updateProgress('📂 Đang kết nối bộ nhớ...');
                let storageSane = false;
                const channelType = getOptimalChannelType();

                // CRITICAL: IDBFS is NOT supported with SharedArrayBuffer (Channel 0)
                // It only works with PostMessage (Channel 3) or ServiceWorker (Channel 1)
                if (channelType !== 0) {
                    try {
                        try { await webR.FS.mkdir('/home/web_user'); } catch (e) {}
                        try { await webR.FS.mkdir(persistentLib); } catch (e) {}
                        
                        logger.debug('[WebR] Connecting storage (IDBFS)...');
                        await webR.FS.mount('IDBFS', {}, persistentLib);
                        
                        try {
                            await Promise.race([
                                webR.FS.syncfs(true),
                                new Promise((_, reject) => setTimeout(() => reject(new Error('Sync Timeout')), 10000))
                            ]);

                            const isFsBroken = typeof localStorage !== 'undefined' ? localStorage.getItem('webr_fs_broken') === 'true' : false;
                            if (isFsBroken || crashCount > 1) {
                                logger.warn('[WebR] Self-healing storage...');
                                await webR.evalR(`unlink("${persistentLib}", recursive = TRUE); dir.create("${persistentLib}", recursive = TRUE)`);
                                await webR.FS.syncfs(false);
                                if (typeof localStorage !== 'undefined') localStorage.removeItem('webr_fs_broken');
                            }
                            
                            const sanity = await webR.evalR(`dir.exists("${persistentLib}") && file.access("${persistentLib}", 2) == 0`);
                            if (unpackWebRObject(await sanity.toJs()) === true) {
                                storageSane = true;
                            }
                        } catch (syncErr) {
                            logger.warn('[WebR] IDBFS failed, falling back to RAM.', syncErr);
                            if (typeof localStorage !== 'undefined') localStorage.setItem('webr_fs_broken', 'true');
                        }
                    } catch (fsErr) {
                        logger.warn('[WebR] Storage setup error:', fsErr);
                    }
                } else {
                    logger.info('[WebR] SharedArrayBuffer detected, skipping IDBFS mount for stability.');
                }
                
                if (!storageSane) logger.info('[WebR] RAM Mode Active (High Performance)');

                const fallbackRepo = "https://repo.r-wasm.org/";
                const localRepo = (typeof window !== 'undefined' && window.location.origin) 
                    ? window.location.origin + "/" + REPO_VERSION 
                    : "https://ncskit.org/" + REPO_VERSION;

                await runLocked(async () => {
                    await webR.evalR(`
                        if (dir.exists("${persistentLib}")) {
                            .libPaths(c('${persistentLib}', .libPaths()))
                        }
                        
                        # Configure repos: local first, then r-universe, then r-wasm.org as fallback
                        local_repo <- "${localRepo}"
                        lavaan_repo <- "https://repo.r-wasm.org/"
                        seminr_repo <- "https://sem-in-r.r-universe.dev"
                        ropensci_repo <- "https://ropensci.r-universe.dev"
                        fallback_repo <- "https://repo.r-wasm.org/"
                        
                        options(repos = c(LAVAAN = lavaan_repo, SEMINR = seminr_repo, ROPEN = ropensci_repo, CRAN = fallback_repo))
                        options(pkgType = "binary")
                        options(webr.repo_quiet = FALSE) # Set to FALSE to see errors in console
                        options(timeout = 60)
                        
                        # Helper to install if missing
                        install_if_missing <- function(pkg) {
                            if (!require(pkg, character.only = TRUE, quietly = TRUE)) {
                                message("Installing missing package: ", pkg)
                                tryCatch(webr::install(pkg), error = function(e) { message("Install error: ", e) })
                                library(pkg, character.only = TRUE)
                            }
                        }
                        
                        # Ensure essential packages are available
                        # NOTE: Only preload packages that are guaranteed available in the local/CDN repos.
                        # quadprog + lavaan are loaded on-demand when CFA/SEM is triggered.
                        install_if_missing("jsonlite")
                        install_if_missing("psych")
                        tryCatch(install_if_missing("GPArotation"), error = function(e) {
                            message("[WebR] GPArotation optional, will load on-demand: ", e$message)
                        })
                        
                        r_version_info <- paste0(R.version$major, ".", R.version$minor, " (", R.version$platform, ")")
                    `);
                });

                const rVersionFull = unpackWebRObject(await (await runLocked(() => webR.evalR('r_version_info'))).toJs());
                logger.info(`[WebR] R Engine Online: ${rVersionFull}`);

                const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
                logger.debug(`[WebR] Ready in ${elapsed}s`);
                updateProgress('✅ R-Engine sẵn sàng');
                
                // Active Memory Management (Immortal Mode)
                await runLocked(() => webR.evalR('gc()'));

                // Clear crash count on success
                if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(CRASH_COUNTER_KEY, '0');

                webRInstance = webR;
                isInitializing = false;
                initAttempts = 0;
                return webRInstance;

            } catch (error: any) {
                logger.error('[WebR] Init Failure:', error);
                
                // Track crash count
                if (typeof sessionStorage !== 'undefined') {
                    const currentCrash = parseInt(sessionStorage.getItem(CRASH_COUNTER_KEY) || '0');
                    sessionStorage.setItem(CRASH_COUNTER_KEY, (currentCrash + 1).toString());
                }

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
    const localRepo = (typeof window !== 'undefined' && window.location.origin) 
        ? window.location.origin + "/" + REPO_VERSION 
        : "https://ncskit.org/" + REPO_VERSION;

    for (const pkg of required) {
        if (isPackageLoaded(pkg)) continue;

        try {
            updateProgress(`Installing ${pkg}...`);

            // CRITICAL: Before loading lavaan, create quadprog stub package on VFS
            // quadprog is not available as WebR/WASM binary, but lavaan requires it as Imports dependency
            if (pkg === 'lavaan' && !isPackageLoaded('quadprog')) {
                updateProgress('Preparing quadprog compatibility layer...');
                await runLocked(async () => {
                    await webR.evalR(`
                        if (!require("quadprog", character.only = TRUE, quietly = TRUE)) {
                            lib_path <- .libPaths()[1]
                            pkg_dir <- file.path(lib_path, "quadprog")
                            if (dir.exists(pkg_dir)) unlink(pkg_dir, recursive = TRUE)
                            dir.create(file.path(pkg_dir, "R"), recursive = TRUE, showWarnings = FALSE)
                            dir.create(file.path(pkg_dir, "Meta"), recursive = TRUE, showWarnings = FALSE)
                            
                            writeLines(c(
                                "Package: quadprog", "Version: 1.5-8",
                                "Title: Quadratic Programming Stub for WebR",
                                "Description: Stub for WebR - provides namespace so lavaan can load.",
                                "Author: WebR Stub", "Maintainer: WebR Stub <stub@webr>",
                                "License: GPL-2", "NeedsCompilation: no",
                                paste0("Built: R ", R.version$major, ".", R.version$minor, "; ; ", Sys.time(), "; unix")
                            ), file.path(pkg_dir, "DESCRIPTION"))
                            
                            writeLines(c("export(solve.QP)", "export(solve.QP.compact)"), file.path(pkg_dir, "NAMESPACE"))
                            
                            desc_fields <- read.dcf(file.path(pkg_dir, "DESCRIPTION"))[1, ]
                            saveRDS(list(DESCRIPTION = desc_fields, Built = list(R = getRversion(), Platform = "", Date = Sys.time(), OStype = "unix")),
                                    file.path(pkg_dir, "Meta", "package.rds"))
                            
                            saveRDS(list(exports = c("solve.QP", "solve.QP.compact"), exportPatterns = character(0),
                                         imports = list(), importFrom = list(), importClasses = list(), importMethods = list(),
                                         S3methods = matrix(character(0), ncol = 4, dimnames = list(NULL, c("generic","class","method","from")))),
                                    file.path(pkg_dir, "Meta", "nsInfo.rds"))
                            
                            writeLines(c(
                                'solve.QP <- function(Dmat, dvec, Amat, bvec, meq=0, factorized=FALSE) stop("quadprog::solve.QP not available in WebR")',
                                'solve.QP.compact <- function(Dmat, dvec, Amat, Aind, bvec, meq=0, factorized=FALSE) stop("quadprog::solve.QP.compact not available in WebR")'
                            ), file.path(pkg_dir, "R", "quadprog"))
                        }
                    `);
                });
                markPackageLoaded('quadprog');
                logger.info('[WebR] quadprog stub package created successfully');
            }

            await runLocked(async () => {
                await webR.evalR(`
                    if (!require("${pkg}", character.only = TRUE, quietly = TRUE)) {
                        # CDN First - Much faster for deployment and ensures latest stable WASM binaries
                        .repos <- c("https://sem-in-r.r-universe.dev", "https://ropensci.r-universe.dev", "${officialRepo}")
                        tryCatch(webr::install("${pkg}", repos = .repos), error = function(e) {
                             # Local Fallback
                             tryCatch(webr::install("${pkg}", repos = "${localRepo}"), error = function(e) {})
                        })
                        library("${pkg}", character.only = TRUE)
                    }
                `);
            });

            // CRITICAL: After loading lavaan, patch lav_options_checkinterval for WASM compatibility
            // lavaan 0.6.21 has a bug where integer conversion in option validation produces NA on WASM
            if (pkg === 'lavaan') {
                await runLocked(async () => {
                    await webR.evalR(`
                        tryCatch(
                            assignInNamespace("lav_options_checkinterval", function(...) TRUE, ns = "lavaan"),
                            error = function(e) {}
                        )
                    `);
                });
                logger.info('[WebR] lavaan patched for WASM compatibility');
            }
            
            // CRITICAL: Sync filesystem after installation to ensure persistence across F5/Reloads
            const channelType = getOptimalChannelType();
            if (channelType !== 0) {
                try {
                    logger.info(`[WebR] Persisting ${pkg} to storage...`);
                    await webR.FS.syncfs(false); 
                } catch (e) {
                    logger.warn(`[WebR] Failed to persist ${pkg}:`, e);
                }
            }
            
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
    timeoutMs: number = 300000,
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
                        row.map(v => {
                            if (v === null || v === undefined || (v as any) === '') return 'NA';
                            const n = Number(v);
                            return isNaN(n) ? 'NA' : n;
                        }).join(',')
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
                            row.map(v => {
                                if (v === null || v === undefined || (v as any) === '') return 'NA';
                                const n = Number(v);
                                return isNaN(n) ? 'NA' : n;
                            }).join(',')
                        ).join('\n');
                        const escapedChunk = chunkText.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                        await webR.evalR(`
                            .chunk <- read.csv(text = "${escapedChunk}", header = FALSE, stringsAsFactors = FALSE)
                            .chunk[] <- suppressWarnings(lapply(.chunk, as.numeric))
                            .chunk <- as.matrix(.chunk)
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

            console.log("[WebR Debug] Executing wrappedCode");
            await webR.evalR(wrappedCode);
            console.log("[WebR Debug] wrappedCode executed");

            console.log("[WebR Debug] Reading output.json");
            const resultProxy = await webR.evalR(`readLines("/home/web_user/output.json")`);
            console.log("[WebR Debug] output.json read, proxy created", resultProxy);
            
            let resultLines;
            try {
                console.log("[WebR Debug] Calling toJs() on resultProxy");
                resultLines = await resultProxy.toJs() as any;
                console.log("[WebR Debug] toJs() successful", resultLines);
            } catch (err) {
                console.error("[WebR Debug] toJs() failed!", err);
                throw err;
            }

            const finalStr = Array.isArray(resultLines?.values)
                ? resultLines.values.join('\n')
                : String(resultLines?.values ?? '');

            if (finalStr.startsWith("ERROR:")) {
                throw new Error(finalStr.replace("ERROR:", "").trim());
            }

            // Clear memory after successful execution
            console.log("[WebR Debug] Running gc()");
            await webR.evalR('gc()');
            console.log("[WebR Debug] gc() finished");

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
            errorMsg.includes('not a function') ||
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
             const match = errorMsg.match(/no package called [‘'"]?([^’'" ]+)[’'" ]?/);
            const missingPkg = match ? match[1].replace(/[‘’'"]/g, '').trim() : null;
            if (missingPkg) {
                logger.warn(`Auto-installing missing package: ${missingPkg}`);
                updateProgress(`Setting up ${missingPkg}...`);
                const officialRepo = "https://repo.r-wasm.org/";
                const localRepo = (typeof window !== 'undefined' && window.location.origin) 
                    ? window.location.origin + "/" + REPO_VERSION 
                    : "https://ncskit.org/" + REPO_VERSION;
                    
                await runLocked(async () => {
                    await webR.evalR(`
                        if (!require("${missingPkg}", character.only = TRUE, quietly = TRUE)) {
                            tryCatch(webr::install("${missingPkg}", repos = "${localRepo}"), error = function(e) {})
                            if (!require("${missingPkg}", character.only = TRUE, quietly = TRUE)) {
                                message("Local install failed for ", "${missingPkg}", ", trying official repo...")
                                tryCatch(webr::install("${missingPkg}", repos = "${officialRepo}"), error = function(e) {})
                            }
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
