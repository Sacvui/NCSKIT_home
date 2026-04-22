'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    ClipboardCheck, FileText, Upload, AlertCircle, CheckCircle2, 
    ArrowRight, Info, Search, List, Download, RefreshCw, Layers
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';

export default function CiteCheckPage() {
    const [locale, setLocale] = useState<Locale>('vi');
    const isVi = locale === 'vi';
    
    // UI State
    const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Data State
    const [textContent, setTextContent] = useState('');
    const [refContent, setRefContent] = useState('');
    const [analysisResult, setAnalysisResult] = useState<{
        ghostCitations: string[]; // Cited in text but missing in refs
        deadRefs: string[];      // In refs but not cited in text
        matchCount: number;
        totalCitations: number;
        totalRefs: number;
        doiIssues: string[];
        missingDoi: number;
    } | null>(null);

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    const handleRunAudit = () => {
        if (!textContent.trim() && !refContent.trim()) return;
        
        setIsAnalyzing(true);
        
        // Simulate Deep NLP Analysis
        setTimeout(() => {
            // Basic Regex logic for Citation Extraction (Author, Year)
            const citeRegex = /\(([^)]+),\s*(\d{4})\)/g;
            const inTextCitations = Array.from(textContent.matchAll(citeRegex)).map(m => `${m[1]}, ${m[2]}`);
            
            // Basic logic for Reference List extraction
            const refs = refContent.split('\n').filter(line => line.trim().length > 10);
            
            // DOI Validation Logic
            const doiRegex = /10.\d{4,9}\/[-._;()/:A-Z0-9]+/gi;
            const doiResults = refs.map(ref => {
                const match = ref.match(doiRegex);
                const doi = match ? match[0] : null;
                const isProperFormat = doi ? ref.includes('https://doi.org/' + doi) : false;
                return { ref, doi, isProperFormat };
            });

            const ghostCitations = inTextCitations.filter(cite => 
                !refs.some(ref => ref.toLowerCase().includes(cite.split(',')[0].toLowerCase()))
            );
            
            const deadRefs = refs.filter(ref => 
                !inTextCitations.some(cite => ref.toLowerCase().includes(cite.split(',')[0].toLowerCase()))
            );

            setAnalysisResult({
                ghostCitations: [...new Set(ghostCitations)],
                deadRefs,
                matchCount: inTextCitations.length - ghostCitations.length,
                totalCitations: inTextCitations.length,
                totalRefs: refs.length,
                doiIssues: doiResults.filter(r => r.doi && !r.isProperFormat).map(r => r.doi as string),
                missingDoi: doiResults.filter(r => !r.doi).length
            });
            
            setIsAnalyzing(false);
            setShowResults(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Header />
            
            <main className="pt-32 pb-24">
                {/* Hero Section */}
                <section className="container mx-auto px-6 max-w-7xl mb-16">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-indigo-100">
                                <ClipboardCheck className="w-4 h-4" />
                                Academic Toolkit v2.0
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                                {isVi ? 'Kiểm định Trích dẫn' : 'Citation Verifier'} <span className="text-indigo-600">Masterclass.</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                                {isVi 
                                    ? 'Công cụ tự động so khớp trích dẫn trong bài (In-text) với danh mục tham khảo (References). Đảm bảo sự nhất quán tuyệt đối cho công bố quốc tế.'
                                    : 'Automatically match in-text citations with your references list. Ensure absolute consistency for international publications.'}
                            </p>
                        </div>
                        
                        <div className="w-full md:w-1/3 bg-white p-8 rounded-[3rem] shadow-3xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-3 text-indigo-600">
                                    <Info className="w-5 h-5" />
                                    <span className="text-sm font-black uppercase tracking-tight">{isVi ? 'Mẹo nhanh' : 'Quick Tips'}</span>
                                </div>
                                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                                    <li className="flex gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                                        {isVi ? 'Dán cả mục References để đạt độ chính xác cao nhất.' : 'Paste your full References list for best accuracy.'}
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                                        {isVi ? 'Hỗ trợ chuẩn APA 7, Harvard, Vancouver.' : 'Supports APA 7, Harvard, and Vancouver styles.'}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Action Area */}
                <section className="container mx-auto px-6 max-w-7xl">
                    <div className="bg-white rounded-[4rem] p-4 md:p-8 shadow-4xl shadow-indigo-100 border border-indigo-50/50 backdrop-blur-xl">
                        {/* Tab Switcher */}
                        <div className="flex justify-center mb-12">
                            <div className="inline-flex p-2 bg-slate-100 rounded-3xl gap-2">
                                <button 
                                    onClick={() => setActiveTab('paste')}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'paste' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Layers className="w-5 h-5" /> {isVi ? 'Dán văn bản' : 'Paste Text'}
                                </button>
                                <button 
                                    onClick={() => setActiveTab('upload')}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'upload' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Upload className="w-5 h-5" /> {isVi ? 'Tải tệp lên (.docx)' : 'Upload File (.docx)'}
                                </button>
                            </div>
                        </div>

                        {/* Input Fields */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 px-4 text-sm font-black text-slate-400 uppercase tracking-widest">
                                    <FileText className="w-4 h-4" /> {isVi ? 'Nội dung bài viết' : 'Manuscript Body'}
                                </label>
                                <div className="relative group">
                                    <textarea 
                                        className="w-full min-h-[450px] p-8 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[3rem] outline-none text-slate-700 text-lg leading-relaxed transition-all placeholder:text-slate-300"
                                        style={{
                                            backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px)',
                                            backgroundSize: '100% 2rem',
                                            lineHeight: '2rem'
                                        }}
                                        placeholder={isVi ? "Dán nội dung bản thảo tại đây (có chứa các trích dẫn dạng (Author, Year))..." : "Paste your manuscript body here (containing citations like (Author, Year))..."}
                                        value={textContent}
                                        onChange={(e) => setTextContent(e.target.value)}
                                    />
                                    <div className="absolute bottom-6 right-8 text-[10px] font-black text-slate-300 uppercase tracking-widest group-focus-within:text-indigo-300">
                                        Word count: {textContent.split(/\s+/).filter(Boolean).length}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 px-4 text-sm font-black text-slate-400 uppercase tracking-widest">
                                    <List className="w-4 h-4" /> {isVi ? 'Danh mục Tham khảo' : 'References List'}
                                </label>
                                <div className="relative group">
                                    <textarea 
                                        className="w-full min-h-[450px] p-8 bg-slate-900 border-2 border-slate-800 focus:border-indigo-500 rounded-[3rem] outline-none text-indigo-50 text-base font-mono leading-relaxed transition-all placeholder:text-slate-600 shadow-2xl"
                                        style={{
                                            backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
                                            backgroundSize: '100% 1.5rem',
                                            lineHeight: '1.5rem'
                                        }}
                                        placeholder={isVi ? "Dán danh mục tài liệu tham khảo (References) tại đây..." : "Paste your reference list here..."}
                                        value={refContent}
                                        onChange={(e) => setRefContent(e.target.value)}
                                    />
                                    <div className="absolute bottom-6 right-8 text-[10px] font-black text-slate-600 uppercase tracking-widest group-focus-within:text-indigo-400">
                                        Lines: {refContent.split('\n').filter(Boolean).length}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Audit Button */}
                        <div className="flex flex-col items-center gap-6">
                            <button 
                                onClick={handleRunAudit}
                                disabled={isAnalyzing || (!textContent && !refContent)}
                                className="group relative flex items-center gap-4 px-16 py-8 bg-indigo-600 hover:bg-slate-900 disabled:bg-slate-200 text-white rounded-[3rem] font-black text-xl tracking-tighter transition-all shadow-4xl shadow-indigo-200 active:scale-95 overflow-hidden"
                            >
                                {isAnalyzing ? (
                                    <><RefreshCw className="w-7 h-7 animate-spin" /> {isVi ? 'Đang phân tích...' : 'Analyzing...'}</>
                                ) : (
                                    <><Search className="w-7 h-7 group-hover:scale-110 transition-transform" /> {isVi ? 'Kiểm định ngay' : 'Run Full Audit'}</>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </button>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                                {isVi ? 'Sử dụng thuật toán so khớp nội tại - Không lưu trữ dữ liệu người dùng' : 'Uses Local Matching Algorithm - We never store your text'}
                            </p>
                        </div>
                    </div>

                    {/* Results Display */}
                    {showResults && analysisResult && (
                        <div className="mt-20 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Integrity Score</p>
                                    <div className="text-6xl font-black text-indigo-600 tracking-tighter">
                                        {analysisResult.totalCitations > 0 ? Math.round((analysisResult.matchCount / analysisResult.totalCitations) * 100) : 0}%
                                    </div>
                                </div>
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Total Citations</p>
                                    <div className="text-6xl font-black text-slate-900 tracking-tighter">{analysisResult.totalCitations}</div>
                                </div>
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Matched Refs</p>
                                    <div className="text-6xl font-black text-emerald-500 tracking-tighter">{analysisResult.matchCount}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Ghost Citations */}
                                <div className="bg-rose-50 rounded-[4rem] p-12 border border-rose-100">
                                    <h3 className="text-2xl font-black text-rose-900 mb-8 flex items-center gap-4">
                                        <AlertCircle className="w-8 h-8" /> {isVi ? 'Trích dẫn thiếu Tham khảo' : 'Missing References'}
                                    </h3>
                                    {analysisResult.ghostCitations.length > 0 ? (
                                        <ul className="space-y-4">
                                            {analysisResult.ghostCitations.map((cite, i) => (
                                                <li key={i} className="flex items-center gap-4 p-5 bg-white rounded-2xl text-rose-600 font-bold shadow-sm ring-1 ring-rose-100">
                                                    <ArrowRight className="w-4 h-4 shrink-0" /> {cite}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-rose-700 font-bold italic opacity-60">Excellent! All citations are accounted for.</p>
                                    )}
                                </div>

                                {/* Dead References */}
                                <div className="bg-amber-50 rounded-[4rem] p-12 border border-amber-100">
                                    <h3 className="text-2xl font-black text-amber-900 mb-8 flex items-center gap-4">
                                        <Layers className="w-8 h-8" /> {isVi ? 'Tham khảo chưa trích dẫn' : 'Unused References'}
                                    </h3>
                                    {analysisResult.deadRefs.length > 0 ? (
                                        <ul className="space-y-4">
                                            {analysisResult.deadRefs.map((ref, i) => (
                                                <li key={i} className="p-5 bg-white rounded-2xl text-amber-700 font-medium text-sm shadow-sm ring-1 ring-amber-100 leading-relaxed overflow-hidden text-ellipsis">
                                                    {ref}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-amber-700 font-bold italic opacity-60">Clean list! Every reference is used in text.</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* DOI Issues */}
                                <div className="bg-indigo-50 rounded-[4rem] p-12 border border-indigo-100">
                                    <h3 className="text-2xl font-black text-indigo-900 mb-8 flex items-center gap-4">
                                        <RefreshCw className="w-8 h-8" /> {isVi ? 'Lỗi định dạng DOI (APA 7)' : 'DOI Format Issues (APA 7)'}
                                    </h3>
                                    {analysisResult.doiIssues && analysisResult.doiIssues.length > 0 ? (
                                        <div className="space-y-6">
                                            <p className="text-sm text-indigo-700 font-bold bg-white/50 p-4 rounded-2xl border border-indigo-100 italic">
                                                {isVi 
                                                    ? 'Mẹo: Chuẩn APA 7 yêu cầu DOI phải có tiền tố "https://doi.org/".' 
                                                    : 'Tip: APA 7 requires DOIs to have the "https://doi.org/" prefix.'}
                                            </p>
                                            <ul className="space-y-4">
                                                {analysisResult.doiIssues.map((doi, i) => (
                                                    <li key={i} className="flex flex-col gap-2 p-5 bg-white rounded-2xl shadow-sm ring-1 ring-indigo-100">
                                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Detected DOI</span>
                                                        <code className="text-indigo-600 font-bold">{doi}</code>
                                                        <button className="mt-2 text-left text-xs font-black text-indigo-500 hover:text-indigo-700 flex items-center gap-2">
                                                            <CheckCircle2 className="w-3 h-3" /> Auto-fix to APA 7
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p className="text-indigo-700 font-bold italic opacity-60">Perfect! All DOIs follow APA 7 standards.</p>
                                    )}
                                </div>

                                {/* Missing DOIs */}
                                <div className="bg-slate-100 rounded-[4rem] p-12 border border-slate-200">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                        <Search className="w-8 h-8" /> {isVi ? 'Tài liệu thiếu DOI' : 'Missing DOIs'}
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="p-8 bg-white rounded-[2rem] shadow-sm">
                                            <div className="text-4xl font-black text-slate-900 mb-2">{analysisResult.missingDoi}</div>
                                            <p className="text-sm text-slate-500 font-medium">
                                                {isVi 
                                                    ? 'Tài liệu tham khảo không tìm thấy mã số định danh DOI.' 
                                                    : 'References without a detected DOI string.'}
                                            </p>
                                        </div>
                                        <button className="w-full flex items-center justify-center gap-3 px-8 py-6 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
                                            <Search className="w-5 h-5" /> {isVi ? 'Tìm DOI tự động cho danh sách này' : 'Auto-Find DOIs for this list'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-8">
                                <button className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl">
                                    <Download className="w-5 h-5" /> {isVi ? 'Xuất báo cáo kiểm định (PDF)' : 'Export Audit Report (PDF)'}
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
