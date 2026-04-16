'use client';

import { useEffect } from 'react';

export default function ClearCachePage() {
    useEffect(() => {
        const wipeAll = async () => {
            try {
                // Initiating global cache wipe
                const ev = localStorage.getItem('ncs_emergency_version');
                
                // 1. Clear LocalStorage and SessionStorage
                localStorage.clear();
                sessionStorage.clear();

                if (ev) {
                    localStorage.setItem('ncs_emergency_version', ev);
                }

                // 2. Unregister ALL service workers
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (const reg of registrations) {
                        await reg.unregister();
                        
                    }
                }

                // 3. Clear ALL Cache Storage (used by SW)
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    for (const name of cacheNames) {
                        await caches.delete(name);
                        
                    }
                }

                // 4. Set a flag so we know we just wiped it
                sessionStorage.setItem('cache_wiped', 'true');

                // 5. Redirect home
                window.location.href = '/';
            } catch (e) {
                // Silent fail — redirect anyway
                // Fallback redirect
                window.location.href = '/';
            }
        };

        wipeAll();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
            <h1 className="text-2xl font-bold mb-4">Äang lÃ m sáº¡ch há»‡ thá»‘ng...</h1>
            <p className="text-gray-600 mb-8">Vui lÃ²ng Ä‘á»£i trong giÃ¢y lÃ¡t, há»‡ thá»‘ng Ä‘ang gá»¡ bá» cÃ¡c tá»‡p tin lÆ°u táº¡m bá»‹ lá»—i.</p>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}

