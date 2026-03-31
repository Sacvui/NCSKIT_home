'use client';

import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Plus, Edit3, Trash2, ShieldCheck, Lock, Unlock, 
    Clock, RefreshCw, AlertCircle, Download, Upload, Save, X, FileJson, CheckCircle2, BookOpen
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import Link from 'next/link';
import { getSupabase } from '@/utils/supabase/client';

const supabase = getSupabase();

// --- FULL MASTER REPOSITORY (11 AUTHORITY ARTICLES) ---
const FULL_MASTER_ARTICLES = [
    { slug: 'cronbach-alpha', category: 'Preliminary Analysis', title_vi: 'Kiểm định Cronbach\'s Alpha: Bản giao hưởng của Tin cậy nội tại', title_en: 'Cronbach\'s Alpha Reliability Test', author: 'ncsStat Editorial', updated_at: new Date().toISOString(), content_structure: [{ h2_vi: '1. Bản chất', h2_en: '1. Essence', content_vi: 'Đo lường tin cậy nội tại của thang đo.', content_en: 'Measures internal reliability.' }] },
    { slug: 'efa-factor-analysis', category: 'Factor Analysis', title_vi: 'Phân tích nhân tố khám phá (EFA): Khám phá cấu trúc ẩn', title_en: 'Exploratory Factor Analysis (EFA)', author: 'ncsStat Editorial', updated_at: new Date().toISOString(), content_structure: [{ h2_vi: '1. Gom nhóm biến', h2_en: '1. Grouping', content_vi: 'Khám phá các nhân tố ẩn.', content_en: 'Explore latent factors.' }] },
    { slug: 'regression-vif-multicollinearity', category: 'Impact Analysis', title_vi: 'Hồi quy đa biến và Đa cộng tuyến (VIF)', title_en: 'Multiple Regression & VIF', author: 'ncsStat Editorial', updated_at: new Date().toISOString(), content_structure: [{ h2_vi: '1. Dự báo', h2_en: '1. Prediction', content_vi: 'Dự báo biến số.', content_en: 'Predicting variables.' }] },
    { slug: 'descriptive-statistics-interpretation', category: 'Preliminary Analysis', title_vi: 'Thống kê mô tả: Nghệ thuật kể chuyện qua con số', title_en: 'Descriptive Statistics', author: 'ncsStat Editorial', updated_at: new Date().toISOString(), content_structure: [{ h2_vi: '1. Thống kê Mean/SD', h2_en: '1. Mean/SD', content_vi: 'Mô tả mẫu khảo sát.', content_en: 'Describing sample.' }] },
    { slug: 'independent-t-test-guide', category: 'Comparison Analysis', title_vi: 'Independent T-test: So sánh các nhóm đối đầu', title_en: 'Independent T-test', author: 'ncsStat Editorial', updated_at: new Date().toISOString(), content_structure: [{ h2_vi: '1. So sánh 2 nhóm', h2_en: '1. Comparing', content_vi: 'So sánh Nam và Nữ.', content_en: 'Comparing Male/Female.' }] },
    { slug: 'one-way-anova-post-hoc', category: 'Comparison Analysis', title_vi: 'Phân tích ANOVA: So sánh Đa nhóm chuyên sâu', title_en: 'One-way ANOVA', author: 'ncsStat Editorial', updated_at: new Date().toISOString(), content_structure: [{ h2_vi: '1. So sánh 3 nhóm', h2_en: '1. 3+ Groups', content_vi: 'So sánh theo trình độ học vấn.', content_en: 'Comparing by education.' }] },
    { slug: 'pearson-correlation-analysis', category: 'Relationship Analysis', title_vi: 'Tương quan Pearson: Bản đồ các mối liên kết', title_en: 'Pearson Correlation', author: 'ncsStat Editorial', updated_at: new Date().toISOString(), content_structure: [{ h2_vi: '1. Mối quan hệ', h2_en: '1. Relationship', content_vi: 'Kiểm tra mối liên hệ.', content_en: 'Check relationships.' }] },
    { slug: 'chi-square-test-independence', category: 'Categorical Analysis', title_vi: 'Kiểm định Chi-square: Liên kết dữ liệu định danh', title_en: 'Chi-square Test', author: 'ncsStat Editorial', updated_at: new Date().toISOString(), content_structure: [{ h2_vi: '1. Liên kết định tính', h2_en: '1. Categorical Link', content_vi: 'Phân tích dữ liệu thuộc tính.', content_en: 'Attribute analysis.' }] },
    { slug: 'mediation-analysis-sobel-test', category: 'Advanced Analysis', title_vi: 'Biến trung gian (Mediation): Giải mã cơ chế tác động', title_en: 'Mediation Analysis', author: 'ncsStat Editorial', updated_at: new Date().toISOString(), content_structure: [{ h2_vi: '1. Vai trò trung gian', h2_en: '1. Mediator', content_vi: 'Tìm biến cầu nối.', content_en: 'Finding bridge variables.' }] },
    { slug: 'data-cleaning-outliers-detection', category: 'Preliminary Analysis', title_vi: 'Làm sạch dữ liệu & Outliers: Vệ sinh Khoa học', title_en: 'Data Cleaning', author: 'ncsStat Editorial', updated_at: new Date().toISOString(), content_structure: [{ h2_vi: '1. Loại bỏ Outliers', h2_en: '1. Outliers Removal', content_vi: 'Vệ sinh dữ liệu khảo sát.', content_en: 'Data sanitization.' }] },
    { slug: 'sem-cfa-structural-modeling', category: 'Advanced Analysis', title_vi: 'Mô hình SEM và CFA: Đỉnh cao học thuật toàn cầu', title_en: 'SEM & CFA', author: 'ncsStat Editorial', updated_at: new Date().toISOString(), content_structure: [{ h2_vi: '1. Phân tích SEM', h2_en: '1. SEM Analysis', content_vi: 'Đỉnh cao mô phỏng cấu trúc.', content_en: 'Structural modeling.' }] }
];

