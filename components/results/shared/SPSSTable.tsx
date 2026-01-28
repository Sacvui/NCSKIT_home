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
        <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                {title}
            </h4>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 text-sm">
                    <style jsx>{`
            table {
              border-collapse: collapse;
            }
            table th {
              background-color: #f8f9fa;
              border: 1px solid #dee2e6;
              padding: 8px 12px;
              text-align: left;
              font-weight: 600;
              color: #495057;
            }
            table td {
              border: 1px solid #dee2e6;
              padding: 8px 12px;
              color: #212529;
            }
            table tbody tr:hover {
              background-color: #f8f9fa;
            }
          `}</style>
                    {children}
                </table>
            </div>
        </div>
    );
}

export default SPSSTable;
