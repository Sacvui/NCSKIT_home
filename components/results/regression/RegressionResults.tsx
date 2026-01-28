'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Scatter } from 'react-chartjs-2';

interface RegressionResultsProps {
    results: any;
    columns: string[];
}

/**
 * Linear Regression Results Component
 * Displays model summary, coefficients, assumption checks, and actual vs predicted chart
 */
export const RegressionResults = React.memo(function RegressionResults({ results, columns }: RegressionResultsProps) {
    if (!results || !results.modelFit) return null;

    const { modelFit, coefficients, equation } = results;

    return (
        <div className="space-y-8 font-sans">
            {/* Equation */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg text-white shadow-lg">
                <h4 className="font-bold text-sm uppercase tracking-wider mb-2 opacity-80">Phương trình hồi quy tuyến tính</h4>
                <div className="text-xl md:text-2xl font-mono font-bold break-all">
                    {equation}
                </div>
            </div>

            {/* Model Summary */}
            <div className="bg-white border-t-2 border-b-2 border-black p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-black inline-block pb-1">Model Summary</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">R Square</div>
                        <div className="text-2xl font-bold text-blue-700">{modelFit.rSquared.toFixed(3)}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">Adjusted R²</div>
                        <div className="text-2xl font-bold text-blue-600">{modelFit.adjRSquared.toFixed(3)}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">F Statistic</div>
                        <div className="text-xl font-bold text-gray-800">{modelFit.fStatistic.toFixed(2)}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">Sig. (ANOVA)</div>
                        <div className={`text-xl font-bold ${modelFit.pValue < 0.05 ? 'text-green-600' : 'text-red-500'}`}>
                            {modelFit.pValue < 0.001 ? '< .001' : modelFit.pValue.toFixed(3)}
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-500 italic mt-4 text-center">
                    Mô hình giải thích được <strong>{(modelFit.adjRSquared * 100).toFixed(1)}%</strong> biến thiên của biến phục thuộc.
                </p>
            </div>

            {/* Coefficients */}
            <div className="bg-white border-t-2 border-b-2 border-black p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-black inline-block pb-1">Coefficients</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-400 bg-gray-50">
                                <th className="py-3 px-4 text-left font-bold uppercase text-xs tracking-wider">Model</th>
                                <th className="py-3 px-4 text-right font-bold uppercase text-xs tracking-wider">Unstandardized B</th>
                                <th className="py-3 px-4 text-right font-bold uppercase text-xs tracking-wider">Std. Error</th>
                                <th className="py-3 px-4 text-right font-bold uppercase text-xs tracking-wider">t</th>
                                <th className="py-3 px-4 text-right font-bold uppercase text-xs tracking-wider">Sig.</th>
                                <th className="py-3 px-4 text-right font-bold uppercase text-xs tracking-wider text-purple-700">VIF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coefficients.map((coef: any, idx: number) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-gray-800">
                                        {coef.term === '(Intercept)' ? '(Constant)' : coef.term.replace(/`/g, '')}
                                    </td>
                                    <td className="py-3 px-4 text-right font-mono font-medium">
                                        {coef.estimate.toFixed(3)}
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-600">
                                        {coef.stdError.toFixed(3)}
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-600">
                                        {coef.tValue.toFixed(3)}
                                    </td>
                                    <td className={`py-3 px-4 text-right font-bold ${coef.pValue < 0.05 ? 'text-green-600' : 'text-gray-400'}`}>
                                        {coef.pValue < 0.001 ? '< .001' : coef.pValue.toFixed(3)}
                                    </td>
                                    <td className="py-3 px-4 text-right font-bold text-purple-700">
                                        {coef.vif ? coef.vif.toFixed(3) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assumption Checks Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-indigo-700">Kiểm định Giả định (Assumption Checks)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Normality */}
                        <div className="p-4 bg-gray-50 rounded border border-gray-100">
                            <h5 className="font-bold text-sm text-gray-700 mb-2">1. Phân phối chuẩn của phần dư (Normality)</h5>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Shapiro-Wilk Test:</span>
                                <span className={`font-bold ${modelFit.normalityP >= 0.05 ? 'text-green-600' : 'text-orange-500'}`}>
                                    p = {modelFit.normalityP?.toFixed(4)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 italic">
                                {modelFit.normalityP >= 0.05
                                    ? '✓ Phần dư có phân phối chuẩn (Tốt).'
                                    : '⚠ Phần dư không phân phối chuẩn (Cân nhắc cỡ mẫu lớn).'}
                            </p>
                        </div>

                        {/* 2. Multicollinearity */}
                        <div className="p-4 bg-gray-50 rounded border border-gray-100">
                            <h5 className="font-bold text-sm text-gray-700 mb-2">2. Đa cộng tuyến (Multicollinearity)</h5>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">VIF Max:</span>
                                <span className="font-bold text-purple-700">
                                    {Math.max(...coefficients.map((c: any) => c.vif || 0)).toFixed(2)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 italic">
                                {Math.max(...coefficients.map((c: any) => c.vif || 0)) < 10
                                    ? '✓ Không có hiện tượng đa cộng tuyến nghiêm trọng (VIF < 10).'
                                    : '⚠ Cảnh báo đa cộng tuyến (VIF > 10).'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Conclusion */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm">
                <h4 className="font-bold mb-3 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800">
                    <li>
                        Mô hình hồi quy <strong>{modelFit.pValue < 0.05 ? 'có ý nghĩa thống kê' : 'không có ý nghĩa thống kê'}</strong> (F = {modelFit.fStatistic.toFixed(2)}, p {modelFit.pValue < 0.001 ? '< .001' : `= ${modelFit.pValue.toFixed(3)}`}).
                    </li>
                    <li>
                        Các biến độc lập tác động có ý nghĩa (p &lt; 0.05):{' '}
                        {coefficients.filter((c: any) => c.term !== '(Intercept)' && c.pValue < 0.05).length > 0
                            ? coefficients
                                .filter((c: any) => c.term !== '(Intercept)' && c.pValue < 0.05)
                                .map((c: any) => c.term.replace(/`/g, ''))
                                .join(', ')
                            : 'Không có biến nào.'}
                    </li>
                </ul>
            </div>

            {/* Charts: Actual vs Predicted */}
            {results.chartData && (
                <div className="bg-white border-t-2 border-b-2 border-black p-6 mt-8">
                    <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-black inline-block pb-1 mb-6">
                        Actual vs Predicted
                    </h3>
                    <div className="h-80 w-full">
                        <Scatter
                            data={{
                                datasets: [
                                    {
                                        label: 'Quan sát',
                                        data: results.chartData.actual.map((val: number, i: number) => ({
                                            x: results.chartData.fitted[i], // X = Predicted
                                            y: val // Y = Actual
                                        })),
                                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                                        borderColor: 'rgba(59, 130, 246, 1)',
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        title: { display: true, text: 'Giá trị Dự báo (Predicted)' }
                                    },
                                    y: {
                                        title: { display: true, text: 'Giá trị Thực tế (Actual)' }
                                    }
                                },
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                const point = context.raw as { x: number, y: number };
                                                return `Pred: ${point.x.toFixed(2)}, Act: ${point.y.toFixed(2)}`;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
});\r\n\r\nexport default RegressionResults;
