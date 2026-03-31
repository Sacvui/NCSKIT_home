'use client';

import React, { useState, useEffect, use } from 'react';
import { 
    ArrowLeft, Clock, User, ShieldCheck, TrendingUp, Edit3, Save, X, Lock, Unlock
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import Link from 'next/link';
import { getSupabase } from '@/utils/supabase/client';

// Static Params for build-time optimization
export async function generateStaticParams() {
    return [
        { slug: 'cronbach-alpha' }, { slug: 'efa-factor-analysis' }, { slug: 'regression-vif-multicollinearity' },
        { slug: 'descriptive-statistics-interpretation' }, { slug: 'independent-t-test-guide' }, { slug: 'one-way-anova-post-hoc' },
        { slug: 'pearson-correlation-analysis' }, { slug: 'chi-square-test-independence' }, { slug: 'mediation-analysis-sobel-test' },
        { slug: 'data-cleaning-outliers-detection' }, { slug: 'sem-cfa-structural-modeling' }
    ];
}

const supabase = getSupabase();

interface ArticleSection {
    h2_vi: string; h2_en: string; content_vi: string; content_en: string;
}

interface ArticleData {
    id?: string; slug: string; category: string; title_vi: string; title_en: string;
    expert_tip_vi: string; expert_tip_en: string; content_structure: ArticleSection[];
    author: string; updated_at: string;
}

const FALLBACK_ARTICLES: Record<string, ArticleData> = {
    'cronbach-alpha': {
        slug: 'cronbach-alpha', category: 'Preliminary Analysis',
        title_vi: 'Kiểm định Cronbach\'s Alpha: Bản giao hưởng của Tin cậy nội tại',
        title_en: 'Cronbach\'s Alpha Reliability Test: The Symphony of Internal Consistency',
        expert_tip_vi: 'Đặc biệt tập trung vào cột Corrected Item-Total Correlation. Bất kỳ biến nào < 0.3 cần loại bỏ ngay.',
        expert_tip_en: 'Look at Corrected Item-Total Correlation. Anything < 0.3 should be removed.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Bản chất & Triết lý', h2_en: '1. Essence & Philosophy',
            content_vi: 'Đo lường mức độ các câu hỏi trong thang đo hiểu ý nhau. Alpha > 0.7 là tỉ lệ vàng.',
            content_en: 'Measures internal consistency. Alpha > 0.7 is the gold standard.'
        }, {
            h2_vi: '2. Tiêu chuẩn quốc tế', h2_en: '2. International Standards',
            content_vi: '0.8-0.9: Tuyệt vời. 0.7-0.8: Tốt. <0.6: Loại bỏ.',
            content_en: '0.8-0.9: Excellent. 0.7-0.8: Good. <0.6: Reject.'
        }]
    },
    'efa-factor-analysis': {
        slug: 'efa-factor-analysis', category: 'Factor Analysis',
        title_vi: 'Phân tích nhân tố khám phá (EFA): Cấu trúc ẩn',
        title_en: 'Exploratory Factor Analysis (EFA): Invisible Structures',
        expert_tip_vi: 'Ưu tiên phép xoay Promax thay vì Varimax để phản ánh đúng bản chất hành vi.',
        expert_tip_en: 'Prefer Promax rotation to reflect real human behavior.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Gom nhóm biến', h2_en: '1. Variable Grouping',
            content_vi: 'Tìm ra các nhân tố mẹ điều khiển toàn bộ hành vi dữ liệu.',
            content_en: 'Discover latent factors controlling the dataset.'
        }]
    }
    // Note: fallback_articles covers all slugs logic in fetchArticle
};

