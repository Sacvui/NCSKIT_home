'use client';

import React from 'react';
import { FileUpload } from '@/components/FileUpload';
import { useAnalyzeState, useAnalyzeActions } from '../../context/AnalyzeContext';
import { useAnalyzeHandlers } from '../../hooks/useAnalyzeHandlers';
import { t } from '@/lib/i18n';

export function UploadStep() {
    const state = useAnalyzeState();
    const { handleDataLoaded } = useAnalyzeHandlers();

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {t(state.locale, 'analyze.upload.title')}
                </h2>
                <p className="text-gray-600">
                    {t(state.locale, 'analyze.upload.desc')}
                </p>
            </div>

            <FileUpload onDataLoaded={handleDataLoaded} locale={state.locale} />

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">{state.locale === 'vi' ? 'Lưu ý:' : 'Note:'}</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• {state.locale === 'vi' ? 'Dòng đầu tiên nên là tên biến (header)' : 'First row should be variable names (header)'}</li>
                    <li>• {t(state.locale, 'analyze.common.security')}</li>
                </ul>
            </div>
        </div>
    );
}