export default function KnowledgeAdmin() {
    const [locale, setLocale] = useState<Locale>('vi');
    const isVi = locale === 'vi';
    const [articles, setArticles] = useState<any[]>(FULL_MASTER_ARTICLES);
    const [loading, setLoading] = useState(true);
    
    // Auth State
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [showLogin, setShowLogin] = useState(true);
    const SECRET_CODE = '300489';

    // Bulk Mode
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [importData, setImportData] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    useEffect(() => {
        setLocale(getStoredLocale());
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            // Priority 1: Local Storage (for instant editing/importing)
            const localData = localStorage.getItem('ncs_knowledge_articles');
            if (localData) {
                const parsed = JSON.parse(localData);
                if (parsed && parsed.length > 0) {
                    setArticles(parsed);
                    setLoading(false);
                    return;
                }
            }

            // Priority 2: Supabase
            const { data } = await supabase.from('knowledge_articles').select('*').order('updated_at', { ascending: false });
            if (data && data.length > 0) {
                setArticles(data);
                localStorage.setItem('ncs_knowledge_articles', JSON.stringify(data));
            } else {
                setArticles(FULL_MASTER_ARTICLES);
            }
        } catch (err) {
            setArticles(FULL_MASTER_ARTICLES);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === SECRET_CODE) { setIsAuthorized(true); setShowLogin(false); }
        else alert('Mã số không đúng');
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(articles || FULL_MASTER_ARTICLES, null, 4));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "ncsstat_academy_template.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleBulkImport = async () => {
        setIsImporting(true);
        try {
            const parsedData = JSON.parse(importData);
            
            // Save to LocalStorage for instant persistence
            localStorage.setItem('ncs_knowledge_articles', JSON.stringify(parsedData));
            
            // Try to sync with Supabase (Optional fallback)
            try {
                await supabase.from('knowledge_articles').upsert(parsedData, { onConflict: 'slug' });
            } catch (sErr) {
                console.warn('Supabase sync failed, utilizing local storage only.', sErr);
            }

            alert(`Nạp thành công ${parsedData.length} bài nghiên cứu vào bộ nhớ CMS!`);
            setShowBulkModal(false);
            setImportData('');
            fetchArticles();
        } catch (err: any) {
            alert(`Lỗi cấu trúc JSON: ${err.message}`);
        } finally {
            setIsImporting(false);
        }
    };

    const handleResetToMaster = () => {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ nội dung đã nạp và quay về phiên bản Gốc của hệ thống?')) {
            localStorage.removeItem('ncs_knowledge_articles');
            fetchArticles();
        }
    };

    if (showLogin) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl border border-slate-50">
                    <h1 className="text-2xl font-black text-center mb-8">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <input type="password" placeholder="••••••" className="w-full text-center text-4xl font-black py-4 bg-slate-50 rounded-2xl outline-none" value={passcode} onChange={(e) => setPasscode(e.target.value)} autoFocus />
                        <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Đăng nhập CMS ncsStat</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Header />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-100"><LayoutDashboard className="w-5 h-5" /></div><span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] font-sans">CMS Control Center</span></div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight font-sans">Hệ thống Bulk Academy CMS</h1>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={handleResetToMaster} className="flex items-center gap-3 px-8 py-5 bg-white border border-red-200 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm">
                                <RefreshCw className="w-4 h-4" /> Reset to Factory
                            </button>
                            <button onClick={handleExport} className="flex items-center gap-3 px-8 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                                <Download className="w-4 h-4 text-indigo-600" /> Export Template
                            </button>
                            <button onClick={() => setShowBulkModal(true)} className="flex items-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">
                                <Upload className="w-4 h-4" /> Bulk Import Academy
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[4rem] border border-slate-100 shadow-3xl overflow-hidden p-Form">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">Danh mục bài nghiên cứu Master</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">Dữ liệu</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right font-sans">Lệnh</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={3} className="px-10 py-20 text-center animate-pulse font-bold text-slate-300 uppercase tracking-widest">Đang tải danh mục...</td></tr>
                                ) : (
                                    articles.map((article) => (
                                        <tr key={article.slug} className="hover:bg-indigo-50/20 transition-all group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm border border-slate-100"><BookOpen className="w-5 h-5" /></div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-lg md:text-xl tracking-tight mb-1 group-hover:text-indigo-600 transition-colors font-sans">{isVi ? article.title_vi : article.title_en}</p>
                                                        <p className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-widest bg-slate-100 px-2.5 py-0.5 rounded-md w-fit">ID: {article.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="px-5 py-2 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-xl border border-slate-100 font-sans tracking-widest italic">{article.category}</span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                                                    <Link href={`/knowledge/${article.slug}`} className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                                                        <Edit3 className="w-4 h-4" /> Edit Bài viết
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {showBulkModal && (
                <div className="fixed inset-0 bg-slate-900/95 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
                    <div className="bg-white rounded-[4rem] p-12 max-w-4xl w-full shadow-2xl border border-white/20">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <FileJson className="w-10 h-10 text-indigo-600" />
                                <div><h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans">Bulk Importer Portal</h2><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Dán Mảng JSON để nạp dữ liệu hàng loạt</p></div>
                            </div>
                            <button onClick={() => setShowBulkModal(false)} className="p-3 bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-full transition-all"><X className="w-6 h-6" /></button>
                        </div>
                        <textarea className="w-full h-[500px] bg-slate-50 rounded-[3rem] p-12 font-mono text-[11px] focus:ring-4 focus:ring-indigo-100 outline-none border-none transition-all placeholder:text-slate-200" placeholder='[ { "slug": "item", ... } ]' value={importData} onChange={(e) => setImportData(e.target.value)} />
                        <div className="flex items-center justify-between mt-10 px-4">
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-3"><AlertCircle className="w-4 h-4" /> Hệ thống sẽ overwrite bài viết nếu trùng Slug ID</p>
                            <button onClick={handleBulkImport} disabled={isImporting || !importData} className="px-14 py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-3xl shadow-indigo-100 hover:bg-slate-900 transition-all">
                                {isImporting ? 'Đang nạp...' : 'Thực thi Nạp nội dung'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer locale={locale} />
        </div>
    );
}
