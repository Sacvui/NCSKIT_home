'use client';

import { useEffect, useRef, useCallback } from 'react';

interface AutoSaveOptions {
    /** Delay in ms before saving after last change. Default: 60000 (1 min) */
    delay?: number;
    /** Whether auto-save is enabled */
    enabled?: boolean;
}

/**
 * useAutoSave — debounce-based auto-save hook.
 *
 * Unlike a plain setTimeout in useEffect (which resets on every dep change
 * and may never fire if the user keeps interacting), this hook uses a
 * persistent ref-based timer that fires `delay` ms after the LAST change.
 *
 * Usage:
 *   useAutoSave(() => saveWorkspace(payload), [data, step, results], { delay: 60000 });
 */
export function useAutoSave(
    saveFn: () => void,
    deps: React.DependencyList,
    options: AutoSaveOptions = {}
) {
    const { delay = 60000, enabled = true } = options;
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const saveFnRef = useRef(saveFn);

    // Keep saveFn ref up-to-date without re-triggering the effect
    useEffect(() => {
        saveFnRef.current = saveFn;
    });

    const cancel = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const flush = useCallback(() => {
        cancel();
        saveFnRef.current();
    }, [cancel]);

    useEffect(() => {
        if (!enabled) return;

        // Reset timer on every dep change — fires delay ms after the LAST change
        cancel();
        timerRef.current = setTimeout(() => {
            saveFnRef.current();
        }, delay);

        return cancel;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, enabled, delay]);

    // Cleanup on unmount
    useEffect(() => () => cancel(), [cancel]);

    return { cancel, flush };
}
