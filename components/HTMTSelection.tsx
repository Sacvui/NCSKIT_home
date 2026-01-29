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
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    HTMT Matrix (Discriminant Validity)
                </h2>
                <p className="text-gray-600">
                    Kiểm tra tính phân biệt giữa các factors (Heterotrait-Monotrait Ratio)
                </p>
            </div>

            {/* Threshold Selector */}
            <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                    <CardTitle className="text-blue-900 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        HTMT Threshold
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="threshold"
                                value="0.85"
                                checked={threshold === 0.85}
                                onChange={() => setThreshold(0.85)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm font-medium text-blue-900">
                                Strict (HTMT &lt; 0.85) - Recommended
                            </span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="threshold"
                                value="0.90"
                                checked={threshold === 0.90}
                                onChange={() => setThreshold(0.90)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm font-medium text-blue-900">
                                Lenient (HTMT &lt; 0.90)
                            </span>
                        </label>
                    </div>
                    <p className="text-xs text-blue-700 mt-2 italic">
                        💡 HTMT &lt; {threshold} indicates good discriminant validity between factors
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Factor List */}
                <div className="md:col-span-1 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách Factors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {factors.map((factor, idx) => (
                                    <div
                                        key={factor.id}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${editingFactorIndex === idx
                                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                : 'border-gray-200 hover:border-blue-300'
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
                                                className="font-bold bg-transparent border-b border-dashed border-gray-400 focus:border-blue-600 outline-none w-full text-sm"
                                                placeholder="Tên factor"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            {factors.length > 2 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFactor(idx);
                                                    }}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {factor.indicators.length} items
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={addFactor}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                                >
                                    <Plus className="w-4 h-4" /> Thêm factor
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Indicator Selection */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {editingFactorIndex !== null
                                    ? `Chọn items cho: ${factors[editingFactorIndex].name}`
                                    : 'Chọn một factor để chỉnh sửa'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {editingFactorIndex !== null ? (
                                <div className="space-y-4">
                                    <div className="h-96 overflow-y-auto pr-2 border rounded-lg p-3 bg-gray-50">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {columns.map(col => {
                                                const isSelected = factors[editingFactorIndex].indicators.includes(col);
                                                const isUsedElsewhere = factors.some((f, i) => i !== editingFactorIndex && f.indicators.includes(col));

                                                return (
                                                    <label
                                                        key={col}
                                                        className={`
                              flex items-center gap-2 p-2 rounded border cursor-pointer select-none transition-all
                              ${isSelected
                                                                ? 'bg-blue-100 border-blue-500 text-blue-800'
                                                                : isUsedElsewhere
                                                                    ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                                                                    : 'bg-white border-gray-200 hover:border-blue-300'
                                                            }
                            `}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => !isUsedElsewhere && toggleIndicator(editingFactorIndex, col)}
                                                            disabled={isUsedElsewhere}
                                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 hidden"
                                                        />
                                                        {isSelected && <div className="w-2 h-2 rounded-full bg-blue-600 mr-1" />}
                                                        <span className="text-sm font-medium truncate" title={col}>{col}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        * Mỗi item chỉ thuộc về 1 factor duy nhất (no cross-loading for HTMT)
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                    <ArrowRight className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Vui lòng chọn factor bên trái để thêm items</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-lg border mt-6">
                <button
                    onClick={onBack}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                    disabled={isAnalyzing}
                >
                    Quay lại
                </button>

                <div className="text-sm text-gray-500">
                    {factors.filter(f => f.indicators.length >= 2).length >= 2 ? (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            {factors.filter(f => f.indicators.length >= 2).length} factors hợp lệ
                        </span>
                    ) : (
                        <span className="text-orange-500">Cần ít nhất 2 factors</span>
                    )}
                </div>

                <button
                    onClick={handleRun}
                    disabled={isAnalyzing}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                >
                    {isAnalyzing ? 'Đang tính toán...' : 'Chạy HTMT'}
                </button>
            </div>
        </div>
    );
}
