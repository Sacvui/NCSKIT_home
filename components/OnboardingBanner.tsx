'use client';

/**
 * OnboardingBanner
 *
 * Shown to first-time users on the analyze page.
 * Offers a sample dataset to try immediately without uploading a file.
 * Dismissed permanently via localStorage.
 */

import { useState, useEffect } from 'react';
import { Sparkles, X, Play } from 'lucide-react';

interface OnboardingBannerProps {
    /** Called when user clicks "Try sample data" — receives the CSV text */
    onLoadSample: (csvText: string, filename: string) => void;
}

const LS_KEY = 'ncsstat_onboarding_completed';

export function OnboardingBanner({ onLoadSample }: OnboardingBannerProps) {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Show only if user hasn't dismissed before
        const done = localStorage.getItem(LS_KEY);
        if (!done) setVisible(true);
    }, []);

    const handleDismiss = () => {
        localStorage.setItem(LS_KEY, '1');
        setVisible(false);
    };

    const handleLoadSample = async () => {
        setLoading(true);
        try {
            const res = await fetch('/sample-data/cronbach-sample.csv');
            if (!res.ok) throw new Error('Failed to load sample');
            const text = await res.text();
            onLoadSample(text, 'cronbach-sample.csv');
            handleDismiss();
        } catch {
            // Fallback: generate inline sample
            const header = 'Q1,Q2,Q3,Q4,Q5\n';
            const rows = Array.from({ length: 50 }, () =>
                Array.from({ length: 5 }, () => Math.floor(Math.random() * 4) + 2).join(',')
            ).join('\n');
            onLoadSample(header + rows, 'cronbach-sample.csv');
            handleDismiss();
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 mb-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Dismiss button */}
            <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Đóng hướng dẫn"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-black text-blue-900 text-sm uppercase tracking-tight mb-1">
                        Lần đầu dùng ncsStat?
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                        Thử ngay với <strong>dữ liệu mẫu</strong> — 100 quan sát, 5 biến Likert.
                        Chạy Cronbach's Alpha để xem kết quả ngay lập tức.
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleLoadSample}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-60"
                        >
                            {loading
                                ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <Play className="w-3.5 h-3.5 fill-white" />
                            }
                            Dùng dữ liệu mẫu
                        </button>

                        <button
                            onClick={handleDismiss}
                            className="px-4 py-2 text-slate-500 hover:text-blue-900 text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                            Bỏ qua
                        </button>
                    </div>
                </div>
            </div>

            {/* Steps hint */}
            <div className="mt-4 pt-4 border-t border-blue-100 flex items-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-blue-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                    Tải dữ liệu
                </span>
                <span className="text-slate-300">→</span>
                <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                    Xem hồ sơ
                </span>
                <span className="text-slate-300">→</span>
                <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-black">3</span>
                    Chọn phân tích
                </span>
                <span className="text-slate-300">→</span>
                <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-black">4</span>
                    Xem kết quả
                </span>
            </div>
        </div>
    );
}

export default OnboardingBanner;
