import React from 'react';

interface Column {
    key: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    format?: (value: any) => string;
    className?: string;
}

interface StatisticsTableProps {
    columns: Column[];
    data: any[];
    className?: string;
}

/**
 * Generic Statistics Table Component
 * Reusable table for displaying statistical data
 */
export function StatisticsTable({ columns, data, className = '' }: StatisticsTableProps) {
    return (
        <div className={`relative group ${className}`}>
            <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-200 shadow-sm bg-white">
                <table className="min-w-full text-[13px] md:text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`py-3.5 px-4 font-bold text-slate-700 uppercase tracking-tight ${col.align === 'right' ? 'text-right' :
                                            col.align === 'center' ? 'text-center' :
                                                'text-left'
                                        }`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row, rowIdx) => (
                            <tr
                                key={rowIdx}
                                className="hover:bg-blue-50/50 transition-colors group/row"
                            >
                                {columns.map((col, colIdx) => {
                                    const value = row[col.key];
                                    const displayValue = col.format ? col.format(value) : value;

                                    return (
                                        <td
                                            key={colIdx}
                                            className={`py-3 px-4 ${col.align === 'right' ? 'text-right' :
                                                    col.align === 'center' ? 'text-center' :
                                                        'text-left'
                                                } ${col.className || 'text-slate-600 font-medium'}`}
                                        >
                                            {displayValue}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Mobile Scroll Indicator Shadow (Visual hint) */}
            <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}

export default StatisticsTable;
