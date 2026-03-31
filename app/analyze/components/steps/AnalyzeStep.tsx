'use client';

import React from 'react';
import { AnalysisSelector } from '@/components/AnalysisSelector';
import { useAnalyzeState, useAnalyzeActions } from '../../context/AnalyzeContext';
import { useAnalyzeHandlers } from '../../hooks/useAnalyzeHandlers';
import { WebRStatus } from '@/components/WebRStatus';
import { t } from '@/lib/i18n';
import type { AnalysisStep } from '@/types/analysis';

export function AnalyzeStep() {
    const state = useAnalyzeState();
    const actions = useAnalyzeActions();
    const { runAnalysis, getAllColumns } = useAnalyzeHandlers();

    const allColumns = getAllColumns();

    // Handle step selection from AnalysisSelector
    const handleSelect = (step: string) => {
        actions.setStep(step as AnalysisStep);
    };

    // Handle direct run analysis (for analyses that don't need variable selection)
    const handleRunAnalysis = (type: string) => {
        // For correlation and other simple analyses, run with all numeric columns
        runAnalysis(type, allColumns);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {t(state.locale, 'analyze.selector.title')}
                    </h2>
                    <p className="text-gray-600">
                        {state.data.length} {state.locale === 'vi' ? 'dòng dữ liệu' : 'data rows'} • {allColumns.length} {state.locale === 'vi' ? 'biến' : 'variables'}
                    </p>
                </div>
                <WebRStatus />
            </div>

            {state.isAnalyzing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {t(state.locale, 'analyze.common.analyzing')}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {t(state.locale, `analyze.methods.${state.analysisType.replace('-select', '').replace('-', '_')}`) || state.analysisType}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${state.analysisProgress}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                {state.analysisProgress}%
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <AnalysisSelector
                onSelect={handleSelect}
                onRunAnalysis={handleRunAnalysis}
                isAnalyzing={state.isAnalyzing}
                locale={state.locale}
            />
        </div>
    );
}
