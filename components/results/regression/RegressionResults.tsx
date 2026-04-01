'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Scatter } from 'react-chartjs-2';

import { getStoredLocale, t, type Locale } from '@/lib/i18n';

interface RegressionResultsProps {
    results: any;
    columns: string[];
}

// Helper for safe number formatting
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
 * Linear Regression Results Component (SPSS Standard)
 * Displays: Equation → Model Summary → ANOVA → Coefficients → Assumption Checks → Chart
 */
export const RegressionResults = React.memo(function RegressionResults({ results, columns }: RegressionResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    const isVi = locale === 'vi';

    if (!results || !results.modelFit) return null;

    const { modelFit, coefficients, equation } = results;

    // Compute ANOVA values from available data
    const n = results.chartData?.actual?.length || 0;
    const k = (coefficients?.length || 1) - 1; // number of predictors (excluding intercept)
    const dfRegression = modelFit.df || k;
    const dfResidual = modelFit.dfResid || (n - k - 1);
    const dfTotal = dfRegression + dfResidual;

    // SS calculations from residuals and actual values
    const actualVals = results.chartData?.actual || [];
    const fittedVals = results.chartData?.fitted || [];
    const yMean = actualVals.length > 0 ? actualVals.reduce((s: number, v: number) => s + v, 0) / actualVals.length : 0;

    const ssRegression = fittedVals.reduce((s: number, f: number) => s + Math.pow(f - yMean, 2), 0);
    const ssResidual = actualVals.reduce((s: number, a: number, i: number) => s + Math.pow(a - (fittedVals[i] || 0), 2), 0);
    const ssTotal = ssRegression + ssResidual;

    const msRegression = dfRegression > 0 ? ssRegression / dfRegression : 0;
    const msResidual = dfResidual > 0 ? ssResidual / dfResidual : 0;

    return (
        <div className="space-y-8 font-sans text-slate-900">
            {/* Equation */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 rounded-xl text-white shadow-lg">
                <h4 className="font-bold text-sm uppercase tracking-wider mb-2 opacity-80">Phương trình hồi quy (Regression Equation)</h4>
                <div className="text-lg md:text-xl font-mono font-bold break-all">
                    {equation}
                </div>
            </div>

            {/* ─── 1. Model Summary (SPSS Style) ─── */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b bg-slate-50/50 pb-4">
                    <CardTitle className="text-slate-800">{t(locale, 'tables.summary')}</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto pt-6">
                    <table className="w-full text-sm text-slate-700">
                        <thead className="bg-slate-950 border-b-2 border-slate-700 text-slate-100">
                            <tr>
                                <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">{t(locale, 'tables.model')}</th>
                                <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">R</th>
                                <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">R Square<br/><span className="text-[10px] lowercase italic">(Hệ số xác định)</span></th>
                                <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Adjusted R Square<br/><span className="text-[10px] lowercase italic">(R2 hiệu chỉnh)</span></th>
                                <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Std. Error <br/><span className="text-[10px] lowercase italic">(Sai số tiêu chuẩn)</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            <tr className="hover:bg-slate-900/30 transition-colors">
                                <td className="py-4 px-4 text-center font-black text-slate-800 dark:text-slate-200">1</td>
                                <td className="py-4 px-4 text-center font-black text-slate-950 dark:text-white text-lg tracking-tighter">{fmt(Math.sqrt(modelFit.rSquared))}</td>
                                <td className="py-4 px-4 text-center font-black text-slate-950 dark:text-white text-lg tracking-tighter decoration-indigo-500/30 underline underline-offset-4">{fmt(modelFit.rSquared)}</td>
                                <td className="py-4 px-4 text-center font-black text-indigo-600 dark:text-indigo-400 text-lg tracking-tighter">{fmt(modelFit.adjRSquared)}</td>
                                <td className="py-4 px-4 text-center text-slate-500 font-mono text-xs">{fmt(modelFit.residualStdError)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="text-xs text-slate-500 italic mt-4">
                        a. Predictors: (Constant), {coefficients?.filter((c: any) => c.term !== '(Intercept)').map((c: any) => c.term.replace(/`/g, '')).join(', ')}
                    </p>
                </CardContent>
            </Card>

            {/* ─── 2. ANOVA Table (SPSS Style) ─── */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b bg-slate-50/50 pb-4">
                    <CardTitle className="text-slate-800">{t(locale, 'tables.anova')}<sup>a</sup></CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto pt-6">
                    <table className="w-full text-sm text-slate-700">
                        <thead className="bg-slate-950 border-b-2 border-slate-700 text-slate-100">
                            <tr>
                                <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">{t(locale, 'tables.model')}</th>
                                <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-left">{t(locale, 'tables.source')}</th>
                                <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Sum of Squares<br/><span className="text-[10px] lowercase italic">(Tổng bình phương)</span></th>
                                <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">df<br/><span className="text-[10px] lowercase italic">(Bậc tự do)</span></th>
                                <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Mean Square<br/><span className="text-[10px] lowercase italic">(Bình phương TB)</span></th>
                                <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-indigo-400 text-right">F</th>
                                <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Sig.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            <tr className="hover:bg-slate-900/30 transition-colors">
                                <td rowSpan={3} className="py-5 px-4 text-center font-black text-slate-950 dark:text-white align-top border-r border-slate-800/50">1</td>
                                <td className="py-4 px-4 font-black text-slate-500 uppercase tracking-tighter">Regression</td>
                                <td className="py-4 px-4 text-right text-slate-500 font-mono text-xs">{fmt(ssRegression)}</td>
                                <td className="py-4 px-4 text-right text-slate-500 font-bold">{dfRegression}</td>
                                <td className="py-4 px-4 text-right text-slate-500 font-mono text-xs">{fmt(msRegression)}</td>
                                <td className="py-4 px-4 text-right font-black text-indigo-600 dark:text-indigo-400 text-lg">{fmt(modelFit.fStatistic, 2)}</td>
                                <td className={`py-4 px-4 text-right font-black text-lg ${modelFit.pValue < 0.05 ? 'text-emerald-500 group-hover:scale-110 origin-right transition-transform' : 'text-slate-400'}`}>
                                    {fmtP(modelFit.pValue)}
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-900/30 transition-colors">
                                <td className="py-4 px-4 font-black text-slate-500 uppercase tracking-tighter italic">Residual</td>
                                <td className="py-4 px-4 text-right text-slate-500 font-mono text-xs">{fmt(ssResidual)}</td>
                                <td className="py-4 px-4 text-right text-slate-500 font-bold">{dfResidual}</td>
                                <td className="py-4 px-4 text-right text-slate-500 font-mono text-xs">{fmt(msResidual)}</td>
                                <td className="py-4 px-4"></td>
                                <td className="py-4 px-4"></td>
                            </tr>
                            <tr className="bg-slate-900/10 hover:bg-slate-900/30 transition-colors font-black">
                                <td className="py-4 px-4 font-black text-slate-950 dark:text-white uppercase tracking-tighter">Total</td>
                                <td className="py-4 px-4 text-right text-slate-950 dark:text-white font-mono text-xs">{fmt(ssTotal)}</td>
                                <td className="py-4 px-4 text-right text-slate-950 dark:text-white font-black">{dfTotal}</td>
                                <td className="py-4 px-4"></td>
                                <td className="py-4 px-4"></td>
                                <td className="py-4 px-4"></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="text-xs text-slate-500 italic mt-4 space-y-1">
                        <p>a. Dependent Variable: {coefficients?.[0] ? columns?.[0] || 'Y' : 'Y'}</p>
                        <p>b. Predictors: (Constant), {coefficients?.filter((c: any) => c.term !== '(Intercept)').map((c: any) => c.term.replace(/`/g, '')).join(', ')}</p>
                    </div>
                </CardContent>
            </Card>

            {/* ─── 3. Coefficients Table (SPSS Style) ─── */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b bg-slate-50/50 pb-4">
                    <CardTitle className="text-slate-800">Coefficients<sup>a</sup></CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto pt-6">
                    <table className="w-full text-sm whitespace-nowrap text-slate-700">
                        <thead className="bg-slate-950 border-b-2 border-slate-700 text-slate-100">
                            <tr>
                                <th rowSpan={2} className="py-4 px-6 text-left text-[11px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-800">{t(locale, 'tables.model')}</th>
                                <th colSpan={2} className="py-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-center border-b border-slate-800 bg-slate-900/40">{isVi ? 'Hệ số chưa chuẩn hóa' : 'Unstandardized Coefficients'}</th>
                                <th rowSpan={2} className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-center border-l border-r border-slate-800 text-indigo-400">{isVi ? 'Hệ số chuẩn Beta' : 'Std. Beta'}</th>
                                <th rowSpan={2} className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">t</th>
                                <th rowSpan={2} className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Sig.</th>
                                <th colSpan={2} className="py-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-center border-l border-slate-800 border-b border-slate-800 bg-slate-900/40">Collinearity Stat.</th>
                            </tr>
                            <tr className="border-b-2 border-slate-800">
                                <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">B</th>
                                <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center border-r border-slate-800">Std. Error</th>
                                <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center border-l border-slate-800">Tolerance</th>
                                <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">VIF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coefficients.map((coef: any, idx: number) => {
                                const isIntercept = coef.term === '(Intercept)';
                                const tolerance = coef.vif ? (1 / coef.vif) : undefined;
                                const isSig = coef.pValue < 0.05;

                                return (
                                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">
                                            {isIntercept ? '(Constant)' : coef.term.replace(/`/g, '')}
                                        </td>
                                        <td className="py-3 px-4 text-center font-medium text-slate-900">{fmt(coef.estimate)}</td>
                                        <td className="py-3 px-4 text-center text-slate-600 border-r border-slate-200">{fmt(coef.stdError)}</td>
                                        <td className="py-3 px-4 text-center font-medium text-slate-700 border-r border-slate-200">
                                            {isIntercept ? '' : fmt(coef.stdBeta)}
                                        </td>
                                        <td className="py-3 px-4 text-center text-slate-600">{fmt(coef.tValue)}</td>
                                        <td className={`py-3 px-4 text-center font-bold ${isSig ? 'text-green-700' : 'text-slate-400'}`}>
                                            {fmtP(coef.pValue)}
                                        </td>
                                        <td className="py-3 px-4 text-center text-slate-600 border-l border-slate-200">
                                            {isIntercept ? '' : (tolerance !== undefined ? fmt(tolerance) : '-')}
                                        </td>
                                        <td className={`py-3 px-4 text-center font-medium ${coef.vif && coef.vif >= 10 ? 'text-red-600 bg-red-50' : coef.vif && coef.vif >= 5 ? 'text-amber-600 bg-amber-50' : 'text-slate-700'}`}>
                                            {isIntercept ? '' : (coef.vif ? fmt(coef.vif) : '-')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <p className="text-xs text-slate-500 italic mt-4">
                        a. Dependent Variable: {columns?.[0] || 'Y'}
                    </p>
                </CardContent>
            </Card>

            {/* ─── 4. Assumption Checks ─── */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b bg-slate-50/50 pb-4">
                    <CardTitle className="text-slate-800">{isVi ? 'Kiểm tra các giả định' : 'Assumption Checks'} <span className="text-slate-400 font-normal text-sm">({isVi ? 'Assumption Checks' : ''})</span></CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Normality */}
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h5 className="font-bold text-sm text-slate-700 mb-2">1. Normality of Residuals</h5>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-slate-600">Shapiro-Wilk Test:</span>
                                <span className={`font-bold ${modelFit.normalityP >= 0.05 ? 'text-green-700' : 'text-amber-600'}`}>
                                    p = {modelFit.normalityP?.toFixed(4)}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 italic">
                                {modelFit.normalityP >= 0.05
                                    ? '✓ Residuals are normally distributed (p ≥ .05).'
                                    : '⚠ Residuals may not be normally distributed. Consider larger sample size.'}
                            </p>
                        </div>

                        {/* 2. Multicollinearity */}
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h5 className="font-bold text-sm text-slate-700 mb-2">2. Multicollinearity (VIF)</h5>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-slate-600">Max VIF:</span>
                                <span className={`font-bold ${Math.max(...coefficients.map((c: any) => c.vif || 0)) < 10 ? 'text-green-700' : 'text-red-600'}`}>
                                    {Math.max(...coefficients.map((c: any) => c.vif || 0)).toFixed(2)}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 italic">
                                {Math.max(...coefficients.map((c: any) => c.vif || 0)) < 10
                                    ? '✓ No serious multicollinearity detected (VIF < 10).'
                                    : '⚠ Warning: Multicollinearity detected (VIF ≥ 10).'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ─── 5. Conclusion ─── */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                <h4 className="font-bold mb-3 text-slate-800 uppercase text-xs tracking-wider">
                    {isVi ? 'Diễn giải kết quả mẫu (Interpretation)' : 'Sample Interpretation'}
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                    <li>
                        The regression model is <strong>{modelFit.pValue < 0.05 ? 'statistically significant' : 'not statistically significant'}</strong> (F({dfRegression}, {dfResidual}) = {modelFit.fStatistic.toFixed(2)}, p {modelFit.pValue < 0.001 ? '< .001' : `= ${modelFit.pValue.toFixed(3)}`}).
                    </li>
                    <li>
                        The model explains <strong>{(modelFit.adjRSquared * 100).toFixed(1)}%</strong> of the variance in the dependent variable (Adjusted R² = {fmt(modelFit.adjRSquared)}).
                    </li>
                    <li>
                        Significant predictors (p &lt; .05):{' '}
                        {coefficients.filter((c: any) => c.term !== '(Intercept)' && c.pValue < 0.05).length > 0
                            ? coefficients
                                .filter((c: any) => c.term !== '(Intercept)' && c.pValue < 0.05)
                                .map((c: any) => `${c.term.replace(/`/g, '')} (β = ${fmt(c.stdBeta)})`)
                                .join(', ')
                            : 'None.'}
                    </li>
                </ul>
            </div>

            {/* ─── 6. Charts: Actual vs Predicted ─── */}
            {results.chartData && (
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b bg-slate-50/50 pb-4">
                        <CardTitle className="text-slate-800">{isVi ? 'Biểu đồ Thực tế vs Dự báo' : 'Actual vs. Predicted Values'}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-80 w-full">
                            <Scatter
                                data={{
                                    datasets: [
                                        {
                                            label: 'Observations',
                                            data: results.chartData.actual.map((val: number, i: number) => ({
                                                x: results.chartData.fitted[i],
                                                y: val
                                            })),
                                            backgroundColor: 'rgba(79, 70, 229, 0.5)',
                                            borderColor: 'rgba(79, 70, 229, 1)',
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: {
                                            title: { display: true, text: 'Predicted Value' }
                                        },
                                        y: {
                                            title: { display: true, text: 'Actual Value' }
                                        }
                                    },
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => {
                                                    const point = context.raw as { x: number, y: number };
                                                    return `Predicted: ${point.x.toFixed(2)}, Actual: ${point.y.toFixed(2)}`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
});

export default RegressionResults;
