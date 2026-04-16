/**
 * WebR Error Handler
 *
 * Provides a standardized way to parse R execution results and convert
 * errors into user-friendly messages. All analysis modules should use
 * parseRResult() instead of ad-hoc error parsing.
 */

import { translateRErrorDetailed, type UserFriendlyError } from './utils';

// ─── Result types ─────────────────────────────────────────────────────────────

export interface RSuccess<T = unknown> {
    ok: true;
    data: T;
}

export interface RFailure {
    ok: false;
    error: UserFriendlyError;
    /** Raw error string for logging/debugging (never shown to user) */
    rawError: string;
}

export type RResult<T = unknown> = RSuccess<T> | RFailure;

// ─── Core parser ──────────────────────────────────────────────────────────────

/**
 * Parse the raw output from executeRWithRecovery() into a typed RResult.
 *
 * Handles all known R output formats:
 *  1. Structured error: `{ success: false, error_message: "..." }`
 *  2. Legacy string error: `"ERROR: <message>"`
 *  3. Success: any other value
 *
 * @example
 * const raw = await executeRWithRecovery(rCode, method, 0, 2, timeout, data);
 * const result = parseRResult(raw);
 * if (!result.ok) {
 *   showToast(result.error.title, 'error');
 *   return;
 * }
 * const data = result.data;
 */
export function parseRResult<T = unknown>(raw: unknown): RResult<T> {
    // Null / undefined
    if (raw === null || raw === undefined) {
        return failure('Empty result from R engine');
    }

    // Structured R-side error: { success: false, error_message: "..." }
    if (isObject(raw) && raw.success === false) {
        const msg = String((raw as Record<string, unknown>).error_message
            || (raw as Record<string, unknown>).error
            || 'R analysis failed');
        return failure(msg);
    }

    // Legacy string error: "ERROR: <message>"
    if (typeof raw === 'string' && raw.trimStart().startsWith('ERROR:')) {
        const msg = raw.replace(/^ERROR:\s*/i, '').trim();
        return failure(msg);
    }

    // Unwrap { success: true, data: ... } if present
    if (isObject(raw) && raw.success === true && 'data' in raw) {
        return { ok: true, data: (raw as Record<string, unknown>).data as T };
    }

    // Plain success value
    return { ok: true, data: raw as T };
}

// ─── Convenience helpers ──────────────────────────────────────────────────────

/**
 * Create a failure result from a raw error string.
 */
export function failure(rawError: string): RFailure {
    return {
        ok: false,
        error: translateRErrorDetailed(rawError),
        rawError,
    };
}

/**
 * Create a failure result from a caught JS/R exception.
 */
export function failureFromException(err: unknown): RFailure {
    const msg = err instanceof Error ? err.message : String(err);
    return failure(msg);
}

/**
 * Type guard: check if a value is a plain object.
 */
function isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
}

// ─── UI helper ────────────────────────────────────────────────────────────────

/**
 * Format a UserFriendlyError as a single toast-friendly string.
 * Use for showToast() calls.
 */
export function formatErrorForToast(error: UserFriendlyError): string {
    return `${error.title}: ${error.suggestion}`;
}

/**
 * Wrap an async analysis function with standardized error handling.
 * Catches all exceptions and converts them to RFailure.
 *
 * @example
 * const result = await withErrorHandling(() => runCronbachAlpha(data));
 * if (!result.ok) { showToast(formatErrorForToast(result.error), 'error'); return; }
 */
export async function withErrorHandling<T>(
    fn: () => Promise<T>
): Promise<RResult<T>> {
    try {
        const data = await fn();
        return { ok: true, data };
    } catch (err) {
        return failureFromException(err);
    }
}
