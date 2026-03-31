"use client";

import { useState, useEffect } from 'react';
import {
    BarChart3, Shield, Layers, Activity, Network, TrendingUp, Grid3x3,
    ChevronDown, ArrowRight, BookOpen, Play, ListChecks, FileText, Cpu,
    Dna, Zap, ArrowUpRight, CheckCircle2, FlaskConical, Target, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { t, Locale, getStoredLocale } from '@/lib/i18n';

interface MethodsGuideProps {
    initialLocale?: Locale;
}

export default function MethodsGuide({ initialLocale }: MethodsGuideProps) {
    const [locale, setLocale] = useState<Locale>(initialLocale || 'vi');
    const [activeId, setActiveId] = useState<string | null>('descriptive');

    useEffect(() => {
        if (!initialLocale) {
            setLocale(getStoredLocale());
        }
    }, [initialLocale]);

    const methodsData = [
        {
            id: 'descriptive',
            i18nKey: 'descriptive',
            icon: BarChart3,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            category: t(locale, 'methods_guide_labels.basic'),
            tag: 'R-Statistics'
        },
        {
            id: 'cronbach',
            i18nKey: 'cronbach',
            icon: Shield,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            category: t(locale, 'methods_guide_labels.measurement'),
            tag: 'Reliability'
        },
        {
            id: 'efa',
            i18nKey: 'efa',
            icon: Layers,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            category: t(locale, 'methods_guide_labels.structure'),
            tag: 'Exploratory'
        },
        {
            id: 'ttest',
            i18nKey: 'ttest',
            icon: Target,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            category: t(locale, 'methods_guide_labels.comparison'),
            tag: 'Parametric'
        },
        {
            id: 'anova',
            i18nKey: 'anova',
            icon: Grid3x3,
            color: 'text-cyan-600',
            bg: 'bg-cyan-50',
            category: t(locale, 'methods_guide_labels.comparison'),
            tag: 'ANOVA'
        },
        {
            id: 'correlation',
            i18nKey: 'correlation',
            icon: Network,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            category: t(locale, 'methods_guide_labels.relationship'),
            tag: 'Correlation'
        },
        {
            id: 'regression',
            i18nKey: 'regression',
            icon: TrendingUp,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            category: t(locale, 'methods_guide_labels.relationship'),
            tag: 'Causal'
        },
        {
            id: 'chisq',
            i18nKey: 'chisq',
            icon: Activity,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            category: t(locale, 'methods_guide_labels.categorical'),
            tag: 'Non-param'
        },
        {
            id: 'nonparam',
            i18nKey: 'nonparam',
            icon: ListChecks,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
            category: t(locale, 'methods_guide_labels.advanced'),
            tag: 'Robust'
        }
    ];

    const currentMethod = methodsData.find(m => m.id === activeId);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar List with Staggered Animation */}
            <div className="lg:col-span-4 flex flex-col gap-3">
                {methodsData.map((method, idx) => (
                    <motion.button
                        key={method.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setActiveId(method.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300 ${activeId === method.id
                                ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100/50 z-10'
                                : 'bg-white/60 border-transparent hover:bg-white hover:border-slate-200'
                            }`}
                    >
                        <div className={`w-12 h-12 ${method.bg} rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:rotate-6`}>
                            <method.icon className={`w-6 h-6 ${method.color}`} />
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                                    {method.category}
                                </span>
                            </div>
                            <div className={`font-bold text-lg ${activeId === method.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                                {t(locale, `methods_guide.${method.i18nKey}.name`)}
                            </div>
                        </div>
                        {activeId === method.id ? (
                            <div className="w-1.5 h-10 bg-indigo-600 rounded-full absolute -left-0.75 top-1/2 -translate-y-1/2"></div>
                        ) : (
                             <ArrowUpRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Premium Content Area */}
            <div className="lg:col-span-8 sticky top-24 h-fit">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeId || 'empty'}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="bg-white rounded-[2.5rem] border border-slate-200 shadow-inner p-10 md:p-14 relative overflow-hidden h-full min-h-[650px] flex flex-col"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 blur-[80px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50/50 blur-[60px] rounded-full -ml-32 -mb-32 pointer-events-none"></div>

                        {activeId && currentMethod ? (
                            <div className="relative z-10 flex flex-grow flex-col">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-16 h-16 ${currentMethod.bg} rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-indigo-100`}>
                                            <currentMethod.icon className={`w-8 h-8 ${currentMethod.color}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-200">
                                                    {currentMethod.tag}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-emerald-600">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                                        {t(locale, 'methods_guide_labels.scientific_standard')}
                                                    </span>
                                                </span>
                                            </div>
                                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                                {t(locale, `methods_guide.${currentMethod.i18nKey}.name`)}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] font-mono font-bold px-4 py-2 bg-slate-900 text-emerald-400 rounded-xl shadow-xl w-fit">
                                        <Cpu className="w-3.5 h-3.5" />
                                        <span>{t(locale, 'methods_guide_labels.r_engine')}</span>
                                    </div>
                                </div>

                                <div className="grid gap-10 flex-grow">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            {t(locale, 'methods_guide_labels.purpose_utility')}
                                        </h4>
                                        <p className="text-xl text-slate-600 leading-relaxed font-light">
                                            {t(locale, `methods_guide.${currentMethod.i18nKey}.purpose`)}
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-slate-50/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <FlaskConical className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                {t(locale, `methods_guide.${currentMethod.i18nKey}.stepTitle`)}
                                            </h4>
                                            <ul className="space-y-4">
                                                {(() => {
                                                    const steps = t(locale, `methods_guide.${currentMethod.i18nKey}.steps`);
                                                    const stepsArray = Array.isArray(steps) ? steps : [];
                                                    return stepsArray.map((step: string, index: number) => (
                                                        <motion.li 
                                                            key={index} 
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.1 * index }}
                                                            className="flex gap-4 text-sm text-slate-600"
                                                        >
                                                            <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[10px] font-black text-indigo-600">
                                                                {index + 1}
                                                            </span>
                                                            <span className="leading-snug">{step}</span>
                                                        </motion.li>
                                                    ));
                                                })()}
                                            </ul>
                                        </div>

                                        <div className="flex flex-col gap-6">
                                            <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex-grow">
                                                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-3">
                                                    <Info className="w-4 h-4 text-indigo-600" />
                                                    {t(locale, 'methods_guide_labels.expert_insights')}
                                                </h4>
                                                <p className="text-sm italic text-slate-500 leading-relaxed font-light">
                                                    {t(locale, `methods_guide.${currentMethod.i18nKey}.note`) !== `methods_guide.${currentMethod.i18nKey}.note` 
                                                        ? t(locale, `methods_guide.${currentMethod.i18nKey}.note`)
                                                        : t(locale, 'methods_guide_labels.apa_report_note')}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 px-6 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                                <Zap className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                                                <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-widest leading-none">
                                                    {t(locale, 'methods_guide_labels.realtime_processing')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-between pt-8 border-t border-slate-100">
                                    <div className="flex items-center -space-x-3">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${['bg-red-200','bg-blue-200','bg-green-200','bg-amber-200'][i-1]}`}></div>
                                        ))}
                                        <span className="ml-6 text-[10px] font-bold text-slate-400">
                                            {t(locale, 'methods_guide_labels.researches_done')}
                                        </span>
                                    </div>
                                    
                                    <a href="/analyze" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-[1.5rem] font-bold transition-all shadow-xl shadow-indigo-200 hover:shadow-slate-200 group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                        <Play className="w-4 h-4 fill-white" />
                                        <span>{t(locale, 'methods_guide.cta')}</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6">
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                                    <BookOpen className="w-20 h-20 opacity-20" />
                                </motion.div>
                                <p className="text-xl font-light tracking-wide">{t(locale, 'methods_guide.select')}</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
