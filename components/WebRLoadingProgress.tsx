'use client';

import { useEffect, useState, useCallback } from 'react';
import { getWebRStatus, setProgressCallback, initWebR, resetWebR } from '@/lib/webr-wrapper';

// ─── Phase detection ──────────────────────────────────────────────────────────

type Phase = 'idle' | 'starting' | 'packages' | 'ready' | 'error';

interface PhaseConfig {
    label: string;
    labelEn: string;
    percent: number;
    color: string;
}

const PHASE_CONFIG: Record<Phase, PhaseConfig> = {
    idle:     { label: 'Chờ khởi động...', labelEn: 'Waiting...', percent: 0,   color: 'bg-slate-300' },
    starting: { label: 'Khởi động R Engine...', labelEn: 'Starting R Engine...', percent: 20, color: 'bg-blue-400' },
    packages: { label: 'Tải thư viện thống kê...', labelEn: 'Loading R packages...', percent: 60, color: 'bg-blue-500' },
    ready:    { label: 'R Engine sẵn sàng!', labelEn: 'R Engine ready!', percent: 100, color: 'bg-green-500' },
    error:    { label: 'Lỗi khởi động R Engine', labelEn: 'R Engine failed to start', percent: 0, color: 'bg-red-400' },
};

/**
 * Detect the current phase from the progress string emitted by core.ts
 */
