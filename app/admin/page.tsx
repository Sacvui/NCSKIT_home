'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/utils/supabase/client'
import Link from 'next/link'
import {
    Users, Activity, Coins, TrendingUp, BookOpen, Scale,
    MessageSquare, ArrowUpRight, Loader2, ShieldCheck, BarChart3
} from 'lucide-react'

interface DashboardStats {
    totalUsers: number
    totalArticles: number
    totalScales: number
    totalFeedbacks: number
    avgRating: string
    recentUsers: { id: string; email: string; full_name: string | null; created_at: string }[]
}

export default function AdminPage() {
    const supabase = getSupabase()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        const [profiles, articles, scales, feedbacks] = await Promise.all([
            supabase.from('profiles').select('id, email, full_name, created_at, role', { count: 'exact' }).order('created_at', { ascending: false }).limit(5),
            supabase.from('knowledge_articles').select('id', { count: 'exact' }),
            supabase.from('scales').select('id', { count: 'exact' }),
            supabase.from('feedback').select('id, rating', { count: 'exact' }),
        ])

        const fbs = feedbacks.data || []
        const avg = fbs.length > 0
            ? (fbs.reduce((acc: number, f: any) => acc + (f.rating || 0), 0) / fbs.length).toFixed(1)
            : '0.0'

        setStats({
            totalUsers: profiles.count || 0,
            totalArticles: articles.count || 0,
            totalScales: scales.count || 0,
            totalFeedbacks: feedbacks.count || 0,
            avgRating: avg,
            recentUsers: (profiles.data || []).map((u: any) => ({
                id: u.id,
                email: u.email,
                full_name: u.full_name,
                created_at: u.created_at,
            })),
        })
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!stats) return null

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 className="w-7 h-7 text-blue-600" />
                    Dashboard Tổng quan
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Tình trạng hệ thống ncsStat Production
                </p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickStatCard
                    icon={Users}
                    label="Người dùng"
                    value={stats.totalUsers}
                    color="blue"
                    href="/admin/users"
                />
                <QuickStatCard
                    icon={BookOpen}
                    label="Bài viết kiến thức"
                    value={stats.totalArticles}
                    color="green"
                    href="/admin/knowledge"
                />
                <QuickStatCard
                    icon={Scale}
                    label="Thang đo"
                    value={stats.totalScales}
                    color="purple"
                    href="/admin/scales"
                />
                <QuickStatCard
                    icon={MessageSquare}
                    label="Phản hồi"
                    value={stats.totalFeedbacks}
                    subValue={`★ ${stats.avgRating}/5`}
                    color="amber"
                    href="/admin/feedback"
                />
            </div>

            {/* Quick Links + Recent Users */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl border p-6">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                        Quản trị nhanh
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Quản lý Users', href: '/admin/users', icon: Users, color: 'blue' },
                            { label: 'Phân quyền', href: '/admin/roles', icon: ShieldCheck, color: 'indigo' },
                            { label: 'Cấu hình giá', href: '/admin/config', icon: Coins, color: 'amber' },
                            { label: 'Knowledge', href: '/admin/knowledge', icon: BookOpen, color: 'green' },
                            { label: 'Scales', href: '/admin/scales', icon: Scale, color: 'purple' },
                            { label: 'Sức khỏe hệ thống', href: '/admin/health', icon: Activity, color: 'red' },
                        ].map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                            >
                                <div className={`w-9 h-9 rounded-lg bg-${item.color}-50 flex items-center justify-center`}>
                                    <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                                </div>
                                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{item.label}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-xl border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            Người dùng mới
                        </h3>
                        <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {stats.recentUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                        {(user.full_name || user.email)?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-slate-800">{user.full_name || 'Chưa đặt tên'}</div>
                                        <div className="text-xs text-slate-400">{user.email}</div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400">
                                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        ))}
                        {stats.recentUsers.length === 0 && (
                            <div className="text-center text-slate-400 py-8">Chưa có người dùng</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuickStatCard({ icon: Icon, label, value, subValue, color, href }: {
    icon: any; label: string; value: number | string; subValue?: string; color: string; href: string
}) {
    const gradients: Record<string, string> = {
        blue: 'from-blue-500 to-indigo-600',
        green: 'from-emerald-500 to-teal-600',
        purple: 'from-purple-500 to-violet-600',
        amber: 'from-amber-500 to-orange-600',
    }

    return (
        <Link href={href} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradients[color]} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{value}</div>
            <div className="text-sm text-slate-500">{label}</div>
            {subValue && <div className="text-xs text-amber-600 font-medium mt-1">{subValue}</div>}
        </Link>
    )
}
