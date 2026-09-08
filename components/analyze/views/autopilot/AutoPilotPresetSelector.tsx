import React from 'react';
import { Target, Lock } from 'lucide-react';
import { AutoPilotPreset, AUTO_PILOT_PRESETS } from '@/lib/auto-pilot-presets';

interface AutoPilotPresetSelectorProps {
    onSelect: (preset: AutoPilotPreset) => void;
}

export function AutoPilotPresetSelector({ onSelect }: AutoPilotPresetSelectorProps) {
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
                                onSelect(preset);
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
