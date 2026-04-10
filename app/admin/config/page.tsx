'use client'

import React, { useEffect, useState } from 'react'
import { 
    getAnalysisCosts, updateAnalysisCosts, ANALYSIS_TYPES,
    getDefaultBalance, updateDefaultBalance,
    getReferralReward, updateReferralReward
} from '@/lib/ncs-credits'
import { toast } from 'react-hot-toast'
import { Save, Loader2, RefreshCw, HandCoins, UserPlus } from 'lucide-react'

export default function AdminConfigPage() {
    const [costs, setCosts] = useState<Record<string, number>>({})
    const [defaultBalance, setDefaultBalance] = useState<number>(100000)
    const [referralReward, setReferralReward] = useState<number>(5000)
    
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    
    const [originalCosts, setOriginalCosts] = useState<Record<string, number>>({})
    const [originalDefaultBalance, setOriginalDefaultBalance] = useState<number>(100000)
    const [originalReferralReward, setOriginalReferralReward] = useState<number>(5000)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const data = await getAnalysisCosts()
            const bal = await getDefaultBalance()
            const ref = await getReferralReward()
            
            setCosts(data)
            setDefaultBalance(bal)
            setReferralReward(ref)
            
            setOriginalCosts(JSON.parse(JSON.stringify(data)))
            setOriginalDefaultBalance(bal)
            setOriginalReferralReward(ref)
        } catch (error) {
            console.error('Failed to load configs', error)
            toast.error('Không thể tải cấu hình hệ thống')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (key: string, value: string) => {
        const numValue = parseInt(value) || 0
        setCosts(prev => ({
            ...prev,
            [key]: numValue
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const promises = [
                updateAnalysisCosts(costs),
                updateDefaultBalance(defaultBalance),
                updateReferralReward(referralReward)
            ]
            
            const results = await Promise.all(promises)
            
            if (results.every(res => res)) {
                toast.success('Đã cập nhật cấu hình hệ thống thành công')
                setOriginalCosts(JSON.parse(JSON.stringify(costs)))
                setOriginalDefaultBalance(defaultBalance)
                setOriginalReferralReward(referralReward)
            } else {
                toast.error('Lỗi khi lưu một số cấu hình')
            }
        } catch (error) {
            console.error('Save error:', error)
            toast.error('Có lỗi xảy ra')
        } finally {
            setSaving(false)
        }
    }

    const hasChanges = JSON.stringify(costs) !== JSON.stringify(originalCosts) 
        || defaultBalance !== originalDefaultBalance
        || referralReward !== originalReferralReward

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Cấu hình hệ thống</h1>
                    <p className="text-slate-500 text-sm">Quản lý giá (Credits) và ngân sách Token mặc định.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => loadData()}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Tải lại"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${hasChanges && !saving
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Lưu thay đổi
                    </button>
                </div>
            </div>

            {/* General Tokens Config */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-emerald-600 mb-2">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <HandCoins className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-800">Token Đăng Ký Mới</h2>
                            <p className="text-xs text-slate-500">Số dư mặc định cho tài khoản mới</p>
                        </div>
                    </div>
                    <div>
                        <input
                            type="number"
                            value={defaultBalance}
                            onChange={(e) => setDefaultBalance(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2 text-left border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono font-bold text-lg text-slate-700"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-purple-600 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-800">Token Thưởng Giới Thiệu</h2>
                            <p className="text-xs text-slate-500">Thưởng cho user chia sẻ mã giới thiệu</p>
                        </div>
                    </div>
                    <div>
                        <input
                            type="number"
                            value={referralReward}
                            onChange={(e) => setReferralReward(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2 text-left border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-mono font-bold text-lg text-slate-700"
                        />
                    </div>
                </div>
            </div>

            {/* Analysis Costs Config */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-semibold text-slate-700">Bảng giá phân tích (Analysis Costs)</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Loại phân tích</th>
                                <th className="px-6 py-3">Mã hệ thống (Key)</th>
                                <th className="px-6 py-3 text-right">Giá tiền (NCS)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {Object.entries(ANALYSIS_TYPES).map(([key, label]) => (
                                <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-slate-700">
                                        {label}
                                    </td>
                                    <td className="px-6 py-3 text-slate-400 font-mono text-xs">
                                        {key}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <input
                                            type="number"
                                            value={costs[key] || 0}
                                            onChange={(e) => handleChange(key, e.target.value)}
                                            className="w-32 px-3 py-1 text-right border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
