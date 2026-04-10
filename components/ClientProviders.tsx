'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import FeedbackWidget from '@/components/feedback/FeedbackWidget';
import ClientToaster from '@/components/ui/ClientToaster';
import AuthRedirectHandler from '@/components/auth/AuthRedirectHandler';

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary>
            <LanguageProvider>
                <AuthProvider>
                    <AuthRedirectHandler />
                    {children}
                    <FeedbackWidget />
                    <ClientToaster />
                </AuthProvider>
            </LanguageProvider>
        </ErrorBoundary>
    );
}
