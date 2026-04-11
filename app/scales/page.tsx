'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Search, BookOpen, Clock, ArrowRight, TrendingUp, ShieldCheck, 
    Brain, FileSearch, LineChart, Hash, Zap, HelpCircle, Layers, Activity,
    ArrowLeft, Quote, Sparkles, ExternalLink, Copy, Check,
    CheckCircle2, Info, FileSpreadsheet, ChevronDown, SearchX,
    Target, UserCheck, Settings, Cpu, X, Lock, Users, ListChecks
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase } from '@/utils/supabase/client';
import { getStoredLocale, type Locale, t } from '@/lib/i18n';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const supabase = getSupabase();

export default function ScalesLibrary() {
    const router = useRouter();
    const [locale, setLocale] = useState<Locale>('vi');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [expandedScale, setExpandedScale] = useState<string | null>(null);
    const [scales, setScales] = useState<any[]>([]);
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
            
            if (data) setScales(data);
        } catch (err) {
            console.error('Fetch error:', err);
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
            
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto text-center mb-20 animate-in fade-in duration-700">
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95]">
                                {isVi ? 'Thang đo' : 'Measurement'}
                                <span className="text-indigo-600 block">ncsScales.</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                                {isVi 
                                    ? 'Thư viện thang đo chuẩn hóa, đã được kiểm định qua các công bố quốc tế uy tín.' 
                                    : 'Validated measurement scales library, verified through prestigious international publications.'}
                            </p>
                            
                            <div className="relative max-w-2xl mx-auto group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder={isVi ? "Tìm kiếm thang đo (ví dụ: TAM, SERVQUAL...)" : "Search scales (e.g., TAM, SERVQUAL...)"}
                                    className="w-full pl-16 pr-8 py-6 bg-white border-2 border-slate-100 rounded-[2rem] text-slate-900 font-bold text-lg focus:outline-none focus:border-indigo-600 shadow-xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    

                    {/* --- LIST VIEW --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                            {/* Sidebar Filters */}
                            <div className="lg:col-span-3 space-y-6 sticky top-28">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">
                                        <Layers className="w-4 h-4" />
                                        Categories
                                    </h4>
                                    <div className="space-y-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                                                    selectedCategory === cat 
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                                                    : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Grid */}
                            <div className="lg:col-span-9">
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
                                            <div key={i} className="h-72 bg-white rounded-[2.5rem] border border-slate-100">
                                                <div className="p-6 space-y-4">
                                                    <div className="h-4 w-20 bg-slate-100 rounded-lg"></div>
                                                    <div className="h-6 w-3/4 bg-slate-100 rounded-lg"></div>
                                                    <div className="h-4 w-full bg-slate-50 rounded-lg"></div>
                                                    <div className="h-4 w-2/3 bg-slate-50 rounded-lg"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : filteredScales.length === 0 ? (
                                    /* Empty State */
                                    <div className="text-center py-20 px-8">
                                        <div className="w-20 h-20 mx-auto bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6">
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
                                            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                                        >
                                            {isVi ? 'Xem tất cả thang đo' : 'View all scales'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {filteredScales.map(scale => {
                                            const codeRange = getCodeRange(scale);
                                            const itemCount = scale.scale_items?.length || 0;
                                            return (
                                            <div 
                                                key={scale.id} 
                                                onClick={() => setExpandedScale(scale.id)}
                                                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:translate-y-[-6px] hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 overflow-hidden flex flex-col cursor-pointer relative"
                                            >
                                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="p-6 flex flex-col h-full">
                                                    <div className="flex items-start justify-between mb-5">
                                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100/50">
                                                            {scale.category?.[0] || 'General'}
                                                        </span>
                                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border italic ${
                                                            itemCount === 0 
                                                                ? 'text-amber-500 bg-amber-50 border-amber-100' 
                                                                : 'text-slate-400 bg-slate-50 border-slate-100'
                                                        }`}>
                                                            {itemCount === 0 ? (isVi ? 'Đang cập nhật' : 'Coming soon') : `${itemCount} items`}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                                                        {isVi ? scale.name_vi : scale.name_en}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 font-normal mb-6 line-clamp-2 leading-relaxed">
                                                        {isVi ? scale.description_vi : scale.description_en}
                                                    </p>
                                                    <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{scale.author} ({scale.year})</p>
                                                            {codeRange && (
                                                                <div className="flex gap-2">
                                                                    <span className="text-base font-black text-indigo-700 bg-indigo-50 px-2 rounded-md">
                                                                        {codeRange.first} → {codeRange.last}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                            <ArrowRight className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );})}
                                    </div>
                                )}
                            </div>
                    </div>

                    {/* --- FOCUS DETAIL VIEW MODAL (AJAX-STYLE) --- */}
                    {expandedScale && activeScale && (
                        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                            <div className="w-full max-w-5xl max-h-[95vh] overflow-y-auto no-scrollbar bg-white rounded-[3rem] shadow-2xl relative shadow-indigo-100/40 animate-in zoom-in-95 duration-500">
                                {/* Close Button */}
                                <button 
                                    onClick={() => setExpandedScale(null)}
                                    className="absolute top-6 right-6 md:top-8 md:right-8 z-[110] p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white backdrop-blur-md transition-all shadow-xl group"
                                >
                                    <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                </button>
                                
                                {/* Detailed Hero */}
                                    <div className="bg-slate-900 p-12 md:p-24 text-white relative">
                                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full"></div>
                                        <div className="relative z-10">
                                            <div className="flex flex-wrap gap-3 mb-10">
                                                {activeScale.category.map((cat: string) => (
                                                    <span key={cat} className="px-5 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9] max-w-4xl">
                                                {isVi ? activeScale.name_vi : activeScale.name_en}
                                            </h2>
                                            <div className="flex flex-col md:flex-row md:items-center gap-6 text-indigo-300 font-black text-xl mb-16">
                                                <div className="flex items-center gap-3">
                                                    <Users className="w-6 h-6" />
                                                    <span>{activeScale.author}</span>
                                                </div>
                                                <div className="hidden md:block w-2 h-2 rounded-full bg-white/20"></div>
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-6 h-6" />
                                                    <span>Year: {activeScale.year}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Items</p>
                                                    <p className="text-4xl font-black">{activeScale.scale_items?.length || 0}</p>
                                                </div>
                                                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Dimensions</p>
                                                    <p className="text-4xl font-black text-emerald-400">{getDimensionCount(activeScale)}</p>
                                                </div>
                                                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Published</p>
                                                    <p className="text-4xl font-black text-indigo-400">{activeScale.year}</p>
                                                </div>
                                                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm shadow-xl shadow-indigo-500/10">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Categories</p>
                                                    <p className="text-4xl font-black text-amber-400">{activeScale.category?.length || 1}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Insights & Items */}
                                    <div className="p-10 md:p-20 space-y-24">
                                        {/* Academic Insight Block */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                                            <div className="lg:col-span-2 space-y-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-2xl shadow-indigo-200">
                                                        <Brain className="w-8 h-8" />
                                                    </div>
                                                    <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Academic Insight</h4>
                                                </div>
                                                <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner">
                                                    <p className="text-xl text-slate-700 leading-relaxed font-black italic mb-6">"Expert Hack:"</p>
                                                    <p className="text-lg text-slate-600 leading-relaxed font-medium italic">
                                                        {isVi ? activeScale.description_vi : activeScale.description_en}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-10">
                                                <div className="flex items-center gap-4 text-slate-900">
                                                    <Sparkles className="w-7 h-7" />
                                                    <h4 className="text-2xl font-black uppercase tracking-tighter">Resources</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    {[
                                                        { slug: 'cronbach-alpha', title: 'Cronbach Alpha Logic' },
                                                        { slug: 'efa-factor-analysis', title: 'EFA Master Guide' }
                                                    ].map(guide => (
                                                        <Link key={guide.slug} href={`/knowledge/${guide.slug}`} className="flex items-center justify-between p-6 bg-slate-900 text-white hover:bg-indigo-600 rounded-3xl transition-all font-black text-xs group uppercase tracking-widest">
                                                            <span>{guide.title}</span>
                                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Grouped Scale Items */}
                                        <div className="space-y-16">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-slate-900 rounded-3xl text-white shadow-xl">
                                                    <ListChecks className="w-8 h-8" />
                                                </div>
                                                <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Dimension Breakdown</h4>
                                            </div>

                                            <div className="space-y-20">
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
                                                            <div className="flex items-center gap-8 mb-10">
                                                                <div className="px-8 py-3 bg-indigo-900 text-white rounded-[1.25rem] text-xs font-black uppercase tracking-[0.4em] shadow-xl shadow-indigo-100">
                                                                    Dimensions Group: {prefix}
                                                                </div>
                                                                <div className="h-px bg-slate-100 flex-grow"></div>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-6">
                                                                {groupItems.map((item: any) => (
                                                                    <div key={item.id} className="p-10 bg-white border-2 border-slate-50 rounded-[3rem] flex items-start gap-10 hover:border-indigo-200 hover:shadow-2xl transition-all duration-500 group">
                                                                        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center font-black text-indigo-600 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm shrink-0 text-xl">
                                                                            {item.code}
                                                                        </div>
                                                                        <div className="space-y-4 pt-2">
                                                                            <p className="text-2xl text-slate-900 font-black tracking-tight leading-tight">{isVi ? item.content_vi : item.content_en}</p>
                                                                            <p className="text-sm text-slate-400 font-bold italic border-l-4 border-indigo-100 pl-4">
                                                                                {isVi ? item.content_en : item.content_vi}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>
                                        </div>

                                        {/* Citation Footer */}
                                        <div className="pt-20 border-t border-slate-100 flex flex-col items-center text-center space-y-12">
                                            <div className="max-w-3xl">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full mb-6 font-black text-[10px] uppercase tracking-widest border border-indigo-100">
                                                    <Quote className="w-4 h-4" /> Academic Citation
                                                </div>
                                                <p className="text-2xl text-slate-700 italic font-medium leading-relaxed">
                                                    "{activeScale.citation || `${activeScale.author} (${activeScale.year}). Scale for Research Purposes.`}"
                                                </p>
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); copyCitation(activeScale); }}
                                                    className="flex-1 py-7 bg-indigo-600 text-white rounded-[2rem] font-black hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 text-sm flex items-center justify-center gap-3"
                                                >
                                                    {copiedCitation ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                    {copiedCitation ? (isVi ? 'ĐÃ SAO CHÉP!' : 'COPIED!') : (isVi ? 'SAO CHÉP TRÍCH DẪN APA' : 'COPY APA CITATION')}
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); router.push('/analyze'); }}
                                                    className="flex-1 py-7 bg-white border-4 border-slate-900 text-slate-900 rounded-[2rem] font-black hover:bg-slate-900 hover:text-white transition-all text-sm flex items-center justify-center gap-3"
                                                >
                                                    <LineChart className="w-5 h-5" />
                                                    {isVi ? 'PHÂN TÍCH VỚI NCSSTAT' : 'ANALYZE WITH NCSSTAT'}
                                                </button>
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
