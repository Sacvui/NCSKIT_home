'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Database, Activity } from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';
import { TemplateInterpretation } from '@/components/TemplateInterpretation';

interface TwoWayANOVAResultsProps {
    results: any;
    columns: string[];
}

/**
 * Two-Way ANOVA Results Component - Scientific Academic Style (White & Blue)
 */
export const TwoWayANOVAResults = React.memo(function TwoWayANOVAResults({ results, columns }: TwoWayANOVAResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    if (!results) return null;

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-500">
             {/* White-Blue Academic Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-600" />
                        Two-Way ANOVA Table (Bảng phương sai hai nhân tố)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-slate-700">
                        <thead className="bg-blue-50/50 border-y border-blue-100">
                            <tr>
                                <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Source (Nguồn tác động)</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">df</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Sum of Squares</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right text-blue-600">F-value</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Sig. (p)</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Partial η²</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            {/* Factor 1 */}
                            <tr className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-5 px-6 text-sm font-bold text-blue-800">{columns[1]}</td>
                                <td className="py-5 px-4 text-sm text-center font-bold">{results.factor1Df}</td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-slate-400">{results.factor1SS?.toFixed(3)}</td>
                                <td className="py-5 px-4 text-sm text-right font-black text-blue-900">{results.factor1F?.toFixed(3)}</td>
                                <td className={`py-5 px-4 text-sm text-right font-black ${results.factor1P < 0.05 ? 'text-blue-600 underline underline-offset-4' : 'text-slate-400'}`}>
                                    {results.factor1P?.toFixed(4)} {results.factor1P < 0.05 ? ' (Sig.)' : ''}
                                </td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-slate-500">{results.factor1Eta?.toFixed(3)}</td>
                            </tr>
                            {/* Factor 2 */}
                            <tr className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-5 px-6 text-sm font-bold text-blue-800">{columns[2]}</td>
                                <td className="py-5 px-4 text-sm text-center font-bold">{results.factor2Df}</td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-slate-400">{results.factor2SS?.toFixed(3)}</td>
                                <td className="py-5 px-4 text-sm text-right font-black text-blue-900">{results.factor2F?.toFixed(3)}</td>
                                <td className={`py-5 px-4 text-sm text-right font-black ${results.factor2P < 0.05 ? 'text-blue-600 underline underline-offset-4' : 'text-slate-400'}`}>
                                    {results.factor2P?.toFixed(4)} {results.factor2P < 0.05 ? ' (Sig.)' : ''}
                                </td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-slate-500">{results.factor2Eta?.toFixed(3)}</td>
                            </tr>
                            {/* Interaction */}
                            <tr className={`hover:bg-blue-50/30 transition-colors ${results.interactionP < 0.05 ? 'bg-amber-50/30' : ''}`}>
                                <td className="py-5 px-6 text-sm font-black text-blue-900 italic">Interaction (Tương tác)</td>
                                <td className="py-5 px-4 text-sm text-center font-bold">{results.interactionDf}</td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-slate-400">{results.interactionSS?.toFixed(3)}</td>
                                <td className="py-5 px-4 text-sm text-right font-black text-blue-900">{results.interactionF?.toFixed(3)}</td>
                                <td className={`py-5 px-4 text-sm text-right font-black ${results.interactionP < 0.05 ? 'text-blue-600 underline underline-offset-4' : 'text-slate-400'}`}>
                                    {results.interactionP?.toFixed(4)} {results.interactionP < 0.05 ? ' (Sig.)' : ''}
                                </td>
                                <td className="py-5 px-4 text-sm text-right font-mono text-slate-500">{results.interactionEta?.toFixed(3)}</td>
                            </tr>
                            {/* Residuals */}
                            <tr className="bg-slate-50 text-slate-400 italic">
                                <td className="py-5 px-6 text-sm">Residuals (Sai số)</td>
                                <td className="py-5 px-4 text-sm text-center">{results.residualDf}</td>
                                <td className="py-5 px-4 text-sm text-right font-mono">{results.residualSS?.toFixed(3)}</td>
                                <td colSpan={3}></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Professional Template Interpretation */}
            <TemplateInterpretation 
                analysisType="two_way_anova"
                results={results}
                variableNames={{
                    factor1: columns[1],
                    factor2: columns[2],
                    targetVar: columns[0]
                }}
            />
        </div>
    );
});

export default TwoWayANOVAResults;

