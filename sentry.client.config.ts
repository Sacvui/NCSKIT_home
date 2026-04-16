/**
 * Sentry Client-Side Configuration
 *
 * This file is loaded automatically by Next.js when @sentry/nextjs is installed.
 * It initializes Sentry for browser-side error tracking.
 *
 * To enable:
 *   1. npm install @sentry/nextjs
 *   2. Add NEXT_PUBLIC_SENTRY_DSN to .env.local
 *   3. Add SENTRY_AUTH_TOKEN to Vercel env vars (for source maps)
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

        // Capture 10% of transactions for performance monitoring
        tracesSampleRate: 0.1,

        // Capture 100% of errors
        // Adjust in production if volume is too high
        sampleRate: 1.0,

        // Disable in development to avoid noise
        enabled: process.env.NODE_ENV === 'production',

        // Don't send PII
        sendDefaultPii: false,

        // Ignore common non-actionable errors
        ignoreErrors: [
            // Browser extensions
            'ResizeObserver loop limit exceeded',
            'ResizeObserver loop completed with undelivered notifications',
            // Network errors (user's connection, not our bug)
            'NetworkError',
            'Failed to fetch',
            'Load failed',
            // WebR WASM — handled separately via captureWebRError
            'FileReaderSync',
        ],

        beforeSend(event: any) {
            // Strip any accidentally captured PII
            if (event.user) {
                delete event.user.email;
                delete event.user.username;
                delete event.user.ip_address;
            }
            return event;
        },
    });

