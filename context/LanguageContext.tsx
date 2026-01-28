'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Locale, getStoredLocale, setStoredLocale, t } from '@/lib/i18n';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
    toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('vi');
    const [isHydrated, setIsHydrated] = useState(false);

    // Load locale from storage on mount (client-side only)
    useEffect(() => {
        setLocaleState(getStoredLocale());
        setIsHydrated(true);
    }, []);

    // Update locale and persist to storage
    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        setStoredLocale(newLocale);

        // Dispatch custom event for any legacy components listening
        window.dispatchEvent(new CustomEvent('localechange', { detail: newLocale }));
    }, []);

    // Toggle between vi and en
    const toggleLocale = useCallback(() => {
        setLocale(locale === 'vi' ? 'en' : 'vi');
    }, [locale, setLocale]);

    // Translate function bound to current locale
    const translate = useCallback((key: string) => {
        return t(locale, key);
    }, [locale]);

    return (
        <LanguageContext.Provider value={{
            locale,
            setLocale,
            t: translate,
            toggleLocale
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

// For components that only need locale value
export function useLocale(): Locale {
    const { locale } = useLanguage();
    return locale;
}

// For components that only need translate function
export function useTranslate(): (key: string) => string {
    const { t } = useLanguage();
    return t;
}
