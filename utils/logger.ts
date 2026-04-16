/**
 * Structured Logger
 *
 * Replaces console.log in production code.
 * - debug/info: only emitted in development (NODE_ENV !== 'production')
 * - warn/error: always emitted (important for production debugging)
 *
 * Usage:
 *   import { logger } from '@/utils/logger';
 *   logger.debug('[WebR] Initializing...', { attempt: 1 });
 *   logger.error('[Auth] Session exchange failed', error);
 */

const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
    /**
     * Verbose debug info — dev only, stripped in production.
     */
    debug(msg: string, data?: unknown): void {
        if (isDev) {
            // eslint-disable-next-line no-console
            console.log(`[DEBUG] ${msg}`, data !== undefined ? data : '');
        }
    },

    /**
     * General informational messages — dev only.
     */
    info(msg: string, data?: unknown): void {
        if (isDev) {
            // eslint-disable-next-line no-console
            console.log(`[INFO] ${msg}`, data !== undefined ? data : '');
        }
    },

    /**
     * Warnings — always emitted.
     */
    warn(msg: string, data?: unknown): void {
        // eslint-disable-next-line no-console
        console.warn(`[WARN] ${msg}`, data !== undefined ? data : '');
    },

    /**
     * Errors — always emitted.
     * Pass the original error object as the second argument for stack traces.
     */
    error(msg: string, error?: unknown): void {
        // eslint-disable-next-line no-console
        console.error(`[ERROR] ${msg}`, error !== undefined ? error : '');
    },
} as const;
