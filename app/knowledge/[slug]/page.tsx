'use client';

import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Clock, Share2, Bookmark, User, 
    ShieldCheck, CheckCircle2, TrendingUp, Edit3, Save, X, Lock, Unlock
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import Link from 'next/link';
import { getSupabase } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';

const supabase = getSupabase();

interface ArticleSection {
    h2_vi: string;
    h2_en: string;
    content_vi: string;
    content_en: string;
}

interface ArticleData {
    id: string;
    slug: string;
    category: string;
    title_vi: string;
    title_en: string;
    expert_tip_vi: string;
    expert_tip_en: string;
    content_structure: ArticleSection[];
    author: string;
    updated_at: string;
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
    const [locale, setLocale] = useState<Locale>('vi');
    const isVi = locale === 'vi';
    const [article, setArticle] = useState<ArticleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPasscodePrompt, setShowPasscodePrompt] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedArticle, setEditedArticle] = useState<ArticleData | null>(null);

    const SECRET_CODE = '300489';

    useEffect(() => {
        setLocale(getStoredLocale());
        fetchArticle();
        
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, [params.slug]);

    const fetchArticle = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('knowledge_articles')
            .select('*')
            .eq('slug', params.slug)
            .single();

        if (data) {
            setArticle(data);
            setEditedArticle(data);
        }
        setLoading(false);
    };

    const handleAuthorize = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === SECRET_CODE) {
            setIsAuthorized(true);
            setShowPasscodePrompt(false);
            toast.success('Đã mở khóa quyền truy cập CMS!');
        } else {
            toast.error('Mã số bí mật không chính xác');
        }
    };

    const handleSave = async () => {
        if (!editedArticle) return;
        
        // Use the service client bypass if possible, but keep standard upsert for RLS
        const { error } = await supabase
            .from('knowledge_articles')
            .update(editedArticle)
            .eq('id', editedArticle.id);

        if (error) {
            toast.error('Lỗi khi lưu: Bạn cần quyền Admin hệ thống.');
            console.error(error);
        } else {
            setArticle(editedArticle);
            setIsEditing(false);
            toast.success('Đã lưu bài viết thành công!');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <Clock className="w-6 h-6 text-indigo-600 animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tải dữ liệu...</p>
            </div>
        </div>
    );

    if (!article) return <div className="p-20 text-center">Không tìm thấy bài viết</div>;

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Header />
            
            <main className="pt-32 pb-24">
                {/* Secret Access Trigger & Passcode Prompt */}
                {!isAuthorized && (
                    <div className="container mx-auto px-6 max-w-4xl mb-4 flex justify-end">
                        <button 
                            onClick={() => setShowPasscodePrompt(true)}
                            className="bg-transparent text-slate-100 hover:text-slate-300 p-2 transition-colors"
                            title="Admin Access"
                        >
                            <Lock className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {showPasscodePrompt && (
                    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                        <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                            <div className="w-16 h-16 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-sm">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2 text-center tracking-tight">Khu vực Giới hạn</h2>
                            <p className="text-slate-400 text-center font-bold text-xs uppercase tracking-widest mb-8">Nhập mã số bí mật để Edit bài viết</p>
                            
                            <form onSubmit={handleAuthorize}>
                                <input 
                                    type="password"
                                    maxLength={6}
                                    placeholder="••••••"
                                    className="w-full text-center text-4xl font-black tracking-[1rem] py-6 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all mb-6"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setShowPasscodePrompt(false)}
                                        className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-200"
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Admin Toolbar (Only after correct passcode) */}
                {isAuthorized && (
                    <div className="container mx-auto px-6 max-w-4xl mb-12">
                        <div className="bg-slate-900 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl border border-white/10 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/50 animate-pulse">
                                    <Unlock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <span className="text-white font-black text-sm uppercase tracking-[0.2em] block mb-1">Editor Portal</span>
                                    <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">Đã mở khóa - Trạng thái: Sẵn sàng</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {!isEditing ? (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/20"
                                    >
                                        <Edit3 className="w-5 h-5" /> Edit bài viết
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="flex items-center gap-3 px-6 py-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-red-500/20"
                                        >
                                            <X className="w-5 h-5" /> Hủy
                                        </button>
                                        <button 
                                            onClick={handleSave}
                                            className="flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40"
                                        >
                                            <Save className="w-5 h-5" /> Lưu bài viết
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Article Header & Body (rest of your beautiful UI) */}
                <header className="container mx-auto px-6 max-w-4xl mb-12">
                    <Link href="/knowledge" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-10 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {isVi ? 'Quay lại thư viện' : 'Back to library'}
                    </Link>
                    
                    <div className="flex items-center gap-3 mb-8">
                        <span className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            {article.category}
                        </span>
                    </div>

                    {isEditing ? (
                        <input 
                            className="w-full text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter bg-slate-50 border-none p-6 rounded-[2.5rem] focus:ring-4 focus:ring-indigo-100"
                            value={isVi ? editedArticle?.title_vi : editedArticle?.title_en}
                            onChange={(e) => setEditedArticle(prev => prev ? {...prev, [isVi ? 'title_vi' : 'title_en']: e.target.value} : null)}
                        />
                    ) : (
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                            {isVi ? article.title_vi : article.title_en}
                        </h1>
                    )}

                    <div className="flex items-center justify-between py-10 border-y border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                                <User className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 text-base uppercase tracking-tight leading-none mb-1.5 font-sans">{article.author}</p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                    {article.updated_at ? new Date(article.updated_at).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <article className="container mx-auto px-6 max-w-4xl">
                    <div className="prose prose-lg prose-slate max-w-none">
                        {(isEditing ? editedArticle : article)?.content_structure.map((section, idx) => (
                            <div key={idx} className="mb-20 last:mb-0">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input 
                                            className="w-full text-2xl font-black text-slate-900 bg-slate-50 border-none p-6 rounded-2xl focus:ring-4 focus:ring-indigo-100"
                                            value={isVi ? section.h2_vi : section.h2_en}
                                            onChange={(e) => {
                                                const newStructure = [...(editedArticle?.content_structure || [])];
                                                newStructure[idx] = {...newStructure[idx], [isVi ? 'h2_vi' : 'h2_en']: e.target.value};
                                                setEditedArticle(prev => prev ? {...prev, content_structure: newStructure} : null);
                                            }}
                                        />
                                        <textarea 
                                            className="w-full text-slate-800 leading-[1.8] text-lg font-normal min-h-[400px] bg-slate-50 border-none p-10 rounded-[3rem] focus:ring-4 focus:ring-indigo-100"
                                            value={isVi ? section.content_vi : section.content_en}
                                            onChange={(e) => {
                                                const newStructure = [...(editedArticle?.content_structure || [])];
                                                newStructure[idx] = {...newStructure[idx], [isVi ? 'content_vi' : 'content_en']: e.target.value};
                                                setEditedArticle(prev => prev ? {...prev, content_structure: newStructure} : null);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-10 border-l-8 border-indigo-600 pl-8 py-2">
                                            {isVi ? section.h2_vi : section.h2_en}
                                        </h2>
                                        <div className="text-slate-800 leading-[1.8] text-lg lg:text-xl font-normal whitespace-pre-line bg-slate-50/50 p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                                            {isVi ? section.content_vi : section.content_en}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Expert Strategy Box */}
                    <div className="bg-slate-900 p-16 rounded-[4rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden my-32 border border-white/10">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <ShieldCheck className="w-64 h-64 rotate-12 text-indigo-400" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-2xl font-black mb-10 flex items-center gap-5 text-indigo-400 uppercase tracking-[0.3em]">
                                <ShieldCheck className="w-10 h-10" />
                                {isVi ? 'Tư vấn Chuyên gia ncsStat' : 'ncsStat Expert Strategy'}
                            </h4>
                            
                            {isEditing ? (
                                <textarea 
                                    className="w-full bg-white/10 text-white text-xl font-light leading-relaxed mb-12 p-8 rounded-3xl border-none focus:ring-4 focus:ring-indigo-500"
                                    value={isVi ? editedArticle?.expert_tip_vi : editedArticle?.expert_tip_en}
                                    onChange={(e) => setEditedArticle(prev => prev ? {...prev, [isVi ? 'expert_tip_vi' : 'expert_tip_en']: e.target.value} : null)}
                                />
                            ) : (
                                <p className="text-slate-300 text-xl md:text-2xl font-light leading-relaxed mb-12 italic border-l-4 border-indigo-500/30 pl-8">
                                    "{isVi ? article.expert_tip_vi : article.expert_tip_en}"
                                </p>
                            )}

                            <Link href="/analyze" className="inline-flex items-center gap-4 px-12 py-6 bg-indigo-600 text-white rounded-[1.8rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-900/50 group">
                                {isVi ? 'Thực hành phân tích ngay' : 'Analyze Now'}
                                <TrendingUp className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
