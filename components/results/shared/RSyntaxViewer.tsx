'use client';

import React, { useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Code, Copy, Check } from 'lucide-react';

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
                // Reload page to reflect new role
                window.location.reload();
            } else {
                setUnlockError(data.error || 'Mã không hợp lệ');
            }
        } catch (err) {
            setUnlockError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsUnlocking(false);
        }
    }, [secretCode]);

    // If not researcher, show locked state
    if (!isResearcher) {
        return (
            <Card className="border-amber-200 bg-amber-50/50 print:hidden">
                <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code className="h-4 w-4 text-amber-600" />
                            <CardTitle className="text-sm font-medium text-amber-800">
                                Equivalent R Syntax
                            </CardTitle>
                            <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-[10px] font-semibold rounded-full">
                                🔒 Researcher Only
                            </span>
                        </div>
                        <button
                            onClick={useCallback(() => setShowUnlockModal(true), [])}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-md transition-colors"
                        >
                            Mở khóa
                        </button>
                    </div>
                    <p className="text-xs text-amber-700 mt-2">
                        Tính năng này dành riêng cho Researcher. Nhập mã bí mật để nâng cấp tài khoản.
                    </p>
                </CardHeader>

                {/* Unlock Modal */}
                {showUnlockModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Researcher Mode
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Nhập mã bí mật để trở thành Researcher và truy cập R Syntax code.
                            </p>
                            <input
                                type="text"
                                value={secretCode}
                                onChange={(e) => setSecretCode(e.target.value)}
                                placeholder="Nhập mã bí mật..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-center text-lg font-mono tracking-widest"
                                autoFocus
                            />
                            {unlockError && (
                                <p className="text-red-600 text-sm mt-2 text-center">{unlockError}</p>
                            )}
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={useCallback(() => {
                                        setShowUnlockModal(false);
                                        setSecretCode('');
                                        setUnlockError('');
                                    }, [])}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleUnlock}
                                    disabled={isUnlocking}
                                    className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50"
                                >
                                    {isUnlocking ? 'Đang xử lý...' : 'Xác nhận'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        );
    }

    return (
        <Card className="border-blue-200 bg-blue-50/50 print:hidden">
            <div
                className="cursor-pointer select-none"
                onClick={useCallback(() => setExpanded(!expanded), [expanded])}
            >
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-blue-600" />
                        <CardTitle className="text-sm font-medium text-blue-800">Equivalent R Syntax</CardTitle>
                        <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-[10px] font-semibold rounded-full">
                            Researcher
                        </span>
                    </div>
                    <div className="text-xs text-blue-500 font-normal hover:text-blue-700">
                        {expanded ? 'Hide Code' : 'Show Code'}
                    </div>
                </CardHeader>
            </div>
            {expanded && (
                <CardContent className="pt-0 pb-3 px-4">
                    <div className="relative group">
                        <pre className="bg-slate-900 text-slate-50 p-4 rounded-md text-xs font-mono overflow-x-auto whitespace-pre-wrap border border-slate-700 shadow-inner">
                            {code}
                        </pre>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                            className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Copy to clipboard"
                        >
                            {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-white/70" />}
                        </button>
                    </div>
                    <p className="text-[10px] text-blue-600/70 mt-2 italic flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Run this code in R or RStudio to reproduce these exact results.
                    </p>
                </CardContent>
            )}
        </Card>
    );
}

export default RSyntaxViewer;
