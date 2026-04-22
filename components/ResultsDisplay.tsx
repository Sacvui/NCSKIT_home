'use client';

import React, { useMemo, lazy, Suspense, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AIInterpretation } from './AIInterpretation';
import { TemplateInterpretation } from './TemplateInterpretation';
import SEMPathDiagram from './SEMPathDiagram';
import { Maximize2, Minimize2 } from 'lucide-react';

// Shared components (eager load - small and frequently used)
import { RSyntaxViewer } from './results/shared/RSyntaxViewer';

// Lazy load all analysis components for code splitting
const LoadingSkeleton = lazy(() => import('./results/LoadingSkeleton'));
const TTestResults = lazy(() => import('./results/basic/TTestResults').then(m => ({ default: m.TTestResults })));
const PairedTTestResults = lazy(() => import('./results/basic/PairedTTestResults').then(m => ({ default: m.PairedTTestResults })));
const ANOVAResults = lazy(() => import('./results/basic/ANOVAResults').then(m => ({ default: m.ANOVAResults })));
const TwoWayANOVAResults = lazy(() => import('./results/basic/TwoWayANOVAResults').then(m => ({ default: m.TwoWayANOVAResults })));
const CorrelationResults = lazy(() => import('./results/basic/CorrelationResults').then(m => ({ default: m.CorrelationResults })));
const DescriptiveResults = lazy(() => import('./results/basic/DescriptiveResults').then(m => ({ default: m.DescriptiveResults })));
const CronbachResults = lazy(() => import('./results/reliability/CronbachResults').then(m => ({ default: m.CronbachResults })));
const EFAResults = lazy(() => import('./results/factor/EFAResults').then(m => ({ default: m.EFAResults })));
const CFAResults = lazy(() => import('./results/factor/CFAResults').then(m => ({ default: m.CFAResults })));
const SEMResults = lazy(() => import('./results/factor/SEMResults').then(m => ({ default: m.SEMResults })));
const RegressionResults = lazy(() => import('./results/regression/RegressionResults').then(m => ({ default: m.RegressionResults })));
const LogisticResults = lazy(() => import('./results/regression/LogisticResults').then(m => ({ default: m.LogisticResults })));
const ModerationResults = lazy(() => import('./results/regression/ModerationResults').then(m => ({ default: m.ModerationResults })));
const MediationResults = lazy(() => import('./results/mediation/MediationResults').then(m => ({ default: m.MediationResults })));
const ChiSquareResults = lazy(() => import('./results/nonparametric/ChiSquareResults').then(m => ({ default: m.ChiSquareResults })));
const MannWhitneyResults = lazy(() => import('./results/nonparametric/MannWhitneyResults').then(m => ({ default: m.MannWhitneyResults })));
const KruskalWallisResults = lazy(() => import('./results/nonparametric/KruskalWallisResults').then(m => ({ default: m.KruskalWallisResults })));
const WilcoxonResults = lazy(() => import('./results/nonparametric/WilcoxonResults').then(m => ({ default: m.WilcoxonResults })));
const ClusterResults = lazy(() => import('./results/cluster/ClusterResults').then(m => ({ default: m.ClusterResults })));


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
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Prevent body scroll when fullscreen
    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFullscreen]);

    const display = useMemo(() => {
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
            case 'kruskal-wallis':
                return <KruskalWallisResults results={results} columns={results.columns || []} />;
            case 'wilcoxon':
                return <WilcoxonResults results={results} columns={results.columns || []} />;
            case 'chisquare':
                return <ChiSquareResults results={results} columns={results.columns || []} />;
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
    }, [results, analysisType, onProceedToEFA, onProceedToCFA, onProceedToSEM, columns, scaleName]);

    return (
        <div 
            id="analysis-results-container" 
            className={`space-y-6 md:space-y-8 ${isFullscreen ? 'fixed inset-0 z-[100] bg-slate-50 p-3 md:p-6 overflow-y-auto w-full h-full' : ''}`}
        >
            {/* Contextual Header for Fullscreen Mode */}
            {isFullscreen ? (
                <div className="flex justify-between items-center sticky top-0 bg-slate-50/95 backdrop-blur-sm pb-4 pt-2 z-10 border-b border-slate-200 mb-6">
                    <div className="flex flex-col">
                        <h2 className="text-sm md:text-lg font-black text-blue-900 uppercase tracking-tight">Kết quả chi tiết</h2>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">NCSKit Academic Engine</span>
                    </div>
                    <button 
                        onClick={() => setIsFullscreen(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg font-bold text-xs md:text-sm active:scale-95 transition-all"
                    >
                        <Minimize2 className="w-4 h-4" /> Đóng
                    </button>
                </div>
            ) : (
                <div className="flex justify-end mb-[-1.5rem] md:mb-[-1rem]">
                    <button 
                        onClick={() => setIsFullscreen(true)}
                        className="flex items-center gap-2 px-4 py-2 md:px-3 md:py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl shadow-sm hover:bg-blue-100 font-bold text-xs relative z-10 transition-all active:scale-95"
                        title="Hiển thị full bảng"
                    >
                        <Maximize2 className="w-4 h-4" /> Xem toàn màn hình
                    </button>
                </div>
            )}
            <Suspense fallback={<LoadingSkeleton />}>
                {display}
            </Suspense>

            {/* R Syntax Viewer - Researcher Only */}
            {results?.rCode && (
                <RSyntaxViewer code={results.rCode} userProfile={userProfile} />
            )}

            {/* AI Interpretation (Optional Premium - requires API key) */}
            <AIInterpretation analysisType={analysisType} results={results} userProfile={userProfile} />
        </div>
    );
}
