'use client';

import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, BookOpen, Search, Plus, Edit3, Trash2, 
    ChevronRight, ShieldCheck, Lock, Unlock, Clock, BarChart3
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import Link from 'next/link';
import { getSupabase } from '@/utils/supabase/client';

const supabase = getSupabase();

export default function KnowledgeAdmin() {
    const [locale, setLocale] = useState<Locale>('vi');
    const isVi = locale === 'vi';
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Auth State
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [showLogin, setShowLogin] = useState(true);
    const SECRET_CODE = '300489';

    useEffect(() => {
        setLocale(getStoredLocale());
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        const { data } = await supabase.from('knowledge_articles').select('*').order('updated_at', { ascending: false });
        if (data) setArticles(data);
        setLoading(false);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === SECRET_CODE) {
            setIsAuthorized(true);
            setShowLogin(false);
        } else {
            alert('Mã số bí mật ncsStat không đúng');
        }
    };

    const filteredArticles = articles.filter(a => 
        a.title_vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.title_en.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (showLogin) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
                <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl border border-slate-100">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-xl">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 text-center mb-2 tracking-tight">ncsStat Knowledge CMS</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] text-center mb-10">Mã số bí mật để Quản lý Danh mục</p>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <input 
                            type="password"
                            placeholder="••••••"
                            className="w-full text-center text-4xl font-black py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl outline-none transition-all tracking-[0.5em]"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            autoFocus
                        />
                        <button 
                            type="submit"
                            className="w-full py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-100"
                        >
                            Đăng nhập Hệ thống
                        </button>
                    </form>
                    <Link href="/" className="block text-center mt-8 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                        Quay về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Header />
            
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    {/* Admin Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                                    <LayoutDashboard className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Administrator Portal</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Quản lý bài viết Tri thức</h1>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">
                                <Plus className="w-5 h-5" /> Thêm bài viết mới
                            </button>
                        </div>
                    </div>

                    {/* Stats & Search */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-2">Tổng số bài viết</p>
                            <p className="text-4xl font-black text-slate-900">{articles.length}</p>
                        </div>
                        <div className="md:col-span-2 bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4 px-8">
                            <Search className="w-6 h-6 text-slate-300" />
                            <input 
                                type="text"
                                placeholder="Tìm kiếm tiêu đề hoặc slug bài viết..."
                                className="flex-1 bg-transparent border-none outline-none font-bold text-lg text-slate-900 placeholder:text-slate-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Article Table */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Tiêu đề nghiên cứu</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Danh mục</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Cập nhật cuối</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-xs animate-pulse">Đang nạp danh mục tri thức...</td>
                                        </tr>
                                    ) : (
                                        filteredArticles.map((article) => (
                                            <tr key={article.slug} className="hover:bg-indigo-50/30 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <p className="font-black text-slate-900 text-lg tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">{isVi ? article.title_vi : article.title_en}</p>
                                                        <p className="text-xs font-bold text-slate-400 font-mono tracking-tight">{article.slug}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-full">{article.category}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                                        <Clock className="w-4 h-4" />
                                                        {new Date(article.updated_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link 
                                                            href={`/knowledge/${article.slug}`}
                                                            className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all"
                                                            title="Xem trước/Edit"
                                                        >
                                                            <Edit3 className="w-5 h-5" />
                                                        </Link>
                                                        <button 
                                                            className="p-3 bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                                            title="Xóa bài viết"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
