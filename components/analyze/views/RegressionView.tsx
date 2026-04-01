import React, { useState } from 'react';
import { AnalysisStep } from '@/types/analysis';
import { Locale, t } from '@/lib/i18n';
import { getAnalysisCost, checkBalance, deductCredits } from '@/lib/ncs-credits';
import { logAnalysisUsage } from '@/lib/activity-logger';
import { runLinearRegression, runLogisticRegression } from '@/lib/webr-wrapper';

interface RegressionViewProps {
    step: AnalysisStep;
    data: any[];
    columns: string[];
    user: any;
    setResults: (results: any) => void;
    setStep: (step: AnalysisStep) => void;
    setNcsBalance: React.Dispatch<React.SetStateAction<number>>;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;

    // Credit UI setters passed from parent to handle "Insufficient Credits" modal
    setRequiredCredits: (amount: number) => void;
    setCurrentAnalysisCost: (amount: number) => void;
    setShowInsufficientCredits: (show: boolean) => void;

    // Optional setter to update analysis type in parent
    setAnalysisType?: (type: string) => void;
    locale: Locale;
}

export const RegressionView: React.FC<RegressionViewProps> = ({
    step,
    data,
    columns,
    user,
    setResults,
    setStep,
    setNcsBalance,
    showToast,
    setRequiredCredits,
    setCurrentAnalysisCost,
    setShowInsufficientCredits,
    setAnalysisType,
    locale
}) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Internal State
    const [regressionVars, setRegressionVars] = useState<{ y: string; xs: string[] }>({ y: '', xs: [] });
    const [logisticVars, setLogisticVars] = useState<{ y: string; xs: string[] }>({ y: '', xs: [] });

    if (step === 'regression-select') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Hồi quy Tuyến tính Đa biến
                    </h2>
                    <p className="text-gray-600">
                        Chọn 1 biến phụ thuộc (Y) và các biến độc lập (X)
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-pink-100 dark:border-pink-900/30">
                    <div className="space-y-8">
                        {/* Dependent Variable (Y) */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                                Biến phụ thuộc (Y) - Chọn 1
                            </label>
                            <select
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-pink-500 transition-all cursor-pointer"
                                value={regressionVars.y}
                                onChange={(e) => setRegressionVars({ ...regressionVars, y: e.target.value })}
                            >
                                <option value="" className="text-slate-400">Chọn biến...</option>
                                {columns.map(col => (
                                    <option key={col} value={col} disabled={regressionVars.xs.includes(col)}>
                                        {col}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Independent Variables (Xs) */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                                Biến độc lập (X) - Chọn nhiều
                            </label>
                            <div className="space-y-1.5 mb-2 max-h-56 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950/30 shadow-inner">
                                {columns.map(col => (
                                    <label key={col} className={`flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors group cursor-pointer ${regressionVars.y === col ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                                        <input
                                            type="checkbox"
                                            value={col}
                                            disabled={regressionVars.y === col}
                                            checked={regressionVars.xs.includes(col)}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setRegressionVars(prev => ({
                                                    ...prev,
                                                    xs: isChecked
                                                        ? [...prev.xs, col]
                                                        : prev.xs.filter(x => x !== col)
                                                }));
                                            }}
                                            className="w-4 h-4 text-pink-600 rounded border-slate-300 dark:border-slate-700 focus:ring-pink-500"
                                        />
                                        <span className={`text-sm font-bold ${regressionVars.y === col ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200 group-hover:text-pink-600 dark:group-hover:text-pink-400'}`}>{col}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={async () => {
                            if (!regressionVars.y) { showToast('Vui lòng chọn biến phụ thuộc (Y)', 'error'); return; }
                            if (regressionVars.xs.length === 0) { showToast('Vui lòng chọn ít nhất 1 biến độc lập (X)', 'error'); return; }

                            setIsAnalyzing(true);
                            // NCS Credit Check
                            if (user) {
                                const cost = await getAnalysisCost('regression');
                                const hasEnough = await checkBalance(user.id, cost);
                                if (!hasEnough) {
                                    setRequiredCredits(cost);
                                    setCurrentAnalysisCost(cost);
                                    setShowInsufficientCredits(true);
                                    setIsAnalyzing(false);
                                    return;
                                }
                            }

                            try {
                                const cols = [regressionVars.y, ...regressionVars.xs];
                                const regData = data.map(row =>
                                    cols.map(c => Number(row[c]) || 0)
                                );

                                const result = await runLinearRegression(regData, cols);
                                // Deduct credits on success
                                if (user) {
                                    const cost = await getAnalysisCost('regression');
                                    await deductCredits(user.id, cost, `Regression: Y=${regressionVars.y}`);
                                    await logAnalysisUsage(user.id, 'regression', cost);
                                    setNcsBalance(prev => Math.max(0, prev - cost));
                                }

                                setResults({ type: 'regression', data: result, columns: cols });
                                setStep('results');
                                showToast(locale === 'vi' ? 'Phân tích hoàn thành!' : 'Analysis completed!', 'success');
                            } catch (err: any) { showToast(t(locale, 'common.error') + ': ' + err.message || err, 'error'); }
                            finally { setIsAnalyzing(false); }
                        }}
                        disabled={isAnalyzing}
                        className="mt-6 w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg"
                    >
                        {isAnalyzing ? (locale === 'vi' ? 'Đang phân tích...' : 'Analyzing...') : (locale === 'vi' ? 'Chạy Hồi quy' : 'Run Regression')}
                    </button>
                </div>

                <button
                    onClick={() => setStep('analyze')}
                    className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg"
                >
                    ← {locale === 'vi' ? 'Quay lại chọn phép tính' : 'Back to method selection'}
                </button>
            </div>
        );
    }

    if (step === 'logistic-select') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {t(locale, 'logistic.title')}
                    </h2>
                    <p className="text-gray-600">
                        {t(locale, 'logistic.description')}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-blue-900/30">
                    <div className="space-y-8">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                                {t(locale, 'logistic.dependent_variable')}
                            </label>
                            <select
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                value={logisticVars.y}
                                onChange={(e) => setLogisticVars({ ...logisticVars, y: e.target.value })}
                            >
                                <option value="" className="text-slate-400">{t(locale, 'common.select_variable')}</option>
                                {columns.map(col => (
                                    <option key={col} value={col} disabled={logisticVars.xs.includes(col)}>{col}</option>
                                ))}
                            </select>
                            <p className="text-[10px] uppercase font-black text-blue-500/80 tracking-widest mt-2">{t(locale, 'logistic.note')}</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                                {t(locale, 'logistic.independent_variables')}
                            </label>
                            <div className="space-y-1.5 mb-2 max-h-56 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950/30 shadow-inner">
                                {columns.map(col => (
                                    <label key={col} className={`flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors group cursor-pointer ${logisticVars.y === col ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                                        <input
                                            type="checkbox"
                                            value={col}
                                            checked={logisticVars.xs.includes(col)}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setLogisticVars(prev => ({
                                                    ...prev,
                                                    xs: isChecked
                                                        ? [...prev.xs, col]
                                                        : prev.xs.filter(v => v !== col)
                                                }));
                                            }}
                                            disabled={logisticVars.y === col}
                                            className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                                        />
                                        <span className={`text-sm font-bold ${logisticVars.y === col ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>{col}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={async () => {
                            if (!logisticVars.y) { showToast(t(locale, 'logistic.error_y'), 'error'); return; }
                            if (logisticVars.xs.length === 0) { showToast(t(locale, 'logistic.error_x'), 'error'); return; }

                            setIsAnalyzing(true);

                            // NCS Credit Check
                            if (user) {
                                const cost = await getAnalysisCost('regression');
                                const hasEnough = await checkBalance(user.id, cost);
                                if (!hasEnough) {
                                    setRequiredCredits(cost);
                                    setCurrentAnalysisCost(cost);
                                    setShowInsufficientCredits(true);
                                    setIsAnalyzing(false);
                                    return;
                                }
                            }

                            try {
                                const cols = [logisticVars.y, ...logisticVars.xs];
                                const logData = data.map(row => cols.map(c => Number(row[c]) || 0));

                                const result = await runLogisticRegression(logData, cols);

                                // Deduct credits on success
                                if (user) {
                                    const cost = await getAnalysisCost('regression');
                                    await deductCredits(user.id, cost, `Logistic Regression: Y=${logisticVars.y}`);
                                    await logAnalysisUsage(user.id, 'regression', cost);
                                    setNcsBalance(prev => Math.max(0, prev - cost));
                                }

                                setResults({ type: 'logistic', data: result, columns: cols });
                                setStep('results');
                                showToast(locale === 'vi' ? 'Phân tích hoàn thành!' : 'Analysis completed!', 'success');
                            } catch (err: any) { showToast(t(locale, 'common.error') + ': ' + err.message || err, 'error'); }
                            finally { setIsAnalyzing(false); }
                        }}
                        disabled={isAnalyzing}
                        className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                    >
                        {isAnalyzing ? (locale === 'vi' ? 'Đang phân tích...' : 'Analyzing...') : (locale === 'vi' ? 'Chạy Logistic Regression' : 'Run Logistic Regression')}
                    </button>
                </div>

                <button
                    onClick={() => setStep('analyze')}
                    className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg"
                >
                    ← {locale === 'vi' ? 'Quay lại' : 'Back'}
                </button>
            </div>
        );
    }

    return null;
};
