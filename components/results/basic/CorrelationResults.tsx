'use client';

import React from 'react';

interface CorrelationResultsProps {
    results: any;
    columns: string[];
}

/**
 * Correlation Matrix Results Component
 * Displays correlation matrix with color-coded heatmap
 */
export const CorrelationResults = React.memo(function CorrelationResults({ results, columns }: CorrelationResultsProps) {
    const matrix = results.correlationMatrix;
    const pValues = results.pValues; // Assuming pValues is available
    const N = results.N || results.n_cols || '-'; // If available

    return (
        <div className="space-y-6 overflow-x-auto font-sans">
            <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Correlations</h3>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <table className="min-w-full text-sm border-collapse text-slate-700">
                    <thead className="bg-slate-50 text-slate-700">
                        <tr className="border-y-2 border-slate-300">
                            <th colSpan={2} className="py-3 px-4 text-left font-semibold border-r border-slate-200">Variable</th>
                            {columns.map((col, idx) => (
                                <th key={idx} className="py-3 px-4 font-semibold text-center">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row: number[], rowIdx: number) => (
                            <React.Fragment key={rowIdx}>
                                {/* Pearson Correlation Row */}
                                <tr className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                                    <td rowSpan={pValues ? 2 : 1} className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200 align-top bg-slate-50/50">
                                        {columns[rowIdx]}
                                    </td>
                                    <td className="py-2 px-4 font-medium text-slate-600 border-r border-slate-200">
                                        Pearson Correlation
                                    </td>
                                    {row.map((value: number, colIdx: number) => {
                                        const isSelf = rowIdx === colIdx;
                                        const pVal = pValues ? pValues[rowIdx][colIdx] : null;
                                        let stars = '';
                                        if (!isSelf && pVal !== null) {
                                            if (pVal < 0.01) stars = '**';
                                            else if (pVal < 0.05) stars = '*';
                                        }

                                        return (
                                            <td key={colIdx} className={`py-2 px-4 text-center ${isSelf ? 'text-slate-400 font-bold' : 'text-slate-900 font-semibold'}`}>
                                                {isSelf ? '1' : value.toFixed(3)}{stars}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Sig. (2-tailed) Row */}
                                {pValues && (
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="py-2 px-4 text-slate-500 border-r border-slate-200 text-xs">
                                            Sig. (2-tailed)
                                        </td>
                                        {row.map((_, colIdx: number) => {
                                            const isSelf = rowIdx === colIdx;
                                            const pVal = pValues[rowIdx][colIdx];
                                            return (
                                                <td key={colIdx} className="py-2 px-4 text-center text-slate-500 text-xs">
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

            <div className="text-xs text-slate-500 italic mt-4 p-4 bg-slate-50 rounded-md border border-slate-200">
                <p>**. Correlation is significant at the 0.01 level (2-tailed).</p>
                <p>*. Correlation is significant at the 0.05 level (2-tailed).</p>
            </div>
        </div>
    );
});

export default CorrelationResults;
