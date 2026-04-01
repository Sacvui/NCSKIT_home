
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Plus, Trash2, ArrowRight, Layers, Workflow, ChevronRight } from 'lucide-react';

interface SEMSelectionProps {
    columns: string[];
    onRunSEM: (modelSyntax: string, factors: any[]) => void;
    isAnalyzing: boolean;
    onBack: () => void;
}

interface Factor {
    id: string;
    name: string;
    indicators: string[];
}

interface RegressionPath {
    id: string;
    dependent: string; // The effect (Y)
    independent: string; // The cause (X)
}

export default function SEMSelection({ columns, onRunSEM, isAnalyzing, onBack }: SEMSelectionProps) {
    const [step, setStep] = useState<1 | 2>(1); // 1: Define Factors, 2: Define Structural Model

    // --- Step 1 State: Factors ---
    const [factors, setFactors] = useState<Factor[]>([
        { id: 'f1', name: 'SAT', indicators: [] },
        { id: 'f2', name: 'LOY', indicators: [] }
    ]);
    const [editingFactorIndex, setEditingFactorIndex] = useState<number | null>(0);

    // --- Step 2 State: Paths ---
    const [paths, setPaths] = useState<RegressionPath[]>([]);

    // --- Step 1 Handlers ---
    const addFactor = () => {
        const newId = `f${factors.length + 1}`;
        setFactors([...factors, { id: newId, name: `Factor${factors.length + 1}`, indicators: [] }]);
        setEditingFactorIndex(factors.length);
    };

    const removeFactor = (index: number) => {
        if (factors.length <= 1) return;
        const factorName = factors[index].name;
        setPaths(paths.filter(p => p.dependent !== factorName && p.independent !== factorName));

        const newFactors = [...factors];
        newFactors.splice(index, 1);
        setFactors(newFactors);
        if (editingFactorIndex === index) setEditingFactorIndex(null);
    };

    const toggleIndicator = (factorIndex: number, col: string) => {
        const newFactors = [...factors];
        const factor = newFactors[factorIndex];
        if (factor.indicators.includes(col)) {
            factor.indicators = factor.indicators.filter(i => i !== col);
        } else {
            factor.indicators.push(col);
        }
        setFactors(newFactors);
    };

    // --- Step 2 Handlers ---
    const addPath = (dependent: string, independent: string) => {
        if (dependent === independent) return;
        if (paths.some(p => p.dependent === dependent && p.independent === independent)) return;

        setPaths([...paths, {
            id: `${independent}->${dependent}`,
            dependent,
            independent
        }]);
    };

    const removePath = (index: number) => {
        const newPaths = [...paths];
        newPaths.splice(index, 1);
        setPaths(newPaths);
    };

    // --- Generator ---
    const generateSyntax = () => {
        const measurement = factors
            .filter(f => f.indicators.length > 0)
            .map(f => `${f.name} =~ ${f.indicators.join(' + ')}`)
            .join('\n');

        const structuralMap = new Map<string, string[]>();
        paths.forEach(p => {
            if (!structuralMap.has(p.dependent)) {
                structuralMap.set(p.dependent, []);
            }
            structuralMap.get(p.dependent)?.push(p.independent);
        });

        const structural = Array.from(structuralMap.entries())
            .map(([dep, inds]) => `${dep} ~ ${inds.join(' + ')}`)
            .join('\n');

        return `${measurement}\n\n# Structural Model\n${structural}`;
    };

    const handleRun = () => {
        const syntax = generateSyntax();
        onRunSEM(syntax, factors);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 font-sans">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-6 tracking-tight uppercase">
                    SEM Model Builder
                </h2>
                
                <div className="flex justify-center items-center gap-10">
                    <div 
                        onClick={() => setStep(1)}
                        className={`flex items-center gap-4 cursor-pointer transition-all ${step === 1 ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                    >
                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-sm transition-all shadow-xl rotate-3 ${step === 1 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>
                            <Layers className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <span className={`text-[10px] font-black uppercase tracking-widest block ${step === 1 ? 'text-indigo-600' : 'text-slate-400'}`}>BƯỚC 1</span>
                            <span className={`text-sm font-black uppercase tracking-tight ${step === 1 ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>Định nghĩa Nhân tố</span>
                        </div>
                    </div>

                    <div className="h-0.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full"></div>

                    <div 
                        onClick={() => {
                            if (factors.filter(f => f.indicators.length >= 2).length < 2) return;
                            setStep(2);
                        }}
                        className={`flex items-center gap-4 cursor-pointer transition-all ${step === 2 ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                    >
                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-sm transition-all shadow-xl -rotate-3 ${step === 2 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>
                            <Workflow className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <span className={`text-[10px] font-black uppercase tracking-widest block ${step === 2 ? 'text-indigo-600' : 'text-slate-400'}`}>BƯỚC 2</span>
                            <span className={`text-sm font-black uppercase tracking-tight ${step === 2 ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>Mô hình Cấu trúc</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* STEP 1: FACTOR DEFINITION */}
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-4">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                            <CardHeader className="pb-4 border-b border-slate-50 dark:border-slate-800">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Factor List</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    {factors.map((factor, idx) => (
                                        <div
                                            key={factor.id}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform ${editingFactorIndex === idx ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500 shadow-xl scale-[1.03]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-300 shadow-sm'}`}
                                            onClick={() => setEditingFactorIndex(idx)}
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <input
                                                    type="text"
                                                    value={factor.name}
                                                    onChange={(e) => {
                                                        const newFactors = [...factors];
                                                        newFactors[idx].name = e.target.value;
                                                        setFactors(newFactors);
                                                    }}
                                                    className="font-black text-slate-900 dark:text-slate-100 bg-transparent border-b-2 border-dashed border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none w-full text-sm py-1 transition-colors"
                                                    placeholder="Tên nhân tố"
                                                />
                                                {factors.length > 1 && (
                                                    <button onClick={() => removeFactor(idx)} className="text-slate-300 hover:text-red-500 transition-colors ml-2"><Trash2 className="w-4 h-4" /></button>
                                                )}
                                            </div>
                                            <div className="text-[10px] uppercase font-black tracking-widest text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 rounded-full ${factor.indicators.length >= 2 ? 'bg-indigo-500' : 'bg-slate-300'}`}></span>
                                                {factor.indicators.length} indicators
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={addFactor} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" /> Add Factor
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
                            <CardHeader className="pb-4 border-b border-slate-50 dark:border-slate-800">
                                <CardTitle className="text-slate-900 dark:text-slate-100 font-black">
                                    {editingFactorIndex !== null ? `Items for ${factors[editingFactorIndex].name}` : 'Select a factor'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 pb-8">
                                {editingFactorIndex !== null ? (
                                    <div className="h-[480px] overflow-y-auto pr-3 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-5 bg-slate-50 dark:bg-slate-950/30 shadow-inner grid grid-cols-2 lg:grid-cols-3 gap-3">
                                        {columns.map(col => {
                                            const isSelected = factors[editingFactorIndex].indicators.includes(col);
                                            const isUsedElsewhere = factors.some((f, i) => i !== editingFactorIndex && f.indicators.includes(col));
                                            return (
                                                <label key={col} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer select-none transition-all transform ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-[1.02] font-black' : isUsedElsewhere ? 'bg-slate-100/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 text-slate-400 grayscale opacity-60' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 shadow-sm font-bold'}`}>
                                                    <input type="checkbox" checked={isSelected} onChange={() => toggleIndicator(editingFactorIndex, col)} className="hidden" />
                                                    <div className={`w-3 h-3 rounded-full shrink-0 ${isSelected ? 'bg-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                                    <span className="text-[11px] truncate uppercase tracking-tighter" title={col}>{col}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-80 text-slate-300 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                                        <ArrowRight className="w-16 h-16 mb-4 opacity-20" />
                                        <p className="font-black uppercase tracking-widest text-xs">Select factor on the left</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* STEP 2: STRUCTURAL MODEL */}
            {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
                        <CardHeader className="pb-4 border-b border-slate-50 dark:border-slate-800"><CardTitle className="text-slate-900 dark:text-slate-100 font-black">Path Configuration</CardTitle></CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-8">
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl border-2 border-dashed border-indigo-100 dark:border-indigo-800 flex items-center gap-5">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center animate-bounce">
                                        <ArrowRight className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-900 dark:text-indigo-200 leading-relaxed">
                                        Drag <strong className="text-indigo-700 underline underline-offset-4">Source Factor (X)</strong> and drop it onto the <strong className="text-indigo-700 underline underline-offset-4">Target Factor (Y)</strong> box.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                            Independent (X)
                                        </h4>
                                        <div className="space-y-2.5">
                                            {factors.map(f => (
                                                <div key={f.id} draggable className="p-5 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg cursor-grab hover:border-indigo-500 transform hover:-translate-y-1 transition-all font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter text-sm flex items-center justify-between"
                                                    onDragStart={(e) => e.dataTransfer.setData('text/plain', f.name)}>
                                                    <span>{f.name}</span>
                                                    <div className="w-2 h-2 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                            Dependent (Y)
                                        </h4>
                                        <div className="space-y-4">
                                            {factors.map(f => (
                                                <div key={f.id}
                                                    className="relative group p-6 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-indigo-400 transition-all shadow-inner"
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        const source = e.dataTransfer.getData('text/plain');
                                                        if (source) addPath(f.name, source);
                                                    }}
                                                >
                                                    <p className="font-black text-xs text-slate-300 dark:text-slate-600 mb-1 group-hover:text-indigo-400 uppercase tracking-widest">Target Box</p>
                                                    <p className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">{f.name}</p>
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="pb-4 border-b border-slate-50 dark:border-slate-800"><CardTitle className="text-slate-900 dark:text-slate-100 font-black">Active Relationships</CardTitle></CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3 min-h-[350px]">
                                {paths.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-slate-300 dark:text-slate-700">
                                        <Workflow className="w-20 h-20 mb-6 opacity-10" />
                                        <p className="font-black text-[10px] uppercase tracking-[0.3em]">No paths defined yet</p>
                                    </div>
                                ) : (
                                    paths.map((p, idx) => (
                                        <div key={idx} className="group flex items-center justify-between p-5 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 border-l-indigo-600 dark:border-l-indigo-500 rounded-2xl shadow-sm transition-all hover:shadow-xl hover:translate-x-1">
                                            <div className="flex items-center gap-6">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-[10px] text-slate-500">{idx + 1}</div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">{p.independent}</span>
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-[2px] bg-indigo-600"></div>
                                                        <ArrowRight className="w-5 h-5 text-indigo-600 -ml-1" />
                                                    </div>
                                                    <span className="font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-tighter">{p.dependent}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => removePath(idx)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-slate-100 dark:border-slate-700">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-10 relative">
                                <div className="absolute top-0 right-4 px-3 py-1 bg-emerald-500 text-white rounded-b-lg font-black text-[9px] uppercase tracking-widest shadow-lg shadow-emerald-200">Syntax Live</div>
                                <div className="p-6 bg-slate-950 dark:bg-black text-emerald-400 text-[11px] font-mono rounded-3xl border border-slate-800 shadow-2xl h-44 overflow-auto scrollbar-hide">
                                    <div className="mb-4 text-slate-600 font-black uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
                                        Lavaan Model Preview
                                    </div>
                                    {generateSyntax().split('\n').map((line, i) => (
                                        <div key={i} className="mb-1 opacity-90 hover:opacity-100 hover:translate-x-1 transition-all">
                                            <span className="text-slate-700 mr-4 select-none">{(i + 1).toString().padStart(2, '0')}</span>
                                            {line}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ACTION BAR */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 mt-12 mb-10">
                <button
                    onClick={() => step === 1 ? onBack() : setStep(1)}
                    className="w-full sm:w-auto px-10 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black uppercase text-[10px] tracking-[.2em] rounded-2xl transition-all"
                    disabled={isAnalyzing}
                >
                    {step === 1 ? 'QUAY LẠI' : '← QUAY VỀ BƯỚC 1'}
                </button>

                <div className="hidden lg:block">
                     <span className="px-5 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-full text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">
                        SEM BUILDER ELITE
                     </span>
                </div>

                {step === 1 ? (
                    <button
                        onClick={() => {
                            if (factors.filter(f => f.indicators.length >= 2).length < 2) {
                                alert("Cần ít nhất 2 nhân tố (mỗi nhân tố >= 2 biến) để chạy SEM.");
                                return;
                            }
                            setStep(2);
                        }}
                        className="w-full sm:w-auto px-16 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-2xl hover:shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                    >
                         <span className="uppercase text-xs tracking-widest">TIẾP TỤC: XÂY DỰNG MÔ HÌNH</span>
                         <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                ) : (
                    <button
                        onClick={handleRun}
                        disabled={isAnalyzing || paths.length === 0}
                        className={`w-full sm:w-auto px-20 py-4 font-black rounded-2xl shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-4 ${isAnalyzing || paths.length === 0 ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-1'}`}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span className="uppercase text-xs tracking-widest">ĐANG PHÂN TÍCH...</span>
                            </>
                        ) : (
                            <>
                                <span className="uppercase text-xs tracking-[0.2em]">BẮT ĐẦU CHẠY SEM</span>
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
