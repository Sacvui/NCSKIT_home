'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { t, type Locale } from '@/lib/i18n';

interface FooterProps {
    locale?: Locale;
}

export default function Footer({ locale = 'vi' }: FooterProps) {
    return (
        <footer className="border-t border-slate-200 mt-16 bg-slate-50/50">
            <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-12 gap-12 mb-12">
                    {/* About Section */}
                    <div className="md:col-span-6 lg:col-span-5">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            {t(locale, 'footer.aboutTitle')}
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-sm italic border-l-4 border-indigo-200 pl-4 py-1">
                            &quot;{t(locale, 'footer.aboutDesc')}&quot;
                        </p>
                    </div>

                    {/* Navigation & Status */}
                    <div className="md:col-span-6 lg:col-span-7 flex flex-col md:flex-row justify-end items-start md:items-center gap-8 md:gap-16">
                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">{t(locale, 'footer.resources')}</h4>
                            <div className="flex flex-col gap-2 text-sm text-slate-500">
                                <Link href="/terms" className="hover:text-indigo-600 transition-colors">{t(locale, 'footer.terms')}</Link>
                                <Link href="/privacy" className="hover:text-indigo-600 transition-colors">{t(locale, 'footer.privacy')}</Link>
                                <Link href="/sitemap.xml" className="hover:text-indigo-600 transition-colors uppercase text-[10px] font-black tracking-widest opacity-50">XML Sitemap</Link>
                                <div className="h-px w-8 bg-slate-200 my-1"></div>
                                <Link href="/terms" className="hover:text-orange-600 transition-colors font-medium text-orange-700/80 italic">{t(locale, 'footer.disclaimer')}</Link>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">{t(locale, 'footer.system')}</h4>
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                <div className="relative flex h-2.5 w-2.5">
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </div>
                                <span className="font-medium">{t(locale, 'footer.operational')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 text-center text-sm text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© 2026 ncsStat • Developed for Academic Research</p>
                    <p className="flex items-center gap-1">
                        Supported by Hai Rong Choi
                    </p>
                </div>
            </div>
        </footer>
    );
}
