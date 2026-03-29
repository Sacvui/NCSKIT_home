'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

    const categories = ['All', 'Economics', 'Marketing', 'HR', 'Logistics', 'MIS', 'Accounting', 'Innovation', 'Tourism'];

    const handleExpandScale = (id: string) => {
        if (!session) {
            router.push(`/login?next=/scales&auth_reason=view_scale`);
            return;
        }
        setExpandedScale(expandedScale === id ? null : id);
    };

    const filteredScales = useMemo(() => {
        return scales.filter(scale => {
            const matchesSearch = 
                scale.name_vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scale.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scale.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scale.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesCategory = selectedCategory === 'All' || scale.category.includes(selectedCategory);
            
            let matchesAdvisor = true;
            if (advisorSelection) {
                if (advisorSelection === 'acceptance') {
                    matchesAdvisor = scale.tags?.some(t => ['Technology', 'Acceptance', 'Behavior', 'Intent'].includes(t)) || false;
                } else if (advisorSelection === 'service') {
                    matchesAdvisor = scale.tags?.some(t => ['Service', 'Quality', 'Satisfaction', 'Signal', 'Communication'].includes(t)) || false;
                } else if (advisorSelection === 'hr') {
                    matchesAdvisor = scale.category.includes('HR') || scale.tags?.some(t => ['Leadership', 'Employee', 'Trust', 'Transparency'].includes(t)) || false;
                } else if (advisorSelection === 'systems') {
                    matchesAdvisor = scale.category.some(cat => ['Logistics', 'MIS'].includes(cat));
                }
            }

            return matchesSearch && matchesCategory && matchesAdvisor;
        });
    }, [scales, searchQuery, selectedCategory, advisorSelection]);

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
                                    { id: 'systems', icon: <Settings className="w-6 h-6" />, label: t(locale, 'scales.advisor.opt4') }
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

                    {!session && (
                        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-700">
                            <Lock className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{t(locale, 'scales.advisor.loginRequired')}</p>
                        </div>
                    )}

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
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredScales.map(scale => (
                                <div 
                                    key={scale.id} 
                                    className={`bg-white rounded-3xl border transition-all duration-500 overflow-hidden flex flex-col group ${
                                        expandedScale === scale.id 
                                        ? 'ring-4 ring-indigo-500/20 shadow-2xl md:col-span-2 lg:col-span-3 border-indigo-200' 
                                        : 'border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300'
                                    }`}
                                >
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex flex-wrap gap-2 max-w-[70%]">
                                                {scale.category.map(cat => (
                                                    <div 
                                                        key={cat}
                                                        className="px-2 py-1 bg-indigo-50 rounded-lg text-[9px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 whitespace-nowrap"
                                                    >
                                                        {t(locale, `scales.${cat.toLowerCase()}`)}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold bg-slate-50 px-2.5 py-1.5 rounded-full border border-slate-100">
                                                <Layers className="w-3.5 h-3.5" />
                                                {scale.items?.length || 0}
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                                            {isVi ? scale.name_vi : scale.name_en}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {isVi ? scale.description_vi : scale.description_en}
                                        </p>
                                        
                                        <div className="mt-auto space-y-4">
                                            {scale.tags && scale.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {scale.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-slate-400 font-medium">#{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                        <UserCheck className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{t(locale, 'scales.author')}</p>
                                                        <p className="text-xs text-slate-700 font-bold truncate max-w-[150px]">{scale.author} ({scale.year})</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                        <button 
                                            onClick={() => handleExpandScale(scale.id)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                                expandedScale === scale.id 
                                                ? 'bg-slate-900 text-white shadow-lg' 
                                                : 'text-indigo-600 hover:bg-indigo-50'
                                            }`}
                                        >
                                            {!session && <Lock className="w-3.5 h-3.5" />}
                                            {expandedScale === scale.id ? (isVi ? 'Đóng chi tiết' : 'Close details') : (isVi ? 'Xem câu hỏi' : 'View Scale')}
                                        </button>
                                        <div className="flex items-center gap-4">
                                            <button className="p-2.5 text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 rounded-xl shadow-sm transition-all hover:shadow-md">
                                                <FileSpreadsheet className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {expandedScale === scale.id && session && (
                                        <div className="p-10 bg-white border-t border-slate-100 animate-in slide-in-from-bottom-2 duration-500">
                                            <div className="grid lg:grid-cols-3 gap-16">
                                                <div className="lg:col-span-2">
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                                                            <Layers className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                                                {isVi ? 'Hệ thống câu hỏi' : 'Validated Items'}
                                                            </h4>
                                                            <p className="text-slate-400 text-sm">{isVi ? 'Toàn bộ câu hỏi đã qua kiểm định' : 'Scientifically validated survey items'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-4">
                                                        {scale.items?.map((item) => (
                                                            <div key={item.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group/item">
                                                                <div className="flex items-start gap-6">
                                                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-indigo-600 text-sm shadow-sm group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                                                                        {item.code}
                                                                    </div>
                                                                    <div className="flex-1 pt-1">
                                                                        <p className="text-slate-800 font-bold text-lg mb-2">{isVi ? item.text_vi : item.text_en}</p>
                                                                        <p className="text-xs text-slate-400 italic font-medium">
                                                                            {isVi ? item.text_en : item.text_vi}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-12">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <Quote className="w-5 h-5 text-indigo-600" />
                                                            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">
                                                                {isVi ? 'Trích dẫn APA' : 'APA Citation'}
                                                            </h4>
                                                        </div>
                                                        <div className="p-6 bg-indigo-50/50 rounded-3xl text-sm text-slate-700 italic border border-indigo-100 relative pt-10">
                                                            <Quote className="absolute top-4 left-6 w-8 h-8 text-indigo-200/50" />
                                                            {scale.citation}
                                                        </div>
                                                    </div>

                                                    {scale.research_model && (
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <HelpCircle className="w-5 h-5 text-indigo-600" />
                                                                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">
                                                                    {isVi ? 'Ứng dụng trong Mô hình' : 'Model Application'}
                                                                </h4>
                                                            </div>
                                                            <div className="px-4 py-3 bg-slate-900 text-indigo-300 rounded-xl text-xs font-bold inline-flex items-center gap-2 border border-slate-800">
                                                                <Target className="w-4 h-4" />
                                                                {scale.research_model}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="pt-8 border-t border-slate-100">
                                                        <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 group">
                                                            <FileSpreadsheet className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                                            {isVi ? 'TẢI FILE MẪU EXCEL' : 'DOWNLOAD EXCEL'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer locale={locale} />
        </div>
    );
}
