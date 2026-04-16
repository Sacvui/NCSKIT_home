'use client';

import { useEffect, useState } from 'react';
import { initWebR, getWebRStatus, setProgressCallback } from '@/lib/webr-wrapper';
import { logger } from '@/utils/logger';

/**
 * WebR Preloader - Silently preload R libraries in background
 * Place this component on the homepage to start loading WebR before user navigates to /analyze
 */
export function WebRPreloader() {
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        const startPreloading = async () => {
            const webRStatus = getWebRStatus();

            // Only start preloading if not already ready or loading
            if (!webRStatus.isReady && !webRStatus.isLoading) {
                logger.debug('[WebR Preloader] Starting delayed background initialization...');

                // Set progress callback for logging
                setProgressCallback((msg) => {
                    logger.debug('[WebR Preloader]', msg);
                    setStatus(msg);
                });

                // Start preloading silently - don't block UI
                try {
                    await initWebR();
                    logger.debug('[WebR Preloader] ✅ R Engine ready!');
                    setStatus('Sẵn sàng');
                } catch (err) {
                    logger.warn('[WebR Preloader] Failed to preload:', err);
                }
            } else if (webRStatus.isReady) {
                logger.debug('[WebR Preloader] R Engine already loaded');
                setStatus('Sẵn sàng');
            }
        };

        // Delay preloading by 6 seconds to prioritize main page hydration, auth and Lighthouse metrics
        const timer = setTimeout(startPreloading, 6000);
        return () => clearTimeout(timer);
    }, []);

    return null;
}

export default WebRPreloader;
