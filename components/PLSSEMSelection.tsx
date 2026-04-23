'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Plus, Trash2, ArrowRight, Layers, Workflow, Play, Info, ShieldCheck, Target } from 'lucide-react';

interface PLSSEMSelectionProps {
    columns: string[];
    onRunPLS: (measurementModel: any[], structuralModel: any[], options: any) => void;
    isAnalyzing: boolean;
    onBack: () => void;
}

interface Factor {
    id: string;
    name: string;
    indicators: string[];
}

interface Path {
    id: string;
    from: string;
    to: string;
}

export default function PLSSEMSelection({ columns, onRunPLS, isAnalyzing, onBack }: PLSSEMSelectionProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [factors, setFactors] = useState<Factor[]>([
        { id: 'f1', name: 'CONSTRUCT_A', indicators: [] },
        { id: 'f2', name: 'CONSTRUCT_B', indicators: [] }
    ]);
    const [editingFactorIndex, setEditingFactorIndex] = useState<number | null>(0);
    const [paths, setPaths] = useState<Path[]>([]);
    
    // PLS specific options
    const [useBootstrap, setUseBootstrap] = useState(true);
    const [useBlindfolding, setUseBlindfolding] = useState(false);

    const addFactor = () => {
        const newId = `f${factors.length + 1}`;
        setFactors([...factors, { id: newId, name: `CONSTRUCT_${factors.length + 1}`, indicators: [] }]);
        setEditingFactorIndex(factors.length);
    };

    const removeFactor = (index: number) => {
        if (factors.length <= 1) return;
        const name = factors[index].name;
        setPaths(paths.filter(p => p.from !== name && p.to !== name));
        const newFactors = [...factors];
        newFactors.splice(index, 1);
        setFactors(newFactors);
        setEditingFactorIndex(null);
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

    const addPath = (from: string, to: string) => {
        if (from === to) return;
        if (paths.some(p => p.from === from && p.to === to)) return;
        setPaths([...paths, { id: `${from}->${to}`, from, to }]);
    };

    const removePath = (index: number) => {
        const newPaths = [...paths];
        newPaths.splice(index, 1);
        setPaths(newPaths);
    };

    const handleRun = () => {
        const measurementModel = factors
            .filter(f => f.indicators.length > 0)
            .map(f => ({
                construct: f.name,
                items: f.indicators.map(ind => columns.indexOf(ind))
            }));
            
        const structuralModel = paths.map(p => ({
            from: p.from,
            to: p.to
        }));

        onRunPLS(measurementModel, structuralModel, { useBootstrap, useBlindfolding });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header / Stepper Area */}
            <div className="flex flex-col items-center text-center mb-10">
                <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-blue-100">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-blue-900 tracking-tight uppercase mb-2">Partial Least Squares (PLS-SEM)</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 italic">SmartPLS Analysis Protocol</p>
                
                <div className="flex justify-center items-center gap-10">
                    <div onClick={() => setStep(1)} className={`flex items-center gap-4 cursor-pointer transition-all ${step === 1 ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black shadow-xl transition-all ${step === 1 ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <Layers className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <span className={`text-[9px] font-black uppercase tracking-widest block ${step === 1 ? 'text-blue-600' : 'text-slate-400'}`}>Step 01</span>
                            <span className={`text-sm font-black uppercase tracking-tight ${step === 1 ? 'text-blue-900' : 'text-slate-400'}`}>Measurement</span>
                        </div>
                    </div>

                    <div className="h-px w-16 bg-blue-100 rounded-full"></div>

                    <div onClick={() => { if (factors.filter(f => f.indicators.length >= 2).length < 2) return; setStep(2); }}
                        className={`flex items-center gap-4 cursor-pointer transition-all ${step === 2 ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black shadow-xl transition-all ${step === 2 ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <Workflow className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <span className={`text-[9px] font-black uppercase tracking-widest block ${step === 2 ? 'text-blue-600' : 'text-slate-400'}`}>Step 02</span>
                            <span className={`text-sm font-black uppercase tracking-tight ${step === 2 ? 'text-blue-900' : 'text-slate-400'}`}>Structural</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* STEP 1: MEASUREMENT MODEL */}
            {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/30 flex justify-between items-center">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-900/60 flex items-center gap-2">
                                    <Target className="w-3 h-3" /> Constructs
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
                                                    newFactors[idx].name = e.target.value.toUpperCase();
                                                    setFactors(newFactors);
                                                }}
                                                className="font-black text-blue-900 bg-transparent border-b border-dashed border-blue-200 focus:border-blue-900 outline-none w-full text-sm py-1 transition-all"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            {factors.length > 1 && (
                                                <button onClick={(e) => { e.stopPropagation(); removeFactor(idx); }} className="text-slate-300 hover:text-rose-500 ml-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-blue-600/60 flex items-center gap-1.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${factor.indicators.length >= 2 ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                                            {factor.indicators.length} items
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addFactor} className="w-full py-4 border-2 border-dashed border-blue-100 rounded-xl text-blue-900/40 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-center gap-2 transition-all font-black text-[9px] uppercase tracking-widest">
                                    <Plus className="w-4 h-4" /> Add Construct
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-xl overflow-hidden h-full">
                            <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/30">
                                <h3 className="text-sm font-black text-blue-900 uppercase">
                                    {editingFactorIndex !== null ? `Indicators for ${factors[editingFactorIndex].name}` : 'Select a construct'}
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
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-80 text-blue-900/20"><Layers className="w-16 h-16 mb-4 animate-pulse" /><p className="font-black uppercase tracking-widest text-xs">Select construct to assign indicators</p></div>
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
                        <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/30"><h3 className="text-sm font-black text-blue-900 uppercase">Structural Relationships</h3></div>
                        <CardContent className="pt-8 space-y-8">
                             <div className="grid grid-cols-2 gap-8">
                                 <div className="space-y-4">
                                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Predictors (From)</h4>
                                     <div className="space-y-3">
                                         {factors.map(f => (
                                             <div key={f.id} draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', f.name)}
                                                className="p-4 bg-white border-2 border-blue-50 rounded-xl shadow-sm cursor-grab hover:border-blue-900 hover:-translate-y-0.5 transition-all font-black text-blue-900 uppercase tracking-tighter text-sm flex items-center justify-between group">
                                                 <span>{f.name}</span>
                                                 <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-blue-600" />
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                                 <div className="space-y-4">
                                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Outcome Targets (To)</h4>
                                     <div className="space-y-3">
                                         {factors.map(f => (
                                             <div key={f.id} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const source = e.dataTransfer.getData('text/plain'); if (source) addPath(source, f.name); }}
                                                className="p-4 bg-slate-50 border-2 border-dashed border-blue-100 rounded-xl shadow-inner cursor-pointer hover:bg-blue-50 hover:border-blue-900 transition-all text-center">
                                                 <p className="font-black text-blue-900 uppercase tracking-tight">{f.name}</p>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>

                             {/* Analysis Options */}
                             <div className="pt-6 border-t border-slate-100 space-y-4">
                                 <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Advanced Settings</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <label className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-50 transition-all">
                                         <input type="checkbox" checked={useBootstrap} onChange={e => setUseBootstrap(e.target.checked)} className="w-5 h-5 rounded border-blue-200 text-blue-900" />
                                         <div className="flex flex-col">
                                            <span className="text-xs font-black text-blue-900 uppercase">Run Bootstrapping</span>
                                            <span className="text-[9px] text-blue-600 font-bold uppercase">(5000 samples for P-values)</span>
                                         </div>
                                     </label>
                                     <label className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-50 transition-all">
                                         <input type="checkbox" checked={useBlindfolding} onChange={e => setUseBlindfolding(e.target.checked)} className="w-5 h-5 rounded border-blue-200 text-blue-900" />
                                         <div className="flex flex-col">
                                            <span className="text-xs font-black text-blue-900 uppercase">Run Blindfolding</span>
                                            <span className="text-[9px] text-blue-600 font-bold uppercase">(Calculate Q² predictive relevance)</span>
                                         </div>
                                     </label>
                                 </div>
                             </div>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-100 shadow-xl bg-white rounded-2xl overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/30"><h3 className="text-sm font-black text-blue-900 uppercase">Defined Paths</h3></div>
                        <CardContent className="pt-8 flex-1 flex flex-col">
                             <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px]">
                                 {paths.length === 0 ? (
                                     <div className="flex flex-col items-center justify-center py-20 text-blue-900/10"><Workflow className="w-16 h-16 mb-4" /><p className="font-black text-[9px] uppercase tracking-[0.2em]">Drag constructs to define paths</p></div>
                                 ) : (
                                     paths.map((p, idx) => (
                                         <div key={idx} className="group flex items-center justify-between p-4 bg-white border border-blue-100 rounded-xl hover:border-blue-900 transition-all shadow-sm">
                                             <div className="flex items-center gap-4">
                                                 <span className="font-black text-blue-900 uppercase tracking-tight text-xs w-24 truncate">{p.from}</span>
                                                 <ArrowRight className="w-4 h-4 text-blue-400" />
                                                 <span className="font-black text-blue-600 uppercase tracking-tight text-xs pl-2 italic w-24 truncate">{p.to}</span>
                                             </div>
                                             <button onClick={() => removePath(idx)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                         </div>
                                     ))
                                 )}
                             </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ACTION BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-blue-900 p-8 rounded-3xl shadow-2xl shadow-blue-200 relative overflow-hidden">
                <button onClick={() => step === 1 ? onBack() : setStep(1)} disabled={isAnalyzing} className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all border border-white/10">
                    {step === 1 ? 'Quay lại' : '← Back to Measurement'}
                </button>

                {step === 1 ? (
                    <button onClick={() => { if (factors.filter(f => f.indicators.length >= 2).length < 2) return alert("Cần ít nhất 2 nhân tố (mỗi nhân tố >= 2 biến) để chạy PLS."); setStep(2); }}
                        className="px-16 py-4 bg-white text-blue-900 font-black rounded-xl shadow-xl transition-all flex items-center gap-3 active:scale-95 hover:bg-blue-50">
                         <span className="uppercase text-[10px] tracking-widest">Next: Structural Model</span>
                         <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button onClick={handleRun} disabled={isAnalyzing || paths.length === 0}
                        className={`px-20 py-4 bg-white text-blue-900 font-black rounded-xl shadow-xl transition-all flex items-center gap-3 active:scale-95 ${isAnalyzing || paths.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`}>
                        {isAnalyzing ? <div className="w-4 h-4 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" /> : <Play className="w-4 h-4 shadow-xl" />}
                        <span className="uppercase text-[10px] tracking-widest">{isAnalyzing ? 'Running PLS...' : 'Execute PLS Analysis'}</span>
                    </button>
                )}
            </div>
        </div>
    );
}
