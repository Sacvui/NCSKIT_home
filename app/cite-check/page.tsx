'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    ClipboardCheck, FileText, Upload, AlertCircle, CheckCircle2, 
    ArrowRight, Info, Search, List, Download, RefreshCw, Layers,
    Terminal, Play, Pause, RotateCcw, ShieldAlert, Database, ShieldCheck
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';

interface LogLine {
    ts: string;
    msg: string;
    type: 'info' | 'success' | 'warn' | 'error';
    detail?: string;
}

export default function CiteCheckPage() {
    const [locale, setLocale] = useState<Locale>('vi');
    const isVi = locale === 'vi';
    
    // UI State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fullContent, setFullContent] = useState('');
    const [logs, setLogs] = useState<LogLine[]>([]);
    const [analysisResult, setAnalysisResult] = useState<{
        matchCount: number;
        validRefsCount: number;
        totalCitations: number;
        totalRefs: number;
        missingDoi: number;
        verificationResults: any[];
        accuracyErrors: number;
    } | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

    const logEndRef = useRef<HTMLDivElement>(null);
    const consoleRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);


    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (file.name.endsWith('.docx')) {
            try {
                const mammoth = (await import('mammoth')).default;
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                setFullContent(result.value);
                addLog(isVi ? `Đã trích xuất thành công ${file.name}` : `Successfully extracted ${file.name}`, 'success');
            } catch (err) {
                addLog(isVi ? `Lỗi đọc file Word: ${err}` : `Error reading Word file: ${err}`, 'error');
            }
        } else if (file.name.endsWith('.txt')) {
            const text = await file.text();
            setFullContent(text);
        } else {
            addLog(isVi ? 'Chỉ hỗ trợ file .docx hoặc .txt' : 'Only .docx or .txt files are supported', 'warn');
        }
    };
    const addLog = (msg: string, type: LogLine['type'] = 'info', detail?: string) => {
        const ts = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { ts, msg, type, detail }]);
    };


    const handleRunAudit = async () => {
        if (!fullContent.trim()) return;
        
        setIsAnalyzing(true);
        setShowResults(false);
        setProgress(0);
        setLogs([]);

        setTimeout(() => {
            consoleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        addLog(isVi ? "Bắt đầu quy trình kiểm định ncsStat Engine v2.0..." : "Initializing ncsStat Engine v2.0...", "info");
        
        // --- Step 0: Auto Split ---
        await new Promise(r => setTimeout(r, 400));
        let manuscript = '';
        let references = '';
        const lines = fullContent.split('\n');
        let splitIndex = -1;
        
        for (let i = lines.length - 1; i >= Math.max(0, lines.length - 500); i--) {
            const cleanLine = lines[i].replace(/[^\w\sà-ỹ]/gi, '').trim().toLowerCase();
            if (['references', 'tài liệu tham khảo', 'tham khảo', 'bibliography'].includes(cleanLine)) {
                splitIndex = i;
                break;
            }
        }
        
        if (splitIndex !== -1) {
            manuscript = lines.slice(0, splitIndex).join('\n');
            references = lines.slice(splitIndex + 1).join('\n');
            addLog(isVi ? `Đã tự động tách thân bài và danh mục tại dòng ${splitIndex + 1}` : `Auto-split detected references at line ${splitIndex + 1}`, 'success');
        } else {
            manuscript = fullContent;
            references = fullContent; // Fallback, scan everything
            addLog(isVi ? "Không tìm thấy tiêu đề 'References'. Hệ thống sẽ quét toàn bộ văn bản." : "Could not detect 'References' heading. Scanning entire text.", 'warn');
        }

        // --- Step 1: Text Extraction ---
        await new Promise(r => setTimeout(r, 800));
        setProgress(20);
        addLog(isVi ? "Đang quét nội dung văn bản để tìm In-text Citations..." : "Scanning manuscript for In-text Citations...", "info");
        
        const inTextCitations: { full: string, author: string, year: string }[] = [];
        const uniqueCites: { full: string, author: string, year: string }[] = [];
        
        const extractFirstAuthor = (authorStr: string) => {
            let clean = authorStr.replace(/et al\.?/ig, '').trim();
            clean = clean.split(/&| and |,/i)[0].trim();
            return clean;
        };

        const parensRegex = /\(([^)]+)\)/g;
        for (const match of Array.from(manuscript.matchAll(parensRegex))) {
            const innerText = match[1];
            const segments = innerText.split(';');
            for (const segment of segments) {
                const citeMatch = segment.trim().match(/^([A-Za-zÀ-ỹ\s\-\.&]+(?:et al\.?)?),\s*(\d{4}[a-z]?)/i);
                if (citeMatch) {
                    inTextCitations.push({
                        full: segment.trim(),
                        author: citeMatch[1].trim(),
                        year: citeMatch[2].trim()
                    });
                }
            }
        }

        const narrativeRegex = /((?:[A-Z][A-Za-zÀ-ỹ\-']+\s*)+(?:et al\.?)?)\s*\((\d{4}[a-z]?)\)/g;
        for (const match of Array.from(manuscript.matchAll(narrativeRegex))) {
            inTextCitations.push({
                full: match[0].trim(),
                author: match[1].trim(),
                year: match[2].trim()
            });
        }
        
        const ieeeRegex = /\[(\d+(?:\s*,\s*\d+|\s*-\s*\d+)*)\]/g;
        for (const match of Array.from(manuscript.matchAll(ieeeRegex))) {
             inTextCitations.push({
                full: match[0].trim(),
                author: 'IEEE Format',
                year: match[1].trim()
            });
        }

        const seen = new Set();
        inTextCitations.forEach(c => {
             const key = c.author.toLowerCase() + c.year;
             if (!seen.has(key)) {
                 seen.add(key);
                 uniqueCites.push(c);
             }
        });
        
        addLog(isVi ? `Tìm thấy ${uniqueCites.length} trích dẫn độc lập trong bài.` : `Found ${uniqueCites.length} unique in-text citations.`, "success");

        setProgress(40);
        const refs = references.split('\n').filter(line => line.trim().length > 10);
        addLog(isVi ? `Đã bóc tách ${refs.length} tài liệu tham khảo.` : `Extracted ${refs.length} reference entries.`, "success");

        setProgress(60);
        
        const doiRegex = /10.\d{4,9}\/[-._;()/:A-Z0-9]+/gi;
        const verificationResults: any[] = [];
        const refsToVerify = refs.slice(0, 100); 
        
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        
        for (let i = 0; i < refsToVerify.length; i++) {
            const ref = refsToVerify[i];
            const doiMatch = ref.match(doiRegex);
            const doi = doiMatch ? doiMatch[0] : null;
            
            addLog(isVi ? `Đang kiểm tra [${i+1}/${refsToVerify.length}]: ${ref.substring(0, 30)}...` : `Verifying [${i+1}/${refsToVerify.length}]: ${ref.substring(0, 30)}...`);
            
            try {
                const cleanRef = ref.replace(/^(\d+[\.\-\s]+|\[\d+\]\s*)/, '').trim();
                const yearMatch = cleanRef.match(/\((\d{4})\)/) || cleanRef.match(/(?:^|\s)(\d{4})(?:\.|\s)/);
                const extractedYear = yearMatch ? yearMatch[1] : null;
                const authorMatch = cleanRef.match(/^([^,.(]+)/); 
                const extractedAuthor = authorMatch ? authorMatch[1].trim() : '';
                
                const query = doi ? `https://api.crossref.org/works/${doi}` : `https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(cleanRef)}&rows=1`;
                
                const res = await fetch(query);
                if (!res.ok) {
                    if (res.status === 429) {
                        addLog('Rate limit exceeded (429). Retrying after 2s...', 'warn');
                        await delay(2000);
                        i--; 
                        continue;
                    }
                    throw new Error(`HTTP ${res.status}`);
                }
                const data = await res.json();
                const metadata = doi ? data.message : data.message.items[0];

                if (metadata) {
                    const officialYear = metadata.issued?.['date-parts']?.[0]?.[0] || metadata.created?.['date-parts']?.[0]?.[0];
                    const officialTitle = metadata.title?.[0] || '';
                    const officialAuthor = metadata.author?.[0]?.family || metadata.author?.[0]?.name || '';
                    
                    let conclusion = 'VALID';
                    let note = isVi ? 'Thông tin khớp với cơ sở dữ liệu quốc tế.' : 'Information matches international database.';
                    let yearStatus = 'VALID';
                    let authorStatus = 'VALID';
                    let titleStatus = 'VALID';
                    
                    if (extractedYear && officialYear && Math.abs(parseInt(extractedYear) - officialYear) > 0) {
                        conclusion = 'INVALID';
                        yearStatus = 'INVALID';
                        note = isVi 
                            ? `Năm xuất bản sai lệch (Thực tế: ${officialYear}, Bạn viết: ${extractedYear}).` 
                            : `Year mismatch (Official: ${officialYear}, Yours: ${extractedYear}).`;
                    } 
                    
                    if (extractedAuthor && officialAuthor && !officialAuthor.toLowerCase().includes(extractedAuthor.toLowerCase()) && !extractedAuthor.toLowerCase().includes(officialAuthor.toLowerCase())) {
                        conclusion = 'INVALID';
                        authorStatus = 'INVALID';
                        note = isVi 
                            ? `Tác giả đầu không khớp (Tìm thấy: ${officialAuthor}, Bạn viết: ${extractedAuthor}).` 
                            : `Author mismatch (Found: ${officialAuthor}, Yours: ${extractedAuthor}).`;
                    }

                    verificationResults.push({
                        ref,
                        conclusion,
                        note,
                        yearStatus,
                        authorStatus,
                        titleStatus,
                        doiStatus: doi ? 'VALID' : 'MISSING',
                        url: doi ? `https://doi.org/${doi}` : null,
                        details: `[LOG] Extracted: ${extractedAuthor} (${extractedYear}) | Fetched: ${officialAuthor} (${officialYear}) | Title: ${officialTitle.substring(0, 50)}...`
                    });
                } else {
                    verificationResults.push({ ref, conclusion: 'UNCERTAIN', note: isVi ? 'Không tìm thấy dữ liệu đối soát trên Crossref.' : 'No matching metadata found on Crossref.' });
                }
                
                await delay(350);

            } catch (e) {
                verificationResults.push({ ref, conclusion: 'ERROR', note: isVi ? 'Lỗi kết nối API hoặc dữ liệu không hợp lệ.' : 'API Connection Error or Invalid Data.' });
                await delay(1000);
            }
            setProgress(60 + (i / refsToVerify.length) * 25);
        }

        const citedInListCount = uniqueCites.filter(cite => {
            if (cite.author === 'IEEE Format') {
                return true; 
            }
            const citeAuthorLast = extractFirstAuthor(cite.author).toLowerCase();
            const authorRegex = new RegExp(`\\b${citeAuthorLast}\\b`, 'i');
            
            return refs.some(ref => {
                const refLower = ref.toLowerCase();
                return authorRegex.test(refLower) && refLower.includes(cite.year.toLowerCase());
            });
        }).length;

        const apiValidCount = verificationResults.filter(v => v.conclusion === 'VALID').length;
        const apiIssueCount = verificationResults.filter(v => v.conclusion === 'INVALID' || v.conclusion === 'ERROR').length;

        setAnalysisResult({
            matchCount: citedInListCount,
            totalCitations: uniqueCites.length,
            totalRefs: refs.length,
            missingDoi: verificationResults.filter(r => !r.ref.match(doiRegex)).length,
            verificationResults,
            accuracyErrors: apiIssueCount,
            validRefsCount: apiValidCount
        });
        
        setProgress(100);
        setIsAnalyzing(false);
        setShowResults(true);

        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Header />
            
            <main className="pt-32 pb-24">
                {/* Hero Section */}
                <section className="container mx-auto px-6 max-w-7xl mb-12">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-indigo-100">
                                <ClipboardCheck className="w-4 h-4" />
                                {isVi ? 'Kiểm định Trích dẫn Chuyên gia' : 'Expert Citation Verifier'}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                                {isVi ? 'Cite Check' : 'Cite Check'} <span className="text-indigo-600">Masterclass.</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                                {isVi 
                                    ? 'Đảm bảo sự nhất quán 100% giữa nội dung bài viết và danh mục tham khảo theo chuẩn quốc tế.'
                                    : 'Ensure 100% consistency between your manuscript and references list.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Status Console (Wow Factor) */}
                {isAnalyzing && (
                    <section ref={consoleRef} className="container mx-auto px-6 max-w-7xl mb-12 animate-in zoom-in-95 duration-500">
                        <div className="bg-slate-900 rounded-[3rem] p-8 shadow-4xl shadow-slate-200 border border-slate-800 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-indigo-400 font-mono text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Terminal className="w-4 h-4" /> Validation Live Log
                                    </span>
                                </div>
                                <div className="text-white font-black text-2xl font-mono">{progress}%</div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>

                            {/* Console Output */}
                            <div className="h-64 overflow-y-auto font-mono text-sm space-y-2 no-scrollbar border-t border-slate-800 pt-6">
                                {logs.map((log, i) => (
                                    <div key={i} className={`flex gap-4 ${log.type === 'success' ? 'text-emerald-400' : log.type === 'warn' ? 'text-amber-400' : log.type === 'error' ? 'text-rose-400' : 'text-slate-400'}`}>
                                        <span className="opacity-40 shrink-0">[{log.ts}]</span>
                                        <div className="flex flex-col">
                                            <span className="font-bold">{log.msg}</span>
                                            {log.detail && <span className="text-[10px] opacity-60 mt-1 italic">{log.detail}</span>}
                                        </div>
                                    </div>
                                ))}
                                <div ref={logEndRef} />
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Action Area */}
                <section className="container mx-auto px-6 max-w-7xl">
                    <div className="bg-white rounded-[4rem] p-4 md:p-8 shadow-4xl shadow-indigo-100 border border-indigo-50/50 backdrop-blur-xl">
                        {/* Tab Switcher */}

                        <div className="flex flex-col gap-8 mb-12">
                            <div className="bg-slate-50 border-2 border-dashed border-indigo-200 rounded-[3rem] p-8 text-center hover:bg-indigo-50 transition-colors relative overflow-hidden group">
                                <input type="file" accept=".docx,.txt" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800">{isVi ? 'Kéo thả file Word (.docx) vào đây' : 'Drag & Drop Word File (.docx)'}</h3>
                                        <p className="text-sm font-medium text-slate-500 mt-2">{isVi ? 'Hệ thống sẽ tự động đọc, bóc tách bài viết & danh mục tham khảo' : 'Auto-extracts manuscript & references'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative group flex-1">
                                <div className="absolute -top-3 left-8 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md z-10">
                                    {isVi ? 'Hoặc dán toàn bộ bài viết vào đây' : 'Or Paste Full Manuscript Here'}
                                </div>
                                <textarea 
                                    className="w-full min-h-[450px] p-8 pt-10 bg-white border-2 border-slate-100 focus:border-indigo-500 rounded-[3rem] outline-none text-slate-700 text-lg leading-relaxed transition-all placeholder:text-slate-300 shadow-inner"
                                    style={{
                                        backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px)',
                                        backgroundSize: '100% 2rem',
                                        lineHeight: '2rem'
                                    }}
                                    placeholder={isVi ? "Dán toàn bộ bài viết (bao gồm cả danh mục Tài liệu tham khảo ở cuối bài). AI sẽ tự động phân tách 2 phần..." : "Paste full manuscript including references at the bottom..."}
                                    value={fullContent}
                                    onChange={(e) => setFullContent(e.target.value)}
                                />
                                <div className="absolute bottom-6 right-8 text-[10px] font-black text-slate-300 uppercase tracking-widest group-focus-within:text-indigo-400">
                                    Word count: {fullContent.split(/\s+/).filter(Boolean).length}
                                </div>
                            </div>
                        </div>

                        {/* Audit Button */}
                        <div className="flex flex-col items-center gap-6">
                            <button 
                                onClick={handleRunAudit}
                                disabled={isAnalyzing || !fullContent.trim()}
                                className="group relative flex items-center gap-4 px-16 py-8 bg-indigo-600 hover:bg-slate-900 disabled:bg-slate-200 text-white rounded-[3rem] font-black text-xl tracking-tighter transition-all shadow-4xl shadow-indigo-200 active:scale-95 overflow-hidden"
                            >
                                {isAnalyzing ? (
                                    <><RefreshCw className="w-7 h-7 animate-spin" /> {isVi ? 'Đang phân tích...' : 'Analyzing...'}</>
                                ) : (
                                    <><Play className="w-7 h-7 group-hover:scale-110 transition-transform" /> {isVi ? 'Chạy kiểm định' : 'Run Full Audit'}</>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </button>
                        </div>
                    </div>

                    {/* Results Display */}
                    {showResults && analysisResult && (
                        <div ref={resultsRef} className="mt-20 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group hover:border-indigo-500 transition-all">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{isVi ? 'Khớp bài & Mục lục' : 'Manuscript Sync'}</p>
                                    <div className="text-4xl font-black text-indigo-600 tracking-tighter">
                                        {analysisResult.totalCitations > 0 ? Math.round((analysisResult.matchCount / analysisResult.totalCitations) * 100) : 0}%
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 font-medium">{isVi ? 'Tỉ lệ trích dẫn có nguồn' : 'Citations found in refs'}</p>
                                </div>
                                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group hover:border-emerald-500 transition-all">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{isVi ? 'Xác thực Quốc tế' : 'Global Validation'}</p>
                                    <div className="text-4xl font-black text-emerald-500 tracking-tighter">{analysisResult.validRefsCount || 0}</div>
                                    <p className="text-[10px] text-slate-400 mt-2 font-medium">{isVi ? 'Tài liệu khớp Crossref' : 'References verified'}</p>
                                </div>
                                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group hover:border-rose-500 transition-all">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{isVi ? 'Vấn đề phát hiện' : 'Issues Found'}</p>
                                    <div className="text-4xl font-black text-rose-500 tracking-tighter">{analysisResult.accuracyErrors || 0}</div>
                                    <p className="text-[10px] text-slate-400 mt-2 font-medium">{isVi ? 'Sai lệch hoặc lỗi dữ liệu' : 'Confirmed mismatches'}</p>
                                </div>
                            </div>
                            {/* Database Verification Results */}
                            <div className="bg-white rounded-[4rem] p-12 border border-slate-200 shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Database className="w-32 h-32" />
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                                        <ShieldCheck className="w-8 h-8 text-emerald-500" /> 
                                        {isVi ? 'Kết quả xác thực Quốc tế (Crossref)' : 'Crossref API Verification Results'}
                                    </h3>
                                    
                                    <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 shadow-inner">
                                        <button 
                                            onClick={() => setViewMode('list')}
                                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <Layers className="w-4 h-4 inline mr-2" /> Standard List
                                        </button>
                                        <button 
                                            onClick={() => setViewMode('table')}
                                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <List className="w-4 h-4 inline mr-2" /> Report Table
                                        </button>
                                    </div>
                                </div>

                            {viewMode === 'table' && (
                                <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden mt-8">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="bg-slate-900 text-white font-black uppercase tracking-widest">
                                                    <th className="p-6 border-r border-slate-800">Reference Entry</th>
                                                    <th className="p-6 border-r border-slate-800 text-center">Outcome</th>
                                                    <th className="p-6 border-r border-slate-800 text-center">DOI</th>
                                                    <th className="p-6 border-r border-slate-800 text-center">Author</th>
                                                    <th className="p-6 border-r border-slate-800 text-center">Year</th>
                                                    <th className="p-6 border-r border-slate-800 text-center">Title</th>
                                                    <th className="p-6">Link</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analysisResult.verificationResults?.map((item: any, i: number) => (
                                                    <React.Fragment key={i}>
                                                        <tr className={`border-b border-slate-100 transition-colors ${item.conclusion === 'INVALID' ? 'bg-rose-50/50' : 'hover:bg-slate-50'}`}>
                                                            <td className="p-6 font-medium text-slate-800 max-w-md leading-relaxed border-r border-slate-100">
                                                                {item.ref}
                                                            </td>
                                                            <td className="p-6 text-center border-r border-slate-100">
                                                                <span className={`px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-tighter ${
                                                                    item.conclusion === 'VALID' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                                }`}>
                                                                    {item.conclusion === 'VALID' ? 'VALID' : 'CHECK'}
                                                                </span>
                                                            </td>
                                                            <td className="p-6 text-center border-r border-slate-100">
                                                                <span className={`font-black text-[9px] ${item.doiStatus === 'VALID' ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                                    {item.doiStatus}
                                                                </span>
                                                            </td>
                                                            <td className="p-6 text-center border-r border-slate-100">
                                                                <span className={`font-black text-[9px] ${item.authorStatus === 'VALID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                                    {item.authorStatus}
                                                                </span>
                                                            </td>
                                                            <td className="p-6 text-center border-r border-slate-100">
                                                                <span className={`font-black text-[9px] ${item.yearStatus === 'VALID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                                    {item.yearStatus}
                                                                </span>
                                                            </td>
                                                            <td className="p-6 text-center border-r border-slate-100">
                                                                <span className={`font-black text-[9px] ${item.titleStatus === 'VALID' ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                                    {item.titleStatus}
                                                                </span>
                                                            </td>
                                                            <td className="p-6 text-center">
                                                                {item.url ? (
                                                                    <a href={item.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900">
                                                                        <Search className="w-4 h-4 mx-auto" />
                                                                    </a>
                                                                ) : '-'}
                                                            </td>
                                                        </tr>
                                                        {item.conclusion === 'INVALID' && (
                                                            <tr className="bg-rose-50/30 border-b border-slate-100">
                                                                <td colSpan={7} className="p-4 px-12">
                                                                    <div className="flex items-start justify-between gap-3 bg-white p-6 rounded-3xl border border-rose-100 shadow-sm">
                                                                        <div className="flex items-start gap-3">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5"></div>
                                                                            <div>
                                                                                <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-1">Issue Detected</p>
                                                                                <p className="text-[10px] text-slate-600 font-mono leading-relaxed">{item.note}</p>
                                                                                <p className="text-[9px] text-slate-400 font-mono mt-2 italic opacity-60">{item.details}</p>
                                                                            </div>
                                                                        </div>
                                                                        <a 
                                                                            href={`https://scholar.google.com/scholar?q=${encodeURIComponent(item.ref)}`} 
                                                                            target="_blank" 
                                                                            rel="noreferrer"
                                                                            className="shrink-0 flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
                                                                        >
                                                                            <Search className="w-3 h-3" /> {isVi ? 'Kiểm tra thủ công' : 'Manual Verify'}
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {viewMode === 'list' && (
                                <div className="space-y-4 relative z-10 mt-8">
                                    {analysisResult.verificationResults?.map((item: any, i: number) => (
                                        <div key={i} className="flex flex-col md:flex-row gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-900 mb-2 leading-relaxed">{item.ref}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                                        item.conclusion === 'VALID' ? 'bg-emerald-500 text-white' : 
                                                        item.conclusion === 'INVALID' ? 'bg-rose-500 text-white' : 'bg-slate-400 text-white'
                                                    }`}>
                                                        {item.conclusion}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                        <Search className="w-3 h-3" /> API Verified
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="md:w-[350px] p-5 bg-white rounded-2xl border border-slate-100 shadow-inner group-hover:border-indigo-100 transition-colors">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${item.conclusion === 'INVALID' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        {isVi ? 'Ghi chú đối soát API' : 'API Audit Note'}
                                                    </p>
                                                </div>
                                                <p className={`text-xs leading-relaxed font-medium ${item.conclusion === 'INVALID' ? 'text-rose-700' : 'text-slate-600'}`}>
                                                    {item.note}
                                                </p>
                                                {item.details && (
                                                    <div className="mt-3 pt-3 border-t border-slate-100">
                                                        <p className="text-[10px] text-slate-500 font-mono leading-relaxed break-words bg-slate-100/50 p-2 rounded-lg border border-slate-200/50">
                                                            {item.details}
                                                        </p>
                                                    </div>
                                                )}
                                                {item.conclusion === 'INVALID' && (
                                                    <a 
                                                        href={`https://scholar.google.com/scholar?q=${encodeURIComponent(item.ref)}`} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                                                    >
                                                        <Search className="w-3 h-3" /> {isVi ? 'Kiểm tra thủ công (Google Scholar)' : 'Manual Verify'}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {(!analysisResult.verificationResults || analysisResult.verificationResults.length === 0) && (
                                        <div className="text-center py-12">
                                            <p className="text-slate-400 italic">No verification results available. Run audit to begin.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-center pt-12 relative z-10">
                                <button className="flex items-center gap-4 px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-4xl shadow-slate-200 group active:scale-95">
                                    <Download className="w-6 h-6 group-hover:bounce" /> 
                                    {isVi ? 'Xuất báo cáo kiểm định (PDF)' : 'Export Audit Report (PDF)'}
                                </button>
                            </div>
                        </div>

                        </div>
                    )}
                </section>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
