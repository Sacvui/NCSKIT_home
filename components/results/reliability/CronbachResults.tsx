'use client';

import React, { useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TemplateInterpretation } from '@/components/TemplateInterpretation';

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

    const handleProceedToEFA = useCallback(() => {
        if (onProceedToEFA) {
            onProceedToEFA(goodItems);
        }
    }, [onProceedToEFA, goodItems]);

    return (
        <div className="space-y-8 font-sans text-slate-900">
            {/* Reliability Statistics Table */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b bg-slate-50/50 pb-4">
                    <CardTitle className="text-slate-800">{analysisType === 'omega' ? 'McDonald\'s Omega Reliability' : 'Reliability Statistics'}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <table className="w-full text-left text-sm text-slate-700">
                        <thead className="bg-slate-50 text-slate-700">
                            <tr className="border-y-2 border-slate-300">
                                <th className="py-3 px-4 font-semibold">Measure</th>
                                <th className="py-3 px-4 font-semibold text-center">Value</th>
                                <th className="py-3 px-4 font-semibold text-center border-l-2 border-slate-300">N of Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                <td className={`py-3 px-4 font-bold ${analysisType !== 'omega' ? 'text-slate-900' : 'text-slate-500 font-medium'}`}>Cronbach&apos;s Alpha</td>
                                <td className={`py-3 px-4 text-center ${analysisType !== 'omega' ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{alpha.toFixed(3)}</td>
                                <td className="py-3 px-4 text-center row-span-3 align-middle border-l-2 border-slate-300 font-bold text-slate-800 text-base">{nItems}</td>
                            </tr>
                            <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                <td className={`py-3 px-4 font-bold ${analysisType === 'omega' ? 'text-slate-900' : 'text-slate-500 font-medium'}`}>McDonald&apos;s Omega (Total)</td>
                                <td className={`py-3 px-4 text-center ${analysisType === 'omega' ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{results.omega ? results.omega.toFixed(3) : '-'}</td>
                            </tr>
                            <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                <td className="py-3 px-4 font-medium text-slate-400 text-xs">Omega Hierarchical</td>
                                <td className="py-3 px-4 text-center text-slate-400 text-xs">{results.omegaHierarchical ? results.omegaHierarchical.toFixed(3) : '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Item-Total Statistics Table */}
            {itemTotalStats.length > 0 && (
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b bg-slate-50/50 pb-4">
                        <CardTitle className="text-slate-800">Item-Total Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto pt-6">
                        <table className="w-full text-left text-sm whitespace-nowrap text-slate-700">
                            <thead className="bg-slate-50 text-slate-700">
                                <tr className="border-y-2 border-slate-300">
                                    <th className="py-3 px-4 font-semibold">Variable</th>
                                    <th className="py-3 px-4 font-semibold text-right">Scale Mean if Item Deleted</th>
                                    <th className="py-3 px-4 font-semibold text-right">Scale Variance if Item Deleted</th>
                                    <th className="py-3 px-4 font-semibold text-right">Corrected Item-Total <br/>Correlation</th>
                                    <th className="py-3 px-4 font-semibold text-right">Cronbach&apos;s Alpha if <br/>Item Deleted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemTotalStats.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 font-bold text-slate-800">
                                            {columns?.[idx] || item.itemName}
                                        </td>
                                        <td className="py-3 px-4 text-right text-slate-600">{item.scaleMeanIfDeleted?.toFixed(3) || '-'}</td>
                                        <td className="py-3 px-4 text-right text-slate-600">{item.scaleVarianceIfDeleted?.toFixed(3) || '-'}</td>
                                        <td className={`py-3 px-4 text-right font-medium ${item.correctedItemTotalCorrelation < 0.3 ? 'text-red-600 bg-red-50' : 'text-slate-900 border-l border-r border-slate-100'}`}>
                                            {item.correctedItemTotalCorrelation?.toFixed(3) || '-'}
                                        </td>
                                        <td className={`py-3 px-4 text-right font-medium ${item.alphaIfItemDeleted > alpha ? 'text-orange-600 bg-orange-50' : 'text-slate-900'}`}>
                                            {item.alphaIfItemDeleted?.toFixed(3) || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-xs text-slate-500 italic p-4 bg-slate-50 mt-4 rounded-md border border-slate-200">
                            <p className="mb-1"><span className="inline-block w-3 h-3 bg-red-100 border border-red-300 mr-2 rounded"></span><strong>Corrected Item-Total Correlation &lt; 0.3</strong> (Nền đỏ) biểu thị tương quan biến-tổng yếu, cần xem xét loại bỏ biến này.</p>
                            <p><span className="inline-block w-3 h-3 bg-orange-100 border border-orange-300 mr-2 rounded"></span><strong>Alpha if Item Deleted &gt; Alpha hiện tại</strong> (Nền cam) báo hiệu độ tin cậy của thang đo sẽ tăng lên nếu loại bỏ biến này.</p>
                        </div>
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
                                onClick={handleProceedToEFA}
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
});

export default CronbachResults;
