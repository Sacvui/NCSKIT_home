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

// This ensures Next.js knows these slugs exist during build for SEO & Performance
export async function generateStaticParams() {
    return [
        { slug: 'cronbach-alpha' }, { slug: 'efa-factor-analysis' }, { slug: 'regression-vif-multicollinearity' },
        { slug: 'descriptive-statistics-interpretation' }, { slug: 'independent-t-test-guide' }, { slug: 'one-way-anova-post-hoc' },
        { slug: 'pearson-correlation-analysis' }, { slug: 'chi-square-test-independence' }, { slug: 'mediation-analysis-sobel-test' },
        { slug: 'data-cleaning-outliers-detection' }, { slug: 'sem-cfa-structural-modeling' }
    ];
}

export const dynamicParams = true;

const supabase = getSupabase();

interface ArticleSection {
    h2_vi: string;
    h2_en: string;
    content_vi: string;
    content_en: string;
}

interface ArticleData {
    id?: string;
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

// --- MASTER REPOSITORY (FALLBACK - GUARANTEED UPTIME) ---
const FALLBACK_ARTICLES: Record<string, ArticleData> = {
    'cronbach-alpha': {
        slug: 'cronbach-alpha',
        category: 'Preliminary Analysis',
        title_vi: 'Kiểm định Cronbach\'s Alpha: Bản giao hưởng của Tin cậy nội tại',
        title_en: 'Cronbach\'s Alpha Reliability Test: The Symphony of Internal Consistency',
        expert_tip_vi: 'Đặc biệt tập trung vào cột Corrected Item-Total Correlation. Bất kỳ biến nào < 0.3 cần loại bỏ ngay.',
        expert_tip_en: 'Look at Corrected Item-Total Correlation. Anything < 0.3 should be removed.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Bản chất & Triết lý', h2_en: '1. Essence & Philosophy',
            content_vi: 'Đo lường mức độ các câu hỏi trong thang đo hiểu ý nhau. Alpha > 0.7 là tỉ lệ vàng.',
            content_en: 'Measures internal consistency. Alpha > 0.7 is the gold standard.'
        }]
    },
    'efa-factor-analysis': {
        slug: 'efa-factor-analysis', category: 'Factor Analysis',
        title_vi: 'Phân tích nhân tố khám phá (EFA): Cấu trúc ẩn',
        title_en: 'Exploratory Factor Analysis (EFA): Invisible Structures',
        expert_tip_vi: 'Ưu tiên phép xoay Promax thay vì Varimax.', expert_tip_en: 'Prefer Promax rotation.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Gom nhóm biến', h2_en: '1. Variable Grouping',
            content_vi: 'Tìm ra các nhân tố mẹ điều khiển toàn bộ hành vi dữ liệu.',
            content_en: 'Discover latent factors controlling the dataset.'
        }]
    },
    'regression-vif-multicollinearity': {
        slug: 'regression-vif-multicollinearity', category: 'Impact Analysis',
        title_vi: 'Hồi quy đa biến và Đa cộng tuyến (VIF)', title_en: 'Multiple Regression & VIF',
        expert_tip_vi: 'Hệ số Beta chuẩn hóa giúp so sánh độ mạnh tác động.', expert_tip_en: 'Use Standardized Beta.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Dự báo tác động', h2_en: '1. Impact Prediction',
            content_vi: 'Cho thấy biến X làm biến Y thay đổi bao nhiêu đơn vị.',
            content_en: 'Shows how much Y changes when X increases.'
        }]
    },
    'descriptive-statistics-interpretation': {
        slug: 'descriptive-statistics-interpretation', category: 'Preliminary Analysis',
        title_vi: 'Thống kê mô tả: Nghệ thuật kể chuyện qua con số',
        title_en: 'Descriptive Statistics: The Art of Storytelling',
        expert_tip_vi: 'Độ lệch chuẩn cao thể hiện sự phân hóa thị trường mạnh.', expert_tip_en: 'High SD means high polarization.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Mô tả Mean và SD', h2_en: '1. Describing Mean & SD',
            content_vi: 'Nền tảng của mọi nghiên cứu là hiểu khách hàng trung bình là ai.',
            content_en: 'The foundation of all research.'
        }]
    },
    'independent-t-test-guide': {
        slug: 'independent-t-test-guide', category: 'Comparison Analysis',
        title_vi: 'Independent T-test: So sánh các nhóm đối đầu',
        title_en: 'T-test: Comparing Opposite Groups',
        expert_tip_vi: 'Levene Sig > 0.05 là điều kiện bắt buộc bản dòng 1.', expert_tip_en: 'Levene Sig > 0.05 for Row 1.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. So sánh 2 nhóm', h2_en: '1. Comparing 2 Groups',
            content_vi: 'Vd Nam và Nữ có sự khác biệt về chi tiêu hay không.',
            content_en: 'Male vs Female spending differences.'
        }]
    },
    'one-way-anova-post-hoc': {
        slug: 'one-way-anova-post-hoc', category: 'Comparison Analysis',
        title_vi: 'Phân tích ANOVA: So sánh Đa nhóm chuyên sâu',
        title_en: 'One-way ANOVA: Deep Analysis',
        expert_tip_vi: 'Post-hoc Tukey giúp chỉ ra cặp nào khác nhau.', expert_tip_en: 'Tukey Post-hoc is essential.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. So sánh 3 nhóm trở lên', h2_en: '1. 3+ Groups Comparison',
            content_vi: 'Phân tích theo học vấn hay thu nhập (3 mức).',
            content_en: 'Analysis by Education or Income.'
        }]
    },
    'pearson-correlation-analysis': {
        slug: 'pearson-correlation-analysis', category: 'Relationship Analysis',
        title_vi: 'Tương quan Pearson: Bản đồ các mối liên kết',
        title_en: 'Pearson Correlation: Connection Map',
        expert_tip_vi: 'Nếu r > 0.8 giữa biến độc lập, cẩn thận đa cộng tuyến.', expert_tip_en: 'Beware r > 0.8.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Mối quan hệ tương quan', h2_en: '1. Correlation Relationship',
            content_vi: 'Các biến đi cùng nhau theo hướng thuận hay nghịch.',
            content_en: 'Variable movement sync.'
        }]
    },
    'chi-square-test-independence': {
        slug: 'chi-square-test-independence', category: 'Categorical Analysis',
        title_vi: 'Kiểm định Chi-square: Liên kết dữ liệu định danh',
        title_en: 'Chi-square Test: Categorical Link',
        expert_tip_vi: 'Dùng Cramer V để đo độ mạnh liên kết thực sự.', expert_tip_en: 'Cramer V measures actual link strength.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Crosstabs Analysis', h2_en: '1. Crosstabs Analysis',
            content_vi: 'So sánh ý kiến theo đặc điểm nhân khẩu học.',
            content_en: 'Survey opinion by demographics.'
        }]
    },
    'mediation-analysis-sobel-test': {
        slug: 'mediation-analysis-sobel-test', category: 'Advanced Analysis',
        title_vi: 'Biến trung gian (Mediation): Cơ chế tác động',
        title_en: 'Mediation Analysis: Impact Mechanism',
        expert_tip_vi: 'Bootstrapping là tiêu chuẩn uy tín của Scopus.', expert_tip_en: 'Bootstrapping is the Gold Standard.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Tìm cầu nối M', h2_en: '1. Finding the M-Bridge',
            content_vi: 'Giải thích tại sao X lại dẫn đến Y.',
            content_en: 'Explain why X leads to Y.'
        }]
    },
    'data-cleaning-outliers-detection': {
        slug: 'data-cleaning-outliers-detection', category: 'Preliminary Analysis',
        title_vi: 'Làm sạch dữ liệu & Outliers', title_en: 'Data Cleaning & Outliers',
        expert_tip_vi: 'Mahalanobis giúp lọc sạch người trả lời lụi.', expert_tip_en: 'Filter junk responders.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Vệ sinh dữ liệu', h2_en: '1. Data Cleaning',
            content_vi: 'Loại bỏ sai lệch trước khi vào mô hình.',
            content_en: 'Removing bias before modeling.'
        }]
    },
    'sem-cfa-structural-modeling': {
        slug: 'sem-cfa-structural-modeling', category: 'Advanced Analysis',
        title_vi: 'Mô hình SEM và CFA: Đỉnh cao học thuật',
        title_en: 'SEM & CFA: The Pinnacle',
        expert_tip_vi: 'CFI/TLI cần > 0.9 để mô hình đạt chuẩn.', expert_tip_en: 'CFI/TLI > 0.9 required.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Cấu trúc tuyến tính', h2_en: '1. Linear Structure',
            content_vi: 'Kiểm định toàn bộ mô hình phức tạp cùng lúc.',
            content_en: 'Testing all complex theories at once.'
        }]
    }
};

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
        try {
            const { data } = await supabase.from('knowledge_articles').select('*').eq('slug', params.slug).single();
            if (data) {
                setArticle(data);
                setEditedArticle(data);
            } else {
                const localFallback = FALLBACK_ARTICLES[params.slug];
                if (localFallback) {
                    setArticle(localFallback);
                    setEditedArticle(localFallback);
                }
            }
        } catch (err) {
            const localFallback = FALLBACK_ARTICLES[params.slug];
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

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center p-10"><Clock className="w-5 h-5 animate-spin mr-2" /> Tải dữ liệu...</div>;
    if (!article) return <div className="p-20 text-center">Không tìm thấy bài viết</div>;

    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />
            <main className="pt-32 pb-24">
                {/* Secret Trigger */}
                <div className="container mx-auto px-6 max-w-4xl flex justify-end opacity-0 hover:opacity-100 transition-opacity">
                    <button onClick={() => setShowPasscodePrompt(true)}><Lock className="w-4 h-4 text-slate-100" /></button>
                </div>

                {showPasscodePrompt && (
                    <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-6">
                        <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl">
                            <h2 className="text-2xl font-black mb-8 text-center">Admin Access</h2>
                            <form onSubmit={handleAuthorize}>
                                <input 
                                    type="password"
                                    className="w-full text-center text-4xl font-black py-4 bg-slate-50 rounded-2xl mb-6 outline-none"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowPasscodePrompt(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl">Hủy</button>
                                    <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl">Xác nhận</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isAuthorized && (
                    <div className="container mx-auto px-6 max-w-4xl mb-8">
                        <div className="bg-slate-900 rounded-3xl p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <Unlock className="w-5 h-5 text-indigo-400" />
                                <span className="text-sm font-bold">Admin Portal</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-white/20 rounded-lg text-xs font-bold uppercase">{isEditing ? 'Đang Edit' : 'Edit'}</button>
                                {isEditing && <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold uppercase">Lưu bài</button>}
                            </div>
                        </div>
                    </div>
                )}

                <article className="container mx-auto px-6 max-w-4xl leading-relaxed">
                    <header className="mb-12">
                        <Link href="/knowledge" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Quay lại thư viện
                        </Link>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full">{article.category}</span>
                        </div>
                        {isEditing ? (
                            <input className="w-full text-4xl md:text-6xl font-black text-slate-900 bg-slate-50 p-4 rounded-2xl outline-none" value={isVi ? editedArticle?.title_vi : editedArticle?.title_en} onChange={(e) => setEditedArticle(prev => prev ? {...prev, [isVi ? 'title_vi' : 'title_en']: e.target.value} : null)} />
                        ) : (
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">{isVi ? article.title_vi : article.title_en}</h1>
                        )}
                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-4">
                            <User className="w-5 h-5 text-slate-300" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{article.author} | {new Date(article.updated_at).toLocaleDateString()}</span>
                        </div>
                    </header>

                    {(isEditing ? editedArticle : article)?.content_structure.map((section, idx) => (
                        <div key={idx} className="mb-16">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <input className="w-full text-xl font-bold p-4 bg-slate-50 rounded-xl outline-none" value={isVi ? section.h2_vi : section.h2_en} onChange={(e) => {
                                        const newS = [...(editedArticle?.content_structure || [])];
                                        newS[idx] = {...newS[idx], [isVi ? 'h2_vi' : 'h2_en']: e.target.value};
                                        setEditedArticle(p => p ? {...p, content_structure: newS} : null);
                                    }} />
                                    <textarea className="w-full min-h-[300px] p-6 bg-slate-50 rounded-xl outline-none text-lg" value={isVi ? section.content_vi : section.content_en} onChange={(e) => {
                                        const newS = [...(editedArticle?.content_structure || [])];
                                        newS[idx] = {...newS[idx], [isVi ? 'content_vi' : 'content_en']: e.target.value};
                                        setEditedArticle(p => p ? {...p, content_structure: newS} : null);
                                    }} />
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-black text-slate-900 mb-6 border-l-4 border-indigo-600 pl-4">{isVi ? section.h2_vi : section.h2_en}</h2>
                                    <p className="text-lg text-slate-700 whitespace-pre-line">{isVi ? section.content_vi : section.content_en}</p>
                                </>
                            )}
                        </div>
                    ))}

                    <div className="bg-slate-900 p-10 md:p-14 rounded-[3rem] text-white mt-16 relative overflow-hidden">
                        <ShieldCheck className="absolute top-0 right-0 w-32 h-32 opacity-10 -mr-6 -mt-6" />
                        <h4 className="text-lg font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">Expert Tip</h4>
                        {isEditing ? (
                            <textarea className="w-full bg-white/10 p-4 rounded-xl outline-none text-white" value={isVi ? editedArticle?.expert_tip_vi : editedArticle?.expert_tip_en} onChange={(e) => setEditedArticle(prev => prev ? {...prev, [isVi ? 'expert_tip_vi' : 'expert_tip_en']: e.target.value} : null)} />
                        ) : (
                            <p className="text-xl md:text-2xl italic font-light text-slate-300">"{isVi ? article.expert_tip_vi : article.expert_tip_en}"</p>
                        )}
                        <Link href="/analyze" className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-indigo-600 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all">Analyze Now <TrendingUp className="w-4 h-4" /></Link>
                    </div>
                </article>
            </main>
            <Footer locale={locale} />
        </div>
    );
}
