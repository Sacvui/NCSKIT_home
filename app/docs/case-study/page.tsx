'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { 
    Workflow, Shield, GitCompare, Bookmark, GraduationCap, Microscope, FileText
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

export default function CaseStudyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>}>
            <CaseStudyContent />
        </Suspense>
    );
}

function CaseStudyContent() {
    const router = useRouter();
    const [locale, setLocale] = useState<Locale>('vi');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setLocale(getStoredLocale());
        setMounted(true);

        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    if (!mounted) return null;

    return (
        <div className="bg-slate-50 min-h-screen selection:bg-indigo-100 selection:text-indigo-900 pb-24">
            {/* Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="relative z-10">
                <main className="container mx-auto px-6 max-w-5xl py-16 md:py-24">
                    <div className="text-center mb-20">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            {t(locale, 'docs.casestudy.title')}
                        </h1>
                        <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed font-light">
                            {t(locale, 'docs.casestudy.subtitle')}
                        </p>
                    </div>

                    {/* Scenario Header */}
                    <div className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-xl mb-20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                            <Microscope className="w-64 h-64" />
                        </div>
                        <div className="relative z-10">
                            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-8 inline-block border border-indigo-100">
                                {t(locale, 'docs.casestudy_content.model_badge')}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 leading-tight">
                                {t(locale, 'docs.casestudy_content.scenario_title')}
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mb-10 font-light">
                                {t(locale, 'docs.casestudy_content.scenario_desc')}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <span className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500">
                                    <Bookmark className="w-4 h-4 text-indigo-500" /> {t(locale, 'docs.casestudy_content.stats.sample')}
                                </span>
                                <span className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500">
                                    <Shield className="w-4 h-4 text-indigo-500" /> {t(locale, 'docs.casestudy_content.stats.scale')}
                                </span>
                                <span className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500">
                                    <GitCompare className="w-4 h-4 text-indigo-500" /> {t(locale, 'docs.casestudy_content.stats.analysis')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Workflow */}
                    <div className="relative border-l-4 border-slate-200 ml-4 md:ml-16 pl-10 md:pl-16 space-y-24 mb-32">
                        {/* Phase 1 */}
                        <div className="relative">
                            <div className="absolute -left-[58px] md:-left-[82px] w-10 h-10 rounded-full bg-slate-900 border-8 border-white shadow-xl flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                            </div>
                            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:translate-x-2 transition-transform duration-500 group">
                                <h3 className="text-xl font-extrabold text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors">{t(locale, 'docs.casestudy_content.phase1.title')}</h3>
                                <p className="text-slate-500 text-base leading-relaxed mb-8 font-light">
                                    {t(locale, 'docs.casestudy_content.phase1.desc')}
                                </p>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col gap-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t(locale, 'docs.casestudy_content.phase1.report_label')}</span>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl shadow-sm">{t(locale, 'docs_casestudy_labels.mean_sd')}</span>
                                        <span className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl shadow-sm">{t(locale, 'docs_casestudy_labels.freq_table')}</span>
                                        <span className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl shadow-sm">{t(locale, 'docs_casestudy_labels.demo_plot')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phase 2 */}
                        <div className="relative">
                            <div className="absolute -left-[58px] md:-left-[82px] w-10 h-10 rounded-full bg-slate-900 border-8 border-white shadow-xl"></div>
                            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:translate-x-2 transition-transform duration-500 group">
                                <h3 className="text-xl font-extrabold text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors">{t(locale, 'docs.casestudy_content.phase2.title')}</h3>
                                <p className="text-slate-500 text-base leading-relaxed mb-8 font-light">
                                    {t(locale, 'docs.casestudy_content.phase2.desc')}
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-inner">
                                        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-4">{t(locale, 'docs.casestudy_content.phase2.pass')}</p>
                                        <ul className="text-sm text-emerald-800 space-y-2 font-bold">
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Alpha & C.R &gt; 0.70
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Outer Loadings &gt; 0.708
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> AVE &gt; 0.50
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 shadow-inner">
                                        <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-4">{t(locale, 'docs.casestudy_content.phase2.note')}</p>
                                        <p className="text-sm text-amber-800 font-medium leading-relaxed italic">{t(locale, 'docs.casestudy_content.phase2.note_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phase 3 */}
                        <div className="relative">
                            <div className="absolute -left-[58px] md:-left-[82px] w-10 h-10 rounded-full bg-slate-900 border-8 border-white shadow-xl"></div>
                            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:translate-x-2 transition-transform duration-500 group">
                                <h3 className="text-xl font-extrabold text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors">{t(locale, 'docs.casestudy_content.phase3.title')}</h3>
                                <p className="text-slate-500 text-base leading-relaxed mb-8 font-light">
                                    {t(locale, 'docs.casestudy_content.phase3.desc')}
                                </p>
                                <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 shadow-inner">
                                    <p className="text-sm text-indigo-700 font-bold italic leading-relaxed text-center">
                                        {t(locale, 'docs.casestudy_content.phase3.example')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Phase 4 */}
                        <div className="relative">
                            <div className="absolute -left-[58px] md:-left-[82px] w-10 h-10 rounded-full bg-slate-900 border-8 border-white shadow-xl"></div>
                            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:translate-x-2 transition-transform duration-500 group">
                                <h3 className="text-xl font-extrabold text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors">{t(locale, 'docs.casestudy_content.phase4.title')}</h3>
                                <p className="text-slate-500 text-base leading-relaxed mb-8 font-light">
                                    {t(locale, 'docs.casestudy_content.phase4.desc')}
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-2xl">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">{t(locale, 'docs.casestudy_content.phase4.hypothesis')}</p>
                                        <p className="text-sm font-black underline decoration-indigo-500 decoration-4 underline-offset-4 mb-3">{t(locale, 'docs_casestudy_labels.hypothesis_example')}</p>
                                        <p className="text-xs font-bold text-slate-400">{t(locale, 'docs_casestudy_labels.result_stat')}</p>
                                        <div className="mt-6 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-400 font-black uppercase tracking-widest text-center">
                                            {t(locale, 'docs.casestudy_content.phase4.supported')}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 shadow-inner flex flex-col justify-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">{t(locale, 'docs.casestudy_content.phase4.explanation_power')}</p>
                                        <div className="flex items-center gap-5">
                                            <div className="text-4xl font-black text-slate-900 tracking-tighter">42%</div>
                                            <p className="text-[11px] text-slate-500 leading-tight font-medium">{t(locale, 'docs.casestudy_content.phase4.explanation_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NEW: Beginner Marketing Roadmap Section */}
                    <div className="mb-32">
                        <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-50"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight italic tracking-tighter">
                                    Lộ trình Nghiên cứu <br />Marketing Chuẩn (Beginner)
                                </h2>
                                <p className="text-indigo-100 text-lg mb-12 max-w-2xl font-medium leading-relaxed opacity-90">
                                    Dành cho người mới: "Sau khi tính Thống kê mô tả xong thì làm gì tiếp theo?". 
                                    Dưới đây là luồng dữ liệu 5 bước giúp bạn đi từ bảng số thô đến bài báo khoa học hoàn chỉnh.
                                </p>

                                <div className="grid gap-8">
                                    {[
                                        {
                                            step: "01",
                                            name: "Thống kê Mô tả & Làm sạch",
                                            purpose: "Hiểu chân dung mẫu nghiên cứu (Ai là người trả lời?).",
                                            indices: [
                                                { label: "Skewness", val: "± 2.0", desc: "Đạt chuẩn phân phối chuẩn" },
                                                { label: "Missing Data", val: "< 5%", desc: "Dữ liệu đủ tin cậy" }
                                            ]
                                        },
                                        {
                                            step: "02",
                                            name: "Kiểm định Độ tin cậy (Reliability)",
                                            purpose: "Loại bỏ các câu hỏi 'rác' hoặc gây hiểu lầm.",
                                            indices: [
                                                { label: "Cronbach's Alpha", val: "> 0.70", desc: "Thang đo nhất quán" },
                                                { label: "Corrected Item-Total", val: "> 0.30", desc: "Biến có đóng góp cho nhóm" }
                                            ]
                                        },
                                        {
                                            step: "03",
                                            name: "Nhân tố khám phá (EFA)",
                                            purpose: "Gom nhóm các câu hỏi vào đúng 'ngăn kéo' lý thuyết.",
                                            indices: [
                                                { label: "KMO", val: "> 0.50", desc: "Dữ liệu đủ điều kiện EFA" },
                                                { label: "Factor Loading", val: "> 0.50", desc: "Biến thuộc về nhân tố đó" }
                                            ]
                                        },
                                        {
                                            step: "04",
                                            name: "Nhân tố khẳng định (CFA)",
                                            purpose: "Khẳng định mô hình đo lường đạt độ hội tụ và phân biệt.",
                                            indices: [
                                                { label: "CFI / TLI", val: "> 0.90", desc: "Mô hình phù hợp tốt" },
                                                { label: "RMSEA", val: "< 0.08", desc: "Sai số trong mức cho phép" }
                                            ]
                                        },
                                        {
                                            step: "05",
                                            name: "Mô hình cấu trúc (SEM)",
                                            purpose: "Kết luận các giả thuyết H1, H2... là Đúng hay Sai.",
                                            indices: [
                                                { label: "P-Value", val: "< 0.05", desc: "Có ý nghĩa thống kê" },
                                                { label: "R-Square", val: "0.2 - 0.7", desc: "Mức độ giải thích mô hình" }
                                            ]
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-8 md:p-12 hover:bg-white/20 transition-all group">
                                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                                <div className="w-16 h-16 rounded-2xl bg-white text-indigo-600 flex items-center justify-center text-2xl font-black flex-shrink-0 shadow-lg">
                                                    {item.step}
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="text-2xl font-black mb-3">{item.name}</h4>
                                                    <p className="text-indigo-100 mb-8 font-medium italic opacity-80">{item.purpose}</p>
                                                    
                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        {item.indices.map((idx_item, iidx) => (
                                                            <div key={iidx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                                                                <div>
                                                                    <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">{idx_item.label}</p>
                                                                    <p className="text-[11px] text-white/60">{idx_item.desc}</p>
                                                                </div>
                                                                <div className="text-lg font-black text-white">{idx_item.val}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Reporting Tips */}
                    <div className="bg-slate-900 p-12 md:p-16 rounded-[4rem] text-white relative overflow-hidden shadow-2xl mb-24">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                            <FileText className="w-80 h-80" />
                        </div>
                        <div className="relative z-10 max-w-3xl">
                            <h3 className="text-3xl font-extrabold mb-12 flex items-center gap-4 italic text-indigo-400 tracking-tight">
                                <GraduationCap className="w-10 h-10" />
                                {t(locale, 'docs.casestudy_content.tips.title')}
                            </h3>
                            <div className="space-y-10">
                                <div className="flex gap-8 group">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                                    <p className="text-slate-400 leading-relaxed text-base font-light group-hover:text-white transition-colors">
                                        {t(locale, 'docs.casestudy_content.tips.tip1')}
                                    </p>
                                </div>
                                <div className="flex gap-8 group">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                                    <p className="text-slate-400 leading-relaxed text-base font-light group-hover:text-white transition-colors">
                                        {t(locale, 'docs.casestudy_content.tips.tip2')}
                                    </p>
                                </div>
                                <div className="flex gap-8 group">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                                    <p className="text-slate-400 leading-relaxed text-base font-light group-hover:text-white transition-colors">
                                        {t(locale, 'docs.casestudy_content.tips.tip3')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Multi-Disciplinary Scenarios */}
                    <div className="space-y-12">
                        <div className="text-center">
                            <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Kịch bản Đa chuyên ngành</h3>
                            <p className="text-slate-500 font-light">Mẫu báo cáo và quy trình cho các lĩnh vực nghiên cứu khác</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            {['digital', 'marketing', 'tourism', 'economics'].map((key) => (
                                <div key={key} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="px-3 py-1 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            {t(locale, `docs.casestudy_content.scenarios.${key}.name`)}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                            <FileText className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-3 leading-snug">{t(locale, `docs.casestudy_content.scenarios.${key}.title`)}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed font-light mb-6">
                                        {t(locale, `docs.casestudy_content.scenarios.${key}.desc`)}
                                    </p>
                                    <div className="flex items-center justify-between mt-6">
                                        <button className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
                                            Xem chi tiết <GitCompare className="w-3 h-3" />
                                        </button>
                                        <button 
                                            onClick={() => router.push('/analyze?sample=true')}
                                            className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-colors"
                                        >
                                            Thực hành ngay
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
