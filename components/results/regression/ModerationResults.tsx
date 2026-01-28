'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ModerationResultsProps {
    results: any;
    columns: string[];
}

/**
 * Moderation Analysis Results Component
 * Displays moderation analysis with interaction effects
 */
export const ModerationResults = React.memo(function ModerationResults({ results, columns }: ModerationResultsProps) {
    const interactionP = results.interactionP;
    const significant = interactionP < 0.05;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Moderation Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Mô hình:</strong> {columns[0]} = b0 + b1*{columns[1]} + b2*{columns[2]} + b3*({columns[1]}×{columns[2]})
                        </p>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="py-2 text-left font-semibold">Term</th>
                                <th className="py-2 text-right font-semibold">Estimate</th>
                                <th className="py-2 text-right font-semibold">Std. Error</th>
                                <th className="py-2 text-right font-semibold">t</th>
                                <th className="py-2 text-right font-semibold">p-value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 font-medium">(Intercept)</td>
                                <td className="py-2 text-right">{results.interceptEst?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.interceptSE?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.interceptT?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.interceptP?.toFixed(4)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 font-medium">{columns[1]} (X)</td>
                                <td className="py-2 text-right">{results.xEst?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.xSE?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.xT?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.xP?.toFixed(4)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 font-medium">{columns[2]} (W)</td>
                                <td className="py-2 text-right">{results.wEst?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.wSE?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.wT?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.wP?.toFixed(4)}</td>
                            </tr>
                            <tr className={`border-b border-gray-200 ${significant ? 'bg-green-50' : ''}`}>
                                <td className="py-2 font-bold">X × W (Interaction)</td>
                                <td className="py-2 text-right font-bold">{results.interactionEst?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.interactionSE?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.interactionT?.toFixed(3)}</td>
                                <td className={`py-2 text-right font-bold ${significant ? 'text-green-600' : 'text-gray-600'}`}>
                                    {interactionP?.toFixed(4)} {significant && '***'}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded">
                            <span className="font-medium">R²:</span> {results.rSquared?.toFixed(4)}
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <span className="font-medium">Adjusted R²:</span> {results.rSquaredAdj?.toFixed(4)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800">
                    {significant
                        ? `Có hiệu ứng điều tiết có ý nghĩa thống kê (p = ${interactionP?.toFixed(4)} < 0.05). Biến ${columns[2]} điều tiết mối quan hệ giữa ${columns[1]} và ${columns[0]}.`
                        : `Không có hiệu ứng điều tiết có ý nghĩa thống kê (p = ${interactionP?.toFixed(4)} >= 0.05). Biến ${columns[2]} không điều tiết mối quan hệ giữa ${columns[1]} và ${columns[0]}.`}
                </p>
            </div>
        </div>
    );
});

export default ModerationResults;
