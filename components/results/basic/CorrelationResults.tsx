'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, Layers } from 'lucide-react';

import { getStoredLocale, t, type Locale } from '@/lib/i18n';

interface CorrelationResultsProps {
    results: any;
    columns: string[];
}

/**
 * Correlation Matrix Results Component
 * Displays correlation matrix with color-coded heatmap and high contrast
 */
export const CorrelationResults = React.memo(function CorrelationResults({ results, columns }: CorrelationResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    const matrix = results.correlationMatrix;
    const pValues = results.pValues;
    
    return (
        <div className="space-y-8 font-sans">
            <Card className="border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
                <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800/50 pb-4">
                    <CardTitle className="text-slate-950 dark:text-slate-100 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        {t(locale, 'tables.correlations')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto pt-6 px-0">
                    <table className="min-w-full text-sm border-collapse text-slate-700 dark:text-slate-300">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-slate-100">
                            <tr className="border-y-2 border-slate-300 dark:border-slate-700">
                                <th colSpan={2} className="py-4 px-6 text-left font-black uppercase tracking-tight text-xs border-r border-slate-200 dark:border-slate-700">{t(locale, 'tables.variable')}</th>
                                {columns.map((col, idx) => (
                                    <th key={idx} className="py-4 px-4 font-black uppercase tracking-tight text-[10px] text-center border-l dark:border-slate-700 min-w-[80px]">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row: number[], rowIdx: number) => (
                                <React.Fragment key={rowIdx}>
                                    {/* Pearson Correlation Row */}
                                    <tr className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                        <td rowSpan={pValues ? 2 : 1} className="py-4 px-6 font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700 align-top bg-slate-50/30 dark:bg-slate-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                            {columns[rowIdx]}
                                        </td>
                                        <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900">
                                            Pearson<br/><span className="text-[10px] text-slate-400 font-normal italic">Correlation</span>
                                        </td>
                                        {row.map((value: number, colIdx: number) => {
                                            const isSelf = rowIdx === colIdx;
                                            const pVal = pValues ? pValues[rowIdx][colIdx] : null;
                                            let stars = '';
                                            if (!isSelf && pVal !== null) {
                                                if (pVal < 0.01) stars = '**';
                                                else if (pVal < 0.05) stars = '*';
                                            }

                                            // Heatmap background calculation
                                            const absVal = Math.abs(value);
                                            const bgOpacity = isSelf ? 'bg-transparent' : 
                                                              absVal >= 0.7 ? 'bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' :
                                                              absVal >= 0.5 ? 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 
                                                              absVal >= 0.3 ? 'bg-blue-50/30 dark:bg-blue-950/10' : 'bg-transparent';

                                            return (
                                                <td key={colIdx} className={`py-3 px-4 text-center border-l dark:border-slate-800 transition-colors ${bgOpacity} ${isSelf ? 'text-slate-300 dark:text-slate-700' : 'text-slate-900 dark:text-slate-100 font-black'}`}>
                                                    {isSelf ? '1' : value.toFixed(3)}{stars}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {/* Sig. (2-tailed) Row */}
                                    {pValues && (
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800/50">
                                            <td className="py-2 px-4 text-slate-500 dark:text-slate-500 border-r border-slate-200 dark:border-slate-700 text-[10px] font-bold">
                                                Sig.<br/><span className="italic font-normal">(2-tailed)</span>
                                            </td>
                                            {row.map((_, colIdx: number) => {
                                                const isSelf = rowIdx === colIdx;
                                                const pVal = pValues[rowIdx][colIdx];
                                                return (
                                                    <td key={colIdx} className={`py-2 px-4 text-center border-l dark:border-slate-800 text-[10px] font-mono ${isSelf ? '' : pVal < 0.05 ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400 dark:text-slate-600'}`}>
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
                </CardContent>
            </Card>

            <div className="flex items-center gap-6 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-inner">
                <div className="flex items-center gap-2">
                    <span className="text-xl text-indigo-600 dark:text-indigo-400">**</span>
                    <span>Significant at 0.01 level</span>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-300 dark:border-slate-700 pl-6">
                    <span className="text-xl text-indigo-500 dark:text-indigo-500 font-black">*</span>
                    <span>Significant at 0.05 level</span>
                </div>
                <div className="flex-1 text-right italic font-normal normal-case text-slate-400 underline decoration-slate-200 decoration-dotted underline-offset-4">
                    Sample size (N) = {results?.N?.[0] || 'N/A'}
                </div>
            </div>
        </div>
    );
});

export default CorrelationResults;
