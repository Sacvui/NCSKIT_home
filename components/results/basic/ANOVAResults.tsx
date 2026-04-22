import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Database, FileText, BarChart, Info } from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';
import { TemplateInterpretation } from '@/components/TemplateInterpretation';

interface ANOVAResultsProps {
    results: any;
    columns?: string[];
    variableNames?: {
        factorVar?: string;
        targetVar?: string;
    };
}

/**
 * ANOVA Results Component - Scientific Academic Style (White & Blue)
 */
export const ANOVAResults = React.memo(function ANOVAResults({ results, columns, variableNames }: ANOVAResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    if (!results) return null;

    const pValue = results.pValue;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-700">
            {/* Header with quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">F-Statistic</p>
                        <p className="text-2xl font-black text-blue-900">{(results.F || results.fStatistic)?.toFixed(3)}</p>
                    </div>
                </div>
                <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                        <Info className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">p-value</p>
                        <p className={`text-2xl font-black ${significant ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {pValue < 0.001 ? '< .001' : pValue.toFixed(4)}
                        </p>
                    </div>
                </div>
                <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-lg">
                        <BarChart className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Eta Squared (η²)</p>
                        <p className="text-2xl font-black text-indigo-900">{(results.etaSquared || 0).toFixed(3)}</p>
                    </div>
                </div>
            </div>

            {/* ANOVA Summary Table */}
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
                                 <td className="py-5 px-4 text-sm text-right font-black text-blue-900">{(results.F || results.fStatistic)?.toFixed(3)}</td>
                                <td className={`py-5 px-4 text-sm text-right font-black ${significant ? 'text-emerald-700 underline underline-offset-4' : 'text-slate-700'}`}>
                                    {pValue < 0.001 ? '< .001' : pValue.toFixed(4)} {significant ? ' *' : ''}
                                </td>
                            </tr>
                             <tr className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-5 px-6 text-sm italic text-slate-800">Within Groups (Trong nội bộ nhóm)</td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-slate-900">{results.ssWithin?.toFixed(3)}</td>
                                <td className="py-5 px-4 text-sm text-center font-bold text-slate-900">{results.dfWithin}</td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-slate-900">{results.msWithin?.toFixed(3)}</td>
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

            {/* Group Means Table (Added as per user request) */}
            {results.groupMeans && results.groupMeans.length > 0 && (
                <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50">
                        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                            <BarChart className="w-4 h-4 text-blue-600" />
                            Group Means & Descriptives (Giá trị Trung bình theo Nhóm)
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-slate-700">
                            <thead className="bg-blue-50/50 border-y border-blue-100">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Group</th>
                                    <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Mean</th>
                                    <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50">
                                {results.groupMeans.map((mean: number, idx: number) => (
                                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="py-4 px-6 text-sm font-bold text-slate-700">Group {idx + 1}</td>
                                        <td className="py-4 px-4 text-sm text-right font-mono font-bold text-blue-900">{mean.toFixed(3)}</td>
                                        <td className="py-4 px-4 text-sm text-right">
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-blue-500 h-full" 
                                                    style={{ width: `${Math.min(100, (mean / (results.grandMean * 2)) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-blue-50/20 font-black border-t border-blue-100">
                                    <td className="py-4 px-6 text-sm text-blue-900 uppercase">Grand Mean (Tổng thể)</td>
                                    <td className="py-4 px-4 text-sm text-right font-mono text-blue-900">{results.grandMean?.toFixed(3)}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Professional Template Interpretation */}
            <TemplateInterpretation 
                analysisType="anova"
                results={results}
                variableNames={variableNames}
            />

            {/* Assumptions Check Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-xl border ${results.assumptionCheckP >= 0.05 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                    <h4 className={`text-xs font-black uppercase mb-3 ${results.assumptionCheckP >= 0.05 ? 'text-emerald-800' : 'text-amber-800'}`}>
                        Kiểm định tính đồng nhất phương sai
                    </h4>
                    <p className="text-sm font-medium text-slate-700">
                        {results.assumptionCheckP >= 0.05 
                            ? `Phương sai đồng nhất (p = ${results.assumptionCheckP.toFixed(4)}). Giả định của ANOVA được thỏa mãn.`
                            : `Phương sai KHÔNG đồng nhất (p = ${results.assumptionCheckP.toFixed(4)}). Đã hiệu chỉnh theo Welch ANOVA.`
                        }
                    </p>
                </div>
                <div className={`p-6 rounded-xl border ${results.normalityResidP >= 0.05 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                    <h4 className={`text-xs font-black uppercase mb-3 ${results.normalityResidP >= 0.05 ? 'text-emerald-800' : 'text-amber-800'}`}>
                        Kiểm định phân phối chuẩn phần dư
                    </h4>
                    <p className="text-sm font-medium text-slate-700">
                        {results.normalityResidP >= 0.05 
                            ? `Phần dư phân phối chuẩn (p = ${results.normalityResidP.toFixed(4)}).`
                            : `Phần dư vi phạm phân phối chuẩn (p = ${results.normalityResidP.toFixed(4)}).`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
});

export default ANOVAResults;

