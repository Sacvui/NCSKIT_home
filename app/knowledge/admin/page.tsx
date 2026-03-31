'use client';

import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Plus, Edit3, Trash2, ShieldCheck, Lock, Unlock, 
    Clock, RefreshCw, AlertCircle, Download, Upload, Save, X, FileJson, CheckCircle2
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import Link from 'next/link';
import { getSupabase } from '@/utils/supabase/client';

const supabase = getSupabase();

// --- AUTHORITY FALLBACK FOR INITIAL TEMPLATE ---
const MASTER_ARTICLES = [
    {
        slug: 'cronbach-alpha', category: 'Preliminary Analysis',
        title_vi: 'Kiểm định Cronbach\'s Alpha: Bản giao hưởng của Tin cậy nội tại',
        title_en: 'Cronbach\'s Alpha Reliability Test: The Symphony of Internal Consistency',
        expert_tip_vi: 'Đặc biệt tập trung vào cột Corrected Item-Total Correlation. Bất kỳ biến nào < 0.3 cần loại bỏ ngay.',
        expert_tip_en: 'Look at Corrected Item-Total Correlation. Anything < 0.3 should be removed.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [
            { h2_vi: '1. Bản chất & Triết lý', h2_en: '1. Essence & Philosophy', content_vi: 'Đo lường mức độ các câu hỏi trong thang đo hiểu ý nhau. Alpha > 0.7 là tỉ lệ vàng.', content_en: 'Measures internal consistency.' },
            { h2_vi: '2. Tiêu chuẩn quốc tế', h2_en: '2. International Standards', content_vi: '0.8-0.9: Tuyệt vời. 0.7-0.8: Tốt. <0.6: Loại bỏ.', content_en: '0.8-0.9: Excellent. 0.7-0.8: Good. <0.6: Reject.' }
        ]
    }
];

export default function KnowledgeAdmin() {
    const [locale, setLocale] = useState<Locale>('vi');
    const isVi = locale === 'vi';
    const [articles, setArticles] = useState<any[]>([]);
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
        const { data } = await supabase.from('knowledge_articles').select('*').order('updated_at', { ascending: false });
        if (data && data.length > 0) setArticles(data);
        else setArticles(MASTER_ARTICLES);
        setLoading(false);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === SECRET_CODE) { setIsAuthorized(true); setShowLogin(false); }
        else alert('Mã số không đúng');
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(articles || MASTER_ARTICLES, null, 4));
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
            if (!Array.isArray(parsedData)) throw new Error('Dữ liệu phải là một Mảng bài viết');
            
            // Upsert all into Supabase
            const { error } = await supabase.from('knowledge_articles').upsert(parsedData, { onConflict: 'slug' });
            if (error) throw error;
            
            alert(`Thành công! Đã nạp ${parsedData.length} bài nghiên cứu vào Database.`);
            setShowBulkModal(false);
            setImportData('');
            fetchArticles();
        } catch (err: any) {
            alert(`Lỗi Import: ${err.message}. Hãy đảm bảo đúng định dạng JSON Mảng.`);
        } finally {
            setIsImporting(false);
        }
    };

    if (showLogin) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
                <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl border border-slate-50">
                    <h1 className="text-2xl font-black text-center mb-8">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <input type="password" placeholder="••••••" className="w-full text-center text-4xl font-black py-4 bg-slate-50 border-none rounded-2xl outline-none" value={passcode} onChange={(e) => setPasscode(e.target.value)} autoFocus />
                        <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Mở khóa CMS Quản trị</button>
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
                    {/* Dash Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-slate-900 rounded-lg text-white"><LayoutDashboard className="w-5 h-5" /></div><span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">ncsStat Control Center</span></div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Hệ thống Bulk Academy CMS</h1>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={handleExport} className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                                <Download className="w-4 h-4 text-indigo-600" /> Export Template
                            </button>
                            <button onClick={() => setShowBulkModal(true)} className="flex items-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">
                                <Upload className="w-4 h-4" /> Bulk Import Academy
                            </button>
                        </div>
                    </div>

                    {/* Content Table */}
                    <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden p-Form">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-widest text-slate-400">Tên bài nghiên cứu</th>
                                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-widest text-slate-400">Số đoạn văn</th>
                                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Lệnh</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {articles.map((article) => (
                                    <tr key={article.slug} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-10 py-8">
                                            <p className="font-black text-slate-900 text-xl tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">{isVi ? article.title_vi : article.title_en}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">SLUG: {article.slug}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="px-5 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-xl border border-indigo-100">
                                                {article.content_structure?.length || 0} Sections
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <Link href={`/knowledge/${article.slug}`} className="p-3 inline-block bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white rounded-2xl transition-all shadow-sm">
                                                <Edit3 className="w-5 h-5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Bulk Import Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-slate-900/90 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
                    <div className="bg-white rounded-[4rem] p-12 max-w-4xl w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-indigo-600 rounded-[1.5rem] text-white shadow-xl shadow-indigo-100"><FileJson className="w-8 h-8" /></div>
                                <div><h2 className="text-3xl font-black text-slate-900 tracking-tight">Bulk Academy Importer</h2><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Dán Mảng JSON nội dung để nạp hàng loạt bài viết</p></div>
                            </div>
                            <button onClick={() => setShowBulkModal(false)} className="p-3 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"><X className="w-6 h-6" /></button>
                        </div>

                        <textarea 
                            className="w-full h-96 bg-slate-50 rounded-[2rem] p-10 font-mono text-xs focus:ring-4 focus:ring-indigo-100 outline-none border-none transition-all placeholder:text-slate-200"
                            placeholder='[ { "slug": "new-test", "title_vi": "Tiêu đề mới", ... } ]'
                            value={importData}
                            onChange={(e) => setImportData(e.target.value)}
                        />

                        <div className="flex items-center justify-between mt-10">
                            <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest"><AlertCircle className="w-5 h-5 text-indigo-400" /> Hệ thống sẽ overwrite bài viết nếu trùng Slug</div>
                            <button 
                                onClick={handleBulkImport}
                                disabled={isImporting || !importData}
                                className="flex items-center gap-4 px-14 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-3xl shadow-indigo-100 disabled:opacity-50"
                            >
                                {isImporting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                {isImporting ? 'Đang nạp dữ liệu...' : 'Thực thi Nạp nội dung'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer locale={locale} />
        </div>
    );
}
