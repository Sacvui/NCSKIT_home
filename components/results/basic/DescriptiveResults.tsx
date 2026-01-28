'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';

interface DescriptiveResultsProps {
    results: any;
    columns: string[];
}

/**
 * Descriptive Statistics Results Component
 * Displays descriptive statistics table and mean comparison chart
 */
export const DescriptiveResults = React.memo(function DescriptiveResults({ results, columns }: DescriptiveResultsProps) {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Descriptive Statistics</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="py-3 px-4 font-semibold text-gray-700">Variable</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">N</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">Min</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">Max</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">Mean</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">SD</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">Skewness</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">Kurtosis</th>
                            </tr>
                        </thead>
                        <tbody>
                            {columns.map((col, idx) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 font-medium text-gray-900">{col}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{(results.N && results.N[idx] !== undefined) ? results.N[idx] : 'N/A'}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{(results.min && results.min[idx] !== undefined) ? results.min[idx].toFixed(3) : '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{(results.max && results.max[idx] !== undefined) ? results.max[idx].toFixed(3) : '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-900 font-bold">{(results.mean && results.mean[idx] !== undefined) ? results.mean[idx].toFixed(3) : '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{(results.sd && results.sd[idx] !== undefined) ? results.sd[idx].toFixed(3) : '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{(results.skew && results.skew[idx] !== undefined) ? results.skew[idx].toFixed(3) : '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{(results.kurtosis && results.kurtosis[idx] !== undefined) ? results.kurtosis[idx].toFixed(3) : '-'}</td>
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
                        <Bar
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
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                        padding: 12,
                                        cornerRadius: 8,
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: '#f3f4f6' },
                                        ticks: { font: { size: 11 } }
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: { font: { size: 11 } }
                                    }
                                }
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});\r\n\r\nexport default DescriptiveResults;
