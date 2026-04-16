/**
 * Error Monitoring — Sentry Integration
 *
 * Provides structured error capture for:
 * - WebR initialization and execution errors
 * - API route errors
 * - Client-side unhandled errors
 *
 * Setup:
 *   1. npm install @sentry/nextjs
 *   2. Add SENTRY_DSN to .env.local and Vercel env vars
 *   3. The sentry.*.config.ts files will auto-initialize Sentry
 *
 * If SENTRY_DSN is not set, all functions are no-ops (safe to call always).
 */

// Lazy import to avoid breaking the app if @sentry/nextjs is not installed
let Sentry: typeof import('@sentry/nextjs') | null = null;

async function getSentry() {
    if (Sentry) return Sentry;
    try {
        Sentry = await import('@sentry/nextjs');
        return Sentry;
    } catch {
        // @sentry/nextjs not installed — monitoring disabled
        return null;
    }
}

// ─── WebR Error Capture ───────────────────────────────────────────────────────

export interface WebRErrorContext {
    /** Analysis method being run (e.g. 'cronbach', 'efa') */
    method?: string;
    /** Phase of WebR lifecycle */
    phase?: 'init' | 'package_load' | 'execution' | 'reset';
    /** Browser user agent (for debugging WASM compatibility) */
    browser?: string;
    /** Whether IDBFS cache was active */
    cacheActive?: boolean;
}

/**
 * Capture a WebR-specific error with context tags.
 * Safe to call even if Sentry is not installed.
 */
export async function captureWebRError(
    error: Error | unknown,
    context: WebRErrorContext = {}
): Promise<void> {
    const sentry = await getSentry();
    if (!sentry) return;

    sentry.withScope(scope => {
        scope.setTag('component', 'webr');
        scope.setTag('webr_phase', context.phase || 'unknown');
        if (context.method) scope.setTag('webr_method', context.method);
        if (context.browser) scope.setTag('browser', context.browser);
        scope.setContext('webr', context as Record<string, unknown>);
        sentry.captureException(error instanceof Error ? error : new Error(String(error)));
    });
}

// ─── API Error Capture ────────────────────────────────────────────────────────

/**
 * Capture an API route error.
 * Strips PII — never logs user IDs, emails, or tokens.
 */
export async function captureAPIError(
    error: Error | unknown,
    endpoint: string,
    statusCode?: number
): Promise<void> {
    const sentry = await getSentry();
    if (!sentry) return;

    sentry.withScope(scope => {
        scope.setTag('component', 'api');
        scope.setTag('endpoint', endpoint);
        if (statusCode) scope.setTag('status_code', String(statusCode));
        sentry.captureException(error instanceof Error ? error : new Error(String(error)));
    });
}

// ─── Client Error Capture ─────────────────────────────────────────────────────

/**
 * Capture a generic client-side error with optional context.
 */
export async function captureClientError(
    error: Error | unknown,
    context?: Record<string, string | number | boolean>
): Promise<void> {
    const sentry = await getSentry();
    if (!sentry) return;

    if (context) {
        sentry.withScope(scope => {
            Object.entries(context).forEach(([key, value]) => {
                scope.setTag(key, String(value));
            });
            sentry.captureException(error instanceof Error ? error : new Error(String(error)));
        });
    } else {
        sentry.captureException(error instanceof Error ? error : new Error(String(error)));
    }
}
