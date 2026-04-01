/**
 * ASIG - Auto Statistical Interpretation Generator
 * Template-based interpretation system (NO AI REQUIRED)
 * 
 * Math symbols use Unicode for cross-device compatibility:
 * - α (alpha), β (beta), χ² (chi-square), η² (eta-squared)
 * - M (mean), SD, p, r, F, t, df
 * - ≥, ≤, <, >, ≠
 */

// ===== UTILITY FUNCTIONS =====

/**
 * Format p-value according to APA style
 * - No leading zero
 * - If p < .001, show "p < .001"
 */
export function formatPValue(p: number): string {
    if (p < 0.001) return 'p < .001';
    if (p < 0.01) return `p = ${p.toFixed(3).replace('0.', '.')}`;
    if (p < 0.05) return `p = ${p.toFixed(3).replace('0.', '.')}`;
    return `p = ${p.toFixed(2).replace('0.', '.')}`;
}

/**
 * Format correlation/alpha values (no leading zero for values < 1)
 */
export function formatCoef(val: number, decimals: number = 2): string {
    if (Math.abs(val) < 1) {
        return val.toFixed(decimals).replace('0.', '.');
    }
    return val.toFixed(decimals);
}

/**
 * Format regular numbers (with leading zero)
 */
export function formatNum(val: number, decimals: number = 2): string {
    return val.toFixed(decimals);
}

// ===== INTERPRETATION TYPES =====

export type AnalysisType =
    | 'cronbach_alpha'
    | 'correlation'
    | 'ttest_independent'
    | 'ttest_paired'
    | 'anova'
    | 'two_way_anova'
    | 'efa'
    | 'cfa'
    | 'linear_regression'
    | 'logistic_regression'
    | 'mann_whitney'
    | 'kruskal_wallis'
    | 'wilcoxon_signed'
    | 'chi_square'
    | 'mediation'
    | 'moderation'
    | 'cluster'
    | 'descriptive';

export interface InterpretationResult {
    summary: string;        // Main interpretation
    details: string[];      // Additional points
    warnings: string[];     // Assumption violations
    citations: string[];    // Academic references
}

// ===== CRONBACH'S ALPHA =====

export function interpretCronbachAlpha(params: {
    scaleName: string;
    nItems: number;
    alpha: number;
    omega?: number;
    badItems?: string[];
}): InterpretationResult {
    const { scaleName, nItems, alpha, omega, badItems } = params;
    const alphaStr = formatCoef(alpha);

    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Nunnally, J. C. (1978). Psychometric theory (2nd ed.). McGraw-Hill.'];

    if (alpha >= 0.7) {
        summary = `Kết quả kiểm định độ tin cậy cho thang đo "${scaleName}" (gồm ${nItems} biến quan sát) cho thấy hệ số Cronbach's Alpha đạt α = ${alphaStr}${omega && omega > 0 ? ` và McDonald's Omega đạt ω = ${formatCoef(omega)}` : ''}. Kết quả này thỏa mãn điều kiện khuyến nghị (${omega ? 'các chỉ số' : 'α'} ≥ .70), chứng tỏ thang đo có độ tin cậy nội tại tốt và phù hợp cho các phân tích tiếp theo.`;
    } else if (alpha >= 0.6) {
        summary = `Hệ số Cronbach's Alpha của thang đo "${scaleName}" là α = ${alphaStr}. Mặc dù giá trị này thấp hơn ngưỡng .70 nhưng vẫn nằm trong mức chấp nhận được đối với các nghiên cứu mang tính khám phá.`;
        if (omega) summary += ` Hệ số McDonald's Omega là ω = ${formatCoef(omega)}.`;
        citations.push('Hair, J. F., et al. (2010). Multivariate data analysis (7th ed.). Pearson.');
    } else {
        summary = `Thang đo "${scaleName}" có hệ số Cronbach's Alpha là α = ${alphaStr} (< .60). Thang đo này không đảm bảo độ tin cậy và cần được điều chỉnh lại cấu trúc.`;
        warnings.push('Độ tin cậy không đạt yêu cầu. Cần xem xét loại bỏ hoặc điều chỉnh biến.');
    }

    // McDonald's Omega
    if (omega && omega > 0) {
        details.push(`Hệ số McDonald's Omega (ω) = ${formatCoef(omega)}, cho thấy độ tin cậy tổng thể của thang đo.`);
    }

    // Bad items
    if (badItems && badItems.length > 0) {
        warnings.push(`Biến quan sát ${badItems.join(', ')} có hệ số tương quan biến-tổng (Item-Total Correlation) nhỏ hơn .30. Việc loại bỏ biến này có thể cải thiện độ tin cậy.`);
    }

    return { summary, details, warnings, citations };
}

// ===== CORRELATION =====

export function interpretCorrelation(params: {
    var1: string;
    var2: string;
    r: number;
    pValue: number;
    method?: 'pearson' | 'spearman' | 'kendall';
}): InterpretationResult {
    const { var1, var2, r, pValue, method = 'pearson' } = params;
    const rStr = formatCoef(r);
    const pStr = formatPValue(pValue);

    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Cohen, J. (1988). Statistical power analysis for behavioral sciences (2nd ed.). Lawrence Erlbaum.'];

    const methodName = method === 'pearson' ? 'Pearson' : method === 'spearman' ? 'Spearman' : 'Kendall';

    if (pValue > 0.05) {
        summary = `Kết quả kiểm định ${methodName} cho thấy không có mối tương quan có ý nghĩa thống kê giữa "${var1}" và "${var2}" (r = ${rStr}, ${pStr}).`;
    } else {
        const direction = r > 0 ? 'thuận' : 'nghịch';
        const trend = r > 0 ? 'tăng' : 'giảm';

        let strength = '';
        const absR = Math.abs(r);
        if (absR < 0.3) strength = 'yếu';
        else if (absR < 0.5) strength = 'trung bình';
        else strength = 'mạnh';

        summary = `Kết quả phân tích cho thấy tồn tại mối tương quan ${direction} ở mức độ ${strength} giữa "${var1}" và "${var2}" với độ tin cậy 95% (r = ${rStr}, ${pStr}). Điều này hàm ý rằng khi "${var1}" tăng thì "${var2}" có xu hướng ${trend}.`;

        details.push(`Hệ số xác định r² = ${formatCoef(r * r)} cho thấy ${formatNum(r * r * 100, 1)}% sự biến thiên của biến này có thể giải thích bởi biến kia.`);
    }

    return { summary, details, warnings, citations };
}

