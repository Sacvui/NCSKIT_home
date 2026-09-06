'use client';

import React, { useState, useEffect } from 'react';
import { Target, Layers, Play, Rocket, AlertTriangle, CheckCircle2, ChevronLeft, ArrowRight, Lock } from 'lucide-react';
import { runEFA, runPLSSEM, runCronbachAlpha, runBootstrapping, runBlindfolding, runLavaanAnalysis, runLinearRegression, runCorrelation, runTTestIndependent, runOneWayANOVA, runLogisticRegression } from '@/lib/webr-wrapper';
import { AUTO_PILOT_PRESETS, PresetId, AutoPilotPreset } from '@/lib/auto-pilot-presets';

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
    const [bootstrapSamples, setBootstrapSamples] = useState<number>(500);
    const [selectedPreset, setSelectedPreset] = useState<AutoPilotPreset | null>(null);
    const [categoricalCols, setCategoricalCols] = useState<string[]>([]);
    const [compareGroupVar, setCompareGroupVar] = useState<string>('');
    const [compareTestVars, setCompareTestVars] = useState<string[]>([]);

    useEffect(() => {
        // Filter out completely non-numeric columns (like Names, IDs)
        const numericCols = columns.filter(col => {
            const hasNumeric = data.some(row => {
                const val = row[col];
                return val !== null && val !== undefined && val !== '' && val !== 'NA' && !isNaN(Number(val));
            });
            return hasNumeric;
        });

        const autoGroups = autoGroupColumns(numericCols);
        setGroups(autoGroups);
        if (autoGroups.length > 1) {
            // Auto guess initial paths: all others -> last one
            const dv = autoGroups[autoGroups.length - 1].name;
            const ivs = autoGroups.slice(0, -1).map(g => g.name);
            setPaths(ivs.map(iv => ({ from: iv, to: dv })));
        }
        
        // Find categorical columns (small number of unique values)
        const catCols = columns.filter(col => {
            const uniqueVals = new Set(data.map(row => row[col]).filter(v => v !== null && v !== undefined && v !== ''));
            return uniqueVals.size > 1 && uniqueVals.size <= 10; // at least 2 distinct values, max 10
        });
        setCategoricalCols(catCols);
    }, [columns, data]);

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
        if (selectedPreset.requiresPaths && paths.length === 0) {
            showToast('Vui lòng thêm ít nhất 1 giả thuyết (đường dẫn)', 'error');
            return;
        }

        let activeGroups: VariableGroup[] = [];
        if (selectedPreset.id === 'compare') {
            activeGroups = compareTestVars.map(c => groups.find(g => g.name === c)).filter(Boolean) as VariableGroup[];
            if (!compareGroupVar || activeGroups.length === 0) {
                showToast('Vui lòng chọn biến phân nhóm và ít nhất 1 nhóm biến định lượng', 'error');
                return;
            }
        } else if (selectedPreset.id === 'scale') {
            activeGroups = [...groups];
            if (activeGroups.length < 2) {
                showToast('Cần ít nhất 2 nhóm biến để phân tích thang đo', 'error');
                return;
            }
        } else {
            const uniqueConstructs = Array.from(new Set(paths.flatMap(p => [p.from, p.to])));
            activeGroups = uniqueConstructs.map(c => groups.find(g => g.name === c)).filter(Boolean) as VariableGroup[];
            if (activeGroups.length < 2) {
                showToast('Cần ít nhất 2 nhóm biến để chạy mô hình', 'error');
                return;
            }
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

            if (selectedPreset.id === 'pls-sem') {
                // 1. Reliability
                setStatusText('Đang kiểm tra độ tin cậy thang đo (Cronbach Alpha)...');
                setProgress(20);
                for (const group of activeGroups) {
                    const groupIndices = group.columns.map(c => columns.indexOf(c));
                    const groupData = numericData.map(row => groupIndices.map(idx => row[idx]));
                    const res = await runCronbachAlpha(groupData as number[][]);
                    fullReport.cronbach[group.name] = { columns: group.columns, data: res };
                }

                // 2. EFA
                setStatusText('Đang chạy phân tích nhân tố khám phá (EFA)...');
                setProgress(50);
                const allItems = activeGroups.flatMap(g => g.columns);
                const efaIndices = allItems.map(c => columns.indexOf(c));
                const efaData = numericData.map(row => efaIndices.map(idx => row[idx]));
                const expectedFactors = activeGroups.length;
                const efaRes = await runEFA(efaData as number[][], expectedFactors, 'oblimin', 'minres');
                fullReport.efa = { columns: allItems, data: efaRes };

                // 3. SEM
                setStatusText('Đang chạy mô hình cấu trúc tuyến tính (PLS-SEM)...');
                setProgress(70);
                const measurementModel = activeGroups.map(g => ({ 
                    construct: g.name, 
                    items: g.columns.map(c => columns.indexOf(c)) 
                }));
                const structuralModel = paths;
                
                const semRes = await runPLSSEM(numericData as number[][], measurementModel, structuralModel);
                fullReport.sem = semRes;

                // 4. Bootstrapping
                setStatusText(`Đang chạy Bootstrapping (${bootstrapSamples} mẫu) để lấy P-Values...`);
                setProgress(80);
                const bootRes = await runBootstrapping(numericData as number[][], measurementModel, structuralModel, bootstrapSamples);
                if (fullReport.sem) {
                    fullReport.sem.bootstrapping = bootRes;
                }

                // 5. Blindfolding
                setStatusText('Đang chạy Blindfolding để lấy mức độ liên quan dự đoán (Q²)...');
                setProgress(95);
                try {
                    const blindfoldingRes = await runBlindfolding(numericData as number[][], measurementModel, structuralModel);
                    if (fullReport.sem && blindfoldingRes && blindfoldingRes.q2) {
                        let q2Data = blindfoldingRes.q2;
                        if (q2Data && typeof q2Data === 'object' && q2Data['Q²_predict'] && typeof q2Data['Q²_predict'] === 'object') {
                            fullReport.sem.q2 = q2Data['Q²_predict'];
                        } else if (q2Data && typeof q2Data === 'object' && q2Data['Q²_predict']) {
                            fullReport.sem.q2 = q2Data;
                        } else {
                            fullReport.sem.q2 = q2Data["Q2"] || q2Data["Q²"] || q2Data; 
                        }
                    }
                } catch (err: any) {
                    console.warn("Blindfolding error (non-fatal):", err);
                }
            } 
            else if (selectedPreset.id === 'cb-sem') {
                // 1. Reliability
                setStatusText('Đang kiểm tra độ tin cậy thang đo (Cronbach Alpha)...');
                setProgress(20);
                for (const group of activeGroups) {
                    const groupIndices = group.columns.map(c => columns.indexOf(c));
                    const groupData = numericData.map(row => groupIndices.map(idx => row[idx]));
                    const res = await runCronbachAlpha(groupData as number[][]);
                    fullReport.cronbach[group.name] = { columns: group.columns, data: res };
                }

                // 2. CFA
                setStatusText('Đang chạy Phân tích nhân tố khẳng định (CFA)...');
                setProgress(50);
                const cfaModel = activeGroups.map(g => `${g.name} =~ ${g.columns.join(' + ')}`).join('\n');
                const cfaCols = activeGroups.flatMap(g => g.columns);
                const cfaIndices = cfaCols.map(c => columns.indexOf(c));
                const cfaData = numericData.map(row => cfaIndices.map(idx => row[idx]));
                const cfaRes = await runLavaanAnalysis(cfaData as number[][], cfaCols, cfaModel);
                fullReport.cfa = cfaRes;

                // 3. SEM
                setStatusText('Đang chạy Mô hình cấu trúc (CB-SEM)...');
                setProgress(80);
                const semModelLines = [...activeGroups.map(g => `${g.name} =~ ${g.columns.join(' + ')}`)];
                paths.forEach(p => { semModelLines.push(`${p.to} ~ ${p.from}`); });
                const semModel = semModelLines.join('\n');
                const semRes = await runLavaanAnalysis(cfaData as number[][], cfaCols, semModel);
                fullReport.sem = semRes;
            }
            else if (selectedPreset.id === 'regression') {
                // 1. Reliability
                setStatusText('Đang kiểm tra độ tin cậy thang đo (Cronbach Alpha)...');
                setProgress(20);
                for (const group of activeGroups) {
                    const groupIndices = group.columns.map(c => columns.indexOf(c));
                    const groupData = numericData.map(row => groupIndices.map(idx => row[idx]));
                    const res = await runCronbachAlpha(groupData as number[][]);
                    fullReport.cronbach[group.name] = { columns: group.columns, data: res };
                }
                
                // 2. Correlation
                setStatusText('Đang tính toán biến đại diện và Tương quan (Correlation)...');
                setProgress(50);
                const constructScores: Record<string, number[]> = {};
                for (const group of activeGroups) {
                    const groupIndices = group.columns.map(c => columns.indexOf(c));
                    constructScores[group.name] = numericData.map(row => {
                        const vals = groupIndices.map(idx => row[idx]).filter(v => v !== null) as number[];
                        if (vals.length === 0) return 0;
                        return vals.reduce((a, b) => a + b, 0) / vals.length;
                    });
                }
                const constructNames = Object.keys(constructScores);
                const constructData = [];
                for (let i = 0; i < numericData.length; i++) {
                    const row = constructNames.map(name => constructScores[name][i]);
                    constructData.push(row);
                }
                
                const corRes = await runCorrelation(constructData as number[][]);
                fullReport.correlation = {
                    matrix: corRes.correlationMatrix,
                    pValues: corRes.pValues,
                    constructs: constructNames
                };

                // 3. Linear Regression
                setStatusText('Đang chạy Hồi quy đa biến (Linear Regression)...');
                setProgress(80);
                fullReport.regression = [];
                
                const targetVars = Array.from(new Set(paths.map(p => p.to)));
                for (const dv of targetVars) {
                    const ivs = paths.filter(p => p.to === dv).map(p => p.from);
                    if (ivs.length === 0) continue;
                    
                    const regVars = [dv, ...ivs];
                    const regIndices = regVars.map(v => constructNames.indexOf(v));
                    const regData = constructData.map(row => regIndices.map(idx => row[idx]));
                    
                    const regRes = await runLinearRegression(regData as number[][], regVars);
                    fullReport.regression.push({
                        dependent: dv,
                        independents: ivs,
                        result: regRes
                    });
                }
            }
            else if (selectedPreset.id === 'scale') {
                // 1. Reliability
                setStatusText('Đang kiểm tra độ tin cậy thang đo (Cronbach Alpha)...');
                setProgress(20);
                for (const group of activeGroups) {
                    const groupIndices = group.columns.map(c => columns.indexOf(c));
                    const groupData = numericData.map(row => groupIndices.map(idx => row[idx]));
                    const res = await runCronbachAlpha(groupData as number[][]);
                    fullReport.cronbach[group.name] = { columns: group.columns, data: res };
                }

                // 2. EFA
                setStatusText('Đang chạy phân tích nhân tố khám phá (EFA)...');
                setProgress(50);
                const allItems = activeGroups.flatMap(g => g.columns);
                const efaIndices = allItems.map(c => columns.indexOf(c));
                const efaData = numericData.map(row => efaIndices.map(idx => row[idx]));
                const expectedFactors = activeGroups.length;
                const efaRes = await runEFA(efaData as number[][], expectedFactors, 'oblimin', 'minres');
                fullReport.efa = { columns: allItems, data: efaRes };

                // 3. CFA
                setStatusText('Đang chạy Phân tích nhân tố khẳng định (CFA)...');
                setProgress(80);
                const cfaModel = activeGroups.map(g => `${g.name} =~ ${g.columns.join(' + ')}`).join('\n');
                const cfaCols = activeGroups.flatMap(g => g.columns);
                const cfaIndices = cfaCols.map(c => columns.indexOf(c));
                const cfaData = numericData.map(row => cfaIndices.map(idx => row[idx]));
                const cfaRes = await runLavaanAnalysis(cfaData as number[][], cfaCols, cfaModel);
                fullReport.cfa = cfaRes;
            }
            else if (selectedPreset.id === 'compare') {
                setStatusText('Đang xử lý dữ liệu biến phân nhóm...');
                setProgress(20);
                
                const groupVals = data.map(row => row[compareGroupVar]);
                const uniqueGroups = Array.from(new Set(groupVals.filter(v => v !== null && v !== undefined && v !== '')));
                
                if (uniqueGroups.length < 2) {
                    throw new Error('Biến phân nhóm phải có ít nhất 2 nhóm khác biệt.');
                }

                const constructScores: Record<string, number[]> = {};
                for (const group of activeGroups) {
                    const groupIndices = group.columns.map(c => columns.indexOf(c));
                    constructScores[group.name] = numericData.map(row => {
                        const vals = groupIndices.map(idx => row[idx]).filter(v => v !== null) as number[];
                        if (vals.length === 0) return NaN;
                        return vals.reduce((a, b) => a + b, 0) / vals.length;
                    });
                }
                
                fullReport.compare = [];
                setStatusText('Đang chạy kiểm định So sánh Trung bình...');
                setProgress(50);
                
                const isTTest = uniqueGroups.length === 2;
                
                for (const testVar of compareTestVars) {
                    const scores = constructScores[testVar];
                    
                    if (isTTest) {
                        const g1 = uniqueGroups[0];
                        const g2 = uniqueGroups[1];
                        const g1Scores = scores.filter((s, i) => groupVals[i] === g1 && !isNaN(s));
                        const g2Scores = scores.filter((s, i) => groupVals[i] === g2 && !isNaN(s));
                        
                        const tRes = await runTTestIndependent(g1Scores, g2Scores);
                        fullReport.compare.push({
                            testVar,
                            type: 't-test',
                            groups: [g1, g2],
                            result: tRes
                        });
                    } else {
                        const groupArrays: number[][] = uniqueGroups.map(g => 
                            scores.filter((s, i) => groupVals[i] === g && !isNaN(s))
                        );
                        const aRes = await runOneWayANOVA(groupArrays);
                        fullReport.compare.push({
                            testVar,
                            type: 'anova',
                            groups: uniqueGroups,
                            result: aRes
                        });
                    }
                }
                setProgress(90);
            }
            else if (selectedPreset.id === 'logistic') {
                setStatusText('Đang chuẩn bị dữ liệu cho Logistic Regression...');
                setProgress(20);
                
                const constructScores: Record<string, number[]> = {};
                for (const group of activeGroups) {
                    const groupIndices = group.columns.map(c => columns.indexOf(c));
                    constructScores[group.name] = numericData.map(row => {
                        const vals = groupIndices.map(idx => row[idx]).filter(v => v !== null) as number[];
                        if (vals.length === 0) return 0;
                        return vals.reduce((a, b) => a + b, 0) / vals.length;
                    });
                }
                const constructNames = Object.keys(constructScores);
                const constructData = [];
                for (let i = 0; i < numericData.length; i++) {
                    const row = constructNames.map(name => constructScores[name][i]);
                    constructData.push(row);
                }

                setStatusText('Đang chạy Logistic Regression...');
                setProgress(50);
                fullReport.logistic = [];
                
                const targetVars = Array.from(new Set(paths.map(p => p.to)));
                for (const dv of targetVars) {
                    const ivs = paths.filter(p => p.to === dv).map(p => p.from);
                    if (ivs.length === 0) continue;
                    
                    const dvIdx = constructNames.indexOf(dv);
                    const dvScores = constructData.map(r => r[dvIdx]);
                    const uniqueDV = Array.from(new Set(dvScores.filter(v => v !== null && !isNaN(v))));
                    
                    if (uniqueDV.length !== 2) {
                        throw new Error(`Biến phụ thuộc '${dv}' không phải là nhị phân (chỉ có 2 giá trị). Logistic Regression bắt buộc dùng biến nhị phân.`);
                    }
                    
                    const minVal = Math.min(...uniqueDV);
                    const mappedData = constructData.map(r => {
                        const newR = [...r];
                        newR[dvIdx] = newR[dvIdx] === minVal ? 0 : 1;
                        return newR;
                    });
                    
                    const regVars = [dv, ...ivs];
                    const regIndices = regVars.map(v => constructNames.indexOf(v));
                    const regData = mappedData.map(row => regIndices.map(idx => row[idx]));
                    
                    const logRes = await runLogisticRegression(regData as number[][], regVars);
                    fullReport.logistic.push({
                        dependent: dv,
                        independents: ivs,
                        result: logRes
                    });
                }
            }

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

    if (!selectedPreset) {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-900 to-blue-900 text-white shadow-2xl mb-6">
                        <Target className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight mb-4">
                        Chọn Kịch bản Phân tích
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Hệ thống cung cấp các kịch bản chuẩn được thiết kế theo các tạp chí khoa học uy tín (Q1/Q2). Hãy chọn một kịch bản phù hợp với mục tiêu nghiên cứu của bạn.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AUTO_PILOT_PRESETS.map((preset) => (
                        <div 
                            key={preset.id}
                            onClick={() => {
                                if (preset.available) {
                                    setSelectedPreset(preset);
                                    if (preset.bootstrapDefault) setBootstrapSamples(preset.bootstrapDefault);
                                }
                            }}
                            className={`relative rounded-3xl border-2 p-6 transition-all duration-300 ${
                                preset.available 
                                    ? 'bg-white border-slate-100 hover:border-indigo-400 hover:shadow-xl cursor-pointer hover:-translate-y-1' 
                                    : 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
                            }`}
                        >
                            {!preset.available && (
                                <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> Đang phát triển
                                </div>
                            )}
                            {preset.badge && preset.available && (
                                <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                                    {preset.badge}
                                </div>
                            )}
                            
                            <div className={`w-14 h-14 rounded-2xl ${preset.bgColor} ${preset.color} flex items-center justify-center text-2xl mb-6 shadow-sm`}>
                                {preset.icon}
                            </div>
                            
                            <h3 className="text-lg font-black text-slate-800 mb-2">{preset.name}</h3>
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2">
                                {preset.description}
                            </p>
                            
                            <div className="space-y-3">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quy trình tự động:</div>
                                <div className="flex flex-wrap gap-2">
                                    {preset.steps.map((step, idx) => (
                                        <span key={idx} className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                                            {step}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <div className="text-[10px] text-slate-400 font-medium">
                                    📚 Tham chiếu: {preset.references}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
                onClick={() => setSelectedPreset(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm"
            >
                <ChevronLeft className="w-4 h-4" /> Quay lại danh sách kịch bản
            </button>

            <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl ${selectedPreset.bgColor} ${selectedPreset.color} shadow-xl mb-6 text-4xl`}>
                    {selectedPreset.icon}
                </div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-4">
                    {selectedPreset.name}
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    {selectedPreset.description}
                </p>
            </div>

            {selectedPreset.requiresPaths && (
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

                    {/* Bootstrap Sample Size Selector - Only show if required by preset */}
                    {selectedPreset.bootstrapDefault && (
                        <div className="space-y-3 md:col-span-2 mt-2">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-700">Số lượng Bootstrap (Resampling)</h4>
                                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Bootstrapping</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                <div className="grid grid-cols-4 gap-3 mb-4">
                                    {[
                                        { value: 100, label: '100', badge: '⚡ Nhanh', desc: 'Chỉ dùng debug / kiểm tra nhanh', color: 'slate' },
                                        { value: 200, label: '200', badge: '🟡 Tối thiểu', desc: 'Phân tích sơ bộ, chưa đủ cho báo cáo', color: 'amber' },
                                        { value: 500, label: '500', badge: '🟢 Đạt chuẩn', desc: 'Hair et al. (2017) — PLS-SEM', color: 'emerald' },
                                        { value: 1000, label: '1,000', badge: '🟢🟢 Khuyến nghị', desc: 'Efron & Tibshirani (1993)', color: 'blue' },
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setBootstrapSamples(opt.value)}
                                            className={`p-3 rounded-xl border-2 transition-all text-center ${
                                                bootstrapSamples === opt.value
                                                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="text-2xl font-black text-slate-800">{opt.label}</div>
                                            <div className="text-[10px] font-bold mt-1">{opt.badge}</div>
                                            <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{opt.desc}</div>
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-2 text-xs text-slate-500">
                                    <p>
                                        💡 <strong>Vì sao cần Bootstrap?</strong> PLS-SEM không giả định phân phối chuẩn, nên dùng <em>bootstrap resampling</em> để ước lượng sai số chuẩn (SE) và tính p-value cho hệ số đường dẫn (path coefficients).
                                    </p>
                                    <p>
                                        📚 <strong>Cơ sở khoa học:</strong>
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
                                        <li><strong>Hair, Hult, Ringle & Sarstedt (2017)</strong> — <em>&quot;A Primer on Partial Least Squares Structural Equation Modeling (PLS-SEM)&quot;</em>: Khuyến nghị tối thiểu <strong>500 mẫu bootstrap</strong> cho nghiên cứu PLS-SEM chuẩn, 5.000 cho xuất bản.</li>
                                        <li><strong>Efron & Tibshirani (1993)</strong> — <em>&quot;An Introduction to the Bootstrap&quot;</em>: Nền tảng lý thuyết bootstrap, khuyến nghị <strong>1.000+ mẫu</strong> để ước lượng khoảng tin cậy ổn định.</li>
                                        <li><strong>Davison & Hinkley (1997)</strong> — <em>&quot;Bootstrap Methods and their Application&quot;</em>: Xác nhận 1.000 là mức an toàn cho hầu hết ứng dụng thống kê.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {selectedPreset.id === 'compare' && (
                <div className="bg-white rounded-3xl border border-blue-100 shadow-xl p-8">
                    <h3 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-3">
                        <Layers className="w-6 h-6 text-indigo-500" /> Cấu hình So sánh Nhóm
                    </h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-slate-700">1. Chọn Biến Phân Nhóm (Independent Variable)</h4>
                                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Categorical</span>
                            </div>
                            <select 
                                value={compareGroupVar}
                                onChange={(e) => setCompareGroupVar(e.target.value)}
                                className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-400"
                            >
                                <option value="" disabled>-- Chọn Biến Phân Nhóm (Ví dụ: Giới tính, Độ tuổi) --</option>
                                {categoricalCols.map(col => (
                                    <option key={col} value={col}>{col}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-slate-700">2. Chọn Biến Định Lượng (Dependent Variables)</h4>
                                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Numeric Groups</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {groups.map(g => {
                                    const isSelected = compareTestVars.includes(g.name);
                                    return (
                                        <button
                                            key={g.name}
                                            onClick={() => {
                                                if (isSelected) {
                                                    setCompareTestVars(prev => prev.filter(v => v !== g.name));
                                                } else {
                                                    setCompareTestVars(prev => [...prev, g.name]);
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                                                isSelected 
                                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                                            }`}
                                        >
                                            {g.name} ({g.columns.length} items)
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedPreset.id === 'scale' && (
                <div className="bg-white rounded-3xl border border-blue-100 shadow-xl p-8">
                    <h3 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-3">
                        <Layers className="w-6 h-6 text-indigo-500" /> Cấu trúc Thang đo tự động
                    </h3>
                    <p className="text-slate-500 mb-6">
                        Hệ thống đã tự động nhận diện các nhóm biến dưới đây. Quy trình Phát triển thang đo sẽ tự động chạy: Cronbach Alpha ➔ Exploratory Factor Analysis (EFA) ➔ Confirmatory Factor Analysis (CFA) cho toàn bộ các biến này.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {groups.map(g => (
                            <div key={g.name} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="font-black text-indigo-900 mb-1">{g.name}</h4>
                                <p className="text-xs text-slate-500">{g.columns.join(', ')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-blue-100 shadow-xl p-8 mt-8">
                <div className="">
                    <button
                        onClick={handleRunAutoPilot}
                        disabled={
                            isAnalyzing || 
                            (selectedPreset.requiresPaths && paths.length === 0) ||
                            (selectedPreset.id === 'compare' && (!compareGroupVar || compareTestVars.length === 0))
                        }
                        className={`w-full relative overflow-hidden group text-white p-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl transition-all ${isAnalyzing ? 'bg-slate-400' : 'bg-gradient-to-r from-blue-900 to-indigo-900 hover:shadow-blue-900/40 hover:-translate-y-1 active:scale-95'} disabled:opacity-50 disabled:pointer-events-none`}
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
                        {bootstrapSamples >= 1000 ? 'Bootstrap 1000 mẫu — có thể mất 3-10 phút' : bootstrapSamples >= 500 ? 'Có thể mất 1-5 phút tùy cấu hình' : 'Có thể mất 15-60 giây'}
                    </div>
                </div>
            </div>
        </div>
    );
}
