'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/utils/supabase/client'
import { BookOpen, Search, Eye, Edit, Trash2, Plus, ExternalLink, Loader2, Info, Code } from 'lucide-react'

interface KnowledgeArticle {
    id: string
    slug: string
    title_vi: string | null
    title_en: string | null
    category: string | null
    expert_tip_vi: string | null
    expert_tip_en: string | null
    content_structure: any[]
    icon_name: string | null
    created_at: string
    updated_at: string | null
}

export default function AdminKnowledgePage() {
    const supabase = getSupabase()
    const [articles, setArticles] = useState<KnowledgeArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')

    // Editor Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingArticle, setEditingArticle] = useState<Partial<KnowledgeArticle> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isHtmlEditorOpen, setIsHtmlEditorOpen] = useState(false)

    useEffect(() => {
        loadArticles()
    }, [])

    const loadArticles = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('knowledge_articles')
                .select('*')
                .order('created_at', { ascending: false })

            if (!error && data) {
                setArticles(data)
            }
        } catch (err) {
            console.error('Fetch error:', err)
        }
        setLoading(false)
    }

    const openEditor = (article: Partial<KnowledgeArticle> | null = null) => {
        if (article) {
            setEditingArticle(article)
        } else {
            setEditingArticle({
                slug: '',
                title_vi: '',
                title_en: '',
                category: 'General',
                icon_name: 'BookOpen',
                expert_tip_vi: '',
                expert_tip_en: '',
                content_structure: [
                    { h2_vi: '', h2_en: '', content_vi: '', content_en: '', is_html: false }
                ]
            })
        }
        setIsModalOpen(true)
    }

    const openHtmlEditor = (article: Partial<KnowledgeArticle> | null = null) => {
        if (article) {
            // Gộp tất cả các đoạn nội dung cũ thành 1 khối HTML duy nhất
            const combinedVi = article.content_structure?.map(s => s.content_vi).join('\n') || '';
            const combinedEn = article.content_structure?.map(s => s.content_en).join('\n') || '';
            setEditingArticle({
                ...article,
                content_structure: [{ h2_vi: '', h2_en: '', content_vi: combinedVi, content_en: combinedEn, is_html: true }]
            })
        } else {
            setEditingArticle({
                slug: '',
                title_vi: '',
                title_en: '',
                category: 'General',
                icon_name: 'Code',
                expert_tip_vi: '',
                expert_tip_en: '',
                content_structure: [
                    { h2_vi: '', h2_en: '', content_vi: '', content_en: '', is_html: true }
                ]
            })
        }
        setIsHtmlEditorOpen(true)
    }

    const handleSave = async () => {
        if (!editingArticle?.slug || !editingArticle?.title_vi) {
            alert('Vui lòng điền Slug và Tiêu đề (VI)')
            return
        }

        setIsSubmitting(true)
        const { error } = await supabase
            .from('knowledge_articles')
            .upsert({
                ...editingArticle,
                updated_at: new Date().toISOString()
            })

        if (!error) {
            await loadArticles()
            setIsModalOpen(false)
            setIsHtmlEditorOpen(false)
        } else {
            alert('Lỗi khi lưu bài viết: ' + error.message)
        }
        setIsSubmitting(false)
    }

    const updateContentPart = (index: number, field: string, value: string | boolean) => {
        const newStructure = [...(editingArticle?.content_structure || [])]
        newStructure[index] = { ...newStructure[index], [field]: value }
        setEditingArticle(prev => ({ ...prev, content_structure: newStructure }))
    }

    const addContentPart = () => {
        setEditingArticle(prev => ({
            ...prev,
            content_structure: [...(prev?.content_structure || []), { h2_vi: '', h2_en: '', content_vi: '', content_en: '', is_html: false }]
        }))
    }

    const deleteArticle = async (id: string) => {
        if (!confirm('Bạn chắc chắn muốn xoá bài viết này?')) return
        const { error } = await supabase
            .from('knowledge_articles')
            .delete()
            .eq('id', id)

        if (!error) {
            setArticles(prev => prev.filter(a => a.id !== id))
        }
    }

    const categories = [...new Set(articles.map(a => a.category).filter(Boolean))]

    const filtered = articles.filter(a => {
        const matchSearch = (a.title_vi || '').toLowerCase().includes(search.toLowerCase()) ||
            (a.slug || '').toLowerCase().includes(search.toLowerCase())
        const matchCat = filterCategory === 'all' || a.category === filterCategory
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        Quản lý Kiến thức (Academy)
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {articles.length} bài viết học thuật trong hệ thống
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => openHtmlEditor()}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        <Code className="w-4 h-4" /> Raw HTML
                    </button>
                    <button
                        onClick={() => openEditor()}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        <Plus className="w-4 h-4" /> Thêm bài viết
                    </button>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tiêu đề hoặc slug..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map(c => (
                        <option key={c} value={c!}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Bài viết</th>
                            <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Danh mục</th>
                            <th className="text-center px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Ngày tạo</th>
                            <th className="text-center px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filtered.map(article => (
                            <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-bold text-slate-800">{article.title_vi || article.slug}</div>
                                        <div className="text-[10px] text-blue-500 font-mono mt-1 uppercase tracking-tight">slug: {article.slug}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                                        {article.category || 'General'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center text-xs text-slate-400 font-medium">
                                    {new Date(article.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <a
                                            href={`/knowledge/${article.slug}`}
                                            target="_blank"
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            title="Xem bài viết"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => openEditor(article)}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                            title="Sửa bài viết"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openHtmlEditor(article)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                            title="Sửa bài viết bằng Raw HTML"
                                        >
                                            <Code className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteArticle(article.id)}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                            title="Xoá bài viết"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium italic">Không tìm thấy bài viết nào phù hợp</p>
                    </div>
                )}
            </div>

            {/* Editor Modal */}
            {isModalOpen && editingArticle && (
                <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-slate-800 uppercase tracking-tighter text-2xl">Academy Editor</h3>
                                <p className="text-xs text-slate-400 font-bold italic uppercase tracking-widest mt-1">Nghiên cứu & Học thuật ncsStat</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all text-slate-400 text-2xl">&times;</button>
                        </div>

                        <div className="p-10 overflow-y-auto space-y-10 no-scrollbar">
                            {/* Basic Info */}
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Slug (URL identifier)</label>
                                            <input
                                                type="text"
                                                value={editingArticle.slug || ''}
                                                onChange={(e) => setEditingArticle(prev => ({ ...prev, slug: e.target.value }))}
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-mono text-sm font-bold text-blue-600 transition-all"
                                                placeholder="pearson-correlation"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Icon Name (Lucide)</label>
                                            <input
                                                type="text"
                                                value={editingArticle.icon_name || ''}
                                                onChange={(e) => setEditingArticle(prev => ({ ...prev, icon_name: e.target.value }))}
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-600 transition-all"
                                                placeholder="BookOpen, LineChart..."
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tiêu đề Tiếng Việt</label>
                                        <input
                                            type="text"
                                            value={editingArticle.title_vi || ''}
                                            onChange={(e) => setEditingArticle(prev => ({ ...prev, title_vi: e.target.value }))}
                                            className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-black text-lg text-slate-800 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">English Title</label>
                                        <input
                                            type="text"
                                            value={editingArticle.title_en || ''}
                                            onChange={(e) => setEditingArticle(prev => ({ ...prev, title_en: e.target.value }))}
                                            className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-600 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                        <input
                                            type="text"
                                            value={editingArticle.category || ''}
                                            onChange={(e) => setEditingArticle(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-blue-600 transition-all"
                                        />
                                    </div>
                                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                                        <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Info className="w-3 h-3" /> Quick Guide
                                        </h5>
                                        <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                            Nội dung bài viết sẽ được tự động đồng bộ lên trang <b>ncsStat Academy</b> phía người dùng. Đảm bảo Slug là duy nhất để SEO không bị trùng lặp.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Expert Tips */}
                            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                                <div>
                                    <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Expert Tip (Tiếng Việt)</label>
                                    <textarea
                                        value={editingArticle.expert_tip_vi || ''}
                                        onChange={(e) => setEditingArticle(prev => ({ ...prev, expert_tip_vi: e.target.value }))}
                                        rows={3}
                                        className="w-full px-5 py-4 bg-amber-50/30 border border-amber-100 rounded-2xl outline-none font-medium text-slate-700 italic text-sm transition-all focus:ring-4 focus:ring-amber-500/5"
                                        placeholder="Lời khuyên từ chuyên gia..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Expert Tip (English)</label>
                                    <textarea
                                        value={editingArticle.expert_tip_en || ''}
                                        onChange={(e) => setEditingArticle(prev => ({ ...prev, expert_tip_en: e.target.value }))}
                                        rows={3}
                                        className="w-full px-5 py-4 bg-amber-50/30 border border-amber-100 rounded-2xl outline-none font-medium text-slate-700 italic text-sm transition-all focus:ring-4 focus:ring-amber-500/5"
                                        placeholder="Expert academic tip..."
                                    />
                                </div>
                            </div>

                            {/* Content Builder */}
                            <div className="space-y-8 pt-8 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                            <Eye className="w-4 h-4" />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Xây dựng cấu trúc bài viết</h4>
                                    </div>
                                    <button
                                        onClick={addContentPart}
                                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-slate-200"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Thêm phân đoạn
                                    </button>
                                </div>

                                <div className="space-y-10">
                                    {(editingArticle.content_structure || []).map((part, idx) => (
                                        <div key={idx} className="relative p-10 bg-white border-2 border-slate-50 rounded-[2.5rem] space-y-6 group hover:border-blue-100 transition-all duration-500">
                                            <div className="absolute -left-4 top-10 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-xl">
                                                {idx + 1}
                                            </div>
                                            <div className="absolute top-10 right-36 opacity-0 group-hover:opacity-100 transition-all z-10">
                                                <button
                                                    onClick={() => updateContentPart(idx, 'is_html', part.is_html ? false : true)}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${part.is_html ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                    title="Chuyển đổi giao diện nhập HTML"
                                                >
                                                    {part.is_html ? '</> HTML MODE' : '📝 NORMAL'}
                                                </button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tiêu đề Mục (VI)</label>
                                                    <input
                                                        value={part.h2_vi || ''}
                                                        onChange={(e) => updateContentPart(idx, 'h2_vi', e.target.value)}
                                                        className="w-full px-0 py-2 border-b-2 border-slate-100 bg-transparent outline-none focus:border-blue-600 font-black text-slate-800 transition-all"
                                                        placeholder="1. Giới thiệu chung"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Section Title (EN)</label>
                                                    <input
                                                        value={part.h2_en || ''}
                                                        onChange={(e) => updateContentPart(idx, 'h2_en', e.target.value)}
                                                        className="w-full px-0 py-2 border-b-2 border-slate-100 bg-transparent outline-none focus:border-blue-600 font-black text-slate-500 transition-all"
                                                        placeholder="1. Introduction"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nội dung chi tiết (VI)</label>
                                                    <textarea
                                                        value={part.content_vi || ''}
                                                        onChange={(e) => updateContentPart(idx, 'content_vi', e.target.value)}
                                                        rows={10}
                                                        className={`w-full p-6 border rounded-[2rem] outline-none text-sm leading-relaxed transition-all focus:ring-4 focus:ring-blue-500/10 ${part.is_html ? 'bg-slate-900 border-slate-800 text-emerald-400 font-mono focus:bg-slate-900' : 'bg-slate-50 border-slate-100 text-slate-700 focus:bg-white'}`}
                                                        placeholder={part.is_html ? "<div class=\"grid grid-cols-2 gap-4\">\n  <div>Cột 1</div>\n  <div>Cột 2</div>\n</div>" : "Nhập nội dung học thuật..."}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Detailed Content (EN)</label>
                                                    <textarea
                                                        value={part.content_en || ''}
                                                        onChange={(e) => updateContentPart(idx, 'content_en', e.target.value)}
                                                        rows={10}
                                                        className={`w-full p-6 border rounded-[2rem] outline-none text-sm leading-relaxed transition-all focus:ring-4 focus:ring-blue-500/10 ${part.is_html ? 'bg-slate-900 border-slate-800 text-emerald-400 font-mono focus:bg-slate-900' : 'bg-slate-50 border-slate-100 text-slate-700 focus:bg-white'}`}
                                                        placeholder={part.is_html ? "<div class=\"grid grid-cols-2 gap-4\">\n  <div>Column 1</div>\n  <div>Column 2</div>\n</div>" : "Scientific content in English..."}
                                                    />
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    const newStruct = [...(editingArticle.content_structure || [])];
                                                    newStruct.splice(idx, 1);
                                                    setEditingArticle(prev => ({ ...prev, content_structure: newStruct }));
                                                }}
                                                className="absolute top-10 right-10 text-[9px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                [ Xóa phân đoạn ]
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-8 py-3.5 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Đang lưu hệ thống...' : 'Cập nhật Academy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Raw HTML Editor Modal */}
            {isHtmlEditorOpen && editingArticle && (
                <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-950 rounded-[2rem] shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col border border-slate-800">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                            <div>
                                <h3 className="font-black text-emerald-400 uppercase tracking-tighter text-xl flex items-center gap-3">
                                    <Code className="w-6 h-6" /> Raw HTML Editor
                                </h3>
                                <p className="text-[10px] text-slate-500 font-mono mt-1">Chế độ tối ưu layout toàn trang dành cho chuyên gia.</p>
                            </div>
                            <button onClick={() => setIsHtmlEditorOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-800 flex items-center justify-center transition-all text-slate-400 text-2xl">&times;</button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-8 no-scrollbar">
                            {/* Basic Info */}
                            <div className="grid md:grid-cols-4 gap-6">
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Slug</label>
                                    <input
                                        type="text"
                                        value={editingArticle.slug || ''}
                                        onChange={(e) => setEditingArticle(prev => ({ ...prev, slug: e.target.value }))}
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl outline-none font-mono text-sm text-emerald-400 focus:border-emerald-500"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={editingArticle.category || ''}
                                        onChange={(e) => setEditingArticle(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl outline-none text-sm text-slate-200 focus:border-emerald-500"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tiêu đề (VI)</label>
                                    <input
                                        type="text"
                                        value={editingArticle.title_vi || ''}
                                        onChange={(e) => setEditingArticle(prev => ({ ...prev, title_vi: e.target.value }))}
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl outline-none font-bold text-slate-200 focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Massive Code Editors */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Mã HTML (Tiếng Việt)</label>
                                    </div>
                                    <textarea
                                        value={editingArticle.content_structure?.[0]?.content_vi || ''}
                                        onChange={(e) => updateContentPart(0, 'content_vi', e.target.value)}
                                        rows={20}
                                        className="w-full p-6 bg-[#0d1117] border border-slate-800 rounded-2xl outline-none text-sm leading-relaxed text-emerald-400 font-mono focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"
                                        placeholder="<div class='container'>...</div>"
                                        spellCheck="false"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Mã HTML (English)</label>
                                    </div>
                                    <textarea
                                        value={editingArticle.content_structure?.[0]?.content_en || ''}
                                        onChange={(e) => updateContentPart(0, 'content_en', e.target.value)}
                                        rows={20}
                                        className="w-full p-6 bg-[#0d1117] border border-slate-800 rounded-2xl outline-none text-sm leading-relaxed text-emerald-400 font-mono focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"
                                        placeholder="<div class='container'>...</div>"
                                        spellCheck="false"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-900 border-t border-slate-800 flex items-center justify-end gap-4">
                            <button
                                onClick={() => setIsHtmlEditorOpen(false)}
                                className="px-8 py-3 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900 disabled:opacity-50 flex items-center gap-2"
                            >
                                <Code className="w-4 h-4" /> {isSubmitting ? 'Đang lưu...' : 'Lưu HTML'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
