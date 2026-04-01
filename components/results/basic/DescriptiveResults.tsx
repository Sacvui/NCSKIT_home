'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartWrapper } from '../shared/ChartWrapper';
import { TemplateInterpretation } from '@/components/TemplateInterpretation';
import { BarChart3, Database } from 'lucide-react';

import { getStoredLocale, t, type Locale } from '@/lib/i18n';

interface DescriptiveResultsProps {
    results: any;
    columns: string[];
}

/**
 * Descriptive Statistics Results Component
 * Displays descriptive statistics table and mean comparison chart
 */
const safeToFixed = (val: any, digits = 3) => {
    if (val === undefined || val === null || isNaN(val)) return '-';
    return Number(val).toFixed(digits);
};

export const DescriptiveResults = React.memo(function DescriptiveResults({ results, columns }: DescriptiveResultsProps) {
    const [locale, setLocale] = React.useState<Locale>('vi');

    React.useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    return (
        <div className="space-y-8 font-sans">
            {/* Descriptive Statistics Table */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800/50 pb-4">
                    <CardTitle className="text-slate-900 dark:text-slate-50 flex items-center gap-2">
                        <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        {t(locale, 'tables.summary')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto pt-6 px-0">
                    <table className="w-full text-left text-sm whitespace-nowrap text-slate-700 dark:text-slate-300 border-collapse">
                        <thead className="bg-slate-950 border-b-2 border-slate-700 text-slate-100">
                            <tr>
                                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">{t(locale, 'tables.variable')}</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center border-l border-slate-800">{t(locale, 'tables.n')}</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right border-l border-slate-800">{t(locale, 'tables.min')}</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right border-l border-slate-800">{t(locale, 'tables.max')}</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-indigo-400 text-right border-l-2 border-indigo-500/50 bg-indigo-950/20">{t(locale, 'tables.mean')}</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right border-l border-slate-800">{t(locale, 'tables.sd')}</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right border-l border-slate-800">{t(locale, 'tables.skew')}</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right border-l border-slate-800">{t(locale, 'tables.kurtosis')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {columns.map((col, idx) => (
                                <tr key={idx} className="hover:bg-slate-900/40 transition-all group border-b border-slate-800/50">
                                    <td className="py-5 px-6 font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{col}</td>
                                    <td className="py-5 px-4 text-center text-slate-500 font-bold border-l border-slate-800/50">{(results.N && results.N[idx] !== undefined) ? results.N[idx] : 'N/A'}</td>
                                    <td className="py-5 px-4 text-right text-slate-600 dark:text-slate-400 border-l border-slate-800/50 font-mono text-xs">{safeToFixed(results.min?.[idx])}</td>
                                    <td className="py-5 px-4 text-right text-slate-600 dark:text-slate-400 border-l border-slate-800/50 font-mono text-xs">{safeToFixed(results.max?.[idx])}</td>
                                    <td className="py-5 px-4 text-right border-l-2 border-indigo-500/50 bg-indigo-500/5 text-indigo-700 dark:text-indigo-400 font-black text-lg tracking-tighter">{safeToFixed(results.mean?.[idx])}</td>
                                    <td className="py-5 px-4 text-right text-slate-600 dark:text-slate-400 border-l border-slate-800/50 font-mono text-xs">{safeToFixed(results.sd?.[idx])}</td>
                                    <td className="py-5 px-4 text-right text-slate-600 dark:text-slate-400 border-l border-slate-800/50 font-mono text-xs italic">{safeToFixed(results.skew?.[idx])}</td>
                                    <td className="py-5 px-4 text-right text-slate-600 dark:text-slate-400 border-l border-slate-800/50 font-mono text-xs italic">{safeToFixed(results.kurtosis?.[idx])}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Mean Comparison Chart Card */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader className="bg-slate-50/30 dark:bg-slate-800/30">
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Mean Value Comparison (Biểu đồ Trung bình)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                    <div className="h-80 w-full">
                        <ChartWrapper
                            type="bar"
                            data={{
                                labels: columns,
                                datasets: [{
                                    label: 'Mean',
                                    data: results.mean,
                                    backgroundColor: 'rgba(79, 70, 229, 0.7)', // Indigo-600
                                    borderColor: 'rgba(79, 70, 229, 1)',
                                    borderWidth: 2,
                                    borderRadius: 6,
                                    hoverBackgroundColor: 'rgba(79, 70, 229, 0.9)',
                                }]
                            }}
                            options={{
                                plugins: {
                                    legend: { display: false }
                                },
                                scales: {
                                    y: {
                                        ticks: {
                                            color: '#64748b' // slate-500
                                        },
                                        grid: {
                                            color: 'rgba(203, 213, 225, 0.2)' // slate-300 with low opacity
                                        }
                                    },
                                    x: {
                                        ticks: {
                                            color: '#64748b'
                                        },
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

        </div>
    );
});

export default DescriptiveResults;
