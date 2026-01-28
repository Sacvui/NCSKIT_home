'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface LogisticResultsProps {
    results: any;
    columns: string[];
}

/**
 * Logistic Regression Results Component
 * Displays logistic regression with odds ratios and confusion matrix
 */
export const LogisticResults = React.memo(function LogisticResults({ results, columns }: LogisticResultsProps) {
    // columns: [Y, X1, X2...]

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Logistic Regression Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm mb-6">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="py-2 text-left font-semibold">Variable</th>
                                <th className="py-2 text-right font-semibold">Estimate</th>
                                <th className="py-2 text-right font-semibold">Std. Error</th>
                                <th className="py-2 text-right font-semibold">z-value</th>
                                <th className="py-2 text-right font-semibold">p-value</th>
                                <th className="py-2 text-right font-semibold">Odds Ratio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.coefficients?.map((coeff: any, idx: number) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-2 font-medium">{coeff.term}</td>
                                    <td className="py-2 text-right">{coeff.estimate?.toFixed(4)}</td>
                                    <td className="py-2 text-right">{coeff.stdError?.toFixed(4)}</td>
                                    <td className="py-2 text-right">{coeff.zValue?.toFixed(3)}</td>
                                    <td className={`py-2 text-right ${coeff.pValue < 0.05 ? 'font-bold text-green-600' : ''}`}>
                                        {coeff.pValue?.toFixed(4)} {coeff.pValue < 0.05 && '***'}
                                    </td>
                                    <td className="py-2 text-right font-medium text-blue-600">
                                        {coeff.oddsRatio?.toFixed(4)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-3 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500">AIC</div>
                            <div className="font-bold">{results.modelFit?.aic?.toFixed(2)}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500">Pseudo R² (McFadden)</div>
                            <div className="font-bold">{results.modelFit?.pseudoR2?.toFixed(4)}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500">Accuracy</div>
                            <div className={`font-bold ${results.modelFit?.accuracy > 0.7 ? 'text-green-600' : ''}`}>
                                {(results.modelFit?.accuracy * 100)?.toFixed(2)}%
                            </div>
                        </div>
                    </div>

                    {results.confusionMatrix && (
                        <div className="border rounded-lg p-4 max-w-md mx-auto">
                            <h4 className="text-center font-semibold mb-3">Confusion Matrix</h4>
                            <div className="grid grid-cols-2 gap-2 text-center text-sm">
                                <div className="bg-green-50 p-2 rounded">
                                    <div className="font-bold text-green-700">{results.confusionMatrix.trueNegative}</div>
                                    <div className="text-xs">True Negative</div>
                                </div>
                                <div className="bg-red-50 p-2 rounded">
                                    <div className="font-bold text-red-700">{results.confusionMatrix.falsePositive}</div>
                                    <div className="text-xs">False Positive</div>
                                </div>
                                <div className="bg-red-50 p-2 rounded">
                                    <div className="font-bold text-red-700">{results.confusionMatrix.falseNegative}</div>
                                    <div className="text-xs">False Negative</div>
                                </div>
                                <div className="bg-green-50 p-2 rounded">
                                    <div className="font-bold text-green-700">{results.confusionMatrix.truePositive}</div>
                                    <div className="text-xs">True Positive</div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
});\r\n\r\nexport default LogisticResults;
