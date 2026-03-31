'use client';

import React, { useState, useEffect } from 'react';
import { 
    Microscope, Shield, Grid3x3, TrendingUp, Info, GraduationCap, Scale, Cpu, FileCheck,
    Sparkles, Layers, Network, FlaskConical, Activity
} from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

export default function TheoryPage() {
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
                 style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="relative z-10">
                <main className="container mx-auto px-6 max-w-5xl py-16 md:py-24">
                    <div className="text-center mb-24">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            {t(locale, 'docs.theory.title')}
                        </h1>
                        <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed font-light">
                            {t(locale, 'docs.theory.subtitle')}
                        </p>
                    </div>

                    <div className="space-y-32">
                        {/* Measurement Model Section */}
                        <section>
                            <div className="flex items-center gap-5 mb-12 pb-6 border-b-2 border-slate-200">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Scale className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t(locale, 'docs.theory_content.measurement_title')}</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-10 mb-12">
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                        <Shield className="w-6 h-6 text-emerald-600" />
                                        {t(locale, 'docs.theory_content.reliability_title')}
                                    </h3>
                                    <p className="text-slate-600 text-base leading-relaxed mb-8 font-light">
                                        {t(locale, 'docs.theory_content.reliability_desc')}
                                    </p>
                                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between shadow-inner">
                                        <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">{t(locale, 'docs.theory_content.threshold')}</span>
                                        <span className="text-xl font-black text-emerald-800 tabular-nums"> &gt; 0.70</span>
                                    </div>
                                </div>

                                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                        <Microscope className="w-6 h-6 text-indigo-600" />
                                        {t(locale, 'docs.theory_content.convergent_title')}
                                    </h3>
                                    <p className="text-slate-600 text-base leading-relaxed mb-8 font-light">
                                        {t(locale, 'docs.theory_content.convergent_desc')}
                                    </p>
                                    <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between shadow-inner">
                                        <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">{t(locale, 'docs.theory_content.threshold')}</span>
                                        <span className="text-xl font-black text-indigo-800 tabular-nums"> &gt; 0.50</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
                                <h3 className="text-2xl font-extrabold text-slate-900 mb-10 flex items-center gap-4">
                                    <Grid3x3 className="w-8 h-8 text-purple-600" />
                                    {t(locale, 'docs.theory_content.discriminant_title')}
                                </h3>
                                <div className="grid md:grid-cols-2 gap-16">
                                    <div className="relative">
                                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-purple-100 rounded-full"></div>
                                        <p className="text-lg font-black text-slate-900 mb-4 tracking-tight">{t(locale, 'docs.theory_content.htmt_title')}</p>
                                        <p className="text-slate-500 text-base leading-relaxed mb-6 font-light">
                                            {t(locale, 'docs.theory_content.htmt_desc')}
                                        </p>
                                        <div className="text-xs font-black text-purple-700 bg-purple-50 px-4 py-2 rounded-xl inline-block border border-purple-100 shadow-sm">{t(locale, 'docs.theory_content.htmt_threshold')}</div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-purple-100 rounded-full"></div>
                                        <p className="text-lg font-black text-slate-900 mb-4 tracking-tight">{t(locale, 'docs.theory_content.fornell_title')}</p>
                                        <p className="text-slate-500 text-base leading-relaxed font-light">
                                            {t(locale, 'docs.theory_content.fornell_desc')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Structural Model Section */}
                        <section>
                            <div className="flex items-center gap-5 mb-12 pb-6 border-b-2 border-slate-200">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t(locale, 'docs.theory_content.structural_title')}</h2>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all duration-500">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
                                    <h3 className="text-xl font-black text-slate-900 mb-6 relative z-10">{t(locale, 'docs.theory_content.rsquare_title')}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 relative z-10 font-light">
                                        {t(locale, 'docs.theory_content.rsquare_desc')}
                                    </p>
                                    <div className="text-[10px] font-black text-blue-700 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full inline-block relative z-10 border border-blue-100">
                                        {t(locale, 'docs_theory_labels.predictive_accuracy')}
                                    </div>
                                </div>

                                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all duration-500">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
                                    <h3 className="text-xl font-black text-slate-900 mb-6 relative z-10">{t(locale, 'docs.theory_content.fsquare_title')}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 relative z-10 font-light">
                                        {t(locale, 'docs.theory_content.fsquare_desc')}
                                    </p>
                                    <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full inline-block relative z-10 border border-emerald-100">
                                        {t(locale, 'docs_theory_labels.effect_size')}
                                    </div>
                                </div>

                                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-400 transition-all duration-500">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
                                    <h3 className="text-xl font-black text-slate-900 mb-6 relative z-10">{t(locale, 'docs.theory_content.qsquare_title')}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 relative z-10 font-light">
                                        {t(locale, 'docs.theory_content.qsquare_desc')}
                                    </p>
                                    <div className="text-[10px] font-black text-purple-700 uppercase tracking-widest bg-purple-50 px-4 py-1.5 rounded-full inline-block relative z-10 border border-purple-100">
                                        {t(locale, 'docs_theory_labels.predictive_relevance')}
                                    </div>
                                </div>
                            </div>

                        {/* Modern Standards 2024-2026 (NEW SECTION) */}
                        <section className="relative">
                            <div className="absolute -top-16 left-0 right-0 flex justify-center opacity-10 blur-3xl pointer-events-none">
                                <div className="w-[500px] h-64 bg-indigo-500 rounded-full"></div>
                            </div>
                            
                            <div className="flex items-center gap-5 mb-12 pb-6 border-b-2 border-slate-200">
                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Sparkles className="w-6 h-6 text-yellow-400" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {t(locale, 'modern_research_standards.title')}
                                </h2>
                                <span className="ml-auto px-4 py-1 text-[10px] font-black bg-indigo-600 text-white rounded-full uppercase tracking-widest animate-pulse">Update 2026</span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative group overflow-hidden">
                                     <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Layers className="w-24 h-24" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-4">{t(locale, 'modern_research_standards.mediation.title')}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 font-light">
                                        {t(locale, 'modern_research_standards.mediation.desc')}
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
                                            <p className="text-[10px] font-black text-indigo-400 uppercase leading-none mb-1">{t(locale, 'modern_research_standards.mediation.metric')}</p>
                                            <p className="text-sm font-bold text-indigo-700">{t(locale, 'modern_research_standards.mediation.threshold')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Network className="w-24 h-24" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-4">{t(locale, 'modern_research_standards.modelling.title')}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 font-light">
                                        {t(locale, 'modern_research_standards.modelling.desc')}
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <p className="text-[10px] font-black text-emerald-400 uppercase leading-none mb-1">SRMR</p>
                                            <p className="text-sm font-bold text-emerald-700">{t(locale, 'modern_research_standards.modelling.srmr')}</p>
                                        </div>
                                        <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                                            <p className="text-[10px] font-black text-blue-400 uppercase leading-none mb-1">NFI</p>
                                            <p className="text-sm font-bold text-blue-700">{t(locale, 'modern_research_standards.modelling.nfi')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-10 bg-indigo-900 text-white rounded-[3rem] relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-10">
                                    <FlaskConical className="w-24 h-24" />
                                </div>
                                <div className="max-w-2xl">
                                    <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                                        <Activity className="w-5 h-5 text-indigo-400" />
                                        {t(locale, 'modern_research_standards.bootstrapping.title')}
                                    </h3>
                                    <p className="text-indigo-200 text-sm leading-relaxed font-light italic">
                                        "{t(locale, 'modern_research_standards.bootstrapping.desc')}"
                                    </p>
                                </div>
                            </div>
                        </section>

                            <div className="mt-12 bg-slate-900 p-12 md:p-16 rounded-[4rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                                    <TrendingUp className="w-80 h-80" />
                                </div>
                                <div className="relative z-10 max-w-3xl">
                                    <h3 className="text-2xl font-extrabold text-white mb-8 flex items-center gap-4">
                                        <Cpu className="w-8 h-8 text-indigo-400" />
                                        {t(locale, 'docs.theory_content.mediation_title')}
                                    </h3>
                                    <p className="text-slate-400 text-lg leading-relaxed mb-10 font-light">
                                        {t(locale, 'docs.theory_content.mediation_desc')}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 text-indigo-300 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                                            {t(locale, 'docs_theory_labels.mediation_analysis')}
                                        </div>
                                        <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 text-indigo-300 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                                            {t(locale, 'docs_theory_labels.bootstrapping_info')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Statistical Interpretation Section */}
                        <section>
                            <div className="bg-indigo-50 p-12 md:p-16 rounded-[4rem] border border-indigo-100 shadow-inner">
                                <div className="grid md:grid-cols-2 gap-20">
                                    <div>
                                        <h3 className="text-2xl font-extrabold text-slate-900 mb-10 flex items-center gap-4">
                                            <Info className="w-8 h-8 text-indigo-600" />
                                            {t(locale, 'docs.theory_content.sig_title')}
                                        </h3>
                                        <p className="text-slate-600 text-base leading-relaxed mb-10 font-light">
                                            {t(locale, 'docs.theory_content.sig_desc')}
                                        </p>
                                        <div className="space-y-4">
                                            {[
                                                { label: '* p < 0.05', key: 'sig95' },
                                                { label: '** p < 0.01', key: 'sig99' },
                                                { label: '*** p < 0.001', key: 'sig999' }
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-indigo-200 shadow-sm group hover:scale-[1.02] transition-transform cursor-default">
                                                    <span className="text-sm font-black text-slate-400 tabular-nums">{item.label}</span>
                                                    <span className="text-sm text-indigo-700 font-black uppercase tracking-widest group-hover:text-indigo-900 transition-colors">
                                                        {t(locale, `docs_theory_labels.${item.key}`)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-extrabold text-slate-900 mb-10 flex items-center gap-4">
                                            <FileCheck className="w-8 h-8 text-indigo-600" />
                                            {t(locale, 'docs.theory_content.beta_title')}
                                        </h3>
                                        <p className="text-slate-600 text-base leading-relaxed mb-10 font-light">
                                            {t(locale, 'docs.theory_content.beta_desc')}
                                        </p>
                                        <ul className="space-y-6">
                                            {[
                                                'docs.theory_content.beta_pos',
                                                'docs.theory_content.beta_neg',
                                                'docs.theory_content.beta_std'
                                            ].map((key) => (
                                                <li key={key} className="flex gap-6 group">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                                                    <p className="text-slate-500 text-base italic leading-relaxed font-medium group-hover:text-slate-900 transition-colors">
                                                        {t(locale, key)}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-32 pt-24 border-t-2 border-slate-200 flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-8 border-2 border-slate-200 shadow-inner group transition-transform hover:rotate-12">
                            <GraduationCap className="w-10 h-10 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <div className="text-center max-w-3xl px-6">
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight italic underline decoration-indigo-600/30 decoration-8 underline-offset-4">
                                {t(locale, 'docs.theory_content.cta_title')}
                            </h2>
                            <p className="text-slate-500 text-xl leading-relaxed mb-12 font-light">
                                {t(locale, 'docs.theory_content.cta_desc')}
                            </p>
                            <a href="/docs/case-study" className="inline-flex items-center gap-4 px-12 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-100 uppercase tracking-widest text-sm group">
                                {t(locale, 'docs.theory_content.cta_button')}
                                <TrendingUp className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
