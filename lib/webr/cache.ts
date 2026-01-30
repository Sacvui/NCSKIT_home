import { openDB, DBSchema, IDBPDatabase } from 'idb';

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
const WEBR_VERSION = '0.5.8'; // Should match package.json

/**
 * Get cached WebR initialization state
 * Returns null if cache is invalid or expired
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
            console.log('[WebR Cache] No cached state found');
            return null;
        }

        // Validate cache
        const now = Date.now();
        const isExpired = now - state.timestamp > CACHE_DURATION;
        const isVersionMismatch = state.version !== WEBR_VERSION;

        if (isExpired) {
            console.log('[WebR Cache] Cache expired, clearing...');
            await clearWebRCache();
            return null;
        }

        if (isVersionMismatch) {
            console.log(`[WebR Cache] Version mismatch (cached: ${state.version}, current: ${WEBR_VERSION}), clearing...`);
            await clearWebRCache();
            return null;
        }

        console.log('[WebR Cache] Valid cache found:', state.packages);
        return state;
    } catch (error) {
        console.error('[WebR Cache] Error reading cache:', error);
        return null;
    }
}

/**
 * Save WebR initialization state to cache
 */
export async function setCachedWebRState(packages: string[]): Promise<void> {
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
            version: WEBR_VERSION,
        };

        await db.put(STORE_NAME, state, CACHE_KEY);
        console.log('[WebR Cache] State cached successfully:', packages);
    } catch (error) {
        console.error('[WebR Cache] Error saving cache:', error);
    }
}

/**
 * Clear WebR cache
 */
export async function clearWebRCache(): Promise<void> {
    try {
        const db = await openDB<WebRCacheDB>(DB_NAME, DB_VERSION);
        await db.delete(STORE_NAME, CACHE_KEY);
        console.log('[WebR Cache] Cache cleared');
    } catch (error) {
        console.error('[WebR Cache] Error clearing cache:', error);
    }
}

/**
 * Check if WebR cache exists and is valid
 */
export async function hasValidWebRCache(): Promise<boolean> {
    const state = await getCachedWebRState();
    return state !== null;
}
