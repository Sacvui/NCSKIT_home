'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface PairedTTestResultsProps {
    results: any;
    columns: string[];
}

/**
 * Paired Samples T-Test Results Component
 * Displays paired t-test results for before/after comparisons
 */
export function PairedTTestResults({ results, columns }: PairedTTestResultsProps) {
    const pValue = results.pValue;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Paired Samples T-test Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Before ({columns[0]})</td>
                                <td className="py-2 text-right">Mean = {results.meanBefore?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">After ({columns[1]})</td>
                                <td className="py-2 text-right">Mean = {results.meanAfter?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Mean Difference (Before - After)</td>
                                <td className="py-2 text-right font-bold">{results.meanDiff?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">t-statistic</td>
                                <td className="py-2 text-right">{results.t?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Degrees of Freedom (df)</td>
                                <td className="py-2 text-right">{results.df?.toFixed(0)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">p-value (2-tailed)</td>
                                <td className={`py-2 text-right font-bold ${significant ? 'text-green-600' : 'text-gray-600'}`}>
                                    {pValue?.toFixed(4)} {significant && '***'}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">95% CI</td>
                                <td className="py-2 text-right">[{results.ci95Lower?.toFixed(3)}, {results.ci95Upper?.toFixed(3)}]</td>
                            </tr>
                            <tr>
                                <td className="py-2 font-medium">Cohen&apos;s d (Effect Size)</td>
                                <td className="py-2 text-right">{results.effectSize?.toFixed(3)}</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800">
                    {significant
                        ? `Có sự thay đổi có ý nghĩa thống kê giữa trước (${columns[0]}) và sau (${columns[1]}) (p = ${pValue?.toFixed(4)} < 0.05). Trung bình thay đổi ${results.meanDiff > 0 ? 'giảm' : 'tăng'} ${Math.abs(results.meanDiff)?.toFixed(3)} đơn vị. Cohen's d = ${results.effectSize?.toFixed(2)} cho thấy ${Math.abs(results.effectSize) > 0.8 ? 'hiệu ứng lớn' : Math.abs(results.effectSize) > 0.5 ? 'hiệu ứng trung bình' : 'hiệu ứng nhỏ'}.`
                        : `Không có sự thay đổi có ý nghĩa thống kê giữa trước và sau (p = ${pValue?.toFixed(4)} >= 0.05).`
                    }
                </p>
            </div>
        </div>
    );
}

export default PairedTTestResults;
