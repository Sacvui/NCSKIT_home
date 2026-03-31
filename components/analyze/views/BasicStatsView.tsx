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
                <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <p className="text-sm text-gray-600 mb-4">Chọn biến (có thể chọn nhiều):</p>
                    <div className="max-h-60 overflow-y-auto space-y-2 mb-6 border rounded p-2">
                        {columns.map(col => (
                            <div key={col} className="flex items-center space-x-2">
                                <input type="checkbox" id={`desc-col-${col}`} name="desc-col" value={col} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor={`desc-col-${col}`} className="text-sm text-gray-700 select-none cursor-pointer w-full">{col}</label>
                            </div>
                        ))}
                    </div>
                    <div className="flex space-x-3 mb-6 text-sm">
                        <button onClick={() => document.querySelectorAll('input[name="desc-col"]').forEach((el: any) => el.checked = true)} className="text-indigo-600 hover:text-indigo-800 font-medium">Chọn tất cả</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => document.querySelectorAll('input[name="desc-col"]').forEach((el: any) => el.checked = false)} className="text-gray-500 hover:text-gray-700 font-medium">Bỏ chọn</button>
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
                <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <p className="text-sm text-gray-600 mb-4">Chọn 2 biến số để so sánh trung bình:</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm 1</label>
                            <select id="ttest-group1" className="w-full px-3 py-2 border rounded-lg" defaultValue=""><option value="">Chọn biến...</option>{columns.map(col => <option key={col} value={col}>{col}</option>)}</select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm 2</label>
                            <select id="ttest-group2" className="w-full px-3 py-2 border rounded-lg" defaultValue=""><option value="">Chọn biến...</option>{columns.map(col => <option key={col} value={col}>{col}</option>)}</select>
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
                <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <p className="text-sm text-gray-600 mb-4">Chọn biến trước và sau để so sánh:</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trước (Before)</label>
                            <select id="paired-before" className="w-full px-3 py-2 border rounded-lg" defaultValue=""><option value="">Chọn biến...</option>{columns.map(col => <option key={col} value={col}>{col}</option>)}</select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sau (After)</label>
                            <select id="paired-after" className="w-full px-3 py-2 border rounded-lg" defaultValue=""><option value="">Chọn biến...</option>{columns.map(col => <option key={col} value={col}>{col}</option>)}</select>
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
                <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <p className="text-sm text-gray-600 mb-4">Chọn các biến để so sánh (mỗi biến là 1 nhóm):</p>
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                        {columns.map(col => (
                            <label key={col} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                <input type="checkbox" value={col} className="anova-checkbox w-4 h-4 text-purple-600" />
                                <span>{col}</span>
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
                <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <p className="text-sm text-gray-600 mb-4">Chọn 2 biến để kiểm định:</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Biến hàng (Row)</label>
                            <select id="chisq-row" className="w-full px-3 py-2 border rounded-lg" defaultValue=""><option value="">Chọn biến...</option>{allColumns.map(col => <option key={col} value={col}>{col}</option>)}</select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Biến cột (Col)</label>
                            <select id="chisq-col" className="w-full px-3 py-2 border rounded-lg" defaultValue=""><option value="">Chọn biến...</option>{allColumns.map(col => <option key={col} value={col}>{col}</option>)}</select>
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
                <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <p className="text-sm text-gray-600 mb-4 font-medium">Chọn 2 biến định lượng để so sánh:</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm 1</label>
                            <select id="mw-group1" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-all" defaultValue=""><option value="">Chọn biến...</option>{columns.map(col => <option key={col} value={col}>{col}</option>)}</select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm 2</label>
                            <select id="mw-group2" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-all" defaultValue=""><option value="">Chọn biến...</option>{columns.map(col => <option key={col} value={col}>{col}</option>)}</select>
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
                <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-600 font-medium">Chọn các biến để so sánh (mỗi biến là 1 nhóm):</p>
                        <div className="space-x-2">
                            <button onClick={() => document.querySelectorAll('.kw-checkbox').forEach((c: any) => c.checked = true)} className="text-xs text-blue-600 font-medium hover:underline">Chọn hết</button>
                            <button onClick={() => document.querySelectorAll('.kw-checkbox').forEach((c: any) => c.checked = false)} className="text-xs text-gray-500 font-medium hover:underline">Bỏ chọn</button>
                        </div>
                    </div>
                    <div className="space-y-1 mb-6 max-h-48 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                        {columns.map(col => (
                            <label key={col} className="flex items-center gap-3 p-2 hover:bg-white hover:shadow-sm rounded-md transition-all cursor-pointer">
                                <input type="checkbox" value={col} className="kw-checkbox w-4 h-4 text-amber-600 rounded" />
                                <span className="text-sm text-gray-700">{col}</span>
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
                <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <p className="text-sm text-gray-600 mb-4 font-medium">Chọn biến Trước và Sau:</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trước (Before)</label>
                            <select id="wilcox-before" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" defaultValue=""><option value="">Chọn biến...</option>{columns.map(col => <option key={col} value={col}>{col}</option>)}</select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sau (After)</label>
                            <select id="wilcox-after" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" defaultValue=""><option value="">Chọn biến...</option>{columns.map(col => <option key={col} value={col}>{col}</option>)}</select>
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
