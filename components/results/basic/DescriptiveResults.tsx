'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Database, BarChart3 } from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

interface DescriptiveResultsProps {
    results: any;
    columns: string[];
}

const safeToFixed = (val: any, digits: number = 3) => {
    if (val === undefined || val === null || isNaN(Number(val))) return '-';
    return Number(val).toFixed(digits);
};

/**
 * Descriptive Results Component - Scientific Academic Style (White & Blue)
 */
export const DescriptiveResults = React.memo(function DescriptiveResults({ results, columns }: DescriptiveResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    if (!results || !results.mean) return null;

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-500">
            {/* White-Blue Academic Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        Descriptive Statistics (Thống kê Mô tả)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-slate-700">
                        <thead className="bg-blue-50/50 border-y border-blue-100">
                            <tr>
                                <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Variable (Biến)</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">N</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Min</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Max</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right bg-blue-100/30">Mean (TB)</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">SD (ĐLX)</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Skewness</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Kurtosis</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            {columns.map((col, idx) => (
                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="py-5 px-6 text-sm font-bold text-blue-800">{col}</td>
                                    <td className="py-5 px-4 text-sm text-center font-mono">{(results.N && results.N[idx] !== undefined) ? results.N[idx] : '-'}</td>
                                     <td className="py-5 px-4 text-sm text-right font-mono text-slate-800">{safeToFixed(results.min?.[idx])}</td>
                                    <td className="py-5 px-4 text-sm text-right font-mono text-slate-800">{safeToFixed(results.max?.[idx])}</td>
                                    <td className="py-5 px-4 text-sm text-right font-black text-blue-900 bg-blue-50/20">{safeToFixed(results.mean?.[idx])}</td>
                                    <td className="py-5 px-4 text-sm text-right font-mono text-slate-800">{safeToFixed(results.sd?.[idx])}</td>
                                    <td className="py-5 px-4 text-sm text-right font-mono italic text-blue-900/60 font-black">{safeToFixed(results.skew?.[idx])}</td>
                                    <td className="py-5 px-4 text-sm text-right font-mono italic text-blue-900/60 font-black">{safeToFixed(results.kurtosis?.[idx])}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Academic Interpretation Section */}
            <div className="bg-white border border-blue-100 p-8 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest italic border border-blue-100 px-2 py-1 rounded">Descriptives</span>
                </div>
                
                <h4 className="text-xs font-black uppercase text-blue-600 tracking-widest mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Nhận định khoa học (Academic Interpretation)
                </h4>

                <div className="space-y-6 border-l-2 border-blue-50 pl-6">
                    <div className="text-sm text-slate-800 leading-relaxed font-medium bg-blue-50/40 p-5 rounded-lg border border-blue-50">
                        <span className="text-blue-900 font-black uppercase text-[10px] mr-2 tracking-tighter block mb-3 underline underline-offset-4">Tóm tắt kết quả:</span>
                        <ul className="space-y-3 list-disc pl-5">
                            {columns.slice(0, 5).map((col, idx) => (
                                <li key={idx}>
                                    Biến <strong>{col}</strong> có giá trị trung bình là <strong>{safeToFixed(results.mean?.[idx])}</strong> với độ lệch chuẩn <strong>{safeToFixed(results.sd?.[idx])}</strong> (N = {results.N?.[idx]}).
                                </li>
                            ))}
                            {columns.length > 5 && <li>Và các biến khác tương tự...</li>}
                        </ul>
                    </div>
                    <p className="text-xs text-slate-500 italic mt-4 px-2">
                        * Skewness (Độ lệch) và Kurtosis (Độ nhọn) được sử dụng để kiểm tra tính chuẩn của phân phối dữ liệu (thường nằm trong khoảng ±2).
                    </p>
                </div>
            </div>
        </div>
    );
});

export default DescriptiveResults;
