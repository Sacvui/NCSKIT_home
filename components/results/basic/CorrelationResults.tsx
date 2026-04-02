'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Layers, Activity } from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

interface CorrelationResultsProps {
    results: any;
    columns: string[];
}

/**
 * Correlation Matrix Results Component - Scientific Academic Style (White & Blue)
 */
export const CorrelationResults = React.memo(function CorrelationResults({ results, columns }: CorrelationResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    const matrix = results.correlationMatrix;
    const pValues = results.pValues;
    
    if (!matrix || !columns) return null;

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-500">
            {/* White-Blue Academic Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-600" />
                        Correlations Matrix (Ma trận Tương quan Pearson)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-slate-700">
                        <thead className="bg-blue-50/50 border-y border-blue-100">
                            <tr>
                                <th colSpan={2} className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Variable (Biến)</th>
                                {columns.map((col, idx) => (
                                    <th key={idx} className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center border-l border-blue-50 min-w-[100px]">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            {matrix.map((row: number[], rowIdx: number) => (
                                <React.Fragment key={rowIdx}>
                                    {/* Pearson Correlation Row */}
                                    <tr className="hover:bg-blue-50/30 transition-colors group">
                                        <td rowSpan={pValues ? 2 : 1} className="py-5 px-6 font-bold text-blue-800 border-r border-blue-50 bg-slate-50/30">
                                            {columns[rowIdx]}
                                        </td>
                                        <td className="py-4 px-4 font-black text-blue-900 border-r border-blue-50 text-[10px] uppercase bg-slate-50/20">
                                            Pearson<br/><span className="text-[10px] text-blue-600 font-extrabold italic tracking-tighter">Correlation</span>
                                        </td>
                                        {row.map((value: number, colIdx: number) => {
                                            const isSelf = rowIdx === colIdx;
                                            const pVal = pValues ? pValues[rowIdx][colIdx] : null;
                                            let stars = '';
                                            if (!isSelf && pVal !== null) {
                                                if (pVal < 0.01) stars = '**';
                                                else if (pVal < 0.05) stars = '*';
                                            }

                                            // Subdued Heatmap style for academic feel
                                            const absVal = Math.abs(value);
                                            const bgOpacity = isSelf ? 'bg-slate-50' : 
                                                              absVal >= 0.7 ? 'bg-blue-100/40 text-blue-900' :
                                                              absVal >= 0.5 ? 'bg-blue-50/40 text-blue-800' : 'bg-transparent';

                                            return (
                                                <td key={colIdx} className={`py-4 px-4 text-sm text-center border-l border-blue-50 font-mono transition-colors ${bgOpacity} ${isSelf ? 'text-slate-300' : 'text-blue-950 font-black'}`}>
                                                    {isSelf ? '1' : value.toFixed(3)}{stars}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {/* Sig. (2-tailed) Row */}
                                    {pValues && (
                                        <tr className="hover:bg-blue-50/30 transition-colors border-b border-blue-50/50">
                                            <td className="py-2 px-4 font-black text-slate-800 border-r border-blue-50 text-[10px] uppercase bg-slate-50/20">
                                                Sig.<br/><span className="italic font-normal lowercase">(2-tailed)</span>
                                            </td>
                                            {row.map((_, colIdx: number) => {
                                                const isSelf = rowIdx === colIdx;
                                                const pVal = pValues[rowIdx][colIdx];
                                                return (
                                                    <td key={colIdx} className={`py-2 px-4 text-center border-l border-blue-50 text-[10px] font-mono ${isSelf ? '' : pVal < 0.05 ? 'text-blue-900 font-black underline' : 'text-slate-600'}`}>
                                                        {isSelf ? '' : (pVal < 0.001 ? '<.001' : pVal.toFixed(3))}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Significance Legend */}
            <div className="flex items-center gap-6 text-[11px] font-black text-blue-900 uppercase tracking-widest p-4 rounded-xl border border-blue-100 bg-blue-50/20">
                <div className="flex items-center gap-2">
                    <span className="text-xl text-blue-600">**</span>
                    <span>Significant at 0.01 level</span>
                </div>
                <div className="flex items-center gap-2 border-l border-blue-200 pl-6">
                    <span className="text-xl text-blue-600 font-black">*</span>
                    <span>Significant at 0.05 level</span>
                </div>
                <div className="flex-1 text-right italic font-normal normal-case text-slate-400 border-l border-blue-200 pl-6">
                    Sample size (N) = {results?.N?.[0] || 'N/A'}
                </div>
            </div>
        </div>
    );
});

export default CorrelationResults;