// ===== INDEPENDENT T-TEST =====

export function interpretTTestIndependent(params: {
    groupVar: string;
    targetVar: string;
    group1Name: string;
    group2Name: string;
    mean1: number;
    sd1: number;
    mean2: number;
    sd2: number;
    t: number;
    df: number;
    pValue: number;
    cohensD?: number;
    leveneP?: number;
    shapiroP1?: number;
    shapiroP2?: number;
}): InterpretationResult {
    const { groupVar, targetVar, group1Name, group2Name, mean1, sd1, mean2, sd2, t, df, pValue, cohensD, leveneP, shapiroP1, shapiroP2 } = params;

    const pStr = formatPValue(pValue);
    const isWelch = leveneP !== undefined && leveneP < 0.05;
    const testName = isWelch ? "Welch's t-test" : "Independent t-test";

    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Cohen, J. (1988). Statistical power analysis for behavioral sciences.'];

    if (pValue > 0.05) {
        summary = `Kiểm định ${testName} cho thấy không có sự khác biệt có ý nghĩa thống kê về "${targetVar}" giữa nhóm ${group1Name} (M = ${formatNum(mean1)}, SD = ${formatNum(sd1)}) và nhóm ${group2Name} (M = ${formatNum(mean2)}, SD = ${formatNum(sd2)}) với t(${formatNum(df, 0)}) = ${formatNum(t)}, ${pStr}.`;
    } else {
        const higherGroup = mean1 > mean2 ? group1Name : group2Name;
        const lowerGroup = mean1 > mean2 ? group2Name : group1Name;
        const mHigh = mean1 > mean2 ? mean1 : mean2;
        const mLow = mean1 > mean2 ? mean2 : mean1;
        const sdHigh = mean1 > mean2 ? sd1 : sd2;
        const sdLow = mean1 > mean2 ? sd2 : sd1;

        summary = `Có sự khác biệt có ý nghĩa thống kê về "${targetVar}" giữa hai nhóm (t(${formatNum(df, 0)}) = ${formatNum(t)}, ${pStr}). Cụ thể, giá trị trung bình của nhóm ${higherGroup} (M = ${formatNum(mHigh)}, SD = ${formatNum(sdHigh)}) cao hơn đáng kể so với nhóm ${lowerGroup} (M = ${formatNum(mLow)}, SD = ${formatNum(sdLow)}).`;
    }

    // Effect size
    if (cohensD !== undefined) {
        const d = Math.abs(cohensD);
        let effectLabel = '';
        if (d < 0.2) effectLabel = 'rất nhỏ';
        else if (d < 0.5) effectLabel = 'nhỏ';
        else if (d < 0.8) effectLabel = 'trung bình';
        else effectLabel = 'lớn';

        details.push(`Độ lớn ảnh hưởng Cohen's d = ${formatNum(cohensD)} (${effectLabel}).`);
    }

    // Assumption warnings
    if (leveneP !== undefined && leveneP < 0.05) {
        warnings.push(`Phương sai không đồng nhất (Levene's test: p = ${formatPValue(leveneP)}). Đã sử dụng Welch's t-test.`);
    }

    if (shapiroP1 !== undefined && shapiroP1 < 0.05) {
        warnings.push(`Nhóm ${group1Name} vi phạm giả định phân phối chuẩn (Shapiro-Wilk: p = ${formatPValue(shapiroP1)}).`);
    }

    if (shapiroP2 !== undefined && shapiroP2 < 0.05) {
        warnings.push(`Nhóm ${group2Name} vi phạm giả định phân phối chuẩn (Shapiro-Wilk: p = ${formatPValue(shapiroP2)}).`);
    }

    return { summary, details, warnings, citations };
}

// ===== ONE-WAY ANOVA =====

