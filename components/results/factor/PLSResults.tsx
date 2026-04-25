'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, ShieldCheck, Zap, BarChart3, Network, Target } from 'lucide-react';

interface PLSResultsProps {
    results: any;
    columns?: string[];
}

/**
 * PLS-SEM Results Component
 * Designed to match SmartPLS 4 professional reporting standards
 */
export const PLSResults: React.FC<PLSResultsProps> = ({ results }) => {
    if (!results) return null;

    const { 
        path_coefficients, 
        r_squared, 
        f_squared, 
        loadings, 
        validity, 
        fornell_larcker, 
        htmt,
        q2
    } = results;

    const getStatusColor = (val: number, type: 'high' | 'low' | 'htmt') => {
        if (type === 'htmt') return val < 0.85 ? 'text-emerald-600' : val < 0.9 ? 'text-amber-600' : 'text-rose-600';
        const isGood = type === 'high' ? val >= 0.7 : val <= 0.08;
        return isGood ? 'text-emerald-600' : 'text-rose-600';
    };

    const TableHeader = ({ children }: { children: React.ReactNode }) => (
        <th className="py-3 px-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/50">
            {children}
        </th>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* 1. Construct Reliability & Validity */}
            <Card className="border-blue-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-blue-50">
                    <CardTitle className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        Construct Reliability and Validity
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <TableHeader>Construct</TableHeader>
                                    <TableHeader>Cronbach's Alpha</TableHeader>
                                    <TableHeader>Rho_A</TableHeader>
                                    <TableHeader>Composite Reliability (Rho_C)</TableHeader>
                                    <TableHeader>AVE</TableHeader>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {Object.keys(validity.cronbach).map((construct) => (
                                    <tr key={construct} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="py-3 px-4 font-bold text-blue-900">{construct}</td>
                                        <td className={`py-3 px-4 font-medium ${getStatusColor(validity.cronbach[construct], 'high')}`}>{validity.cronbach[construct].toFixed(3)}</td>
                                        <td className={`py-3 px-4 font-medium ${getStatusColor(validity.rho_a[construct], 'high')}`}>{validity.rho_a[construct].toFixed(3)}</td>
                                        <td className={`py-3 px-4 font-medium ${getStatusColor(validity.composite_reliability[construct], 'high')}`}>{validity.composite_reliability[construct].toFixed(3)}</td>
                                        <td className={`py-3 px-4 font-medium ${getStatusColor(validity.ave[construct], 'high')}`}>{validity.ave[construct].toFixed(3)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Path Coefficients & R-Square */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Path Coefficients */}
                <Card className="border-blue-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-blue-50">
                        <CardTitle className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                            <Network className="w-4 h-4 text-blue-600" />
                            Path Coefficients
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <TableHeader>Path</TableHeader>
                                        <TableHeader>Coefficient (Beta)</TableHeader>
                                        <TableHeader>Result</TableHeader>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {Object.entries(path_coefficients).flatMap(([to, froms]: [string, any]) => 
                                        Object.entries(froms).filter(([_, val]: [any, any]) => val !== 0).map(([from, val]: [string, any]) => (
                                            <tr key={`${from}-${to}`} className="hover:bg-blue-50/30">
                                                <td className="py-3 px-4 font-bold text-slate-700">{from} <span className="text-blue-400 mx-1">→</span> {to}</td>
                                                <td className="py-3 px-4 font-black text-blue-900">{val.toFixed(3)}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${val > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                        {val > 0 ? 'Positive' : 'Negative'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* R-Square & Q-Square */}
                <Card className="border-blue-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-blue-50">
                        <CardTitle className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-600" />
                            Explanatory & Predictive Power
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <TableHeader>Construct</TableHeader>
                                        <TableHeader>R Square</TableHeader>
                                        {q2 && <TableHeader>Q Square</TableHeader>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {Object.keys(r_squared).map((construct) => (
                                        <tr key={construct} className="hover:bg-blue-50/30">
                                            <td className="py-3 px-4 font-bold text-blue-900">{construct}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-slate-900">{r_squared[construct].toFixed(3)}</span>
                                                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-600" style={{ width: `${r_squared[construct] * 100}%` }} />
                                                    </div>
                                                </div>
                                            </td>
                                            {q2 && (
                                                <td className="py-3 px-4 font-black text-emerald-600">
                                                    {q2[construct]?.toFixed(3) || '-'}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Discriminant Validity (HTMT) */}
            <Card className="border-blue-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-blue-50">
                    <CardTitle className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        Discriminant Validity (HTMT Matrix)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <TableHeader>-</TableHeader>
                                    {Object.keys(htmt).map(c => <TableHeader key={c}>{c}</TableHeader>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {Object.keys(htmt[Object.keys(htmt)[0]] || {}).map((rowName: string) => (
                                    <tr key={rowName} className="hover:bg-blue-50/30">
                                        <td className="py-3 px-4 font-black text-blue-900 bg-slate-50/30">{rowName}</td>
                                        {Object.keys(htmt).map(colName => {
                                            const val = htmt[colName][rowName];
                                            if (val === undefined || val === null) return <td key={colName} className="py-3 px-4 text-slate-200">-</td>;
                                            return (
                                                <td key={colName} className={`py-3 px-4 font-bold ${getStatusColor(val, 'htmt')}`}>
                                                    {val.toFixed(3)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-blue-50/30 text-[10px] text-blue-800 font-medium italic border-t border-blue-50">
                        * Threshold: HTMT &lt; 0.85 (Strict) or &lt; 0.90 (Liberal) indicates good discriminant validity.
                    </div>
                </CardContent>
            </Card>

            {/* 4. Fornell-Larcker Criterion */}
            <Card className="border-blue-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-blue-50">
                    <CardTitle className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        Fornell-Larcker Criterion
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <TableHeader>-</TableHeader>
                                    {Object.keys(fornell_larcker).map(c => <TableHeader key={c}>{c}</TableHeader>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {Object.keys(fornell_larcker[Object.keys(fornell_larcker)[0]] || {}).map((rowName: string) => (
                                    <tr key={rowName} className="hover:bg-blue-50/30">
                                        <td className="py-3 px-4 font-black text-blue-900 bg-slate-50/30">{rowName}</td>
                                        {Object.keys(fornell_larcker).map(colName => {
                                            const val = fornell_larcker[colName][rowName];
                                            const isDiagonal = rowName === colName;
                                            return (
                                                <td key={colName} className={`py-3 px-4 ${isDiagonal ? 'font-black text-blue-600 bg-blue-50/50' : 'text-slate-500'}`}>
                                                    {val?.toFixed(3) || '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-slate-50 text-[10px] text-slate-500 font-medium italic border-t border-blue-50">
                        * Diagonal values are square root of AVE. Off-diagonal are construct correlations. Diagonal must be higher than off-diagonal in its row/column.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PLSResults;
