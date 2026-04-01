'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SEMPathDiagram from '@/components/SEMPathDiagram';

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
        const isGood = type === 'high' ? val >= 0.9 : val <= 0.08;
        const isAcceptable = type === 'high' ? val >= 0.8 : val <= 0.10;
        
        if (isGood) return 'text-emerald-600 dark:text-emerald-400';
        if (isAcceptable) return 'text-amber-600 dark:text-amber-400';
        return 'text-rose-600 dark:text-rose-400';
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
            <Card className="border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
                <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 pb-4">
                    <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2 font-black">
                        Phù hợp mô hình (SEM Fit)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-violet-200">
                            <div className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 mb-2 tracking-widest">Chi-square / df</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                                {(fitMeasures.chisq / fitMeasures.df).toFixed(3)}
                            </div>
                            <div className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter">p = {fitMeasures.pvalue.toFixed(3)}</div>
                        </div>
                        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-violet-200">
                            <div className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 mb-2 tracking-widest">CFI</div>
                            <div className={`text-2xl font-black ${getFitColor(fitMeasures.cfi, 'high')}`}>
                                {fitMeasures.cfi.toFixed(3)}
                            </div>
                            <div className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter">CFI &gt; 0.9 (Good)</div>
                        </div>
                        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-violet-200">
                            <div className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 mb-2 tracking-widest">TLI</div>
                            <div className={`text-2xl font-black ${getFitColor(fitMeasures.tli, 'high')}`}>
                                {fitMeasures.tli.toFixed(3)}
                            </div>
                            <div className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter">TLI &gt; 0.9 (Good)</div>
                        </div>
                        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-violet-200">
                            <div className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 mb-2 tracking-widest">RMSEA</div>
                            <div className={`text-2xl font-black ${getFitColor(fitMeasures.rmsea, 'low')}`}>
                                {fitMeasures.rmsea.toFixed(3)}
                            </div>
                            <div className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter">RMSEA &lt; 0.08 (Good)</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Structural Paths (Regressions) */}
            {structuralPaths.length > 0 && (
                <Card className="border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
                    <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 pb-4">
                        <CardTitle className="text-slate-900 dark:text-slate-100 font-black">Structural Paths (Kiểm định giả thuyết)</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pt-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100">
                                        <th className="py-4 px-6 text-left font-black uppercase tracking-widest text-[10px] border-b-2 border-slate-300 dark:border-slate-700">Tác động lên (DV)</th>
                                        <th className="py-4 px-6 text-center border-b-2 border-slate-300 dark:border-slate-700"></th>
                                        <th className="py-4 px-6 text-left font-black uppercase tracking-widest text-[10px] border-b-2 border-slate-300 dark:border-slate-700">Nguyên nhân (IV)</th>
                                        <th className="py-4 px-6 text-right font-black uppercase tracking-widest text-[10px] border-l border-slate-200 dark:border-slate-700 border-b-2 border-slate-300 dark:border-slate-700 whitespace-normal w-24">Beta</th>
                                        <th className="py-4 px-6 text-right font-black uppercase tracking-widest text-[10px] border-l border-slate-200 dark:border-slate-700 border-b-2 border-slate-300 dark:border-slate-700 whitespace-normal w-24">P-value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {structuralPaths.map((est: any, idx: number) => (
                                        <tr key={idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors">
                                            <td className="py-4 px-6 font-black text-indigo-700 dark:text-indigo-400">{est.lhs}</td>
                                            <td className="py-4 px-6 text-center text-slate-300 dark:text-slate-700">
                                                <span className="text-xl">⟵</span>
                                            </td>
                                            <td className="py-4 px-6 font-bold text-slate-700 dark:text-slate-300">{est.rhs}</td>
                                            <td className={`py-4 px-6 text-right border-l border-slate-200 dark:border-slate-700 font-black ${est.pvalue < 0.05 ? 'text-slate-900 dark:text-white bg-emerald-50/10 dark:bg-emerald-900/10' : 'text-slate-400'}`}>
                                                {est.std.toFixed(3)}
                                            </td>
                                            <td className="py-4 px-6 text-right border-l border-slate-200 dark:border-slate-700">
                                                {est.pvalue < 0.001 ? <span className="text-emerald-600 dark:text-emerald-400 font-black uppercase text-[10px] tracking-tighter">{'< .001 ***'}</span> : <span className={`font-bold ${est.pvalue < 0.05 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{est.pvalue.toFixed(3)}</span>}
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
                <Card className="border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
                    <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 pb-4">
                        <CardTitle className="text-slate-900 dark:text-slate-100 font-black">Measurement Model (Mô hình đo lường)</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pt-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100">
                                        <th className="py-4 px-6 text-left font-black uppercase tracking-widest text-[10px] border-b-2 border-slate-300 dark:border-slate-700">Nhân tố (Latent)</th>
                                        <th className="py-4 px-6 text-center border-b-2 border-slate-300 dark:border-slate-700"></th>
                                        <th className="py-4 px-6 text-left font-black uppercase tracking-widest text-[10px] border-b-2 border-slate-300 dark:border-slate-700">Biến quan sát</th>
                                        <th className="py-4 px-6 text-right font-black uppercase tracking-widest text-[10px] border-l border-slate-200 dark:border-slate-700 border-b-2 border-slate-300 dark:border-slate-700 whitespace-normal w-24">Std. Est</th>
                                        <th className="py-4 px-6 text-right font-black uppercase tracking-widest text-[10px] border-l border-slate-200 dark:border-slate-700 border-b-2 border-slate-300 dark:border-slate-700 whitespace-normal w-24">P-value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadings.map((est: any, idx: number) => (
                                        <tr key={idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors">
                                            <td className="py-4 px-6 font-black text-slate-900 dark:text-slate-100">{est.lhs}</td>
                                            <td className="py-4 px-6 text-center text-slate-300 dark:text-slate-700">
                                                <span className="text-xl">→</span>
                                            </td>
                                            <td className="py-4 px-6 font-bold text-slate-700 dark:text-slate-300">{est.rhs}</td>
                                            <td className={`py-4 px-6 text-right border-l border-slate-200 dark:border-slate-700 font-black ${est.std > 0.5 ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/10 dark:bg-indigo-950/20' : 'text-slate-800 dark:text-slate-200'}`}>
                                                {est.std.toFixed(3)}
                                            </td>
                                            <td className="py-4 px-6 text-right border-l border-slate-200 dark:border-slate-700">
                                                {est.pvalue < 0.001 ? <span className="text-emerald-600 dark:text-emerald-400 font-black uppercase text-[10px] tracking-tighter">{'< .001 ***'}</span> : <span className="font-bold text-slate-900 dark:text-slate-100">{est.pvalue.toFixed(3)}</span>}
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
});

export default SEMResults;
