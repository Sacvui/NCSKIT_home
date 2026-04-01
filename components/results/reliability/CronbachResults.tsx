'use client';

import React, { useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TemplateInterpretation } from '@/components/TemplateInterpretation';
import { TrendingUp } from 'lucide-react';

import { getStoredLocale, t, type Locale } from '@/lib/i18n';

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
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

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
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800/50 pb-4">
                    <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        {analysisType === 'omega' ? 'McDonald\'s Omega Reliability' : t(locale, 'tables.reliability')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                            <tr className="border-y-2 border-slate-300 dark:border-slate-700">
                                <th className="py-3 px-4 font-bold uppercase tracking-wider text-xs">Measure</th>
                                <th className="py-3 px-4 font-bold uppercase tracking-wider text-xs text-center border-l border-slate-200 dark:border-slate-700">Value (Giá trị)</th>
                                <th className="py-3 px-4 font-bold uppercase tracking-wider text-xs text-center border-l-2 border-slate-300 dark:border-slate-700">{t(locale, 'tables.n')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className={`py-4 px-4 font-bold ${analysisType !== 'omega' ? 'text-slate-900 dark:text-white text-lg' : 'text-slate-500 dark:text-slate-400'}`}>Cronbach&apos;s Alpha</td>
                                <td className={`py-4 px-4 text-center border-l border-slate-200 dark:border-slate-700 ${analysisType !== 'omega' ? 'font-black text-indigo-600 dark:text-indigo-400 text-2xl' : 'text-slate-600 dark:text-slate-400'}`}>{alpha.toFixed(3)}</td>
                                <td className="py-4 px-4 text-center row-span-3 align-middle border-l-2 border-slate-300 dark:border-slate-700 font-black text-slate-900 dark:text-white text-2xl bg-slate-50/30 dark:bg-slate-900/30">{nItems}</td>
                            </tr>
                            <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className={`py-4 px-4 font-bold ${analysisType === 'omega' ? 'text-slate-900 dark:text-white text-lg' : 'text-slate-500 dark:text-slate-400'}`}>McDonald&apos;s Omega (Total)</td>
                                <td className={`py-4 px-4 text-center border-l border-slate-200 dark:border-slate-700 ${analysisType === 'omega' ? 'font-black text-indigo-600 dark:text-indigo-400 text-2xl' : 'text-slate-600 dark:text-slate-400'}`}>{results.omega ? results.omega.toFixed(3) : '-'}</td>
                            </tr>
                            <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Omega Hierarchical</td>
                                <td className="py-3 px-4 text-center border-l border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">{results.omegaHierarchical ? results.omegaHierarchical.toFixed(3) : '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Item-Total Statistics Table */}
            {itemTotalStats.length > 0 && (
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800/50 pb-4">
                        <CardTitle className="text-slate-900 dark:text-slate-100">{t(locale, 'tables.itemTotal')}</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto pt-6">
                        <table className="w-full text-left text-sm whitespace-nowrap text-slate-700 dark:text-slate-300 border-collapse">
                            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                                <tr className="border-y-2 border-slate-300 dark:border-slate-700">
                                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-xs">{t(locale, 'tables.variable')}</th>
                                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-xs text-right">Scale Mean if Item Deleted <br/><span className="text-[10px] lowercase italic opacity-70">(Trung bình l.b)</span></th>
                                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-xs text-right">Scale Var if Item Deleted <br/><span className="text-[10px] lowercase italic opacity-70">(Phương sai l.b)</span></th>
                                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-xs text-right">Item-Total Correlation <br/><span className="text-[10px] lowercase italic opacity-70">(Tương quan biến tổng)</span></th>
                                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-xs text-right">Alpha if Item Deleted <br/><span className="text-[10px] lowercase italic opacity-70">(Alpha nếu loại biến)</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemTotalStats.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all group">
                                        <td className="py-4 px-4 font-black text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-900/50 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 transition-colors">
                                            {columns?.[idx] || item.itemName}
                                        </td>
                                        <td className="py-4 px-4 text-right text-slate-700 dark:text-slate-300 font-medium">{item.scaleMeanIfDeleted?.toFixed(3) || '-'}</td>
                                        <td className="py-4 px-4 text-right text-slate-700 dark:text-slate-300 font-medium">{item.scaleVarianceIfDeleted?.toFixed(3) || '-'}</td>
                                        <td className={`py-4 px-4 text-right font-black ${item.correctedItemTotalCorrelation < 0.3 ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30' : 'text-indigo-700 dark:text-indigo-400 border-l border-r border-slate-100 dark:border-slate-800'}`}>
                                            {item.correctedItemTotalCorrelation?.toFixed(3) || '-'}
                                        </td>
                                        <td className={`py-4 px-4 text-right font-black ${item.alphaIfItemDeleted > alpha ? 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30' : 'text-slate-900 dark:text-slate-100'}`}>
                                            {item.alphaIfItemDeleted?.toFixed(3) || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-xs text-slate-600 dark:text-slate-400 italic p-4 bg-slate-50 dark:bg-slate-800/50 mt-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
                            <p className="mb-2 flex items-center gap-2">
                                <span className="inline-block w-4 h-4 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-800 rounded shadow-sm"></span>
                                <span><strong>Corrected Item-Total Correlation &lt; 0.3</strong> (Nền đỏ/hồng) biểu thị tương quan biến-tổng yếu, cần xem xét loại bỏ biến này.</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="inline-block w-4 h-4 bg-orange-100 dark:bg-orange-900/40 border border-orange-300 dark:border-orange-800 rounded shadow-sm"></span>
                                <span><strong>Alpha if Item Deleted &gt; Alpha hiện tại</strong> (Nền cam) báo hiệu độ tin cậy của thang đo sẽ tăng lên nếu loại bỏ biến này.</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Workflow: Next Step Button */}
            {goodItems.length >= 4 && onProceedToEFA && (
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800/50 p-8 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl shadow-indigo-200 dark:shadow-none rotate-3">
                            📊
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-indigo-900 dark:text-indigo-100 mb-2 text-xl tracking-tight">Bước tiếp theo được đề xuất</h4>
                            <p className="text-base text-indigo-700 dark:text-indigo-300 mb-5 leading-relaxed">
                                Bạn có <span className="font-black underline underline-offset-4 decoration-indigo-400">{goodItems.length} items đạt chuẩn</span>. 
                                Tiếp tục với <strong>EFA (Exploratory Factor Analysis)</strong> để khám phá cấu trúc nhân tố?
                            </p>
                            <button
                                onClick={handleProceedToEFA}
                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black rounded-xl shadow-lg hover:shadow-indigo-300 dark:hover:shadow-none transition-all flex items-center gap-3 transform hover:-translate-y-1 active:scale-95"
                            >
                                <span>CHẠY EFA VỚI {goodItems.length} ITEMS TỐT</span>
                                <span className="text-2xl">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
});

export default CronbachResults;
