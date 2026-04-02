'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Database, Activity } from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

interface TTestResultsProps {
    results: any;
}

/**
 * T-Test Results Component - Scientific Academic Style (White & Blue)
 */
export const TTestResults = React.memo(function TTestResults({ results }: TTestResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    if (!results) return null;

    const pValue = results.pValue;
    const significant = pValue < 0.05;
    const leveneSig = results.leveneP < 0.05;

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-500">
            {/* White-Blue Academic Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        Independent Samples Test (Kiểm định T-Test độc lập)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-slate-700">
                        <thead className="bg-blue-50/50 border-y border-blue-100">
                            <tr>
                                <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Test Variation</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">t-Value</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">df</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">p-value (2-tailed)</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Mean Difference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            <tr className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-5 px-6">
                                    <div className="text-sm font-bold text-blue-800">Equal variances assumed</div>
                                    <div className="text-[10px] text-slate-400 italic">Giả định phương sai bằng nhau</div>
                                </td>
                                <td className="py-5 px-4 text-sm text-right font-mono">{results.tStatistic?.toFixed(3)}</td>
                                <td className="py-5 px-4 text-sm text-center font-bold">{results.df?.toFixed(2)}</td>
                                 <td className={`py-5 px-4 text-sm text-right font-black ${significant ? 'text-blue-950 underline underline-offset-4 ring-1 ring-blue-100 rounded-lg px-2' : 'text-slate-700'}`}>
                                    {pValue?.toFixed(4)} {significant ? ' (Sig.)' : ''}
                                </td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-slate-800 font-black">{results.meanDiff?.toFixed(3)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Levene's Test Card */}
            <div className="bg-slate-50/50 border border-slate-200 p-6 rounded-xl shadow-sm">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">
                    Levene&apos;s Test for Equality of Variances
                </h4>
                <div className="flex items-center gap-6 flex-wrap">
                    <div className="text-sm">
                        <span className="text-slate-600 font-black mr-2">F:</span>
                        <span className="text-blue-900 font-black">{results.leveneF?.toFixed(3)}</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-slate-600 font-black mr-2">Sig:</span>
                        <span className={`font-black ${leveneSig ? 'text-blue-900' : 'text-slate-900'}`}>
                            {results.leveneP?.toFixed(4)}
                        </span>
                    </div>
                    <div className={`text-[10px] uppercase font-black px-3 py-1 rounded-lg border ${leveneSig ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' : 'bg-blue-900 border-blue-900 text-white shadow-lg shadow-blue-100 animate-in fade-in zoom-in-95'}`}>
                        {leveneSig ? 'Variances NOT Assume EQUAL' : 'Variances Assume EQUAL (OK)'}
                    </div>
                </div>
            </div>

            {/* Academic Interpretation Section */}
            <div className="bg-white border border-blue-100 p-8 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest italic border border-blue-100 px-2 py-1 rounded">Independent Samples</span>
                </div>
                
                <h4 className="text-xs font-black uppercase text-blue-600 tracking-widest mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Nhận định khoa học (Academic Interpretation)
                </h4>

                <div className="space-y-6 border-l-2 border-blue-50 pl-6">
                    <p className="text-sm text-slate-800 leading-relaxed font-medium bg-blue-50/40 p-5 rounded-lg border border-blue-50">
                        <span className="text-blue-900 font-black uppercase text-[10px] mr-2 tracking-tighter block mb-2 underline underline-offset-4">Kết luận phân tích:</span>
                        {significant
                            ? `Kết quả kiểm định T-Test t(${results.df?.toFixed(1)}) = ${results.tStatistic?.toFixed(2)} cho thấy p = ${pValue?.toFixed(4)} < 0.05. Do đó, ta bác bỏ giả thuyết H₀. Có sự khác biệt có ý nghĩa thống kê giữa hai nhóm được so sánh.`
                            : `Kết quả kiểm định T-Test t(${results.df?.toFixed(1)}) = ${results.tStatistic?.toFixed(2)} cho thấy p = ${pValue?.toFixed(4)} >= 0.05. Chưa có đủ bằng chứng thống kê để bác bỏ giả thuyết H₀. Sự khác biệt giữa hai nhóm không có ý nghĩa thống kê.`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
});

export default TTestResults;
