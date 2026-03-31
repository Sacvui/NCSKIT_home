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

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="w-8 h-8" />
                        <div>
                            <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest">{t(locale, 'analyze.profile.summary.rows')}</p>
                            <p className="text-3xl font-black">{profile.rows.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-8 h-8" />
                        <div>
                            <p className="text-purple-100 text-[10px] font-black uppercase tracking-widest">{t(locale, 'analyze.profile.summary.cols')}</p>
                            <p className="text-3xl font-black">{profile.columns}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-8 h-8" />
                        <div>
                            <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest">{t(locale, 'analyze.profile.summary.issues')}</p>
                            <p className="text-3xl font-black">{profile.issues.length}</p>
                        </div>
                    </div>
                </div>

                {/* Factor Detection Summary */}
                {profile.factors && Object.keys(profile.factors).length > 0 && (
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white md:col-span-3 shadow-xl overflow-hidden relative">
                         <div className="absolute right-0 top-0 opacity-10">
                            <Database className="w-32 h-32 -mr-8 -mt-8" />
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                    <Database className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest">{locale === 'vi' ? 'Nhóm biến (Nhân tố) tự động' : 'Auto-detected Factors'}</p>
                                    <p className="text-2xl font-black uppercase tracking-tighter">
                                        {Object.keys(profile.factors).length} {locale === 'vi' ? 'NHÓM THANG ĐO' : 'GROUPS FOUND'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 max-w-full md:max-w-[60%] justify-center md:justify-end">
                                {Object.keys(profile.factors).map(f => (
                                    <span key={f} className="px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-black border border-white/20 hover:bg-white/20 transition-colors">
                                        {f} <span className="opacity-50 mx-1">•</span> {profile.factors[f].length} ITEMS
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Issues List */}
            {profile.issues.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <AlertTriangle className="w-7 h-7 text-orange-500" />
                        {t(locale, 'analyze.profile.issues.title')}
                    </h3>

                    <div className="space-y-4">
                        {profile.issues.map((issue, idx) => (
                            <div
                                key={idx}
                                className={`border-2 rounded-2xl p-5 transition-all hover:shadow-md ${getSeverityColor(issue.severity)}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">{getSeverityIcon(issue.severity)}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-black text-slate-900 uppercase tracking-wide">
                                                {issue.column || t(locale, 'analyze.profile.issues.allData')}
                                            </span>
                                            <span className="px-3 py-1 bg-white/60 rounded-full text-[10px] font-black text-slate-600 border border-slate-200">
                                                {issue.count} {t(locale, 'analyze.profile.issues.countLabel')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700 font-medium leading-relaxed">{issue.suggestedFix}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Column Statistics */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t(locale, 'analyze.profile.table.title')}</h3>
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                        {Object.keys(profile.columnStats).length} Cột dữ liệu
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="text-left py-5 px-8 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.colName')}</th>
                                <th className="text-left py-5 px-8 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.type')}</th>
                                <th className="text-right py-5 px-8 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.missing')}</th>
                                <th className="text-right py-5 px-8 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.mean')}</th>
                                <th className="text-right py-5 px-8 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.sd')}</th>
                                <th className="text-right py-5 px-8 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.min')}</th>
                                <th className="text-right py-5 px-8 font-black text-slate-900 uppercase text-[10px] tracking-widest">{t(locale, 'analyze.profile.table.max')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {Object.values(profile.columnStats).map((stat, idx) => (
                                <tr key={idx} className="hover:bg-indigo-50/30 transition-all group">
                                    <td className="py-4 px-8 font-black text-slate-900 text-sm group-hover:text-indigo-600 transition-colors uppercase">{stat.name}</td>
                                    <td className="py-4 px-8">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${stat.type === 'numeric' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                stat.type === 'text' ? 'bg-slate-50 text-slate-600 border border-slate-100' :
                                                    'bg-green-50 text-green-700 border border-green-100'
                                            }`}>
                                            {stat.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-8 text-right font-black text-slate-900">
                                        {stat.missing > 0 ? (
                                            <span className="text-red-500 font-black px-2 py-1 bg-red-50 rounded-lg">
                                                {stat.missing} ({(stat.missingRate * 100).toFixed(1)}%)
                                            </span>
                                        ) : (
                                            <span className="text-emerald-600 font-bold">0</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-8 text-right font-bold text-slate-700 text-sm italic">
                                        {stat.mean !== undefined ? stat.mean.toFixed(3) : '-'}
                                    </td>
                                    <td className="py-4 px-8 text-right font-bold text-slate-700 text-sm italic">
                                        {stat.sd !== undefined ? stat.sd.toFixed(3) : '-'}
                                    </td>
                                    <td className="py-4 px-8 text-right font-bold text-slate-700 text-sm italic">
                                        {stat.min !== undefined ? stat.min.toFixed(3) : '-'}
                                    </td>
                                    <td className="py-4 px-8 text-right font-bold text-slate-700 text-sm italic">
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
                <div className="flex justify-end pt-4">
                    <button
                        onClick={onProceed}
                        className="px-10 py-4 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl hover:shadow-indigo-500/40 active:scale-95"
                    >
                        {t(locale, 'analyze.profile.proceed')}
                    </button>
                </div>
            )}
        </div>
    );
}