export function interpretANOVA(params: {
    factorVar: string;
    targetVar: string;
    F: number;
    dfBetween: number;
    dfWithin: number;
    pValue: number;
    etaSquared?: number;
    methodUsed?: string;
    leveneP?: number;
    normalityResidP?: number;
    postHoc?: { comparison: string; diff: number; pAdj: number }[];
}): InterpretationResult {
    const { factorVar, targetVar, F, dfBetween, dfWithin, pValue, etaSquared, methodUsed, leveneP, normalityResidP, postHoc } = params;

    const pStr = formatPValue(pValue);
    const testName = methodUsed === 'Welch ANOVA' ? 'Welch ANOVA' : 'One-way ANOVA';

    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Richardson, J. T. E. (2011). Eta squared and partial eta squared as measures of effect size.'];

    if (pValue > 0.05) {
        summary = `Kết quả phân tích phương sai một yếu tố (${testName}) không tìm thấy sự khác biệt có ý nghĩa thống kê về "${targetVar}" giữa các nhóm "${factorVar}" khác nhau (F(${formatNum(dfBetween, 0)}, ${formatNum(dfWithin, 0)}) = ${formatNum(F)}, ${pStr}).`;
    } else {
        summary = `Kết quả kiểm định ${testName} cho thấy có sự khác biệt có ý nghĩa thống kê về "${targetVar}" giữa các nhóm "${factorVar}" (F(${formatNum(dfBetween, 0)}, ${formatNum(dfWithin, 0)}) = ${formatNum(F)}, ${pStr}).`;

        // Post-hoc
        if (postHoc && postHoc.length > 0) {
            const sigPairs = postHoc.filter(p => p.pAdj < 0.05);
            if (sigPairs.length > 0) {
                const pairStr = sigPairs.map(p => p.comparison).join(', ');
                details.push(`Kiểm định hậu kiểm (Post-hoc Tukey HSD) chỉ ra sự khác biệt có ý nghĩa giữa: ${pairStr}.`);
            }
        }
    }

    // Effect size
    if (etaSquared !== undefined) {
        let effectLabel = '';
        if (etaSquared < 0.01) effectLabel = 'rất nhỏ';
        else if (etaSquared < 0.06) effectLabel = 'nhỏ';
        else if (etaSquared < 0.14) effectLabel = 'trung bình';
        else effectLabel = 'lớn';

        details.push(`Độ lớn ảnh hưởng η² = ${formatCoef(etaSquared)} (${effectLabel}), cho thấy ${formatNum(etaSquared * 100, 1)}% phương sai được giải thích bởi biến phân nhóm.`);
    }

    // Warnings
    if (leveneP !== undefined && leveneP < 0.05) {
        warnings.push(`Phương sai không đồng nhất (Levene's: p = ${formatPValue(leveneP)}). Đã sử dụng Welch ANOVA.`);
    }

    if (normalityResidP !== undefined && normalityResidP > 0 && normalityResidP < 0.05) {
        warnings.push(`Phần dư vi phạm giả định phân phối chuẩn (Shapiro-Wilk: p = ${formatPValue(normalityResidP)}).`);
    }

    return { summary, details, warnings, citations };
}

// ===== LINEAR REGRESSION =====

export function interpretLinearRegression(params: {
    dependentVar: string;
    rSquared: number;
    adjRSquared: number;
    fStatistic: number;
    fPValue: number;
    coefficients: {
        term: string;
        estimate: number;
        stdBeta: number;
        pValue: number;
        vif?: number;
    }[];
    normalityP?: number;
}): InterpretationResult {
    const { dependentVar, rSquared, adjRSquared, fStatistic, fPValue, coefficients, normalityP } = params;

    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Hair, J. F., et al. (2010). Multivariate data analysis (7th ed.). Pearson.'];

    // Model fit
    const summary = `Kết quả phân tích hồi quy cho thấy mô hình xây dựng là phù hợp với dữ liệu mẫu (F = ${formatNum(fStatistic)}, ${formatPValue(fPValue)}). Hệ số R² hiệu chỉnh là ${formatCoef(adjRSquared)}, cho biết các biến độc lập trong mô hình giải thích được ${formatNum(adjRSquared * 100, 1)}% sự biến thiên của biến phụ thuộc "${dependentVar}".`;

    // Coefficients
    const predictors = coefficients.filter(c => c.term !== '(Intercept)');
    for (const coef of predictors) {
        const direction = coef.estimate > 0 ? 'thuận' : 'nghịch';
        const accepted = coef.pValue < 0.05;

        if (accepted) {
            details.push(`Biến "${coef.term}" có tác động ${direction} chiều đến biến phụ thuộc (β = ${formatCoef(coef.stdBeta)}, ${formatPValue(coef.pValue)}). Giả thuyết được chấp nhận.`);
        } else {
            details.push(`Biến "${coef.term}" không có tác động có ý nghĩa thống kê (${formatPValue(coef.pValue)}).`);
        }

        // VIF check
        if (coef.vif !== undefined && coef.vif > 5) {
            warnings.push(`Biến "${coef.term}" có VIF = ${formatNum(coef.vif)} > 5, có dấu hiệu đa cộng tuyến.`);
        }
    }

    // Normality
    if (normalityP !== undefined && normalityP < 0.05) {
        warnings.push(`Phần dư vi phạm phân phối chuẩn (Shapiro-Wilk: ${formatPValue(normalityP)}).`);
    }

    return { summary, details, warnings, citations };
}

// ===== LOGISTIC REGRESSION =====

export function interpretLogisticRegression(params: {
    dependentVar: string;
    pseudoR2: number;
    accuracy: number;
    coefficients: {
        term: string;
        estimate: number;
        oddsRatio: number;
        pValue: number;
    }[];
}): InterpretationResult {
    const { dependentVar, pseudoR2, accuracy, coefficients } = params;

    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Hosmer, D. W., & Lemeshow, S. (2000). Applied logistic regression (2nd ed.). Wiley.'];

    const summary = `Mô hình hồi quy logistic dự đoán "${dependentVar}" có McFadden's Pseudo R² = ${formatCoef(pseudoR2)} và độ chính xác phân loại đạt ${formatNum(accuracy * 100, 1)}%.`;

    // Coefficients
    const predictors = coefficients.filter(c => c.term !== '(Intercept)');
    for (const coef of predictors) {
        const or = coef.oddsRatio;
        const accepted = coef.pValue < 0.05;

        if (accepted) {
            if (or > 1) {
                details.push(`Biến "${coef.term}" làm TĂNG khả năng xảy ra sự kiện (OR = ${formatNum(or)}, ${formatPValue(coef.pValue)}). Khi biến này tăng 1 đơn vị, odds tăng ${formatNum((or - 1) * 100, 0)}%.`);
            } else {
                details.push(`Biến "${coef.term}" làm GIẢM khả năng xảy ra sự kiện (OR = ${formatNum(or)}, ${formatPValue(coef.pValue)}). Khi biến này tăng 1 đơn vị, odds giảm ${formatNum((1 - or) * 100, 0)}%.`);
            }
        } else {
            details.push(`Biến "${coef.term}" không có ảnh hưởng có ý nghĩa (${formatPValue(coef.pValue)}).`);
        }
    }

    return { summary, details, warnings, citations };
}

