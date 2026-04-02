/**
 * TemplateInterpretation Component
 * Uses ASIG template-based interpretation (NO AI COST!)
 * 
 * This component displays automatic academic interpretations
 * using pre-defined templates stored in interpretation-templates.ts
 */

'use client';

import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, AlertTriangle, BookMarked, Copy, Check } from 'lucide-react';
import {
    generateInterpretation,
    interpretCronbachAlpha,
    interpretCorrelation,
    interpretTTestIndependent,
    interpretTTestPaired,
    interpretANOVA,
    interpretTwoWayANOVA,
    interpretLinearRegression,
    interpretLogisticRegression,
    interpretMannWhitney,
    interpretKruskalWallis,
    interpretWilcoxonSigned,
    interpretChiSquare,
    interpretEFA,
    interpretCFA,
    interpretMediation,
    interpretModeration,
    interpretClusterAnalysis,
    interpretDescriptive,
    interpretVIF,
    interpretOutlier,
    interpretHTMT,
    InterpretationResult
} from '@/lib/interpretation-templates';

interface TemplateInterpretationProps {
    analysisType: string;
    results: any;
    scaleName?: string;
    variableNames?: Record<string, string>;
}

export function TemplateInterpretation({
    analysisType,
    results,
    scaleName = 'Thang đo',
    variableNames = {}
}: TemplateInterpretationProps) {
    const [interpretation, setInterpretation] = useState<InterpretationResult | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!results) return;

        try {
            let result: InterpretationResult;

            switch (analysisType) {
                case 'omega': // Explicitly handle 'omega' type
                case 'cronbach':
                case 'cronbach_alpha':
                case 'cronbach-batch': // Handle batch types if they reach here
                case 'omega-batch':
                    result = interpretCronbachAlpha({
                        scaleName: scaleName,
                        nItems: results.nItems || results.itemStats?.length || 0,
                        alpha: results.rawAlpha || results.alpha || 0,
                        // Only show Omega if specifically requested (analysisType is omega)
                        omega: (analysisType.includes('omega')) ? results.omega : undefined,
                        badItems: results.itemStats
                            ?.filter((item: any) => item.correctedItemTotal < 0.3)
                            ?.map((item: any) => item.variable) || []
                    });
                    break;

                case 'correlation':
                    result = interpretCorrelation({
                        var1: variableNames.var1 || 'Biến 1',
                        var2: variableNames.var2 || 'Biến 2',
                        r: results.r || results.correlation?.[0]?.[1] || 0,
                        pValue: results.pValue || results.pValues?.[0]?.[1] || 0,
                        method: results.method || 'pearson'
                    });
                    break;

                case 'ttest':
                case 'ttest_independent':
                    result = interpretTTestIndependent({
                        groupVar: variableNames.groupVar || 'Nhóm',
                        targetVar: variableNames.targetVar || 'Biến phụ thuộc',
                        group1Name: variableNames.group1 || 'Nhóm 1',
                        group2Name: variableNames.group2 || 'Nhóm 2',
                        mean1: results.mean1 || 0,
                        sd1: results.sd1 || 0,
                        mean2: results.mean2 || 0,
                        sd2: results.sd2 || 0,
                        t: results.t || 0,
                        df: results.df || 0,
                        pValue: results.pValue || 0,
                        cohensD: results.effectSize,
                        leveneP: results.assumptionCheckP,
                        shapiroP1: results.normalityP1,
                        shapiroP2: results.normalityP2
                    });
                    break;

                case 'ttest_paired':
                case 'paired_ttest':
                    result = interpretTTestPaired({
                        targetVar: variableNames.targetVar || 'Biến phụ thuộc',
                        meanBefore: results.meanBefore || 0,
                        sdBefore: results.sdBefore || 0,
                        meanAfter: results.meanAfter || 0,
                        sdAfter: results.sdAfter || 0,
                        meanDiff: results.meanDiff || 0,
                        t: results.t || 0,
                        df: results.df || 0,
                        pValue: results.pValue || 0,
                        cohensD: results.effectSize,
                        normalityDiffP: results.normalityDiffP
                    });
                    break;

                case 'anova':
                case 'one_way_anova':
                    result = interpretANOVA({
                        factorVar: variableNames.factorVar || 'Biến phân nhóm',
                        targetVar: variableNames.targetVar || 'Biến phụ thuộc',
                        F: results.F || 0,
                        dfBetween: results.dfBetween || 0,
                        dfWithin: results.dfWithin || 0,
                        pValue: results.pValue || 0,
                        etaSquared: results.etaSquared,
                        methodUsed: results.methodUsed,
                        leveneP: results.assumptionCheckP,
                        normalityResidP: results.normalityResidP,
                        postHoc: results.postHoc
                    });
                    break;

                case 'two_way_anova':
                case 'anova_2way':
                    result = interpretTwoWayANOVA({
                        factor1: variableNames.factor1 || 'Yếu tố 1',
                        factor2: variableNames.factor2 || 'Yếu tố 2',
                        targetVar: variableNames.targetVar || 'Biến phụ thuộc',
                        mainEffect1F: results.mainEffect1F || 0,
                        mainEffect1P: results.mainEffect1P || 1,
                        mainEffect2F: results.mainEffect2F || 0,
                        mainEffect2P: results.mainEffect2P || 1,
                        interactionF: results.interactionF || 0,
                        interactionP: results.interactionP || 1,
                        df1: results.df1 || 0,
                        df2: results.df2 || 0,
                        dfError: results.dfError || 0
                    });
                    break;

                case 'regression':
                case 'linear_regression':
                    result = interpretLinearRegression({
                        dependentVar: variableNames.dependent || 'Y',
                        rSquared: results.modelFit?.rSquared || 0,
                        adjRSquared: results.modelFit?.adjRSquared || 0,
                        fStatistic: results.modelFit?.fStatistic || 0,
                        fPValue: results.modelFit?.pValue || 0,
                        coefficients: results.coefficients || [],
                        normalityP: results.modelFit?.normalityP
                    });
                    break;

                case 'logistic':
                case 'logistic_regression':
                    result = interpretLogisticRegression({
                        dependentVar: variableNames.dependent || 'Y',
                        pseudoR2: results.modelFit?.pseudoR2 || 0,
                        accuracy: results.modelFit?.accuracy || 0,
                        coefficients: results.coefficients || []
                    });
                    break;

                case 'chi_square':
                case 'chisquare':
                    result = interpretChiSquare({
                        var1: variableNames.var1 || 'Biến 1',
                        var2: variableNames.var2 || 'Biến 2',
                        statistic: results.statistic || 0,
                        df: results.df || 0,
                        pValue: results.pValue || 0,
                        cramersV: results.cramersV || 0,
                        fisherPValue: results.fisherPValue,
                        warning: results.warning
                    });
                    break;

                case 'mann_whitney':
                case 'mann-whitney':
                    result = interpretMannWhitney({
                        group1Name: variableNames.group1 || 'Nhóm 1',
                        group2Name: variableNames.group2 || 'Nhóm 2',
                        targetVar: variableNames.targetVar || 'Biến phụ thuộc',
                        statistic: results.statistic || 0,
                        pValue: results.pValue || 0,
                        median1: results.median1 || 0,
                        median2: results.median2 || 0,
                        effectSize: results.effectSize,
                        distShapeRun: results.distShapeRun
                    });
                    break;

                case 'kruskal_wallis':
                case 'kruskal-wallis':
                case 'kruskal':
                    result = interpretKruskalWallis({
                        factorVar: variableNames.factorVar || 'Biến phân nhóm',
                        targetVar: variableNames.targetVar || 'Biến phụ thuộc',
                        statistic: results.statistic || 0,
                        df: results.df || 0,
                        pValue: results.pValue || 0,
                        medians: results.medians || []
                    });
                    break;

                case 'wilcoxon_signed':
                case 'wilcoxon-signed':
                case 'wilcoxon':
                    result = interpretWilcoxonSigned({
                        targetVar: variableNames.targetVar || 'Biến phụ thuộc',
                        statistic: results.statistic || 0,
                        pValue: results.pValue || 0,
                        medianDiff: results.medianDiff || 0
                    });
                    break;

                case 'efa':
                    result = interpretEFA({
                        kmo: results.kmo || 0,
                        bartlettP: results.bartlettP || 0,
                        nFactors: results.nFactorsUsed || 0,
                        factorMethod: results.factorMethod || 'kaiser',
                        totalVariance: results.totalVariance
                    });
                    break;

                case 'cfa':
                    result = interpretCFA({
                        chi2: results.fitMeasures?.chisq || 0,
                        df: results.fitMeasures?.df || 0,
                        pValue: results.fitMeasures?.pvalue || 0,
                        cfi: results.fitMeasures?.cfi || 0,
                        tli: results.fitMeasures?.tli || 0,
                        rmsea: results.fitMeasures?.rmsea || 0,
                        srmr: results.fitMeasures?.srmr || 0
                    });
                    break;

                case 'mediation':
                    result = interpretMediation({
                        xVar: variableNames.x || 'X',
                        mVar: variableNames.m || 'M',
                        yVar: variableNames.y || 'Y',
                        pathA: results.pathA || { estimate: 0, pValue: 1 },
                        pathB: results.pathB || { estimate: 0, pValue: 1 },
                        pathC: results.pathC || { estimate: 0, pValue: 1 },
                        pathCprime: results.pathCprime || { estimate: 0, pValue: 1 },
                        indirectEffect: results.indirectEffect || 0,
                        sobelZ: results.sobelZ || 0,
                        sobelP: results.sobelP || 1,
                        bootstrapCI: results.bootstrapCI,
                        mediationType: results.mediationType || 'none'
                    });
                    break;

                case 'moderation':
                    result = interpretModeration({
                        xVar: variableNames.x || 'X',
                        mVar: variableNames.m || 'M',
                        yVar: variableNames.y || 'Y',
                        interactionTerm: results.interactionTerm || 'X:M',
                        interactionEstimate: results.interactionEstimate || 0,
                        interactionP: results.interactionP || 1,
                        simpleSlopes: results.slopes
                    });
                    break;

                case 'cluster':
                case 'cluster_analysis':
                    result = interpretClusterAnalysis({
                        method: results.method || 'K-Means',
                        nClusters: results.nClusters || results.k || 0,
                        totalSS: results.totalSS || 0,
                        withinSS: results.totWithinSS || 0,
                        betweenSS: results.betweensSS || 0,
                        silhouetteScore: results.silhouetteScore
                    });
                    break;
                
                case 'descriptive':
                case 'descriptive_stats':
                    result = interpretDescriptive({
                        columnNames: results.columnNames || [],
                        means: results.mean || [],
                        sds: results.sd || [],
                        skews: results.skew || [],
                        kurtoses: results.kurtosis || [],
                        N: results.N || []
                    });
                    break;
                
                case 'vif':
                    result = interpretVIF({
                        vifValues: results.vif_values || [],
                        variableNames: results.variable_names || []
                    });
                    break;
                
                case 'outlier':
                    result = interpretOutlier({
                        nOutliers: results.n_outliers || 0,
                        totalN: results.mahalanobis_distances?.length || 0,
                        cutoffValue: results.cutoff_value || 0
                    });
                    break;
                
                case 'htmt':
                    result = interpretHTMT({
                        htmtMatrix: results.htmt_matrix || [],
                        factorNames: results.factor_names || [],
                        threshold: results.threshold || 0.85
                    });
                    break;

                default:
                    result = {
                        summary: `Chưa có template diễn giải cho phân tích "${analysisType}".`,
                        details: [],
                        warnings: [],
                        citations: []
                    };
            }

            setInterpretation(result);
        } catch (err) {
            console.error('Template interpretation error:', err);
            setInterpretation({
                summary: 'Không thể tạo diễn giải tự động.',
                details: [],
                warnings: ['Có lỗi xảy ra khi xử lý dữ liệu.'],
                citations: []
            });
        }
    }, [analysisType, results, scaleName, JSON.stringify(variableNames)]); // Use JSON.stringify to prevent infinite loop

    const handleCopy = () => {
        if (!interpretation) return;

        const text = [
            interpretation.summary,
            ...interpretation.details,
            interpretation.warnings.length > 0 ? '\nLưu ý: ' + interpretation.warnings.join(' ') : '',
            '\nTài liệu tham khảo:\n' + interpretation.citations.join('\n')
        ].filter(Boolean).join('\n\n');

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!interpretation) return null;

    return (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-900/40 dark:to-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-6 mt-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-600 dark:bg-emerald-700 rounded-lg shadow-md shadow-emerald-200 dark:shadow-none">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-emerald-950 dark:text-emerald-50">Nhận định Học thuật</h3>
                        <p className="text-xs text-emerald-800 dark:text-emerald-400 font-bold">Tự động • Chuẩn APA • Dành cho Researcher</p>
                    </div>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="font-semibold">{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-5 border-2 border-emerald-100 dark:border-emerald-900/50 shadow-md">
                <p className="text-slate-950 dark:text-white leading-relaxed font-bold text-base">
                    {interpretation.summary}
                </p>
            </div>

            {/* Details */}
            {interpretation.details.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Chi tiết phân tích
                    </h4>
                    <ul className="space-y-3">
                        {interpretation.details.map((detail, idx) => (
                            <li key={idx} className="text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/60 p-4 rounded-xl border-l-4 border-emerald-600 shadow-sm font-medium">
                                {detail}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Warnings */}
            {interpretation.warnings.length > 0 && (
                <div className="mb-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Lưu ý quan trọng
                    </h4>
                    <ul className="space-y-1">
                        {interpretation.warnings.map((warning, idx) => (
                            <li key={idx} className="text-sm text-amber-800 dark:text-amber-400 font-medium">
                                • {warning}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Citations */}
            {interpretation.citations.length > 0 && (
                <div className="border-t border-emerald-200 dark:border-emerald-900/50 pt-4 mt-4">
                    <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <BookMarked className="w-3 h-3" />
                        Tài liệu tham khảo
                    </h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 font-sans">
                        {interpretation.citations.map((citation, idx) => (
                            <li key={idx} className="italic opacity-90 hover:opacity-100 transition-opacity leading-relaxed">{citation}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
