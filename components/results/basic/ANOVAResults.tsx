'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Database, FileText } from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

interface ANOVAResultsProps {
    results: any;
}

/**
 * ANOVA Results Component - Scientific Academic Style (White & Blue)
 */
export const ANOVAResults = React.memo(function ANOVAResults({ results }: ANOVAResultsProps) {
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
                        <Database className="w-4 h-4 text-blue-600" />
                        ANOVA Summary Table (Bảng Kết quả Phương sai)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-slate-700">
                        <thead className="bg-blue-50/50 border-y border-blue-100">
                            <tr>
                                <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Source of Variation</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">SS (Sum of Squares)</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">df</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">MS (Mean Square)</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">F-Value</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">p-value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            <tr className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-5 px-6 text-sm font-bold text-blue-800">Between Groups (Giữa các nhóm)</td>
                                <td className="py-5 px-4 text-sm text-right font-mono">{results.ssBetween?.toFixed(3)}</td>
                                <td className="py-5 px-4 text-sm text-center font-bold">{results.dfBetween}</td>
                                <td className="py-5 px-4 text-sm text-right font-mono">{results.msBetween?.toFixed(3)}</td>
                                <td className="py-5 px-4 text-sm text-right font-black text-blue-950">{results.fStatistic?.toFixed(3)}</td>
                                <td className={`py-5 px-4 text-sm text-right font-black ${significant ? 'text-blue-600 underline underline-offset-4' : 'text-slate-400'}`}>
                                    {pValue?.toFixed(4)} {significant ? ' (Sig.)' : ''}
                                </td>
                            </tr>
                            <tr className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-5 px-6 text-sm italic text-slate-500">Within Groups (Trong nội bộ nhóm)</td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-slate-500">{results.ssWithin?.toFixed(3)}</td>
                                <td className="py-5 px-4 text-sm text-center font-bold text-slate-500">{results.dfWithin}</td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-slate-500">{results.msWithin?.toFixed(3)}</td>
                                <td className="py-5 px-4" colSpan={2}></td>
                            </tr>
                            <tr className="bg-slate-50/80 font-bold border-t border-blue-100">
                                <td className="py-5 px-6 text-sm text-blue-900">Total (Tổng cộng)</td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-blue-900">{(results.ssBetween + results.ssWithin)?.toFixed(3)}</td>
                                <td className="py-5 px-4 text-sm text-center text-blue-900">{(results.dfBetween + results.dfWithin)}</td>
                                <td colSpan={3}></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Academic Interpretation Section */}
            <div className="bg-white border border-blue-100 p-8 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest italic border border-blue-100 px-2 py-1 rounded">Analysis Report</span>
                </div>
                
                <h4 className="text-xs font-black uppercase text-blue-600 tracking-widest mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Nhận định khoa học (Academic Interpretation)
                </h4>

                <div className="space-y-6 border-l-2 border-blue-50 pl-6">
                    <p className="text-sm text-slate-700 leading-relaxed italic">
                        <span className="text-blue-900 font-black uppercase text-[10px] not-italic mr-2 tracking-tighter">Null Hypothesis:</span>
                        Giả thuyết H₀ cho rằng không có sự khác biệt giữa các trị trung bình của các nhóm được so sánh.
                    </p>

                    <p className="text-sm text-slate-800 leading-relaxed font-medium bg-blue-50/40 p-5 rounded-lg border border-blue-50">
                        <span className="text-blue-900 font-black uppercase text-[10px] mr-2 tracking-tighter block mb-2 underline underline-offset-4">Kết luận phân tích:</span>
                        {significant
                            ? `Kết quả kiểm định F(${results.dfBetween}, ${results.dfWithin}) = ${results.fStatistic?.toFixed(2)} cho thấy p = ${pValue?.toFixed(4)} < 0.05. Do đó, ta bác bỏ giả thuyết H₀. Có sự khác biệt có ý nghĩa thống kê giữa ít nhất hai nhóm được so sánh.`
                            : `Kết quả kiểm định F(${results.dfBetween}, ${results.dfWithin}) = ${results.fStatistic?.toFixed(2)} cho thấy p = ${pValue?.toFixed(4)} >= 0.05. Chưa có đủ bằng chứng thống kê để bác bỏ giả thuyết H₀. Sự khác biệt giữa các trị trung bình của nhóm không có ý nghĩa thống kê.`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
});

export default ANOVAResults;