// ===== MEDIATION ANALYSIS =====

export function interpretMediation(params: {
    xVar: string;
    mVar: string;
    yVar: string;
    pathA: { estimate: number; pValue: number };
    pathB: { estimate: number; pValue: number };
    pathC: { estimate: number; pValue: number };
    pathCprime: { estimate: number; pValue: number };
    indirectEffect: number;
    sobelZ: number;
    sobelP: number;
    bootstrapCI?: { lower: number; upper: number };
    mediationType: 'full' | 'partial' | 'none';
}): InterpretationResult {
    const { xVar, mVar, yVar, pathA, pathB, pathC, pathCprime, indirectEffect, sobelZ, sobelP, bootstrapCI, mediationType } = params;

    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = [
        'Baron, R. M., & Kenny, D. A. (1986). The moderator-mediator variable distinction.',
        'Preacher, K. J., & Hayes, A. F. (2008). Asymptotic and resampling strategies for assessing and comparing indirect effects.'
    ];

    // Path coefficients
    details.push(`Path a (${xVar} → ${mVar}): β = ${formatCoef(pathA.estimate)}, ${formatPValue(pathA.pValue)}`);
    details.push(`Path b (${mVar} → ${yVar}): β = ${formatCoef(pathB.estimate)}, ${formatPValue(pathB.pValue)}`);
    details.push(`Path c (Total Effect): β = ${formatCoef(pathC.estimate)}, ${formatPValue(pathC.pValue)}`);
    details.push(`Path c' (Direct Effect): β = ${formatCoef(pathCprime.estimate)}, ${formatPValue(pathCprime.pValue)}`);
    details.push(`Indirect Effect (a × b): ${formatCoef(indirectEffect)}`);

    // Sobel test
    details.push(`Sobel test: Z = ${formatNum(sobelZ)}, ${formatPValue(sobelP)}`);

    // Bootstrap CI
    if (bootstrapCI) {
        details.push(`Bootstrap 95% CI: [${formatCoef(bootstrapCI.lower)}, ${formatCoef(bootstrapCI.upper)}]`);
    }

    // Interpretation
    if (mediationType === 'full') {
        summary = `Kết quả phân tích cho thấy "${mVar}" đóng vai trò trung gian HOÀN TOÀN (Full Mediation) trong mối quan hệ giữa "${xVar}" và "${yVar}". Hiệu ứng gián tiếp có ý nghĩa thống kê (Sobel Z = ${formatNum(sobelZ)}, ${formatPValue(sobelP)}), trong khi hiệu ứng trực tiếp (c') không còn ý nghĩa khi có mặt biến trung gian.`;
    } else if (mediationType === 'partial') {
        summary = `Kết quả phân tích cho thấy "${mVar}" đóng vai trò trung gian MỘT PHẦN (Partial Mediation) trong mối quan hệ giữa "${xVar}" và "${yVar}". Cả hiệu ứng gián tiếp (Sobel Z = ${formatNum(sobelZ)}, ${formatPValue(sobelP)}) và hiệu ứng trực tiếp (c' = ${formatCoef(pathCprime.estimate)}, ${formatPValue(pathCprime.pValue)}) đều có ý nghĩa thống kê.`;
    } else {
        summary = `Không tìm thấy hiệu ứng trung gian của "${mVar}" trong mối quan hệ giữa "${xVar}" và "${yVar}" (Sobel test: ${formatPValue(sobelP)}).`;
    }

    return { summary, details, warnings, citations };
}

// ===== PAIRED T-TEST =====

export function interpretTTestPaired(params: {
    targetVar: string;
    meanBefore: number;
    sdBefore: number;
    meanAfter: number;
    sdAfter: number;
    meanDiff: number;
    t: number;
    df: number;
    pValue: number;
    cohensD?: number;
    normalityDiffP?: number;
}): InterpretationResult {
    const { targetVar, meanBefore, sdBefore, meanAfter, sdAfter, meanDiff, t, df, pValue, cohensD, normalityDiffP } = params;

    const pStr = formatPValue(pValue);
    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Cohen, J. (1988). Statistical power analysis for behavioral sciences.'];

    if (pValue > 0.05) {
        summary = `Kiểm định Paired t-test cho thấy không có sự khác biệt có ý nghĩa thống kê về "${targetVar}" giữa hai thời điểm đo (t(${formatNum(df, 0)}) = ${formatNum(t)}, ${pStr}). Giá trị trung bình trước (M = ${formatNum(meanBefore)}, SD = ${formatNum(sdBefore)}) và sau (M = ${formatNum(meanAfter)}, SD = ${formatNum(sdAfter)}) không khác biệt đáng kể.`;
    } else {
        const direction = meanDiff > 0 ? 'giảm' : 'tăng';
        const fromTo = meanDiff > 0 ? `từ ${formatNum(meanBefore)} xuống ${formatNum(meanAfter)}` : `từ ${formatNum(meanBefore)} lên ${formatNum(meanAfter)}`;

        summary = `Có sự thay đổi có ý nghĩa thống kê về "${targetVar}" giữa hai thời điểm đo (t(${formatNum(df, 0)}) = ${formatNum(t)}, ${pStr}). Giá trị trung bình ${direction} ${fromTo}, với độ chênh lệch trung bình là ${formatNum(Math.abs(meanDiff))}.`;
    }

    // Effect size
    if (cohensD !== undefined) {
        const d = Math.abs(cohensD);
        let effectLabel = '';
        if (d < 0.2) effectLabel = 'rất nhỏ';
        else if (d < 0.5) effectLabel = 'nhỏ';
        else if (d < 0.8) effectLabel = 'trung bình';
        else effectLabel = 'lớn';

        details.push(`Độ lớn ảnh hưởng Cohen's d = ${formatNum(cohensD)} (${effectLabel}).`);
    }

    // Normality check
    if (normalityDiffP !== undefined && normalityDiffP > 0 && normalityDiffP < 0.05) {
        warnings.push(`Hiệu số vi phạm giả định phân phối chuẩn (Shapiro-Wilk: p = ${formatPValue(normalityDiffP)}). Nên xem xét sử dụng Wilcoxon Signed Rank Test.`);
    }

    return { summary, details, warnings, citations };
}

