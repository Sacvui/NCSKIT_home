'use client';

import React, { useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Code, Copy, Check, Lock, Sparkles, Terminal } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface RSyntaxViewerProps {
    code: string;
    userProfile?: any;
}

/**
 * R Syntax Viewer Component
 * Displays R code with copy functionality
 * Requires Researcher role to view
 */
export function RSyntaxViewer({ code, userProfile }: RSyntaxViewerProps) {
    const [copied, setCopied] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [showUnlockModal, setShowUnlockModal] = React.useState(false);
    const [secretCode, setSecretCode] = React.useState('');
    const [unlockError, setUnlockError] = React.useState('');
    const [isUnlocking, setIsUnlocking] = React.useState(false);

    const { refreshProfile } = useAuth();

    // Check if user has researcher or admin role
    const isResearcher = userProfile?.role === 'researcher' || userProfile?.role === 'admin';

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [code]);

    const handleUnlock = useCallback(async () => {
        if (!secretCode.trim()) {
            setUnlockError('Vui lòng nhập mã bí mật');
            return;
        }

        setIsUnlocking(true);
        setUnlockError('');

        try {
            const response = await fetch('/api/unlock-researcher', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secretCode: secretCode.trim() })
            });

            const data = await response.json();

            if (data.success) {
                await refreshProfile();
                setShowUnlockModal(false);
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            } else {
                setUnlockError(data.error || 'Mã không hợp lệ');
            }
        } catch (err) {
            setUnlockError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsUnlocking(false);
        }
    }, [secretCode, refreshProfile]);

    // If not researcher, show locked state (Premium Dark Look)
    if (!isResearcher) {
        return (
            <div className="bg-[#0f172a] rounded-[1.5rem] border border-white/5 shadow-2xl p-6 mt-6 print:hidden overflow-hidden relative group transition-all duration-500">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 blur-[80px] -mr-32 -mt-32 pointer-events-none ring-1 ring-amber-400/10"></div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                            <Lock className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-lg font-black text-white/95 tracking-tight">Equivalent R Syntax</h4>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/20">
                                    <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse"></span>
                                    Researcher Only
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-md">
                                Phân tích chuyên sâu này chỉ dành riêng cho Researcher. Hãy mở khóa để xem code R tương ứng.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowUnlockModal(true)}
                        className="group/btn relative px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-amber-900/40 active:scale-95 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                             Mở khóa <Sparkles className="w-4 h-4 text-amber-200" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    </button>
                </div>

                {/* Unlock Modal */}
                {showUnlockModal && (
                    <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-50 p-6 backdrop-blur-md">
                        <div className="bg-white rounded-[2.5rem] max-w-md w-full p-12 shadow-3xl border border-white/20">
                            <div className="w-20 h-20 bg-amber-500/10 text-amber-600 rounded-[2rem] flex items-center justify-center mb-8 mx-auto">
                                <Lock className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 text-center tracking-tighter">
                                Researcher Mode
                            </h3>
                            <p className="text-slate-500 text-center mb-10 font-medium leading-relaxed">
                                Nhập mã bí mật 6 số để kích hoạt tính năng Researcher và truy cập mã nguồn R chuyên sâu.
                            </p>
                            <div className="relative mb-8">
                                <input
                                    type="text"
                                    value={secretCode}
                                    onChange={(e) => setSecretCode(e.target.value)}
                                    placeholder="••••••"
                                    className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-amber-400 rounded-2xl text-center text-3xl font-black text-slate-900 outline-none transition-all tracking-[0.5em] placeholder:tracking-normal font-mono"
                                    autoFocus
                                />
                                {unlockError && (
                                    <p className="text-red-600 text-xs font-bold mt-4 text-center uppercase tracking-wider">{unlockError}</p>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setShowUnlockModal(false);
                                        setSecretCode('');
                                        setUnlockError('');
                                    }}
                                    className="flex-1 px-8 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleUnlock}
                                    disabled={isUnlocking}
                                    className="flex-1 px-8 py-4 bg-slate-900 hover:bg-amber-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                                >
                                    {isUnlocking ? 'Đang xác thực...' : 'Kích hoạt'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Unlocked State (Researcher View)
    return (
        <div className="bg-[#f8fafc] dark:bg-slate-900 transition-all duration-300 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-6 print:hidden">
            <div
                className="cursor-pointer select-none group"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="py-4 px-6 flex flex-row items-center justify-between bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <Terminal className="h-4 w-4" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                                Equivalent R Syntax
                                <span className="inline-flex items-center px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-md">
                                    Researcher Active
                                </span>
                            </CardTitle>
                        </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">
                        {expanded ? 'Hide Code' : 'Show R Code'}
                    </div>
                </div>
            </div>
            
            {expanded && (
                <div className="pt-0 pb-6 px-6">
                    <div className="relative group/code">
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-slate-800 text-slate-400 text-[9px] font-mono rounded-md border border-slate-700 z-10">
                            ncsstat_engine_v1.r
                        </div>
                        <pre className="bg-slate-900 text-indigo-300 p-6 pt-8 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap border border-slate-800 shadow-2xl custom-scrollbar leading-relaxed">
                            {code}
                        </pre>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                            className="absolute top-6 right-4 p-2 bg-slate-800/80 hover:bg-indigo-600 text-white rounded-lg transition-all opacity-0 group-hover/code:opacity-100 focus:opacity-100 flex items-center gap-2 border border-slate-700 shadow-lg"
                        >
                            {copied ? (
                                <><Check className="h-3 w-3" /> <span className="text-[10px] font-bold uppercase tracking-wider">Copied</span></>
                            ) : (
                                <><Copy className="h-3 w-3" /> <span className="text-[10px] font-bold uppercase tracking-wider">Copy</span></>
                            )}
                        </button>
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        Ready for RStudio reproduction
                    </div>
                </div>
            )}
        </div>
    );
}

export default RSyntaxViewer;
