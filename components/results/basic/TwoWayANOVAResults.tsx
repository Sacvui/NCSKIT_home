'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface TwoWayANOVAResultsProps {
    results: any;
    columns: string[];
}

/**
 * Two-Way ANOVA Results Component
 * Displays two-way ANOVA table with main effects and interaction
 */
export const TwoWayANOVAResults = React.memo(function TwoWayANOVAResults({ results, columns }: TwoWayANOVAResultsProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Two-Way ANOVA Table</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="py-2 text-left font-semibold">Source</th>
                                <th className="py-2 text-right font-semibold">df</th>
                                <th className="py-2 text-right font-semibold">Sum Sq</th>
                                <th className="py-2 text-right font-semibold">Mean Sq</th>
                                <th className="py-2 text-right font-semibold">F</th>
                                <th className="py-2 text-right font-semibold">p-value</th>
                                <th className="py-2 text-right font-semibold">η²</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 font-medium">{columns[1]} (Factor 1)</td>
                                <td className="py-2 text-right">{results.factor1Df}</td>
                                <td className="py-2 text-right">{results.factor1SS?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.factor1MS?.toFixed(3)}</td>
                                <td className="py-2 text-right font-bold">{results.factor1F?.toFixed(3)}</td>
                                <td className={`py-2 text-right font-bold ${results.factor1P < 0.05 ? 'text-green-600' : 'text-gray-600'}`}>
                                    {results.factor1P?.toFixed(4)} {results.factor1P < 0.05 && '***'}
                                </td>
                                <td className="py-2 text-right">{results.factor1Eta?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 font-medium">{columns[2]} (Factor 2)</td>
                                <td className="py-2 text-right">{results.factor2Df}</td>
                                <td className="py-2 text-right">{results.factor2SS?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.factor2MS?.toFixed(3)}</td>
                                <td className="py-2 text-right font-bold">{results.factor2F?.toFixed(3)}</td>
                                <td className={`py-2 text-right font-bold ${results.factor2P < 0.05 ? 'text-green-600' : 'text-gray-600'}`}>
                                    {results.factor2P?.toFixed(4)} {results.factor2P < 0.05 && '***'}
                                </td>
                                <td className="py-2 text-right">{results.factor2Eta?.toFixed(3)}</td>
                            </tr>
                            <tr className={`border-b border-gray-200 ${results.interactionP < 0.05 ? 'bg-yellow-50' : ''}`}>
                                <td className="py-2 font-bold">Interaction</td>
                                <td className="py-2 text-right">{results.interactionDf}</td>
                                <td className="py-2 text-right">{results.interactionSS?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.interactionMS?.toFixed(3)}</td>
                                <td className="py-2 text-right font-bold">{results.interactionF?.toFixed(3)}</td>
                                <td className={`py-2 text-right font-bold ${results.interactionP < 0.05 ? 'text-orange-600' : 'text-gray-600'}`}>
                                    {results.interactionP?.toFixed(4)} {results.interactionP < 0.05 && '***'}
                                </td>
                                <td className="py-2 text-right">{results.interactionEta?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 font-medium">Residuals</td>
                                <td className="py-2 text-right">{results.residualDf}</td>
                                <td className="py-2 text-right">{results.residualSS?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.residualMS?.toFixed(3)}</td>
                                <td className="py-2 text-right">-</td>
                                <td className="py-2 text-right">-</td>
                                <td className="py-2 text-right">-</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <ul className="text-sm text-gray-800 space-y-2">
                    <li>
                        <strong>Main Effect {columns[1]}:</strong> {results.factor1P < 0.05
                            ? `Có ý nghĩa (p = ${results.factor1P?.toFixed(4)})`
                            : `Không có ý nghĩa (p = ${results.factor1P?.toFixed(4)})`}
                    </li>
                    <li>
                        <strong>Main Effect {columns[2]}:</strong> {results.factor2P < 0.05
                            ? `Có ý nghĩa (p = ${results.factor2P?.toFixed(4)})`
                            : `Không có ý nghĩa (p = ${results.factor2P?.toFixed(4)})`}
                    </li>
                    <li>
                        <strong>Interaction Effect:</strong> {results.interactionP < 0.05
                            ? `Có ý nghĩa (p = ${results.interactionP?.toFixed(4)}) - Cần phân tích Simple Effects`
                            : `Không có ý nghĩa (p = ${results.interactionP?.toFixed(4)})`}
                    </li>
                </ul>
            </div>
        </div>
    );
});\r\n\r\nexport default TwoWayANOVAResults;
