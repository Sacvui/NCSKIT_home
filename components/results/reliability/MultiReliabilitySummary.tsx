import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface MultiReliabilitySummaryProps {
    multipleResults: any[];
}

export function MultiReliabilitySummary({ multipleResults }: MultiReliabilitySummaryProps) {
    const formatNum = (val: any, digits: number = 3) => {
        if (val === null || val === undefined) return 'N/A';
        const num = typeof val === 'number' ? val : parseFloat(String(val));
        return isNaN(num) ? 'N/A' : num.toFixed(digits);
    };

    const getStatus = (alpha: number) => {
        if (alpha >= 0.8) return { label: 'Tốt', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 };
        if (alpha >= 0.7) return { label: 'Chấp nhận được', color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle2 };
        if (alpha >= 0.6) return { label: 'Có thể nghi ngờ', color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertTriangle };
        return { label: 'Kém', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
    };

    return (
        <Card className="mb-8 border-blue-100 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-blue-50 pb-4">
                <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Bảng Tổng Hợp Chỉ Số Độ Tin Cậy
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Nhóm Biến</th>
                                <th className="px-6 py-3 font-semibold text-center">Số Biến Quan Sát</th>
                                <th className="px-6 py-3 font-semibold text-center">Loại Phân Tích</th>
                                <th className="px-6 py-3 font-semibold text-center">Chỉ Số (Alpha/Omega)</th>
                                <th className="px-6 py-3 font-semibold text-center">Đánh Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {multipleResults.map((res, idx) => {
                                if (res.type !== 'cronbach' && res.type !== 'omega') return null;

                                const isOmega = res.type === 'omega';
                                const data = res.data || res;
                                const alpha = isOmega 
                                    ? parseFloat(String(data.omega || data.alpha || data.rawAlpha || 0)) || 0
                                    : parseFloat(String(data.alpha || data.rawAlpha || 0)) || 0;
                                const nItems = data.nItems || res.columns?.length || 'N/A';
                                const status = getStatus(alpha);
                                const StatusIcon = status.icon;

                                return (
                                    <tr key={idx} className="bg-white border-b hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{res.scaleName || `Nhóm ${idx + 1}`}</td>
                                        <td className="px-6 py-4 text-center text-slate-600">{nItems}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-xs px-2 py-1 rounded-md font-semibold ${isOmega ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                                {isOmega ? 'Omega' : 'Cronbach\'s Alpha'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-700">{formatNum(alpha)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {status.label}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
