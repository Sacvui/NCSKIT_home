import React from 'react';

interface SPSSTableProps {
    title: string;
    children: React.ReactNode;
}

/**
 * SPSS-style table component
 * Provides consistent styling for statistical tables across all analysis results
 */
export function SPSSTable({ title, children }: SPSSTableProps) {
    return (
        <div className="mb-8 group">
            <h4 className="text-[11px] md:text-xs font-black text-slate-500 mb-2.5 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">
                {title}
            </h4>
            <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-200 shadow-sm bg-white relative">
                <table className="min-w-full text-[13px] md:text-sm border-collapse spss-academic-table">
                    <style jsx global>{`
                        .spss-academic-table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        .spss-academic-table th {
                            background-color: #f8fafc;
                            border: 1px solid #e2e8f0;
                            padding: 10px 16px;
                            text-align: left;
                            font-weight: 700;
                            color: #334155;
                            text-transform: uppercase;
                            font-size: 11px;
                        }
                        .spss-academic-table td {
                            border: 1px solid #e2e8f0;
                            padding: 8px 16px;
                            color: #475569;
                        }
                        .spss-academic-table tbody tr:hover {
                            background-color: #f1f5f9;
                        }
                    `}</style>
                    {children}
                </table>
                <div className="md:hidden absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-50/50 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}

export default SPSSTable;
