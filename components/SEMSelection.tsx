'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Plus, Trash2, ArrowRight, Layers, Workflow, ChevronRight, Target, Settings, Play, Info } from 'lucide-react';

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
        setPaths([...paths, { id: `${independent}->${dependent}`, dependent, independent }]);
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
            if (!structuralMap.has(p.dependent)) structuralMap.set(p.dependent, []);
            structuralMap.get(p.dependent)?.push(p.independent);
        });

        const structural = Array.from(structuralMap.entries())
            .map(([dep, inds]) => `${dep} ~ ${inds.join(' + ')}`)
            .join('\n');

        return `${measurement}\n\n# Structural Model\n${structural}`;
    };

    const handleRun = () => {
        onRunSEM(generateSyntax(), factors);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header / Stepper Area */}
            <div className="flex flex-col items-center text-center mb-10">
                <h2 className="text-2xl font-black text-blue-900 tracking-tight uppercase mb-8">Structural Equation Modeling (SEM)</h2>
                
                <div className="flex justify-center items-center gap-10">
                    <div onClick={() => setStep(1)} className={`flex items-center gap-4 cursor-pointer transition-all ${step === 1 ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black shadow-xl transition-all ${step === 1 ? 'bg-blue-900 text-white shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                            <Layers className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <span className={`text-[9px] font-black uppercase tracking-widest block ${step === 1 ? 'text-blue-600' : 'text-slate-400'}`}>Step 01</span>
                            <span className={`text-sm font-black uppercase tracking-tight ${step === 1 ? 'text-blue-900' : 'text-slate-400'}`}>Measurement Model</span>
                        </div>
                    </div>

                    <div className="h-px w-16 bg-blue-100 rounded-full"></div>

                    <div onClick={() => { if (factors.filter(f => f.indicators.length >= 2).length < 2) return; setStep(2); }}
                        className={`flex items-center gap-4 cursor-pointer transition-all ${step === 2 ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black shadow-xl transition-all ${step === 2 ? 'bg-blue-900 text-white shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                            <Workflow className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <span className={`text-[9px] font-black uppercase tracking-widest block ${step === 2 ? 'text-blue-600' : 'text-slate-400'}`}>Step 02</span>
                            <span className={`text-sm font-black uppercase tracking-tight ${step === 2 ? 'text-blue-900' : 'text-slate-400'}`}>Structural Model</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* STEP 1: FACTOR DEFINITION */}
            {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/30">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-900/40 italic flex items-center gap-2">
                                    <Target className="w-3 h-3" /> Latent Variable List
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {factors.map((factor, idx) => (
                                    <div
                                        key={factor.id}
                                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${editingFactorIndex === idx ? 'border-blue-900 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                                        onClick={() => setEditingFactorIndex(idx)}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <input
                                                type="text"
                                                value={factor.name}
                                                onChange={(e) => {
                                                    const newFactors = [...factors];
                                                    newFactors[idx].name = e.target.value;
                                                    setFactors(newFactors);
                                                }}
                                                className="font-black text-blue-900 bg-transparent border-b border-dashed border-blue-200 focus:border-blue-900 outline-none w-full text-sm py-1 transition-all"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            {factors.length > 1 && (
                                                <button onClick={(e) => { e.stopPropagation(); removeFactor(idx); }} className="text-slate-300 hover:text-red-500 ml-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-blue-600/60 flex items-center gap-1.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${factor.indicators.length >= 2 ? 'bg-blue-600' : 'bg-amber-400'}`}></span>
                                            {factor.indicators.length} indicators
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addFactor} className="w-full py-4 border-2 border-dashed border-blue-100 rounded-xl text-blue-900/40 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-center gap-2 transition-all font-black text-[9px] uppercase tracking-widest">
                                    <Plus className="w-4 h-4" /> Add New Latent
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-xl overflow-hidden h-full">
                            <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/30">
                                <h3 className="text-sm font-black text-blue-900 uppercase">
                                    {editingFactorIndex !== null ? `Indicators for ${factors[editingFactorIndex].name}` : 'Select a factor'}
                                </h3>
                            </div>
                            <div className="p-8">
                                {editingFactorIndex !== null ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[440px] overflow-y-auto pr-2">
                                            {columns.map(col => {
                                                const isSelected = factors[editingFactorIndex].indicators.includes(col);
                                                const isUsedElsewhere = factors.some((f, i) => i !== editingFactorIndex && f.indicators.includes(col));
                                                return (
                                                    <label key={col} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${isSelected ? 'bg-blue-900 border-blue-900 text-white shadow-lg' : isUsedElsewhere ? 'bg-slate-50 border-slate-100 text-slate-300 pointer-events-none opacity-40' : 'bg-white border-blue-50 text-blue-900 hover:border-blue-300'}`}>
                                                        <input type="checkbox" checked={isSelected} onChange={() => toggleIndicator(editingFactorIndex, col)} className="hidden" />
                                                        <div className={`w-3 h-3 rounded-full shrink-0 ${isSelected ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-blue-50 border border-blue-100'}`} />
                                                        <span className="text-[11px] font-black uppercase tracking-tighter truncate" title={col}>{col}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <div className="p-4 bg-blue-50/50 rounded-xl text-[10px] text-blue-800 leading-relaxed font-medium italic flex items-start gap-3">
                                            <Info className="w-4 h-4 shrink-0" />
                                            <span>Một quan sát (indicator) chỉ nên thuộc về một nhân tố duy nhất trong mô hình đo lường.</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-80 text-blue-900/20"><Settings className="w-16 h-16 mb-4 animate-spin-slow" /><p className="font-black uppercase tracking-widest text-xs">Select factor to assign indicators</p></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: STRUCTURAL MODEL */}
            {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-blue-100 shadow-xl bg-white rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/30"><h3 className="text-sm font-black text-blue-900 uppercase">Path Designer</h3></div>
                        <CardContent className="pt-8 space-y-8">
                             <div className="p-4 bg-blue-900 text-white rounded-xl shadow-lg flex items-center gap-5">
                                <Workflow className="w-8 h-8 opacity-50" />
                                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                    Drag the <strong className="text-blue-400 underline">Cause (X)</strong> factor and drop it onto the <strong className="text-blue-400 underline">Effect (Y)</strong> target to create a regression path.
                                </p>
                             </div>

                             <div className="grid grid-cols-2 gap-8">
                                 <div className="space-y-4">
                                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Predictors (Causes)</h4>
                                     <div className="space-y-3">
                                         {factors.map(f => (
                                             <div key={f.id} draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', f.name)}
                                                className="p-5 bg-white border-2 border-blue-50 rounded-2xl shadow-sm cursor-grab hover:border-blue-900 hover:-translate-y-1 transition-all font-black text-blue-900 uppercase tracking-tighter text-sm flex items-center justify-between">
                                                 <span>{f.name}</span>
                                                 <Target className="w-4 h-4 opacity-10" />
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                                 <div className="space-y-4">
                                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Outcome Targets</h4>
                                     <div className="space-y-3">
                                         {factors.map(f => (
                                             <div key={f.id} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const source = e.dataTransfer.getData('text/plain'); if (source) addPath(f.name, source); }}
                                                className="p-5 bg-slate-50 border-2 border-dashed border-blue-100 rounded-2xl shadow-inner cursor-pointer hover:bg-blue-50 hover:border-blue-900 transition-all text-center">
                                                 <p className="font-black text-blue-900 uppercase tracking-tight">{f.name}</p>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-100 shadow-xl bg-white rounded-2xl overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/30"><h3 className="text-sm font-black text-blue-900 uppercase">Structural Pathways</h3></div>
                        <CardContent className="pt-8 flex-1 flex flex-col">
                             <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
                                 {paths.length === 0 ? (
                                     <div className="flex flex-col items-center justify-center py-20 text-blue-900/10"><Workflow className="w-20 h-20 mb-4" /><p className="font-black text-[10px] uppercase tracking-widest">No paths defined yet</p></div>
                                 ) : (
                                     paths.map((p, idx) => (
                                         <div key={idx} className="group flex items-center justify-between p-5 bg-white border border-blue-100 rounded-2xl hover:border-blue-900 transition-all shadow-sm">
                                             <div className="flex items-center gap-4">
                                                 <span className="font-black text-blue-900 uppercase tracking-tighter w-20">{p.independent}</span>
                                                 <div className="flex items-center"><div className="w-10 h-px bg-blue-200"></div><ArrowRight className="w-4 h-4 text-blue-900 -ml-1" /></div>
                                                 <span className="font-black text-blue-600 uppercase tracking-tighter pl-2 italic">{p.dependent}</span>
                                             </div>
                                             <button onClick={() => removePath(idx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                         </div>
                                     ))
                                 )}
                             </div>

                             <div className="mt-8">
                                <div className="p-5 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-2xl shadow-inner h-32 overflow-auto border border-slate-800">
                                     <span className="text-slate-600 uppercase tracking-[0.2em] font-black text-[9px] mb-2 block border-b border-slate-800 pb-1">Lavaan Structural Code</span>
                                     {generateSyntax().split('\n').filter(l => l.includes('~')).map((line, i) => (
                                         <div key={i} className="mb-1">{line}</div>
                                     ))}
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ACTION BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-blue-900 p-8 rounded-3xl shadow-2xl shadow-blue-200 relative overflow-hidden">
                <button onClick={() => step === 1 ? onBack() : setStep(1)} disabled={isAnalyzing} className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all border border-white/10">
                    {step === 1 ? 'Quay lại' : '← Quay về Bước 1'}
                </button>

                {step === 1 ? (
                    <button onClick={() => { if (factors.filter(f => f.indicators.length >= 2).length < 2) return alert("Cần ít nhất 2 nhân tố (mỗi nhân tố >= 2 biến) để chạy SEM."); setStep(2); }}
                        className="px-16 py-4 bg-white text-blue-900 font-black rounded-xl shadow-xl transition-all flex items-center gap-3 active:scale-95 hover:bg-blue-50">
                         <span className="uppercase text-[10px] tracking-widest">Next Step: Structural Design</span>
                         <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button onClick={handleRun} disabled={isAnalyzing || paths.length === 0}
                        className={`px-20 py-4 bg-white text-blue-900 font-black rounded-xl shadow-xl transition-all flex items-center gap-3 active:scale-95 ${isAnalyzing || paths.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`}>
                        {isAnalyzing ? <div className="w-4 h-4 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" /> : <Play className="w-4 h-4" />}
                        <span className="uppercase text-[10px] tracking-widest">{isAnalyzing ? 'Processing SEM...' : 'Start SEM Analysis'}</span>
                    </button>
                )}
            </div>
        </div>
    );
}
