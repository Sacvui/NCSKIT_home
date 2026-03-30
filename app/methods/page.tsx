"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MethodsGuide from '@/components/landing/MethodsGuide';
import { createClient } from "@/utils/supabase/client";
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

export default function MethodsPage() {
    const [user, setUser] = useState<any>(null);
    const [locale, setLocale] = useState<Locale>('vi');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });

        setLocale(getStoredLocale());
        setMounted(true);

        const handleLocaleChange = () => {
            setLocale(getStoredLocale());
        };

        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Professional Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header user={user} />

                <main className="flex-grow container mx-auto px-6 py-16 md:py-24">
                    <div className="text-center mb-16 md:mb-20">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            {t(locale, 'methods_guide_page.title')}
                        </h1>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                            {t(locale, 'methods_guide_page.desc')}
                        </p>
                        <div className="mt-8 w-24 h-1.5 bg-indigo-600 mx-auto rounded-full opacity-20"></div>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <MethodsGuide initialLocale={locale} />
                    </div>
                </main>

                <Footer locale={locale} />
            </div>
        </div>
    );
}
