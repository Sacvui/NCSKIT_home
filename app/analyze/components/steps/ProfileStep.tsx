'use client';

import React from 'react';
import { DataProfiler } from '@/components/DataProfiler';
import { useAnalyzeState, useAnalyzeActions } from '../context/AnalyzeContext';
import { useAnalyzeHandlers } from '../hooks/useAnalyzeHandlers';

export function ProfileStep() {
    const state = useAnalyzeState();
    const actions = useAnalyzeActions();
    const { handleProceedToAnalysis } = useAnalyzeHandlers();

    if (!state.profile) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Chưa có dữ liệu để hiển thị</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Kiểm tra dữ liệu
                    </h2>
                    <p className="text-gray-600">
                        File: <span className="font-medium">{state.filename}</span> •
                        {state.data.length} dòng
                    </p>
                </div>
                <button
                    onClick={handleProceedToAnalysis}
                    className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
                >
                    Tiếp tục phân tích →
                </button>
            </div>

            <DataProfiler profile={state.profile} />

            <div className="flex justify-end">
                <button
                    onClick={handleProceedToAnalysis}
                    className="px-8 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-semibold text-lg"
                >
                    Tiếp tục phân tích →
                </button>
            </div>
        </div>
    );
}
