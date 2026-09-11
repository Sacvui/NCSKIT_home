'use client'

import { AdminAutoTest } from '@/components/admin/AdminAutoTest'

export default function AdminAutoTestPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Auto Test Engine</h1>
                <p className="text-slate-500 text-sm mt-1">Kiểm tra tự động tất cả các module phân tích R</p>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-6">
                <AdminAutoTest />
            </div>
        </div>
    )
}
