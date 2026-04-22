'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Search, BookOpen, Clock, ArrowRight, TrendingUp, ShieldCheck, 
    Brain, FileSearch, LineChart, Hash, Zap, HelpCircle, Layers, Activity,
    ArrowLeft, Quote, Sparkles, ExternalLink, Copy, Check,
    CheckCircle2, Info, FileSpreadsheet, ChevronDown, SearchX,
    Target, UserCheck, Settings, Cpu, X, Lock, Users, ListChecks, User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase } from '@/utils/supabase/client';
import { getStoredLocale, type Locale, t } from '@/lib/i18n';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { STATIC_SCALES } from '@/lib/constants/scales-fallbacks';

const supabase = getSupabase();

export default function ScalesLibrary() {
    const router = useRouter();
    const [locale, setLocale] = useState<Locale>('vi');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [expandedScale, setExpandedScale] = useState<string | null>(null);
    const [scales, setScales] = useState<any[]>(STATIC_SCALES);
    const [loading, setLoading] = useState(true);
    const [copiedCitation, setCopiedCitation] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setLocale(getStoredLocale());
        fetchScales();
        
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setExpandedScale(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Debounce search input (300ms)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchScales = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('scales')
                .select('*, scale_items(*)')
                .order('name_en', { ascending: true });
            
            if (data && data.length > 0) {
                // Merge static with DB (preventing duplicates by ID)
                const dbIds = new Set(data.map((s: any) => s.id));
                const uniqueStatic = STATIC_SCALES.filter((s: any) => !dbIds.has(s.id));
                setScales([...data, ...uniqueStatic]);
            } else {
                setScales(STATIC_SCALES);
            }
        } catch (err) {
            console.error('Fetch error - Using Static Fallback:', err);
            setScales(STATIC_SCALES);
        } finally {
            setLoading(false);
        }
    };

    // Category display names mapped to actual DB values
    const categoryMap: Record<string, string[]> = {
        'All': [],
        'Modern Research (2020+)': ['Modern (2020+)'],
        'MIS & Digital': ['MIS'],
        'Innovation & Strategy': ['Innovation'],
        'Marketing': ['Marketing'],
        'Human Resources': ['HR'],
        'Accounting & Finance': ['Accounting'],
        'Economics': ['Economics'],
        'Psychology': ['Psychology'],
        'Tourism & Hospitality': ['Tourism'],
        'Logistics & Supply Chain': ['Logistics'],
    };
    const categories = Object.keys(categoryMap);

    const filteredScales = useMemo(() => scales.filter(scale => {
        const searchText = (scale.name_vi + scale.name_en + scale.description_vi + scale.description_en + (scale.author || '')).toLowerCase();
        const matchesSearch = !debouncedSearch || searchText.includes(debouncedSearch.toLowerCase());
        const dbCategories = categoryMap[selectedCategory];
        const matchesCategory = selectedCategory === 'All' || 
            (dbCategories && dbCategories.some(cat => (scale.category || []).includes(cat)));
        return matchesSearch && matchesCategory;
    }), [scales, debouncedSearch, selectedCategory]);

    // Helpers
    const getCodeRange = useCallback((scale: any) => {
        const items = scale.scale_items;
        if (!items || items.length === 0) return null;
        const first = items[0]?.code;
        const last = items[items.length - 1]?.code;
        return { first, last };
    }, []);

    const getDimensionCount = useCallback((scale: any) => {
        const items = scale.scale_items || [];
        const prefixes = new Set(items.map((i: any) => i.code?.replace(/[0-9]/g, '') || ''));
        return prefixes.size;
    }, []);

    const copyCitation = useCallback((scale: any) => {
        const text = scale.citation || 
            `${scale.author} (${scale.year}). ${scale.name_en}. Scale for Research Purposes.`;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedCitation(true);
            setTimeout(() => setCopiedCitation(false), 2000);
        });
    }, []);

    const isVi = locale === 'vi';
    const activeScale = scales.find(s => s.id === expandedScale);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Header />
            
            <main className="pt-24 md:pt-32 pb-24">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                    {/* Hero Section - Refined for Premium Feel */}
                    <div className="max-w-5xl mx-auto text-center mb-16 md:mb-24 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full mb-6 font-black text-[10px] uppercase tracking-[0.2em] border border-indigo-100 shadow-sm">
                            <Sparkles className="w-3 h-3" />
                            {isVi ? 'Thư viện học thuật' : 'Academic Library'}
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[1.1] md:leading-[0.95]">
                            {isVi ? 'Kho lưu trữ' : 'Measurement'}
                            <span className="text-indigo-600 block">ncsScales.</span>
                        </h1>
                        <p className="text-base md:text-xl text-slate-500 font-medium mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                            {isVi 
                                ? 'Bộ sưu tập thang đo chuẩn hóa, hỗ trợ đắc lực cho các nghiên cứu định lượng chuyên sâu.' 
                                : 'A curated repository of validated scales, powering advanced quantitative research globally.'}
                        </p>
                        
                        {/* Compact Floating Search */}
                        <div className="relative max-w-2xl mx-auto group z-20">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-slate-100/50">
                                <Search className="ml-6 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder={isVi ? "Tìm TAM, SERVQUAL, Job Satisfaction..." : "Search TAM, SERVQUAL, Job Satisfaction..."}
                                    className="w-full px-4 py-5 md:py-7 bg-transparent text-slate-900 font-bold text-base md:text-lg focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="hidden md:flex gap-2 mr-4">
                                    <kbd className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-black text-slate-400">ESC</kbd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- MAIN INTERFACE --- */}
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Sidebar / Category Pills (Improved for Mobile) */}
                        <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-32 z-10">
                            <div className="bg-white/70 backdrop-blur-xl p-2 rounded-[2rem] md:p-6 md:rounded-[2.5rem] border border-slate-200/50 shadow-xl shadow-slate-200/20">
                                <h4 className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6 px-2">
                                    <Layers className="w-3 h-3" />
                                    Categories
                                </h4>
                                
                                <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar gap-1.5 p-1">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`whitespace-nowrap px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 border ${
                                                selectedCategory === cat 
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                                                : 'text-slate-500 bg-white border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <div className="flex-grow w-full">
                                {/* Result Counter */}
                                {!loading && (
                                    <div className="flex items-center justify-between mb-6">
                                        <p className="text-sm font-bold text-slate-400">
                                            {isVi ? 'Hiển thị' : 'Showing'} <span className="text-indigo-600">{filteredScales.length}</span> {isVi ? 'trên' : 'of'} <span className="text-slate-600">{scales.length}</span> {isVi ? 'thang đo' : 'scales'}
                                        </p>
                                        {(debouncedSearch || selectedCategory !== 'All') && (
                                            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                                {isVi ? '✕ Xóa bộ lọc' : '✕ Clear filters'}
                                            </button>
                                        )}
                                    </div>
                                )}
                                                       {loading ? (
                                    <div className="grid md:grid-cols-2 gap-6 animate-pulse">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-64 bg-white rounded-3xl border border-slate-100"></div>
                                        ))}
                                    </div>
                                ) : filteredScales.length === 0 ? (
                                    /* Empty State */
                                    <div className="text-center py-20 px-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                                        <div className="w-20 h-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                                            <SearchX className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-3">
                                            {isVi ? 'Không tìm thấy thang đo' : 'No scales found'}
                                        </h3>
                                        <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
                                            {isVi 
                                                ? 'Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.' 
                                                : 'Try adjusting your search terms or selecting a different category.'}
                                        </p>
                                        <button 
                                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-slate-200"
                                        >
                                            {isVi ? 'Xem tất cả thang đo' : 'View all scales'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                                        {filteredScales.map((scale, sIdx) => {
                                            const itemCount = scale.scale_items?.length || 0;
                                            return (
                                            <div 
                                                key={scale.id} 
                                                onClick={() => setExpandedScale(scale.id)}
                                                className="group relative bg-white rounded-[2.5rem] border border-slate-200/60 hover:border-indigo-400/50 transition-all duration-700 cursor-pointer flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8"
                                                style={{ animationDelay: `${sIdx * 50}ms` }}
                                            >
                                                {/* Decorative Accent */}
                                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full group-hover:scale-[3] group-hover:bg-indigo-100/50 transition-transform duration-1000 blur-3xl"></div>
                                                
                                                <div className="p-10 relative z-10 flex flex-col h-full">
                                                    <div className="flex items-start justify-between mb-8">
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className="px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                                                                {scale.category?.[0] || 'Core'}
                                                            </span>
                                                            {scale.year > 2020 && (
                                                                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-100">
                                                                    Modern
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <div className="flex -space-x-2">
                                                                {[1, 2, 3].map(i => (
                                                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                                                                        <User className="w-3 h-3" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase">Trusted</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <h3 className="text-3xl font-black text-slate-900 mb-5 group-hover:text-indigo-600 transition-colors leading-[1.1] tracking-tighter">
                                                        {isVi ? scale.name_vi : scale.name_en}
                                                    </h3>
                                                    
                                                    <p className="text-lg text-slate-500 font-medium mb-10 line-clamp-3 leading-relaxed">
                                                        {isVi ? scale.description_vi : scale.description_en}
                                                    </p>
                                                    
                                                    <div className="mt-auto pt-8 border-t border-slate-50 flex items-end justify-between">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3 text-slate-400">
                                                                <Quote className="w-4 h-4 text-indigo-400" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[200px]">{scale.author}</span>
                                                            </div>
                                                            <div className="flex items-center gap-6">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Items</span>
                                                                    <span className="text-xl font-black text-slate-900">{itemCount}</span>
                                                                </div>
                                                                <div className="w-px h-8 bg-slate-100"></div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Year</span>
                                                                    <span className="text-xl font-black text-slate-900">{scale.year}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-3">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); copyCitation(scale); }}
                                                                className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group/btn"
                                                            >
                                                                <Copy className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                                            </button>
                                                            <div className="w-14 h-14 rounded-3xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-indigo-600 group-hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] transition-all duration-500">
                                                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );})}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- FOCUS DETAIL VIEW MODAL (PREMIUM REDESIGN) --- */}
                    {expandedScale && activeScale && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-12 animate-in fade-in duration-500">
                            {/* Premium Backdrop */}
                            <div 
                                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md cursor-zoom-out" 
                                onClick={() => setExpandedScale(null)}
                            ></div>
                            
                            <div className="w-full h-full max-w-7xl bg-white md:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.1)] relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-700 ease-out-expo">
                                
                                {/* Header - Dynamic & Slimmer */}
                                <div className="sticky top-0 z-[110] bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-12 py-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                            <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg md:text-2xl font-black text-slate-900 leading-none mb-1">
                                                {isVi ? 'Chi tiết Thang đo' : 'Scale Details'}
                                            </h2>
                                            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                ID: {activeScale.id.substring(0, 8)}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setExpandedScale(null)}
                                        className="p-2 md:p-3 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                <div className="flex-grow overflow-y-auto no-scrollbar bg-white">
                                    {/* Detailed Hero Section - Editorial Style */}
                                    <div className="relative p-10 md:p-20 bg-slate-900 text-white overflow-hidden">
                                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] -mr-40 -mt-40 rounded-full animate-pulse"></div>
                                        <div className="relative z-10 max-w-4xl">
                                            <div className="flex flex-wrap gap-3 mb-10">
                                                {(activeScale.category || []).map((cat: string) => (
                                                    <span key={cat} className="px-5 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 backdrop-blur-md">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                            <h1 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter leading-[0.95]">
                                                {isVi ? activeScale.name_vi : activeScale.name_en}
                                            </h1>
                                            <div className="flex flex-wrap items-center gap-10 text-indigo-300/80 font-black text-xs uppercase tracking-widest">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><User className="w-4 h-4" /></div>
                                                    <span>{activeScale.author}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Clock className="w-4 h-4" /></div>
                                                    <span>{activeScale.year}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Target className="w-4 h-4" /></div>
                                                    <span>{activeScale.scale_items?.length || 0} Items</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Strategy Grid */}
                                    <div className="max-w-7xl mx-auto p-10 md:p-20">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                                            {/* Left Content (8 cols) */}
                                            <div className="lg:col-span-8 space-y-20">
                                                <section>
                                                    <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                                                        <div className="w-8 h-[2px] bg-indigo-600"></div> Research Overview
                                                    </h3>
                                                    <p className="text-2xl md:text-3xl text-slate-700 font-medium leading-relaxed first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-indigo-600">
                                                        {isVi ? activeScale.description_vi : activeScale.description_en}
                                                    </p>
                                                </section>

                                                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    {(activeScale.usage_guide_vi || activeScale.usage_guide_en) && (
                                                        <div className="p-10 bg-indigo-50/30 rounded-[3rem] border border-indigo-100/50">
                                                            <h4 className="text-sm font-black text-indigo-950 uppercase tracking-widest mb-6">{isVi ? 'Hướng dẫn' : 'Usage'}</h4>
                                                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                                                {isVi ? activeScale.usage_guide_vi : activeScale.usage_guide_en}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {(activeScale.scoring_logic_vi || activeScale.scoring_logic_en) && (
                                                        <div className="p-10 bg-emerald-50/30 rounded-[3rem] border border-emerald-100/50">
                                                            <h4 className="text-sm font-black text-emerald-950 uppercase tracking-widest mb-6">{isVi ? 'Tính điểm' : 'Scoring'}</h4>
                                                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                                                {isVi ? activeScale.scoring_logic_vi : activeScale.scoring_logic_en}
                                                            </p>
                                                        </div>
                                                    )}
                                                </section>

                                                <section className="space-y-12">
                                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-8">{isVi ? 'Danh mục biến quan sát' : 'Measurement Items'}</h3>
                                                    <div className="space-y-10">
                                                        {(() => {
                                                            const items = activeScale.scale_items || [];
                                                            const grouped: Record<string, any[]> = {};
                                                            items.forEach((item: any) => {
                                                                const prefix = item.code.replace(/[0-9]/g, '') || 'Global';
                                                                if (!grouped[prefix]) grouped[prefix] = [];
                                                                grouped[prefix].push(item);
                                                            });

                                                            return Object.entries(grouped).map(([prefix, groupItems]) => (
                                                                <div key={prefix}>
                                                                    <div className="flex items-center gap-6 mb-8">
                                                                        <div className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">{prefix}</div>
                                                                        <div className="h-px bg-slate-100 flex-grow"></div>
                                                                    </div>
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        {groupItems.map((item: any) => (
                                                                            <div key={item.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center gap-8 hover:bg-white hover:shadow-xl transition-all group">
                                                                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-xs text-indigo-600 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                                    {item.code}
                                                                                </div>
                                                                                <div className="flex-grow">
                                                                                    <p className="text-lg font-bold text-slate-900 leading-tight">{isVi ? item.text_vi : item.text_en}</p>
                                                                                    <p className="text-[10px] text-slate-400 font-medium italic">{isVi ? item.text_en : item.text_vi}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ));
                                                        })()}
                                                    </div>
                                                </section>
                                            </div>

                                            {/* Right Sidebar (4 cols) */}
                                            <div className="lg:col-span-4 space-y-12">
                                                <div className="sticky top-10 space-y-12">
                                                    <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                                                        <Quote className="absolute -top-10 -right-10 w-40 h-40 text-white/5 rotate-12" />
                                                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Authority</h4>
                                                        <p className="text-xl font-medium leading-relaxed italic opacity-90">
                                                            "{activeScale.citation || `${activeScale.author} (${activeScale.year}).`}"
                                                        </p>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); copyCitation(activeScale); }}
                                                            className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                                                        >
                                                            {copiedCitation ? 'Copied' : 'Copy Citation'}
                                                        </button>
                                                    </div>

                                                    <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-8">
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Summary</h4>
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center py-4 border-b border-slate-200/50">
                                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dimensions</span>
                                                                <span className="text-xl font-black text-slate-900">{getDimensionCount(activeScale)}</span>
                                                            </div>
                                                            <button 
                                                                onClick={() => router.push('/analyze')}
                                                                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100"
                                                            >
                                                                Analyze Now
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
