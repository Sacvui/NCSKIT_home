'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface TTestResultsProps {
    results: any;
    columns: string[];
}

/**
 * Independent Samples T-Test Results Component
 * Displays t-test results with effect size and confidence intervals
 */
export function TTestResults({ results, columns }: TTestResultsProps) {
    const pValue = results.pValue;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Independent Samples T-test Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Group 1 ({columns[0]})</td>
                                <td className="py-2 text-right">Mean = {results.mean1?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Group 2 ({columns[1]})</td>
                                <td className="py-2 text-right">Mean = {results.mean2?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Mean Difference</td>
                                <td className="py-2 text-right font-bold">{results.meanDiff?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">t-statistic</td>
                                <td className="py-2 text-right">{results.t?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Degrees of Freedom (df)</td>
                                <td className="py-2 text-right">{results.df?.toFixed(2)}</td>
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
                            <tr className="bg-gray-50">
                                <td className="py-2 font-medium text-gray-700">Equality of Variances (p)</td>
                                <td className={`py-2 text-right font-medium ${results.varTestP < 0.05 ? 'text-orange-600' : 'text-green-600'}`}>
                                    {results.varTestP?.toFixed(4) || 'N/A'}
                                    <span className="text-xs font-normal text-gray-500 ml-1">
                                        {results.varTestP < 0.05 ? '(Khác biệt)' : '(Đồng nhất)'}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800 mb-2">
                    <strong>Kiểm định phương sai:</strong> p = {results.varTestP?.toFixed(4)}.
                    {results.varTestP < 0.05
                        ? ' Phương sai giữa hai nhóm khác biệt có ý nghĩa (đã sử dụng Welch t-test để điều chỉnh).'
                        : ' Phương sai giữa hai nhóm đồng nhất (sử dụng Student t-test chuẩn).'}
                </p>
                <p className="text-sm text-gray-800">
                    <strong>Kết quả T-test:</strong>
                    {significant
                        ? ` Có sự khác biệt có ý nghĩa thống kê giữa ${columns[0]} và ${columns[1]} (p = ${pValue?.toFixed(4)} < 0.05). Cohen's d = ${results.effectSize?.toFixed(2)} cho thấy ${Math.abs(results.effectSize) > 0.8 ? 'hiệu ứng lớn' : Math.abs(results.effectSize) > 0.5 ? 'hiệu ứng trung bình' : 'hiệu ứng nhỏ'}.`
                        : ` Không có sự khác biệt có ý nghĩa thống kê giữa ${columns[0]} và ${columns[1]} (p = ${pValue?.toFixed(4)} >= 0.05).`
                    }
                </p>
            </div>
        </div>
    );
}

export default TTestResults;
