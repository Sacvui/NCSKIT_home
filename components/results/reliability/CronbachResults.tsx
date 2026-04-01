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
                    <table className="w-full text-left text-sm text-slate-900 dark:text-slate-100 border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-slate-100">
                            <tr className="border-y-2 border-slate-300 dark:border-slate-700">
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px]">Measure (Chỉ số)</th>
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-right border-l border-slate-200 dark:border-slate-700">Value (Giá trị)</th>
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-center border-l-2 border-slate-300 dark:border-slate-700">{t(locale, 'tables.n')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors">
                                <td className={`py-4 px-6 font-black ${analysisType !== 'omega' ? 'text-indigo-900 dark:text-white text-base bg-indigo-50/10 dark:bg-indigo-950/20' : 'text-slate-500 dark:text-slate-500'}`}>
                                    Cronbach&apos;s Alpha
                                    {analysisType !== 'omega' && <span className="block text-[10px] uppercase tracking-tighter opacity-70">Primary reliability measure</span>}
                                </td>
                                <td className={`py-4 px-6 text-right border-l border-slate-200 dark:border-slate-700 ${analysisType !== 'omega' ? 'font-black text-indigo-700 dark:text-indigo-400 text-3xl' : 'text-slate-400 dark:text-slate-600'}`}>{alpha.toFixed(3)}</td>
                                <td className="py-4 px-6 text-center align-middle border-l-2 border-slate-300 dark:border-slate-700 font-black text-slate-900 dark:text-white text-3xl bg-slate-50/50 dark:bg-slate-900/50" rowSpan={3}>{nItems}</td>
                            </tr>
                            <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors">
                                <td className={`py-4 px-6 font-black ${analysisType === 'omega' ? 'text-indigo-900 dark:text-white text-base bg-indigo-50/10 dark:bg-indigo-950/20' : 'text-slate-500 dark:text-slate-500'}`}>
                                    McDonald&apos;s Omega (Total)
                                    {analysisType === 'omega' && <span className="block text-[10px] uppercase tracking-tighter opacity-70">Robust reliability measure</span>}
                                </td>
                                <td className={`py-4 px-6 text-right border-l border-slate-200 dark:border-slate-700 ${analysisType === 'omega' ? 'font-black text-indigo-700 dark:text-indigo-400 text-3xl' : 'text-slate-400 dark:text-slate-600'}`}>{results.omega ? results.omega.toFixed(3) : '-'}</td>
                            </tr>
                            <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors">
                                <td className="py-4 px-6 font-bold text-slate-500 dark:text-slate-600 text-[11px] uppercase tracking-wider">Omega Hierarchical</td>
                                <td className="py-4 px-6 text-right border-l border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 font-medium">{results.omegaHierarchical ? results.omegaHierarchical.toFixed(3) : '-'}</td>
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
                    <CardContent className="overflow-x-auto pt-6 px-0">
                        <table className="w-full text-left text-sm whitespace-nowrap text-slate-900 dark:text-slate-100 border-collapse">
                            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100">
                                <tr className="border-y-2 border-slate-300 dark:border-slate-700">
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px]">{t(locale, 'tables.variable')}</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-right border-l border-slate-200 dark:border-slate-700 whitespace-normal">Scale Mean<br/><span className="text-[9px] lowercase italic opacity-60">if Item Deleted</span></th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-right border-l border-slate-200 dark:border-slate-700 whitespace-normal">Scale Variance<br/><span className="text-[9px] lowercase italic opacity-60">if Item Deleted</span></th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-right border-l border-slate-200 dark:border-slate-700 whitespace-normal">Item-Total<br/><span className="text-[9px] lowercase opacity-60 font-black italic">Correlation</span></th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-right border-l border-slate-200 dark:border-slate-700 whitespace-normal">Cronbach&apos;s Alpha<br/><span className="text-[9px] lowercase italic opacity-60">if Item Deleted</span></th>
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
                        <div className="mx-6 flex flex-col gap-3 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl mt-8 border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <p className="flex items-center gap-3">
                                <span className="inline-block w-4 h-4 bg-red-100 dark:bg-rose-950/40 border border-red-300 dark:border-rose-800 rounded shadow-sm shrink-0"></span>
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-600 dark:text-slate-400 leading-relaxed">
                                    <strong>Item-Total Correlation &lt; 0.3</strong> (Nền hồng): Tương quan yếu, cần xem xét loại bỏ biến.
                                </span>
                            </p>
                            <p className="flex items-center gap-3">
                                <span className="inline-block w-4 h-4 bg-orange-100 dark:bg-amber-950/40 border border-orange-300 dark:border-amber-800 rounded shadow-sm shrink-0"></span>
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-600 dark:text-slate-400 leading-relaxed">
                                    <strong>Alpha if Item Deleted &gt; Alpha hiện tại</strong> (Nền cam): Loại bỏ biến này sẽ tăng độ tin cậy.
                                </span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Workflow: Next Step Button */}
            {goodItems.length >= 4 && onProceedToEFA && (
                <div className="bg-gradient-to-tr from-indigo-700 to-indigo-900 p-10 rounded-3xl shadow-2xl shadow-indigo-200 dark:shadow-none text-white relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-2xl"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <div className="flex-shrink-0 w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-white text-5xl shadow-2xl border border-white/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                             🚀
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-white/20">
                                Reliability Confirmed (Đã xác thực)
                            </div>
                            <h4 className="font-black mb-3 text-3xl tracking-tighter">THANG ĐO TIN CẬY - TIẾN TỚI EFA</h4>
                            <p className="text-white/80 text-base mb-8 leading-relaxed max-w-2xl font-medium">
                                Bạn có <strong className="text-white text-lg px-1 underline underline-offset-4 decoration-indigo-400">{goodItems.length} biến quan sát</strong> đạt chuẩn tương quan biến-tổng. 
                                Chúng ta đã sẵn sàng thực hiện <strong>EFA (Exploratory Factor Analysis)</strong> để khám phá cấu trúc nhân tố thực tế.
                            </p>
                            <button
                                onClick={handleProceedToEFA}
                                className="px-12 py-5 bg-white text-indigo-900 hover:bg-slate-50 font-black rounded-2xl shadow-2xl hover:shadow-white/20 transition-all flex items-center gap-4 transform hover:-translate-y-1 active:scale-95 group/btn"
                            >
                                <span className="uppercase tracking-widest text-sm">CHẠY PHÂN TÍCH EFA ({goodItems.length} ITEMS)</span>
                                <span className="text-2xl group-hover/btn:translate-x-2 transition-transform">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
});

export default CronbachResults;
