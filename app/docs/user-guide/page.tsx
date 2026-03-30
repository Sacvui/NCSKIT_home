'use client';

import React, { useState, useEffect } from 'react';
import {
    BarChart2, GitCompare, TrendingUp, Layers, 
    ChevronDown, ChevronRight, Target, HelpCircle, Code, CheckCircle2, CircleDot
} from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

export default function UserGuidePage() {
    const [locale, setLocale] = useState<Locale>('vi');
    const [mounted, setMounted] = useState(false);
    const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

    useEffect(() => {
        setLocale(getStoredLocale());
        setMounted(true);

        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    if (!mounted) return null;

    const categories = [
        { key: 'reliability', icon: BarChart2, color: 'text-blue-700', methods: ['descriptive', 'cronbach'] },
        { key: 'comparison', icon: GitCompare, color: 'text-orange-700', methods: ['ttest', 'anova'] },
        { key: 'correlation', icon: TrendingUp, color: 'text-green-700', methods: ['correlation', 'regression'] },
        { key: 'structure', icon: Layers, color: 'text-purple-700', methods: ['efa'] }
    ];

    return (
        <div className="bg-slate-50 min-h-screen selection:bg-indigo-100 selection:text-indigo-900 pb-24">
            {/* Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="relative z-10">
                <main className="container mx-auto px-6 max-w-5xl py-16 md:py-24">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            {t(locale, 'docs.userguide.title')}
                        </h1>
                        <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed font-light">
                            {t(locale, 'docs.userguide.subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <Target className="w-8 h-8 text-blue-600 mb-4" />
                            <h3 className="font-bold text-slate-900 mb-3">{t(locale, 'docs_userguide_labels.selecting_title')}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-light">{t(locale, 'docs_userguide_labels.selecting_desc')}</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-4" />
                            <h3 className="font-bold text-slate-900 mb-3">{t(locale, 'docs_userguide_labels.apa_title')}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-light">{t(locale, 'docs_userguide_labels.apa_desc')}</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <HelpCircle className="w-8 h-8 text-amber-600 mb-4" />
                            <h3 className="font-bold text-slate-900 mb-3">{t(locale, 'docs_userguide_labels.support_title')}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-light">{t(locale, 'docs_userguide_labels.support_desc')}</p>
                        </div>
                    </div>

                    <div className="space-y-16">
                        {categories.map((cat) => (
                            <section key={cat.key}>
                                <h2 className={`text-2xl font-extrabold mb-8 flex items-center gap-3 ${cat.color}`}>
                                    <cat.icon className="w-8 h-8" />
                                    {t(locale, `methods.${cat.key}`)}
                                </h2>
                                <div className="grid gap-4">
                                    {cat.methods.map((methodId) => {
                                        const steps = t(locale, `methods_guide.${methodId}.steps`);
                                        const stepsArray = Array.isArray(steps) ? steps : [];
                                        const output = t(locale, `methods_guide.${methodId}.output`);
                                        const outputArray = Array.isArray(output) ? output : [];

                                        return (
                                            <div key={methodId} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
                                                <button 
                                                    onClick={() => setExpandedMethod(expandedMethod === methodId ? null : methodId)} 
                                                    className={`w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 text-left transition-colors ${expandedMethod === methodId ? 'bg-indigo-50/30' : ''}`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-extrabold text-slate-900 text-lg">
                                                            {t(locale, `methods_guide.${methodId}.name`)}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                            {t(locale, `methods_guide.${methodId}.desc`)}
                                                        </span>
                                                    </div>
                                                    <div className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-transform duration-300 ${expandedMethod === methodId ? 'rotate-180 bg-white shadow-sm' : ''}`}>
                                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                </button>
                                                
                                                {expandedMethod === methodId && (
                                                    <div className="px-8 py-10 border-t border-slate-100 bg-slate-50/30 animate-in fade-in slide-in-from-top-2 duration-500">
                                                        <p className="text-base text-slate-600 mb-10 italic leading-relaxed font-light">
                                                            {t(locale, `methods_guide.${methodId}.purpose`)}
                                                        </p>
                                                        
                                                        <div className="grid md:grid-cols-2 gap-12">
                                                            <div>
                                                                <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] mb-6 flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                                                    {t(locale, 'docs_userguide_labels.procedure_title')}
                                                                </h4>
                                                                <ol className="space-y-4">
                                                                    {stepsArray.map((s: string, i: number) => (
                                                                        <li key={i} className="flex gap-4">
                                                                            <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-900 shrink-0 shadow-sm">{i+1}</span>
                                                                            <span className="text-slate-600 text-sm leading-snug">{s}</span>
                                                                        </li>
                                                                    ))}
                                                                </ol>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] mb-6 flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                                                                    {t(locale, 'docs_userguide_labels.output_title')}
                                                                </h4>
                                                                <ul className="space-y-4">
                                                                    {outputArray.map((o: string, i: number) => (
                                                                        <li key={i} className="flex items-center gap-4">
                                                                            <div className="p-1.5 bg-emerald-50 rounded-lg">
                                                                                <CircleDot className="w-3.5 h-3.5 text-emerald-500" />
                                                                            </div>
                                                                            <span className="text-slate-600 text-sm font-medium">{o}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        {/* R Function Tag */}
                                                        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                                                            <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
                                                                <Code className="w-4 h-4 text-indigo-400" />
                                                                <span className="text-[11px] font-mono font-bold text-indigo-100/80">
                                                                    R: dynamic_call_engine()
                                                                </span>
                                                            </div>
                                                            <a href="/analyze" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
                                                                {t(locale, 'methods_guide.cta')} &rarr;
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
