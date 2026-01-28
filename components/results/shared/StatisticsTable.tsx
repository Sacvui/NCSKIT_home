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
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full bg-white border border-gray-300 text-sm">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={`py-3 px-4 font-semibold text-gray-700 ${col.align === 'right' ? 'text-right' :
                                        col.align === 'center' ? 'text-center' :
                                            'text-left'
                                    }`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIdx) => (
                        <tr
                            key={rowIdx}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
                                            } ${col.className || 'text-gray-600'}`}
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
    );
}

export default StatisticsTable;
