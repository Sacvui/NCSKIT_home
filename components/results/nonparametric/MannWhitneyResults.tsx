'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MannWhitneyResultsProps {
    results: any;
    columns: string[];
}

/**
 * Mann-Whitney U Test Results Component
 * Displays Mann-Whitney U test results with median comparison
 */
export const MannWhitneyResults = React.memo(function MannWhitneyResults({ results, columns }: MannWhitneyResultsProps) {
    if (!results) return null;
    const { statistic, pValue, median1, median2, effectSize } = results;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-8 font-sans">
            <div className="bg-white border-t-2 border-b-2 border-cyan-600 p-6">
                <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-cyan-600 inline-block pb-1 mb-4 text-cyan-800">
                    Mann-Whitney U Test
                </h3>
                <div className="grid grid-cols-3 gap-6 text-center max-w-2xl mx-auto">
                    <div className="p-4 bg-cyan-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">Statistic (W)</div>
                        <div className="text-2xl font-bold text-cyan-700">{statistic}</div>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">p-value</div>
                        <div className={`text-xl font-bold ${significant ? 'text-green-600' : 'text-gray-600'}`}>
                            {pValue < 0.001 ? '< .001' : pValue.toFixed(4)} {significant && '***'}
                        </div>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">Effect Size (r)</div>
                        <div className="text-2xl font-bold text-cyan-700">{effectSize?.toFixed(3)}</div>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center italic">
                    {significant
                        ? 'Có sự khác biệt có ý nghĩa thống kê về phân phối giữa hai nhóm (H0 bị bác bỏ).'
                        : 'Không có sự khác biệt có ý nghĩa thống kê giữa hai nhóm (Chưa đủ bằng chứng bác bỏ H0).'}
                </p>
            </div>

            <div className="bg-gray-50 p-6 border rounded-sm max-w-2xl mx-auto">
                <h4 className="font-bold mb-3 text-cyan-800 uppercase text-xs tracking-wider">Median Comparison</h4>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="py-2 text-left">Group</th>
                            <th className="py-2 text-right">Median</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100">
                            <td className="py-2 font-medium">{columns[0] || 'Group 1'}</td>
                            <td className="py-2 text-right font-bold text-gray-700">{median1?.toFixed(3)}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="py-2 font-medium">{columns[1] || 'Group 2'}</td>
                            <td className="py-2 text-right font-bold text-gray-700">{median2?.toFixed(3)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default MannWhitneyResults;
