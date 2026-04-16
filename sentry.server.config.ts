/**
 * Sentry Server-Side Configuration
 *
 * Initializes Sentry for Next.js server components and API routes.
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 0.1,
        sampleRate: 1.0,
        enabled: process.env.NODE_ENV === 'production',
        sendDefaultPii: false,

        beforeSend(event: any) {
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
