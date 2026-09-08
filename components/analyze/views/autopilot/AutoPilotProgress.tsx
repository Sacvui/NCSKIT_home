import React from 'react';
import { Rocket } from 'lucide-react';

interface AutoPilotProgressProps {
    progress: number;
    statusText: string;
}

export function AutoPilotProgress({ progress, statusText }: AutoPilotProgressProps) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-blue-50 opacity-50"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white mb-6 animate-bounce shadow-lg shadow-indigo-200">
                        <Rocket className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-800 mb-2">Đang phân tích tự động...</h3>
                    <p className="text-sm text-slate-500 mb-8 text-center animate-pulse">
                        {statusText}
                    </p>

                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-2 relative">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite] w-full"></div>
                        </div>
                    </div>
                    <div className="text-xs font-bold text-slate-400 self-end">
                        {progress}%
                    </div>
                </div>
            </div>
        </div>
    );
}
