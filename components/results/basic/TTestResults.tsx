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
 * Memoized to prevent unnecessary re-renders
 */
export const TTestResults = React.memo(function TTestResults({ results, columns }: TTestResultsProps) {
    const pValue = results.pValue;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="overflow-hidden bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                        Independent Samples T-Test Results
                    </h3>
                    <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        NCSKIT PRO Stats
                    </div>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <tbody className="divide-y divide-slate-800/50">
                            <tr className="hover:bg-slate-900/30 transition-colors">
                                <td className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-tight">Group 1 ({columns[0]})</td>
                                <td className="px-6 py-4 text-sm text-white text-right font-black tracking-tight">Mean = {results.mean1?.toFixed(3)}</td>
                            </tr>
                            <tr className="hover:bg-slate-900/30 transition-colors">
                                <td className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-tight">Group 2 ({columns[1]})</td>
                                <td className="px-6 py-4 text-sm text-white text-right font-black tracking-tight">Mean = {results.mean2?.toFixed(3)}</td>
                            </tr>
                            <tr className="bg-indigo-950/20">
                                <td className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-tight italic">Mean Difference</td>
                                <td className="px-6 py-4 text-sm text-indigo-400 text-right font-black underline decoration-indigo-500/50 underline-offset-4 tracking-tighter">
                                    {results.meanDiff?.toFixed(3)}
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-900/30 transition-colors">
                                <td className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-tight">t-statistic</td>
                                <td className="px-6 py-4 text-sm text-white text-right font-black">{results.t?.toFixed(3)}</td>
                            </tr>
                            <tr className="hover:bg-slate-900/30 transition-colors">
                                <td className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-tight">Degrees of Freedom (df)</td>
                                <td className="px-6 py-4 text-sm text-white text-right font-medium">{results.df?.toFixed(2)}</td>
                            </tr>
                            <tr className="hover:bg-slate-900/30 transition-colors bg-slate-900/10">
                                <td className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-tight">p-value (Sig. 2-tailed)</td>
                                <td className={`px-6 py-4 text-sm text-right font-black ${significant ? 'text-emerald-400 scale-110 origin-right transition-transform' : 'text-slate-500'}`}>
                                    {pValue?.toFixed(4)} {significant ? ' (Significant)' : ''}
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-900/30 transition-colors">
                                <td className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-tight">95% Confidence Interval</td>
                                <td className="px-6 py-4 text-sm text-slate-300 text-right font-mono tracking-tighter">
                                    [{results.ci95Lower?.toFixed(3)} → {results.ci95Upper?.toFixed(3)}]
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-900/30 transition-colors">
                                <td className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-tight italic">Cohen&apos;s d Effect Size</td>
                                <td className="px-6 py-4 text-sm text-white text-right font-black">{results.effectSize?.toFixed(3)}</td>
                            </tr>
                            <tr className="bg-slate-900/40 divide-x divide-slate-800">
                                <td className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Levene&apos;s Test for Equality of Variances (p)</td>
                                <td className={`px-6 py-4 text-sm text-right font-black ${results.varTestP < 0.05 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {results.varTestP?.toFixed(4) || 'N/A'}
                                    <span className="text-[10px] font-black uppercase tracking-tighter ml-2 opacity-70">
                                        {results.varTestP < 0.05 ? '(Unequal)' : '(Equal)'}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-slate-950 border-2 border-slate-800 p-8 rounded-2xl shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl font-black text-white italic">APA</span>
                </div>
                
                <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-6 flex items-center gap-2">
                    <div className="w-4 h-[1px] bg-indigo-500"></div>
                    Hypothesis Interpretation
                </h4>

                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${results.varTestP < 0.05 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-emerald-500'}`}></div>
                        <p className="text-sm text-slate-200 leading-relaxed font-bold">
                            <span className="text-slate-500 font-bold uppercase tracking-tighter mr-2 italic underline underline-offset-4">Assumption:</span>
                            {results.varTestP < 0.05
                                ? 'Phương sai hác biệt có ý nghĩa thống kê (p < 0.05). NCSKIT đã tự động hiệu chỉnh bằng Welch T-test để bảo đảm tính chuẩn xác của kết quả.'
                                : 'Phương sai của hai nhóm được coi là đồng nhất (p >= 0.05). Kiểm định Student T-test tiêu chuẩn được áp dụng.'}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${significant ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-slate-700'}`}></div>
                        <p className="text-sm text-slate-100 leading-relaxed font-black">
                            <span className="text-slate-500 font-bold uppercase tracking-tighter mr-2 italic underline underline-offset-4">Results:</span>
                            {significant
                                ? `Có sự khác biệt có ý nghĩa thống kê giữa nhóm "${columns[0]}" và "${columns[1]}" về mặt điểm trung bình (p = ${pValue?.toFixed(4)} < 0.05).`
                                : `Không phát hiện thấy sự khác biệt có ý nghĩa thống kê về mặt điểm trung bình giữa hai nhóm này (p = ${pValue?.toFixed(4)} >= 0.05).`
                            }
                            <span className="block mt-4 text-indigo-300 italic opacity-95 p-4 bg-slate-900/70 rounded-xl border border-slate-800 font-black tracking-tight leading-loose shadow-inner">
                                Phân tích Cohen&apos;s d: Giá trị d = ${results.effectSize?.toFixed(2)} chỉ ra rằng mức độ tác động của sự khác biệt này được xếp vào loại 
                                <span className="text-white underline decoration-wavy ml-1">
                                    {Math.abs(results.effectSize) > 0.8 ? 'RẤT LỚN (Substantial)' : Math.abs(results.effectSize) > 0.5 ? 'TRUNG BÌNH (Moderate)' : 'NHỎ (Minor)'}
                                </span>.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default TTestResults;
