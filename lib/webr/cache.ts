/**
 * WebR Cache — Version-based State Management
 *
 * Caches WebR initialization state in IndexedDB to avoid re-downloading
 * 30MB of R packages on every page load.
 *
 * Cache invalidation triggers:
 * - CACHE_VERSION bump (when WebR or packages change)
 * - Cache older than 24 hours
 * - Manual clear via clearWebRCache()
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { logger } from '@/utils/logger';

// ─── Version ──────────────────────────────────────────────────────────────────

/**
 * Bump this when:
 * - WebR version changes (package.json webr dependency)
 * - Core R packages change (psych, lavaan, GPArotation)
 * - IDBFS storage format changes
 *
 * Format: `{webr-version}-{packages-hash}`
 */
export const CACHE_VERSION = '0.5.8-v3';

// ─── IDB Schema ───────────────────────────────────────────────────────────────

interface WebRCacheDB extends DBSchema {
    'webr-state': {
        key: string;
        value: {
            initialized: boolean;
            packages: string[];
            timestamp: number;
            version: string;
        };
    };
}

const DB_NAME = 'webr-cache';
const DB_VERSION = 1;
const STORE_NAME = 'webr-state';
const CACHE_KEY = 'init-state';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// ─── localStorage fast-path ───────────────────────────────────────────────────

const LS_KEY = 'webr_cache_state';

interface LSCacheState {
    version: string;
    packagesLoaded: boolean;
    timestamp: number;
}

/**
 * Fast localStorage check — avoids opening IndexedDB for the common case.
 * Returns true if packages are cached and version matches.
 */
export function isWebRCachedFast(): boolean {
    if (typeof localStorage === 'undefined') return false;
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return false;
        const state: LSCacheState = JSON.parse(raw);
        const isValid =
            state.version === CACHE_VERSION &&
            state.packagesLoaded === true &&
            Date.now() - state.timestamp < CACHE_DURATION;
        return isValid;
    } catch {
        return false;
    }
}

function setLSCache(packagesLoaded: boolean): void {
    if (typeof localStorage === 'undefined') return;
    try {
        const state: LSCacheState = {
            version: CACHE_VERSION,
            packagesLoaded,
            timestamp: Date.now(),
        };
        localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
        // localStorage might be full — ignore
    }
}

function clearLSCache(): void {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.removeItem(LS_KEY);
    } catch {
        // ignore
    }
}

// ─── IndexedDB full cache ─────────────────────────────────────────────────────

/**
 * Get cached WebR initialization state from IndexedDB.
 * Returns null if cache is invalid, expired, or version-mismatched.
 */
export async function getCachedWebRState(): Promise<{
    initialized: boolean;
    packages: string[];
    timestamp: number;
    version: string;
} | null> {
    try {
        const db = await openDB<WebRCacheDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            },
        });

        const state = await db.get(STORE_NAME, CACHE_KEY);

        if (!state) {
            logger.debug('[WebR Cache] No cached state found');
            return null;
        }

        const now = Date.now();
        const isExpired = now - state.timestamp > CACHE_DURATION;
        const isVersionMismatch = state.version !== CACHE_VERSION;

        if (isExpired) {
            logger.debug('[WebR Cache] Cache expired, clearing...');
            await clearWebRCache();
            return null;
        }

        if (isVersionMismatch) {
            logger.debug(`[WebR Cache] Version mismatch (cached: ${state.version}, current: ${CACHE_VERSION}), clearing...`);
            await clearWebRCache();
            return null;
        }

        logger.debug('[WebR Cache] Valid cache found:', state.packages);
        return state;
    } catch (error) {
        logger.error('[WebR Cache] Error reading cache:', error);
        return null;
    }
}

/**
 * Save WebR initialization state to both IndexedDB and localStorage.
 */
export async function setCachedWebRState(packages: string[]): Promise<void> {
    // Fast path: update localStorage immediately
    setLSCache(true);

    try {
        const db = await openDB<WebRCacheDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            },
        });

        const state = {
            initialized: true,
            packages,
            timestamp: Date.now(),
            version: CACHE_VERSION,
        };

        await db.put(STORE_NAME, state, CACHE_KEY);
        logger.debug('[WebR Cache] State cached successfully:', packages);
    } catch (error) {
        logger.error('[WebR Cache] Error saving cache:', error);
    }
}

/**
 * Clear all WebR cache (both IndexedDB and localStorage).
 */
export async function clearWebRCache(): Promise<void> {
    clearLSCache();
    try {
        const db = await openDB<WebRCacheDB>(DB_NAME, DB_VERSION);
        await db.delete(STORE_NAME, CACHE_KEY);
        logger.debug('[WebR Cache] Cache cleared');
    } catch (error) {
        logger.error('[WebR Cache] Error clearing cache:', error);
    }
}

/**
 * Check if WebR cache exists and is valid (async, full check).
 */
export async function hasValidWebRCache(): Promise<boolean> {
    const state = await getCachedWebRState();
    return state !== null;
}
