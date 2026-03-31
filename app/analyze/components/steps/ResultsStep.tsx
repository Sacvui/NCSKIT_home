'use client';

import React from 'react';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { useAnalyzeState, useAnalyzeActions } from '../../context/AnalyzeContext';
import { useAnalyzeHandlers } from '../../hooks/useAnalyzeHandlers';
import { useAuth } from '@/context/AuthContext';
import { t } from '@/lib/i18n';

export function ResultsStep() {
    const state = useAnalyzeState();
    const actions = useAnalyzeActions();
    const { handleProceedToEFA, handleProceedToCFA, handleProceedToSEM, handleNewAnalysis } = useAnalyzeHandlers();
    const { profile: userProfile } = useAuth();

    if (!state.results) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">{state.locale === 'vi' ? 'Chưa có kết quả phân tích' : 'No analysis results available'}</p>
                <button
                    onClick={() => actions.setStep('analyze')}
                    className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                    {t(state.locale, 'common.back')}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {t(state.locale, 'analyze.results.title')}
                    </h2>
                    <p className="text-gray-600">
                        {t(state.locale, `analyze.methods.${state.analysisType.replace('-select', '').replace('-', '_')}`) || state.analysisType} • {state.scaleName || state.filename}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleNewAnalysis}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {t(state.locale, 'analyze.results.back')}
                    </button>
                    <button
                        onClick={() => actions.setIsSaveModalOpen(true)}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                        {state.locale === 'vi' ? 'Lưu kết quả' : 'Save Results'}
                    </button>
                </div>
            </div>

            <ResultsDisplay
                results={state.results}
                analysisType={state.analysisType}
                onProceedToEFA={handleProceedToEFA}
                onProceedToCFA={handleProceedToCFA}
                onProceedToSEM={handleProceedToSEM}
                columns={state.results?.columns || []}
                userProfile={userProfile}
                scaleName={state.scaleName}
            />
        </div>
    );
}
