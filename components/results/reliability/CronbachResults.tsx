'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import TemplateInterpretation from '@/components/TemplateInterpretation';

interface CronbachResultsProps {
    results: any;
    columns?: string[];
    onProceedToEFA?: (goodItems: string[]) => void;
    scaleName?: string;
    analysisType?: string;
}

/**
 * Cronbach's Alpha Reliability Results Component
 * Displays reliability statistics and item-total correlations
 */
export const CronbachResults = React.memo(function CronbachResults({
    results,
    columns,
    onProceedToEFA,
    scaleName,
    analysisType
}: CronbachResultsProps) {
    const alpha = results.alpha || results.rawAlpha || 0;
    const nItems = results.nItems || 'N/A';
    const itemTotalStats = results.itemTotalStats || [];

    // Extract good items for workflow (memoized)
    const goodItems = useMemo(() =>
        itemTotalStats
            .filter((item: any) => item.correctedItemTotalCorrelation >= 0.3)
            .map((item: any, idx: number) => columns?.[idx] || item.itemName),
        [itemTotalStats, columns]
    );

    return (
        <div className="space-y-8 font-sans text-gray-900">
            {/* Reliability Statistics Table */}
            <Card>
                <CardHeader>
                    <CardTitle>{analysisType === 'omega' ? 'McDonald\'s Omega Reliability' : 'Reliability Statistics'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-2 pr-4 font-semibold text-gray-700">Measure</th>
                                <th className="py-2 pr-4 font-semibold text-gray-700">Value</th>
                                <th className="py-2 pr-4 font-semibold text-gray-700 pl-4 border-l border-gray-100">N of Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className={`py-2 pr-4 font-medium ${analysisType !== 'omega' ? 'text-black font-bold' : 'text-gray-600'}`}>Cronbach&apos;s Alpha</td>
                                <td className={`py-2 pr-4 ${analysisType !== 'omega' ? 'font-bold' : ''}`}>{alpha.toFixed(3)}</td>
                                <td className="py-2 pr-4 row-span-3 align-middle border-l border-gray-100 pl-4">{nItems}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className={`py-2 pr-4 font-medium ${analysisType === 'omega' ? 'text-black font-bold' : 'text-gray-600'}`}>McDonald&apos;s Omega (Total)</td>
                                <td className={`py-2 pr-4 ${analysisType === 'omega' ? 'font-bold' : ''}`}>{results.omega ? results.omega.toFixed(3) : '-'}</td>
                            </tr>
                            <tr>
                                <td className="py-2 pr-4 font-medium text-gray-400 text-xs">Omega Hierarchical</td>
                                <td className="py-2 pr-4 text-gray-400 text-xs">{results.omegaHierarchical ? results.omegaHierarchical.toFixed(3) : '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Item-Total Statistics Table */}
            {itemTotalStats.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Item-Total Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-3 px-4 font-semibold text-gray-700">Variable</th>
                                    <th className="py-3 px-4 font-semibold text-right text-gray-700">Scale Mean if Item Deleted</th>
                                    <th className="py-3 px-4 font-semibold text-right text-gray-700">Scale Variance if Item Deleted</th>
                                    <th className="py-3 px-4 font-semibold text-right text-gray-700">Corrected Item-Total Correlation</th>
                                    <th className="py-3 px-4 font-semibold text-right text-gray-700">Cronbach&apos;s Alpha if Item Deleted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemTotalStats.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-gray-900">
                                            {columns?.[idx] || item.itemName}
                                        </td>
                                        <td className="py-3 px-4 text-right text-gray-600">{item.scaleMeanIfDeleted?.toFixed(3) || '-'}</td>
                                        <td className="py-3 px-4 text-right text-gray-600">{item.scaleVarianceIfDeleted?.toFixed(3) || '-'}</td>
                                        <td className={`py-3 px-4 text-right ${item.correctedItemTotalCorrelation < 0.3 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                            {item.correctedItemTotalCorrelation?.toFixed(3) || '-'}
                                        </td>
                                        <td className={`py-3 px-4 text-right ${item.alphaIfItemDeleted > alpha ? 'text-orange-600 font-bold' : 'text-gray-600'}`}>
                                            {item.alphaIfItemDeleted?.toFixed(3) || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-xs text-gray-500 italic p-4 bg-gray-50 mt-4 rounded-md">
                            * Corrected Item-Total Correlation &lt; 0.3 được đánh dấu đỏ (cần xem xét loại bỏ).
                            Alpha if Item Deleted &gt; Alpha hiện tại được đánh dấu cam (loại bỏ có thể cải thiện độ tin cậy).
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Workflow: Next Step Button */}
            {goodItems.length >= 4 && onProceedToEFA && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 p-6 rounded-xl shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                            📊
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-blue-900 mb-2 text-lg">Bước tiếp theo được đề xuất</h4>
                            <p className="text-sm text-blue-700 mb-4">
                                Bạn có <strong>{goodItems.length} items đạt chuẩn</strong> (Corrected Item-Total Correlation ≥ 0.3).
                                Tiếp tục với <strong>EFA (Exploratory Factor Analysis)</strong> để khám phá cấu trúc nhân tố tiềm ẩn?
                            </p>
                            <button
                                onClick={() => onProceedToEFA(goodItems)}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <span>Chạy EFA với {goodItems.length} items tốt</span>
                                <span className="text-xl">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Template Interpretation */}
            <TemplateInterpretation
                analysisType={analysisType || 'cronbach'}
                results={results}
                scaleName={scaleName}
            />
        </div>
    );
});\r\n\r\nexport default CronbachResults;
