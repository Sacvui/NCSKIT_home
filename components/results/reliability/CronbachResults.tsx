'use client';

import React, { useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, Activity, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

interface CronbachResultsProps {
    results: any;
    columns?: string[];
    onProceedToEFA?: (goodItems: string[]) => void;
    scaleName?: string;
    analysisType?: string;
}

/**
 * Cronbach's Alpha Reliability Results Component - Scientific Academic Style (White & Blue)
 */
export const CronbachResults = React.memo(function CronbachResults({
    results,
    columns,
    onProceedToEFA,
    scaleName,
    analysisType
}: CronbachResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    const alpha = results.alpha || results.rawAlpha || 0;
    const nItems = results.nItems || 'N/A';
    const itemTotalStats = results.itemTotalStats || [];

    const isOmega = analysisType === 'omega';

    // Extract good items for workflow (memoized)
    const goodItems = useMemo(() =>
        itemTotalStats
            .filter((item: any) => item.correctedItemTotalCorrelation >= 0.3)
            .map((item: any, idx: number) => columns?.[idx] || item.itemName),
        [itemTotalStats, columns]
    );

    const handleProceedToEFA = useCallback(() => {
        if (onProceedToEFA) {
            onProceedToEFA(goodItems);
        }
    }, [onProceedToEFA, goodItems]);

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-500">
            {/* Reliability Summary Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        {isOmega ? 'McDonald\'s Omega Reliability' : 'Cronbach\'s Alpha Reliability Statistics'}
                    </h3>
                </div>
                <div className="p-8 flex items-center justify-around bg-gradient-to-r from-white to-blue-50/30">
                    <div className="text-center">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isOmega ? 'Omega' : 'Alpha'} Coefficient</div>
                        <div className={`text-5xl font-black ${alpha >= 0.7 ? 'text-blue-900' : 'text-slate-400'}`}>
                            {alpha.toFixed(3)}
                        </div>
                        <div className={`text-[10px] font-black mt-2 uppercase px-3 py-1 rounded-full border ${alpha >= 0.7 ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                            {alpha >= 0.8 ? 'Very High' : alpha >= 0.7 ? 'Acceptable' : alpha >= 0.6 ? 'Questionable' : 'Poor'}
                        </div>
                    </div>
                    <div className="h-16 w-px bg-blue-100"></div>
                    <div className="text-center">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Items Tracked</div>
                        <div className="text-5xl font-black text-blue-900">
                            {nItems}
                        </div>
                        <div className="text-[10px] font-black mt-2 uppercase text-slate-400 tracking-tighter">Variables in scale</div>
                    </div>
                </div>
            </div>

            {/* Item-Total Statistics Table */}
            {itemTotalStats.length > 0 && (
                <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-blue-50 bg-slate-50/50">
                        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Item-Total Statistics (Tương quan biến - tổng)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-slate-700">
                            <thead className="bg-blue-50/50 border-y border-blue-100">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-black text-blue-900 uppercase">Variable (Biến)</th>
                                    <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Scale Mean if Deleted</th>
                                    <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Scale Variance if Deleted</th>
                                    <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right bg-blue-100/30">Corrected Item-Total Corr.</th>
                                    <th className="py-4 px-4 text-xs font-black text-blue-900 uppercase text-right">Alpha if Deleted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50">
                                {itemTotalStats.map((item: any, idx: number) => {
                                    const isLow = item.correctedItemTotalCorrelation < 0.3;
                                    const isKiller = item.alphaIfItemDeleted > alpha;
                                    
                                    return (
                                        <tr key={idx} className={`hover:bg-blue-50/30 transition-colors ${isLow ? 'bg-red-50/30' : ''}`}>
                                             <td className="py-4 px-6 text-sm font-bold text-blue-800">{columns?.[idx] || item.itemName}</td>
                                            <td className="py-4 px-4 text-sm text-right font-mono text-slate-800">{item.scaleMeanIfDeleted?.toFixed(3)}</td>
                                            <td className="py-4 px-4 text-sm text-right font-mono text-slate-800">{item.scaleVarianceIfDeleted?.toFixed(3)}</td>
                                            <td className={`py-4 px-4 text-sm text-right font-black ${isLow ? 'text-red-700 underline underline-offset-4 decoration-red-400 font-extrabold ring-1 ring-red-100 rounded-lg' : 'text-blue-950 bg-blue-50/20 font-black'}`}>
                                                {item.correctedItemTotalCorrelation?.toFixed(3)}
                                            </td>
                                            <td className={`py-4 px-4 text-sm text-right font-black ${isKiller ? 'text-amber-700 font-extrabold' : 'text-slate-800 font-bold'}`}>
                                                {item.alphaIfItemDeleted?.toFixed(3)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Academic Interpretation Section */}
            <div className="bg-white border border-blue-100 p-8 rounded-xl shadow-sm relative overflow-hidden">
                <h4 className="text-xs font-black uppercase text-blue-600 tracking-widest mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Nhận định khoa học (Academic Interpretation)
                </h4>

                <div className="space-y-6 border-l-2 border-blue-50 pl-6 text-sm">
                    <div className="bg-blue-50/40 p-6 rounded-lg border border-blue-50 leading-relaxed text-slate-800">
                        Hệ số tin cậy **{isOmega ? 'Omega' : 'Cronbach\'s Alpha'}** của thang đo <strong>{scaleName || 'nghiên cứu'}</strong> đạt <strong>{alpha.toFixed(3)}</strong>. 
                        Số lượng biến quan sát là <strong>{nItems}</strong>. 
                        {alpha >= 0.7 
                            ? "Thang đo đạt độ tin cậy tốt để sử dụng trong các phân tích tiếp theo."
                            : "Thang đo có độ tin cậy chưa cao, cần xem xét loại bỏ các biến có tương quan biến-tổng thấp."
                        }
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <p className="flex items-center gap-3">
                             <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <strong>Item-Total Correlation &lt; 0.3:</strong> Tương quan yếu, biến không phản ánh tốt thang đo.
                             </span>
                        </p>
                        <p className="flex items-center gap-3">
                             <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <strong>Alpha if Item Deleted &gt; Current Alpha:</strong> Loại bỏ biến này sẽ trực tiếp làm tăng độ tin cậy.
                             </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Workflow Step: Proceed to EFA */}
            {goodItems.length >= 3 && onProceedToEFA && (
                <div className="bg-blue-900 p-8 rounded-2xl text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-700 p-3 rounded-xl shadow-lg">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black tracking-tight">Sẵn sàng bước tiếp?</h4>
                            <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Thang đo đã được kiểm định độ tin cậy</p>
                        </div>
                    </div>
                    <button
                        onClick={handleProceedToEFA}
                        className="bg-white text-blue-900 px-8 py-4 rounded-xl font-black flex items-center gap-3 hover:bg-blue-50 transition-all shadow-lg active:scale-95 group"
                    >
                        <span>CHẠY EFA ({goodItems.length} BIẾN ĐẠT CHUẨN)</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
});

export default CronbachResults;
