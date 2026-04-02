'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DocNav from '@/components/docs/DocNav';
import { getStoredLocale, type Locale } from '@/lib/i18n';

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [locale, setLocale] = useState<Locale>('vi');

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header hideNav={false} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer locale={locale} />
        </div>
    );
}
