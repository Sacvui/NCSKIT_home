'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface WilcoxonResultsProps {
    results: any;
}

/**
 * Wilcoxon Signed Rank Test Results Component
 * Displays Wilcoxon test results with median difference
 */
export const WilcoxonResults = React.memo(function WilcoxonResults({ results }: WilcoxonResultsProps) {
    const pValue = results.pValue;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Wilcoxon Signed Rank Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">V Statistic</td>
                                <td className="py-2 text-right">{results.statistic?.toFixed(1)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Median Difference</td>
                                <td className="py-2 text-right">{results.medianDiff?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">p-value</td>
                                <td className={`py-2 text-right font-bold ${significant ? 'text-green-600' : 'text-gray-600'}`}>
                                    {pValue?.toFixed(4)} {significant && '***'}
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 font-medium">Method</td>
                                <td className="py-2 text-right">{results.method}</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800">
                    {significant
                        ? `Có sự khác biệt có ý nghĩa thống kê giữa hai điều kiện (V = ${results.statistic?.toFixed(1)}, p = ${pValue?.toFixed(4)} < 0.05).`
                        : `Không có sự khác biệt có ý nghĩa thống kê giữa hai điều kiện (V = ${results.statistic?.toFixed(1)}, p = ${pValue?.toFixed(4)} >= 0.05).`}
                </p>
            </div>
        </div>
    );
});

export default WilcoxonResults;
