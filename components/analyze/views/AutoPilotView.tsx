'use client';

import React, { useState, useEffect } from 'react';
import { Target, Layers, Play, Rocket, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { runEFA, runPLSSEM, runCronbachAlpha } from '@/lib/webr-wrapper';

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
    const [paths, setPaths] = useState<{from: string, to: string}[]>([]);
    const [newPathFrom, setNewPathFrom] = useState<string>('');
    const [newPathTo, setNewPathTo] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('');

    useEffect(() => {
        const autoGroups = autoGroupColumns(columns);
        setGroups(autoGroups);
        if (autoGroups.length > 1) {
            // Auto guess initial paths: all others -> last one
            const dv = autoGroups[autoGroups.length - 1].name;
            const ivs = autoGroups.slice(0, -1).map(g => g.name);
            setPaths(ivs.map(iv => ({ from: iv, to: dv })));
        }
    }, [columns]);

    const handleAddPath = () => {
        if (!newPathFrom || !newPathTo) {
            showToast('Vui lòng chọn cả hai biến', 'error');
            return;
        }
        if (newPathFrom === newPathTo) {
            showToast('Biến tác động và bị tác động không thể trùng nhau', 'error');
            return;
        }
        if (paths.some(p => p.from === newPathFrom && p.to === newPathTo)) {
            showToast('Đường dẫn này đã tồn tại', 'error');
            return;
        }
        setPaths([...paths, { from: newPathFrom, to: newPathTo }]);
        setNewPathFrom('');
        setNewPathTo('');
    };

    const handleRemovePath = (index: number) => {
        setPaths(paths.filter((_, i) => i !== index));
    };

    const handleRunAutoPilot = async () => {
        if (paths.length === 0) {
            showToast('Vui lòng thêm ít nhất 1 giả thuyết (đường dẫn)', 'error');
            return;
        }

        const uniqueConstructs = Array.from(new Set(paths.flatMap(p => [p.from, p.to])));
        const activeGroups = uniqueConstructs.map(c => groups.find(g => g.name === c)).filter(Boolean) as VariableGroup[];

        if (activeGroups.length < 2) {
            showToast('Cần ít nhất 2 biến để chạy mô hình', 'error');
            return;
        }

        setIsAnalyzing(true);
        setAnalysisType('auto-pilot');
        try {
            // Chuẩn hóa dữ liệu: Chuyển chuỗi rỗng/NA thành null để R hiểu là missing data (NA)
            const numericData = data.map(row => columns.map(col => {
                const val = row[col];
                if (val === null || val === undefined || val === '' || val === 'NA') return null;
                const num = Number(val);
                return isNaN(num) ? null : num;
            }));
            const fullReport: any = {
                model: {
                    paths: paths,
                    constructs: activeGroups.map(g => g.name)
                },
                cronbach: {},
                efa: null,
                sem: null
            };

            // 1. Reliability
            setStatusText('Đang kiểm tra độ tin cậy thang đo (Cronbach Alpha)...');
            setProgress(20);
            for (const group of activeGroups) {
                const groupIndices = group.columns.map(c => columns.indexOf(c));
                const groupData = numericData.map(row => groupIndices.map(idx => row[idx]));
                const res = await runCronbachAlpha(groupData);
                fullReport.cronbach[group.name] = { columns: group.columns, data: res };
            }

            // 2. EFA
            setStatusText('Đang chạy phân tích nhân tố khám phá (EFA)...');
            setProgress(50);
            const allItems = activeGroups.flatMap(g => g.columns);
            const efaIndices = allItems.map(c => columns.indexOf(c));
            const efaData = numericData.map(row => efaIndices.map(idx => row[idx]));
            const expectedFactors = activeGroups.length;
            const efaRes = await runEFA(efaData, expectedFactors, 'oblimin', 'minres');
            fullReport.efa = { columns: allItems, data: efaRes };

            // 3. SEM
            setStatusText('Đang chạy mô hình cấu trúc tuyến tính (PLS-SEM)...');
            setProgress(80);
            const measurementModel = activeGroups.map(g => ({ 
                construct: g.name, 
                items: g.columns.map(c => columns.indexOf(c)) 
            }));
            const structuralModel = paths;
            
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
                    {/* Path Builder */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-700">Thiết lập Giả thuyết (Đường dẫn)</h4>
                            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Path Builder</span>
                        </div>
                        
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                                <select 
                                    value={newPathFrom}
                                    onChange={(e) => setNewPathFrom(e.target.value)}
                                    className="flex-1 p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-400"
                                >
                                    <option value="" disabled>-- Biến Tác Động --</option>
                                    {groups.map(g => (
                                        <option key={g.name} value={g.name}>{g.name} ({g.columns.length} items)</option>
                                    ))}
                                </select>
                                
                                <div className="text-slate-400 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                </div>

                                <select 
                                    value={newPathTo}
                                    onChange={(e) => setNewPathTo(e.target.value)}
                                    className="flex-1 p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-400"
                                >
                                    <option value="" disabled>-- Biến Bị Tác Động --</option>
                                    {groups.map(g => (
                                        <option key={g.name} value={g.name}>{g.name} ({g.columns.length} items)</option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleAddPath}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shrink-0"
                                >
                                    Thêm
                                </button>
                            </div>

                            <div className="space-y-3">
                                {paths.length === 0 ? (
                                    <div className="text-center text-slate-400 text-sm py-4 italic">
                                        Chưa có giả thuyết nào. Hãy thêm đường dẫn ở trên.
                                    </div>
                                ) : (
                                    paths.map((path, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 font-black flex items-center justify-center shrink-0">
                                                    H{idx + 1}
                                                </div>
                                                <div className="flex items-center gap-3 font-bold text-slate-700 text-lg">
                                                    <span>{path.from}</span>
                                                    <span className="text-slate-300">→</span>
                                                    <span>{path.to}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleRemovePath(idx)}
                                                className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <button
                        onClick={handleRunAutoPilot}
                        disabled={isAnalyzing || paths.length === 0}
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
