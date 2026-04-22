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

    useEffect(() => {
        setLocale(getStoredLocale());
        fetchScales();
        
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
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
                        <div className="flex-grow w-full">    <div className="lg:col-span-9">
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {filteredScales.map(scale => {
                                            const itemCount = scale.scale_items?.length || 0;
                                            return (
                                            <div 
                                                key={scale.id} 
                                                onClick={() => setExpandedScale(scale.id)}
                                                className="group relative bg-white rounded-[2rem] border border-slate-200/60 hover:border-indigo-300/50 hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.12)] transition-all duration-500 overflow-hidden cursor-pointer"
                                            >
                                                {/* Card Background Accent */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 blur-3xl"></div>
                                                
                                                <div className="p-7 relative z-10 flex flex-col h-full">
                                                    <div className="flex items-center justify-between mb-5">
                                                        <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
                                                            {scale.category?.[0] || 'General'}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px]">
                                                            <ListChecks className="w-3 h-3" />
                                                            {itemCount > 0 ? `${itemCount} Items` : 'Coming Soon'}
                                                        </div>
                                                    </div>
                                                    
                                                    <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                        {isVi ? scale.name_vi : scale.name_en}
                                                    </h3>
                                                    
                                                    <p className="text-sm text-slate-500 font-medium mb-8 line-clamp-2 leading-relaxed">
                                                        {isVi ? scale.description_vi : scale.description_en}
                                                    </p>
                                                    
                                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                                                <User className="w-4 h-4 text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider truncate max-w-[120px]">{scale.author}</p>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{scale.year}</p>
                                                            </div>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                                                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );})}
                                    </div>
                                  {/* --- FOCUS DETAIL VIEW MODAL (PREMIUM REDESIGN) --- */}
                    {expandedScale && activeScale && (
                        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-8 animate-in fade-in duration-300">
                            {/* Close overlay */}
                            <div className="absolute inset-0" onClick={() => setExpandedScale(null)}></div>
                            
                            <div className="w-full max-w-6xl h-[90vh] md:h-auto md:max-h-[90vh] overflow-hidden bg-white rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl relative animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-500 flex flex-col">
                                
                                {/* Header (Sticky) */}
                                <div className="sticky top-0 z-[110] bg-white border-b border-slate-100 px-6 md:px-10 py-4 md:py-6 flex items-center justify-between">
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

                                <div className="flex-grow overflow-y-auto no-scrollbar">
                                    {/* Detailed Hero Section */}
                                    <div className="relative p-6 md:p-12 bg-slate-900 text-white overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
                                        <div className="relative z-10">
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {(activeScale.category || []).map((cat: string) => (
                                                    <span key={cat} className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-[1.1]">
                                                {isVi ? activeScale.name_vi : activeScale.name_en}
                                            </h1>
                                            <div className="flex flex-wrap items-center gap-6 text-indigo-300 font-bold text-sm md:text-base">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    <span>{activeScale.author}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{activeScale.year}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Target className="w-4 h-4" />
                                                    <span>{activeScale.scale_items?.length || 0} Items</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Tabs/Grid */}
                                    <div className="p-6 md:p-12 space-y-12">
                                        {/* Row 1: Description & Quick Stats */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 space-y-6">
                                                <div className="flex items-center gap-3 text-slate-900 mb-4">
                                                    <Info className="w-5 h-5 text-indigo-600" />
                                                    <h3 className="text-lg font-black uppercase tracking-tight">{isVi ? 'Tổng quan nghiên cứu' : 'Research Overview'}</h3>
                                                </div>
                                                <div className="space-y-6">
                                                    <p className="text-slate-600 text-lg leading-relaxed font-medium bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                                        {isVi ? activeScale.description_vi : activeScale.description_en}
                                                    </p>
                                                    
                                                    {/* NEW: Usage Guide & Scoring */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {(activeScale.usage_guide_vi || activeScale.usage_guide_en) && (
                                                            <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                                                <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3">{isVi ? 'Hướng dẫn sử dụng' : 'Usage Guide'}</h4>
                                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                                    {isVi ? activeScale.usage_guide_vi : activeScale.usage_guide_en}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {(activeScale.scoring_logic_vi || activeScale.scoring_logic_en) && (
                                                            <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                                                                <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-3">{isVi ? 'Cách tính điểm' : 'Scoring Logic'}</h4>
                                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                                    {isVi ? activeScale.scoring_logic_vi : activeScale.scoring_logic_en}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 text-slate-900 mb-4">
                                                    <Settings className="w-5 h-5 text-indigo-600" />
                                                    <h3 className="text-lg font-black uppercase tracking-tight">{isVi ? 'Thông số kỹ thuật' : 'Technical Specs'}</h3>
                                                </div>
                                                <div className="grid grid-cols-1 gap-3">
                                                    <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                                                        <span className="text-xs font-bold text-slate-400">Dimensions</span>
                                                        <span className="font-black text-indigo-600">{getDimensionCount(activeScale)}</span>
                                                    </div>
                                                    <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                                                        <span className="text-xs font-bold text-slate-400">Lang Supported</span>
                                                        <span className="font-black text-indigo-600">VI, EN</span>
                                                    </div>
                                                    <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                                                        <span className="text-xs font-bold text-slate-400">Scoring Type</span>
                                                        <span className="font-black text-indigo-600">Likert 1-5/7</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 2: Item List (Dimension Breakdown) */}
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-slate-900">
                                                    <ListChecks className="w-6 h-6 text-indigo-600" />
                                                    <h3 className="text-xl font-black uppercase tracking-tight">{isVi ? 'Chi tiết các biến quan sát' : 'Scale Items Detail'}</h3>
                                                </div>
                                                <div className="hidden md:block px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                                    APA Standard
                                                </div>
                                            </div>

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
                                                        <div key={prefix} className="space-y-4">
                                                            <div className="flex items-center gap-4">
                                                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Dimension: {prefix}</h4>
                                                                <div className="h-px bg-slate-100 flex-grow"></div>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {groupItems.map((item: any) => (
                                                                    <div key={item.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4 hover:border-indigo-200 hover:bg-white transition-all group">
                                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-xs text-indigo-600 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                                            {item.code}
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <p className="text-sm font-bold text-slate-900 leading-tight">{isVi ? item.text_vi : item.text_en}</p>
                                                                            <p className="text-[10px] text-slate-400 font-medium italic">{isVi ? item.text_en : item.text_vi}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>
                                        </div>

                                        {/* Academic Citation Block */}
                                        <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 text-center space-y-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full font-black text-[10px] uppercase tracking-widest">
                                                <Quote className="w-3 h-3" /> 
                                                {isVi ? 'Trích dẫn khoa học' : 'Academic Citation'}
                                            </div>
                                            <p className="text-lg md:text-2xl text-white italic font-medium leading-relaxed max-w-3xl mx-auto">
                                                "{activeScale.citation || `${activeScale.author} (${activeScale.year}). Scale for Research Purposes.`}"
                                            </p>
                                            <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); copyCitation(activeScale); }}
                                                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 transition-all text-xs flex items-center justify-center gap-3 shadow-xl shadow-indigo-900/40"
                                                >
                                                    {copiedCitation ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                    {copiedCitation ? (isVi ? 'ĐÃ SAO CHÉP' : 'COPIED') : (isVi ? 'SAO CHÉP TRÍCH DẪN' : 'COPY CITATION')}
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); router.push('/analyze'); }}
                                                    className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-100 transition-all text-xs flex items-center justify-center gap-3"
                                                >
                                                    <LineChart className="w-4 h-4" />
                                                    {isVi ? 'PHÂN TÍCH NGAY' : 'ANALYZE NOW'}
                                                </button>
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
