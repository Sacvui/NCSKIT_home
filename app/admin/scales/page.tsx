'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/utils/supabase/client'
import { Scale, Search, Eye, Trash2, Loader2, ChevronDown, ChevronUp, BookOpen, Hash, Layers } from 'lucide-react'

interface ScaleRecord {
    id: string
    name: string
    name_en: string | null
    abbreviation: string | null
    category: string | null
    author: string | null
    year: number | null
    description: string | null
    total_items: number | null
    likert_points: number | null
    is_published: boolean
    created_at: string
}

interface ScaleItem {
    id: string
    scale_id: string
    item_number: number
    content_vi: string | null
    content_en: string | null
    dimension: string | null
    is_reverse: boolean
}

export default function AdminScalesPage() {
    const supabase = getSupabase()
    const [scales, setScales] = useState<ScaleRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')
    const [expandedScale, setExpandedScale] = useState<string | null>(null)
    const [scaleItems, setScaleItems] = useState<Record<string, ScaleItem[]>>({})
    const [loadingItems, setLoadingItems] = useState<string | null>(null)

    useEffect(() => {
        loadScales()
    }, [])

    const loadScales = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('scales')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setScales(data)
        }
        setLoading(false)
    }

    const loadScaleItems = async (scaleId: string) => {
        if (scaleItems[scaleId]) {
            setExpandedScale(expandedScale === scaleId ? null : scaleId)
            return
        }

        setLoadingItems(scaleId)
        const { data, error } = await supabase
            .from('scale_items')
            .select('*')
            .eq('scale_id', scaleId)
            .order('item_number')

        if (!error && data) {
            setScaleItems(prev => ({ ...prev, [scaleId]: data }))
        }
        setLoadingItems(null)
        setExpandedScale(expandedScale === scaleId ? null : scaleId)
    }

    const togglePublish = async (id: string, current: boolean) => {
        const { error } = await supabase
            .from('scales')
            .update({ is_published: !current })
            .eq('id', id)

        if (!error) {
            setScales(prev => prev.map(s => s.id === id ? { ...s, is_published: !current } : s))
        }
    }

    const deleteScale = async (id: string) => {
        if (!confirm('Bạn chắc chắn muốn xoá thang đo này và tất cả items liên quan?')) return

        // Delete items first, then scale
        await supabase.from('scale_items').delete().eq('scale_id', id)
        const { error } = await supabase.from('scales').delete().eq('id', id)

        if (!error) {
            setScales(prev => prev.filter(s => s.id !== id))
        }
    }

    const categories = [...new Set(scales.map(s => s.category).filter(Boolean))]

    const filtered = scales.filter(s => {
        const matchSearch = (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (s.abbreviation || '').toLowerCase().includes(search.toLowerCase()) ||
            (s.author || '').toLowerCase().includes(search.toLowerCase())
        const matchCat = filterCategory === 'all' || s.category === filterCategory
        return matchSearch && matchCat
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Scale className="w-6 h-6 text-purple-600" />
                    Quản lý Thang đo (Scales)
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    {scales.length} thang đo · Tổng {scales.reduce((acc, s) => acc + (s.total_items || 0), 0)} items
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Layers className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-slate-500">Tổng thang đo</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{scales.length}</div>
                </div>
                <div className="bg-white rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-slate-500">Tổng items</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                        {scales.reduce((acc, s) => acc + (s.total_items || 0), 0)}
                    </div>
                </div>
                <div className="bg-white rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-slate-500">Đang xuất bản</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                        {scales.filter(s => s.is_published).length}
                    </div>
                </div>
                <div className="bg-white rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-slate-500">Danh mục</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-600">{categories.length}</div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, viết tắt, hoặc tác giả..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map(c => (
                        <option key={c} value={c!}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Thang đo</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Tác giả / Năm</th>
                            <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600">Items</th>
                            <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600">Likert</th>
                            <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600">Trạng thái</th>
                            <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(scale => (
                            <>
                                <tr key={scale.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div>
                                            <div className="font-medium text-slate-800">{scale.name}</div>
                                            {scale.abbreviation && (
                                                <span className="text-xs text-slate-400 font-mono">({scale.abbreviation})</span>
                                            )}
                                            {scale.category && (
                                                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-600">
                                                    {scale.category}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {scale.author || '—'}{scale.year ? ` (${scale.year})` : ''}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="font-mono font-bold text-slate-700">{scale.total_items || '—'}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm text-slate-500">
                                        {scale.likert_points ? `${scale.likert_points}-point` : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => togglePublish(scale.id, scale.is_published)}
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${scale.is_published
                                                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                }`}
                                        >
                                            {scale.is_published ? '✓ Published' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => loadScaleItems(scale.id)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Xem items"
                                            >
                                                {loadingItems === scale.id
                                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                                    : expandedScale === scale.id
                                                        ? <ChevronUp className="w-4 h-4" />
                                                        : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => deleteScale(scale.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xoá thang đo"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Expanded Scale Items */}
                                {expandedScale === scale.id && scaleItems[scale.id] && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-3 bg-slate-50/50">
                                            <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-slate-50 sticky top-0">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 w-12">#</th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Nội dung (VI)</th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 w-28">Dimension</th>
                                                            <th className="px-3 py-2 text-center text-xs font-medium text-slate-500 w-20">Reverse</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {scaleItems[scale.id].map(item => (
                                                            <tr key={item.id} className="hover:bg-slate-50">
                                                                <td className="px-3 py-2 font-mono text-slate-400">{item.item_number}</td>
                                                                <td className="px-3 py-2 text-slate-700">{item.content_vi || item.content_en || '—'}</td>
                                                                <td className="px-3 py-2">
                                                                    {item.dimension && (
                                                                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">
                                                                            {item.dimension}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-3 py-2 text-center">
                                                                    {item.is_reverse && <span className="text-red-500 font-bold text-xs">R</span>}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {scaleItems[scale.id].length === 0 && (
                                                            <tr>
                                                                <td colSpan={4} className="px-3 py-6 text-center text-slate-400">
                                                                    Chưa có items nào
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Scale className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Không tìm thấy thang đo nào</p>
                    </div>
                )}
            </div>
        </div>
    )
}
