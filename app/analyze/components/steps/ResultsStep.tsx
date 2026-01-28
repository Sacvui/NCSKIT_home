'use client';

import React from 'react';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { useAnalyzeState, useAnalyzeActions } from '../context/AnalyzeContext';
import { useAnalyzeHandlers } from '../hooks/useAnalyzeHandlers';
import { useAuth } from '@/context/AuthContext';

export function ResultsStep() {
    const state = useAnalyzeState();
    const actions = useAnalyzeActions();
    const { handleProceedToEFA, handleProceedToCFA, handleProceedToSEM, handleNewAnalysis } = useAnalyzeHandlers();
    const { profile: userProfile } = useAuth();

    if (!state.results) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Chưa có kết quả phân tích</p>
                <button
                    onClick={() => actions.setStep('analyze')}
                    className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                    Quay lại phân tích
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Kết quả phân tích
                    </h2>
                    <p className="text-gray-600">
                        {state.analysisType} • {state.scaleName || state.filename}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleNewAnalysis}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Phân tích khác
                    </button>
                    <button
                        onClick={() => actions.setIsSaveModalOpen(true)}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                        Lưu kết quả
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
