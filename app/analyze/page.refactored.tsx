'use client';

/**
 * Analyze Page - Refactored Version
 * 
 * This is the NEW modular version of the analyze page.
 * Original: 2,068 lines → Refactored: ~100 lines
 * 
 * Architecture:
 * - AnalyzeContext: Centralized state management
 * - useAnalyzeHandlers: All action handlers
 * - Step components: UploadStep, ProfileStep, AnalyzeStep, ResultsStep
 */

export const dynamic = 'force-dynamic';

import React, { useEffect } from 'react';
import { AnalyzeProvider, useAnalyzeState, useAnalyzeActions } from './context/AnalyzeContext';
import { UploadStep, ProfileStep, AnalyzeStep, ResultsStep } from './components/steps';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Toast } from '@/components/ui/Toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { initWebR } from '@/lib/webr-wrapper';

function AnalyzeContent() {
    const state = useAnalyzeState();
    const actions = useAnalyzeActions();
    const { profile: userProfile } = useAuth();

    // Initialize WebR on mount
    useEffect(() => {
        initWebR().catch(console.error);
    }, []);

    // Step mapping for StepIndicator
    const getStepIndex = () => {
        switch (state.step) {
            case 'upload': return 0;
            case 'profile': return 1;
            case 'analyze': return 2;
            case 'results': return 3;
            default: return 0;
        }
    };

    const steps = [
        { id: 'upload', label: 'Dữ liệu' },
        { id: 'profile', label: 'Kiểm tra' },
        { id: 'analyze', label: 'Phân tích' },
        { id: 'results', label: 'Kết quả' },
    ];

    // Render current step
    const renderStep = () => {
        switch (state.step) {
            case 'upload':
                return <UploadStep />;
            case 'profile':
                return <ProfileStep />;
            case 'analyze':
                return <AnalyzeStep />;
            case 'results':
                return <ResultsStep />;
            default:
                return <UploadStep />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-violet-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Step Indicator */}
                <div className="mb-8">
                    <StepIndicator
                        steps={steps}
                        currentStep={getStepIndex()}
                        onStepClick={(index) => {
                            const stepMap = ['upload', 'profile', 'analyze', 'results'];
                            // Only allow going back, not forward
                            if (index <= getStepIndex()) {
                                actions.setStep(stepMap[index] as any);
                            }
                        }}
                    />
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    {renderStep()}
                </div>
            </main>

            <Footer />

            {/* Toast Notifications */}
            {state.toast && (
                <Toast
                    message={state.toast.message}
                    type={state.toast.type}
                    onClose={actions.hideToast}
                />
            )}
        </div>
    );
}

export default function AnalyzePageRefactored() {
    return (
        <AnalyzeProvider>
            <AnalyzeContent />
        </AnalyzeProvider>
    );
}
