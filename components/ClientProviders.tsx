'use client';

import React, { useMemo } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import FeedbackWidget from '@/components/feedback/FeedbackWidget';
import ClientToaster from '@/components/ui/ClientToaster';

export function ClientProviders({ children }: { children: React.ReactNode }) {
    // Memoize the content to prevent re-mounting sub-providers and children
    // unless the entire app is refreshed. This kills the Auth loop.
    const content = useMemo(() => (
        <LanguageProvider>
            {children}
            <FeedbackWidget />
            <ClientToaster />
        </LanguageProvider>
    ), [children]);

    return (
        <AuthProvider>
            {content}
        </AuthProvider>
    );
}
