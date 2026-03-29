'use client';

import React, { useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface EFAResultsProps {
    results: any;
    columns: string[];
    onProceedToCFA?: (factors: { name: string; indicators: string[] }[]) => void;
}

/**
 * Exploratory Factor Analysis (EFA) Results Component
 * Displays KMO, Bartlett's test, factor loadings, and communalities
 */
export const EFAResults = React.memo(function EFAResults({ results, columns, onProceedToCFA }: EFAResultsProps) {
    const kmo = results.kmo || 0;
    const bartlettP = results.bartlettP || 1;
    const kmoAcceptable = kmo >= 0.6;
    const bartlettSignificant = bartlettP < 0.05;

    // Extract factor structure for workflow (memoized)
    const suggestedFactors = useMemo(() => {
        if (!results.loadings || !Array.isArray(results.loadings[0])) return [];

        const factors = [];
        const nFactors = results.nFactorsUsed || results.loadings[0].length;

        for (let f = 0; f < nFactors; f++) {
            const indicators = columns.filter((col, i) =>
                results.loadings[i] && results.loadings[i][f] >= 0.5
            );
            if (indicators.length >= 3) {
                factors.push({
                    name: `Factor${f + 1}`,
                    indicators
                });
            }
        }
        return factors;
    }, [results.loadings, columns, results.nFactorsUsed]);

    const handleProceedToCFA = useCallback(() => {
        if (onProceedToCFA) {
            onProceedToCFA(suggestedFactors);
        }
    }, [onProceedToCFA, suggestedFactors]);

    return (
        <div className="space-y-6">
            {/* Total Variance Explained */}
            {results.eigenvalues && results.eigenvalues.length > 0 && (
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b bg-slate-50/50 pb-4">
                        <CardTitle className="text-slate-800">Total Variance Explained</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto pt-6">
                        <table className="w-full text-left text-sm whitespace-nowrap text-slate-700">
                            <thead className="bg-slate-50 text-slate-700">
                                <tr className="border-y-2 border-slate-300">
                                    <th className="py-3 px-4 font-semibold text-center">Component / Factor</th>
                                    <th className="py-3 px-4 font-semibold text-right">Initial Eigenvalues</th>
                                    <th className="py-3 px-4 font-semibold text-right">% of Variance</th>
                                    <th className="py-3 px-4 font-semibold text-right">Cumulative %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const totalVar = results.eigenvalues.reduce((s:number,v:number)=>s+v, 0);
                                    let cumVar = 0;
                                    return results.eigenvalues.map((ev: number, i: number) => {
                                        const pct = (ev / totalVar) * 100;
                                        cumVar += pct;
                                        const isExtracted = i < results.nFactorsUsed;
                                        return (
                                            <tr key={i} className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${isExtracted ? 'bg-indigo-50/30' : ''}`}>
                                                <td className={`py-3 px-4 font-bold text-center ${isExtracted ? 'text-indigo-900' : 'text-slate-500'}`}>{i + 1}</td>
                                                <td className={`py-3 px-4 text-right ${isExtracted ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{ev.toFixed(3)}</td>
                                                <td className={`py-3 px-4 text-right ${isExtracted ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{pct.toFixed(2)}%</td>
                                                <td className={`py-3 px-4 text-right ${isExtracted ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{cumVar.toFixed(2)}%</td>
                                            </tr>
                                        );
                                    });
                                })()}
                            </tbody>
                        </table>
                        <p className="text-xs text-slate-500 italic mt-4">
                            * Trích xuất {results.nFactorsUsed} nhân tố (vùng tô màu). Các nhân tố có Eigenvalue &gt; 1 được giữ lại theo tiêu chuẩn Kaiser.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* KMO and Bartlett's Test */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b bg-slate-50/50 pb-4">
                    <CardTitle className="text-slate-800">KMO and Bartlett&apos;s Test</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <table className="w-full text-sm text-slate-700">
                        <tbody>
                            <tr className="border-b border-slate-200 hover:bg-slate-50">
                                <td className="py-3 px-4 font-medium">Kaiser-Meyer-Olkin Measure of Sampling Adequacy</td>
                                <td className={`py-3 px-4 text-right font-bold ${kmoAcceptable ? 'text-green-700' : 'text-red-600'}`}>
                                    {kmo.toFixed(3)}
                                </td>
                            </tr>
                            <tr className="border-b border-slate-200 hover:bg-slate-50">
                                <td className="py-3 px-4 font-medium">Bartlett&apos;s Test of Sphericity (Sig.)</td>
                                <td className={`py-3 px-4 text-right font-bold ${bartlettSignificant ? 'text-green-700' : 'text-red-600'}`}>
                                    {bartlettP < 0.001 ? '< .001' : bartlettP.toFixed(4)} {bartlettSignificant && '***'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Factor Loadings Matrix */}
            {results.loadings && (
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b bg-slate-50/50 pb-4">
                        <CardTitle className="text-slate-800">{results.factorMethod === 'none' ? 'Component Matrix' : 'Pattern / Factor Matrix (Rotated)'}</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto pt-6">
                        <table className="w-full text-sm whitespace-nowrap text-slate-700">
                            <thead className="bg-slate-50 text-slate-700">
                                <tr className="border-y-2 border-slate-300">
                                    <th className="py-3 px-4 text-left font-semibold">Variable</th>
                                    {Array.isArray(results.loadings[0]) && results.loadings[0].map((_: any, idx: number) => (
                                        <th key={idx} className="py-3 px-4 text-right font-semibold">Factor {idx + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {columns.map((col, rowIdx) => (
                                    <tr key={rowIdx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 font-bold text-slate-800">{col}</td>
                                        {Array.isArray(results.loadings[rowIdx]) && results.loadings[rowIdx].map((val: number, colIdx: number) => {
                                            const isSuppressed = Math.abs(val) < 0.3;
                                            const isStrong = Math.abs(val) >= 0.5;
                                            return (
                                                <td
                                                    key={colIdx}
                                                    className={`py-3 px-4 text-right ${isStrong ? 'font-bold text-blue-700' : isSuppressed ? 'text-slate-300 font-light' : 'text-slate-700 font-medium'}`}
                                                >
                                                    {isSuppressed ? '' : val?.toFixed(3)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-xs text-slate-500 italic mt-4">
                            * Các hệ số tải (loadings) nhỏ hơn 0.3 đã được ẩn (Suppressed) để cấu trúc nhân tố rõ ràng hơn (Chuẩn SPSS). Loadings ≥ 0.5 được tô đậm xanh biểu thị độ hội tụ mạnh.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Communalities */}
            {results.communalities && (
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b bg-slate-50/50 pb-4">
                        <CardTitle className="text-slate-800">Communalities</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto pt-6">
                        <table className="w-full text-sm text-slate-700">
                            <thead className="bg-slate-50 text-slate-700">
                                <tr className="border-y-2 border-slate-300">
                                    <th className="py-3 px-4 text-left font-semibold">Variable</th>
                                    <th className="py-3 px-4 text-right font-semibold">Initial</th>
                                    <th className="py-3 px-4 text-right font-semibold">Extraction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {columns.map((col, idx) => (
                                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 font-bold text-slate-800">{col}</td>
                                        <td className="py-3 px-4 text-right text-slate-600">1.000</td>
                                        <td className={`py-3 px-4 text-right ${results.communalities[idx] < 0.4 ? 'text-red-600 bg-red-50 font-bold' : 'text-slate-700'}`}>
                                            {results.communalities[idx]?.toFixed(3) || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-xs text-slate-500 italic p-4 bg-slate-50 mt-4 rounded-md border border-slate-200">
                            * Initial communalities được giả định bằng 1 (theo phương pháp Principal Components).
                            Communality (Extraction) &lt; 0.4 được đánh dấu màn nền đỏ (biến giải thích kém phương sai chung, cần cân nhắc loại bỏ).
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Interpretation */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Đánh giá & Khuyến nghị</h4>
                <div className="space-y-3 text-sm text-gray-800">
                    <p>
                        <strong>KMO = {kmo.toFixed(3)}:</strong>{' '}
                        {kmo >= 0.9 ? 'Tuyệt vời' : kmo >= 0.8 ? 'Rất tốt' : kmo >= 0.7 ? 'Tốt' : kmo >= 0.6 ? 'Chấp nhận được' : 'Không phù hợp để phân tích nhân tố'}
                    </p>
                    <p>
                        <strong>Bartlett&apos;s Test:</strong>{' '}
                        {bartlettSignificant
                            ? 'Có ý nghĩa thống kê (p < 0.05), ma trận tương quan phù hợp để phân tích nhân tố.'
                            : 'Không có ý nghĩa thống kê, dữ liệu có thể không phù hợp cho EFA.'
                        }
                    </p>
                    {kmoAcceptable && bartlettSignificant ? (
                        <p className="text-green-700 font-medium flex items-center gap-2">
                            <span>✓</span> Dữ liệu phù hợp để tiến hành phân tích nhân tố.
                        </p>
                    ) : (
                        <p className="text-red-600 font-medium flex items-center gap-2">
                            <span>✗</span> Dữ liệu có thể không phù hợp để phân tích nhân tố. Cần xem xét lại mẫu hoặc biến quan sát.
                        </p>
                    )}
                </div>
            </div>

            {/* Workflow: Next Step Button */}
            {suggestedFactors.length > 0 && onProceedToCFA && kmoAcceptable && bartlettSignificant && (
                <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 p-6 rounded-xl shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl">
                            ✓
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-green-900 mb-2 text-lg">Bước tiếp theo được đề xuất</h4>
                            <p className="text-sm text-green-700 mb-4">
                                EFA đã khám phá được <strong>{suggestedFactors.length} factors</strong> với cấu trúc rõ ràng (loadings ≥ 0.5).
                                Tiếp tục với <strong>CFA (Confirmatory Factor Analysis)</strong> để xác nhận mô hình này?
                            </p>
                            <button
                                onClick={handleProceedToCFA}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <span>Xác nhận bằng CFA ({suggestedFactors.length} factors)</span>
                                <span className="text-xl">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default EFAResults;
