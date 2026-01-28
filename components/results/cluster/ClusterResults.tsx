'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ClusterResultsProps {
    results: any;
    columns: string[];
}

/**
 * Cluster Analysis Results Component
 * Displays K-Means clustering results with cluster centers
 */
export const ClusterResults = React.memo(function ClusterResults({ results, columns }: ClusterResultsProps) {
    const k = results.k || 3;
    const clusterSizes = results.clusterSizes || [];
    const centers = results.centers || [];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cluster Analysis Summary (K-Means, k={k})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">{k}</div>
                            <div className="text-xs text-blue-600">Clusters</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">{results.totalN || 'N/A'}</div>
                            <div className="text-xs text-green-600">Total Observations</div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">{results.betweenSS?.toFixed(1) || 'N/A'}</div>
                            <div className="text-xs text-purple-600">Between SS</div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg text-center">
                            <div className="text-2xl font-bold text-orange-600">{results.withinSS?.toFixed(1) || 'N/A'}</div>
                            <div className="text-xs text-orange-600">Within SS</div>
                        </div>
                    </div>

                    <h4 className="font-semibold mb-2">Cluster Sizes</h4>
                    <div className="flex gap-2 mb-6">
                        {clusterSizes.map((size: number, idx: number) => (
                            <div key={idx} className="px-4 py-2 bg-gray-100 rounded-lg text-center">
                                <span className="font-bold">Cluster {idx + 1}:</span> {size}
                            </div>
                        ))}
                    </div>

                    <h4 className="font-semibold mb-2">Cluster Centers</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-2 px-3 text-left font-semibold">Cluster</th>
                                    {columns.map((col, idx) => (
                                        <th key={idx} className="py-2 px-3 text-right font-semibold">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {centers.map((center: number[], cIdx: number) => (
                                    <tr key={cIdx} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-2 px-3 font-medium">Cluster {cIdx + 1}</td>
                                        {center.map((val: number, vIdx: number) => (
                                            <td key={vIdx} className="py-2 px-3 text-right">
                                                {typeof val === 'number' ? val.toFixed(3) : val}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800">
                    Dữ liệu được phân thành <strong>{k} cụm</strong> sử dụng thuật toán K-Means.
                    Các cụm có kích thước: {clusterSizes.join(', ')}.
                    Xem bảng Cluster Centers để hiểu đặc điểm của từng cụm dựa trên giá trị trung bình của các biến.
                </p>
            </div>
        </div>
    );
});\r\n\r\nexport default ClusterResults;
