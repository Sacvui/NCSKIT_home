'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ChiSquareResultsProps {
    results: any;
}

/**
 * Chi-Square Test Results Component
 * Displays chi-square test results with observed and expected frequencies
 */
export const ChiSquareResults = React.memo(function ChiSquareResults({ results }: ChiSquareResultsProps) {
    if (!results) return null;

    const { statistic, df, pValue, observed, expected } = results;

    return (
        <div className="space-y-8 font-sans">
            <div className="bg-white border-t-2 border-b-2 border-teal-600 p-6">
                <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-teal-600 inline-block pb-1 mb-4 text-teal-800">
                    Chi-Square Test Result
                </h3>
                <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="p-4 bg-teal-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">X-squared</div>
                        <div className="text-2xl font-bold text-teal-700">{statistic.toFixed(3)}</div>
                    </div>
                    <div className="p-4 bg-teal-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">df</div>
                        <div className="text-2xl font-bold text-teal-600">{df}</div>
                    </div>
                    <div className="p-4 bg-teal-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">p-value</div>
                        <div className={`text-xl font-bold ${pValue < 0.05 ? 'text-green-600' : 'text-red-500'}`}>
                            {pValue < 0.001 ? '< .001' : pValue.toFixed(4)}
                        </div>
                    </div>
                </div>
                {results.cramersV !== undefined && (
                    <div className="mt-6 text-center">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">Cramer&apos;s V (Effect Size)</div>
                        <div className="text-2xl font-bold text-teal-800">{results.cramersV.toFixed(3)}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            {results.cramersV > 0.5 ? '(Hiệu ứng mạnh)' : results.cramersV > 0.3 ? '(Hiệu ứng trung bình)' : '(Hiệu ứng yếu)'}
                        </p>
                    </div>
                )}
                <p className="text-sm text-gray-600 mt-4 text-center italic">
                    {pValue < 0.05
                        ? 'Có mối liên hệ có ý nghĩa thống kê giữa hai biến (H0 bị bác bỏ).'
                        : 'Không có mối liên hệ có ý nghĩa thống kê giữa hai biến (Chưa đủ bằng chứng bác bỏ H0).'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Observed Counts */}
                <div className="bg-white border border-gray-200 p-4 shadow-sm">
                    <h4 className="font-bold mb-3 text-teal-800 uppercase text-xs tracking-wider">Bảng Tần số Quan sát (Observed)</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border"></th>
                                    {observed.cols.map((c: string, i: number) => <th key={i} className="p-2 border font-semibold">{c}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {observed.rows.map((r: string, idx: number) => (
                                    <tr key={idx}>
                                        <td className="p-2 border font-semibold bg-gray-50">{r}</td>
                                        {observed.data[idx].map((val: number, i: number) => (
                                            <td key={i} className="p-2 border text-center">{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expected Counts */}
                <div className="bg-white border border-gray-200 p-4 shadow-sm">
                    <h4 className="font-bold mb-3 text-gray-600 uppercase text-xs tracking-wider">Bảng Tần số Kỳ vọng (Expected)</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border-collapse text-gray-500">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-2 border"></th>
                                    {expected.cols.map((c: string, i: number) => <th key={i} className="p-2 border font-medium">{c}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {expected.rows.map((r: string, idx: number) => (
                                    <tr key={idx}>
                                        <td className="p-2 border font-medium bg-gray-50">{r}</td>
                                        {expected.data[idx].map((val: number, i: number) => (
                                            <td key={i} className="p-2 border text-center">{val.toFixed(1)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ChiSquareResults;
