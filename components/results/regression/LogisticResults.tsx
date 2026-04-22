'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Database, Activity, Target } from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';
import { TemplateInterpretation } from '@/components/TemplateInterpretation';

interface LogisticResultsProps {
    results: any;
    columns: string[];
}

/**
 * Logistic Regression Results Component - Scientific Academic Style (White & Blue)
 */
export const LogisticResults = React.memo(function LogisticResults({ results, columns }: LogisticResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    if (!results) return null;

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-500">
            {/* Coefficients Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        Logistic Regression Coefficients (Hệ số hồi quy Logistic)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-slate-700">
                        <thead className="bg-blue-50/50 border-y border-blue-100">
                            <tr>
                                <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Variable (Biến)</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Estimate (B)</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right text-blue-600">Odds Ratio (Exp(B))</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right text-blue-900">z-value</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Sig. (p)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            {results.coefficients?.map((coeff: any, idx: number) => {
                                const sig = coeff.pValue < 0.05;
                                return (
                                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="py-5 px-6 text-sm font-bold text-blue-800 italic">{coeff.term}</td>
                                        <td className="py-5 px-4 text-sm text-right font-mono text-slate-500">{coeff.estimate?.toFixed(4)}</td>
                                        <td className="py-5 px-4 text-sm text-right font-black text-blue-900 bg-blue-50/20">{coeff.oddsRatio?.toFixed(4)}</td>
                                        <td className="py-5 px-4 text-sm text-right font-mono text-slate-500">{coeff.zValue?.toFixed(3)}</td>
                                        <td className={`py-5 px-4 text-sm text-right font-black ${sig ? 'text-blue-600 underline underline-offset-4' : 'text-slate-400'}`}>
                                            {coeff.pValue < 0.001 ? '<.001' : coeff.pValue?.toFixed(4)} {sig ? ' (Sig.)' : ''}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Model Fit & Confusion Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50/50 border border-blue-50 p-8 rounded-xl shadow-sm relative overflow-hidden">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-6 border-b border-blue-50 pb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        Model Accuracy & Fit summary
                    </h4>
                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-blue-50/50 pb-4">
                            <span className="text-sm font-bold text-slate-400">Classification Accuracy:</span>
                            <span className="font-black text-3xl text-blue-900">{(results.modelFit?.accuracy * 100)?.toFixed(2)}%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white rounded-lg border border-blue-50 shadow-sm text-center">
                                <span className="block text-[10px] font-black text-slate-400 uppercase">McFadden R²</span>
                                <span className="font-bold text-blue-900">{results.modelFit?.pseudoR2?.toFixed(4)}</span>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-blue-50 shadow-sm text-center">
                                <span className="block text-[10px] font-black text-slate-400 uppercase">AIC</span>
                                <span className="font-bold text-blue-900">{results.modelFit?.aic?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-blue-100 p-8 rounded-xl shadow-sm">
                    <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-6 border-b border-blue-50 pb-2">Confusion Matrix (Bảng nhầm lẫn)</h4>
                    {results.confusionMatrix && (
                        <div className="grid grid-cols-2 gap-2 text-center text-sm font-mono p-4 bg-slate-50/50 rounded-xl border border-dashed border-blue-100">
                            <div className="p-3 bg-white rounded border border-blue-50 flex flex-col justify-center">
                                <div className="text-[9px] uppercase text-slate-400 mb-1">True Negative</div>
                                <div className="font-black text-blue-900 text-xl">{results.confusionMatrix.tn}</div>
                            </div>
                            <div className="p-3 bg-white rounded border border-blue-100 flex flex-col justify-center">
                                <div className="text-[9px] uppercase text-slate-400 mb-1">False Positive</div>
                                <div className="font-black text-slate-300 text-xl">{results.confusionMatrix.fp}</div>
                            </div>
                            <div className="p-3 bg-white rounded border border-blue-100 flex flex-col justify-center">
                                <div className="text-[9px] uppercase text-slate-400 mb-1">False Negative</div>
                                <div className="font-black text-slate-300 text-xl">{results.confusionMatrix.fn}</div>
                            </div>
                            <div className="p-3 bg-white rounded border border-blue-50 flex flex-col justify-center">
                                <div className="text-[9px] uppercase text-slate-400 mb-1">True Positive</div>
                                <div className="font-black text-blue-900 text-xl">{results.confusionMatrix.tp}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Professional Template Interpretation */}
            <TemplateInterpretation 
                analysisType="logistic"
                results={results}
            />
        </div>
    );
});

export default LogisticResults;
