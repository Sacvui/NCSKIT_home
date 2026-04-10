'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import FeedbackWidget from '@/components/feedback/FeedbackWidget';
import ClientToaster from '@/components/ui/ClientToaster';

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <LanguageProvider>
                {children}
                <FeedbackWidget />
                <ClientToaster />
            </LanguageProvider>
        </AuthProvider>
    );
}
