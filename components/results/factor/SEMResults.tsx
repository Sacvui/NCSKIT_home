'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SEMPathDiagram from '../SEMPathDiagram';

interface SEMResultsProps {
    results: any;
}

/**
 * Structural Equation Modeling (SEM) Results Component
 * Displays path diagram, fit indices, structural paths, and measurement model
 */
export const SEMResults = React.memo(function SEMResults({ results }: SEMResultsProps) {
    if (!results) return null;
    const { fitMeasures, estimates } = results;

    // Filter estimates
    const structuralPaths = estimates.filter((e: any) => e.op === '~');
    const loadings = estimates.filter((e: any) => e.op === '=~');
    const covariances = estimates.filter((e: any) => e.op === '~~' && e.lhs !== e.rhs);

    // Prepare data for diagram
    const diagramFactors = useMemo(() => {
        const factorMap: Record<string, string[]> = {};
        loadings.forEach((est: any) => {
            if (!factorMap[est.lhs]) factorMap[est.lhs] = [];
            factorMap[est.lhs].push(est.rhs);
        });
        return Object.entries(factorMap).map(([name, indicators]) => ({ name, indicators }));
    }, [loadings]);

    const diagramPaths = useMemo(() =>
        structuralPaths.map((p: any) => ({
            from: p.rhs,
            to: p.lhs,
            beta: p.std || p.est,
            pvalue: p.pvalue || 0
        })),
        [structuralPaths]
    );

    const diagramLoadings = useMemo(() =>
        loadings.map((l: any) => ({
            factor: l.lhs,
            indicator: l.rhs,
            loading: l.std || l.est
        })),
        [loadings]
    );

    // Helper to color fit indices (same as CFA)
    const getFitColor = (val: number, type: 'high' | 'low') => {
        if (type === 'high') return val > 0.9 ? 'text-green-600' : val > 0.8 ? 'text-orange-500' : 'text-red-500';
        return val < 0.08 ? 'text-green-600' : val < 0.1 ? 'text-orange-500' : 'text-red-500';
    };

    return (
        <div className="space-y-8 font-sans">
            {/* 0. SEM Path Diagram */}
            {diagramFactors.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-violet-700">SEM Path Diagram</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SEMPathDiagram
                            factors={diagramFactors}
                            structuralPaths={diagramPaths}
                            factorLoadings={diagramLoadings}
                        />
                    </CardContent>
                </Card>
            )}

            {/* 1. Model Fit Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-violet-700">Model Fit Indices (Độ phù hợp mô hình)</CardTitle>
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

            {/* 2. Structural Paths (Regressions) */}
            {structuralPaths.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-violet-700">Structural Paths (Mối quan hệ tác động)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-violet-50 border-b-2 border-violet-200 text-violet-800">
                                        <th className="py-3 px-4 text-left">Phụ thuộc (DV)</th>
                                        <th className="py-3 px-4 text-center"></th>
                                        <th className="py-3 px-4 text-left">Độc lập (IV)</th>
                                        <th className="py-3 px-4 text-right">Estimate</th>
                                        <th className="py-3 px-4 text-right">Std. Estimate (Beta)</th>
                                        <th className="py-3 px-4 text-right">S.E.</th>
                                        <th className="py-3 px-4 text-right">P-value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {structuralPaths.map((est: any, idx: number) => (
                                        <tr key={idx} className="border-b border-gray-100 hover:bg-violet-50/30 transition-colors">
                                            <td className="py-2 px-4 font-bold text-gray-800">{est.lhs}</td>
                                            <td className="py-2 px-4 text-center text-gray-400">⟵</td>
                                            <td className="py-2 px-4 text-gray-700">{est.rhs}</td>
                                            <td className="py-2 px-4 text-right">{est.est.toFixed(3)}</td>
                                            <td className={`py-2 px-4 text-right font-bold ${est.pvalue < 0.05 ? 'text-green-600' : 'text-gray-500'}`}>
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
            )}

            {/* 3. Measurement Model (Loadings) */}
            {loadings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-violet-700">Measurement Model (Mô hình đo lường)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="py-2 px-4 text-left">Nhân tố (Latent)</th>
                                        <th className="py-2 px-4 text-center"></th>
                                        <th className="py-2 px-4 text-left">Biến quan sát (Indicator)</th>
                                        <th className="py-2 px-4 text-right">Std. Estimate</th>
                                        <th className="py-2 px-4 text-right">P-value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadings.map((est: any, idx: number) => (
                                        <tr key={idx} className="border-b border-gray-100">
                                            <td className="py-2 px-4 font-medium text-gray-600">{est.lhs}</td>
                                            <td className="py-2 px-4 text-center text-gray-300">⟶</td>
                                            <td className="py-2 px-4 text-gray-500">{est.rhs}</td>
                                            <td className={`py-2 px-4 text-right ${est.std > 0.5 ? 'text-gray-800' : 'text-red-400'}`}>
                                                {est.std.toFixed(3)}
                                            </td>
                                            <td className="py-2 px-4 text-right text-gray-500">
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
        </div>
    );
});\r\n\r\nexport default SEMResults;
