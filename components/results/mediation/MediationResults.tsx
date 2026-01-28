'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MediationResultsProps {
    results: any;
    columns: string[];
}

/**
 * Mediation Analysis Results Component
 * Displays Baron & Kenny mediation analysis with path coefficients
 */
export const MediationResults = React.memo(function MediationResults({ results, columns }: MediationResultsProps) {
    // columns: [X, M, Y]
    const sobelP = results.sobelP;
    const significant = sobelP < 0.05;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Mediation Analysis Results (Baron & Kenny)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Mô hình:</strong> {columns[0]} (X) → {columns[1]} (M) → {columns[2]} (Y)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 border-b pb-2">Path Coefficients</h4>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Path a (X → M):</span>
                                    <span className="text-sm">{results.paths?.a?.est?.toFixed(4)} (p={results.paths?.a?.p?.toFixed(4)})</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Path b (M → Y):</span>
                                    <span className="text-sm">{results.paths?.b?.est?.toFixed(4)} (p={results.paths?.b?.p?.toFixed(4)})</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Path c (Total Effect):</span>
                                    <span className="text-sm">{results.paths?.c_prime?.est?.toFixed(4)} (p={results.paths?.c_prime?.p?.toFixed(4)})</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Path c&apos; (Direct Effect):</span>
                                    <span className="text-sm">{results.paths?.c?.est?.toFixed(4)} (p={results.paths?.c?.p?.toFixed(4)})</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 border-b pb-2">Indirect Effect</h4>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Estimate (a × b):</span>
                                    <span className="text-sm font-bold">{results.indirectEffect?.est?.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Sobel Test Z:</span>
                                    <span className="text-sm">{results.sobelZ?.toFixed(3)}</span>
                                </div>
                                <div className={`flex justify-between items-center p-2 rounded ${significant ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                    <span className="text-sm font-bold">Sobel p-value:</span>
                                    <span className="text-sm font-bold">{sobelP?.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Mediation Type:</span>
                                    <span className="text-sm uppercase font-bold text-blue-600">{results.mediationType}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800">
                    {significant
                        ? `Có hiệu ứng trung gian có ý nghĩa thống kê (Sobel p = ${sobelP?.toFixed(4)} < 0.05). Biến ${columns[1]} là trung gian ${results.mediationType === 'full' ? 'toàn phần' : 'một phần'} trong mối quan hệ giữa ${columns[0]} và ${columns[2]}.`
                        : `Không có hiệu ứng trung gian có ý nghĩa thống kê (Sobel p = ${sobelP?.toFixed(4)} >= 0.05).`}
                </p>
            </div>
        </div>
    );
});

export default MediationResults;
