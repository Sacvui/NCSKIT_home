'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface KruskalWallisResultsProps {
    results: any;
}

/**
 * Kruskal-Wallis Test Results Component
 * Displays Kruskal-Wallis test results with group medians
 */
export const KruskalWallisResults = React.memo(function KruskalWallisResults({ results }: KruskalWallisResultsProps) {
    const pValue = results.pValue;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Kruskal-Wallis Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Chi-Square Statistic</td>
                                <td className="py-2 text-right">{results.statistic?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Degrees of Freedom (df)</td>
                                <td className="py-2 text-right">{results.df}</td>
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

            <Card>
                <CardHeader>
                    <CardTitle>Group Medians</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        {results.medians?.map((median: number, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="font-medium text-gray-700">Group {idx + 1}</span>
                                <span className="font-bold text-gray-900">{median.toFixed(3)}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800">
                    {significant
                        ? `Có sự khác biệt có ý nghĩa thống kê giữa các nhóm (Chi-square(${results.df}) = ${results.statistic?.toFixed(3)}, p = ${pValue?.toFixed(4)} < 0.05).`
                        : `Không có sự khác biệt có ý nghĩa thống kê giữa các nhóm (Chi-square(${results.df}) = ${results.statistic?.toFixed(3)}, p = ${pValue?.toFixed(4)} >= 0.05).`}
                </p>
            </div>
        </div>
    );
});\r\n\r\nexport default KruskalWallisResults;
