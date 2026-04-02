'use client';

import React, { useState } from 'react';
import { AnalysisStep } from '@/types/analysis';
import { Locale, t } from '@/lib/i18n';
import { getAnalysisCost, checkBalance, deductCredits } from '@/lib/ncs-credits';
import { logAnalysisUsage } from '@/lib/activity-logger';
import { runCronbachAlpha, runEFA, runCFA, runSEM } from '@/lib/webr-wrapper';
import { SmartGroupSelector } from '@/components/VariableSelector';
import CFASelection from '@/components/CFASelection';
import SEMSelection from '@/components/SEMSelection';
import { ChevronLeft, Play, Shield, Grid3x3, Network, Layers } from 'lucide-react';

interface ReliabilityViewProps {
    step: AnalysisStep;
    data: any[];
    columns: string[];
    user: any;
    setResults: (results: any) => void;
    setStep: (step: AnalysisStep) => void;
    setNcsBalance: React.Dispatch<React.SetStateAction<number>>;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    setScaleName: (name: string) => void;
    setMultipleResults: (results: any[]) => void;
    setAnalysisType: (type: string) => void;
    setRequiredCredits: (amount: number) => void;
    setCurrentAnalysisCost: (amount: number) => void;
    setShowInsufficientCredits: (show: boolean) => void;
    locale: Locale;
}

