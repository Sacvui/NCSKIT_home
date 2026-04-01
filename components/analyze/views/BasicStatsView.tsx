'use client';

import React, { useState } from 'react';
import { Locale, t } from '@/lib/i18n';
import {
    runDescriptiveStats, runTTestIndependent, runTTestPaired, runOneWayANOVA,
    runChiSquare, runMannWhitneyU, runKruskalWallis, runWilcoxonSignedRank
} from '@/lib/webr-wrapper';
import { getAnalysisCost, checkBalance, deductCredits } from '@/lib/ncs-credits';
import { logAnalysisUsage } from '@/lib/activity-logger';
import type { DataProfile } from '@/lib/data-profiler';

interface BasicStatsViewProps {
    step: string;
    data: any[];
    columns: string[];
    allColumns: string[];
    profile: DataProfile | null;
    user: any;
    setResults: (results: any) => void;
    setStep: (step: any) => void;
    setNcsBalance: React.Dispatch<React.SetStateAction<number>>;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    setAnalysisType: (type: string) => void;
    setRequiredCredits: (credits: number) => void;
    setCurrentAnalysisCost: (cost: number) => void;
    setShowInsufficientCredits: (show: boolean) => void;
    locale: Locale;
}

export function BasicStatsView({
    step,
    data,
    columns,
    allColumns,
    profile,
    user,
    setResults,
    setStep,
    setNcsBalance,
    showToast,
    setAnalysisType,
    setRequiredCredits,
    setCurrentAnalysisCost,
    setShowInsufficientCredits,
    locale
}: BasicStatsViewProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalysisWrapper = async (
        analysisKey: string,
        costKey: string,
        action: () => Promise<any>,
        colsToSave: string[],
        successMsg: string,
        logDesc: string
    ) => {
        setIsAnalyzing(true);
        setAnalysisType(analysisKey);

        if (user) {
            const cost = await getAnalysisCost(costKey);
            const { hasEnough } = await checkBalance(user.id, cost);
            if (!hasEnough) {
                setRequiredCredits(cost);
                setCurrentAnalysisCost(cost);
                setShowInsufficientCredits(true);
                setIsAnalyzing(false);
                return;
            }
        }

        try {
            const result = await action();

            if (user) {
                const cost = await getAnalysisCost(costKey);
                await deductCredits(user.id, cost, logDesc);
                await logAnalysisUsage(user.id, analysisKey, cost);
                setNcsBalance(prev => Math.max(0, prev - cost));
            }

            setResults({ type: analysisKey, data: result, columns: colsToSave });
            setStep('results');
            showToast(successMsg, 'success');
        } catch (err: any) {
            showToast(`${t(locale, 'error')}: ` + (err.message || err), 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (step === 'descriptive-select') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-bold">Chọn biến (có thể chọn nhiều):</p>
                    <div className="max-h-60 overflow-y-auto space-y-2 mb-6 border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-950/30 shadow-inner">
                        {columns.map(col => (
                            <label key={col} className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all group cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                <input type="checkbox" id={`desc-col-${col}`} name="desc-col" value={col} className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                <span className="text-sm text-slate-900 dark:text-slate-100 font-black uppercase tracking-tight select-none cursor-pointer w-full group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{col}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex space-x-4 mb-6 text-xs uppercase tracking-wider font-black">
                        <button onClick={() => document.querySelectorAll('input[name="desc-col"]').forEach((el: any) => el.checked = true)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">Tất cả</button>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <button onClick={() => document.querySelectorAll('input[name="desc-col"]').forEach((el: any) => el.checked = false)} className="text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Bỏ chọn</button>
                    </div>
                    <button
                        onClick={() => {
                            const selectedCols = Array.from(document.querySelectorAll('input[name="desc-col"]:checked')).map(cb => (cb as HTMLInputElement).value);
                            if (selectedCols.length === 0) return showToast('Vui lòng chọn ít nhất 1 biến', 'error');
                            handleAnalysisWrapper(
                                'descriptive', 'descriptive',
                                () => runDescriptiveStats(data.map(row => selectedCols.map(col => Number(row[col]) || 0))),
                                selectedCols, 'Phân tích hoàn tất!', `Descriptive Stats: ${selectedCols.length} variables`
                            );
                        }}
                        disabled={isAnalyzing}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isAnalyzing ? 'Đang xử lý...' : 'Chạy Thống kê mô tả'}
                    </button>
                </div>
                <button onClick={() => setStep('analyze')} className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors">← Quay lại</button>
            </div>
        );
    }

    if (step === 'ttest-select') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Independent Samples T-test</h2>
                    <p className="text-gray-600">So sánh trung bình giữa 2 nhóm độc lập</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-indigo-100 dark:border-indigo-900/30">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                        Chọn 2 biến số để so sánh trung bình:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Nhóm 1 (Biến phụ thuộc)</label>
                            <select id="ttest-group1" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer" defaultValue="">
                                <option value="" className="text-slate-400">Chọn biến...</option>
                                {columns.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Nhóm 2 (Biến phụ thuộc)</label>
                            <select id="ttest-group2" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer" defaultValue="">
                                <option value="" className="text-slate-400">Chọn biến...</option>
                                {columns.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const g1 = (document.getElementById('ttest-group1') as HTMLSelectElement).value;
                            const g2 = (document.getElementById('ttest-group2') as HTMLSelectElement).value;
                            if (!g1 || !g2) return showToast('Vui lòng chọn cả 2 biến', 'error');
                            if (g1 === g2) return showToast('Vui lòng chọn 2 biến khác nhau', 'error');
                            handleAnalysisWrapper(
                                'ttest-indep', 'ttest-indep',
                                () => runTTestIndependent(data.map(row => Number(row[g1]) || 0), data.map(row => Number(row[g2]) || 0)),
                                [g1, g2], 'Phân tích T-test hoàn thành!', `Independent T-Test: ${g1} vs ${g2}`
                            );
                        }}
                        disabled={isAnalyzing} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                    >
                        {isAnalyzing ? 'Đang phân tích...' : 'Chạy Independent T-test'}
                    </button>
                </div>
                <button onClick={() => setStep('analyze')} className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg">← Quay lại</button>
            </div>
        );
    }

    if (step === 'ttest-paired-select') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Paired Samples T-test</h2>
                    <p className="text-gray-600">So sánh trước-sau (cùng một nhóm đối tượng)</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-green-100 dark:border-green-900/30">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Chọn cặp biến Trước - Sau (Paired):
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Trước (Before)</label>
                            <select id="paired-before" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer" defaultValue="">
                                <option value="" className="text-slate-400">Chọn biến...</option>
                                {columns.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Sau (After)</label>
                            <select id="paired-after" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer" defaultValue="">
                                <option value="" className="text-slate-400">Chọn biến...</option>
                                {columns.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const b = (document.getElementById('paired-before') as HTMLSelectElement).value;
                            const a = (document.getElementById('paired-after') as HTMLSelectElement).value;
                            if (!b || !a) return showToast('Vui lòng chọn cả 2 biến', 'error');
                            if (b === a) return showToast('Vui lòng chọn 2 biến khác nhau', 'error');
                            handleAnalysisWrapper(
                                'ttest-paired', 'ttest-paired',
                                () => runTTestPaired(data.map(row => Number(row[b]) || 0), data.map(row => Number(row[a]) || 0)),
                                [b, a], 'Phân tích Paired T-test hoàn thành!', `Paired T-Test: ${b} vs ${a}`
                            );
                        }}
                        disabled={isAnalyzing} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                    >
                        {isAnalyzing ? 'Đang phân tích...' : 'Chạy Paired T-test'}
                    </button>
                </div>
                <button onClick={() => setStep('analyze')} className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg">← Quay lại</button>
            </div>
        );
    }

    if (step === 'anova-select') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">One-Way ANOVA</h2>
                    <p className="text-gray-600">So sánh trung bình giữa nhiều nhóm (≥3)</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-purple-100 dark:border-purple-900/30">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 font-bold">Chọn các biến để so sánh (mỗi biến là 1 nhóm):</p>
                    <div className="space-y-1.5 mb-6 max-h-48 overflow-y-auto p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/30 shadow-inner">
                        {columns.map(col => (
                            <label key={col} className="flex items-center gap-3 p-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all group cursor-pointer border border-transparent hover:border-purple-200 dark:hover:border-purple-900/40">
                                <input type="checkbox" value={col} className="anova-checkbox w-5 h-5 text-purple-600 rounded-lg border-slate-300 dark:border-slate-700 focus:ring-purple-500 cursor-pointer" />
                                <span className="text-sm text-slate-900 dark:text-slate-100 font-black uppercase tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400">{col}</span>
                            </label>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            const selectedCols = Array.from(document.querySelectorAll('.anova-checkbox:checked')).map(cb => (cb as HTMLInputElement).value);
                            if (selectedCols.length < 3) return showToast('Cần chọn ít nhất 3 biến', 'error');
                            handleAnalysisWrapper(
                                'anova', 'anova',
                                () => runOneWayANOVA(selectedCols.map(col => data.map(row => Number(row[col]) || 0))),
                                selectedCols, 'Phân tích ANOVA hoàn thành!', `One-Way ANOVA: ${selectedCols.length} variables`
                            );
                        }}
                        disabled={isAnalyzing} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg"
                    >
                        {isAnalyzing ? 'Đang phân tích...' : 'Chạy ANOVA'}
                    </button>
                </div>
                <button onClick={() => setStep('analyze')} className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg">← Quay lại</button>
            </div>
        );
    }

    if (step === 'chisq-select' || step === 'fisher-select') {
        const isFisher = step === 'fisher-select';
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{isFisher ? "Fisher's Exact Test" : "Chi-Square Test of Independence"}</h2>
                    <p className="text-gray-600">{isFisher ? "Kiểm định mối quan hệ biến định danh (Dành cho mẫu nhỏ)" : "Kiểm định mối quan hệ giữa 2 biến định danh"}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-teal-100 dark:border-teal-900/30">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                        Chọn 2 biến định danh để kiểm định:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Biến hàng (Row)</label>
                            <select id="chisq-row" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer" defaultValue="">
                                <option value="" className="text-slate-400">Chọn biến...</option>
                                {allColumns.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Biến cột (Col)</label>
                            <select id="chisq-col" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer" defaultValue="">
                                <option value="" className="text-slate-400">Chọn biến...</option>
                                {allColumns.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const rVar = (document.getElementById('chisq-row') as HTMLSelectElement).value;
                            const cVar = (document.getElementById('chisq-col') as HTMLSelectElement).value;
                            if (!rVar || !cVar) return showToast('Vui lòng chọn cả 2 biến', 'error');
                            if (rVar === cVar) return showToast('Vui lòng chọn 2 biến khác nhau', 'error');
                            handleAnalysisWrapper(
                                'chisquare', 'chisquare', // Using chisquare action/cost for both
                                () => runChiSquare(data.map(row => [row[rVar], row[cVar]])),
                                [rVar, cVar], `Phân tích ${isFisher ? 'Fisher Exact' : 'Chi-Square'} hoàn thành!`, `${isFisher ? 'Fisher Exact' : 'Chi-Square'}: ${rVar} vs ${cVar}`
                            );
                        }}
                        disabled={isAnalyzing} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg"
                    >
                        {isAnalyzing ? 'Đang phân tích...' : `Chạy ${isFisher ? 'Fisher Exact' : 'Chi-Square Test'}`}
                    </button>
                </div>
                <button onClick={() => setStep('analyze')} className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg">← Quay lại</button>
            </div>
        );
    }

    if (step === 'mannwhitney-select') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Mann-Whitney U Test</h2>
                    <p className="text-gray-600">So sánh trung vị giữa 2 nhóm độc lập (Phi tham số)</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-cyan-100 dark:border-cyan-900/30">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                        Chọn 2 biến định lượng để so sánh trung vị:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Nhóm 1</label>
                            <select id="mw-group1" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer" defaultValue="">
                                <option value="" className="text-slate-400">Chọn biến...</option>
                                {columns.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Nhóm 2</label>
                            <select id="mw-group2" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer" defaultValue="">
                                <option value="" className="text-slate-400">Chọn biến...</option>
                                {columns.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const g1 = (document.getElementById('mw-group1') as HTMLSelectElement).value;
                            const g2 = (document.getElementById('mw-group2') as HTMLSelectElement).value;
                            if (!g1 || !g2) return showToast('Vui lòng chọn cả 2 biến', 'error');
                            if (g1 === g2) return showToast('Vui lòng chọn 2 biến khác nhau', 'error');
                            handleAnalysisWrapper(
                                'mann-whitney', 'mann-whitney',
                                () => runMannWhitneyU(data.map(row => Number(row[g1]) || 0), data.map(row => Number(row[g2]) || 0)),
                                [g1, g2], 'Phân tích Mann-Whitney U thành công!', `Mann-Whitney U: ${g1} vs ${g2}`
                            );
                        }}
                        disabled={isAnalyzing} className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md transition-all"
                    >
                        {isAnalyzing ? 'Đang phân tích...' : 'Chạy Mann-Whitney U'}
                    </button>
                </div>
                <button onClick={() => setStep('analyze')} className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all">← Quay lại chọn phương pháp</button>
            </div>
        );
    }

    if (step === 'kruskalwallis-select') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Kruskal-Wallis Test</h2>
                    <p className="text-gray-600">So sánh trung vị giữa nhiều nhóm (Phi tham số)</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-amber-900/30">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            Chọn các biến để so sánh (mẫu phi tham số):
                        </p>
                        <div className="space-x-2">
                            <button onClick={() => document.querySelectorAll('.kw-checkbox').forEach((c: any) => c.checked = true)} className="text-xs text-blue-600 font-medium hover:underline">Chọn hết</button>
                            <button onClick={() => document.querySelectorAll('.kw-checkbox').forEach((c: any) => c.checked = false)} className="text-xs text-gray-500 font-medium hover:underline">Bỏ chọn</button>
                        </div>
                    </div>
                    <div className="space-y-1.5 mb-6 max-h-48 overflow-y-auto p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/30 shadow-inner">
                        {columns.map(col => (
                            <label key={col} className="flex items-center gap-3 p-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all group cursor-pointer border border-transparent hover:border-amber-200 dark:hover:border-amber-900/40">
                                <input type="checkbox" value={col} className="kw-checkbox w-5 h-5 text-amber-600 rounded-lg border-slate-300 dark:border-slate-700 focus:ring-amber-500 cursor-pointer" />
                                <span className="text-sm text-slate-900 dark:text-slate-100 font-black uppercase tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400">{col}</span>
                            </label>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            const selectedCols = Array.from(document.querySelectorAll('.kw-checkbox:checked')).map(cb => (cb as HTMLInputElement).value);
                            if (selectedCols.length < 3) return showToast('Cần chọn ít nhất 3 biến (3 nhóm) để so sánh', 'error');
                            handleAnalysisWrapper(
                                'kruskal-wallis', 'kruskal-wallis',
                                () => runKruskalWallis(selectedCols.map(col => data.map(row => Number(row[col]) || 0))),
                                selectedCols, 'Phân tích Kruskal-Wallis thành công!', `Kruskal-Wallis: ${selectedCols.length} groups`
                            );
                        }}
                        disabled={isAnalyzing} className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md transition-all"
                    >
                        {isAnalyzing ? 'Đang phân tích...' : 'Chạy Kruskal-Wallis'}
                    </button>
                </div>
                <button onClick={() => setStep('analyze')} className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all">← Quay lại chọn phương pháp</button>
            </div>
        );
    }

    if (step === 'wilcoxon-select') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Wilcoxon Signed Rank Test</h2>
                    <p className="text-gray-600">So sánh cặp trước-sau (Phi tham số)</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-teal-100 dark:border-teal-900/30">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                        Chọn biến Trước - Sau (Mẫu phi tham số):
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Trước (Before)</label>
                            <select id="wilcox-before" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer" defaultValue="">
                                <option value="" className="text-slate-400">Chọn biến...</option>
                                {columns.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Sau (After)</label>
                            <select id="wilcox-after" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer" defaultValue="">
                                <option value="" className="text-slate-400">Chọn biến...</option>
                                {columns.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const before = (document.getElementById('wilcox-before') as HTMLSelectElement).value;
                            const after = (document.getElementById('wilcox-after') as HTMLSelectElement).value;
                            if (!before || !after) return showToast('Vui lòng chọn đủ 2 biến', 'error');
                            if (before === after) return showToast('Hãy chọn 2 biến khác nhau', 'error');
                            handleAnalysisWrapper(
                                'wilcoxon', 'wilcoxon',
                                () => runWilcoxonSignedRank(data.map(row => Number(row[before]) || 0), data.map(row => Number(row[after]) || 0)),
                                [before, after], 'Phân tích Wilcoxon thành công!', `Wilcoxon: ${before} vs ${after}`
                            );
                        }}
                        disabled={isAnalyzing} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition-all"
                    >
                        {isAnalyzing ? 'Đang phân tích...' : 'Chạy Wilcoxon Test'}
                    </button>
                </div>
                <button onClick={() => setStep('analyze')} className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all">← Quay lại chọn phương pháp</button>
            </div>
        );
    }

    return null;
}
