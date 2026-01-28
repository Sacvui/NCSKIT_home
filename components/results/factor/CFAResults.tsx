'use client';

import React, { useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CFAResultsProps {
    results: any;
    onProceedToSEM?: (factors: { name: string; indicators: string[] }[]) => void;
}

/**
 * Confirmatory Factor Analysis (CFA) Results Component
 * Displays model fit indices, factor loadings, and covariances
 */
export const CFAResults = React.memo(function CFAResults({ results, onProceedToSEM }: CFAResultsProps) {
    if (!results) return null;
    const { fitMeasures, estimates } = results;

    const loadings = estimates.filter((e: any) => e.op === '=~');
    const covariances = estimates.filter((e: any) => e.op === '~~' && e.lhs !== e.rhs);

    // Extract factor structure for SEM (memoized)
    const factors = useMemo(() => {
        const factorMap: Record<string, string[]> = {};
        loadings.forEach((est: any) => {
            if (!factorMap[est.lhs]) factorMap[est.lhs] = [];
            factorMap[est.lhs].push(est.rhs);
        });
        return Object.entries(factorMap).map(([name, indicators]) => ({ name, indicators }));
    }, [loadings]);

    const fitGood = useMemo(() =>
        fitMeasures.cfi >= 0.9 && fitMeasures.rmsea <= 0.08,
        [fitMeasures.cfi, fitMeasures.rmsea]
    );

    const handleProceedToSEM = useCallback(() => {
        if (onProceedToSEM) {
            onProceedToSEM(factors);
        }
    }, [onProceedToSEM, factors]);

    // Helper to color fit indices
    const getFitColor = (val: number, type: 'high' | 'low') => {
        if (type === 'high') return val > 0.9 ? 'text-green-600' : val > 0.8 ? 'text-orange-500' : 'text-red-500';
        return val < 0.08 ? 'text-green-600' : val < 0.1 ? 'text-orange-500' : 'text-red-500';
    };

    return (
        <div className="space-y-8 font-sans">
            {/* 1. Model Fit Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-rose-700">Model Fit Indices (Độ phù hợp mô hình)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-gray-50 rounded border">
                            <div className="text-xs uppercase text-gray-500 font-bold">Chi-square / df</div>
                            <div className="text-xl font-bold text-gray-800">
                                {(fitMeasures.chisq / fitMeasures.df).toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-400">p = {fitMeasures.pvalue.toFixed(3)}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border">
                            <div className="text-xs uppercase text-gray-500 font-bold">CFI</div>
                            <div className={`text-xl font-bold ${getFitColor(fitMeasures.cfi, 'high')}`}>
                                {fitMeasures.cfi.toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-400">&gt; 0.9 is good</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border">
                            <div className="text-xs uppercase text-gray-500 font-bold">TLI</div>
                            <div className={`text-xl font-bold ${getFitColor(fitMeasures.tli, 'high')}`}>
                                {fitMeasures.tli.toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-400">&gt; 0.9 is good</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border">
                            <div className="text-xs uppercase text-gray-500 font-bold">RMSEA</div>
                            <div className={`text-xl font-bold ${getFitColor(fitMeasures.rmsea, 'low')}`}>
                                {fitMeasures.rmsea.toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-400">&lt; 0.08 is good</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Factor Loadings Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-rose-700">Factor Loadings (Hệ số tải nhân tố)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-rose-50 border-b-2 border-rose-200 text-rose-800">
                                    <th className="py-3 px-4 text-left">Nhân tố (Latent)</th>
                                    <th className="py-3 px-4 text-center"></th>
                                    <th className="py-3 px-4 text-left">Biến quan sát (Indicator)</th>
                                    <th className="py-3 px-4 text-right">Estimate</th>
                                    <th className="py-3 px-4 text-right">Std. Estimate</th>
                                    <th className="py-3 px-4 text-right">S.E.</th>
                                    <th className="py-3 px-4 text-right">P-value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadings.map((est: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-rose-50/30 transition-colors">
                                        <td className="py-2 px-4 font-medium text-gray-800">{est.lhs}</td>
                                        <td className="py-2 px-4 text-center text-gray-400">⟶</td>
                                        <td className="py-2 px-4 text-gray-700">{est.rhs}</td>
                                        <td className="py-2 px-4 text-right">{est.est.toFixed(3)}</td>
                                        <td className={`py-2 px-4 text-right font-bold ${est.std > 0.5 ? 'text-green-600' : 'text-orange-500'}`}>
                                            {est.std.toFixed(3)}
                                        </td>
                                        <td className="py-2 px-4 text-right text-gray-500">{est.se.toFixed(3)}</td>
                                        <td className="py-2 px-4 text-right">
                                            {est.pvalue < 0.001 ? <span className="text-green-600 font-bold">{'< .001 ***'}</span> : est.pvalue.toFixed(3)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Covariances (Optional) */}
            {covariances.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-rose-700">Covariances (Hiệp phương sai)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="py-2 px-4 text-left">Quan hệ</th>
                                        <th className="py-2 px-4 text-right">Estimate</th>
                                        <th className="py-2 px-4 text-right">Std. Estimate (Correlation)</th>
                                        <th className="py-2 px-4 text-right">P-value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {covariances.map((est: any, idx: number) => (
                                        <tr key={idx} className="border-b border-gray-100">
                                            <td className="py-2 px-4 font-medium">
                                                {est.lhs} <span className="mx-2 text-gray-400">⟷</span> {est.rhs}
                                            </td>
                                            <td className="py-2 px-4 text-right">{est.est.toFixed(3)}</td>
                                            <td className="py-2 px-4 text-right font-bold">{est.std.toFixed(3)}</td>
                                            <td className="py-2 px-4 text-right">
                                                {est.pvalue < 0.001 ? '< .001' : est.pvalue.toFixed(3)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Workflow: Next Step Button */}
            {factors.length > 0 && onProceedToSEM && fitGood && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 p-6 rounded-xl shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                            🎯
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-purple-900 mb-2 text-lg">Bước tiếp theo được đề xuất</h4>
                            <p className="text-sm text-purple-700 mb-4">
                                Mô hình CFA đã được xác nhận với <strong>fit tốt</strong> (CFI ≥ 0.9, RMSEA ≤ 0.08).
                                Tiếp tục với <strong>SEM (Structural Equation Modeling)</strong> để kiểm định mối quan hệ nhân quả giữa các nhân tố?
                            </p>
                            <button
                                onClick={handleProceedToSEM}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <span>Xây dựng SEM với {factors.length} factors</span>
                                <span className="text-xl">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}); \r\n\r\nexport default CFAResults;