// ===== MANN-WHITNEY U TEST =====

export function interpretMannWhitney(params: {
    group1Name: string;
    group2Name: string;
    targetVar: string;
    statistic: number;
    pValue: number;
    median1: number;
    median2: number;
    effectSize?: number;
    distShapeRun?: string;
}): InterpretationResult {
    const { group1Name, group2Name, targetVar, statistic, pValue, median1, median2, effectSize, distShapeRun } = params;

    const pStr = formatPValue(pValue);
    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Mann, H. B., & Whitney, D. R. (1947). On a test of whether one of two random variables is stochastically larger than the other.'];

    if (pValue > 0.05) {
        summary = `Kiểm định Mann-Whitney U cho thấy không có sự khác biệt có ý nghĩa thống kê về "${targetVar}" giữa nhóm ${group1Name} (Median = ${formatNum(median1)}) và nhóm ${group2Name} (Median = ${formatNum(median2)}) với U = ${formatNum(statistic)}, ${pStr}.`;
    } else {
        const higherGroup = median1 > median2 ? group1Name : group2Name;
        const lowerGroup = median1 > median2 ? group2Name : group1Name;
        const medHigh = Math.max(median1, median2);
        const medLow = Math.min(median1, median2);

        summary = `Có sự khác biệt có ý nghĩa thống kê về "${targetVar}" giữa hai nhóm (U = ${formatNum(statistic)}, ${pStr}). Giá trị trung vị của nhóm ${higherGroup} (Median = ${formatNum(medHigh)}) cao hơn đáng kể so với nhóm ${lowerGroup} (Median = ${formatNum(medLow)}).`;
    }

    // Effect size
    if (effectSize !== undefined) {
        let effectLabel = '';
        const r = Math.abs(effectSize);
        if (r < 0.1) effectLabel = 'rất nhỏ';
        else if (r < 0.3) effectLabel = 'nhỏ';
        else if (r < 0.5) effectLabel = 'trung bình';
        else effectLabel = 'lớn';

        details.push(`Độ lớn ảnh hưởng r = ${formatCoef(effectSize)} (${effectLabel}).`);
    }

    // Distribution shape note
    if (distShapeRun) {
        details.push(distShapeRun);
    }

    return { summary, details, warnings, citations };
}

// ===== KRUSKAL-WALLIS TEST =====

export function interpretKruskalWallis(params: {
    factorVar: string;
    targetVar: string;
    statistic: number;
    df: number;
    pValue: number;
    medians: number[];
}): InterpretationResult {
    const { factorVar, targetVar, statistic, df, pValue, medians } = params;

    const pStr = formatPValue(pValue);
    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Kruskal, W. H., & Wallis, W. A. (1952). Use of ranks in one-criterion variance analysis.'];

    if (pValue > 0.05) {
        summary = `Kiểm định Kruskal-Wallis cho thấy không có sự khác biệt có ý nghĩa thống kê về "${targetVar}" giữa các nhóm "${factorVar}" khác nhau (H(${df}) = ${formatNum(statistic)}, ${pStr}).`;
    } else {
        summary = `Kết quả kiểm định Kruskal-Wallis cho thấy có sự khác biệt có ý nghĩa thống kê về "${targetVar}" giữa các nhóm "${factorVar}" (H(${df}) = ${formatNum(statistic)}, ${pStr}).`;

        if (medians && medians.length > 0) {
            const medianStr = medians.map((m, i) => `Nhóm ${i + 1}: ${formatNum(m)}`).join(', ');
            details.push(`Giá trị trung vị theo nhóm: ${medianStr}.`);
        }

        details.push('Nên tiến hành kiểm định hậu kiểm (post-hoc) để xác định cặp nhóm nào khác biệt.');
    }

    return { summary, details, warnings, citations };
}

// ===== WILCOXON SIGNED RANK TEST =====

export function interpretWilcoxonSigned(params: {
    targetVar: string;
    statistic: number;
    pValue: number;
    medianDiff: number;
}): InterpretationResult {
    const { targetVar, statistic, pValue, medianDiff } = params;

    const pStr = formatPValue(pValue);
    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Wilcoxon, F. (1945). Individual comparisons by ranking methods. Biometrics Bulletin.'];

    if (pValue > 0.05) {
        summary = `Kiểm định Wilcoxon Signed Rank cho thấy không có sự thay đổi có ý nghĩa thống kê về "${targetVar}" giữa hai thời điểm đo (W = ${formatNum(statistic)}, ${pStr}).`;
    } else {
        const direction = medianDiff > 0 ? 'giảm' : 'tăng';
        summary = `Có sự thay đổi có ý nghĩa thống kê về "${targetVar}" giữa hai thời điểm đo (W = ${formatNum(statistic)}, ${pStr}). Giá trị trung vị có xu hướng ${direction} với độ chênh lệch trung vị là ${formatNum(Math.abs(medianDiff))}.`;
    }

    details.push('Kiểm định này phù hợp khi dữ liệu vi phạm giả định phân phối chuẩn của Paired t-test.');

    return { summary, details, warnings, citations };
}

// ===== MODERATION ANALYSIS =====

