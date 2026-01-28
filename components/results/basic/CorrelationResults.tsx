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

    return (
        <div className="space-y-6 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b-2 border-black pb-2 inline-block">Ma Trận Tương Quan</h3>

            <table className="min-w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b-2 border-black">
                        <th className="py-3 px-4 text-left font-semibold bg-gray-50 border-r border-gray-200">Construct</th>
                        {columns.map((col, idx) => (
                            <th key={idx} className="py-3 px-4 font-semibold text-center border-b border-gray-300">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {matrix.map((row: number[], rowIdx: number) => (
                        <tr key={rowIdx} className="border-b border-gray-200 last:border-b-2 last:border-black">
                            <td className="py-3 px-4 font-medium border-r border-gray-200 bg-gray-50">
                                {columns[rowIdx]}
                            </td>
                            {row.map((value: number, colIdx: number) => {
                                const absVal = Math.abs(value);
                                let bgColor = 'transparent';
                                let textColor = 'text-gray-600';

                                if (rowIdx !== colIdx) {
                                    if (value > 0) {
                                        // Blue scale
                                        bgColor = `rgba(59, 130, 246, ${absVal * 0.8})`;
                                        textColor = absVal > 0.5 ? 'text-white font-bold' : 'text-gray-800';
                                    } else {
                                        // Red scale
                                        bgColor = `rgba(239, 68, 68, ${absVal * 0.8})`;
                                        textColor = absVal > 0.5 ? 'text-white font-bold' : 'text-gray-800';
                                    }
                                } else {
                                    return (
                                        <td key={colIdx} className="py-3 px-4 text-center bg-gray-100 font-bold text-gray-400">
                                            1.000
                                        </td>
                                    );
                                }

                                return (
                                    <td
                                        key={colIdx}
                                        className={`py-3 px-4 text-center ${textColor}`}
                                        style={{ backgroundColor: bgColor }}
                                    >
                                        {value.toFixed(3)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-4 items-center text-xs mt-3">
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-blue-500 opacity-80"></span>
                    <span>Tương quan Dương (Mạnh)</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-red-500 opacity-80"></span>
                    <span>Tương quan Âm (Mạnh)</span>
                </div>
            </div>
            <p className="text-xs text-gray-500 italic mt-1">* Màu sắc đậm nhạt thể hiện mức độ tương quan.</p>
        </div>
    );
});\r\n\r\nexport default CorrelationResults;
