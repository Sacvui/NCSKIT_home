'use client';

import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, BookOpen, Search, Plus, Edit3, Trash2, 
    ChevronRight, ShieldCheck, Lock, Unlock, Clock, BarChart3, RefreshCw, AlertCircle
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import Link from 'next/link';
import { getSupabase } from '@/utils/supabase/client';

const supabase = getSupabase();

// --- MASTER REPOSITORY (FALLBACK) ---
const FALLBACK_LIST = [
    { slug: 'cronbach-alpha', category: 'Preliminary Analysis', title_vi: 'Kiểm định Cronbach\'s Alpha: Bản giao hưởng của Tin cậy nội tại', author: 'ncsStat Editorial', updated_at: new Date().toISOString() },
    { slug: 'efa-factor-analysis', category: 'Factor Analysis', title_vi: 'Phân tích nhân tố khám phá (EFA): Khám phá cấu trúc ẩn', author: 'ncsStat Editorial', updated_at: new Date().toISOString() },
    { slug: 'regression-vif-multicollinearity', category: 'Impact Analysis', title_vi: 'Hồi quy đa biến và Đa cộng tuyến (VIF)', author: 'ncsStat Editorial', updated_at: new Date().toISOString() },
    { slug: 'descriptive-statistics-interpretation', category: 'Preliminary Analysis', title_vi: 'Thống kê mô tả: Nghệ thuật kể chuyện qua con số', author: 'ncsStat Editorial', updated_at: new Date().toISOString() },
    { slug: 'independent-t-test-guide', category: 'Comparison Analysis', title_vi: 'Independent T-test: So sánh các nhóm đối đầu', author: 'ncsStat Editorial', updated_at: new Date().toISOString() },
    { slug: 'one-way-anova-post-hoc', category: 'Comparison Analysis', title_vi: 'Phân tích ANOVA: So sánh Đa nhóm chuyên sâu', author: 'ncsStat Editorial', updated_at: new Date().toISOString() },
    { slug: 'pearson-correlation-analysis', category: 'Relationship Analysis', title_vi: 'Tương quan Pearson: Bản đồ các mối liên kết', author: 'ncsStat Editorial', updated_at: new Date().toISOString() },
    { slug: 'chi-square-test-independence', category: 'Categorical Analysis', title_vi: 'Kiểm định Chi-square: Liên kết dữ liệu định danh', author: 'ncsStat Editorial', updated_at: new Date().toISOString() },
    { slug: 'mediation-analysis-sobel-test', category: 'Advanced Analysis', title_vi: 'Biến trung gian (Mediation): Giải mã cơ chế tác động', author: 'ncsStat Editorial', updated_at: new Date().toISOString() },
    { slug: 'data-cleaning-outliers-detection', category: 'Preliminary Analysis', title_vi: 'Làm sạch dữ liệu & Outliers: Vệ sinh Khoa học', author: 'ncsStat Editorial', updated_at: new Date().toISOString() },
    { slug: 'sem-cfa-structural-modeling', category: 'Advanced Analysis', title_vi: 'Mô hình SEM và CFA: Đỉnh cao học thuật toàn cầu', author: 'ncsStat Editorial', updated_at: new Date().toISOString() }
];