export function interpretModeration(params: {
    xVar: string;
    mVar: string;
    yVar: string;
    interactionTerm: string;
    interactionEstimate: number;
    interactionP: number;
    simpleSlopes?: {
        level: string;
        slope: number;
        pValue: number;
    }[];
}): InterpretationResult {
    const { xVar, mVar, yVar, interactionTerm, interactionEstimate, interactionP, simpleSlopes } = params;

    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = [
        'Aiken, L. S., & West, S. G. (1991). Multiple regression: Testing and interpreting interactions.',
        'Hayes, A. F. (2018). Introduction to mediation, moderation, and conditional process analysis (2nd ed.).'
    ];

    if (interactionP > 0.05) {
        summary = `Kết quả phân tích cho thấy KHÔNG có hiệu ứng điều tiết (moderation) của "${mVar}" trong mối quan hệ giữa "${xVar}" và "${yVar}". Hệ số tương tác ${interactionTerm} không có ý nghĩa thống kê (β = ${formatCoef(interactionEstimate)}, ${formatPValue(interactionP)}).`;
    } else {
        const direction = interactionEstimate > 0 ? 'tăng cường' : 'làm suy yếu';
        summary = `Kết quả phân tích cho thấy "${mVar}" đóng vai trò ĐIỀU TIẾT (moderator) trong mối quan hệ giữa "${xVar}" và "${yVar}". Hệ số tương tác có ý nghĩa thống kê (β = ${formatCoef(interactionEstimate)}, ${formatPValue(interactionP)}), cho thấy "${mVar}" ${direction} tác động của "${xVar}" lên "${yVar}".`;

        // Simple slopes
        if (simpleSlopes && simpleSlopes.length > 0) {
            details.push('**Phân tích Simple Slopes:**');
            for (const slope of simpleSlopes) {
                const sig = slope.pValue < 0.05 ? 'có ý nghĩa' : 'không có ý nghĩa';
                details.push(`- Tại mức ${slope.level} của biến điều tiết: slope = ${formatCoef(slope.slope)}, ${formatPValue(slope.pValue)} (${sig})`);
            }
        }
    }

    return { summary, details, warnings, citations };
}

// ===== CLUSTER ANALYSIS =====

export function interpretClusterAnalysis(params: {
    method: string;
    nClusters: number;
    totalSS: number;
    withinSS: number;
    betweenSS: number;
    silhouetteScore?: number;
}): InterpretationResult {
    const { method, nClusters, totalSS, withinSS, betweenSS, silhouetteScore } = params;

    const varianceExplained = (betweenSS / totalSS) * 100;

    let summary = `Phân tích phân cụm (${method}) đã xác định được ${nClusters} cụm (clusters) từ dữ liệu. Tỷ lệ phương sai giải thích bởi các cụm là ${formatNum(varianceExplained, 1)}% (Between-cluster SS / Total SS).`;

    const details: string[] = [];
    const warnings: string[] = [];
    const citations = [
        'Hair, J. F., et al. (2010). Multivariate data analysis (7th ed.).',
        'Rousseeuw, P. J. (1987). Silhouettes: A graphical aid to the interpretation and validation of cluster analysis.'
    ];

    // Variance components
    details.push(`Total Sum of Squares: ${formatNum(totalSS)}`);
    details.push(`Within-cluster SS: ${formatNum(withinSS)} (${formatNum((withinSS / totalSS) * 100, 1)}%)`);
    details.push(`Between-cluster SS: ${formatNum(betweenSS)} (${formatNum(varianceExplained, 1)}%)`);

    // Silhouette score
    if (silhouetteScore !== undefined) {
        let quality = '';
        if (silhouetteScore >= 0.7) quality = 'mạnh (strong)';
        else if (silhouetteScore >= 0.5) quality = 'hợp lý (reasonable)';
        else if (silhouetteScore >= 0.25) quality = 'yếu (weak)';
        else quality = 'không rõ ràng (no substantial structure)';

        details.push(`Silhouette Score = ${formatCoef(silhouetteScore)} → Chất lượng phân cụm: ${quality}.`);
    }

    // Recommendations
    if (varianceExplained < 50) {
        warnings.push('Tỷ lệ phương sai giải thích < 50%. Nên xem xét tăng số cụm hoặc kiểm tra lại dữ liệu.');
    }

    return { summary, details, warnings, citations };
}

// ===== TWO-WAY ANOVA =====

export function interpretTwoWayANOVA(params: {
    factor1: string;
    factor2: string;
    targetVar: string;
    mainEffect1F: number;
    mainEffect1P: number;
    mainEffect2F: number;
    mainEffect2P: number;
    interactionF: number;
    interactionP: number;
    df1: number;
    df2: number;
    dfError: number;
}): InterpretationResult {
    const { factor1, factor2, targetVar, mainEffect1F, mainEffect1P, mainEffect2F, mainEffect2P, interactionF, interactionP, df1, df2, dfError } = params;

    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Field, A. (2013). Discovering statistics using IBM SPSS statistics (4th ed.).'];

    // Interaction effect (most important)
    const hasInteraction = interactionP < 0.05;
    const hasMain1 = mainEffect1P < 0.05;
    const hasMain2 = mainEffect2P < 0.05;

    if (hasInteraction) {
        summary = `Kết quả phân tích phương sai hai yếu tố (Two-Way ANOVA) cho thấy có HIỆU ỨNG TƯƠNG TÁC có ý nghĩa thống kê giữa "${factor1}" và "${factor2}" lên "${targetVar}" (F(${df1}, ${dfError}) = ${formatNum(interactionF)}, ${formatPValue(interactionP)}). Điều này có nghĩa là tác động của một yếu tố phụ thuộc vào mức độ của yếu tố kia.`;

        details.push('Khi có hiệu ứng tương tác, cần tập trung phân tích Simple Effects thay vì Main Effects.');
    } else {
        summary = `Kết quả phân tích Two-Way ANOVA cho thấy KHÔNG có hiệu ứng tương tác giữa "${factor1}" và "${factor2}" (${formatPValue(interactionP)}). `;

        // Main effects
        const mainEffects = [];
        if (hasMain1) mainEffects.push(`"${factor1}" (F(${df1}, ${dfError}) = ${formatNum(mainEffect1F)}, ${formatPValue(mainEffect1P)})`);
        if (hasMain2) mainEffects.push(`"${factor2}" (F(${df2}, ${dfError}) = ${formatNum(mainEffect2F)}, ${formatPValue(mainEffect2P)})`);

        if (mainEffects.length > 0) {
            summary += `Tuy nhiên, có hiệu ứng chính (main effect) có ý nghĩa từ: ${mainEffects.join(' và ')}.`;
        } else {
            summary += `Cả hai yếu tố đều không có hiệu ứng chính có ý nghĩa thống kê.`;
        }
    }

    // Details for all effects
    details.push(`Main Effect "${factor1}": F(${df1}, ${dfError}) = ${formatNum(mainEffect1F)}, ${formatPValue(mainEffect1P)}`);
    details.push(`Main Effect "${factor2}": F(${df2}, ${dfError}) = ${formatNum(mainEffect2F)}, ${formatPValue(mainEffect2P)}`);
    details.push(`Interaction Effect: F(${df1}, ${dfError}) = ${formatNum(interactionF)}, ${formatPValue(interactionP)}`);

    return { summary, details, warnings, citations };
}

