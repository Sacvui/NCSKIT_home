'use client';

/**
 * useAnalysisError — shared hook for displaying R analysis errors
 *
 * Converts raw R/JS errors into user-friendly Vietnamese messages
 * using translateRErrorDetailed() and shows them via showToast().
 */

import { translateRErrorDetailed } from '@/lib/webr/utils';

type ShowToast = (message: string, type: 'success' | 'error' | 'info') => void;

/**
 * Returns a handleAnalysisError function that:
 * 1. Translates the error to a UserFriendlyError
 * 2. Shows title + suggestion via showToast
 * 3. Logs the raw error to console for debugging
 */
export function useAnalysisError(showToast: ShowToast) {
    return function handleAnalysisError(err: unknown): void {
        const rawMsg = err instanceof Error ? err.message : String(err);
        console.error('[Analysis Error]', rawMsg, err);

        const friendly = translateRErrorDetailed(rawMsg);
        // Show title + suggestion — concise enough for a toast
        showToast(`${friendly.title} — ${friendly.suggestion}`, 'error');
    };
}
