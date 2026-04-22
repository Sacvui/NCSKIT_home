'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Scatter } from 'react-chartjs-2';
import { FileText, TrendingUp, Info } from 'lucide-react';
import { getStoredLocale, t, type Locale } from '../../../lib/i18n';

interface RegressionResultsProps {
    results: any;
    columns: string[];
}

const fmt = (val: any, digits = 3) => {
    if (val === undefined || val === null || isNaN(val)) return '-';
    return Number(val).toFixed(digits);
};

const fmtP = (p: number) => {
    if (p === undefined || p === null || isNaN(p)) return '-';
    if (p < 0.001) return '< .001';
    return p.toFixed(3);
};

/**
 * Linear Regression Results Component - Scientific Academic Style (White & Blue)
 */
export const RegressionResults = React.memo(function RegressionResults({ results, columns }: RegressionResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    const isVi = locale === 'vi';
    if (!results || !results.modelFit) return null;

    const { modelFit, coefficients, equation } = results;

    // Derived values for report
    const actualVals = results.chartData?.actual || [];
    const fittedVals = results.chartData?.fitted || [];
    const n = actualVals.length;
    
    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-500">
            {/* Equation Card */}
            <div className="bg-blue-900 p-8 rounded-xl text-white shadow-md border-t-4 border-blue-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp className="w-20 h-20" />
                </div>
                <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-4 opacity-80 flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    Regression Equation (Phương trình hồi quy)
                </h4>
                <div className="text-xl md:text-2xl font-mono font-black break-all leading-relaxed">
                    {equation}
                </div>
            </div>

            {/* Model Summary Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-blue-900 uppercase">Model Summary (Tóm tắt mô hình)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-slate-700">
                        <thead className="bg-blue-50/50 border-y border-blue-100">
                            <tr>
                                <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Model</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">R</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">R Square</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center bg-blue-100/30">Adjusted R²</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">Std. Error</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            <tr className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-5 px-6 text-sm font-bold text-blue-800">1</td>
                                <td className="py-5 px-4 text-sm text-center font-mono">{fmt(Math.sqrt(modelFit.rSquared))}</td>
                                <td className="py-5 px-4 text-sm text-center font-black decoration-blue-200 underline underline-offset-4">{fmt(modelFit.rSquared)}</td>
                                <td className="py-5 px-4 text-sm text-center font-black text-blue-900">{fmt(modelFit.adjRSquared)}</td>
                                <td className="py-5 px-4 text-sm text-center font-mono text-slate-400">{fmt(modelFit.residualStdError)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ANOVA Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-blue-900 uppercase">ANOVA Table</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-slate-700">
                        <thead className="bg-blue-50/50 border-y border-blue-100">
                            <tr>
                                <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Source</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Sum of Squares</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">df</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Mean Square</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right text-blue-600">F</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Sig.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            <tr className="hover:bg-blue-50/30 transition-colors font-bold text-blue-800 text-sm">
                                <td className="py-5 px-6">Regression</td>
                                <td className="py-5 px-4 text-right font-mono">—</td>
                                <td className="py-5 px-4 text-center font-black">{modelFit.df}</td>
                                <td className="py-5 px-4 text-right font-mono">—</td>
                                <td className="py-5 px-4 text-right font-black text-blue-900">{fmt(modelFit.fStatistic, 2)}</td>
                                <td className={`py-5 px-4 text-right font-black ${modelFit.pValue < 0.05 ? 'text-blue-600 underline underline-offset-4' : 'text-slate-400'}`}>
                                    {fmtP(modelFit.pValue)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Coefficients Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-blue-900 uppercase">Coefficients (Hệ số hồi quy)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-slate-700">
                        <thead className="bg-blue-50/50 border-y border-blue-100">
                            <tr>
                                <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase border-r border-blue-50">Model</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase text-center bg-slate-50/50" colSpan={2}>Unstandardized Coefficients</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase text-center bg-blue-100/20 border-l border-r border-blue-50">Standardized Beta</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">t</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-center">Sig.</th>
                                <th className="py-4 px-4 text-xs font-black text-blue-400 uppercase text-center border-l border-blue-50">VIF</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            {coefficients.map((coef: any, idx: number) => {
                                const isIntercept = coef.term === '(Intercept)';
                                const isSig = coef.pValue < 0.05;

                                return (
                                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="py-5 px-6 font-bold text-blue-800 border-r border-blue-50 italic">
                                            {isIntercept ? '(Constant)' : coef.term.replace(/`/g, '')}
                                        </td>
                                         <td className="py-5 px-4 text-sm text-center font-mono text-slate-800">{fmt(coef.estimate)}</td>
                                        <td className="py-5 px-4 text-sm text-center font-mono text-slate-700 border-r border-blue-50">{fmt(coef.stdError)}</td>
                                        <td className="py-5 px-4 text-sm text-center font-black text-blue-900 bg-blue-50/10 border-r border-blue-50">
                                            {isIntercept ? '' : fmt(coef.stdBeta)}
                                        </td>
                                        <td className="py-5 px-4 text-sm text-center font-mono text-slate-900">{fmt(coef.tValue)}</td>
                                        <td className={`py-5 px-4 text-sm text-center font-black ${isSig ? 'text-blue-900 underline underline-offset-4' : 'text-slate-400'}`}>
                                            {fmtP(coef.pValue)}
                                        </td>
                                        <td className={`py-5 px-4 text-sm text-center font-mono border-l border-blue-50 ${coef.vif >= 10 ? 'text-red-600 bg-red-50' : 'text-blue-900 font-extrabold'}`}>
                                            {isIntercept ? '' : (coef.vif ? fmt(coef.vif) : '-')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Professional Template Interpretation */}
            <TemplateInterpretation 
                analysisType="regression"
                results={results}
            />
        </div>
    );
});

export default RegressionResults;