// ===== CHI-SQUARE =====

export function interpretChiSquare(params: {
    var1: string;
    var2: string;
    statistic: number;
    df: number;
    pValue: number;
    cramersV: number;
    fisherPValue?: number | null;
    warning?: string;
}): InterpretationResult {
    const { var1, var2, statistic, df, pValue, cramersV, fisherPValue, warning } = params;

    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Cramér, H. (1946). Mathematical methods of statistics. Princeton University Press.'];

    let summary = '';

    if (pValue > 0.05) {
        summary = `Kiểm định Chi-Square cho thấy không có mối quan hệ có ý nghĩa thống kê giữa "${var1}" và "${var2}" (χ²(${df}) = ${formatNum(statistic)}, ${formatPValue(pValue)}).`;
    } else {
        let strengthLabel = '';
        if (cramersV < 0.1) strengthLabel = 'rất yếu';
        else if (cramersV < 0.3) strengthLabel = 'yếu';
        else if (cramersV < 0.5) strengthLabel = 'trung bình';
        else strengthLabel = 'mạnh';

        summary = `Kết quả kiểm định Chi-Square cho thấy có mối quan hệ có ý nghĩa thống kê giữa "${var1}" và "${var2}" (χ²(${df}) = ${formatNum(statistic)}, ${formatPValue(pValue)}). Độ mạnh của mối quan hệ ở mức ${strengthLabel} (Cramér's V = ${formatCoef(cramersV)}).`;
    }

    // Fisher's Exact
    if (fisherPValue !== null && fisherPValue !== undefined) {
        details.push(`Fisher's Exact test (cho bảng 2×2): ${formatPValue(fisherPValue)}`);
    }

    // Warning
    if (warning) {
        warnings.push(warning);
    }

    return { summary, details, warnings, citations };
}

export function interpretDescriptive(params: {
    columnNames: string[];
    means: number[];
    sds: number[];
    skews: number[];
    kurtoses: number[];
    N: number[];
}): InterpretationResult {
    const { columnNames, means, sds, skews, kurtoses, N } = params;

    const details: string[] = [];
    const warnings: string[] = [];
    const citations = [
        'Hair, J. F., et al. (2010). Multivariate data analysis (7th ed.). Pearson.',
        'Kim, H. Y. (2013). Statistical notes for clinical researchers: assessing normal distribution.'
    ];

    let summary = `Kết quả phân tích thống kê mô tả cho ${columnNames.length} biến quan sát với cỡ mẫu N = ${N[0] || 'N/A'}. `;

    if (columnNames.length > 0) {
        const avgMean = means.reduce((a, b) => a + b, 0) / means.length;
        let level = '';
        if (avgMean >= 4.2) level = 'rất cao';
        else if (avgMean >= 3.4) level = 'cao';
        else if (avgMean >= 2.6) level = 'trung bình';
        else if (avgMean >= 1.8) level = 'thấp';
        else level = 'rất thấp';
        
        summary += `Giá trị trung bình của các biến dao động từ ${formatNum(Math.min(...means))} đến ${formatNum(Math.max(...means))}. Nhìn chung, mức độ đánh giá của đối tượng khảo sát nằm ở mức "${level}" (M_avg = ${formatNum(avgMean)}).`;
    }

    columnNames.forEach((name, i) => {
        const skew = skews[i];
        const kurt = kurtoses[i];
        
        // Normality rule of thumb: Skewness < |2|, Kurtosis < |7|
        const isSkewNormal = Math.abs(skew) <= 2;
        const isKurtNormal = Math.abs(kurt) <= 7;

        if (!isSkewNormal || !isKurtNormal) {
            warnings.push(`Biến "${name}" có dấu hiệu vi phạm phân phối chuẩn (Skewness = ${formatNum(skew)}, Kurtosis = ${formatNum(kurt)}).`);
        } else {
            details.push(`Biến "${name}": M = ${formatNum(means[i])}, SD = ${formatNum(sds[i])}. Chỉ số Skewness (${formatNum(skew)}) và Kurtosis (${formatNum(kurt)}) nằm trong ngưỡng cho phép cho phân phối chuẩn.`);
        }
    });

    if (warnings.length === 0) {
        details.push('Tất cả các biến đều có phân phối chuẩn hoặc tiệm cận chuẩn, phù hợp cho các kiểm định tham số (Parametric tests) như T-test, ANOVA, Regression.');
    }

    return { summary, details, warnings, citations };
}

// ===== EFA =====

