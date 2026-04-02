'use client';

import React, { useMemo, lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AIInterpretation } from './AIInterpretation';
import { TemplateInterpretation } from './TemplateInterpretation';
import SEMPathDiagram from './SEMPathDiagram';

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

    const display = useMemo(() => {
        if (!results) return null;

        switch (analysisType) {
            case 'ttest-indep':
                return <TTestResults results={results} />;
            case 'ttest-paired':
                return <PairedTTestResults results={results} columns={results.columns || []} />;
            case 'anova':
                return <ANOVAResults results={results} />;
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
                return <KruskalWallisResults results={results} />;
            case 'wilcoxon':
                return <WilcoxonResults results={results} />;
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
    }, [results, analysisType, onProceedToEFA, onProceedToCFA, onProceedToSEM, columns, scaleName]);

    return (
        <div id="analysis-results-container" className="space-y-8">
            <Suspense fallback={<LoadingSkeleton />}>
                {display}
            </Suspense>

            {/* R Syntax Viewer - Researcher Only */}
            {results?.rCode && (
                <RSyntaxViewer code={results.rCode} userProfile={userProfile} />
            )}

            {/* Template-based Interpretation (INSTANT, FREE) */}
            <TemplateInterpretation
                analysisType={analysisType}
                results={results}
                scaleName={scaleName || 'Thang đo'}
                variableNames={{
                    targetVar: columns?.[0] || 'Biến phụ thuộc',
                    factor1: columns?.[1] || 'Yếu tố 1',
                    factor2: columns?.[2] || 'Yếu tố 2',
                    dependent: columns?.[0] || 'Y'
                }}
            />

            {/* AI Interpretation (Optional Premium - requires API key) */}
            <AIInterpretation analysisType={analysisType} results={results} userProfile={userProfile} />
        </div>
    );
}
