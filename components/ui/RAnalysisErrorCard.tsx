'use client';

/**
 * RAnalysisErrorCard
 *
 * Rich error display for R analysis failures.
 * Shows title, message, suggestion, and optional action buttons.
 * Use this for inline error display inside result areas.
 * For toast notifications, use useAnalysisError() hook instead.
 */

import { AlertTriangle, RefreshCw, MessageSquare } from 'lucide-react';
import type { UserFriendlyError } from '@/lib/webr/utils';

interface RAnalysisErrorCardProps {
    error: UserFriendlyError;
    onRetry?: () => void;
    onReport?: () => void;
    className?: string;
}

export function RAnalysisErrorCard({
    error,
    onRetry,
    onReport,
    className = '',
}: RAnalysisErrorCardProps) {
    return (
        <div className={`rounded-2xl border border-red-100 bg-red-50 p-6 space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-black text-red-800 text-sm uppercase tracking-tight">
                        {error.title}
                    </h4>
                    <p className="text-red-700 text-sm mt-1 leading-relaxed">
                        {error.message}
                    </p>
                </div>
            </div>

            {/* Suggestion */}
            <div className="bg-white/70 rounded-xl px-4 py-3 border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">
                    Gợi ý
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                    {error.suggestion}
                </p>
            </div>

            {/* Action buttons */}
            {(error.canRetry || error.canReport) && (
                <div className="flex gap-2 pt-1">
                    {error.canRetry && onRetry && (
                        <button
                            onClick={onRetry}
                            className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-900 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Thử lại
                        </button>
                    )}
                    {error.canReport && onReport && (
                        <button
                            onClick={onReport}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 hover:bg-red-50 text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Báo cáo lỗi
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default RAnalysisErrorCard;
