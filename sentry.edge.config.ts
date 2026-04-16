/**
 * Sentry Edge Runtime Configuration
 *
 * Initializes Sentry for Next.js middleware and edge API routes.
 */

try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/nextjs');

    Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 0.1,
        enabled: process.env.NODE_ENV === 'production',
        sendDefaultPii: false,
    });
} catch {
    // @sentry/nextjs not installed — skip
}
