'use client';

/**
 * useWebRGuard
 *
 * Returns a function that checks if WebR is ready before running analysis.
 * If WebR is still initializing or installing packages, shows a toast and returns false.
 *
 * Usage:
 *   const checkWebRReady = useWebRGuard(showToast);
 *   if (!checkWebRReady()) return;
 *   // proceed with analysis
 */

import { getWebRStatus } from '@/lib/webr-wrapper';

type ShowToast = (message: string, type: 'success' | 'error' | 'info') => void;

export function useWebRGuard(showToast: ShowToast) {
    return function checkWebRReady(): boolean {
        const status = getWebRStatus();

        if (status.isLoading) {
            showToast(
                'R Engine đang khởi động và tải thư viện. Vui lòng đợi vài giây rồi thử lại.',
                'info'
            );
            return false;
        }

        if (!status.isReady) {
            showToast(
                'R Engine chưa sẵn sàng. Vui lòng đợi khởi động hoàn tất.',
                'info'
            );
            return false;
        }

        return true;
    };
}
