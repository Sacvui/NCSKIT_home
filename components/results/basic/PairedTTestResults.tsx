'use client';

import React from 'react';
import { FileText, Link, Activity } from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

interface PairedTTestResultsProps {
    results: any;
    columns: string[];
}

/**
 * Paired Samples T-Test Results Component - Scientific Academic Style (White & Blue)
 */
export const PairedTTestResults = React.memo(function PairedTTestResults({ results, columns }: PairedTTestResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    if (!results) return null;

    const pValue = results.pValue;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-500">
            {/* White-Blue Academic Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                        <Link className="w-4 h-4 text-blue-600" />
                        Paired Samples T-Test (Kiểm định T-Test từng cặp)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-slate-700">
                        <thead className="bg-blue-50/50 border-y border-blue-100">
                            <tr>
                                <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Comparison Pair</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Mean</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">t</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">df</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Sig. (2-tailed)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            <tr className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-5 px-6">
                                    <div className="text-sm font-bold text-blue-800">{columns[0] || 'Base'} - {columns[1] || 'Target'}</div>
                                    <div className="text-[10px] text-slate-400 italic">So sánh cặp biến phụ thuộc</div>
                                </td>
                                <td className="py-5 px-4 text-sm text-right font-mono">{results.meanDiff?.toFixed(3)}</td>
                                <td className="py-5 px-4 text-sm text-center font-bold">{results.t?.toFixed(3)}</td>
                                <td className="py-5 px-4 text-sm text-center font-bold text-slate-500">{results.df?.toFixed(0)}</td>
                                <td className={`py-5 px-4 text-sm text-right font-black ${significant ? 'text-blue-600 underline underline-offset-4' : 'text-slate-400'}`}>
                                    {pValue?.toFixed(4)} {significant ? ' (Sig.)' : ''}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Statistics Detail Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50/50 border border-blue-50 p-6 rounded-xl">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Pair Statistics
                    </h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">{columns[0]}:</span>
                            <span className="font-bold text-blue-900">{results.meanBefore?.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">{columns[1]}:</span>
                            <span className="font-bold text-blue-900">{results.meanAfter?.toFixed(3)}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-blue-50/20 border border-blue-100 p-6 rounded-xl">
                    <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-3 flex items-center gap-2">
                        <FileText className="w-3 h-3" /> Effect Size
                    </h4>
                    <div className="flex items-end gap-2">
                        <div className="text-2xl font-black text-blue-900">{results.effectSize?.toFixed(3)}</div>
                        <div className="text-[10px] font-bold text-blue-400 pb-1 uppercase">Cohen&apos;s d</div>
                    </div>
                </div>
            </div>

            {/* Academic Interpretation Section */}
            <div className="bg-white border border-blue-100 p-8 rounded-xl shadow-sm relative overflow-hidden">
                <h4 className="text-xs font-black uppercase text-blue-600 tracking-widest mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Nhận định khoa học (Academic Interpretation)
                </h4>

                <div className="space-y-6 border-l-2 border-blue-50 pl-6">
                    <p className="text-sm text-slate-800 leading-relaxed font-medium bg-blue-50/40 p-5 rounded-lg border border-blue-50">
                        <span className="text-blue-900 font-black uppercase text-[10px] mr-2 tracking-tighter block mb-2 underline underline-offset-4">Kết luận phân tích:</span>
                        {significant
                            ? `Kết quả kiểm định Paired T-Test t(${results.df?.toFixed(0)}) = ${results.t?.toFixed(2)} cho thấy p = ${pValue?.toFixed(4)} < 0.05. Sự khác biệt giữa ${columns[0]} và ${columns[1]} có ý nghĩa thống kê. Trung bình thay đổi ${results.meanDiff > 0 ? 'giảm' : 'tăng'} ${Math.abs(results.meanDiff)?.toFixed(3)} đơn vị.`
                            : `Kết quả kiểm định Paired T-Test t(${results.df?.toFixed(0)}) = ${results.t?.toFixed(2)} cho thấy p = ${pValue?.toFixed(4)} >= 0.05. Không có sự thay đổi có ý nghĩa thống kê giữa hai lần đo đạc/biến này.`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
});

export default PairedTTestResults;
