'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { 
    Search, Filter, Library, BookOpen, Download, ChevronRight, 
    ArrowLeft, Quote, Clock, Layers, Sparkles, ExternalLink,
    CheckCircle2, Info, FileSpreadsheet, ChevronDown, 
    Target, UserCheck, Settings, Cpu, HelpCircle, X, Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/utils/supabase/client';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

interface ScaleItem {
    id: string;
    code: string;
    text_vi: string;
    text_en: string;
}

interface Scale {
    id: string;
    category: string[];
    name_vi: string;
    name_en: string;
    author: string;
    year: number;
    citation: string;
    description_vi: string;
    description_en: string;
    tags?: string[];
    research_model?: string;
    items?: ScaleItem[];
}

export default function ScaleHubPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>}>
            <ScaleHubContent />
        </Suspense>
    );
}

function ScaleHubContent() {
    const router = useRouter();
    const [locale, setLocale] = useState<Locale>('vi');
    const [scales, setScales] = useState<Scale[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [expandedScale, setExpandedScale] = useState<string | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    
    // Advisor State
    const [showAdvisor, setShowAdvisor] = useState(false);
    const [advisorSelection, setAdvisorSelection] = useState<string | null>(null);

    const isVi = locale === 'vi';
    const supabase = getSupabase();

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        
        // Initial session check
        supabase.auth.getSession().then(({ data: { session: currentSession } }: { data: { session: Session | null } }) => {
            setSession(currentSession);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, newSession: Session | null) => {
            setSession(newSession);
        });

        fetchScales();
        
        return () => {
            window.removeEventListener('localeChange', handleLocaleChange);
            subscription.unsubscribe();
        };
    }, []);

    const fetchScales = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('scales')
                .select(`
                    *,
                    scale_items (*)
                `)
                .order('name_en', { ascending: true });

            if (error) throw error;
            
            const transformedScales = data.map((s: any) => ({
                ...s,
                items: s.scale_items || [],
                category: Array.isArray(s.category) ? s.category : [s.category]
            }));
            
            setScales(transformedScales);
        } catch (err) {
            console.error('Error fetching scales:', err);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'Economics', 'Marketing', 'HR', 'Logistics', 'MIS', 'Accounting', 'Innovation', 'Tourism', 'Modern (2020+)'];

    const handleExpandScale = (id: string) => {
        setExpandedScale(expandedScale === id ? null : id);
    };

    const filteredScales = useMemo(() => {
        return scales.filter(scale => {
            const matchesSearch = 
                scale.name_vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scale.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scale.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scale.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesCategory = selectedCategory === 'All' || 
                                    scale.category.includes(selectedCategory) ||
                                    (selectedCategory === 'Modern (2020+)' && scale.tags?.includes('Modern (2020+)'));
            
            let matchesAdvisor = true;
            if (advisorSelection) {
                if (advisorSelection === 'acceptance') {
                    matchesAdvisor = scale.tags?.some(t => ['Technology', 'Acceptance', 'Behavior', 'Intent', 'AI', 'ChatGPT'].includes(t)) || false;
                } else if (advisorSelection === 'service') {
                    matchesAdvisor = scale.tags?.some(t => ['Service', 'Quality', 'Satisfaction', 'Signal', 'Communication', 'Chatbot'].includes(t)) || false;
                } else if (advisorSelection === 'hr') {
                    matchesAdvisor = scale.category.includes('HR') || scale.tags?.some(t => ['Leadership', 'Employee', 'Trust', 'Transparency', 'Remote Work', 'Zoom Fatigue'].includes(t)) || false;
                } else if (advisorSelection === 'systems') {
                    matchesAdvisor = scale.category.some(cat => ['Logistics', 'MIS'].includes(cat)) || (scale.tags?.includes('Digitalization') ?? false);
                } else if (advisorSelection === 'modern') {
                    matchesAdvisor = scale.tags?.includes('Modern (2020+)') ?? false;
                }
            }

            return matchesSearch && matchesCategory && matchesAdvisor;
        });
    }, [scales, searchQuery, selectedCategory, advisorSelection]);

    const suggestions = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return scales
            .filter(s => 
                s.name_vi.toLowerCase().includes(searchQuery.toLowerCase()) || 
                s.name_en.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 5);
    }, [scales, searchQuery]);

    const activeScale = useMemo(() => {
        return scales.find(s => s.id === expandedScale) || null;
    }, [scales, expandedScale]);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <div className="min-h-screen bg-slate-50 pb-20">
                <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Library className="w-96 h-96 rotate-12" />
                    </div>
                    <div className="container mx-auto px-4 max-w-6xl relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-6 uppercase tracking-wider border border-indigo-500/30">
                                    <Sparkles className="w-3 h-3" />
                                    <span>{isVi ? 'Hệ sinh thái NC' : 'Research Ecosystem'}</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                                    {t(locale, 'scales.title')}
                                </h1>
                                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mb-8">
                                    {t(locale, 'scales.subtitle')}
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <button 
                                        onClick={() => setShowAdvisor(!showAdvisor)}
                                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                                    >
                                        <Target className="w-5 h-5" />
                                        {t(locale, 'scales.advisor.title')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-6xl -mt-10 relative z-20">
                    {showAdvisor && (
                        <div className="bg-gradient-to-br from-indigo-700 to-slate-900 p-8 rounded-3xl shadow-2xl mb-12 text-white border border-indigo-500/20">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                                        <Sparkles className="w-6 h-6 text-yellow-400" />
                                        {t(locale, 'scales.advisor.title')}
                                    </h2>
                                    <p className="text-indigo-200">{t(locale, 'scales.advisor.subtitle')}</p>
                                </div>
                                <button onClick={() => {setShowAdvisor(false); setAdvisorSelection(null);}} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { id: 'acceptance', icon: <Cpu className="w-6 h-6" />, label: t(locale, 'scales.advisor.opt1') },
                                    { id: 'service', icon: <Sparkles className="w-6 h-6" />, label: t(locale, 'scales.advisor.opt2') },
                                    { id: 'hr', icon: <UserCheck className="w-6 h-6" />, label: t(locale, 'scales.advisor.opt3') },
                                    { id: 'systems', icon: <Settings className="w-6 h-6" />, label: t(locale, 'scales.advisor.opt4') },
                                    { id: 'modern', icon: <Target className="w-6 h-6" />, label: t(locale, 'scales.advisor.modern') }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setAdvisorSelection(advisorSelection === opt.id ? null : opt.id)}
                                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col gap-4 text-left ${
                                            advisorSelection === opt.id 
                                            ? 'bg-white text-indigo-900 border-white shadow-xl scale-105' 
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className={`p-3 rounded-xl inline-flex ${advisorSelection === opt.id ? 'bg-indigo-100' : 'bg-white/10'}`}>
                                            {opt.icon}
                                        </div>
                                        <span className="font-bold text-sm leading-snug">{opt.label}</span>
                                    </button>
                                ))}
                            </div>

                            {advisorSelection && (
                                <div className="mt-8 pt-8 border-t border-white/10 animate-in fade-in slide-in-from-top-4">
                                    <p className="flex items-center gap-2 text-indigo-300 font-medium italic">
                                        <ChevronRight className="w-4 h-4" />
                                        {t(locale, 'scales.advisor.resultText')} 
                                        <span className="text-white font-bold ml-1">{filteredScales.length} {isVi ? 'thang đo phù hợp' : 'matching scales'}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* {t(locale, 'scales.advisor.loginRequired')} - Temporarily disabled */}

                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 mb-12 flex flex-col lg:flex-row gap-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder={t(locale, 'scales.searchPlaceholder')}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    {suggestions.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => {
                                                setSearchQuery(isVi ? s.name_vi : s.name_en);
                                                setExpandedScale(s.id);
                                            }}
                                            className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0"
                                        >
                                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                                <Search className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{isVi ? s.name_vi : s.name_en}</p>
                                                <p className="text-xs text-slate-400">{s.author} ({s.year})</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                        selectedCategory === cat 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                                    }`}
                                >
                                    {cat === 'All' ? (isVi ? 'Tất cả' : 'All') : t(locale, `scales.${cat.toLowerCase()}`)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-3 gap-8 animate-pulse">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-80 bg-white rounded-3xl border border-slate-200 shadow-sm"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                            {/* Scales List */}
                            <div className={`${expandedScale ? 'md:col-span-4 lg:col-span-5' : 'md:col-span-12'} grid grid-cols-1 ${expandedScale ? 'lg:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6 transition-all duration-500`}>
                                {filteredScales.map(scale => (
                                    <div 
                                        key={scale.id} 
                                        onClick={() => setExpandedScale(scale.id)}
                                        className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col cursor-pointer ${
                                            expandedScale === scale.id 
                                            ? 'ring-2 ring-indigo-500 border-indigo-200 shadow-xl' 
                                            : 'border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300'
                                        }`}
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {scale.category.slice(0, 1).map(cat => (
                                                        <div 
                                                            key={cat}
                                                            className="px-2 py-0.5 bg-indigo-50 rounded-lg text-[8px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100"
                                                        >
                                                            {t(locale, `scales.${cat.toLowerCase()}`)}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold">
                                                    {scale.items?.length || 0} items
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                {isVi ? scale.name_vi : scale.name_en}
                                            </h3>
                                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                                                {scale.author} ({scale.year})
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Scale Details Panel (Right Side) */}
                            {expandedScale && activeScale && (
                                <div className="md:col-span-8 lg:col-span-7 sticky top-24 animate-in slide-in-from-right-4 duration-500">
                                    <div className="bg-white rounded-[2rem] border border-indigo-100 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                                        {/* Panel Header */}
                                        <div className="p-8 bg-slate-900 text-white flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {activeScale.category.map(cat => (
                                                        <span key={cat} className="px-2 py-1 bg-white/10 rounded-lg text-[9px] font-black tracking-widest uppercase text-indigo-300 border border-white/10">
                                                            {t(locale, `scales.${cat.toLowerCase()}`)}
                                                        </span>
                                                    ))}
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-2">
                                                    {isVi ? activeScale.name_vi : activeScale.name_en}
                                                </h3>
                                                <p className="text-slate-400 font-medium">By {activeScale.author} ({activeScale.year})</p>
                                            </div>
                                            <button 
                                                onClick={() => setExpandedScale(null)}
                                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>

                                        {/* Panel Content (Scrollable) */}
                                        <div className="p-8 overflow-y-auto no-scrollbar flex-1 space-y-10">
                                            {/* Description */}
                                            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                                                <p className="text-slate-700 leading-relaxed italic">
                                                    {isVi ? activeScale.description_vi : activeScale.description_en}
                                                </p>
                                            </div>

                                            {/* Scale Items */}
                                            <div>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                                                        <Layers className="w-5 h-5" />
                                                    </div>
                                                    <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                                        {isVi ? 'Hệ thống câu hỏi' : 'Scale Items'}
                                                    </h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {activeScale.items?.map((item) => (
                                                        <div key={item.id} className="p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group shadow-sm flex items-start gap-4">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-100 flex items-center justify-center font-black text-indigo-600 text-[10px] group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all shrink-0">
                                                                {item.code}
                                                            </div>
                                                            <div className="pt-0.5">
                                                                <p className="text-slate-800 font-bold mb-1 leading-snug">{isVi ? item.text_vi : item.text_en}</p>
                                                                <p className="text-[10px] text-slate-400 italic">
                                                                    {isVi ? item.text_en : item.text_vi}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                                                <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                                                    <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                                                    {isVi ? 'XUẤT FILE MẪU' : 'EXPORT EXCEL'}
                                                </button>
                                                <button className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-black text-xs hover:bg-indigo-50 transition-all">
                                                    <Quote className="w-5 h-5" />
                                                    {isVi ? 'CHÉP TRÍCH DẪN' : 'COPY CITATION'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer locale={locale} />
        </div>
    );
}
