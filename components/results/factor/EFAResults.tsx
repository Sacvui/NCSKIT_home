'use client';

import React, { useMemo } from 'react';
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
export function EFAResults({ results, columns, onProceedToCFA }: EFAResultsProps) {
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

    return (
        <div className="space-y-6">
            {/* Eigenvalues & Extracted Factors */}
            {results.eigenvalues && results.eigenvalues.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Eigenvalues & Number of Factors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm text-gray-800">
                            <p>
                                <strong>Số lượng nhân tố được trích xuất:</strong> {results.nFactorsUsed}
                            </p>
                            <div>
                                <strong>Eigenvalues (Initial):</strong>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {results.eigenvalues.slice(0, 10).map((ev: number, i: number) => (
                                        <div
                                            key={i}
                                            className={`px-3 py-1 rounded border ${ev > 1 ? 'bg-green-100 border-green-300 text-green-800 font-bold' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                        >
                                            F{i + 1}: {ev.toFixed(3)}
                                        </div>
                                    ))}
                                    {results.eigenvalues.length > 10 && <span className="text-gray-400 self-center">...</span>}
                                </div>
                                <p className="text-xs text-gray-500 italic mt-2">
                                    * Các nhân tố có Eigenvalue &gt; 1 được giữ lại theo tiêu chuẩn Kaiser.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* KMO and Bartlett's Test */}
            <Card>
                <CardHeader>
                    <CardTitle>KMO and Bartlett&apos;s Test</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Kaiser-Meyer-Olkin Measure of Sampling Adequacy</td>
                                <td className={`py-2 text-right font-bold ${kmoAcceptable ? 'text-green-600' : 'text-red-600'}`}>
                                    {kmo.toFixed(3)}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Bartlett&apos;s Test of Sphericity (Sig.)</td>
                                <td className={`py-2 text-right font-bold ${bartlettSignificant ? 'text-green-600' : 'text-red-600'}`}>
                                    {bartlettP < 0.001 ? '< .001' : bartlettP.toFixed(4)} {bartlettSignificant && '***'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Factor Loadings Matrix */}
            {results.loadings && (
                <Card>
                    <CardHeader>
                        <CardTitle>Factor Loadings (Rotated)</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-2 px-3 text-left font-semibold text-gray-700">Variable</th>
                                    {Array.isArray(results.loadings[0]) && results.loadings[0].map((_: any, idx: number) => (
                                        <th key={idx} className="py-2 px-3 text-right font-semibold text-gray-700">Factor {idx + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {columns.map((col, rowIdx) => (
                                    <tr key={rowIdx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-2 px-3 font-medium text-gray-900">{col}</td>
                                        {Array.isArray(results.loadings[rowIdx]) && results.loadings[rowIdx].map((val: number, colIdx: number) => (
                                            <td
                                                key={colIdx}
                                                className={`py-2 px-3 text-right ${Math.abs(val) >= 0.5 ? 'font-bold text-blue-700' : Math.abs(val) >= 0.3 ? 'text-gray-700' : 'text-gray-300'}`}
                                            >
                                                {val?.toFixed(3) || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-xs text-gray-500 italic mt-2 p-2 bg-gray-50 rounded">
                            * Factor loadings ≥ 0.5 được tô đậm. Loadings ≥ 0.3 được giữ lại.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Communalities */}
            {results.communalities && (
                <Card>
                    <CardHeader>
                        <CardTitle>Communalities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-2 px-3 text-left font-semibold">Variable</th>
                                    <th className="py-2 px-3 text-right font-semibold">Extraction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {columns.map((col, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-2 px-3 font-medium">{col}</td>
                                        <td className={`py-2 px-3 text-right ${results.communalities[idx] < 0.4 ? 'text-red-500 font-bold' : 'text-gray-700'}`}>
                                            {results.communalities[idx]?.toFixed(3) || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-xs text-gray-500 italic mt-2 p-2 bg-gray-50 rounded">
                            * Communality &lt; 0.4 được đánh dấu đỏ (biến giải thích kém).
                        </p>
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
                                onClick={() => onProceedToCFA(suggestedFactors)}
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
}

export default EFAResults;
