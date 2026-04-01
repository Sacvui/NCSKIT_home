'use client';

import React, { useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, CheckCircle, BarChart, Grid, HelpCircle } from 'lucide-react';

import { getStoredLocale, t, type Locale } from '@/lib/i18n';

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
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

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
        <div className="space-y-8 font-sans">
            {/* KMO and Bartlett's Test Card */}
            <Card className="border-indigo-200 dark:border-indigo-900 shadow-lg overflow-hidden">
                <CardHeader className="border-b bg-indigo-50/50 dark:bg-slate-800/80 pb-4">
                    <CardTitle className="text-indigo-950 dark:text-indigo-100 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Kiểm định KMO và Bartlett (Sampling Adequacy)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-5 rounded-2xl border-2 transition-all ${kmoAcceptable ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'}`}>
                            <div className="text-xs font-black uppercase text-slate-500 mb-1">KMO Measure (Hệ số KMO)</div>
                            <div className={`text-4xl font-black ${kmoAcceptable ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                                {kmo.toFixed(3)}
                            </div>
                            <div className="text-xs font-bold mt-2 opacity-80">
                                {kmo >= 0.8 ? '✓ Rất tốt' : kmo >= 0.7 ? '✓ Tốt' : kmo >= 0.6 ? '✓ Chấp nhận được' : '✗ Không đạt chuẩn (α < 0.6)'}
                            </div>
                        </div>
                        <div className={`p-5 rounded-2xl border-2 transition-all ${bartlettSignificant ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/50' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                            <div className="text-xs font-black uppercase text-slate-500 mb-1">Bartlett&apos;s Test (Sig.)</div>
                            <div className={`text-4xl font-black ${bartlettSignificant ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-400'}`}>
                                {bartlettP < 0.001 ? '< .001' : bartlettP.toFixed(4)}
                            </div>
                            <div className="text-xs font-bold mt-2 opacity-80">
                                {bartlettSignificant ? '✓ Có ý nghĩa thống kê (p < 0.05)' : '✗ Không có ý nghĩa thống kê'}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Total Variance Explained */}
            {results.eigenvalues && results.eigenvalues.length > 0 && (
                <Card className="border-slate-200 dark:border-slate-800 shadow-md">
                    <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800 pb-4">
                        <CardTitle className="text-slate-950 dark:text-slate-100 flex items-center gap-2">
                            <BarChart className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            Tổng phương sai trích (Total Variance Explained)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto pt-6">
                        <table className="w-full text-left text-sm whitespace-nowrap text-slate-700 dark:text-slate-300 border-collapse">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-slate-100">
                                <tr className="border-y-2 border-slate-300 dark:border-slate-700">
                                    <th className="py-3 px-4 font-black uppercase tracking-tight text-xs text-center">Nhân tố</th>
                                    <th className="py-3 px-4 font-black uppercase tracking-tight text-xs text-right border-l border-slate-200 dark:border-slate-700">Giá trị riêng (Eigenvalue)</th>
                                    <th className="py-3 px-4 font-black uppercase tracking-tight text-xs text-right border-l border-slate-200 dark:border-slate-700">% Phương sai</th>
                                    <th className="py-3 px-4 font-black uppercase tracking-tight text-xs text-right border-l border-slate-200 dark:border-slate-700">% Tích lũy</th>
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
                                            <tr key={i} className={`border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isExtracted ? 'bg-indigo-50/20 dark:bg-indigo-900/10' : ''}`}>
                                                <td className={`py-3 px-4 font-black text-center ${isExtracted ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`}>{i + 1}</td>
                                                <td className={`py-3 px-4 text-right border-l border-slate-200 dark:border-slate-700 ${isExtracted ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>{ev.toFixed(3)}</td>
                                                <td className={`py-3 px-4 text-right border-l border-slate-200 dark:border-slate-700 ${isExtracted ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>{pct.toFixed(2)}%</td>
                                                <td className={`py-3 px-4 text-right border-l border-slate-200 dark:border-slate-700 ${isExtracted ? 'font-black text-indigo-700 dark:text-indigo-400 underline underline-offset-4 decoration-indigo-200' : 'text-slate-500'}`}>{cumVar.toFixed(2)}%</td>
                                            </tr>
                                        );
                                    });
                                })()}
                            </tbody>
                        </table>
                        <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl mt-6">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-blue-900 dark:text-blue-300 font-medium leading-relaxed">
                                Đã trích xuất <strong>{results.nFactorsUsed} nhân tố</strong> (vùng tô màu). 
                                <strong> Eigenvalue &gt; 1</strong> đảm bảo nhân tố giải thích đủ lượng phương sai cần thiết của một biến chuẩn.
                                Phân tích EFA dừng lại khi phần trăm tích lũy đạt mức tin cậy cao (thường &gt; 50%).
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Factor Loadings Matrix */}
            {results.loadings && (
                <Card className="border-slate-200 dark:border-slate-800 shadow-md">
                    <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800/50 pb-4">
                        <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Grid className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            {results.factorMethod === 'none' ? 'Ma trận nhân tố (Component Matrix)' : 'Ma trận xoay (Rotated Matrix)'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto pt-6">
                        <table className="w-full text-sm whitespace-nowrap text-slate-700 dark:text-slate-300 border-collapse">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                                <tr className="border-y-2 border-slate-300 dark:border-slate-700">
                                    <th className="py-3 px-4 text-left font-black uppercase tracking-tighter text-xs">Biến quan sát</th>
                                    {Array.isArray(results.loadings[0]) && results.loadings[0].map((_: any, idx: number) => (
                                        <th key={idx} className="py-3 px-4 text-right font-black uppercase tracking-tighter text-xs border-l border-slate-200 dark:border-slate-700">Factor {idx + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {columns.map((col, rowIdx) => (
                                    <tr key={rowIdx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all font-sans">
                                        <td className="py-4 px-4 font-black text-slate-900 dark:text-white bg-slate-50/30 dark:bg-slate-900/30">{col}</td>
                                        {Array.isArray(results.loadings[rowIdx]) && results.loadings[rowIdx].map((val: number, colIdx: number) => {
                                            const isSuppressed = Math.abs(val) < 0.3;
                                            const isStrong = Math.abs(val) >= 0.5;
                                            return (
                                                <td
                                                    key={colIdx}
                                                    className={`py-4 px-4 text-right border-l border-slate-200 dark:border-slate-700 ${isStrong ? 'font-black text-indigo-700 dark:text-indigo-400 scale-110 bg-indigo-50/10 dark:bg-indigo-950/10 transform' : isSuppressed ? 'text-slate-300 dark:text-slate-700 font-light' : 'text-slate-700 dark:text-slate-300 font-bold'}`}
                                                >
                                                    {isSuppressed ? '' : val?.toFixed(3)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mt-6 px-4 bg-slate-50 dark:bg-slate-900/50 py-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                            * Loadings &lt; 0.3 ẩn (Suppressed); <strong>Loadings ≥ 0.5</strong> được tô đậm để nhận diện cấu trúc. Biến nào có Loadings lớn ở cả 2 nhân tố là biến tải kép, cần cân nhắc loại bỏ.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Workflow: Next Step Button */}
            {suggestedFactors.length > 0 && onProceedToCFA && kmoAcceptable && bartlettSignificant && (
                <div className="bg-gradient-to-tr from-emerald-600 to-teal-700 p-8 rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-none text-white relative overflow-hidden group">
                     {/* Decorative background shape */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                    
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="flex-shrink-0 w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-4xl shadow-2xl border border-white/30 rotate-3 group-hover:rotate-0 transition-transform">
                            ✓
                        </div>
                        <div className="flex-1">
                            <div className="inline-block px-3 py-1 bg-emerald-500/50 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-white/20">
                                Analysis Validated (Đã xác thực)
                            </div>
                            <h4 className="font-black mb-2 text-2xl tracking-tighter">EFA THÀNH CÔNG - SẴN SÀNG CFA</h4>
                            <p className="text-white/80 text-sm mb-6 leading-relaxed max-w-2xl font-medium">
                                EFA đã xác định được <strong>{suggestedFactors.length} nhân tố</strong> ổn định. 
                                Để đảm bảo mô hình đo lường đạt độ tin cậy và giá trị phân biệt tuyệt đối, chúng ta cần chạy CFA.
                            </p>
                            <button
                                onClick={handleProceedToCFA}
                                className="px-8 py-4 bg-white text-emerald-800 hover:bg-emerald-50 font-black rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 transform hover:-translate-y-1 active:scale-95"
                            >
                                <span>TIẾN HÀNH CFA ({suggestedFactors.length} NHÂN TỐ)</span>
                                <span className="text-2xl">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default EFAResults;
