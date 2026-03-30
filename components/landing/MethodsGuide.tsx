"use client";

import { useState, useEffect } from 'react';
import {
    BarChart3,
    Shield,
    Layers,
    Activity,
    Network,
    TrendingUp,
    Grid3x3,
    ChevronDown,
    ArrowRight,
    BookOpen,
    Play,
    ListChecks,
    FileText,
    Cpu
} from 'lucide-react';
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
            bg: 'bg-blue-50'
        },
        {
            id: 'cronbach',
            i18nKey: 'cronbach',
            icon: Shield,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            id: 'efa',
            i18nKey: 'efa',
            icon: Layers,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
        {
            id: 'ttest',
            i18nKey: 'ttest',
            icon: Cpu,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50'
        },
        {
            id: 'anova',
            i18nKey: 'anova',
            icon: Grid3x3,
            color: 'text-cyan-600',
            bg: 'bg-cyan-50'
        },
        {
            id: 'correlation',
            i18nKey: 'correlation',
            icon: Network,
            color: 'text-rose-600',
            bg: 'bg-rose-50'
        },
        {
            id: 'regression',
            i18nKey: 'regression',
            icon: TrendingUp,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        {
            id: 'chisq',
            i18nKey: 'chisq',
            icon: Activity,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            id: 'nonparam',
            i18nKey: 'nonparam',
            icon: ListChecks,
            color: 'text-teal-600',
            bg: 'bg-teal-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar List */}
            <div className="lg:col-span-4 flex flex-col gap-2">
                {methodsData.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => setActiveId(method.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${activeId === method.id
                                ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-200'
                                : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <div className={`w-10 h-10 ${method.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <method.icon className={`w-5 h-5 ${method.color}`} />
                        </div>
                        <div>
                            <div className={`font-semibold ${activeId === method.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                {t(locale, `methods_guide.${method.i18nKey}.name`)}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1">
                                {t(locale, `methods_guide.${method.i18nKey}.desc`)}
                            </div>
                        </div>
                        {activeId === method.id && (
                            <ArrowRight className="w-4 h-4 text-indigo-400 ml-auto" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[500px]">
                    {activeId ? (
                        (() => {
                            const method = methodsData.find(m => m.id === activeId);
                            if (!method) return null;
                            const steps = t(locale, `methods_guide.${method.i18nKey}.steps`);
                            const stepsArray = Array.isArray(steps) ? steps : [];
                            
                            return (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                                        <div className={`w-14 h-14 ${method.bg} rounded-2xl flex items-center justify-center`}>
                                            <method.icon className={`w-7 h-7 ${method.color}`} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">
                                                {t(locale, `methods_guide.${method.i18nKey}.name`)}
                                            </h2>
                                            <p className="text-slate-500">
                                                {t(locale, `methods_guide.${method.i18nKey}.desc`)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="text-slate-600">
                                            <p><span className="font-bold text-slate-800">Purpose:</span> {t(locale, `methods_guide.${method.i18nKey}.purpose`)}</p>
                                        </div>

                                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-indigo-600" />
                                                {t(locale, `methods_guide.${method.i18nKey}.stepTitle`)}
                                            </h4>
                                            <ul className="space-y-2">
                                                {stepsArray.map((step: string, index: number) => (
                                                    <li key={index} className="flex gap-3 text-sm text-slate-600">
                                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                                            {index + 1}
                                                        </span>
                                                        {step}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {t(locale, `methods_guide.${method.i18nKey}.note`) !== `methods_guide.${method.i18nKey}.note` && (
                                            <p className="text-sm italic text-slate-500">
                                                {t(locale, `methods_guide.${method.i18nKey}.note`)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                                        <a href="/analyze" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg text-sm group">
                                            <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
                                            {t(locale, 'methods_guide.cta')}
                                        </a>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <BookOpen className="w-12 h-12 mb-4 opacity-50" />
                            <p>{t(locale, 'methods_guide.select')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