function detectPhase(progress: string, isReady: boolean, lastError: string | null): Phase {
    if (isReady) return 'ready';
    if (lastError) return 'error';
    if (!progress) return 'idle';

    const p = progress.toLowerCase();
    if (p.includes('sẵn sàng') || p.includes('ready')) return 'ready';
    if (p.includes('thư viện') || p.includes('package') || p.includes('install') || p.includes('loading')) return 'packages';
    if (p.includes('khởi') || p.includes('start') || p.includes('init') || p.includes('bộ nhớ') || p.includes('storage')) return 'starting';
    if (p.includes('lỗi') || p.includes('error') || p.includes('fail')) return 'error';

    return 'starting';
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface WebRLoadingProgressProps {
    /** Show the component only while loading (hide when ready). Default: true */
    hideWhenReady?: boolean;
    /** Compact mode — smaller UI for embedding inside analyze page. Default: false */
    compact?: boolean;
    /** Called when R engine becomes ready */
    onReady?: () => void;
    /** Called when R engine fails */
    onError?: (error: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WebRLoadingProgress({
    hideWhenReady = true,
    compact = false,
    onReady,
    onError,
}: WebRLoadingProgressProps) {
    const [phase, setPhase] = useState<Phase>('idle');
    const [progressMsg, setProgressMsg] = useState('');
    const [elapsedSec, setElapsedSec] = useState(0);
    const [startTime] = useState(() => Date.now());
    const [isFromCache, setIsFromCache] = useState(false);
    const [showRetry, setShowRetry] = useState(false);

    // Detect if loading from cache (fast path < 8s)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (phase === 'ready' && elapsedSec < 8) setIsFromCache(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [phase, elapsedSec]);

    // Poll WebR status and subscribe to progress updates
    useEffect(() => {
        // Subscribe to progress messages from core.ts
        setProgressCallback((msg: string) => {
            setProgressMsg(msg);
            const status = getWebRStatus();
            const newPhase = detectPhase(msg, status.isReady, status.lastError);
            setPhase(newPhase);

            if (newPhase === 'ready' && onReady) onReady();
            if (newPhase === 'error' && onError) onError(status.lastError || 'Unknown error');
        });

        // Also poll every 500ms to catch state changes not emitted via callback
        const poll = setInterval(() => {
            const status = getWebRStatus();
            const newPhase = detectPhase(status.progress, status.isReady, status.lastError);
            setPhase(prev => {
                if (prev !== newPhase) {
                    if (newPhase === 'ready' && onReady) onReady();
                    if (newPhase === 'error' && onError) onError(status.lastError || 'Unknown error');
                }
                return newPhase;
            });
            if (status.progress) setProgressMsg(status.progress);
        }, 500);

        return () => clearInterval(poll);
    }, [onReady, onError]);

    // Elapsed time counter
    useEffect(() => {
        if (phase === 'ready' || phase === 'idle') return;
        const timer = setInterval(() => {
            setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [phase, startTime]);

    // Show retry button after 60 seconds of non-ready state
    useEffect(() => {
        if (phase === 'ready' || phase === 'idle') { setShowRetry(false); return; }
        const timer = setTimeout(() => setShowRetry(true), 60_000);
        return () => clearTimeout(timer);
    }, [phase]);

    const handleRetry = useCallback(async () => {
        setShowRetry(false);
        setPhase('starting');
        setProgressMsg('Đang khởi động lại...');
        setElapsedSec(0);
        resetWebR();
        try {
            await initWebR();
        } catch {
            setPhase('error');
        }
    }, []);

    // Hide when ready (if configured)
    if (hideWhenReady && phase === 'ready') return null;
    if (phase === 'idle') return null;

    const config = PHASE_CONFIG[phase];
    const estimatedTime = isFromCache ? '~5 giây' : '~30 giây';

    // ── Compact mode ──────────────────────────────────────────────────────────
    if (compact) {
        return (
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm">
                {phase !== 'ready' && phase !== 'error' && (
                    <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin shrink-0" />
                )}
                {phase === 'error' && <span className="text-red-500 shrink-0">⚠️</span>}
                {phase === 'ready' && <span className="text-green-600 shrink-0">✓</span>}
                <span className="text-blue-800 font-medium truncate">{config.label}</span>
                {phase !== 'ready' && phase !== 'error' && (
                    <span className="text-blue-400 text-xs shrink-0">{elapsedSec}s</span>
                )}
                {showRetry && (
                    <button
                        onClick={handleRetry}
                        className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-semibold underline shrink-0"
                    >
                        Thử lại
                    </button>
                )}
            </div>
        );
    }

    // ── Full mode ─────────────────────────────────────────────────────────────
    return (
        <div className={`rounded-2xl border p-6 space-y-4 transition-all ${
            phase === 'error'
                ? 'bg-red-50 border-red-100'
                : phase === 'ready'
                ? 'bg-green-50 border-green-100'
                : 'bg-blue-50 border-blue-100'
        }`}>
            {/* Header */}
            <div className="flex items-center gap-3">
                {phase !== 'ready' && phase !== 'error' && (
                    <div className="w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin shrink-0" />
                )}
                {phase === 'error' && (
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <span className="text-red-500 text-xs font-bold">!</span>
                    </div>
                )}
                {phase === 'ready' && (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <span className="text-green-600 text-xs font-bold">✓</span>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">{config.label}</p>
                    {progressMsg && progressMsg !== config.label && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">{progressMsg}</p>
                    )}
                </div>
                {phase !== 'ready' && phase !== 'error' && (
                    <span className="text-xs text-slate-400 font-mono shrink-0">{elapsedSec}s</span>
                )}
            </div>

            {/* Progress bar */}
            {phase !== 'idle' && (
                <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden border border-white/80">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${config.color} ${
                            phase !== 'ready' && phase !== 'error' ? 'animate-pulse' : ''
                        }`}
                        style={{ width: `${config.percent}%` }}
                    />
                </div>
            )}

            {/* Steps indicator */}
            {phase !== 'ready' && phase !== 'error' && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    {(['starting', 'packages', 'ready'] as Phase[]).map((p, i) => (
                        <div key={p} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full transition-colors ${
                                phase === p ? 'bg-blue-500 animate-pulse' :
                                PHASE_CONFIG[p].percent <= PHASE_CONFIG[phase].percent ? 'bg-blue-300' : 'bg-slate-200'
                            }`} />
                            <span className={phase === p ? 'text-blue-700 font-semibold' : ''}>
                                {p === 'starting' ? 'Khởi động' : p === 'packages' ? 'Thư viện' : 'Sẵn sàng'}
                            </span>
                            {i < 2 && <span className="text-slate-200">→</span>}
                        </div>
                    ))}
                </div>
            )}

            {/* Time estimate */}
            {phase !== 'ready' && phase !== 'error' && (
                <p className="text-xs text-slate-400">
                    ⏱ Ước tính: {estimatedTime}
                    {!isFromCache && ' (lần đầu tải thư viện)'}
                    {isFromCache && ' (từ cache)'}
                </p>
            )}

            {/* Error state */}
            {phase === 'error' && (
                <div className="space-y-2">
                    <p className="text-sm text-red-600">
                        R Engine không thể khởi động. Vui lòng kiểm tra kết nối mạng và thử lại.
                    </p>
                    <p className="text-xs text-red-400">
                        Nếu lỗi tiếp tục, hãy thử xóa cache trình duyệt hoặc dùng Chrome/Firefox.
                    </p>
                </div>
            )}

            {/* Retry button */}
            {(showRetry || phase === 'error') && (
                <button
                    onClick={handleRetry}
                    className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95"
                >
                    Thử lại
                </button>
            )}
        </div>
    );
}

export default WebRLoadingProgress;
