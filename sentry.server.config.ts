/**
 * Sentry Server-Side Configuration
 *
 * Initializes Sentry for Next.js server components and API routes.
 */

try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/nextjs');

    Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 0.1,
        sampleRate: 1.0,
        enabled: process.env.NODE_ENV === 'production',
        sendDefaultPii: false,

        beforeSend(event: Record<string, unknown>) {
            // Strip PII from server events
            if (event.user && typeof event.user === 'object') {
                const user = event.user as Record<string, unknown>;
                delete user.email;
                delete user.username;
                delete user.ip_address;
            }
            return event;
        },
    });
} catch {
    // @sentry/nextjs not installed — skip
}