export const ReliabilityView: React.FC<ReliabilityViewProps> = ({
    step,
    data,
    columns,
    user,
    setResults,
    setStep,
    setNcsBalance,
    showToast,
    setScaleName,
    setMultipleResults,
    setAnalysisType,
    setRequiredCredits,
    setCurrentAnalysisCost,
    setShowInsufficientCredits,
    locale
}) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalysisError = (err: any) => {
        const msg = err.message || String(err);
        console.error("Analysis Error:", err);
        showToast(`Lỗi: ${msg.substring(0, 100)}...`, 'error');
    };

    const ViewHeader = ({ title, subtitle, icon: Icon }: any) => (
        <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
                <Icon className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-black text-blue-900 tracking-tight uppercase">{title}</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium max-w-md">{subtitle}</p>
        </div>
    );

    const ActionButton = ({ onClick, disabled, children }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full py-4 bg-blue-900 hover:bg-blue-950 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
        >
            {isAnalyzing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Play className="w-5 h-5" />}
            {children}
        </button>
    );

    // --- Logic for Cronbach/Omega ---

    const runCronbachWithSelection = async (selectedColumns: string[], name: string) => {
        if (selectedColumns.length < 2) {
            showToast('Thang đo cần ít nhất 2 biến cho Cronbach Alpha', 'error');
            return;
        }

        if (user) {
            const cost = await getAnalysisCost('cronbach');
            const { hasEnough } = await checkBalance(user.id, cost);
            if (!hasEnough) {
                setRequiredCredits(cost);
                setCurrentAnalysisCost(cost);
                setShowInsufficientCredits(true);
                return;
            }
        }

        setIsAnalyzing(true);
        setAnalysisType('cronbach');
        setScaleName(name);
        setMultipleResults([]);

        try {
            const selectedData = data.map(row => selectedColumns.map(col => Number(row[col]) || 0));
            const analysisResults = await runCronbachAlpha(selectedData);

            if (user) {
                const cost = await getAnalysisCost('cronbach');
                await deductCredits(user.id, cost, `Cronbach Alpha: ${name}`);
                await logAnalysisUsage(user.id, 'cronbach', cost);
                setNcsBalance(prev => Math.max(0, prev - cost));
            }

            setResults({ type: 'cronbach', data: analysisResults, columns: selectedColumns, scaleName: name });
            setStep('results');
            showToast('Phân tích hoàn tất!', 'success');
        } catch (error) {
            handleAnalysisError(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const runCronbachBatch = async (groups: { name: string; columns: string[] }[]) => {
        if (user) {
            const singleCost = await getAnalysisCost('cronbach');
            const totalCost = singleCost * groups.length;
            const { hasEnough } = await checkBalance(user.id, totalCost);
            if (!hasEnough) {
                setRequiredCredits(totalCost);
                setCurrentAnalysisCost(totalCost);
                setShowInsufficientCredits(true);
                return;
            }
        }

        setIsAnalyzing(true);
        setAnalysisType('cronbach-batch');
        setResults(null);
        setMultipleResults([]);

        try {
            const allResults = [];
            for (const group of groups) {
                const groupData = data.map(row => group.columns.map(col => Number(row[col]) || 0));
                const result = await runCronbachAlpha(groupData);
                allResults.push({ scaleName: group.name, columns: group.columns, data: result });
            }

            if (user) {
                const singleCost = await getAnalysisCost('cronbach');
                const totalCost = singleCost * groups.length;
                await deductCredits(user.id, totalCost, `Batch Cronbach: ${groups.length} scales`);
                await logAnalysisUsage(user.id, 'cronbach-batch', totalCost);
                setNcsBalance(prev => Math.max(0, prev - totalCost));
            }

            setMultipleResults(allResults);
            setStep('results');
            showToast(`Phân tích ${allResults.length} thang đo hoàn thành!`, 'success');
        } catch (error) {
            handleAnalysisError(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const runOmegaWithSelection = async (selectedColumns: string[], name: string) => {
        if (selectedColumns.length < 3) {
            showToast('McDonald\'s Omega cần ít nhất 3 biến', 'error');
            return;
        }

        if (user) {
            const cost = await getAnalysisCost('omega');
            const { hasEnough } = await checkBalance(user.id, cost);
            if (!hasEnough) {
                setRequiredCredits(cost);
                setCurrentAnalysisCost(cost);
                setShowInsufficientCredits(true);
                return;
            }
        }

        setIsAnalyzing(true);
        setAnalysisType('omega');
        setScaleName(name);
        setMultipleResults([]);

        try {
            const selectedData = data.map(row => selectedColumns.map(col => Number(row[col]) || 0));
            const analysisResults = await runCronbachAlpha(selectedData); // Note: Should be runOmega in future, matching current behavior for now

            if (user) {
                const cost = await getAnalysisCost('omega');
                await deductCredits(user.id, cost, `McDonald's Omega: ${name}`);
                await logAnalysisUsage(user.id, 'omega', cost);
                setNcsBalance(prev => Math.max(0, prev - cost));
            }

            setResults({ type: 'omega', data: analysisResults, columns: selectedColumns, scaleName: name });
            setStep('results');
            showToast('Phân tích Omega hoàn thành!', 'success');
        } catch (error) {
            handleAnalysisError(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // --- Render ---

    if (step === 'cronbach-select') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ViewHeader title="Cronbach's Alpha (α)" subtitle="Phân tích độ tin cậy nhất quán nội tại của thang đo. Hệ thống hỗ trợ tự động nhận diện và gom nhóm biến." icon={Shield} />
                
                <div className="bg-white rounded-2xl border border-blue-100 shadow-xl p-2 md:p-6 overflow-hidden">
                    <SmartGroupSelector
                        columns={columns}
                        onAnalyzeGroup={runCronbachWithSelection}
                        onAnalyzeAllGroups={runCronbachBatch}
                        isAnalyzing={isAnalyzing}
                    />
                </div>

                <button onClick={() => setStep('analyze')} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                    <ChevronLeft className="w-3 h-3" /> Quay lại chọn phương pháp
                </button>
            </div>
        );
    }

    if (step === 'omega-select') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ViewHeader title="McDonald's Omega (ω)" subtitle="Đánh giá độ tin cậy hiện đại, chính xác hơn Cronbach Alpha khi các giả định về sự tuân thủ đơn chiều bị vi phạm." icon={Shield} />
                
                <div className="bg-white rounded-2xl border border-blue-100 shadow-xl p-2 md:p-6 overflow-hidden">
                    <SmartGroupSelector
                        columns={columns}
                        onAnalyzeGroup={runOmegaWithSelection}
                        onAnalyzeAllGroups={async (groups) => {
                             // Batch logic same as Cronbach for now as placeholder
                             setIsAnalyzing(true);
                             try {
                                 const allResults = [];
                                 for (const group of groups) {
                                     const result = await runCronbachAlpha(data.map(row => group.columns.map(col => Number(row[col]) || 0)));
                                     allResults.push({ scaleName: group.name, columns: group.columns, data: result });
                                 }
                                 setMultipleResults(allResults);
                                 setStep('results');
                             } catch (e) { handleAnalysisError(e); }
                             finally { setIsAnalyzing(false); }
                        }}
                        isAnalyzing={isAnalyzing}
                        minItemsPerGroup={3}
                        analysisLabel="McDonald's Omega"
                    />
                </div>

                <button onClick={() => setStep('analyze')} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                    <ChevronLeft className="w-3 h-3" /> Quay lại chọn phương pháp
                </button>
            </div>
        );
    }

    if (step === 'efa-select') {
        return (
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ViewHeader title="Exploratory Factor Analysis (EFA)" subtitle="Phân tích nhân tố khám phá nhằm rút gọn dữ liệu và xác định cấu trúc các nhân tố tiềm ẩn." icon={Grid3x3} />
                
                <div className="bg-white rounded-2xl border border-blue-100 shadow-xl p-8 space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Selector Column */}
                       <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Chọn biến quan sát (indicators)</label>
                            <div className="space-y-4">
                                <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
                                    <button onClick={() => document.querySelectorAll('.efa-checkbox').forEach((cb: any) => cb.checked = true)} className="text-blue-600">Select All</button>
                                    <button onClick={() => document.querySelectorAll('.efa-checkbox').forEach((cb: any) => cb.checked = false)} className="text-slate-400">Clear</button>
                                </div>
                                <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto p-4 bg-slate-50/50 rounded-xl border border-blue-50 border-dashed">
                                    {columns.map(col => (
                                        <label key={col} className="flex items-center gap-3 p-3 bg-white border border-blue-50 rounded-xl hover:border-blue-300 transition-all cursor-pointer group">
                                            <input type="checkbox" value={col} defaultChecked className="efa-checkbox w-5 h-5 rounded border-blue-100 text-blue-900 focus:ring-blue-900" />
                                            <span className="text-sm font-bold text-blue-900 uppercase tracking-tighter truncate group-hover:text-blue-700">{col}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                       </div>

                       {/* Settings Column */}
                       <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Số nhân tố (Factors)</label>
                                <input id="efa-nfactors" type="number" placeholder="Tự động (Eigenvalue > 1)" className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-blue-900 font-bold text-sm focus:ring-2 focus:ring-blue-900 outline-none shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Phép quay (Rotation)</label>
                                <select id="efa-rotation" defaultValue="varimax" className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-blue-900 font-bold text-sm focus:ring-2 focus:ring-blue-900 outline-none shadow-sm cursor-pointer">
                                    <option value="none">Không quay (None)</option>
                                    <option value="varimax">Vuông góc (Varimax)</option>
                                    <option value="promax">Xiên (Promax)</option>
                                </select>
                            </div>
                            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-[10px] text-blue-800 leading-relaxed font-medium italic">
                                * Gợi ý: Dùng Varimax nếu các nhân tố được kỳ vọng là độc lập. Dùng Promax nếu có tương quan giữa các nhân tố.
                            </div>
                       </div>
                   </div>

                    <ActionButton 
                        disabled={isAnalyzing}
                        onClick={async () => {
                             const selectedCols = Array.from(document.querySelectorAll('.efa-checkbox:checked')).map((cb: any) => cb.value);
                             const nfactors = (document.getElementById('efa-nfactors') as HTMLInputElement).value ? parseInt((document.getElementById('efa-nfactors') as HTMLInputElement).value) : 0;
                             const rotation = (document.getElementById('efa-rotation') as HTMLSelectElement).value;

                             if (selectedCols.length < 3) return showToast('Chọn ít nhất 3 biến', 'error');

                             setIsAnalyzing(true);
                             try {
                                 const res = await runEFA(data.map(row => selectedCols.map(c => Number(row[c]) || 0)), nfactors, rotation);
                                 setResults({ type: 'efa', data: res, columns: selectedCols });
                                 setStep('results');
                                 showToast('EFA hoàn tất!', 'success');
                             } catch (e) { handleAnalysisError(e); }
                             finally { setIsAnalyzing(false); }
                        }}
                    >
                        Chạy phân tích EFA
                    </ActionButton>
                </div>

                <button onClick={() => setStep('analyze')} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                    <ChevronLeft className="w-3 h-3" /> Quay lại
                </button>
            </div>
        );
    }

    if (step === 'cfa-select') {
        return (
            <CFASelection
                columns={columns}
                onRunCFA={async (syntax, factors) => {
                    setIsAnalyzing(true);
                    try {
                        const neededCols = Array.from(new Set(factors.flatMap((f: any) => f.indicators)));
                        const result = await runCFA(data.map(row => (neededCols as string[]).map(c => Number(row[c]) || 0)), neededCols as string[], syntax);
                        setResults({ type: 'cfa', data: result, columns: neededCols });
                        setStep('results');
                        showToast('CFA thành công!', 'success');
                    } catch (err) { handleAnalysisError(err); } 
                    finally { setIsAnalyzing(false); }
                }}
                isAnalyzing={isAnalyzing}
                onBack={() => setStep('analyze')}
            />
        );
    }

    if (step === 'sem-select') {
        return (
            <SEMSelection
                columns={columns}
                onRunSEM={async (syntax, factors) => {
                    setIsAnalyzing(true);
                    try {
                        const neededCols = Array.from(new Set(factors.flatMap((f: any) => f.indicators)));
                        const result = await runSEM(data.map(row => (neededCols as string[]).map(c => Number(row[c]) || 0)), neededCols as string[], syntax);
                        setResults({ type: 'sem', data: result, columns: neededCols });
                        setStep('results');
                        showToast('SEM thành công!', 'success');
                    } catch (err) { handleAnalysisError(err); } 
                    finally { setIsAnalyzing(false); }
                }}
                isAnalyzing={isAnalyzing}
                onBack={() => setStep('analyze')}
            />
        );
    }

    return null;
};
