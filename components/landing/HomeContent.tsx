'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    BookOpen,
    Sparkles,
    BarChart3,
    Library,
    Cpu,
    ShieldCheck,
    Search,
    Zap,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    NcsIconSpeed,
    NcsIconAI,
    NcsIconSecurity,
    NcsIconReliability,
    NcsIconEFA,
    NcsIconCFA,
    NcsIconSEM,
    NcsIconRegression,
    NcsIconComparison,
    NcsIconCorrelation,
    NcsIconNonParam
} from '../ui/NcsIcons';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';
import Footer from '@/components/layout/Footer';
import MethodsGuide from './MethodsGuide';

export default function HomeContent() {
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="overflow-x-hidden">
            {/* Beta Warning Banner */}
            <motion.div 
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                className="bg-slate-900 border-b border-indigo-500/20 text-white px-4 py-3 relative z-20"
            >
                <div className="container mx-auto flex items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-indigo-600 p-1.5 rounded-lg mt-0.5 md:mt-0 shadow-lg shadow-indigo-500/20">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-indigo-100">
                            <span className="font-black uppercase tracking-wider bg-white text-slate-900 px-2 py-0.5 rounded text-[9px] mr-2 align-middle">{locale === 'vi' ? 'PHIÊN BẢN 2026' : '2026 VERSION'}</span>
                            {t(locale, 'beta.warning')}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Hero Section */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="container mx-auto px-6 py-28 text-center relative"
            >
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-10 blur-[120px] pointer-events-none -z-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600 rounded-full"></div>
                </div>

                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{t(locale, 'hero.badge')}</span>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                    {t(locale, 'hero.title')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600">
                        {t(locale, 'hero.subtitle')}
                    </span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                    {t(locale, 'hero.description')}
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <Link
                        href="/analyze"
                        className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-200 text-sm uppercase tracking-widest group"
                    >
                        <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {t(locale, 'hero.cta')}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                         href="/docs/user-guide"
                         className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black hover:bg-slate-50 transition-all text-sm uppercase tracking-widest shadow-sm"
                    >
                         <BookOpen className="w-5 h-5" />
                         {t(locale, 'hero.learn')}
                    </Link>
                </motion.div>

                {/* Main Feature Highlight: PLS-SEM 2026 */}
                <motion.div variants={itemVariants} className="mt-20 max-w-5xl mx-auto">
                    <Link href="/analyze2" className="block group">
                        <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 md:p-14 shadow-2xl border border-slate-800 transition-all duration-500 group-hover:border-indigo-500/50">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full -mr-48 -mt-48 transition-all group-hover:bg-indigo-600/20"></div>
                            
                            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                                <div className="flex-1 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-black mb-6 uppercase tracking-widest">
                                        <Cpu className="w-3.5 h-3.5" />
                                        <span>{t(locale, 'plssem.badge')}</span>
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                                        {t(locale, 'plssem.title')}
                                    </h3>
                                    <p className="text-slate-400 text-lg leading-relaxed mb-8 font-light">
                                        {t(locale, 'plssem.description')}
                                    </p>
                                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                        {['omega', 'htmt', 'bootstrap', 'ipma'].map(m => (
                                            <span key={m} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-indigo-300">
                                                {t(locale, `plssem.methods.${m}`)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/50 group-hover:scale-110 transition-transform duration-500">
                                        <ArrowRight className="w-10 h-10 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Smart Features Section */}
            <div className="bg-slate-50 py-32 border-y border-slate-100 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            {t(locale, 'features.why_title')}
                        </h2>
                        <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {/* Research Knowledge Base - NEW UPGRADE */}
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group"
                        >
                            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg shadow-blue-100 group-hover:rotate-6 transition-transform">
                                <Library className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">
                                {t(locale, 'features.library_title')}
                            </h3>
                            <p className="text-slate-500 leading-relaxed font-light mb-6">
                                {t(locale, 'features.library_desc')}
                            </p>
                            <Link href="/scales" className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                {t(locale, 'features.explore_library')} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        {/* AI Assistant */}
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group"
                        >
                            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg shadow-purple-100 group-hover:rotate-6 transition-transform">
                                <NcsIconAI size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">{t(locale, 'features.ai.title')}</h3>
                            <p className="text-slate-500 leading-relaxed font-light mb-6">{t(locale, 'features.ai.desc')}</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4" /> Interpreted results
                            </div>
                        </motion.div>

                        {/* Security */}
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group"
                        >
                            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg shadow-emerald-100 group-hover:rotate-6 transition-transform">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">{t(locale, 'features.security.title')}</h3>
                            <p className="text-slate-500 leading-relaxed font-light mb-6">{t(locale, 'features.security.desc')}</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                <Search className="w-4 h-4" /> Privacy-First Architecture
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Interactive Methods Guide Section */}
            <div className="container mx-auto px-6 py-32">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        {t(locale, 'methods.title')}
                    </h2>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto font-light leading-relaxed">
                        {t(locale, 'methods.subtitle')}
                    </p>
                </div>

                <MethodsGuide initialLocale={locale} />
            </div>

            {/* Standard Workflow Section */}
            <div className="bg-slate-900 py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight italic underline decoration-indigo-600/50 decoration-8 underline-offset-8">
                            {t(locale, 'workflow.title')}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-12">
                        {[1, 2, 3, 4].map(step => (
                            <motion.div 
                                key={step}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-sm text-center relative group"
                            >
                                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-8 mx-auto shadow-xl shadow-indigo-900/50 transition-transform group-hover:rotate-12">
                                    {step}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{t(locale, `workflow.step${step}.title`)}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed font-light">{t(locale, `workflow.step${step}.desc`)}</p>
                                {step < 4 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-6 -translate-y-1/2 z-20">
                                        <ArrowRight className="w-8 h-8 text-white/20" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-24 text-center">
                         <Link
                            href="/analyze"
                            className="inline-flex items-center justify-center gap-3 px-16 py-6 bg-white text-slate-900 rounded-[2rem] font-black hover:bg-slate-100 transition-all shadow-2xl text-lg uppercase tracking-[0.2em] group"
                        >
                            {t(locale, 'hero.cta')}
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            <Footer locale={locale} />
        </div>
    );
}
