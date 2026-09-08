import React from 'react';
import { Layers } from 'lucide-react';

interface AcademicConfigProps {
    groups: any[];
    paths: any[];
    newPathFrom: string;
    newPathTo: string;
    setNewPathFrom: (val: string) => void;
    setNewPathTo: (val: string) => void;
    handleAddPath: () => void;
    handleRemovePath: (idx: number) => void;
    bootstrapSamples: number;
    setBootstrapSamples: (val: number) => void;
    requiresBootstrap?: boolean;
}

export function AcademicConfig({
    groups, paths, newPathFrom, newPathTo, setNewPathFrom, setNewPathTo,
    handleAddPath, handleRemovePath, bootstrapSamples, setBootstrapSamples, requiresBootstrap
}: AcademicConfigProps) {
    return (
        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl p-8">
            <h3 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-3">
                <Layers className="w-6 h-6 text-indigo-500" /> Cấu hình Mô hình Nghiên cứu
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                {requiresBootstrap && (
                    <div className="space-y-3 md:col-span-2 mt-2">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-700">Số lượng Bootstrap (Resampling)</h4>
                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Bootstrapping</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                            <div className="grid grid-cols-5 gap-3 mb-4">
                                {[
                                    { value: 10, label: '10', badge: '🧪 Thử nghiệm', desc: 'Siêu tốc (Chỉ kiểm tra luồng)', color: 'slate', disabled: false },
                                    { value: 100, label: '100', badge: '⚠️ Cơ bản', desc: 'Vẫn tốn khá nhiều thời gian để chạy', color: 'amber', disabled: false },
                                    { value: 200, label: '200', badge: '🟡 Tối thiểu', desc: 'Phân tích sơ bộ, chưa đủ cho báo cáo', color: 'emerald', disabled: true },
                                    { value: 500, label: '500', badge: '🟢 Đạt chuẩn', desc: 'Hair et al. (2017) — PLS-SEM', color: 'emerald', disabled: true },
                                    { value: 1000, label: '1,000', badge: '🟢🟢 Khuyến nghị', desc: 'Efron & Tibshirani (1993)', color: 'blue', disabled: true },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        disabled={opt.disabled}
                                        onClick={() => setBootstrapSamples(opt.value)}
                                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                                            opt.disabled
                                                ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed grayscale'
                                                : bootstrapSamples === opt.value
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
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
