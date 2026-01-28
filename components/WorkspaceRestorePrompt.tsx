'use client';

import React from 'react';
import { FileText, X, CheckCircle } from 'lucide-react';

interface WorkspaceRestorePromptProps {
    fileName: string;
    timestamp: number;
    dataRows: number;
    onRestore: () => void;
    onDiscard: () => void;
}

export function WorkspaceRestorePrompt({
    fileName,
    timestamp,
    dataRows,
    onRestore,
    onDiscard
}: WorkspaceRestorePromptProps) {
    const timeAgo = getTimeAgo(timestamp);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Phục hồi phiên làm việc?</h3>
                            <p className="text-blue-100 text-sm mt-1">
                                Tìm thấy dữ liệu đã lưu
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 mb-2">
                                    Chúng tôi phát hiện phiên làm việc chưa hoàn thành từ <strong>{timeAgo}</strong>
                                </p>
                                <div className="space-y-1 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">📄 File:</span>
                                        <span className="font-medium text-gray-900 truncate">{fileName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">📊 Dữ liệu:</span>
                                        <span className="font-medium text-gray-900">{dataRows.toLocaleString()} dòng</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600">
                        Bạn có muốn tiếp tục phân tích với dữ liệu này không?
                    </p>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={onRestore}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5" />
                        Phục hồi
                    </button>
                    <button
                        onClick={onDiscard}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <X className="w-5 h-5" />
                        Bắt đầu mới
                    </button>
                </div>

                {/* Footer note */}
                <div className="px-6 pb-6">
                    <p className="text-xs text-gray-500 text-center">
                        💡 Dữ liệu được lưu tự động mỗi 30 giây
                    </p>
                </div>
            </div>
        </div>
    );
}

function getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
}
