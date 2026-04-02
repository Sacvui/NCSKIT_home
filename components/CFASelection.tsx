'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Plus, Trash2, ArrowRight, Info, Target, Settings, Layers, Play } from 'lucide-react';

interface CFASelectionProps {
    columns: string[]; // Available numeric columns
    onRunCFA: (modelSyntax: string, factors: any[]) => void;
    isAnalyzing: boolean;
    onBack: () => void;
}

interface Factor {
    id: string;
    name: string;
    indicators: string[];
}

export default function CFASelection({ columns, onRunCFA, isAnalyzing, onBack }: CFASelectionProps) {
    const [factors, setFactors] = useState<Factor[]>([
        { id: 'f1', name: 'Factor1', indicators: [] }
    ]);
    const [editingFactorIndex, setEditingFactorIndex] = useState<number | null>(0);

    const addFactor = () => {
        const newId = `f${factors.length + 1}`;
        setFactors([...factors, { id: newId, name: `Factor${factors.length + 1}`, indicators: [] }]);
        setEditingFactorIndex(factors.length);
    };

    const removeFactor = (index: number) => {
        if (factors.length <= 1) return;
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

    const generateSyntax = () => {
        return factors
            .filter(f => f.indicators.length > 0)
            .map(f => `${f.name} =~ ${f.indicators.join(' + ')}`)
            .join('\n');
    };

    const handleRun = () => {
        const validFactors = factors.filter(f => f.indicators.length >= 3);
        const totalIndicators = factors.reduce((sum, f) => sum + f.indicators.length, 0);
        if (validFactors.length < 1) return alert("Vui lòng định nghĩa ít nhất 1 nhân tố với tối thiểu 3 biến quan sát.");
        if (totalIndicators < 4) return alert("CFA cần ít nhất 4 biến quan sát để tính toán chỉ số phù hợp mô hình.");
        if (factors.some(f => !f.name.trim())) return alert("Tên nhân tố không được để trống.");
        onRunCFA(generateSyntax(), factors);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div className="flex flex-col items-center text-center mb-10">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
                    <Layers className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-blue-900 tracking-tight uppercase">CFA Model Builder</h2>
                <p className="text-sm text-slate-500 mt-2 font-medium max-w-sm">Xây dựng mô hình đo lường Confirmatory Factor Analysis bằng cách gán các biến quan sát vào nhân tố tiềm ẩn.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Factors List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-2xl border border-blue-100 shadow-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/30">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-900/40 italic flex items-center gap-2">
                                <Target className="w-3 h-3" /> Measurement Model
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {factors.map((factor, idx) => (
                                <div
                                    key={factor.id}
                                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${editingFactorIndex === idx
                                        ? 'border-blue-900 bg-blue-50/30'
                                        : 'border-slate-100 hover:border-blue-200 bg-white'
                                        }`}
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
                                    <div className="flex items-center justify-between">
                                        <div className="text-[9px] font-black uppercase tracking-tighter text-blue-600/60 flex items-center gap-1.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${factor.indicators.length >= 3 ? 'bg-blue-600' : 'bg-amber-400'}`}></span>
                                            {factor.indicators.length} indicators
                                        </div>
                                        {editingFactorIndex === idx && <ArrowRight className="w-3 h-3 text-blue-900" />}
                                    </div>
                                </div>
                            ))}

                            <button onClick={addFactor} className="w-full py-4 border-2 border-dashed border-blue-100 rounded-xl text-blue-900/40 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-center gap-2 transition-all font-black text-[9px] uppercase tracking-widest">
                                <Plus className="w-4 h-4" /> Thêm nhân tố mới
                            </button>
                        </div>
                    </div>
                </div>

                {/* Indicators Selection */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-blue-100 shadow-xl overflow-hidden h-full">
                        <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/30 flex justify-between items-center">
                            <h3 className="text-sm font-black text-blue-900 uppercase">
                                {editingFactorIndex !== null ? `Biến quan sát: ${factors[editingFactorIndex].name}` : 'Chọn nhân tố'}
                            </h3>
                            {editingFactorIndex !== null && (
                                 <div className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                     {factors[editingFactorIndex].indicators.length} Selected
                                 </div>
                            )}
                        </div>
                        <div className="p-8">
                            {editingFactorIndex !== null ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[440px] overflow-y-auto pr-2 p-1">
                                        {columns.map(col => {
                                            const isSelected = factors[editingFactorIndex].indicators.includes(col);
                                            const isUsedElsewhere = factors.some((f, i) => i !== editingFactorIndex && f.indicators.includes(col));
                                            return (
                                                <label
                                                    key={col}
                                                    className={`
                                                        flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none
                                                        ${isSelected
                                                            ? 'bg-blue-900 border-blue-900 text-white shadow-lg shadow-blue-100'
                                                            : isUsedElsewhere
                                                                ? 'bg-slate-50 border-slate-100 text-slate-300 pointer-events-none opacity-40'
                                                                : 'bg-white border-blue-50 text-blue-900 hover:border-blue-300 hover:bg-blue-50/30'
                                                        }
                                                    `}
                                                >
                                                    <input type="checkbox" checked={isSelected} onChange={() => toggleIndicator(editingFactorIndex, col)} className="hidden" />
                                                    <div className={`w-3 h-3 rounded-full shrink-0 ${isSelected ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-blue-50 border border-blue-100'}`} />
                                                    <span className="text-[11px] font-black uppercase tracking-tighter truncate" title={col}>{col}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 text-[10px] text-blue-800 leading-relaxed font-medium italic flex items-start gap-3">
                                        <Info className="w-4 h-4 shrink-0" />
                                        <span>Các biến bị làm mờ đã được gán cho nhân tố khác. Một biến quan sát chỉ thuộc về một nhân tố trong CFA cơ bản.</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-80 text-blue-900/20">
                                    <Settings className="w-16 h-16 mb-4 animate-spin-slow" />
                                    <p className="font-black uppercase tracking-widest text-xs">Vui lòng chọn nhân tố để bắt đầu gán biến</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-blue-900 p-8 rounded-3xl shadow-2xl shadow-blue-200 mt-12 mb-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                
                <button onClick={onBack} disabled={isAnalyzing} className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all border border-white/10">
                    Quay lại
                </button>

                <div className="flex flex-col items-center sm:items-end">
                    <div className="flex gap-2 mb-2">
                        {factors.map((f, i) => (
                             <div key={i} className={`w-2 h-2 rounded-full ${f.indicators.length >= 3 ? 'bg-blue-400' : 'bg-white/20'}`}></div>
                        ))}
                    </div>
                    <p className="text-[10px] font-black text-white/60 tracking-widest uppercase">
                        {factors.filter(f => f.indicators.length >= 3).length} of {factors.length} factors Ready
                    </p>
                </div>

                <button
                    onClick={handleRun}
                    disabled={isAnalyzing}
                    className={`px-16 py-4 bg-white text-blue-900 font-black rounded-xl shadow-xl transition-all flex items-center gap-3 active:scale-95 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:-translate-y-1'}`}
                >
                    {isAnalyzing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin"></div>
                            <span className="uppercase text-[10px] tracking-widest">Processing...</span>
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4" />
                            <span className="uppercase text-[10px] tracking-[0.2em]">Run CFA Analysis</span>
                        </>
                    )}
                </button>
            </div>

            {/* Syntax Debug */}
            <details className="mt-8 text-[9px] text-slate-400 group cursor-pointer pb-10">
                <summary className="font-black uppercase tracking-[0.3em] hover:text-blue-600 transition-colors list-none flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center"><Plus className="w-2.5 h-2.5 group-open:rotate-45" /></div>
                    LAVAAN syntax preview
                </summary>
                <div className="mt-4 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
                    <pre className="text-emerald-400 font-mono text-[11px] leading-relaxed">
                        {generateSyntax() || "# Define factors to see syntax"}
                    </pre>
                </div>
            </details>
        </div>
    );
}