export function interpretEFA(params: {
    kmo: number;
    bartlettP: number;
    nFactors: number;
    factorMethod: string;
    totalVariance?: number;
}): InterpretationResult {
    const { kmo, bartlettP, nFactors, factorMethod, totalVariance } = params;

    const details: string[] = [];
    const warnings: string[] = [];
    const citations = [
        'Kaiser, H. F. (1970). A second generation little jiffy. Psychometrika.',
        'Hair, J. F., et al. (2010). Multivariate data analysis.'
    ];

    // KMO interpretation
    let kmoLabel = '';
    if (kmo >= 0.9) kmoLabel = 'tuyệt vời';
    else if (kmo >= 0.8) kmoLabel = 'rất tốt';
    else if (kmo >= 0.7) kmoLabel = 'tốt';
    else if (kmo >= 0.6) kmoLabel = 'chấp nhận được';
    else kmoLabel = 'không đạt';

    let summary = `Kết quả kiểm định KMO = ${formatCoef(kmo)} (${kmoLabel}) và Bartlett's Test (${formatPValue(bartlettP)}) cho thấy dữ liệu phù hợp để tiến hành phân tích nhân tố khám phá.`;

    if (kmo < 0.6) {
        warnings.push(`Hệ số KMO < .60, dữ liệu có thể không phù hợp cho EFA.`);
    }

    // Factor extraction
    const methodStr = factorMethod === 'parallel' ? 'Parallel Analysis' : 'Kaiser criterion (eigenvalue > 1)';
    details.push(`Số nhân tố được trích xuất: ${nFactors} (phương pháp: ${methodStr}).`);

    if (totalVariance) {
        details.push(`Tổng phương sai giải thích: ${formatNum(totalVariance * 100, 1)}%.`);
    }

    return { summary, details, warnings, citations };
}

// ===== CFA =====

export function interpretCFA(params: {
    chi2: number;
    df: number;
    pValue: number;
    cfi: number;
    tli: number;
    rmsea: number;
    srmr: number;
}): InterpretationResult {
    const { chi2, df, pValue, cfi, tli, rmsea, srmr } = params;

    const details: string[] = [];
    const warnings: string[] = [];
    const citations = [
        'Hu, L., & Bentler, P. M. (1999). Cutoff criteria for fit indexes in covariance structure analysis.',
        'Kline, R. B. (2016). Principles and practice of structural equation modeling (4th ed.).'
    ];

    // Check fit indices
    const cfiOk = cfi >= 0.9;
    const tliOk = tli >= 0.9;
    const rmseaOk = rmsea <= 0.08;
    const srmrOk = srmr <= 0.08;

    const allGood = cfiOk && tliOk && rmseaOk && srmrOk;
    const mostGood = [cfiOk, tliOk, rmseaOk, srmrOk].filter(x => x).length >= 3;

    let summary = '';

    if (allGood) {
        summary = `Kết quả phân tích CFA cho thấy mô hình có độ phù hợp TỐT với dữ liệu thực nghiệm. Các chỉ số: CFI = ${formatCoef(cfi)} (≥ .90), TLI = ${formatCoef(tli)} (≥ .90), RMSEA = ${formatCoef(rmsea)} (≤ .08), SRMR = ${formatCoef(srmr)} (≤ .08).`;
    } else if (mostGood) {
        summary = `Mô hình CFA có độ phù hợp CHẤP NHẬN ĐƯỢC với dữ liệu. CFI = ${formatCoef(cfi)}, TLI = ${formatCoef(tli)}, RMSEA = ${formatCoef(rmsea)}, SRMR = ${formatCoef(srmr)}.`;
    } else {
        summary = `Mô hình CFA KHÔNG PHÙ HỢP tốt với dữ liệu. Cần xem xét điều chỉnh mô hình.`;
        warnings.push('Một hoặc nhiều chỉ số fit không đạt ngưỡng khuyến nghị.');
    }

    // Details
    details.push(`χ²(${df}) = ${formatNum(chi2)}, ${formatPValue(pValue)}`);

    if (!cfiOk) warnings.push(`CFI = ${formatCoef(cfi)} < .90`);
    if (!tliOk) warnings.push(`TLI = ${formatCoef(tli)} < .90`);
    if (!rmseaOk) warnings.push(`RMSEA = ${formatCoef(rmsea)} > .08`);
    if (!srmrOk) warnings.push(`SRMR = ${formatCoef(srmr)} > .08`);

    return { summary, details, warnings, citations };
}

// ===== MAIN GENERATOR =====

export function generateInterpretation(
    analysisType: AnalysisType,
    results: Record<string, any>
): InterpretationResult {
    switch (analysisType) {
        case 'cronbach_alpha':
            return interpretCronbachAlpha(results as any);
        case 'correlation':
            return interpretCorrelation(results as any);
        case 'ttest_independent':
            return interpretTTestIndependent(results as any);
        case 'ttest_paired':
            return interpretTTestPaired(results as any);
        case 'anova':
            return interpretANOVA(results as any);
        case 'two_way_anova':
            return interpretTwoWayANOVA(results as any);
        case 'linear_regression':
            return interpretLinearRegression(results as any);
        case 'logistic_regression':
            return interpretLogisticRegression(results as any);
        case 'mann_whitney':
            return interpretMannWhitney(results as any);
        case 'kruskal_wallis':
            return interpretKruskalWallis(results as any);
        case 'wilcoxon_signed':
            return interpretWilcoxonSigned(results as any);
        case 'chi_square':
            return interpretChiSquare(results as any);
        case 'efa':
            return interpretEFA(results as any);
        case 'cfa':
            return interpretCFA(results as any);
        case 'mediation':
            return interpretMediation(results as any);
        case 'moderation':
            return interpretModeration(results as any);
        case 'cluster':
            return interpretClusterAnalysis(results as any);
        default:
            return {
                summary: 'Chưa có template cho phân tích này.',
                details: [],
                warnings: [],
                citations: []
            };
    }
}
