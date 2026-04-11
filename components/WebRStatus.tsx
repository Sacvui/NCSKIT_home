import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { getWebRStatus, clearWebRStorage } from '@/lib/webr-wrapper';

export function WebRStatus() {
    const [status, setStatus] = useState({ isReady: false, isLoading: false, progress: '', lastError: null as string | null });
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        const checkStatus = () => setStatus(getWebRStatus());
        const interval = setInterval(checkStatus, 700);
        return () => clearInterval(interval);
    }, []);

    const handleReset = async () => {
        if (confirm('Bạn có muốn khôi phục lại bộ máy tính toán? Việc này sẽ xóa bộ nhớ đệm và tải lại trang để sửa các lỗi về tốc độ hoặc treo máy.')) {
            setIsResetting(true);
            await clearWebRStorage();
        }
    };

    if (status.isReady) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 shadow-sm whitespace-nowrap">
                    <CheckCircle className="w-4 h-4 shrink-0 text-green-500" />
                    <span className="hidden md:inline font-medium">R-Engine Ready</span>
                </div>
                <button 
                    onClick={handleReset}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-full transition-all"
                    title="Khôi phục bộ máy tính toán"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                </button>
            </div>
        );
    }

    if (status.isLoading) {
        return (
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm whitespace-nowrap max-w-[150px] md:max-w-none overflow-hidden">
                <Loader2 className="w-4 h-4 animate-spin shrink-0 text-blue-500" />
                <span className="truncate font-medium">{status.progress || 'Loading...'}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 px-3 py-1.5 rounded-full border border-red-100 shadow-sm">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-medium whitespace-nowrap">R-Engine Error</span>
            </div>
            <button
                onClick={handleReset}
                disabled={isResetting}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
                {isResetting ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                {isResetting ? 'Đang đặt lại...' : 'Khôi phục ngay'}
            </button>
        </div>
    );
}