export default function KnowledgeAdmin() {
    const [locale, setLocale] = useState<Locale>('vi');
    const isVi = locale === 'vi';
    const [articles, setArticles] = useState<any[]>(FALLBACK_LIST); // Initialize with fallback to avoid 0 count
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDatabaseEmpty, setIsDatabaseEmpty] = useState(false);
    
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
        try {
            const { data, error } = await supabase.from('knowledge_articles').select('slug, category, title_vi, title_en, author, updated_at').order('updated_at', { ascending: false });
            
            if (data && data.length > 0) {
                setArticles(data);
                setIsDatabaseEmpty(false);
            } else {
                // Keep using FALLBACK_LIST but flag as empty
                setArticles(FALLBACK_LIST);
                setIsDatabaseEmpty(true);
            }
        } catch (err) {
            console.error('Fetch failed, using Static Fallback');
            setArticles(FALLBACK_LIST);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === SECRET_CODE) {
            setIsAuthorized(true);
            setShowLogin(false);
        } else {
            alert('Mã số bí mật không đúng');
        }
    };

    const filteredArticles = articles.filter(a => 
        (a.title_vi?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (a.slug?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    if (showLogin) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
                <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl border border-slate-50">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-xl">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 text-center mb-2 tracking-tight">ncsStat Knowledge Hub</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] text-center mb-10 italic">Passcode is 300489</p>
                    
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
                            Mở khóa Hệ thống CMS
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Header />
            
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    {/* Admin Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.3em]">Knowledge Management Portal</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">Mục lục Tri thức ncsStat</h1>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-200 group">
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Thêm bài viết mới
                            </button>
                        </div>
                    </div>

                    {/* Sync Alert (Only if DB empty) */}
                    {isDatabaseEmpty && !loading && (
                        <div className="bg-indigo-600 text-white p-6 rounded-3xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-200">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl">
                                    <AlertCircle className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="font-black text-lg tracking-tight">Database hiện chưa bộ nạp Tri thức</p>
                                    <p className="text-indigo-100 text-sm font-medium">Hệ thống đang hiển thị bản Dự phòng (Fallback). Bạn cần Sync vào DB để bật tính năng Edit.</p>
                                </div>
                            </div>
                            <button className="px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-lg flex items-center gap-3">
                                <RefreshCw className="w-4 h-4" /> Sync 11 bài Authority
                            </button>
                        </div>
                    )}

                    {/* Stats & Search */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <BookOpen className="w-24 h-24" />
                            </div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 font-sans">Tổng quy mô tri thức</p>
                            <p className="text-5xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-sans">{articles.length}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Master Articles</p>
                        </div>
                        <div className="md:col-span-2 bg-white p-5 rounded-[3rem] border border-slate-100 shadow-xl flex items-center gap-4 px-10">
                            <Search className="w-8 h-8 text-slate-300" />
                            <input 
                                type="text"
                                placeholder="Gõ tiêu đề bài nghiên cứu để tìm kiếm..."
                                className="flex-1 bg-transparent border-none outline-none font-black text-xl text-slate-900 placeholder:text-slate-200 tracking-tight"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Article Table */}
                    <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/2">Nội dung học thuật</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Phân loại</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Lệnh</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-10 py-24 text-center">
                                                <div className="flex flex-col items-center gap-4 animate-pulse">
                                                    <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-none">Vui lòng chờ, hệ thống đang đồng bộ với Academy...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredArticles.map((article) => (
                                            <tr key={article.slug} className="hover:bg-slate-50 transition-all group">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                            <BookOpen className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-lg md:text-xl tracking-tighter mb-1.5 leading-tight group-hover:text-indigo-600 transition-colors">{isVi ? article.title_vi : article.title_en}</p>
                                                            <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 font-mono uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded w-fit">
                                                                ID: {article.slug}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="px-5 py-2 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-xl italic">
                                                        {article.category}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                        <Clock className="w-4 h-4 text-indigo-400" />
                                                        {new Date(article.updated_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                                                        <Link 
                                                            href={`/knowledge/${article.slug}`}
                                                            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                                                        >
                                                            <Edit3 className="w-4 h-4" /> Edit
                                                        </Link>
                                                        <button 
                                                            className="p-3 bg-white border border-slate-200 text-slate-300 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-xl transition-all shadow-sm"
                                                            title="Xóa khỏi Database"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
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
                    
                    {/* Professional Export Section */}
                    <div className="mt-12 flex items-center justify-between px-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ncsStat Knowledge Index v2.6.2026</p>
                        <div className="flex gap-4">
                            <span className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-200"></span>
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">System Operational</span>
                        </div>
                    </div>
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
