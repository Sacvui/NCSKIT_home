'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartWrapper } from '../shared/ChartWrapper';

interface DescriptiveResultsProps {
    results: any;
    columns: string[];
}

/**
 * Descriptive Statistics Results Component
 * Displays descriptive statistics table and mean comparison chart
 */
// Helper for safe number formatting
const safeToFixed = (val: any, digits = 3) => {
    if (val === undefined || val === null || isNaN(val)) return '-';
    return Number(val).toFixed(digits);
};

export const DescriptiveResults = React.memo(function DescriptiveResults({ results, columns }: DescriptiveResultsProps) {
    return (
        <div className="space-y-8">
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b bg-slate-50/50 pb-4">
                    <CardTitle className="text-slate-800">Descriptive Statistics</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto pt-6">
                    <table className="w-full text-left text-sm whitespace-nowrap text-slate-700">
                        <thead className="bg-slate-50 text-slate-700">
                            <tr className="border-y-2 border-slate-300">
                                <th className="py-3 px-4 font-semibold">Variable</th>
                                <th className="py-3 px-4 font-semibold text-center">N</th>
                                <th className="py-3 px-4 font-semibold text-right">Min</th>
                                <th className="py-3 px-4 font-semibold text-right">Max</th>
                                <th className="py-3 px-4 font-semibold text-right">Mean</th>
                                <th className="py-3 px-4 font-semibold text-right">SD</th>
                                <th className="py-3 px-4 font-semibold text-right">Skewness</th>
                                <th className="py-3 px-4 font-semibold text-right">Kurtosis</th>
                            </tr>
                        </thead>
                        <tbody>
                            {columns.map((col, idx) => (
                                <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-slate-800">{col}</td>
                                    <td className="py-3 px-4 text-center text-slate-600">{(results.N && results.N[idx] !== undefined) ? results.N[idx] : 'N/A'}</td>
                                    <td className="py-3 px-4 text-right text-slate-600">{safeToFixed(results.min?.[idx])}</td>
                                    <td className="py-3 px-4 text-right text-slate-600">{safeToFixed(results.max?.[idx])}</td>
                                    <td className="py-3 px-4 text-right text-slate-900 font-bold">{safeToFixed(results.mean?.[idx])}</td>
                                    <td className="py-3 px-4 text-right text-slate-600">{safeToFixed(results.sd?.[idx])}</td>
                                    <td className="py-3 px-4 text-right text-slate-600">{safeToFixed(results.skew?.[idx])}</td>
                                    <td className="py-3 px-4 text-right text-slate-600">{safeToFixed(results.kurtosis?.[idx])}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Mean Value Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80 w-full">
                        <ChartWrapper
                            type="bar"
                            data={{
                                labels: columns,
                                datasets: [{
                                    label: 'Mean',
                                    data: results.mean,
                                    backgroundColor: 'rgba(79, 70, 229, 0.7)', // Indigo-600 with opacity
                                    borderColor: 'rgba(79, 70, 229, 1)',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                }]
                            }}
                            options={{
                                plugins: {
                                    legend: { display: false }
                                }
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});

export default DescriptiveResults;
