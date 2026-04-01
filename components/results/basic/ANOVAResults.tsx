'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ANOVAResultsProps {
    results: any;
    columns: string[];
}

/**
 * One-Way ANOVA Results Component
 * Displays ANOVA table and group means
 */
export const ANOVAResults = React.memo(function ANOVAResults({ results, columns }: ANOVAResultsProps) {
    const pValue = results.pValue;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="overflow-hidden bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                        ANOVA Table
                    </h3>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/80 border-b border-slate-800">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source of Variation</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">df</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">F-Value</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Sig (p)</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">η² (Eta²)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            <tr className="hover:bg-slate-900/30 transition-colors">
                                <td className="px-6 py-4 text-sm font-black text-white uppercase tracking-tight">Between Groups</td>
                                <td className="px-6 py-4 text-sm text-slate-300 text-center font-bold">{results.dfBetween?.toFixed(0)}</td>
                                <td className="px-6 py-4 text-sm text-white text-right font-black">{results.F?.toFixed(3)}</td>
                                <td className={`px-6 py-4 text-sm text-right font-black ${significant ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {pValue?.toFixed(4)} {significant && ' (Sig.)'}
                                </td>
                                <td className="px-6 py-4 text-sm text-indigo-400 text-right font-bold">{results.etaSquared?.toFixed(3)}</td>
                            </tr>
                            <tr className="hover:bg-slate-900/30 transition-colors bg-slate-900/10">
                                <td className="px-6 py-4 text-sm font-black text-slate-400 uppercase tracking-tight">Within Groups (Residuals)</td>
                                <td className="px-6 py-4 text-sm text-slate-500 text-center">{results.dfWithin?.toFixed(0)}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 text-right">—</td>
                                <td className="px-6 py-4 text-sm text-slate-600 text-right">—</td>
                                <td className="px-6 py-4 text-sm text-slate-600 text-right">—</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="overflow-hidden bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Descriptive Group Means
                    </h3>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/80 border-b border-slate-800">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Group / Variable</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Mean Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {columns.map((col, idx) => (
                                <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-black text-white uppercase tracking-tight">{col}</td>
                                    <td className="px-6 py-4 text-sm text-indigo-400 text-right font-black">{results.groupMeans?.[idx]?.toFixed(3)}</td>
                                </tr>
                            ))}
                            <tr className="bg-indigo-600">
                                <td className="px-6 py-4 text-sm font-black text-white uppercase tracking-widest">Grand Total Mean</td>
                                <td className="px-6 py-4 text-sm text-white text-right font-black">{results.grandMean?.toFixed(3)}</td>
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
                    Interpretation & Hypotheses
                </h4>
                
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${results.assumptionCheckP < 0.05 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-emerald-500'}`}></div>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">
                            <span className="text-slate-500 font-bold uppercase tracking-tighter mr-2">Assumptions:</span>
                            Kiểm định Bartlett cho thấy phương sai của các nhóm 
                            {results.assumptionCheckP < 0.05 
                                ? <span className="text-amber-400 font-black"> KHÔNG ĐỒNG NHẤT (p = {results.assumptionCheckP?.toFixed(4)})</span> 
                                : <span className="text-emerald-400 font-black"> ĐỒNG NHẤT (p = {results.assumptionCheckP?.toFixed(4)})</span>
                            }.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${significant ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`}></div>
                        <p className="text-sm text-slate-100 leading-relaxed font-bold">
                            <span className="text-slate-500 font-bold uppercase tracking-tighter mr-2">Standard Conclusion:</span>
                            {significant
                                ? `Kết quả cho thấy có sự khác biệt có ý nghĩa thống kê giữa các nhóm (F(${results.dfBetween?.toFixed(0)}, ${results.dfWithin?.toFixed(0)}) = ${results.F?.toFixed(3)}, p = ${pValue?.toFixed(4)} < 0.05).`
                                : `Kết quả cho thấy không có sự khác biệt có ý nghĩa thống kê giữa các nhóm (F(${results.dfBetween?.toFixed(0)}, ${results.dfWithin?.toFixed(0)}) = ${results.F?.toFixed(3)}, p = ${pValue?.toFixed(4)} >= 0.05).`
                            }
                            <span className="block mt-3 text-indigo-300 italic opacity-90 p-3 bg-slate-900/50 rounded-xl border border-slate-800 font-black tracking-tight">
                                Giải thích: Độ lớn ảnh hưởng (Eta-squared) đạt {results.etaSquared?.toFixed(3)}, 
                                cho thấy các nhóm này giải thích được khoảng {(results.etaSquared * 100).toFixed(1)}% sự biến thiên của biến phụ thuộc.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ANOVAResults;
