import React from 'react';
import { Layers } from 'lucide-react';

interface ScaleConfigProps {
    groups: any[];
}

export function ScaleConfig({ groups }: ScaleConfigProps) {
    return (
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
                        <div className="font-black text-indigo-700 text-lg mb-1">{g.name}</div>
                        <div className="text-xs font-bold text-slate-500">{g.columns.length} items</div>
                        <div className="text-[10px] text-slate-400 mt-2 truncate">
                            {g.columns.join(', ')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
