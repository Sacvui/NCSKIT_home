import { vi } from './vi';
import { en } from './en';

export type Locale = 'vi' | 'en';

export const translations = {
    vi,
    en
} as const;

// Helper to get translation
export function t(locale: Locale, key: string, fallback?: string): string {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
        value = value?.[k];
    }

    if (value) return value;
    if (fallback) return fallback;
    
    // If not found, gracefully return the last part of the key instead of the full technical path
    return keys[keys.length - 1];
}

// Default locale
export const defaultLocale: Locale = 'vi';

// Get locale from localStorage or default
export function getStoredLocale(): Locale {
    if (typeof window === 'undefined') return defaultLocale;
    const stored = localStorage.getItem('ncsStat_locale');
    return (stored === 'en' || stored === 'vi') ? stored : defaultLocale;
}

// Save locale to localStorage
export function setStoredLocale(locale: Locale): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('ncsStat_locale', locale);
}
