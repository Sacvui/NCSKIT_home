'use client';

import React, { useEffect, useState } from 'react';
import { 
    BookOpen, Lightbulb, Workflow, PlayCircle, ChevronRight, 
    ArrowRight, Shield, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

export default function DocsOverviewPage() {
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

    const sections = [
        {
            id: 'theory',
            title: t(locale, 'docs.tabs.theory'),
            subtitle: t(locale, 'docs.theory.subtitle'),
            icon: Lightbulb,
            href: '/docs/theory',
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            description: t(locale, 'docs_overview.theory_desc')
        },
        {
            id: 'case-study',
            title: t(locale, 'docs.tabs.casestudy'),
            subtitle: t(locale, 'docs.casestudy.subtitle'),
            icon: Workflow,
            href: '/docs/case-study',
            color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            description: t(locale, 'docs_overview.casestudy_desc')
        },
        {
            id: 'user-guide',
            title: t(locale, 'docs.tabs.userguide'),
            subtitle: t(locale, 'docs.userguide.subtitle'),
            icon: PlayCircle,
            href: '/docs/user-guide',
            color: 'bg-amber-50 text-amber-600 border-amber-100',
            description: t(locale, 'docs_overview.userguide_desc')
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen selection:bg-indigo-100 selection:text-indigo-900 pb-24">
            {/* Professional Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="relative z-10">
                {/* Hero Header */}
                <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 blur-[120px] rounded-full -mr-64 -mt-64"></div>
                    <div className="container mx-auto px-6 max-w-5xl relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                            <div className="bg-indigo-600/20 p-6 rounded-[2.5rem] border border-indigo-500/30 shadow-2xl backdrop-blur-sm shrink-0">
                                <BookOpen className="w-16 h-16 text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                                    {t(locale, 'docs_overview.title')}
                                </h1>
                                <p className="text-slate-400 text-xl max-w-2xl leading-relaxed font-light">
                                    {t(locale, 'docs_overview.subtitle')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 max-w-5xl -mt-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        {sections.map((section) => (
                            <Link 
                                key={section.id} 
                                href={section.href}
                                className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col h-full"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border ${section.color} transition-colors group-hover:scale-110 duration-300`}>
                                    <section.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center justify-between">
                                    {section.title}
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </h3>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-4">{section.subtitle}</p>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                                    {section.description}
                                </p>
                                <div className="flex items-center text-indigo-600 font-bold text-sm mt-auto">
                                    {t(locale, 'docs_overview.cta')}
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-24 p-12 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden mb-24">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                            <BookOpen className="w-64 h-64" />
                        </div>
                        <div className="max-w-3xl relative z-10">
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-10 tracking-tight italic underline decoration-indigo-600/30 decoration-8 underline-offset-4">
                                {t(locale, 'docs_overview.why_title')}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-2">{t(locale, 'docs_overview.reason1_title')}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {t(locale, 'docs_overview.reason1_desc')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-2">{t(locale, 'docs_overview.reason2_title')}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {t(locale, 'docs_overview.reason2_desc')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
