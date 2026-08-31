import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CronbachResults } from './reliability/CronbachResults';
import { EFAResults } from './factor/EFAResults';
import { PLSResults } from './factor/PLSResults';
import { ResearchModelDiagram } from './shared/ResearchModelDiagram';
import { Rocket, Target, Shield, Grid3x3, Network, Workflow } from 'lucide-react';

interface AutoPilotReportProps {
    results: any;
    columns: string[];
}

export function AutoPilotReport({ results, columns }: AutoPilotReportProps) {
    if (!results || !results.model) {
        return <div>Error loading Auto Pilot Report</div>;
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
                        <Rocket className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight mb-2">Báo cáo Auto Pilot Tổng Hợp</h2>
                        <p className="text-blue-200 text-sm max-w-2xl leading-relaxed">
                            Báo cáo khoa học tự động sinh. Bao gồm 3 giai đoạn: Kiểm định thang đo, Phân tích nhân tố, và Mô hình cấu trúc SEM.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20">
                                {Object.keys(results.cronbach || {}).length} thang đo
                            </span>
                            <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20">
                                {results.efa?.data?.n_factors || 0} nhân tố EFA
                            </span>
                            <span className="px-3 py-1 bg-indigo-500/50 text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-400">
                                PLS-SEM
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Model Summary / Research Model Diagram */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-lg">
                        <Workflow className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        Mô hình Nghiên cứu (Research Model)
                    </h3>
                </div>
                <div className="pl-4 md:pl-14 ml-5">
                    <p className="text-slate-500 mb-6 max-w-2xl">
                        Mô hình nghiên cứu dưới đây được xây dựng dựa trên các đường dẫn mà bạn đã thiết lập.
                        Biểu đồ này sẽ tự động cập nhật hệ số đường dẫn (Path Coefficients) và mức độ ý nghĩa sau khi hoàn tất PLS-SEM.
                    </p>
                    <ResearchModelDiagram 
                        paths={(results.model.paths || (results.model.ivs ? results.model.ivs.map((iv: string) => ({ from: iv, to: results.model.dv })) : [])).map((p: any) => {
                            if (!results.sem || !results.sem.path_coefficients) return p;
                            const coefData = results.sem.path_coefficients[p.from]?.[p.to];
                            if (!coefData) return p;
                            return {
                                ...p,
                                coef: coefData['Original Est.'],
                                pVal: coefData['P Value']
                            };
                        })} 
                    />
                </div>
            </div>

            {/* Section 1: Reliability */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black shadow-lg">1</div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <Shield className="w-6 h-6 text-blue-600" /> Đánh giá Độ tin cậy Thang đo
                    </h3>
                </div>
                <div className="space-y-8 pl-4 md:pl-14 border-l-4 border-slate-100 ml-5 py-4">
                    {Object.keys(results.cronbach || {}).map((scaleName) => {
                        const cronData = results.cronbach[scaleName];
                        return (
                            <div key={scaleName} className="relative">
                                <h4 className="text-lg font-black text-slate-700 mb-4 bg-slate-100 inline-block px-4 py-1.5 rounded-lg border border-slate-200">
                                    Thang đo: {scaleName}
                                </h4>
                                <CronbachResults 
                                    analysisType="omega" 
                                    results={cronData.data} 
                                    columns={cronData.columns} 
                                    scaleName={scaleName} 
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Section 2: EFA */}
            {results.efa && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg">2</div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <Grid3x3 className="w-6 h-6 text-indigo-600" /> Phân tích Nhân tố Khám phá (EFA)
                        </h3>
                    </div>
                    <div className="pl-4 md:pl-14 border-l-4 border-slate-100 ml-5 py-4">
                        <EFAResults 
                            results={results.efa.data} 
                            columns={results.efa.columns} 
                        />
                    </div>
                </div>
            )}

            {/* Section 3: SEM */}
            {results.sem && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-lg">3</div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <Network className="w-6 h-6 text-emerald-600" /> Mô hình Cấu trúc (PLS-SEM)
                        </h3>
                    </div>
                    <div className="pl-4 md:pl-14 border-l-4 border-slate-100 ml-5 py-4">
                        <PLSResults 
                            results={results.sem} 
                            columns={columns} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
