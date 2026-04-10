'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/utils/supabase/client'
import { BookOpen, Search, Eye, Edit, Trash2, Plus, ExternalLink, Loader2, CheckCircle, XCircle } from 'lucide-react'

interface KnowledgeArticle {
    id: string
    slug: string
    title_vi: string | null
    title_en: string | null
    category: string | null
    description_vi: string | null
    is_published: boolean
    view_count: number | null
    created_at: string
    updated_at: string | null
}

export default function AdminKnowledgePage() {
    const supabase = getSupabase()
    const [articles, setArticles] = useState<KnowledgeArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')

    useEffect(() => {
        loadArticles()
    }, [])

    const loadArticles = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('knowledge_articles')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setArticles(data)
        }
        setLoading(false)
    }

    const togglePublish = async (id: string, current: boolean) => {
        const { error } = await supabase
            .from('knowledge_articles')
            .update({ is_published: !current })
            .eq('id', id)

        if (!error) {
            setArticles(prev => prev.map(a => a.id === id ? { ...a, is_published: !current } : a))
        }
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
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        Quản lý Kiến thức
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {articles.length} bài viết · {articles.filter(a => a.is_published).length} đang xuất bản
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border p-4">
                    <div className="text-2xl font-bold text-slate-800">{articles.length}</div>
                    <div className="text-sm text-slate-500">Tổng bài viết</div>
                </div>
                <div className="bg-white rounded-xl border p-4">
                    <div className="text-2xl font-bold text-green-600">{articles.filter(a => a.is_published).length}</div>
                    <div className="text-sm text-slate-500">Đang xuất bản</div>
                </div>
                <div className="bg-white rounded-xl border p-4">
                    <div className="text-2xl font-bold text-amber-600">{articles.filter(a => !a.is_published).length}</div>
                    <div className="text-sm text-slate-500">Bản nháp</div>
                </div>
                <div className="bg-white rounded-xl border p-4">
                    <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
                    <div className="text-sm text-slate-500">Danh mục</div>
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
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Bài viết</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Danh mục</th>
                            <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600">Trạng thái</th>
                            <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600">Lượt xem</th>
                            <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(article => (
                            <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3">
                                    <div>
                                        <div className="font-medium text-slate-800">{article.title_vi || article.slug}</div>
                                        <div className="text-xs text-slate-400 font-mono mt-0.5">/{article.slug}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                        {article.category || 'Chưa phân loại'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => togglePublish(article.id, article.is_published)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${article.is_published
                                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                            }`}
                                    >
                                        {article.is_published ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        {article.is_published ? 'Published' : 'Draft'}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-slate-500">
                                    {article.view_count ?? 0}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <a
                                            href={`/knowledge/${article.slug}`}
                                            target="_blank"
                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Xem bài viết"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => deleteArticle(article.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                    <div className="text-center py-12 text-slate-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Không tìm thấy bài viết nào</p>
                    </div>
                )}
            </div>
        </div>
    )
}
