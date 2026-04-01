import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Plus, Trash2, ArrowRight, Info } from 'lucide-react';

interface HTMTSelectionProps {
    columns: string[];
    onRunHTMT: (factorStructure: { name: string; items: number[] }[], threshold: number) => void;
    isAnalyzing: boolean;
    onBack: () => void;
}

interface Factor {
    id: string;
    name: string;
    indicators: string[];
}

export default function HTMTSelection({ columns, onRunHTMT, isAnalyzing, onBack }: HTMTSelectionProps) {
    const [factors, setFactors] = useState<Factor[]>([
        { id: 'f1', name: 'Factor1', indicators: [] },
        { id: 'f2', name: 'Factor2', indicators: [] }
    ]);
    const [threshold, setThreshold] = useState<number>(0.85);
    const [editingFactorIndex, setEditingFactorIndex] = useState<number | null>(0);

    const addFactor = () => {
        const newId = `f${factors.length + 1}`;
        setFactors([...factors, { id: newId, name: `Factor${factors.length + 1}`, indicators: [] }]);
        setEditingFactorIndex(factors.length);
    };

    const removeFactor = (index: number) => {
        if (factors.length <= 2) {
            alert('HTMT cần ít nhất 2 factors để so sánh!');
            return;
        }
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
            // Remove from other factors (HTMT requires distinct factors)
            newFactors.forEach((f, i) => {
                if (i !== factorIndex) {
                    f.indicators = f.indicators.filter(ind => ind !== col);
                }
            });
            factor.indicators.push(col);
        }
        setFactors(newFactors);
    };

    const handleRun = () => {
        const validFactors = factors.filter(f => f.indicators.length >= 2);

        if (validFactors.length < 2) {
            alert('HTMT cần ít nhất 2 factors với mỗi factor có tối thiểu 2 items!');
            return;
        }

        if (factors.some(f => !f.name.trim())) {
            alert('Tên factor không được để trống.');
            return;
        }

        // Convert to format expected by R function
        const factorStructure = validFactors.map(f => ({
            name: f.name,
            items: f.indicators.map(ind => columns.indexOf(ind)) // Convert to column indices
        }));

        onRunHTMT(factorStructure, threshold);
    };

    const usedColumns = new Set(factors.flatMap(f => f.indicators));

    return (
        <div className="max-w-4xl mx-auto space-y-6 font-sans">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight uppercase">
                    HTMT Matrix Selection
                </h2>
                <div className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-full border border-indigo-200 dark:border-indigo-800">
                    <p className="text-indigo-700 dark:text-indigo-300 font-black uppercase text-[10px] tracking-[0.2em]">
                        Discriminant Validity Analysis (Tính phân biệt)
                    </p>
                </div>
            </div>

            {/* Threshold Selector */}
            <Card className="border-2 border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 border-b border-slate-50 dark:border-slate-800">
                    <CardTitle className="text-indigo-900 dark:text-indigo-300 flex items-center gap-3 text-sm font-black uppercase tracking-widest">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                            <Info className="w-4 h-4 text-indigo-600" />
                        </div>
                        Ngưỡng chấp nhận (HTMT Threshold)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center gap-8">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="threshold"
                                    value="0.85"
                                    checked={threshold === 0.85}
                                    onChange={() => setThreshold(0.85)}
                                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-slate-300 dark:border-slate-700 checked:border-indigo-600 dark:checked:border-indigo-500 transition-all"
                                />
                                <div className="absolute h-3 w-3 rounded-full bg-indigo-600 dark:bg-indigo-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    Strict (&lt; 0.85)
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Khuyên dùng (Gold standard)</span>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="threshold"
                                    value="0.90"
                                    checked={threshold === 0.90}
                                    onChange={() => setThreshold(0.90)}
                                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-slate-300 dark:border-slate-700 checked:border-indigo-600 dark:checked:border-indigo-500 transition-all"
                                />
                                <div className="absolute h-3 w-3 rounded-full bg-indigo-600 dark:bg-indigo-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    Lenient (&lt; 0.90)
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Tiêu chuẩn nới lỏng</span>
                            </div>
                        </label>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Factor List */}
                <div className="md:col-span-1 space-y-4">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Nhân tố nghiên cứu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {factors.map((factor, idx) => (
                                    <div
                                        key={factor.id}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${editingFactorIndex === idx
                                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500 shadow-xl transform scale-[1.02]'
                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm'
                                            }`}
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
                                                className="font-black text-slate-900 dark:text-slate-100 bg-transparent border-b-2 border-dashed border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none w-full text-sm py-1 transition-colors"
                                                placeholder="Tên factor"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            {factors.length > 2 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFactor(idx);
                                                    }}
                                                    className="text-slate-400 hover:text-red-500 transition-colors ml-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="text-[10px] uppercase font-black tracking-widest text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                            {factor.indicators.length} biến quan sát
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={addFactor}
                                    className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 flex items-center justify-center gap-3 transition-all font-black text-[10px] uppercase tracking-widest"
                                >
                                    <Plus className="w-4 h-4" /> Thêm nhân tố mới
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Indicator Selection */}
                <div className="md:col-span-2">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-slate-100 font-black text-lg">
                                {editingFactorIndex !== null
                                    ? `Biến cho ${factors[editingFactorIndex].name}`
                                    : 'Chọn nhân tố'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {editingFactorIndex !== null ? (
                                <div className="space-y-6">
                                    <div className="h-[450px] overflow-y-auto pr-2 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-5 bg-slate-50 dark:bg-slate-950/30 shadow-inner">
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                            {columns.map(col => {
                                                const isSelected = factors[editingFactorIndex].indicators.includes(col);
                                                const isUsedElsewhere = factors.some((f, i) => i !== editingFactorIndex && f.indicators.includes(col));

                                                return (
                                                    <label
                                                        key={col}
                                                        className={`
                                                            flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer select-none transition-all
                                                            ${isSelected
                                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none transform scale-[1.02]'
                                                                : isUsedElsewhere
                                                                    ? 'bg-slate-200/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 grayscale cursor-not-allowed opacity-50'
                                                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                            }
                                                        `}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => !isUsedElsewhere && toggleIndicator(editingFactorIndex, col)}
                                                            disabled={isUsedElsewhere}
                                                            className="hidden"
                                                        />
                                                        <div className={`w-3 h-3 rounded-full shrink-0 ${isSelected ? 'bg-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                                        <span className={`text-[11px] font-black truncate uppercase tracking-tighter ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`} title={col}>{col}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                        <p className="text-[10px] text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                                            Mỗi item chỉ được gán cho 1 nhân tố duy nhất
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-80 text-slate-300 dark:text-slate-700 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                                    <ArrowRight className="w-16 h-16 mb-4 opacity-30" />
                                    <p className="font-black uppercase tracking-widest text-xs">Vui lòng chọn nhân tố bên trái</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 mt-12 mb-20 pointer-events-auto">
                <button
                    onClick={onBack}
                    className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all active:scale-95"
                    disabled={isAnalyzing}
                >
                    Quay lại
                </button>

                <div className="hidden lg:flex items-center gap-4">
                     <div className="flex -space-x-2">
                        {factors.map((_, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${factors[i].indicators.length >= 2 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                        ))}
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {factors.filter(f => f.indicators.length >= 2).length} / {factors.length} Sẵn sàng
                     </span>
                </div>

                <button
                    onClick={handleRun}
                    disabled={isAnalyzing}
                    className={`w-full sm:w-auto px-16 py-4 font-black rounded-xl shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                        isAnalyzing ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-1'
                    }`}
                >
                    {isAnalyzing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="uppercase text-xs tracking-widest">ĐANG XỬ LÝ...</span>
                        </>
                    ) : (
                        <>
                            <span className="uppercase text-xs tracking-[0.2em]">CHẠY PHÂN TÍCH HTMT</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
