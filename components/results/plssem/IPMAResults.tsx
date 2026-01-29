'use client';

import { Target, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface IPMAResultsProps {
    results: {
        performance: number[];
        importance: number[];
        interpretation: string;
    };
}

export default function IPMAResults({ results }: IPMAResultsProps) {
    if (!results || !results.performance || !results.importance) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <p className="text-red-800 font-medium">Không có kết quả IPMA</p>
                </div>
            </div>
        );
    }

    const { performance, importance, interpretation } = results;

    // Combine and categorize
    const ipmaData = performance.map((perf, idx) => ({
        variable: `Biến ${idx + 1}`,
        performance: perf,
        importance: importance[idx],
        category: categorize(importance[idx], perf)
    }));

    // Sort by importance (descending)
    const sortedData = [...ipmaData].sort((a, b) => b.importance - a.importance);

    function categorize(imp: number, perf: number): string {
        const avgImp = importance.reduce((a, b) => a + b, 0) / importance.length;
        const avgPerf = performance.reduce((a, b) => a + b, 0) / performance.length;

        if (imp > avgImp && perf < avgPerf) return 'priority';
        if (imp > avgImp && perf > avgPerf) return 'maintain';
        if (imp < avgImp && perf < avgPerf) return 'low';
        return 'excess';
    }

    function getCategoryInfo(category: string) {
        switch (category) {
            case 'priority':
                return {
                    label: 'Ưu tiên cải thiện',
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: AlertTriangle,
                    desc: 'Quan trọng cao nhưng hiệu suất thấp'
                };
            case 'maintain':
                return {
                    label: 'Duy trì tốt',
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: CheckCircle2,
                    desc: 'Quan trọng cao và hiệu suất tốt'
                };
            case 'excess':
                return {
                    label: 'Dư thừa',
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: TrendingUp,
                    desc: 'Ít quan trọng nhưng hiệu suất cao'
                };
            default:
                return {
                    label: 'Ưu tiên thấp',
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: Target,
                    desc: 'Ít quan trọng và hiệu suất thấp'
                };
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                    <Target className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Kết quả IPMA</h2>
                </div>
                <p className="text-amber-100">
                    Importance-Performance Matrix Analysis - Phân tích ma trận quan trọng-hiệu suất
                </p>
            </div>

            {/* Interpretation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 font-medium">
                    💡 {interpretation}
                </p>
            </div>

            {/* IPMA Table */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Ma trận Importance-Performance
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">
                                    Biến
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-bold text-slate-700">
                                    Importance
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-bold text-slate-700">
                                    Performance
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">
                                    Phân loại
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((item, idx) => {
                                const categoryInfo = getCategoryInfo(item.category);
                                const Icon = categoryInfo.icon;

                                return (
                                    <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                            {item.variable}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right">
                                            <span className="font-bold text-slate-900">
                                                {item.importance.toFixed(3)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right">
                                            <span className="font-bold text-slate-900">
                                                {item.performance.toFixed(3)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${categoryInfo.color} flex items-center gap-1`}>
                                                    <Icon className="w-3 h-3" />
                                                    {categoryInfo.label}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid md:grid-cols-2 gap-4">
                {['priority', 'maintain', 'excess', 'low'].map(cat => {
                    const items = ipmaData.filter(item => item.category === cat);
                    const categoryInfo = getCategoryInfo(cat);
                    const Icon = categoryInfo.icon;

                    return (
                        <div key={cat} className={`rounded-lg border p-4 ${categoryInfo.color}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-5 h-5" />
                                <h4 className="font-bold">{categoryInfo.label}</h4>
                            </div>
                            <p className="text-xs mb-2">{categoryInfo.desc}</p>
                            <p className="text-sm font-bold">
                                {items.length} biến
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Interpretation Guide */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-purple-900 mb-3">
                    📊 Hướng dẫn giải thích
                </h3>
                <div className="space-y-3 text-sm text-purple-800">
                    <div>
                        <strong className="text-red-700">🔴 Ưu tiên cải thiện:</strong>
                        <p>Các biến quan trọng cao nhưng hiệu suất thấp. Cần tập trung cải thiện ngay.</p>
                    </div>
                    <div>
                        <strong className="text-green-700">🟢 Duy trì tốt:</strong>
                        <p>Các biến quan trọng và đang hoạt động tốt. Tiếp tục duy trì.</p>
                    </div>
                    <div>
                        <strong className="text-blue-700">🔵 Dư thừa:</strong>
                        <p>Hiệu suất cao nhưng ít quan trọng. Có thể giảm đầu tư.</p>
                    </div>
                    <div>
                        <strong className="text-gray-700">⚪ Ưu tiên thấp:</strong>
                        <p>Ít quan trọng và hiệu suất thấp. Không cần ưu tiên.</p>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-amber-900 mb-3">
                    💡 Khuyến nghị hành động
                </h3>
                <ul className="space-y-2 text-sm text-amber-800">
                    {sortedData.filter(item => item.category === 'priority').length > 0 && (
                        <li className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
                            <span>
                                <strong>Ưu tiên cao:</strong> Tập trung cải thiện{' '}
                                {sortedData.filter(item => item.category === 'priority').map(item => item.variable).join(', ')}
                            </span>
                        </li>
                    )}
                    {sortedData.filter(item => item.category === 'maintain').length > 0 && (
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                            <span>
                                <strong>Duy trì:</strong> Giữ vững hiệu suất của{' '}
                                {sortedData.filter(item => item.category === 'maintain').map(item => item.variable).join(', ')}
                            </span>
                        </li>
                    )}
                    <li className="flex items-start gap-2">
                        <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                            Sử dụng IPMA để xác định các lĩnh vực cần cải thiện để tối đa hóa hiệu quả
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
