'use client';

import { useEffect } from 'react';
import { getSupabase } from '@/utils/supabase/client';

const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
const CACHE_VERSION_KEY = 'ncs_cache_version';

/**
 * CacheVersionChecker
 * 
 * Invisible component that periodically checks if the admin has triggered
 * a cache purge. If the server's cache_version differs from the locally
 * stored version, it forces a hard reload to pick up new assets.
 * 
 * Place this component in the root layout.
 */
export default function CacheVersionChecker() {
    useEffect(() => {
        const checkVersion = async () => {
            try {
                const supabase = getSupabase();
                const { data } = await supabase
                    .from('system_config')
                    .select('value')
                    .eq('key', 'cache_version')
                    .maybeSingle();

                if (!data?.value) return;

                const serverVersion = String(data.value);
                const localVersion = localStorage.getItem(CACHE_VERSION_KEY);

                if (localVersion && localVersion !== serverVersion) {
                    console.log('[CacheCheck] New version detected. Reloading...');
                    localStorage.setItem(CACHE_VERSION_KEY, serverVersion);
                    
                    // Unregister any service workers to ensure clean slate
                    if ('serviceWorker' in navigator) {
                        const registrations = await navigator.serviceWorker.getRegistrations();
                        for (const reg of registrations) {
                            await reg.unregister();
                        }
                    }

                    // Clear browser caches
                    if ('caches' in window) {
                        const cacheNames = await caches.keys();
                        for (const name of cacheNames) {
                            await caches.delete(name);
                        }
                    }

                    // Force hard reload (bypass browser cache)
                    window.location.reload();
                } else if (!localVersion) {
                    // First visit — just store the version
                    localStorage.setItem(CACHE_VERSION_KEY, serverVersion);
                }
            } catch (e) {
                // Silent fail — cache check is non-critical
            }
        };

        // Check immediately on mount
        checkVersion();

        // Then check periodically
        const interval = setInterval(checkVersion, CHECK_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    return null; // Invisible component
}
