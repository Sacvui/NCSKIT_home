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
 * Initialize WebR instance (singleton with promise caching and retry logic)
 */
export async function initWebR(maxRetries: number = 3): Promise<WebR> {
    if (webRInstance) return webRInstance;
    if (initPromise) return initPromise;

    isInitializing = true;
    updateProgress('R-Engine Loading...');

    initPromise = (async () => {
        try {
            const webR = new WebR({
                channelType: 1, 
                serviceWorkerUrl: '/webr-serviceworker.js'
            });

            if ('serviceWorker' in navigator) {
                try {
                    await navigator.serviceWorker.register('/webr-serviceworker.js');
                    await navigator.serviceWorker.ready;
                } catch (swError) {
                    console.warn('SW registration skipped:', swError);
                }
            }

            await webR.init();
            
            // Set dual repos: Official WASM + R-Universe Mirror (for missing binaries like quadprog)
            await webR.evalR('options(repos = c(R_WASM = "https://repo.r-wasm.org/", CRAN = "https://cran.r-universe.dev/"))');
            
            // Core package loading
            updateProgress('Loading psych...');
            await webR.installPackages(['psych']);
            await webR.evalR('library(psych)');
            markPackageLoaded('psych');

            updateProgress('R-Engine Ready');
            webRInstance = webR;
            isInitializing = false;
            return webRInstance;
        } catch (error: any) {
            isInitializing = false;
            initPromise = null;
            lastError = error;
            updateProgress('R-Engine Error');
            throw error;
        }
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
    timeoutMs: number = 120000 
): Promise<any> {
    const webR = await initWebR();

    try {
        if (method) await loadPackagesForMethod(method);

        const rResultPromise = webR.evalR(rCode);
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

        // SELF-HEALING for missing packages
        if (errorMsg.includes('there is no package called') && retryCount < maxRetries) {
            const match = errorMsg.match(/no package called .(.*)./);
            const missingPkg = match ? match[1] : null;

            if (missingPkg) {
                console.warn(`Auto-installing missing package: ${missingPkg}`);
                updateProgress(`Setting up ${missingPkg}...`);
                await webR.installPackages([missingPkg]);
                markPackageLoaded(missingPkg);
                return executeRWithRecovery(rCode, method, retryCount + 1, maxRetries, timeoutMs);
            }
        }

        if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            return executeRWithRecovery(rCode, method, retryCount + 1, maxRetries, timeoutMs);
        }

        throw error;
    }
}
