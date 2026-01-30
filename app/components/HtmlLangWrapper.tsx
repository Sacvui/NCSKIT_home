"use client";

import { useEffect } from "react";
import { useLanguageContext } from "./LanguageProvider";

/**
 * Client component that dynamically updates the <html> lang attribute
 * based on the current locale from LanguageContext.
 * Also injects hreflang alternate links for SEO.
 */
export function HtmlLangWrapper({ children }: { children: React.ReactNode }) {
    const { locale } = useLanguageContext();

    useEffect(() => {
        // Update <html> lang attribute
        document.documentElement.lang = locale;

        // Update/create hreflang meta links
        const existingLinks = document.querySelectorAll('link[hreflang]');
        existingLinks.forEach(link => link.remove());

        const currentPath = window.location.pathname;
        const baseUrl = 'https://ncskit.org';

        // Create hreflang links
        const hreflangLinks = [
            { hreflang: 'en', href: `${baseUrl}${currentPath}` },
            { hreflang: 'vi', href: `${baseUrl}${currentPath}` },
            { hreflang: 'x-default', href: `${baseUrl}${currentPath}` },
        ];

        hreflangLinks.forEach(({ hreflang, href }) => {
            const link = document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = hreflang;
            link.href = href;
            document.head.appendChild(link);
        });

        // Update og:locale
        let ogLocale = document.querySelector('meta[property="og:locale"]');
        if (!ogLocale) {
            ogLocale = document.createElement('meta');
            ogLocale.setAttribute('property', 'og:locale');
            document.head.appendChild(ogLocale);
        }
        ogLocale.setAttribute('content', locale === 'vi' ? 'vi_VN' : 'en_US');

        // Add og:locale:alternate
        const existingAlternates = document.querySelectorAll('meta[property="og:locale:alternate"]');
        existingAlternates.forEach(meta => meta.remove());

        const alternateLocale = document.createElement('meta');
        alternateLocale.setAttribute('property', 'og:locale:alternate');
        alternateLocale.setAttribute('content', locale === 'vi' ? 'en_US' : 'vi_VN');
        document.head.appendChild(alternateLocale);

    }, [locale]);

    return <>{children}</>;
}
