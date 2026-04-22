'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/utils/supabase/client'
import { Scale, Search, Eye, Trash2, Loader2, ChevronDown, ChevronUp, BookOpen, Hash, Layers, Plus, Edit, Quote, Tag } from 'lucide-react'

interface ScaleRecord {
    id: string
    name_vi: string
    name_en: string | null
    category: string[] | null
    author: string | null
    year: number | null
    description_vi: string | null
    description_en: string | null
    citation: string | null
    research_model: string | null
    tags: string[] | null
    created_at: string
}

interface ScaleItem {
    id: string
    scale_id: string
    code: string | null
    text_vi: string | null
    text_en: string | null
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

    // Editor Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingScale, setEditingScale] = useState<Partial<ScaleRecord> | null>(null)
    const [editingItems, setEditingItems] = useState<Partial<ScaleItem>[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        loadScales()
    }, [])

    const loadScales = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('scales')
                .select('*')
                .order('created_at', { ascending: false })

            if (!error && data) {
                setScales(data)
            }
        } catch (err) {
            console.error('Fetch scales error:', err)
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
            .order('code')

        if (!error && data) {
            setScaleItems(prev => ({ ...prev, [scaleId]: data }))
        }
        setLoadingItems(null)
        setExpandedScale(expandedScale === scaleId ? null : scaleId)
    }

    const openEditor = async (scale: ScaleRecord | null = null) => {
        if (scale) {
            setEditingScale(scale)
            // Load items for editing
            const { data } = await supabase.from('scale_items').select('*').eq('scale_id', scale.id).order('code')
            setEditingItems(data || [])
        } else {
            setEditingScale({
                name_vi: '',
                name_en: '',
                category: ['General'],
                author: '',
                year: new Date().getFullYear(),
                description_vi: '',
                description_en: '',
                citation: '',
                research_model: '',
                tags: []
            })
            setEditingItems([])
        }
        setIsModalOpen(true)
    }

    const handleSaveScale = async () => {
        if (!editingScale?.name_vi) {
            alert('Vui lòng nhập tên thang đo (VI)')
            return
        }

        setIsSubmitting(true)
        // 1. Save Scale Metadata
        const { data: scaleData, error: scaleError } = await supabase
            .from('scales')
            .upsert({
                ...editingScale,
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

        if (scaleError) {
            alert('Lỗi khi lưu thang đo: ' + scaleError.message)
            setIsSubmitting(false)
            return
        }

        // 2. Save Items
        await supabase.from('scale_items').delete().eq('scale_id', scaleData.id)
        
        if (editingItems.length > 0) {
            const itemsToInsert = editingItems.map((item) => ({
                code: item.code,
                text_vi: item.text_vi,
                text_en: item.text_en,
                scale_id: scaleData.id
            }))
            await supabase.from('scale_items').insert(itemsToInsert)
        }

        await loadScales()
        setIsModalOpen(false)
        setIsSubmitting(false)
    }

    const addItem = () => {
        setEditingItems(prev => [...prev, {
            code: '',
            text_vi: '',
            text_en: ''
        }])
    }

    const deleteScale = async (id: string) => {
        if (!confirm('Bạn chắc chắn muốn xoá thang đo này và tất cả items liên quan?')) return

        await supabase.from('scale_items').delete().eq('scale_id', id)
        const { error } = await supabase.from('scales').delete().eq('id', id)

        if (!error) {
            setScales(prev => prev.filter(s => s.id !== id))
        }
    }

    // Process categories for filter
    const allCategories = [...new Set(scales.flatMap(s => s.category || []).filter(Boolean))]

    const filtered = scales.filter(s => {
        const matchSearch = (s.name_vi || '').toLowerCase().includes(search.toLowerCase()) ||
            (s.author || '').toLowerCase().includes(search.toLowerCase())
        const matchCat = filterCategory === 'all' || (s.category || []).includes(filterCategory)
        return matchSearch && matchCat
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Scale className="w-6 h-6 text-purple-600" />
                        Thư viện Thang đo chuẩn
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {scales.length} thang đo nghiên cứu đã được số hóa
                    </p>
                </div>
                <button
                    onClick={() => openEditor()}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                >
                    <Plus className="w-4 h-4" /> Thêm thang đo
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc tác giả..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                >
                    <option value="all">Tất cả danh mục</option>
                    {allCategories.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Thang đo</th>
                            <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Tác giả / Năm</th>
                            <th className="text-center px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filtered.map(scale => (
                            <>
                                <tr key={scale.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-bold text-slate-800">{scale.name_vi}</div>
                                            <div className="flex gap-1 mt-1">
                                                {scale.category?.map(cat => (
                                                    <span key={cat} className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter bg-purple-50 text-purple-500 border border-purple-100">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                        {scale.author || '—'} {scale.year ? `(${scale.year})` : ''}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => loadScaleItems(scale.id)}
                                                className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                                                title="Xem items"
                                            >
                                                {loadingItems === scale.id
                                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                                    : expandedScale === scale.id
                                                        ? <ChevronUp className="w-4 h-4" />
                                                        : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => openEditor(scale)}
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                title="Sửa"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteScale(scale.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Xoá"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {expandedScale === scale.id && scaleItems[scale.id] && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 bg-slate-50/50">
                                            <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-inner">
                                                <table className="w-full text-xs">
                                                    <thead className="bg-slate-50 sticky top-0">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left font-black text-slate-400 uppercase tracking-widest w-16">Mã</th>
                                                            <th className="px-4 py-2 text-left font-black text-slate-400 uppercase tracking-widest">Nội dung</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {scaleItems[scale.id].map(item => (
                                                            <tr key={item.id}>
                                                                <td className="px-4 py-2 font-black text-purple-600">{item.code}</td>
                                                                <td className="px-4 py-2 text-slate-600 font-medium">{item.text_vi}</td>
                                                            </tr>
                                                        ))}
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
            </div>

            {/* Scale Editor Modal */}
            {isModalOpen && editingScale && (
                <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col border border-slate-100">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-slate-800 uppercase tracking-tighter text-2xl">Scale Research Editor</h3>
                                <p className="text-xs text-slate-400 font-bold italic uppercase tracking-widest mt-1">Hệ thống Thang đo đa tầng ncsStat</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all text-slate-400 text-2xl">&times;</button>
                        </div>

                        <div className="p-10 overflow-y-auto space-y-12 no-scrollbar">
                            {/* Metadata Section */}
                            <div className="grid md:grid-cols-3 gap-10">
                                <div className="md:col-span-2 space-y-8">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tên thang đo (VI)</label>
                                            <input
                                                type="text"
                                                value={editingScale.name_vi || ''}
                                                onChange={(e) => setEditingScale(prev => ({ ...prev, name_vi: e.target.value }))}
                                                className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none font-black text-lg text-slate-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">English Name</label>
                                            <input
                                                type="text"
                                                value={editingScale.name_en || ''}
                                                onChange={(e) => setEditingScale(prev => ({ ...prev, name_en: e.target.value }))}
                                                className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none font-bold text-slate-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tác giả</label>
                                            <input
                                                type="text"
                                                value={editingScale.author || ''}
                                                onChange={(e) => setEditingScale(prev => ({ ...prev, author: e.target.value }))}
                                                className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none font-bold text-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Năm xuất bản</label>
                                            <input
                                                type="number"
                                                value={editingScale.year || ''}
                                                onChange={(e) => setEditingScale(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                                                className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none font-bold text-slate-700 text-center"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mô tả tổng quan (Tiếng Việt)</label>
                                        <textarea
                                            value={editingScale.description_vi || ''}
                                            onChange={(e) => setEditingScale(prev => ({ ...prev, description_vi: e.target.value }))}
                                            rows={4}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium text-slate-700 text-sm focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Quote className="w-3 h-3" /> APA Citation</label>
                                        <textarea
                                            value={editingScale.citation || ''}
                                            onChange={(e) => setEditingScale(prev => ({ ...prev, citation: e.target.value }))}
                                            rows={3}
                                            className="w-full px-5 py-4 border border-slate-200 rounded-2xl outline-none text-xs font-medium italic text-slate-500"
                                            placeholder="Parasuraman, A. (1988)..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Layers className="w-3 h-3" /> Categories (Comma separated)</label>
                                        <input
                                            type="text"
                                            value={(editingScale.category || []).join(', ')}
                                            onChange={(e) => setEditingScale(prev => ({ ...prev, category: e.target.value.split(',').map(s => s.trim()) }))}
                                            className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none font-bold text-purple-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Tag className="w-3 h-3" /> Tags (Comma separated)</label>
                                        <input
                                            type="text"
                                            value={(editingScale.tags || []).join(', ')}
                                            onChange={(e) => setEditingScale(prev => ({ ...prev, tags: e.target.value.split(',').map(s => s.trim()) }))}
                                            className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 outline-none font-bold text-slate-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Items Section */}
                            <div className="space-y-8 pt-10 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                                            <Hash className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-lg font-black text-slate-800 uppercase tracking-widest">Hệ thống Biến quan sát (Items)</h4>
                                    </div>
                                    <button
                                        onClick={addItem}
                                        className="px-6 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-purple-200 flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Thêm Item mới
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {editingItems.map((item, idx) => (
                                        <div key={idx} className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2rem] space-y-4 group hover:border-purple-200 transition-all duration-500 relative">
                                            <div className="flex gap-4 items-start">
                                                <input
                                                    placeholder="CODE"
                                                    value={item.code || ''}
                                                    onChange={(e) => {
                                                        const newItems = [...editingItems];
                                                        newItems[idx].code = e.target.value;
                                                        setEditingItems(newItems);
                                                    }}
                                                    className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-black text-center text-purple-600 shadow-sm"
                                                />
                                                <div className="flex-1 space-y-3">
                                                    <textarea
                                                        placeholder="Nội dung Tiếng Việt..."
                                                        value={item.text_vi || ''}
                                                        onChange={(e) => {
                                                            const newItems = [...editingItems];
                                                            newItems[idx].text_vi = e.target.value;
                                                            setEditingItems(newItems);
                                                        }}
                                                        rows={2}
                                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-700 shadow-sm"
                                                    />
                                                    <textarea
                                                        placeholder="English Text..."
                                                        value={item.text_en || ''}
                                                        onChange={(e) => {
                                                            const newItems = [...editingItems];
                                                            newItems[idx].text_en = e.target.value;
                                                            setEditingItems(newItems);
                                                        }}
                                                        rows={2}
                                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-xs font-medium italic text-slate-400 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    const newItems = [...editingItems];
                                                    newItems.splice(idx, 1);
                                                    setEditingItems(newItems);
                                                }}
                                                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-slate-100 text-rose-500 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-8 py-3.5 text-xs font-black text-slate-500 uppercase tracking-widest"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSaveScale}
                                disabled={isSubmitting}
                                className="px-12 py-4 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-purple-100 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Đang đồng bộ...' : 'Cập nhật Thang đo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
