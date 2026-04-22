import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Database, Activity, Info, BarChart } from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';
import { TemplateInterpretation } from '@/components/TemplateInterpretation';

interface TTestResultsProps {
    results: any;
    variableNames?: {
        groupVar?: string;
        targetVar?: string;
        group1?: string;
        group2?: string;
    };
}

/**
 * T-Test Results Component - Scientific Academic Style (White & Blue)
 */
export const TTestResults = React.memo(function TTestResults({ results, variableNames }: TTestResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    if (!results) return null;

    // Robust formatting helper
    const formatNum = (val: any, digits: number = 3) => {
        if (val === null || val === undefined) return 'N/A';
        const num = typeof val === 'number' ? val : parseFloat(String(val));
        return isNaN(num) ? 'N/A' : num.toFixed(digits);
    };

    const pValue = parseFloat(String(results.pValue)) || 0;
    const significant = pValue < 0.05;
    const lP = parseFloat(String(results.leveneP)) || 0.5;
    const leveneSig = lP < 0.05;

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-700">
            {/* Quick Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">t-Statistic</p>
                        <p className="text-2xl font-black text-blue-900">{formatNum(results.tStatistic, 3)}</p>
                    </div>
                </div>
                <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                        <Info className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">p-value</p>
                        <p className={`text-2xl font-black ${significant ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {pValue < 0.001 ? '< .001' : formatNum(pValue, 4)}
                        </p>
                    </div>
                </div>
                <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-lg">
                        <BarChart className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cohen&apos;s d</p>
                        <p className="text-2xl font-black text-indigo-900">{formatNum(results.effectSize, 3)}</p>
                    </div>
                </div>
            </div>

            {/* Main T-Test Table */}
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
                                <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Test Assumption</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">t-Value</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">df</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">p-value</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Mean Diff.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            <tr className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-5 px-6">
                                    <div className="text-sm font-bold text-blue-800">{leveneSig ? "Equal variances not assumed (Welch)" : "Equal variances assumed"}</div>
                                    <div className="text-[10px] text-slate-400 italic">{leveneSig ? "Giả định phương sai không bằng nhau" : "Giả định phương sai bằng nhau"}</div>
                                </td>
                                <td className="py-5 px-4 text-sm text-right font-mono">{formatNum(results.tStatistic, 3)}</td>
                                <td className="py-5 px-4 text-sm text-center font-bold">{formatNum(results.df, 2)}</td>
                                 <td className={`py-5 px-4 text-sm text-right font-black ${significant ? 'text-emerald-700 underline underline-offset-4' : 'text-slate-700'}`}>
                                    {formatNum(pValue, 4)} {significant ? ' *' : ''}
                                </td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-slate-800 font-black">{formatNum(results.meanDiff, 3)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Group Statistics Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                        <BarChart className="w-4 h-4 text-blue-600" />
                        Group Statistics (Thống kê Nhóm)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-slate-700">
                        <thead className="bg-blue-50/50 border-y border-blue-100">
                            <tr>
                                <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Group</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Mean</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Std. Deviation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            <tr className="hover:bg-blue-50/30">
                                <td className="py-4 px-6 text-sm font-bold text-slate-700">{variableNames?.group1 || 'Group 1'}</td>
                                <td className="py-4 px-4 text-sm text-right font-mono font-bold text-blue-900">{formatNum(results.mean1, 3)}</td>
                                <td className="py-4 px-4 text-sm text-right font-mono">{formatNum(results.sd1, 3)}</td>
                            </tr>
                            <tr className="hover:bg-blue-50/30">
                                <td className="py-4 px-6 text-sm font-bold text-slate-700">{variableNames?.group2 || 'Group 2'}</td>
                                <td className="py-4 px-4 text-sm text-right font-mono font-bold text-blue-900">{formatNum(results.mean2, 3)}</td>
                                <td className="py-4 px-4 text-sm text-right font-mono">{formatNum(results.sd2, 3)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Professional Interpretation */}
            <TemplateInterpretation 
                analysisType="ttest_independent"
                results={results}
                variableNames={variableNames}
            />

            {/* Assumptions & Levene's Test */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        Levene&apos;s Test for Equality of Variances
                    </h4>
                    <div className={`text-[10px] uppercase font-black px-3 py-1 rounded-lg border ${leveneSig ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-emerald-50 border-emerald-300 text-emerald-700'}`}>
                        {leveneSig ? 'Variances NOT Assume EQUAL' : 'Variances Assume EQUAL (OK)'}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-sm">
                        <span className="text-slate-600 font-bold mr-2">F-Value:</span>
                        <span className="text-blue-900 font-mono font-bold">{formatNum(results.leveneF, 3)}</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-slate-600 font-bold mr-2">Significance:</span>
                        <span className="text-blue-900 font-mono font-bold">{formatNum(lP, 4)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default TTestResults;

