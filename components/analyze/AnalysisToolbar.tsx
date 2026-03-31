'use client'

import { Eye, EyeOff, Trash2, FileText, Settings, Shield, Save, PlusCircle, FolderOpen } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { WebRStatus } from '@/components/WebRStatus'
import { Locale, t } from '@/lib/i18n'

interface ToolbarProps {
    isPrivateMode: boolean
    setIsPrivateMode: (v: boolean) => void
    clearSession: () => void
    filename: string | null
    onSave: () => void
    locale: Locale
}

export default function AnalysisToolbar({
    isPrivateMode,
    setIsPrivateMode,
    clearSession,
    filename,
    onSave,
    locale
}: ToolbarProps) {
    return (
        <div className="flex items-center gap-3 md:gap-6 overflow-x-auto no-scrollbar max-w-full">
            <div className="flex items-center gap-4">
                <WebRStatus />
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />

                <button
                    onClick={onSave}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white hover:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100"
                >
                    <Save className="w-3.5 h-3.5" />
                    <span>{locale === 'vi' ? 'Lưu dự án' : 'Save Academy'}</span>
                </button>

                <button
                    onClick={() => {
                        const msg = locale === 'vi' ? 'Bạn có chắc muốn xóa phiên làm việc hiện tại và bắt đầu khảo sát mới?' : 'Clear session and start new analysis?';
                        if (confirm(msg)) {
                            clearSession();
                        }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{locale === 'vi' ? 'Phân tích mới' : 'New Research'}</span>
                </button>
            </div>
        </div>
    )
}
