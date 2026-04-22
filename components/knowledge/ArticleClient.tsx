'use client';

import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Clock, User, ShieldCheck, TrendingUp, Edit3, Save, X, Lock, Unlock
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import Link from 'next/link';
import { getSupabase } from '@/utils/supabase/client';
import { evaluateContent } from '@/lib/seo-evaluator';
import ContentSEOEvaluationCard from '@/components/knowledge/ContentSEOEvaluationCard';


const supabase = getSupabase();

interface ArticleSection {
    h2_vi: string; h2_en: string; content_vi: string; content_en: string;
}

interface ArticleData {
    id?: string; slug: string; category: string; title_vi: string; title_en: string;
    expert_tip_vi: string; expert_tip_en: string; thresholds?: string; 
    content_structure: ArticleSection[];
    author: string; updated_at: string;
}

interface ArticleClientProps {
    initialArticle: ArticleData;
    fallbackArticles: Record<string, ArticleData>;
    slug: string;
}

export default function ArticleClient({ initialArticle, fallbackArticles, slug }: ArticleClientProps) {
    const [locale, setLocale] = useState<Locale>('vi');
    const isVi = locale === 'vi';
    const [article, setArticle] = useState<ArticleData>(initialArticle);
    const [loading, setLoading] = useState(false);
    const [showPasscodePrompt, setShowPasscodePrompt] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedArticle, setEditedArticle] = useState<ArticleData>(initialArticle);
    const [showSEOEval, setShowSEOEval] = useState(false);

    // Admin passcode is validated server-side via /api/unlock-researcher
    // Do NOT hardcode secrets client-side

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    // Also try to fetch latest from DB on client side to see if there are fresh edits
    useEffect(() => {
        const fetchLatest = async () => {
            // Priority 1: Check LocalStorage (Most up-to-date for admin/editor)
            const localData = localStorage.getItem('ncs_knowledge_articles');
            if (localData) {
                const parsed = JSON.parse(localData);
                const found = parsed.find((a: any) => a.slug === slug);
                if (found) {
                    setArticle(found);
                    setEditedArticle(found);
                    return; // Successfully loaded from local
                }
            }

            // Priority 2: Database fallback
            try {
                const { data } = await supabase.from('knowledge_articles').select('*').eq('slug', slug).single();
                if (data) {
                    setArticle(data);
                    setEditedArticle(data);
                }
            } catch (e) {
                // Silent fail — client fetch is non-critical, using initial data
            }
        };
        fetchLatest();
    }, [slug]);

    const handleAuthorize = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate passcode server-side via the unlock-researcher endpoint
        try {
            const res = await fetch('/api/unlock-researcher', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secretCode: passcode }),
            });
            const data = await res.json();
            if (data.success || res.status === 401) {
                // 401 = not logged in but code is correct → allow guest edit
                setIsAuthorized(true);
                setShowPasscodePrompt(false);
            } else {
                alert('Mã số bí mật không đúng');
            }
        } catch {
            alert('Không thể xác thực. Vui lòng thử lại.');
        }
    };

    const handleSave = async () => {
        if (!editedArticle) return;
        
        try {
            // Update LocalStorage (Instant Sync)
            const localData = localStorage.getItem('ncs_knowledge_articles');
            let articlesList = localData ? JSON.parse(localData) : [];
            
            const existingIdx = articlesList.findIndex((a: any) => a.slug === editedArticle.slug);
            if (existingIdx >= 0) {
                articlesList[existingIdx] = { ...editedArticle, updated_at: new Date().toISOString() };
            } else {
                articlesList.push({ ...editedArticle, updated_at: new Date().toISOString() });
            }
            
            localStorage.setItem('ncs_knowledge_articles', JSON.stringify(articlesList));

            // Background Sync to Supabase
            await supabase.from('knowledge_articles').upsert(editedArticle, { onConflict: 'slug' });
            
            setArticle(editedArticle);
            setIsEditing(false);
            alert('Đã lưu thành công bài nghiên cứu mới!');
        } catch (err: any) {
            console.error('Save error:', err);
            alert('Lỗi lưu trữ: ' + err.message);
        }
    };

    const displayArticle = article || fallbackArticles[slug] || initialArticle;

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Header />
            <main className="pt-32 pb-24">
                {/* Admin Secret Access */}
                <div className="container mx-auto px-6 max-w-4xl flex justify-end opacity-0 hover:opacity-100 transition-all duration-500">
                    <button onClick={() => setShowPasscodePrompt(true)} className="p-2 text-slate-100 hover:text-slate-200">
                        <Lock className="w-4 h-4" />
                    </button>
                </div>

                {showPasscodePrompt && (
                    <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-6 backdrop-blur-md">
                        <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl border border-slate-100 scale-in-center">
                            <h2 className="text-2xl font-black mb-8 text-center text-slate-900 tracking-tight">ncsStat Admin Access</h2>
                            <form onSubmit={handleAuthorize}>
                                <input 
                                    type="password"
                                    className="w-full text-center text-4xl font-black py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl mb-6 outline-none transition-all tracking-widest"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex gap-4 font-black">
                                    <button type="button" onClick={() => setShowPasscodePrompt(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors uppercase text-xs tracking-widest">Hủy</button>
                                    <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-slate-900 transition-all uppercase text-xs tracking-widest shadow-xl shadow-indigo-100">Xác nhận</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isAuthorized && (
                    <div className="container mx-auto px-6 max-w-4xl mb-8">
                        <div className="bg-slate-900 rounded-[2rem] p-5 flex flex-col md:flex-row items-center justify-between text-white border border-white/10 shadow-3xl">
                            <div className="flex items-center gap-3">
                                <Unlock className="w-5 h-5 text-indigo-400" />
                                <span className="text-sm font-black uppercase tracking-widest">Editor Portal Active</span>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setIsEditing(!isEditing)} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    {isEditing ? 'Đang Chỉnh sửa...' : 'Chế độ Chỉnh sửa'}
                                </button>
                                {isEditing && (
                                    <button onClick={handleSave} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/50">
                                        Lưu thay đổi
                                    </button>
                                )}
                                <button 
                                    onClick={() => setShowSEOEval(!showSEOEval)} 
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${showSEOEval ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                                >
                                    SEO Evaluation
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <article className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                        {/* Main Content Column */}
                        <div className="lg:col-span-3">
                            <header className="mb-16">
                                <Link href="/knowledge" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm mb-12 transition-all group">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại thư viện Tri thức
                                </Link>

                                {showSEOEval && (
                                    <div className="mb-16 bg-white p-2 rounded-[3.5rem] border border-indigo-100 shadow-3xl shadow-indigo-100 overflow-hidden ring-4 ring-indigo-50">
                                        <div className="p-10 border-b border-indigo-50 flex items-center justify-between bg-indigo-50/30">
                                            <h3 className="text-xl font-black text-indigo-950 uppercase tracking-tighter flex items-center gap-3">
                                                <TrendingUp className="w-6 h-6" /> Content SEO Evaluation
                                            </h3>
                                            <button onClick={() => setShowSEOEval(false)} className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors">
                                                <X className="w-5 h-5 text-slate-400" />
                                            </button>
                                        </div>
                                        <div className="p-10 max-h-[800px] overflow-y-auto">
                                            <ContentSEOEvaluationCard 
                                                evaluation={evaluateContent(isEditing ? editedArticle : displayArticle, locale)} 
                                                locale={locale}
                                                title={isVi ? (isEditing ? editedArticle.title_vi : displayArticle.title_vi) : (isEditing ? editedArticle.title_en : displayArticle.title_en)}
                                                slug={slug}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                                        {displayArticle.category}
                                    </span>
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input 
                                            className="w-full text-4xl md:text-5xl font-black text-slate-900 bg-slate-50 border-2 border-indigo-50 p-6 rounded-[2rem] outline-none" 
                                            value={isVi ? editedArticle.title_vi : editedArticle.title_en} 
                                            onChange={(e) => setEditedArticle({...editedArticle, [isVi ? 'title_vi' : 'title_en']: e.target.value})} 
                                        />
                                        <div className="flex gap-4">
                                            <input 
                                                placeholder="Ngưỡng học thuật..."
                                                className="flex-1 bg-slate-900 text-indigo-400 p-4 rounded-xl font-mono text-sm"
                                                value={editedArticle.thresholds || ''}
                                                onChange={(e) => setEditedArticle({...editedArticle, thresholds: e.target.value})}
                                            />
                                            <input 
                                                placeholder="Tác giả..."
                                                className="w-48 bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm font-bold"
                                                value={editedArticle.author}
                                                onChange={(e) => setEditedArticle({...editedArticle, author: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                                            {isVi ? displayArticle.title_vi : displayArticle.title_en}
                                        </h1>
                                        {displayArticle.thresholds && (
                                            <div className="inline-flex items-center gap-4 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-100">
                                                <div className="p-1 px-2.5 bg-indigo-500 rounded-md text-[10px] font-black uppercase tracking-widest text-white">Accepted Thresholds</div>
                                                <div className="font-mono text-sm text-indigo-300 font-bold tracking-tight">{displayArticle.thresholds}</div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-5 py-10 border-t border-slate-100 mt-10">
                                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-100">
                                        <User className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 uppercase tracking-tight text-base mb-1">{displayArticle.author}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Authority Content | {new Date(displayArticle.updated_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </header>

                            <div className="prose prose-2xl max-w-none prose-slate prose-headings:tracking-tighter prose-headings:font-black prose-p:leading-[1.8] prose-p:text-slate-600">
                                {(isEditing ? editedArticle : displayArticle).content_structure.map((section, idx) => (
                                    <div key={idx} id={`section-${idx}`} className="mb-20 last:mb-0 scroll-mt-32 group/section">
                                        {isEditing ? (
                                            <div className="space-y-6 p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase">Section {idx + 1}</div>
                                                    <div className="h-px bg-slate-200 flex-grow"></div>
                                                </div>
                                                <input className="w-full text-3xl font-black p-4 bg-white rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-50" value={isVi ? section.h2_vi : section.h2_en} onChange={(e) => {
                                                    const newS = [...editedArticle.content_structure];
                                                    newS[idx] = {...newS[idx], [isVi ? 'h2_vi' : 'h2_en']: e.target.value};
                                                    setEditedArticle({...editedArticle, content_structure: newS});
                                                }} />
                                                <textarea className="w-full min-h-[400px] p-8 bg-white rounded-2xl outline-none text-xl leading-relaxed border border-slate-200 focus:ring-4 focus:ring-indigo-50" value={isVi ? section.content_vi : section.content_en} onChange={(e) => {
                                                    const newS = [...editedArticle.content_structure];
                                                    newS[idx] = {...newS[idx], [isVi ? 'content_vi' : 'content_en']: e.target.value};
                                                    setEditedArticle({...editedArticle, content_structure: newS});
                                                }} />
                                            </div>
                                        ) : (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-tight group-hover/section:text-indigo-600 transition-colors">
                                                    {isVi ? section.h2_vi : section.h2_en}
                                                </h2>
                                                
                                                {/* Editorial Content Flow */}
                                                <div className={`text-xl md:text-2xl leading-[1.85] text-slate-600 font-normal space-y-8 ${idx === 0 ? 'first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-indigo-600 first-letter:mt-2' : ''}`}>
                                                    {/* Split content by newlines to create natural paragraphs */}
                                                    {(isVi ? section.content_vi : section.content_en).split('\n').map((para, pIdx) => (
                                                        para.trim() && <p key={pIdx} className="mb-6">{para.trim()}</p>
                                                    ))}
                                                </div>
                                                
                                                {/* Contextual Accent for key sections */}
                                                {idx % 2 === 0 && (
                                                    <div className="w-20 h-1.5 bg-indigo-100 rounded-full mt-16 group-hover/section:w-32 group-hover:bg-indigo-400 transition-all duration-700"></div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-900 p-8 md:p-12 rounded-[3rem] text-white mt-24 relative overflow-hidden shadow-2xl border border-white/10">
                                <ShieldCheck className="absolute top-0 right-0 w-64 h-64 opacity-5 -mr-16 -mt-16 rotate-12" />
                                <div className="relative z-10">
                                    <h4 className="text-sm font-black text-indigo-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5" /> Expert Strategy
                                    </h4>
                                    {isEditing ? (
                                        <textarea className="w-full bg-white/10 p-6 rounded-2xl outline-none text-lg font-light text-white leading-relaxed border-2 border-white/10" value={isVi ? editedArticle.expert_tip_vi : editedArticle.expert_tip_en} onChange={(e) => setEditedArticle({...editedArticle, [isVi ? 'expert_tip_vi' : 'expert_tip_en']: e.target.value})} />
                                    ) : (
                                        <p className="text-lg md:text-xl italic font-light text-slate-300 leading-relaxed mb-10 border-l-2 border-indigo-500/30 pl-8">
                                            "{isVi ? displayArticle.expert_tip_vi : displayArticle.expert_tip_en}"
                                        </p>
                                    )}
                                    <Link href="/analyze" className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-indigo-500/20 group">
                                        {isVi ? 'Bắt đầu phân tích ngay' : 'Analyze Now'} <TrendingUp className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Table of Contents Sidebar */}
                        {!isEditing && (
                            <aside className="hidden lg:block">
                                <div className="sticky top-40 space-y-10">
                                    <div>
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                                            {isVi ? 'Mục lục Masterclass' : 'Masterclass TOC'}
                                        </h4>
                                        <nav className="space-y-1">
                                            {displayArticle.content_structure.map((section, idx) => (
                                                <a 
                                                    key={idx}
                                                    href={`#section-${idx}`}
                                                    className="block py-2 px-4 text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border-l-2 border-transparent hover:border-indigo-600 truncate max-w-[250px]"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                >
                                                    {isVi ? section.h2_vi : section.h2_en}
                                                </a>
                                            ))}
                                        </nav>
                                    </div>

                                    {/* Quick Stats Card */}
                                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Reading Stats</p>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium text-slate-500">Duration</span>
                                                <span className="text-xs font-black text-slate-900">15 min</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium text-slate-500">Level</span>
                                                <span className="text-xs font-black text-slate-900">Expert</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium text-slate-500">Citations</span>
                                                <span className="text-xs font-black text-slate-900">Hair et al.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        )}
                    </div>
                </article>
            </main>
            <Footer locale={locale} />
        </div>
    );
}
