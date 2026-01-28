'use client';

import React from 'react';
import { AnalysisSelector } from '@/components/AnalysisSelector';
import { useAnalyzeState, useAnalyzeActions } from '../../context/AnalyzeContext';
import { useAnalyzeHandlers } from '../../hooks/useAnalyzeHandlers';
import { WebRStatus } from '@/components/WebRStatus';

export function AnalyzeStep() {
    const state = useAnalyzeState();
    const { runAnalysis, getNumericColumns, getAllColumns } = useAnalyzeHandlers();

    const numericColumns = getNumericColumns();
    const allColumns = getAllColumns();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Chọn phương pháp phân tích
                    </h2>
                    <p className="text-gray-600">
                        {state.data.length} dòng dữ liệu • {allColumns.length} biến
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
                                Đang xử lý...
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {state.analysisType}
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
                onSelect={(type: string, selectedVars: string[]) => { runAnalysis(type, selectedVars); }}
                numericColumns={numericColumns}
                allColumns={allColumns}
                previousAnalysis={state.previousAnalysis}
            />
        </div>
    );
}
