'use client';

import React, { useMemo } from 'react';
import { Bar, Line, Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Code, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { AIInterpretation } from './AIInterpretation';
import { TemplateInterpretation } from './TemplateInterpretation';
import SEMPathDiagram from './SEMPathDiagram';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

interface ResultsDisplayProps {
    results: any;
    analysisType: string;
    onProceedToEFA?: (goodItems: string[]) => void;
    onProceedToCFA?: (factors: { name: string; indicators: string[] }[]) => void;
    onProceedToSEM?: (factors: { name: string; indicators: string[] }[]) => void;
    columns?: string[];
    userProfile?: any;
    scaleName?: string;
}


export function ResultsDisplay({
    results,
    analysisType,
    onProceedToEFA,
    onProceedToCFA,
    onProceedToSEM,
    userProfile,
    columns,
    scaleName
}: ResultsDisplayProps) {

    const display = useMemo(() => {
        // ... (switch case remains same)
        if (!results) return null;

        switch (analysisType) {
            case 'ttest-indep':
                return <TTestResults results={results} columns={results.columns || []} />;
            case 'ttest-paired':
                return <PairedTTestResults results={results} columns={results.columns || []} />;
            case 'anova':
                return <ANOVAResults results={results} columns={results.columns || []} />;
            case 'correlation':
                return <CorrelationResults results={results} columns={results.columns || []} />;
            case 'regression':
                return <RegressionResults results={results} columns={results.columns || []} />;
            case 'cronbach':
            case 'omega':
                return <CronbachResults results={results} columns={results.columns || []} onProceedToEFA={onProceedToEFA} scaleName={scaleName} analysisType={analysisType} />;
            case 'efa':
                return <EFAResults results={results} columns={results.columns || []} onProceedToCFA={onProceedToCFA} />;
            case 'cfa':
                return <CFAResults results={results} onProceedToSEM={onProceedToSEM} />;
            case 'sem':
                return <SEMResults results={results} />;
            case 'mann-whitney':
                return <MannWhitneyResults results={results} columns={results.columns || []} />;
            case 'chisquare':
                return <ChiSquareResults results={results} />;
            case 'descriptive':
                return <DescriptiveResults results={results} columns={columns || []} />;
            case 'moderation':
                return <ModerationResults results={results} columns={results.columns || []} />;
            case 'mediation':
                return <MediationResults results={results} columns={results.columns || []} />;
            case 'logistic':
                return <LogisticResults results={results} columns={results.columns || []} />;
            case 'twoway-anova':
                return <TwoWayANOVAResults results={results} columns={results.columns || []} />;
            case 'cluster':
                return <ClusterResults results={results} columns={results.columns || []} />;
            default:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Analysis Logic Not Found</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs bg-slate-100 p-2 rounded">
                                {JSON.stringify(results, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                );
        }
    }, [results, analysisType, onProceedToEFA, onProceedToCFA, onProceedToSEM]);

    return (
        <div id="analysis-results-container" className="space-y-8">
            {display}

            {/* R Syntax Viewer - Researcher Only */}
            {results?.rCode && (
                <RSyntaxViewer code={results.rCode} userProfile={userProfile} />
            )}

            {/* Template-based Interpretation (INSTANT, FREE) */}
            <TemplateInterpretation
                analysisType={analysisType}
                results={results}
                scaleName={results?.scaleName || 'Thang đo'}
            />

            {/* AI Interpretation (Optional Premium - requires API key) */}
            <AIInterpretation analysisType={analysisType} results={results} userProfile={userProfile} />
        </div>
    );
}

// R Syntax Viewer Component - Requires Researcher Role
function RSyntaxViewer({ code, userProfile }: { code: string; userProfile?: any }) {
    const [copied, setCopied] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [showUnlockModal, setShowUnlockModal] = React.useState(false);
    const [secretCode, setSecretCode] = React.useState('');
    const [unlockError, setUnlockError] = React.useState('');
    const [isUnlocking, setIsUnlocking] = React.useState(false);

    // Check if user has researcher or admin role
    const isResearcher = userProfile?.role === 'researcher' || userProfile?.role === 'admin';

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUnlock = async () => {
        if (!secretCode.trim()) {
            setUnlockError('Vui lòng nhập mã bí mật');
            return;
        }

        setIsUnlocking(true);
        setUnlockError('');

        try {
            const response = await fetch('/api/unlock-researcher', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secretCode: secretCode.trim() })
            });

            const data = await response.json();

            if (data.success) {
                // Reload page to reflect new role
                window.location.reload();
            } else {
                setUnlockError(data.error || 'Mã không hợp lệ');
            }
        } catch (err) {
            setUnlockError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsUnlocking(false);
        }
    };

    // If not researcher, show locked state
    if (!isResearcher) {
        return (
            <Card className="border-amber-200 bg-amber-50/50 print:hidden">
                <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code className="h-4 w-4 text-amber-600" />
                            <CardTitle className="text-sm font-medium text-amber-800">
                                Equivalent R Syntax
                            </CardTitle>
                            <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-[10px] font-semibold rounded-full">
                                🔒 Researcher Only
                            </span>
                        </div>
                        <button
                            onClick={() => setShowUnlockModal(true)}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-md transition-colors"
                        >
                            Mở khóa
                        </button>
                    </div>
                    <p className="text-xs text-amber-700 mt-2">
                        Tính năng này dành riêng cho Researcher. Nhập mã bí mật để nâng cấp tài khoản.
                    </p>
                </CardHeader>

                {/* Unlock Modal */}
                {showUnlockModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                🔐 Mở khóa Researcher Mode
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Nhập mã bí mật để trở thành Researcher và truy cập R Syntax code.
                            </p>
                            <input
                                type="text"
                                value={secretCode}
                                onChange={(e) => setSecretCode(e.target.value)}
                                placeholder="Nhập mã bí mật..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-center text-lg font-mono tracking-widest"
                                autoFocus
                            />
                            {unlockError && (
                                <p className="text-red-600 text-sm mt-2 text-center">{unlockError}</p>
                            )}
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => {
                                        setShowUnlockModal(false);
                                        setSecretCode('');
                                        setUnlockError('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleUnlock}
                                    disabled={isUnlocking}
                                    className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50"
                                >
                                    {isUnlocking ? 'Đang xử lý...' : 'Xác nhận'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        );
    }

    return (
        <Card className="border-blue-200 bg-blue-50/50 print:hidden">
            <div
                className="cursor-pointer select-none"
                onClick={() => setExpanded(!expanded)}
            >
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-blue-600" />
                        <CardTitle className="text-sm font-medium text-blue-800">Equivalent R Syntax</CardTitle>
                        <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-[10px] font-semibold rounded-full">
                            ✓ Researcher
                        </span>
                    </div>
                    <div className="text-xs text-blue-500 font-normal hover:text-blue-700">
                        {expanded ? 'Hide Code' : 'Show Code'}
                    </div>
                </CardHeader>
            </div>
            {expanded && (
                <CardContent className="pt-0 pb-3 px-4">
                    <div className="relative group">
                        <pre className="bg-slate-900 text-slate-50 p-4 rounded-md text-xs font-mono overflow-x-auto whitespace-pre-wrap border border-slate-700 shadow-inner">
                            {code}
                        </pre>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                            className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Copy to clipboard"
                        >
                            {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-white/70" />}
                        </button>
                    </div>
                    <p className="text-[10px] text-blue-600/70 mt-2 italic flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Run this code in R or RStudio to reproduce these exact results.
                    </p>
                </CardContent>
            )}
        </Card>
    );
}

// T-test Results Component
function TTestResults({ results, columns }: { results: any; columns: string[] }) {
    const pValue = results.pValue;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Independent Samples T-test Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Group 1 ({columns[0]})</td>
                                <td className="py-2 text-right">Mean = {results.mean1?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Group 2 ({columns[1]})</td>
                                <td className="py-2 text-right">Mean = {results.mean2?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Mean Difference</td>
                                <td className="py-2 text-right font-bold">{results.meanDiff?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">t-statistic</td>
                                <td className="py-2 text-right">{results.t?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Degrees of Freedom (df)</td>
                                <td className="py-2 text-right">{results.df?.toFixed(2)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">p-value (2-tailed)</td>
                                <td className={`py-2 text-right font-bold ${significant ? 'text-green-600' : 'text-gray-600'}`}>
                                    {pValue?.toFixed(4)} {significant && '***'}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">95% CI</td>
                                <td className="py-2 text-right">[{results.ci95Lower?.toFixed(3)}, {results.ci95Upper?.toFixed(3)}]</td>
                            </tr>
                            <tr>
                                <td className="py-2 font-medium">Cohen&apos;s d (Effect Size)</td>
                                <td className="py-2 text-right">{results.effectSize?.toFixed(3)}</td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="py-2 font-medium text-gray-700">Equality of Variances (p)</td>
                                <td className={`py-2 text-right font-medium ${results.varTestP < 0.05 ? 'text-orange-600' : 'text-green-600'}`}>
                                    {results.varTestP?.toFixed(4) || 'N/A'}
                                    <span className="text-xs font-normal text-gray-500 ml-1">
                                        {results.varTestP < 0.05 ? '(Khác biệt)' : '(Đồng nhất)'}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800 mb-2">
                    <strong>Kiểm định phương sai:</strong> p = {results.varTestP?.toFixed(4)}.
                    {results.varTestP < 0.05
                        ? ' Phương sai giữa hai nhóm khác biệt có ý nghĩa (đã sử dụng Welch t-test để điều chỉnh).'
                        : ' Phương sai giữa hai nhóm đồng nhất (sử dụng Student t-test chuẩn).'}
                </p>
                <p className="text-sm text-gray-800">
                    <strong>Kết quả T-test:</strong>
                    {significant
                        ? `Có sự khác biệt có ý nghĩa thống kê giữa ${columns[0]} và ${columns[1]} (p = ${pValue?.toFixed(4)} < 0.05). Cohen's d = ${results.effectSize?.toFixed(2)} cho thấy ${Math.abs(results.effectSize) > 0.8 ? 'hiệu ứng lớn' : Math.abs(results.effectSize) > 0.5 ? 'hiệu ứng trung bình' : 'hiệu ứng nhỏ'}.`
                        : `Không có sự khác biệt có ý nghĩa thống kê giữa ${columns[0]} và ${columns[1]} (p = ${pValue?.toFixed(4)} >= 0.05).`
                    }
                </p>
            </div>
        </div>
    );
}

// ANOVA Results Component
function ANOVAResults({ results, columns }: { results: any; columns: string[] }) {
    const pValue = results.pValue;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>ANOVA Table</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="py-2 text-left font-semibold">Source</th>
                                <th className="py-2 text-right font-semibold">df</th>
                                <th className="py-2 text-right font-semibold">F</th>
                                <th className="py-2 text-right font-semibold">Sig.</th>
                                <th className="py-2 text-right font-semibold">η² (Eta Squared)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Between Groups</td>
                                <td className="py-2 text-right">{results.dfBetween?.toFixed(0)}</td>
                                <td className="py-2 text-right font-bold">{results.F?.toFixed(3)}</td>
                                <td className={`py-2 text-right font-bold ${significant ? 'text-green-600' : 'text-gray-600'}`}>
                                    {pValue?.toFixed(4)} {significant && '***'}
                                </td>
                                <td className="py-2 text-right">{results.etaSquared?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Within Groups</td>
                                <td className="py-2 text-right">{results.dfWithin?.toFixed(0)}</td>
                                <td className="py-2 text-right">-</td>
                                <td className="py-2 text-right">-</td>
                                <td className="py-2 text-right">-</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Group Means</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="py-2 text-left font-semibold">Group</th>
                                <th className="py-2 text-right font-semibold">Mean</th>
                            </tr>
                        </thead>
                        <tbody>
                            {columns.map((col, idx) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-2 font-medium">{col}</td>
                                    <td className="py-2 text-right">{results.groupMeans?.[idx]?.toFixed(3)}</td>
                                </tr>
                            ))}
                            <tr className="bg-blue-50">
                                <td className="py-2 font-bold text-blue-900">Grand Mean</td>
                                <td className="py-2 text-right font-bold text-blue-900">{results.grandMean?.toFixed(3)}</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800 mb-2">
                    <strong>Kiểm định Bartlett (Phương sai):</strong> p = {results.assumptionCheckP?.toFixed(4)}.
                    {results.assumptionCheckP < 0.05
                        ? <span className="text-orange-600 font-bold"> Cảnh báo: Phương sai giữa các nhóm không đồng nhất (vi phạm giả định ANOVA).</span>
                        : <span className="text-green-700"> Phương sai đồng nhất (thỏa mãn giả định).</span>}
                </p>
                <p className="text-sm text-gray-800">
                    {significant
                        ? `Có sự khác biệt có ý nghĩa thống kê giữa các nhóm (F(${results.dfBetween?.toFixed(0)}, ${results.dfWithin?.toFixed(0)}) = ${results.F?.toFixed(3)}, p = ${pValue?.toFixed(4)} < 0.05). Eta-squared = ${results.etaSquared?.toFixed(3)} cho thấy ${results.etaSquared > 0.14 ? 'hiệu ứng lớn' : results.etaSquared > 0.06 ? 'hiệu ứng trung bình' : 'hiệu ứng nhỏ'}.`
                        : `Không có sự khác biệt có ý nghĩa thống kê giữa các nhóm (F(${results.dfBetween?.toFixed(0)}, ${results.dfWithin?.toFixed(0)}) = ${results.F?.toFixed(3)}, p = ${pValue?.toFixed(4)} >= 0.05).`
                    }
                </p>
            </div>
        </div>
    );
}

function CronbachResults({
    results,
    columns,
    onProceedToEFA,
    scaleName,
    analysisType
}: {
    results: any;
    columns?: string[];
    onProceedToEFA?: (goodItems: string[]) => void;
    scaleName?: string;
    analysisType?: string;
}) {
    const alpha = results.alpha || results.rawAlpha || 0;
    const nItems = results.nItems || 'N/A';
    const itemTotalStats = results.itemTotalStats || [];

    // Extract good items for workflow (memoized)
    const goodItems = useMemo(() =>
        itemTotalStats
            .filter((item: any) => item.correctedItemTotalCorrelation >= 0.3)
            .map((item: any, idx: number) => columns?.[idx] || item.itemName),
        [itemTotalStats, columns]
    );

    // SPSS Style Table Component
    const SPSSTable = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="mb-8">
            <h4 className="text-sm font-bold uppercase mb-2 tracking-wide text-gray-700">{title}</h4>
            <div className="bg-white border-t-2 border-b-2 border-black">
                {children}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 font-sans text-gray-900">
            {/* Reliability Statistics Table */}
            <Card>
                <CardHeader>
                    <CardTitle>{analysisType === 'omega' ? 'McDonald\'s Omega Reliability' : 'Reliability Statistics'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-2 pr-4 font-semibold text-gray-700">Measure</th>
                                <th className="py-2 pr-4 font-semibold text-gray-700">Value</th>
                                <th className="py-2 pr-4 font-semibold text-gray-700 pl-4 border-l border-gray-100">N of Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className={`py-2 pr-4 font-medium ${analysisType !== 'omega' ? 'text-black font-bold' : 'text-gray-600'}`}>Cronbach&apos;s Alpha</td>
                                <td className={`py-2 pr-4 ${analysisType !== 'omega' ? 'font-bold' : ''}`}>{alpha.toFixed(3)}</td>
                                <td className="py-2 pr-4 row-span-3 align-middle border-l border-gray-100 pl-4">{nItems}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className={`py-2 pr-4 font-medium ${analysisType === 'omega' ? 'text-black font-bold' : 'text-gray-600'}`}>McDonald&apos;s Omega (Total)</td>
                                <td className={`py-2 pr-4 ${analysisType === 'omega' ? 'font-bold' : ''}`}>{results.omega ? results.omega.toFixed(3) : '-'}</td>
                            </tr>
                            <tr>
                                <td className="py-2 pr-4 font-medium text-gray-400 text-xs">Omega Hierarchical</td>
                                <td className="py-2 pr-4 text-gray-400 text-xs">{results.omegaHierarchical ? results.omegaHierarchical.toFixed(3) : '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Item-Total Statistics Table */}
            {itemTotalStats.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Item-Total Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-3 px-4 font-semibold text-gray-700">Variable</th>
                                    <th className="py-3 px-4 font-semibold text-right text-gray-700">Scale Mean if Item Deleted</th>
                                    <th className="py-3 px-4 font-semibold text-right text-gray-700">Scale Variance if Item Deleted</th>
                                    <th className="py-3 px-4 font-semibold text-right text-gray-700">Corrected Item-Total Correlation</th>
                                    <th className="py-3 px-4 font-semibold text-right text-gray-700">Cronbach&apos;s Alpha if Item Deleted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemTotalStats.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-gray-900">
                                            {columns?.[idx] || item.itemName}
                                        </td>
                                        <td className="py-3 px-4 text-right text-gray-600">{item.scaleMeanIfDeleted?.toFixed(3) || '-'}</td>
                                        <td className="py-3 px-4 text-right text-gray-600">{item.scaleVarianceIfDeleted?.toFixed(3) || '-'}</td>
                                        <td className={`py-3 px-4 text-right ${item.correctedItemTotalCorrelation < 0.3 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                            {item.correctedItemTotalCorrelation?.toFixed(3) || '-'}
                                        </td>
                                        <td className={`py-3 px-4 text-right ${item.alphaIfItemDeleted > alpha ? 'text-orange-600 font-bold' : 'text-gray-600'}`}>
                                            {item.alphaIfItemDeleted?.toFixed(3) || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-xs text-gray-500 italic p-4 bg-gray-50 mt-4 rounded-md">
                            * Corrected Item-Total Correlation &lt; 0.3 được đánh dấu đỏ (cần xem xét loại bỏ).
                            Alpha if Item Deleted &gt; Alpha hiện tại được đánh dấu cam (loại bỏ có thể cải thiện độ tin cậy).
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Interpretation Section */}
            <TemplateInterpretation
                analysisType={analysisType || 'cronbach'}
                results={results}
                scaleName={scaleName || 'Thang đo'}
            />

            {/* Workflow: Next Step Button */}
            {goodItems.length >= 4 && onProceedToEFA && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 p-6 rounded-xl shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                            📊
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-blue-900 mb-2 text-lg">Bước tiếp theo được đề xuất</h4>
                            <p className="text-sm text-blue-700 mb-4">
                                Bạn có <strong>{goodItems.length} items đạt chuẩn</strong> (Corrected Item-Total Correlation ≥ 0.3).
                                Tiếp tục với <strong>EFA (Exploratory Factor Analysis)</strong> để khám phá cấu trúc nhân tố tiềm ẩn?
                            </p>
                            <button
                                onClick={() => onProceedToEFA(goodItems)}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <span>Chạy EFA với {goodItems.length} items tốt</span>
                                <span className="text-xl">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Template Interpretation */}
            <TemplateInterpretation
                analysisType={analysisType || 'cronbach'}
                results={results}
                scaleName={scaleName}
            />
        </div>
    );
}

function CorrelationResults({ results, columns }: { results: any; columns: string[] }) {
    const matrix = results.correlationMatrix;

    // SmartPLS/SPSS Style Matrix
    return (
        <div className="space-y-6 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b-2 border-black pb-2 inline-block">Ma Trận Tương Quan</h3>

            <table className="min-w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b-2 border-black">
                        <th className="py-3 px-4 text-left font-semibold bg-gray-50 border-r border-gray-200">Construct</th>
                        {columns.map((col, idx) => (
                            <th key={idx} className="py-3 px-4 font-semibold text-center border-b border-gray-300">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {matrix.map((row: number[], rowIdx: number) => (
                        <tr key={rowIdx} className="border-b border-gray-200 last:border-b-2 last:border-black">
                            <td className="py-3 px-4 font-medium border-r border-gray-200 bg-gray-50">
                                {columns[rowIdx]}
                            </td>
                            {row.map((value: number, colIdx: number) => {
                                const absVal = Math.abs(value);
                                let bgColor = 'transparent';
                                let textColor = 'text-gray-600';

                                if (rowIdx !== colIdx) {
                                    if (value > 0) {
                                        // Blue scale
                                        bgColor = `rgba(59, 130, 246, ${absVal * 0.8})`;
                                        textColor = absVal > 0.5 ? 'text-white font-bold' : 'text-gray-800';
                                    } else {
                                        // Red scale
                                        bgColor = `rgba(239, 68, 68, ${absVal * 0.8})`;
                                        textColor = absVal > 0.5 ? 'text-white font-bold' : 'text-gray-800';
                                    }
                                } else {
                                    return (
                                        <td key={colIdx} className="py-3 px-4 text-center bg-gray-100 font-bold text-gray-400">
                                            1.000
                                        </td>
                                    );
                                }

                                return (
                                    <td
                                        key={colIdx}
                                        className={`py-3 px-4 text-center ${textColor}`}
                                        style={{ backgroundColor: bgColor }}
                                    >
                                        {value.toFixed(3)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-4 items-center text-xs mt-3">
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-blue-500 opacity-80"></span>
                    <span>Tương quan Dương (Mạnh)</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-red-500 opacity-80"></span>
                    <span>Tương quan Âm (Mạnh)</span>
                </div>
            </div>
            <p className="text-xs text-gray-500 italic mt-1">* Màu sắc đậm nhạt thể hiện mức độ tương quan.</p>
        </div>
    );
}

function DescriptiveResults({ results, columns }: { results: any; columns: string[] }) {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Descriptive Statistics</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="py-3 px-4 font-semibold text-gray-700">Variable</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">N</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">Min</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">Max</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">Mean</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">SD</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">Skewness</th>
                                <th className="py-3 px-4 font-semibold text-right text-gray-700">Kurtosis</th>
                            </tr>
                        </thead>
                        <tbody>
                            {columns.map((col, idx) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 font-medium text-gray-900">{col}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{(results.N && results.N[idx] !== undefined) ? results.N[idx] : 'N/A'}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{(results.min && results.min[idx] !== undefined) ? results.min[idx].toFixed(3) : '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{(results.max && results.max[idx] !== undefined) ? results.max[idx].toFixed(3) : '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-900 font-bold">{(results.mean && results.mean[idx] !== undefined) ? results.mean[idx].toFixed(3) : '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{(results.sd && results.sd[idx] !== undefined) ? results.sd[idx].toFixed(3) : '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{(results.skew && results.skew[idx] !== undefined) ? results.skew[idx].toFixed(3) : '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{(results.kurtosis && results.kurtosis[idx] !== undefined) ? results.kurtosis[idx].toFixed(3) : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Mean Value Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80 w-full">
                        <Bar
                            data={{
                                labels: columns,
                                datasets: [{
                                    label: 'Mean',
                                    data: results.mean,
                                    backgroundColor: 'rgba(79, 70, 229, 0.7)', // Indigo-600 with opacity
                                    borderColor: 'rgba(79, 70, 229, 1)',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                        padding: 12,
                                        cornerRadius: 8,
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: '#f3f4f6' },
                                        ticks: { font: { size: 11 } }
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: { font: { size: 11 } }
                                    }
                                }
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Workflow: Proceed to EFA - MOVED/REMOVED (Misplaced in DescriptiveResults)
            {onProceedToEFA && goodItems.length >= 3 && (
                <Card className="border-2 border-green-500 bg-green-50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-green-800 mb-2">
                                    🎯 Workflow Mode: Tiếp tục sang EFA
                                </h3>
                                <p className="text-sm text-green-700">
                                    Phát hiện <strong>{goodItems.length} items tốt</strong> (r {'>'} 0.3).
                                    Bạn có thể tiếp tục sang Exploratory Factor Analysis (EFA) để khám phá cấu trúc nhân tố.
                                </p>
                            </div>
                            <button
                                onClick={() => onProceedToEFA(goodItems)}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-all hover:scale-105"
                            >
                                Proceed to EFA →
                            </button>
                        </div>
                    </CardContent>
                </Card>
            )}
            */}
        </div>
    );
}

// Paired T-test Results Component
function PairedTTestResults({ results, columns }: { results: any; columns: string[] }) {
    const pValue = results.pValue;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Paired Samples T-test Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Before ({columns[0]})</td>
                                <td className="py-2 text-right">Mean = {results.meanBefore?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">After ({columns[1]})</td>
                                <td className="py-2 text-right">Mean = {results.meanAfter?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Mean Difference (Before - After)</td>
                                <td className="py-2 text-right font-bold">{results.meanDiff?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">t-statistic</td>
                                <td className="py-2 text-right">{results.t?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Degrees of Freedom (df)</td>
                                <td className="py-2 text-right">{results.df?.toFixed(0)}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">p-value (2-tailed)</td>
                                <td className={`py-2 text-right font-bold ${significant ? 'text-green-600' : 'text-gray-600'}`}>
                                    {pValue?.toFixed(4)} {significant && '***'}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">95% CI</td>
                                <td className="py-2 text-right">[{results.ci95Lower?.toFixed(3)}, {results.ci95Upper?.toFixed(3)}]</td>
                            </tr>
                            <tr>
                                <td className="py-2 font-medium">Cohen&apos;s d (Effect Size)</td>
                                <td className="py-2 text-right">{results.effectSize?.toFixed(3)}</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800">
                    {significant
                        ? `Có sự thay đổi có ý nghĩa thống kê giữa trước (${columns[0]}) và sau (${columns[1]}) (p = ${pValue?.toFixed(4)} < 0.05). Trung bình thay đổi ${results.meanDiff > 0 ? 'giảm' : 'tăng'} ${Math.abs(results.meanDiff)?.toFixed(3)} đơn vị. Cohen's d = ${results.effectSize?.toFixed(2)} cho thấy ${Math.abs(results.effectSize) > 0.8 ? 'hiệu ứng lớn' : Math.abs(results.effectSize) > 0.5 ? 'hiệu ứng trung bình' : 'hiệu ứng nhỏ'}.`
                        : `Không có sự thay đổi có ý nghĩa thống kê giữa trước và sau (p = ${pValue?.toFixed(4)} >= 0.05).`
                    }
                </p>
            </div>
        </div>
    );
}

// EFA Results Component
function EFAResults({ results, columns, onProceedToCFA }: { results: any; columns: string[]; onProceedToCFA?: (factors: { name: string; indicators: string[] }[]) => void }) {
    const kmo = results.kmo || 0;
    const bartlettP = results.bartlettP || 1;
    const kmoAcceptable = kmo >= 0.6;
    const bartlettSignificant = bartlettP < 0.05;

    // Extract factor structure for workflow (memoized)
    const suggestedFactors = useMemo(() => {
        if (!results.loadings || !Array.isArray(results.loadings[0])) return [];

        const factors = [];
        const nFactors = results.nFactorsUsed || results.loadings[0].length; // Fallback

        for (let f = 0; f < nFactors; f++) {
            const indicators = columns.filter((col, i) =>
                results.loadings[i] && results.loadings[i][f] >= 0.5
            );
            if (indicators.length >= 3) {
                factors.push({
                    name: `Factor${f + 1}`,
                    indicators
                });
            }
        }
        return factors;
    }, [results.loadings, columns, results.nFactorsUsed]);

    return (
        <div className="space-y-6">
            {/* Eigenvalues & Extracted Factors - NEW */}
            {results.eigenvalues && results.eigenvalues.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Eigenvalues & Number of Factors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm text-gray-800">
                            <p>
                                <strong>Số lượng nhân tố được trích xuất:</strong> {results.nFactorsUsed}
                            </p>
                            <div>
                                <strong>Eigenvalues (Initial):</strong>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {results.eigenvalues.slice(0, 10).map((ev: number, i: number) => (
                                        <div
                                            key={i}
                                            className={`px-3 py-1 rounded border ${ev > 1 ? 'bg-green-100 border-green-300 text-green-800 font-bold' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                        >
                                            F{i + 1}: {ev.toFixed(3)}
                                        </div>
                                    ))}
                                    {results.eigenvalues.length > 10 && <span className="text-gray-400 self-center">...</span>}
                                </div>
                                <p className="text-xs text-gray-500 italic mt-2">
                                    * Các nhân tố có Eigenvalue {'>'} 1 được giữ lại theo tiêu chuẩn Kaiser.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            {/* KMO and Bartlett's Test */}
            <Card>
                <CardHeader>
                    <CardTitle>KMO and Bartlett&apos;s Test</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Kaiser-Meyer-Olkin Measure of Sampling Adequacy</td>
                                <td className={`py-2 text-right font-bold ${kmoAcceptable ? 'text-green-600' : 'text-red-600'}`}>
                                    {kmo.toFixed(3)}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-2 font-medium">Bartlett&apos;s Test of Sphericity (Sig.)</td>
                                <td className={`py-2 text-right font-bold ${bartlettSignificant ? 'text-green-600' : 'text-red-600'}`}>
                                    {bartlettP < 0.001 ? '< .001' : bartlettP.toFixed(4)} {bartlettSignificant && '***'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Loadings Matrix */}
            {results.loadings && (
                <Card>
                    <CardHeader>
                        <CardTitle>Factor Loadings (Rotated)</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-2 px-3 text-left font-semibold text-gray-700">Variable</th>
                                    {Array.isArray(results.loadings[0]) && results.loadings[0].map((_: any, idx: number) => (
                                        <th key={idx} className="py-2 px-3 text-right font-semibold text-gray-700">Factor {idx + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {columns.map((col, rowIdx) => (
                                    <tr key={rowIdx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-2 px-3 font-medium text-gray-900">{col}</td>
                                        {Array.isArray(results.loadings[rowIdx]) && results.loadings[rowIdx].map((val: number, colIdx: number) => (
                                            <td
                                                key={colIdx}
                                                className={`py-2 px-3 text-right ${Math.abs(val) >= 0.5 ? 'font-bold text-blue-700' : Math.abs(val) >= 0.3 ? 'text-gray-700' : 'text-gray-300'}`}
                                            >
                                                {val?.toFixed(3) || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-xs text-gray-500 italic mt-2 p-2 bg-gray-50 rounded">
                            * Factor loadings ≥ 0.5 được tô đậm. Loadings ≥ 0.3 được giữ lại.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Communalities */}
            {results.communalities && (
                <Card>
                    <CardHeader>
                        <CardTitle>Communalities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-2 px-3 text-left font-semibold">Variable</th>
                                    <th className="py-2 px-3 text-right font-semibold">Extraction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {columns.map((col, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-2 px-3 font-medium">{col}</td>
                                        <td className={`py-2 px-3 text-right ${results.communalities[idx] < 0.4 ? 'text-red-500 font-bold' : 'text-gray-700'}`}>
                                            {results.communalities[idx]?.toFixed(3) || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-xs text-gray-500 italic mt-2 p-2 bg-gray-50 rounded">
                            * Communality &lt; 0.4 được đánh dấu đỏ (biến giải thích kém).
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Interpretation */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Đánh giá & Khuyến nghị</h4>
                <div className="space-y-3 text-sm text-gray-800">
                    <p>
                        <strong>KMO = {kmo.toFixed(3)}:</strong>{' '}
                        {kmo >= 0.9 ? 'Tuyệt vời' : kmo >= 0.8 ? 'Rất tốt' : kmo >= 0.7 ? 'Tốt' : kmo >= 0.6 ? 'Chấp nhận được' : 'Không phù hợp để phân tích nhân tố'}
                    </p>
                    <p>
                        <strong>Bartlett&apos;s Test:</strong>{' '}
                        {bartlettSignificant
                            ? 'Có ý nghĩa thống kê (p < 0.05), ma trận tương quan phù hợp để phân tích nhân tố.'
                            : 'Không có ý nghĩa thống kê, dữ liệu có thể không phù hợp cho EFA.'
                        }
                    </p>
                    {kmoAcceptable && bartlettSignificant ? (
                        <p className="text-green-700 font-medium flex items-center gap-2">
                            <span>✓</span> Dữ liệu phù hợp để tiến hành phân tích nhân tố.
                        </p>
                    ) : (
                        <p className="text-red-600 font-medium flex items-center gap-2">
                            <span>✗</span> Dữ liệu có thể không phù hợp để phân tích nhân tố. Cần xem xét lại mẫu hoặc biến quan sát.
                        </p>
                    )}
                </div>
            </div>

            {/* Workflow: Next Step Button */}
            {suggestedFactors.length > 0 && onProceedToCFA && kmoAcceptable && bartlettSignificant && (
                <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 p-6 rounded-xl shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl">
                            ✓
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-green-900 mb-2 text-lg">Bước tiếp theo được đề xuất</h4>
                            <p className="text-sm text-green-700 mb-4">
                                EFA đã khám phá được <strong>{suggestedFactors.length} factors</strong> với cấu trúc rõ ràng (loadings ≥ 0.5).
                                Tiếp tục với <strong>CFA (Confirmatory Factor Analysis)</strong> để xác nhận mô hình này?
                            </p>
                            <button
                                onClick={() => onProceedToCFA(suggestedFactors)}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <span>Xác nhận bằng CFA ({suggestedFactors.length} factors)</span>
                                <span className="text-xl">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function RegressionResults({ results, columns }: { results: any, columns: string[] }) {
    if (!results || !results.modelFit) return null;

    const { modelFit, coefficients, equation } = results;

    return (
        <div className="space-y-8 font-sans">
            {/* Equation */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg text-white shadow-lg">
                <h4 className="font-bold text-sm uppercase tracking-wider mb-2 opacity-80">Phương trình hồi quy tuyến tính</h4>
                <div className="text-xl md:text-2xl font-mono font-bold break-all">
                    {equation}
                </div>
            </div>

            {/* Model Summary */}
            <div className="bg-white border-t-2 border-b-2 border-black p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-black inline-block pb-1">Model Summary</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">R Square</div>
                        <div className="text-2xl font-bold text-blue-700">{modelFit.rSquared.toFixed(3)}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">Adjusted R²</div>
                        <div className="text-2xl font-bold text-blue-600">{modelFit.adjRSquared.toFixed(3)}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">F Statistic</div>
                        <div className="text-xl font-bold text-gray-800">{modelFit.fStatistic.toFixed(2)}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">Sig. (ANOVA)</div>
                        <div className={`text-xl font-bold ${modelFit.pValue < 0.05 ? 'text-green-600' : 'text-red-500'}`}>
                            {modelFit.pValue < 0.001 ? '< .001' : modelFit.pValue.toFixed(3)}
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-500 italic mt-4 text-center">
                    Mô hình giải thích được <strong>{(modelFit.adjRSquared * 100).toFixed(1)}%</strong> biến thiên của biến phục thuộc.
                </p>
            </div>

            {/* Coefficients */}
            <div className="bg-white border-t-2 border-b-2 border-black p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-black inline-block pb-1">Coefficients</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-400 bg-gray-50">
                                <th className="py-3 px-4 text-left font-bold uppercase text-xs tracking-wider">Model</th>
                                <th className="py-3 px-4 text-right font-bold uppercase text-xs tracking-wider">Unstandardized B</th>
                                <th className="py-3 px-4 text-right font-bold uppercase text-xs tracking-wider">Std. Error</th>
                                <th className="py-3 px-4 text-right font-bold uppercase text-xs tracking-wider">t</th>
                                <th className="py-3 px-4 text-right font-bold uppercase text-xs tracking-wider">Sig.</th>
                                <th className="py-3 px-4 text-right font-bold uppercase text-xs tracking-wider text-purple-700">VIF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coefficients.map((coef: any, idx: number) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-gray-800">
                                        {coef.term === '(Intercept)' ? '(Constant)' : coef.term.replace(/`/g, '')}
                                    </td>
                                    <td className="py-3 px-4 text-right font-mono font-medium">
                                        {coef.estimate.toFixed(3)}
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-600">
                                        {coef.stdError.toFixed(3)}
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-600">
                                        {coef.tValue.toFixed(3)}
                                    </td>
                                    <td className={`py-3 px-4 text-right font-bold ${coef.pValue < 0.05 ? 'text-green-600' : 'text-gray-400'}`}>
                                        {coef.pValue < 0.001 ? '< .001' : coef.pValue.toFixed(3)}
                                    </td>
                                    <td className="py-3 px-4 text-right font-bold text-purple-700">
                                        {coef.vif ? coef.vif.toFixed(3) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assumption Checks Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-indigo-700">Kiểm định Giả định (Assumption Checks)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Normality */}
                        <div className="p-4 bg-gray-50 rounded border border-gray-100">
                            <h5 className="font-bold text-sm text-gray-700 mb-2">1. Phân phối chuẩn của phần dư (Normality)</h5>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Shapiro-Wilk Test:</span>
                                <span className={`font-bold ${modelFit.normalityP >= 0.05 ? 'text-green-600' : 'text-orange-500'}`}>
                                    p = {modelFit.normalityP?.toFixed(4)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 italic">
                                {modelFit.normalityP >= 0.05
                                    ? '✓ Phần dư có phân phối chuẩn (Tốt).'
                                    : '⚠ Phần dư không phân phối chuẩn (Cân nhắc cỡ mẫu lớn).'
                                }
                            </p>
                        </div>

                        {/* 2. Multicollinearity */}
                        <div className="p-4 bg-gray-50 rounded border border-gray-100">
                            <h5 className="font-bold text-sm text-gray-700 mb-2">2. Đa cộng tuyến (Multicollinearity)</h5>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">VIF Max:</span>
                                <span className="font-bold text-purple-700">
                                    {Math.max(...coefficients.map((c: any) => c.vif || 0)).toFixed(2)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 italic">
                                {Math.max(...coefficients.map((c: any) => c.vif || 0)) < 10
                                    ? '✓ Không có hiện tượng đa cộng tuyến nghiêm trọng (VIF < 10).'
                                    : '⚠ Cảnh báo đa cộng tuyến (VIF > 10).'
                                }
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Conclusion */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm">
                <h4 className="font-bold mb-3 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800">
                    <li>
                        Mô hình hồi quy <strong>{modelFit.pValue < 0.05 ? 'có ý nghĩa thống kê' : 'không có ý nghĩa thống kê'}</strong> (F = {modelFit.fStatistic.toFixed(2)}, p {modelFit.pValue < 0.001 ? '< .001' : `= ${modelFit.pValue.toFixed(3)}`}).
                    </li>
                    <li>
                        Các biến độc lập tác động có ý nghĩa (p &lt; 0.05):{' '}
                        {coefficients.filter((c: any) => c.term !== '(Intercept)' && c.pValue < 0.05).length > 0
                            ? coefficients
                                .filter((c: any) => c.term !== '(Intercept)' && c.pValue < 0.05)
                                .map((c: any) => c.term.replace(/`/g, ''))
                                .join(', ')
                            : 'Không có biến nào.'
                        }
                    </li>
                </ul>
            </div>

            {/* Charts: Actual vs Predicted */}
            {results.chartData && (
                <div className="bg-white border-t-2 border-b-2 border-black p-6 mt-8">
                    <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-black inline-block pb-1 mb-6">
                        Actual vs Predicted
                    </h3>
                    <div className="h-80 w-full">
                        <Scatter
                            data={{
                                datasets: [
                                    {
                                        label: 'Quan sát',
                                        data: results.chartData.actual.map((val: number, i: number) => ({
                                            x: results.chartData.fitted[i], // X = Predicted
                                            y: val // Y = Actual
                                        })),
                                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                                        borderColor: 'rgba(59, 130, 246, 1)',
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        title: { display: true, text: 'Giá trị Dự báo (Predicted)' }
                                    },
                                    y: {
                                        title: { display: true, text: 'Giá trị Thực tế (Actual)' }
                                    }
                                },
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                const point = context.raw as { x: number, y: number };
                                                return `Pred: ${point.x.toFixed(2)}, Act: ${point.y.toFixed(2)}`;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 italic mt-2 text-center">
                        Biểu đồ phân tán giữa giá trị dự báo và giá trị thực tế.
                    </p>
                </div>
            )}
        </div>
    );
}

function ChiSquareResults({ results }: { results: any }) {
    if (!results) return null;

    const { statistic, df, pValue, observed, expected } = results;

    return (
        <div className="space-y-8 font-sans">
            <div className="bg-white border-t-2 border-b-2 border-teal-600 p-6">
                <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-teal-600 inline-block pb-1 mb-4 text-teal-800">
                    Chi-Square Test Result
                </h3>
                <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="p-4 bg-teal-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">X-squared</div>
                        <div className="text-2xl font-bold text-teal-700">{statistic.toFixed(3)}</div>
                    </div>
                    <div className="p-4 bg-teal-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">df</div>
                        <div className="text-2xl font-bold text-teal-600">{df}</div>
                    </div>
                    <div className="p-4 bg-teal-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">p-value</div>
                        <div className={`text-xl font-bold ${pValue < 0.05 ? 'text-green-600' : 'text-red-500'}`}>
                            {pValue < 0.001 ? '< .001' : pValue.toFixed(4)}
                        </div>
                    </div>
                </div>
                {results.cramersV !== undefined && (
                    <div className="mt-6 text-center">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">Cramer&apos;s V (Effect Size)</div>
                        <div className="text-2xl font-bold text-teal-800">{results.cramersV.toFixed(3)}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            {results.cramersV > 0.5 ? '(Hiệu ứng mạnh)' : results.cramersV > 0.3 ? '(Hiệu ứng trung bình)' : '(Hiệu ứng yếu)'}
                        </p>
                    </div>
                )}
                <p className="text-sm text-gray-600 mt-4 text-center italic">
                    {pValue < 0.05
                        ? 'Có mối liên hệ có ý nghĩa thống kê giữa hai biến (H0 bị bác bỏ).'
                        : 'Không có mối liên hệ có ý nghĩa thống kê giữa hai biến (Chưa đủ bằng chứng bác bỏ H0).'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Observed Counts */}
                <div className="bg-white border border-gray-200 p-4 shadow-sm">
                    <h4 className="font-bold mb-3 text-teal-800 uppercase text-xs tracking-wider">Bảng Tần số Quan sát (Observed)</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border"></th>
                                    {observed.cols.map((c: string, i: number) => <th key={i} className="p-2 border font-semibold">{c}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {observed.rows.map((r: string, idx: number) => (
                                    <tr key={idx}>
                                        <td className="p-2 border font-semibold bg-gray-50">{r}</td>
                                        {observed.data[idx].map((val: number, i: number) => (
                                            <td key={i} className="p-2 border text-center">{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expected Counts */}
                <div className="bg-white border border-gray-200 p-4 shadow-sm">
                    <h4 className="font-bold mb-3 text-gray-600 uppercase text-xs tracking-wider">Bảng Tần số Kỳ vọng (Expected)</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border-collapse text-gray-500">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-2 border"></th>
                                    {expected.cols.map((c: string, i: number) => <th key={i} className="p-2 border font-medium">{c}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {expected.rows.map((r: string, idx: number) => (
                                    <tr key={idx}>
                                        <td className="p-2 border font-medium bg-gray-50">{r}</td>
                                        {expected.data[idx].map((val: number, i: number) => (
                                            <td key={i} className="p-2 border text-center">{val.toFixed(1)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MannWhitneyResults({ results, columns }: { results: any; columns: string[] }) {
    if (!results) return null;
    const { statistic, pValue, median1, median2, effectSize } = results;
    const significant = pValue < 0.05;

    return (
        <div className="space-y-8 font-sans">
            <div className="bg-white border-t-2 border-b-2 border-cyan-600 p-6">
                <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-cyan-600 inline-block pb-1 mb-4 text-cyan-800">
                    Mann-Whitney U Test
                </h3>
                <div className="grid grid-cols-3 gap-6 text-center max-w-2xl mx-auto">
                    <div className="p-4 bg-cyan-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">Statistic (W)</div>
                        <div className="text-2xl font-bold text-cyan-700">{statistic}</div>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">p-value</div>
                        <div className={`text-xl font-bold ${significant ? 'text-green-600' : 'text-gray-600'}`}>
                            {pValue < 0.001 ? '< .001' : pValue.toFixed(4)} {significant && '***'}
                        </div>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-1">Effect Size (r)</div>
                        <div className="text-2xl font-bold text-cyan-700">{effectSize?.toFixed(3)}</div>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center italic">
                    {significant
                        ? 'Có sự khác biệt có ý nghĩa thống kê về phân phối giữa hai nhóm (H0 bị bác bỏ).'
                        : 'Không có sự khác biệt có ý nghĩa thống kê giữa hai nhóm (Chưa đủ bằng chứng bác bỏ H0).'}
                </p>
            </div>

            <div className="bg-gray-50 p-6 border rounded-sm max-w-2xl mx-auto">
                <h4 className="font-bold mb-3 text-cyan-800 uppercase text-xs tracking-wider">Median Comparison</h4>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="py-2 text-left">Group</th>
                            <th className="py-2 text-right">Median</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100">
                            <td className="py-2 font-medium">{columns[0] || 'Group 1'}</td>
                            <td className="py-2 text-right font-bold text-gray-700">{median1?.toFixed(3)}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="py-2 font-medium">{columns[1] || 'Group 2'}</td>
                            <td className="py-2 text-right font-bold text-gray-700">{median2?.toFixed(3)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CFAResults({ results, onProceedToSEM }: { results: any; onProceedToSEM?: (factors: { name: string; indicators: string[] }[]) => void }) {
    if (!results) return null;
    const { fitMeasures, estimates } = results;

    const loadings = estimates.filter((e: any) => e.op === '=~');
    const covariances = estimates.filter((e: any) => e.op === '~~' && e.lhs !== e.rhs);

    // Extract factor structure for SEM (memoized)
    const factors = useMemo(() => {
        const factorMap: Record<string, string[]> = {};
        loadings.forEach((est: any) => {
            if (!factorMap[est.lhs]) factorMap[est.lhs] = [];
            factorMap[est.lhs].push(est.rhs);
        });
        return Object.entries(factorMap).map(([name, indicators]) => ({ name, indicators }));
    }, [loadings]);

    const fitGood = useMemo(() =>
        fitMeasures.cfi >= 0.9 && fitMeasures.rmsea <= 0.08,
        [fitMeasures.cfi, fitMeasures.rmsea]
    );

    // Helper to color fit indices
    const getFitColor = (val: number, type: 'high' | 'low') => {
        if (type === 'high') return val > 0.9 ? 'text-green-600' : val > 0.8 ? 'text-orange-500' : 'text-red-500';
        return val < 0.08 ? 'text-green-600' : val < 0.1 ? 'text-orange-500' : 'text-red-500';
    };

    return (
        <div className="space-y-8 font-sans">
            {/* 1. Model Fit Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-rose-700">Model Fit Indices (Độ phù hợp mô hình)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-gray-50 rounded border">
                            <div className="text-xs uppercase text-gray-500 font-bold">Chi-square / df</div>
                            <div className="text-xl font-bold text-gray-800">
                                {(fitMeasures.chisq / fitMeasures.df).toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-400">p = {fitMeasures.pvalue.toFixed(3)}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border">
                            <div className="text-xs uppercase text-gray-500 font-bold">CFI</div>
                            <div className={`text-xl font-bold ${getFitColor(fitMeasures.cfi, 'high')}`}>
                                {fitMeasures.cfi.toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-400">{'>'} 0.9 is good</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border">
                            <div className="text-xs uppercase text-gray-500 font-bold">TLI</div>
                            <div className={`text-xl font-bold ${getFitColor(fitMeasures.tli, 'high')}`}>
                                {fitMeasures.tli.toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-400">{'>'} 0.9 is good</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border">
                            <div className="text-xs uppercase text-gray-500 font-bold">RMSEA</div>
                            <div className={`text-xl font-bold ${getFitColor(fitMeasures.rmsea, 'low')}`}>
                                {fitMeasures.rmsea.toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-400">{'<'} 0.08 is good</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Factor Loadings Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-rose-700">Factor Loadings (Hệ số tải nhân tố)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-rose-50 border-b-2 border-rose-200 text-rose-800">
                                    <th className="py-3 px-4 text-left">Nhân tố (Latent)</th>
                                    <th className="py-3 px-4 text-center"></th>
                                    <th className="py-3 px-4 text-left">Biến quan sát (Indicator)</th>
                                    <th className="py-3 px-4 text-right">Estimate</th>
                                    <th className="py-3 px-4 text-right">Std. Estimate</th>
                                    <th className="py-3 px-4 text-right">S.E.</th>
                                    <th className="py-3 px-4 text-right">P-value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadings.map((est: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-rose-50/30 transition-colors">
                                        <td className="py-2 px-4 font-medium text-gray-800">{est.lhs}</td>
                                        <td className="py-2 px-4 text-center text-gray-400">⟶</td>
                                        <td className="py-2 px-4 text-gray-700">{est.rhs}</td>
                                        <td className="py-2 px-4 text-right">{est.est.toFixed(3)}</td>
                                        <td className={`py-2 px-4 text-right font-bold ${est.std > 0.5 ? 'text-green-600' : 'text-orange-500'}`}>
                                            {est.std.toFixed(3)}
                                        </td>
                                        <td className="py-2 px-4 text-right text-gray-500">{est.se.toFixed(3)}</td>
                                        <td className="py-2 px-4 text-right">
                                            {est.pvalue < 0.001 ? <span className="text-green-600 font-bold">{'< .001 ***'}</span> : est.pvalue.toFixed(3)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Covariances (Optional) */}
            {covariances.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-rose-700">Covariances (Hiệp phương sai)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="py-2 px-4 text-left">Quan hệ</th>
                                        <th className="py-2 px-4 text-right">Estimate</th>
                                        <th className="py-2 px-4 text-right">Std. Estimate (Correlation)</th>
                                        <th className="py-2 px-4 text-right">P-value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {covariances.map((est: any, idx: number) => (
                                        <tr key={idx} className="border-b border-gray-100">
                                            <td className="py-2 px-4 font-medium">
                                                {est.lhs} <span className="mx-2 text-gray-400">⟷</span> {est.rhs}
                                            </td>
                                            <td className="py-2 px-4 text-right">{est.est.toFixed(3)}</td>
                                            <td className="py-2 px-4 text-right font-bold">{est.std.toFixed(3)}</td>
                                            <td className="py-2 px-4 text-right">
                                                {est.pvalue < 0.001 ? '< .001' : est.pvalue.toFixed(3)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Workflow: Next Step Button */}
            {factors.length > 0 && onProceedToSEM && fitGood && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 p-6 rounded-xl shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                            🎯
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-purple-900 mb-2 text-lg">Bước tiếp theo được đề xuất</h4>
                            <p className="text-sm text-purple-700 mb-4">
                                Mô hình CFA đã được xác nhận với <strong>fit tốt</strong> (CFI ≥ 0.9, RMSEA ≤ 0.08).
                                Tiếp tục với <strong>SEM (Structural Equation Modeling)</strong> để kiểm định mối quan hệ nhân quả giữa các nhân tố?
                            </p>
                            <button
                                onClick={() => onProceedToSEM(factors)}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <span>Xây dựng SEM với {factors.length} factors</span>
                                <span className="text-xl">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// SEM Results Component
function SEMResults({ results }: { results: any }) {
    if (!results) return null;
    const { fitMeasures, estimates } = results;

    // Filter estimates
    const structuralPaths = estimates.filter((e: any) => e.op === '~');
    const loadings = estimates.filter((e: any) => e.op === '=~');
    const covariances = estimates.filter((e: any) => e.op === '~~' && e.lhs !== e.rhs);

    // Prepare data for diagram
    const diagramFactors = useMemo(() => {
        const factorMap: Record<string, string[]> = {};
        loadings.forEach((est: any) => {
            if (!factorMap[est.lhs]) factorMap[est.lhs] = [];
            factorMap[est.lhs].push(est.rhs);
        });
        return Object.entries(factorMap).map(([name, indicators]) => ({ name, indicators }));
    }, [loadings]);

    const diagramPaths = useMemo(() =>
        structuralPaths.map((p: any) => ({
            from: p.rhs,
            to: p.lhs,
            beta: p.std || p.est,
            pvalue: p.pvalue || 0
        })),
        [structuralPaths]
    );

    const diagramLoadings = useMemo(() =>
        loadings.map((l: any) => ({
            factor: l.lhs,
            indicator: l.rhs,
            loading: l.std || l.est
        })),
        [loadings]
    );

    // Helper to color fit indices (same as CFA)
    const getFitColor = (val: number, type: 'high' | 'low') => {
        if (type === 'high') return val > 0.9 ? 'text-green-600' : val > 0.8 ? 'text-orange-500' : 'text-red-500';
        return val < 0.08 ? 'text-green-600' : val < 0.1 ? 'text-orange-500' : 'text-red-500';
    };

    return (
        <div className="space-y-8 font-sans">
            {/* 0. SEM Path Diagram */}
            {diagramFactors.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-violet-700">SEM Path Diagram</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SEMPathDiagram
                            factors={diagramFactors}
                            structuralPaths={diagramPaths}
                            factorLoadings={diagramLoadings}
                        />
                    </CardContent>
                </Card>
            )}

            {/* 1. Model Fit Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-violet-700">Model Fit Indices (Độ phù hợp mô hình)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-gray-50 rounded border">
                            <div className="text-xs uppercase text-gray-500 font-bold">Chi-square / df</div>
                            <div className="text-xl font-bold text-gray-800">
                                {(fitMeasures.chisq / fitMeasures.df).toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-400">p = {fitMeasures.pvalue.toFixed(3)}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border">
                            <div className="text-xs uppercase text-gray-500 font-bold">CFI</div>
                            <div className={`text-xl font-bold ${getFitColor(fitMeasures.cfi, 'high')}`}>
                                {fitMeasures.cfi.toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-400">{'>'} 0.9 is good</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border">
                            <div className="text-xs uppercase text-gray-500 font-bold">TLI</div>
                            <div className={`text-xl font-bold ${getFitColor(fitMeasures.tli, 'high')}`}>
                                {fitMeasures.tli.toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-400">{'>'} 0.9 is good</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border">
                            <div className="text-xs uppercase text-gray-500 font-bold">RMSEA</div>
                            <div className={`text-xl font-bold ${getFitColor(fitMeasures.rmsea, 'low')}`}>
                                {fitMeasures.rmsea.toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-400">{'<'} 0.08 is good</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Structural Paths (Regressions) */}
            {structuralPaths.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-violet-700">Structural Paths (Mối quan hệ tác động)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-violet-50 border-b-2 border-violet-200 text-violet-800">
                                        <th className="py-3 px-4 text-left">Phụ thuộc (DV)</th>
                                        <th className="py-3 px-4 text-center"></th>
                                        <th className="py-3 px-4 text-left">Độc lập (IV)</th>
                                        <th className="py-3 px-4 text-right">Estimate</th>
                                        <th className="py-3 px-4 text-right">Std. Estimate (Beta)</th>
                                        <th className="py-3 px-4 text-right">S.E.</th>
                                        <th className="py-3 px-4 text-right">P-value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {structuralPaths.map((est: any, idx: number) => (
                                        <tr key={idx} className="border-b border-gray-100 hover:bg-violet-50/30 transition-colors">
                                            <td className="py-2 px-4 font-bold text-gray-800">{est.lhs}</td>
                                            <td className="py-2 px-4 text-center text-gray-400">⟵</td>
                                            <td className="py-2 px-4 text-gray-700">{est.rhs}</td>
                                            <td className="py-2 px-4 text-right">{est.est.toFixed(3)}</td>
                                            <td className={`py-2 px-4 text-right font-bold ${est.pvalue < 0.05 ? 'text-green-600' : 'text-gray-500'}`}>
                                                {est.std.toFixed(3)}
                                            </td>
                                            <td className="py-2 px-4 text-right text-gray-500">{est.se.toFixed(3)}</td>
                                            <td className="py-2 px-4 text-right">
                                                {est.pvalue < 0.001 ? <span className="text-green-600 font-bold">{'< .001 ***'}</span> : est.pvalue.toFixed(3)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 3. Measurement Model (Loadings) */}
            {loadings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-violet-700">Measurement Model (Mô hình đo lường)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="py-2 px-4 text-left">Nhân tố (Latent)</th>
                                        <th className="py-2 px-4 text-center"></th>
                                        <th className="py-2 px-4 text-left">Biến quan sát (Indicator)</th>
                                        <th className="py-2 px-4 text-right">Std. Estimate</th>
                                        <th className="py-2 px-4 text-right">P-value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadings.map((est: any, idx: number) => (
                                        <tr key={idx} className="border-b border-gray-100">
                                            <td className="py-2 px-4 font-medium text-gray-600">{est.lhs}</td>
                                            <td className="py-2 px-4 text-center text-gray-300">⟶</td>
                                            <td className="py-2 px-4 text-gray-500">{est.rhs}</td>
                                            <td className={`py-2 px-4 text-right ${est.std > 0.5 ? 'text-gray-800' : 'text-red-400'}`}>
                                                {est.std.toFixed(3)}
                                            </td>
                                            <td className="py-2 px-4 text-right text-gray-500">
                                                {est.pvalue < 0.001 ? '< .001' : est.pvalue.toFixed(3)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Moderation Analysis Results Component
function ModerationResults({ results, columns }: { results: any; columns: string[] }) {
    const interactionP = results.interactionP;
    const significant = interactionP < 0.05;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Moderation Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Mô hình:</strong> {columns[0]} = b0 + b1*{columns[1]} + b2*{columns[2]} + b3*({columns[1]}×{columns[2]})
                        </p>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="py-2 text-left font-semibold">Term</th>
                                <th className="py-2 text-right font-semibold">Estimate</th>
                                <th className="py-2 text-right font-semibold">Std. Error</th>
                                <th className="py-2 text-right font-semibold">t</th>
                                <th className="py-2 text-right font-semibold">p-value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 font-medium">(Intercept)</td>
                                <td className="py-2 text-right">{results.interceptEst?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.interceptSE?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.interceptT?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.interceptP?.toFixed(4)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 font-medium">{columns[1]} (X)</td>
                                <td className="py-2 text-right">{results.xEst?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.xSE?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.xT?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.xP?.toFixed(4)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 font-medium">{columns[2]} (W)</td>
                                <td className="py-2 text-right">{results.wEst?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.wSE?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.wT?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.wP?.toFixed(4)}</td>
                            </tr>
                            <tr className={`border-b border-gray-200 ${significant ? 'bg-green-50' : ''}`}>
                                <td className="py-2 font-bold">X × W (Interaction)</td>
                                <td className="py-2 text-right font-bold">{results.interactionEst?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.interactionSE?.toFixed(4)}</td>
                                <td className="py-2 text-right">{results.interactionT?.toFixed(3)}</td>
                                <td className={`py-2 text-right font-bold ${significant ? 'text-green-600' : 'text-gray-600'}`}>
                                    {interactionP?.toFixed(4)} {significant && '***'}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded">
                            <span className="font-medium">R²:</span> {results.rSquared?.toFixed(4)}
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <span className="font-medium">Adjusted R²:</span> {results.rSquaredAdj?.toFixed(4)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800">
                    {significant
                        ? `Có hiệu ứng điều tiết có ý nghĩa thống kê (p = ${interactionP?.toFixed(4)} < 0.05). Biến ${columns[2]} điều tiết mối quan hệ giữa ${columns[1]} và ${columns[0]}.`
                        : `Không có hiệu ứng điều tiết có ý nghĩa thống kê (p = ${interactionP?.toFixed(4)} >= 0.05). Biến ${columns[2]} không điều tiết mối quan hệ giữa ${columns[1]} và ${columns[0]}.`
                    }
                </p>
            </div>
        </div>
    );
}

// Two-Way ANOVA Results Component
function TwoWayANOVAResults({ results, columns }: { results: any; columns: string[] }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Two-Way ANOVA Table</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="py-2 text-left font-semibold">Source</th>
                                <th className="py-2 text-right font-semibold">df</th>
                                <th className="py-2 text-right font-semibold">Sum Sq</th>
                                <th className="py-2 text-right font-semibold">Mean Sq</th>
                                <th className="py-2 text-right font-semibold">F</th>
                                <th className="py-2 text-right font-semibold">p-value</th>
                                <th className="py-2 text-right font-semibold">η²</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 font-medium">{columns[1]} (Factor 1)</td>
                                <td className="py-2 text-right">{results.factor1Df}</td>
                                <td className="py-2 text-right">{results.factor1SS?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.factor1MS?.toFixed(3)}</td>
                                <td className="py-2 text-right font-bold">{results.factor1F?.toFixed(3)}</td>
                                <td className={`py-2 text-right font-bold ${results.factor1P < 0.05 ? 'text-green-600' : 'text-gray-600'}`}>
                                    {results.factor1P?.toFixed(4)} {results.factor1P < 0.05 && '***'}
                                </td>
                                <td className="py-2 text-right">{results.factor1Eta?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 font-medium">{columns[2]} (Factor 2)</td>
                                <td className="py-2 text-right">{results.factor2Df}</td>
                                <td className="py-2 text-right">{results.factor2SS?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.factor2MS?.toFixed(3)}</td>
                                <td className="py-2 text-right font-bold">{results.factor2F?.toFixed(3)}</td>
                                <td className={`py-2 text-right font-bold ${results.factor2P < 0.05 ? 'text-green-600' : 'text-gray-600'}`}>
                                    {results.factor2P?.toFixed(4)} {results.factor2P < 0.05 && '***'}
                                </td>
                                <td className="py-2 text-right">{results.factor2Eta?.toFixed(3)}</td>
                            </tr>
                            <tr className={`border-b border-gray-200 ${results.interactionP < 0.05 ? 'bg-yellow-50' : ''}`}>
                                <td className="py-2 font-bold">Interaction</td>
                                <td className="py-2 text-right">{results.interactionDf}</td>
                                <td className="py-2 text-right">{results.interactionSS?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.interactionMS?.toFixed(3)}</td>
                                <td className="py-2 text-right font-bold">{results.interactionF?.toFixed(3)}</td>
                                <td className={`py-2 text-right font-bold ${results.interactionP < 0.05 ? 'text-orange-600' : 'text-gray-600'}`}>
                                    {results.interactionP?.toFixed(4)} {results.interactionP < 0.05 && '***'}
                                </td>
                                <td className="py-2 text-right">{results.interactionEta?.toFixed(3)}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 font-medium">Residuals</td>
                                <td className="py-2 text-right">{results.residualDf}</td>
                                <td className="py-2 text-right">{results.residualSS?.toFixed(3)}</td>
                                <td className="py-2 text-right">{results.residualMS?.toFixed(3)}</td>
                                <td className="py-2 text-right">-</td>
                                <td className="py-2 text-right">-</td>
                                <td className="py-2 text-right">-</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <ul className="text-sm text-gray-800 space-y-2">
                    <li>
                        <strong>Main Effect {columns[1]}:</strong> {results.factor1P < 0.05
                            ? `Có ý nghĩa (p = ${results.factor1P?.toFixed(4)})`
                            : `Không có ý nghĩa (p = ${results.factor1P?.toFixed(4)})`}
                    </li>
                    <li>
                        <strong>Main Effect {columns[2]}:</strong> {results.factor2P < 0.05
                            ? `Có ý nghĩa (p = ${results.factor2P?.toFixed(4)})`
                            : `Không có ý nghĩa (p = ${results.factor2P?.toFixed(4)})`}
                    </li>
                    <li>
                        <strong>Interaction Effect:</strong> {results.interactionP < 0.05
                            ? `Có ý nghĩa (p = ${results.interactionP?.toFixed(4)}) - Cần phân tích Simple Effects`
                            : `Không có ý nghĩa (p = ${results.interactionP?.toFixed(4)})`}
                    </li>
                </ul>
            </div>
        </div>
    );
}

// Cluster Analysis Results Component
function ClusterResults({ results, columns }: { results: any; columns: string[] }) {
    const k = results.k || 3;
    const clusterSizes = results.clusterSizes || [];
    const centers = results.centers || [];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cluster Analysis Summary (K-Means, k={k})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">{k}</div>
                            <div className="text-xs text-blue-600">Clusters</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">{results.totalN || 'N/A'}</div>
                            <div className="text-xs text-green-600">Total Observations</div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">{results.betweenSS?.toFixed(1) || 'N/A'}</div>
                            <div className="text-xs text-purple-600">Between SS</div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg text-center">
                            <div className="text-2xl font-bold text-orange-600">{results.withinSS?.toFixed(1) || 'N/A'}</div>
                            <div className="text-xs text-orange-600">Within SS</div>
                        </div>
                    </div>

                    <h4 className="font-semibold mb-2">Cluster Sizes</h4>
                    <div className="flex gap-2 mb-6">
                        {clusterSizes.map((size: number, idx: number) => (
                            <div key={idx} className="px-4 py-2 bg-gray-100 rounded-lg text-center">
                                <span className="font-bold">Cluster {idx + 1}:</span> {size}
                            </div>
                        ))}
                    </div>

                    <h4 className="font-semibold mb-2">Cluster Centers</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-2 px-3 text-left font-semibold">Cluster</th>
                                    {columns.map((col, idx) => (
                                        <th key={idx} className="py-2 px-3 text-right font-semibold">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {centers.map((center: number[], cIdx: number) => (
                                    <tr key={cIdx} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-2 px-3 font-medium">Cluster {cIdx + 1}</td>
                                        {center.map((val: number, vIdx: number) => (
                                            <td key={vIdx} className="py-2 px-3 text-right">
                                                {typeof val === 'number' ? val.toFixed(3) : val}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800">
                    Dữ liệu được phân thành <strong>{k} cụm</strong> sử dụng thuật toán K-Means.
                    Các cụm có kích thước: {clusterSizes.join(', ')}.
                    Xem bảng Cluster Centers để hiểu đặc điểm của từng cụm dựa trên giá trị trung bình của các biến.
                </p>
            </div>
        </div>
    );
}

// Mediation Analysis Results Component
function MediationResults({ results, columns }: { results: any; columns: string[] }) {
    // columns: [X, M, Y]
    const sobelP = results.sobelP;
    const significant = sobelP < 0.05;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Mediation Analysis Results (Baron & Kenny)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Mô hình:</strong> {columns[0]} (X) → {columns[1]} (M) → {columns[2]} (Y)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 border-b pb-2">Path Coefficients</h4>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Path a (X → M):</span>
                                    <span className="text-sm">{results.paths?.a?.est?.toFixed(4)} (p={results.paths?.a?.p?.toFixed(4)})</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Path b (M → Y):</span>
                                    <span className="text-sm">{results.paths?.b?.est?.toFixed(4)} (p={results.paths?.b?.p?.toFixed(4)})</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Path c (Total Effect):</span>
                                    <span className="text-sm">{results.paths?.c_prime?.est?.toFixed(4)} (p={results.paths?.c_prime?.p?.toFixed(4)})</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Path c&apos; (Direct Effect):</span>
                                    <span className="text-sm">{results.paths?.c?.est?.toFixed(4)} (p={results.paths?.c?.p?.toFixed(4)})</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 border-b pb-2">Indirect Effect</h4>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Estimate (a × b):</span>
                                    <span className="text-sm font-bold">{results.indirectEffect?.est?.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Sobel Test Z:</span>
                                    <span className="text-sm">{results.sobelZ?.toFixed(3)}</span>
                                </div>
                                <div className={`flex justify-between items-center p-2 rounded ${significant ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                    <span className="text-sm font-bold">Sobel p-value:</span>
                                    <span className="text-sm font-bold">{sobelP?.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Mediation Type:</span>
                                    <span className="text-sm uppercase font-bold text-blue-600">{results.mediationType}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold mb-4 text-gray-800 uppercase text-xs tracking-wider">Kết luận</h4>
                <p className="text-sm text-gray-800">
                    {significant
                        ? `Có hiệu ứng trung gian có ý nghĩa thống kê (Sobel p = ${sobelP?.toFixed(4)} < 0.05). Biến ${columns[1]} là trung gian ${results.mediationType === 'full' ? 'toàn phần' : 'một phần'} trong mối quan hệ giữa ${columns[0]} và ${columns[2]}.`
                        : `Không có hiệu ứng trung gian có ý nghĩa thống kê (Sobel p = ${sobelP?.toFixed(4)} >= 0.05).`
                    }
                </p>
            </div>
        </div>
    );
}

// Logistic Regression Results Component
function LogisticResults({ results, columns }: { results: any; columns: string[] }) {
    // columns: [Y, X1, X2...]

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Logistic Regression Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm mb-6">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="py-2 text-left font-semibold">Variable</th>
                                <th className="py-2 text-right font-semibold">Estimate</th>
                                <th className="py-2 text-right font-semibold">Std. Error</th>
                                <th className="py-2 text-right font-semibold">z-value</th>
                                <th className="py-2 text-right font-semibold">p-value</th>
                                <th className="py-2 text-right font-semibold">Odds Ratio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.coefficients?.map((coeff: any, idx: number) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-2 font-medium">{coeff.term}</td>
                                    <td className="py-2 text-right">{coeff.estimate?.toFixed(4)}</td>
                                    <td className="py-2 text-right">{coeff.stdError?.toFixed(4)}</td>
                                    <td className="py-2 text-right">{coeff.zValue?.toFixed(3)}</td>
                                    <td className={`py-2 text-right ${coeff.pValue < 0.05 ? 'font-bold text-green-600' : ''}`}>
                                        {coeff.pValue?.toFixed(4)} {coeff.pValue < 0.05 && '***'}
                                    </td>
                                    <td className="py-2 text-right font-medium text-blue-600">
                                        {coeff.oddsRatio?.toFixed(4)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-3 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500">AIC</div>
                            <div className="font-bold">{results.modelFit?.aic?.toFixed(2)}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500">Pseudo R² (McFadden)</div>
                            <div className="font-bold">{results.modelFit?.pseudoR2?.toFixed(4)}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500">Accuracy</div>
                            <div className={`font-bold ${results.modelFit?.accuracy > 0.7 ? 'text-green-600' : ''}`}>
                                {(results.modelFit?.accuracy * 100)?.toFixed(2)}%
                            </div>
                        </div>
                    </div>

                    {results.confusionMatrix && (
                        <div className="border rounded-lg p-4 max-w-md mx-auto">
                            <h4 className="text-center font-semibold mb-3">Confusion Matrix</h4>
                            <div className="grid grid-cols-2 gap-2 text-center text-sm">
                                <div className="bg-green-50 p-2 rounded">
                                    <div className="font-bold text-green-700">{results.confusionMatrix.trueNegative}</div>
                                    <div className="text-xs">True Negative</div>
                                </div>
                                <div className="bg-red-50 p-2 rounded">
                                    <div className="font-bold text-red-700">{results.confusionMatrix.falsePositive}</div>
                                    <div className="text-xs">False Positive</div>
                                </div>
                                <div className="bg-red-50 p-2 rounded">
                                    <div className="font-bold text-red-700">{results.confusionMatrix.falseNegative}</div>
                                    <div className="text-xs">False Negative</div>
                                </div>
                                <div className="bg-green-50 p-2 rounded">
                                    <div className="font-bold text-green-700">{results.confusionMatrix.truePositive}</div>
                                    <div className="text-xs">True Positive</div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
