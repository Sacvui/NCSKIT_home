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

    const safeToFixed = (val: any, decimals = 3) => {
        if (val === undefined || val === null || isNaN(Number(val))) return '-';
        return Number(val).toFixed(decimals);
    };

    const { 
        path_coefficients, 
        r_squared, 
        f_squared, 
        loadings, 
        validity, 
        fornell_larcker, 
        htmt,
        q2,
        bootstrapping,
        vif
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
                                {validity && validity.cronbach && Object.keys(validity.cronbach).map((construct) => (
                                    <tr key={construct} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="py-3 px-4 font-bold text-blue-900">{construct}</td>
                                        <td className={`py-3 px-4 font-medium ${getStatusColor(validity.cronbach[construct], 'high')}`}>{safeToFixed(validity.cronbach[construct])}</td>
                                        <td className={`py-3 px-4 font-medium ${getStatusColor(validity.rho_a[construct], 'high')}`}>{safeToFixed(validity.rho_a[construct])}</td>
                                        <td className={`py-3 px-4 font-medium ${getStatusColor(validity.composite_reliability[construct], 'high')}`}>{safeToFixed(validity.composite_reliability[construct])}</td>
                                        <td className={`py-3 px-4 font-medium ${getStatusColor(validity.ave[construct], 'high')}`}>{safeToFixed(validity.ave[construct])}</td>
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
                                    {Object.entries(path_coefficients || {}).flatMap(([to, froms]: [string, any]) => 
                                        Object.entries(froms || {}).filter(([from, val]: [any, any]) => val !== 0 && from !== 'R^2' && from !== 'AdjR^2').map(([from, val]: [string, any]) => (
                                            <tr key={`${from}-${to}`} className="hover:bg-blue-50/30">
                                                <td className="py-3 px-4 font-bold text-slate-700">{from} <span className="text-blue-400 mx-1">→</span> {to}</td>
                                                <td className="py-3 px-4 font-black text-blue-900">{safeToFixed(val)}</td>
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
                                    {Object.keys(r_squared || {}).map((construct) => (
                                        <tr key={construct} className="hover:bg-blue-50/30">
                                            <td className="py-3 px-4 font-bold text-blue-900">{construct}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-slate-900">{safeToFixed(r_squared[construct])}</span>
                                                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-600" style={{ width: `${r_squared[construct] * 100}%` }} />
                                                    </div>
                                                </div>
                                            </td>
                                            {q2 && (
                                                <td className="py-3 px-4 font-black text-emerald-600">
                                                    {safeToFixed(q2[construct])}
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
                                    {Object.keys(htmt || {}).map(c => <TableHeader key={c}>{c}</TableHeader>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {Object.keys((htmt && htmt[Object.keys(htmt)[0]]) || {}).map((rowName: string) => (
                                    <tr key={rowName} className="hover:bg-blue-50/30">
                                        <td className="py-3 px-4 font-black text-blue-900 bg-slate-50/30">{rowName}</td>
                                        {Object.keys(htmt || {}).map(colName => {
                                            const val = htmt[colName][rowName];
                                            if (val === undefined || val === null) return <td key={colName} className="py-3 px-4 text-slate-200">-</td>;
                                            return (
                                                <td key={colName} className={`py-3 px-4 font-bold ${getStatusColor(val, 'htmt')}`}>
                                                    {safeToFixed(val)}
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
                                                    {safeToFixed(val)}
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

            {/* 5. Bootstrapping / Path Significance */}
            {bootstrapping && bootstrapping.boot_paths && (
                <Card className="border-blue-100 shadow-sm overflow-hidden mt-8">
                    <CardHeader className="bg-slate-50/50 border-b border-blue-50">
                        <CardTitle className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-600" />
                            Path Significance (Bootstrapping {bootstrapping.n_bootstrap || 500} samples)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <TableHeader>Path</TableHeader>
                                        <TableHeader>Original Sample (O)</TableHeader>
                                        <TableHeader>Sample Mean (M)</TableHeader>
                                        <TableHeader>Standard Deviation</TableHeader>
                                        <TableHeader>T Statistics</TableHeader>
                                        <TableHeader>P Values</TableHeader>
                                        <TableHeader>Decision</TableHeader>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {Object.keys(bootstrapping.boot_paths['Original Est.'] || {}).map((path: string) => {
                                        const orig = bootstrapping.boot_paths['Original Est.'][path];
                                        const mean = bootstrapping.boot_paths['Boot Mean'][path];
                                        const sd = bootstrapping.boot_paths['Boot SD'][path];
                                        const tStat = bootstrapping.boot_paths['T Stat.'][path];
                                        // P-value fallback if not explicitly in matrix
                                        let pVal = bootstrapping.boot_paths['P Value'] ? bootstrapping.boot_paths['P Value'][path] : null;
                                        if (pVal === null || pVal === undefined) {
                                            // Approx p-value from T-Stat (two-tailed)
                                            // JS doesn't have pt() so we just do a rough check if |t| > 1.96 for p < 0.05
                                            pVal = Math.abs(tStat) > 3.29 ? 0.001 : (Math.abs(tStat) > 2.58 ? 0.01 : (Math.abs(tStat) > 1.96 ? 0.049 : 0.1));
                                        }
                                        const supported = pVal < 0.05;

                                        return (
                                            <tr key={path} className="hover:bg-blue-50/30">
                                                <td className="py-3 px-4 font-bold text-slate-700">{path}</td>
                                                <td className="py-3 px-4 font-black text-blue-900">{safeToFixed(orig)}</td>
                                                <td className="py-3 px-4 text-slate-600">{safeToFixed(mean)}</td>
                                                <td className="py-3 px-4 text-slate-600">{safeToFixed(sd)}</td>
                                                <td className="py-3 px-4 font-bold text-slate-700">{safeToFixed(tStat)}</td>
                                                <td className={`py-3 px-4 font-black ${supported ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {pVal < 0.001 ? '< 0.001' : safeToFixed(pVal)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${supported ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                        {supported ? 'Supported' : 'Rejected'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 6. VIF (Collinearity) */}
            {vif && vif.vif_values && (
                <Card className="border-blue-100 shadow-sm overflow-hidden mt-8">
                    <CardHeader className="bg-slate-50/50 border-b border-blue-50 flex items-center justify-between">
                        <CardTitle className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            Collinearity Assessment (VIF)
                        </CardTitle>
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${vif.multicollinearity === 'None' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {vif.multicollinearity === 'None' ? 'No Multicollinearity' : 'Multicollinearity Detected'}
                        </span>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <TableHeader>Construct / Item</TableHeader>
                                        <TableHeader>VIF Value</TableHeader>
                                        <TableHeader>Decision</TableHeader>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {Object.keys(vif.vif_values).map((key: string) => {
                                        const val = vif.vif_values[key];
                                        const isGood = val < 5;
                                        const isIdeal = val < 3;
                                        return (
                                            <tr key={key} className="hover:bg-blue-50/30">
                                                <td className="py-3 px-4 font-bold text-slate-700">{key}</td>
                                                <td className={`py-3 px-4 font-black ${isIdeal ? 'text-emerald-600' : (isGood ? 'text-amber-600' : 'text-rose-600')}`}>
                                                    {safeToFixed(val)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isGood ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                        {isIdeal ? 'Ideal (< 3)' : (isGood ? 'Acceptable (< 5)' : 'Problematic (> 5)')}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 7. Blindfolding (Q²) */}
            {q2 && Object.keys(q2).length > 0 && (
                <Card className="border-blue-100 shadow-sm overflow-hidden mt-8">
                    <CardHeader className="bg-slate-50/50 border-b border-blue-50">
                        <CardTitle className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-600" />
                            Predictive Relevance (Q²) - Blindfolding
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <TableHeader>Endogenous Construct</TableHeader>
                                        <TableHeader>Q² Value</TableHeader>
                                        <TableHeader>Predictive Relevance</TableHeader>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {Object.keys(q2).map((constructName: string) => {
                                        const val = q2[constructName];
                                        const numVal = typeof val === 'object' ? Object.values(val)[0] as number : val;
                                        if (typeof numVal !== 'number' || isNaN(numVal)) return null;
                                        
                                        let relevance = "None";
                                        let color = "text-rose-600";
                                        let badge = "bg-rose-100 text-rose-700";
                                        
                                        if (numVal > 0.35) {
                                            relevance = "Large (> 0.35)";
                                            color = "text-emerald-600";
                                            badge = "bg-emerald-100 text-emerald-700";
                                        } else if (numVal > 0.15) {
                                            relevance = "Medium (> 0.15)";
                                            color = "text-blue-600";
                                            badge = "bg-blue-100 text-blue-700";
                                        } else if (numVal > 0) {
                                            relevance = "Small (> 0)";
                                            color = "text-amber-600";
                                            badge = "bg-amber-100 text-amber-700";
                                        }
                                        
                                        return (
                                            <tr key={constructName} className="hover:bg-blue-50/30">
                                                <td className="py-3 px-4 font-bold text-slate-700">{constructName}</td>
                                                <td className={`py-3 px-4 font-black ${color}`}>
                                                    {safeToFixed(numVal)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${badge}`}>
                                                        {relevance}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default PLSResults;
