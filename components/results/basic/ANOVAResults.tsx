'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ANOVAResultsProps {
    results: any;
    columns: string[];
}

/**
 * One-Way ANOVA Results Component
 * Displays ANOVA table and group means
 */
export function ANOVAResults({ results, columns }: ANOVAResultsProps) {
    const pValue = results.pValue;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>ANOVA Table</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="py-2 text-left font-semibold">Source</th>
                                <th className="py-2 text-right font-semibold">df</th>
                                <th className="py-2 text-right font-semibold">F</th>
                                <th className="py-2 text-right font-semibold">Sig.</th>
                                <th className="py-2 text-right font-semibold">η² (Eta Squared)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Between Groups</td>
                                <td className="py-2 text-right">{results.dfBetween?.toFixed(0)}</td>
                                <td className="py-2 text-right font-bold">{results.F?.toFixed(3)}</td>
                                <td className={`py-2 text-right font-bold ${significant ? 'text-green-600' : 'text-gray-600'}`}>
                                    {pValue?.toFixed(4)} {significant && '***'}
                                </td>
                                <td className="py-2 text-right">{results.etaSquared?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Within Groups</td>
                                <td className="py-2 text-right">{results.dfWithin?.toFixed(0)}</td>
                                <td className="py-2 text-right">-</td>
                                <td className="py-2 text-right">-</td>
                                <td className="py-2 text-right">-</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Group Means</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="py-2 text-left font-semibold">Group</th>
                                <th className="py-2 text-right font-semibold">Mean</th>
                            </tr>
                        </thead>
                        <tbody>
                            {columns.map((col, idx) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-2 font-medium">{col}</td>
                                    <td className="py-2 text-right">{results.groupMeans?.[idx]?.toFixed(3)}</td>
                                </tr>
                            ))}
                            <tr className="bg-blue-50">
                                <td className="py-2 font-bold text-blue-900">Grand Mean</td>
                                <td className="py-2 text-right font-bold text-blue-900">{results.grandMean?.toFixed(3)}</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800 mb-2">
                    <strong>Kiểm định Bartlett (Phương sai):</strong> p = {results.assumptionCheckP?.toFixed(4)}.
                    {results.assumptionCheckP < 0.05
                        ? <span className="text-orange-600 font-bold"> Cảnh báo: Phương sai giữa các nhóm không đồng nhất (vi phạm giả định ANOVA).</span>
                        : <span className="text-green-700"> Phương sai đồng nhất (thỏa mãn giả định).</span>}
                </p>
                <p className="text-sm text-gray-800">
                    {significant
                        ? `Có sự khác biệt có ý nghĩa thống kê giữa các nhóm (F(${results.dfBetween?.toFixed(0)}, ${results.dfWithin?.toFixed(0)}) = ${results.F?.toFixed(3)}, p = ${pValue?.toFixed(4)} < 0.05). Eta-squared = ${results.etaSquared?.toFixed(3)} cho thấy ${results.etaSquared > 0.14 ? 'hiệu ứng lớn' : results.etaSquared > 0.06 ? 'hiệu ứng trung bình' : 'hiệu ứng nhỏ'}.`
                        : `Không có sự khác biệt có ý nghĩa thống kê giữa các nhóm (F(${results.dfBetween?.toFixed(0)}, ${results.dfWithin?.toFixed(0)}) = ${results.F?.toFixed(3)}, p = ${pValue?.toFixed(4)} >= 0.05).`
                    }
                </p>
            </div>
        </div>
    );
}

export default ANOVAResults;
