'use client';

import { DataProfile } from '@/lib/data-profiler';
import { AlertCircle, AlertTriangle, Info, TrendingUp, Database } from 'lucide-react';

import { Locale, t } from '@/lib/i18n';

interface DataProfilerProps {
    profile: DataProfile;
    onProceed?: () => void;
    locale: Locale;
}

export function DataProfiler({ profile, onProceed, locale }: DataProfilerProps) {
    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-50 border-red-200';
            case 'warning': return 'bg-yellow-50 border-yellow-200';
            default: return 'bg-blue-50 border-blue-200';
        }
    };

    const criticalIssues = profile.issues.filter(i => i.severity === 'critical').length;
    const warningIssues = profile.issues.filter(i => i.severity === 'warning').length;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="w-8 h-8" />
                        <div>
                            <p className="text-blue-100 text-sm">{t(locale, 'analyze.profile.summary.rows')}</p>
                            <p className="text-3xl font-bold">{profile.rows.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-8 h-8" />
                        <div>
                            <p className="text-purple-100 text-sm">{t(locale, 'analyze.profile.summary.cols')}</p>
                            <p className="text-3xl font-bold">{profile.columns}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-8 h-8" />
                        <div>
                            <p className="text-orange-100 text-sm">{t(locale, 'analyze.profile.summary.issues')}</p>
                            <p className="text-3xl font-bold">{profile.issues.length}</p>
                        </div>
                    </div>
                </div>

                {/* New: Factor Detection Summary */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white md:col-span-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-white/20 rounded-lg">
                                <Database className="w-6 h-6" />
                            </span>
                            <div>
                                <p className="text-indigo-100 text-sm">{locale === 'vi' ? 'Nhóm biến (Nhân tố) tự động' : 'Auto-detected Factors'}</p>
                                <p className="text-xl font-extrabold uppercase tracking-widest">{Object.keys(profile.factors).length} {locale === 'vi' ? 'NHÓM' : 'GROUPS'}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 max-w-[60%] justify-end">
                            {Object.keys(profile.factors).map(f => (
                                <span key={f} className="px-2 py-1 bg-white/10 rounded text-[10px] font-black border border-white/20">
                                    {f} ({profile.factors[f].length})
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Issues List */}
            {profile.issues.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-orange-500" />
                        {t(locale, 'analyze.profile.issues.title')}
                    </h3>

                    <div className="space-y-3">
                        {profile.issues.map((issue, idx) => (
                            <div
                                key={idx}
                                className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}
                            >
                                <div className="flex items-start gap-3">
                                    {getSeverityIcon(issue.severity)}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-800">
                                                {issue.column || t(locale, 'analyze.profile.issues.allData')}
                                            </span>
                                            <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium">
                                                {issue.count} {t(locale, 'analyze.profile.issues.countLabel')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{issue.suggestedFix}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Column Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">{t(locale, 'analyze.profile.table.title')}</h3>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-slate-50">
                                <th className="text-left py-4 px-6 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.colName')}</th>
                                <th className="text-left py-4 px-6 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.type')}</th>
                                <th className="text-right py-4 px-6 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.missing')}</th>
                                <th className="text-right py-4 px-6 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.mean')}</th>
                                <th className="text-right py-4 px-6 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.sd')}</th>
                                <th className="text-right py-4 px-6 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.min')}</th>
                                <th className="text-right py-4 px-6 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.max')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {Object.values(profile.columnStats).map((stat, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6 font-bold text-slate-900">{stat.name}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${stat.type === 'numeric' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                stat.type === 'text' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                                                    'bg-green-100 text-green-700 border border-green-200'
                                            }`}>
                                            {stat.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right font-medium text-slate-900">
                                        {stat.missing > 0 ? (
                                            <span className="text-red-600 font-black">
                                                {stat.missing} ({(stat.missingRate * 100).toFixed(1)}%)
                                            </span>
                                        ) : (
                                            <span className="text-green-600">0</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-right font-medium text-slate-900">
                                        {stat.mean !== undefined ? stat.mean.toFixed(3) : '-'}
                                    </td>
                                    <td className="py-4 px-6 text-right font-medium text-slate-900">
                                        {stat.sd !== undefined ? stat.sd.toFixed(3) : '-'}
                                    </td>
                                    <td className="py-4 px-6 text-right font-medium text-slate-900">
                                        {stat.min !== undefined ? stat.min.toFixed(3) : '-'}
                                    </td>
                                    <td className="py-4 px-6 text-right font-medium text-slate-900">
                                        {stat.max !== undefined ? stat.max.toFixed(3) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Button */}
            {onProceed && (
                <div className="flex justify-end">
                    <button
                        onClick={onProceed}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        {t(locale, 'analyze.profile.proceed')}
                    </button>
                </div>
            )}
        </div>
    );
}
