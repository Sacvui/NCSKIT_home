import React from 'react';
import { Layers } from 'lucide-react';

interface CompareConfigProps {
    categoricalCols: string[];
    groups: any[];
    compareGroupVar: string;
    setCompareGroupVar: (val: string) => void;
    compareTestVars: string[];
    setCompareTestVars: (val: string[] | ((prev: string[]) => string[])) => void;
}

export function CompareConfig({
    categoricalCols, groups, compareGroupVar, setCompareGroupVar, compareTestVars, setCompareTestVars
}: CompareConfigProps) {
    return (
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
                                            setCompareTestVars((prev: string[]) => prev.filter(v => v !== g.name));
                                        } else {
                                            setCompareTestVars((prev: string[]) => [...prev, g.name]);
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
    );
}
