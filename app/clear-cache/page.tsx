'use client';

import { useEffect } from 'react';

export default function ClearCachePage() {
    useEffect(() => {
        const wipeAll = async () => {
            try {
                console.log('Initiating global cache wipe...');
                // 1. Clear LocalStorage and SessionStorage
                localStorage.clear();
                sessionStorage.clear();

                // 2. Unregister ALL service workers
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (const reg of registrations) {
                        await reg.unregister();
                        console.log('Unregistered SW:', reg.scope);
                    }
                }

                // 3. Clear ALL Cache Storage (used by SW)
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    for (const name of cacheNames) {
                        await caches.delete(name);
                        console.log('Deleted cache:', name);
                    }
                }

                // 4. Set a flag so we know we just wiped it
                sessionStorage.setItem('cache_wiped', 'true');

                // 5. Redirect home
                window.location.href = '/';
            } catch (e) {
                console.error('Error wiping cache:', e);
                // Fallback redirect
                window.location.href = '/';
            }
        };

        wipeAll();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
            <h1 className="text-2xl font-bold mb-4">Đang làm sạch hệ thống...</h1>
            <p className="text-gray-600 mb-8">Vui lòng đợi trong giây lát, hệ thống đang gỡ bỏ các tệp tin lưu tạm bị lỗi.</p>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
