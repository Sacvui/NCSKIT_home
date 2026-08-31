'use client';

import React, { useState, useEffect } from 'react';
import { Target, Layers, Play, Rocket, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { runMcDonaldOmega, runEFA, runPLSSEM } from '@/lib/webr-wrapper';

interface AutoPilotViewProps {
    step: string;
    data: any[];
    columns: string[];
    allColumns: string[];
    user: any;
    setResults: (res: any) => void;
    setStep: (step: any) => void;
    setNcsBalance: (balance: number) => void;
    showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
    setAnalysisType: (type: string) => void;
    setRequiredCredits: (c: number) => void;
    setCurrentAnalysisCost: (c: number) => void;
    setShowInsufficientCredits: (show: boolean) => void;
    locale: string;
}

interface VariableGroup {
    name: string;
    columns: string[];
    selected: boolean;
}

function extractPrefix(colName: string): string {
    const match = colName.match(/^([A-Za-z]+)/);
    return match ? match[1].toUpperCase() : colName.substring(0, 2).toUpperCase();
}

function autoGroupColumns(columns: string[]): VariableGroup[] {
    const groupMap: Record<string, string[]> = {};
    columns.forEach(col => {
        const prefix = extractPrefix(col);
        if (!groupMap[prefix]) groupMap[prefix] = [];
        groupMap[prefix].push(col);
    });
    return Object.entries(groupMap)
        .filter(([_, cols]) => cols.length >= 2)
        .map(([name, cols]) => ({ name, columns: cols, selected: true }));
}

export function AutoPilotView({
    data,
    columns,
    setResults,
    setStep,
    showToast,
    setAnalysisType,
    locale
}: AutoPilotViewProps) {
    const [groups, setGroups] = useState<VariableGroup[]>([]);
    const [dependentVar, setDependentVar] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('');

    useEffect(() => {
        const autoGroups = autoGroupColumns(columns);
        setGroups(autoGroups);
        if (autoGroups.length > 0) {
            // Auto guess DV (often the last one)
            setDependentVar(autoGroups[autoGroups.length - 1].name);
        }
    }, [columns]);

    const handleRunAutoPilot = async () => {
        if (!dependentVar) {
            showToast('Vui lòng chọn Biến phụ thuộc (Dependent Variable)', 'error');
            return;
        }

        const independentGroups = groups.filter(g => g.name !== dependentVar && g.selected);
        if (independentGroups.length === 0) {
            showToast('Cần ít nhất 1 biến độc lập', 'error');
            return;
        }

        setIsAnalyzing(true);
        setAnalysisType('auto-pilot');
        try {
            const numericData = data.map(row => columns.map(col => Number(row[col]) || 0));
            const fullReport: any = {
                model: {
                    ivs: independentGroups.map(g => g.name),
                    dv: dependentVar
                },
                cronbach: {},
                efa: null,
                sem: null
            };

            // 1. Reliability
            setStatusText('Đang kiểm tra độ tin cậy thang đo (Cronbach Alpha)...');
            setProgress(20);
            for (const group of [...independentGroups, groups.find(g => g.name === dependentVar)!]) {
                const groupIndices = group.columns.map(c => columns.indexOf(c));
                const groupData = numericData.map(row => groupIndices.map(idx => row[idx]));
                const res = await runMcDonaldOmega(groupData, group.columns);
                fullReport.cronbach[group.name] = { columns: group.columns, data: res };
            }

            // 2. EFA
            setStatusText('Đang chạy phân tích nhân tố khám phá (EFA)...');
            setProgress(50);
            const allItems = [...independentGroups.flatMap(g => g.columns), ...groups.find(g => g.name === dependentVar)!.columns];
            const efaIndices = allItems.map(c => columns.indexOf(c));
            const efaData = numericData.map(row => efaIndices.map(idx => row[idx]));
            const expectedFactors = independentGroups.length + 1; // IVs + 1 DV
            const efaRes = await runEFA(efaData, expectedFactors, 'oblimin', 'minres');
            fullReport.efa = { columns: allItems, data: efaRes };

            // 3. SEM
            setStatusText('Đang chạy mô hình cấu trúc tuyến tính (PLS-SEM)...');
            setProgress(80);
            const measurementModel = [
                ...independentGroups.map(g => ({ construct: g.name, items: g.columns.map(c => columns.indexOf(c)) })),
                { construct: dependentVar, items: groups.find(g => g.name === dependentVar)!.columns.map(c => columns.indexOf(c)) }
            ];
            const structuralModel = independentGroups.map(g => ({ from: g.name, to: dependentVar }));
            
            const semRes = await runPLSSEM(numericData, measurementModel, structuralModel);
            fullReport.sem = semRes;

            setProgress(100);
            setStatusText('Hoàn tất! Đang kết xuất báo cáo...');
            
            setResults({
                type: 'auto-pilot',
                data: fullReport,
                columns: columns
            });
            
            setTimeout(() => {
                setStep('results');
                showToast('Chạy Auto Pilot thành công!', 'success');
            }, 500);

        } catch (error: any) {
            console.error(error);
            showToast('Lỗi khi chạy Auto Pilot: ' + error.message, 'error');
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-900 to-blue-900 text-white shadow-2xl mb-6">
                    <Rocket className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight mb-4">
                    Thiết lập Auto Pilot
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    Hệ thống đã tự động gom nhóm thang đo của bạn. Hãy chọn đâu là biến phụ thuộc (Kết quả), và hệ thống sẽ tự thiết lập toàn bộ quy trình kiểm định Cronbach, EFA, và mô hình SEM.
                </p>
            </div>

            <div className="bg-white rounded-3xl border border-blue-100 shadow-xl p-8">
                <h3 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-3">
                    <Layers className="w-6 h-6 text-indigo-500" /> Cấu hình Mô hình Nghiên cứu
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Independent Variables */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-700">Các Biến độc lập (IVs)</h4>
                            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Tác động</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[200px] flex flex-col gap-3">
                            {groups.filter(g => g.name !== dependentVar).map(group => (
                                <div key={group.name} className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-black flex items-center justify-center">
                                            {group.name}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{group.name}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">{group.columns.length} items</div>
                                        </div>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dependent Variable */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-700">Biến phụ thuộc (DV)</h4>
                            <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Bị tác động</span>
                        </div>
                        <div className="bg-slate-50 border border-rose-100 rounded-2xl p-4 min-h-[200px]">
                            <select 
                                value={dependentVar || ''}
                                onChange={(e) => setDependentVar(e.target.value)}
                                className="w-full p-4 bg-white border-2 border-rose-200 rounded-xl font-black text-rose-900 outline-none focus:border-rose-400 transition-colors shadow-sm cursor-pointer"
                            >
                                <option value="" disabled>-- Chọn Biến Phụ Thuộc --</option>
                                {groups.map(group => (
                                    <option key={group.name} value={group.name}>
                                        {group.name} ({group.columns.length} items)
                                    </option>
                                ))}
                            </select>

                            <div className="mt-8 flex flex-col items-center justify-center text-slate-400">
                                <Target className="w-12 h-12 mb-3 opacity-20" />
                                <p className="text-xs text-center font-medium max-w-[200px]">
                                    Biến này sẽ chịu tác động từ tất cả các biến độc lập bên trái.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <button
                        onClick={handleRunAutoPilot}
                        disabled={isAnalyzing || !dependentVar}
                        className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl transition-all hover:shadow-blue-900/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>{statusText}</span>
                                </div>
                                <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                                    <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-3">
                                <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                                Bắt đầu Phân tích Toàn diện
                            </div>
                        )}
                    </button>
                    
                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        Quá trình này có thể mất 15-30 giây tùy cấu hình máy tính
                    </div>
                </div>
            </div>
        </div>
    );
}