export default function ArticlePage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = use(paramsPromise);
    const slug = params?.slug;
    
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
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    useEffect(() => {
        if (slug) {
            fetchArticle(slug);
        }
    }, [slug]);

    const fetchArticle = async (currentSlug: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('knowledge_articles').select('*').eq('slug', currentSlug).single();
            if (data && !error) {
                setArticle(data);
                setEditedArticle(data);
            } else {
                // Use fallback if DB fails or empty
                const localFallback = FALLBACK_ARTICLES[currentSlug];
                if (localFallback) {
                    setArticle(localFallback);
                    setEditedArticle(localFallback);
                }
            }
        } catch (err) {
            const localFallback = FALLBACK_ARTICLES[currentSlug];
            if (localFallback) {
                setArticle(localFallback);
                setEditedArticle(localFallback);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAuthorize = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === SECRET_CODE) {
            setIsAuthorized(true);
            setShowPasscodePrompt(false);
        } else {
            alert('Mã số bí mật không đúng');
        }
    };

    const handleSave = async () => {
        if (!editedArticle) return;
        const { error } = await supabase.from('knowledge_articles').upsert(editedArticle, { onConflict: 'slug' });
        if (!error) {
            setArticle(editedArticle);
            setIsEditing(false);
            alert('Đã lưu thành công!');
        }
    };

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-sans"><Clock className="w-5 h-5 animate-spin mr-2" /> Tải dữ liệu chuyên sâu...</div>;
    
    // If after loading it's still null, try one last check for static fallback
    const finalArticle = article || FALLBACK_ARTICLES[slug];
    if (!finalArticle) return <div className="p-20 text-center font-sans">Không tìm thấy bài viết học thuật này.</div>;

    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-4xl flex justify-end opacity-0 hover:opacity-100 transition-opacity">
                    <button onClick={() => setShowPasscodePrompt(true)}><Lock className="w-4 h-4 text-slate-100" /></button>
                </div>

                {showPasscodePrompt && (
                    <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
                        <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl">
                            <h2 className="text-2xl font-black mb-8 text-center text-slate-900 tracking-tight">Admin Access</h2>
                            <form onSubmit={handleAuthorize}>
                                <input 
                                    type="password"
                                    className="w-full text-center text-4xl font-black py-4 bg-slate-50 rounded-2xl mb-6 outline-none border-2 border-transparent focus:border-indigo-100 transition-all"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowPasscodePrompt(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Hủy</button>
                                    <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold">Xác nhận</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isAuthorized && (
                    <div className="container mx-auto px-6 max-w-4xl mb-8">
                        <div className="bg-slate-900 rounded-3xl p-4 flex items-center justify-between text-white border border-white/10 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <Unlock className="w-5 h-5 text-indigo-400" />
                                <span className="text-sm font-bold uppercase tracking-widest">Editor Portal</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase transition-all">{isEditing ? 'Đang chỉnh sửa' : 'Bật Chế độ Edit'}</button>
                                {isEditing && <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold uppercase transition-all">Lưu vào Hệ thống</button>}
                            </div>
                        </div>
                    </div>
                )}

                <article className="container mx-auto px-6 max-w-4xl">
                    <header className="mb-12">
                        <Link href="/knowledge" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm mb-10 transition-all group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại thư viện tri thức
                        </Link>
                        
                        <div className="flex items-center gap-3 mb-8">
                            <span className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                                {finalArticle.category}
                            </span>
                        </div>

                        {isEditing ? (
                            <input 
                                className="w-full text-4xl md:text-5xl font-black text-slate-900 bg-slate-50 p-6 rounded-[2rem] outline-none border-2 border-indigo-100" 
                                value={isVi ? editedArticle?.title_vi : editedArticle?.title_en} 
                                onChange={(e) => setEditedArticle(prev => prev ? {...prev, [isVi ? 'title_vi' : 'title_en']: e.target.value} : null)} 
                            />
                        ) : (
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-8">
                                {isVi ? finalArticle.title_vi : finalArticle.title_en}
                            </h1>
                        )}

                        <div className="flex items-center gap-4 py-8 border-t border-slate-100">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 uppercase tracking-tight text-sm mb-1">{finalArticle.author}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cập nhật: {new Date(finalArticle.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </header>

                    <div className="prose prose-lg max-w-none">
                        {(isEditing ? editedArticle : finalArticle)?.content_structure.map((section, idx) => (
                            <div key={idx} className="mb-20">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input className="w-full text-2xl font-black p-6 bg-slate-50 rounded-2xl border-2 border-indigo-50 outline-none" value={isVi ? section.h2_vi : section.h2_en} onChange={(e) => {
                                            const newS = [...(editedArticle?.content_structure || [])];
                                            newS[idx] = {...newS[idx], [isVi ? 'h2_vi' : 'h2_en']: e.target.value};
                                            setEditedArticle(p => p ? {...p, content_structure: newS} : null);
                                        }} />
                                        <textarea className="w-full min-h-[400px] p-8 bg-slate-50 rounded-[2.5rem] outline-none text-lg leading-relaxed border-2 border-indigo-50" value={isVi ? section.content_vi : section.content_en} onChange={(e) => {
                                            const newS = [...(editedArticle?.content_structure || [])];
                                            newS[idx] = {...newS[idx], [isVi ? 'content_vi' : 'content_en']: e.target.value};
                                            setEditedArticle(p => p ? {...p, content_structure: newS} : null);
                                        }} />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 border-l-8 border-indigo-600 pl-6 py-1 tracking-tight">
                                            {isVi ? section.h2_vi : section.h2_en}
                                        </h2>
                                        <div className="text-lg md:text-xl text-slate-700 font-normal leading-[1.8] whitespace-pre-line bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100">
                                            {isVi ? section.content_vi : section.content_en}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Expert Tip Section */}
                    <div className="bg-slate-900 p-12 md:p-16 rounded-[4rem] text-white my-24 relative overflow-hidden shadow-2xl border border-white/10">
                        <ShieldCheck className="absolute top-0 right-0 w-64 h-64 opacity-5 -mr-12 -mt-12" />
                        <div className="relative z-10">
                            <h4 className="text-xl font-black text-indigo-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4 font-sans">
                                <ShieldCheck className="w-10 h-10" /> ncsStat Expert Strategy
                            </h4>
                            {isEditing ? (
                                <textarea className="w-full bg-white/10 p-8 rounded-[2rem] outline-none text-xl font-light text-white leading-relaxed border-2 border-white/10" value={isVi ? editedArticle?.expert_tip_vi : editedArticle?.expert_tip_en} onChange={(e) => setEditedArticle(prev => prev ? {...prev, [isVi ? 'expert_tip_vi' : 'expert_tip_en']: e.target.value} : null)} />
                            ) : (
                                <p className="text-2xl md:text-3xl italic font-light text-slate-300 leading-relaxed mb-12 border-l-4 border-indigo-500/30 pl-10">
                                    "{isVi ? finalArticle.expert_tip_vi : finalArticle.expert_tip_en}"
                                </p>
                            )}
                            <Link href="/analyze" className="inline-flex items-center gap-4 px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-indigo-500/20 group">
                                Bắt đầu phân tích ngay <TrendingUp className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </article>
            </main>
            <Footer locale={locale} />
        </div>
    );
}
