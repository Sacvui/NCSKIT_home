'use client'

import TokensManager from '@/components/admin/TokensManager'
import { FileText } from 'lucide-react'

export default function AdminTokensPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    Quản lý Token & Giao dịch
                </h1>
                <p className="text-slate-500 text-sm">Quản lý số dư NCS Token của người dùng, xem lịch sử giao dịch tiêu dùng học thuật.</p>
            </div>

            <TokensManager />
        </div>
    )
}
