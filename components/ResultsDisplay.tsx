'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { AIInterpretation } from './AIInterpretation';
import { TemplateInterpretation } from './TemplateInterpretation';
import SEMPathDiagram from './SEMPathDiagram';

// Import all extracted components
import { RSyntaxViewer } from './results/shared/RSyntaxViewer';
import { TTestResults } from './results/basic/TTestResults';
import { PairedTTestResults } from './results/basic/PairedTTestResults';
import { ANOVAResults } from './results/basic/ANOVAResults';
import { TwoWayANOVAResults } from './results/basic/TwoWayANOVAResults';
import { CorrelationResults } from './results/basic/CorrelationResults';
import { DescriptiveResults } from './results/basic/DescriptiveResults';
import { CronbachResults } from './results/reliability/CronbachResults';
import { EFAResults } from './results/factor/EFAResults';
import { CFAResults } from './results/factor/CFAResults';
import { SEMResults } from './results/factor/SEMResults';
import { RegressionResults } from './results/regression/RegressionResults';
import { LogisticResults } from './results/regression/LogisticResults';
import { ModerationResults } from './results/regression/ModerationResults';
import { MediationResults } from './results/mediation/MediationResults';
import { ChiSquareResults } from './results/nonparametric/ChiSquareResults';
import { MannWhitneyResults } from './results/nonparametric/MannWhitneyResults';
import { KruskalWallisResults } from './results/nonparametric/KruskalWallisResults';
import { WilcoxonResults } from './results/nonparametric/WilcoxonResults';
import { ClusterResults } from './results/cluster/ClusterResults';

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
