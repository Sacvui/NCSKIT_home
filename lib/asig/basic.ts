import { formatPValue, formatCoef, formatNum, InterpretationResult, AnalysisType } from './shared';

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
        summary = `Kết quả kiểm định ${methodName} cho thấy không tồn tại mối liên hệ có ý nghĩa thống kê giữa "${var1}" và "${var2}" ở mức ý nghĩa 5% (r = ${rStr}, ${pStr}).`;
    } else {
        const direction = r > 0 ? 'thuận' : 'nghịch';
        const trend = r > 0 ? 'tăng' : 'giảm';

        let strength = '';
        const absR = Math.abs(r);
        if (absR < 0.3) strength = 'yếu';
        else if (absR < 0.7) strength = 'trung bình';
        else strength = 'mạnh';

        summary = `Phân tích tương quan cho thấy tồn tại mối liên hệ ${direction} ở mức độ ${strength} giữa "${var1}" và "${var2}" có ý nghĩa thống kê (r = ${rStr}, ${pStr}). Điều này hàm ý rằng sự biến thiên của "${var1}" đi kèm với xu hướng ${trend} của "${var2}".`;

        details.push(`Hệ số xác định r² = ${formatCoef(r * r)} chỉ ra rằng biến độc lập giải thích được khoảng ${formatNum(r * r * 100, 1)}% sự biến thiên của biến phụ thuộc trong mối quan hệ này.`);
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
        summary = `Kiểm định ${testName} cho thấy không tìm thấy sự khác biệt có ý nghĩa thống kê về giá trị trung bình của "${targetVar}" giữa nhóm ${group1Name} (M = ${formatNum(mean1)}, SD = ${formatNum(sd1)}) và nhóm ${group2Name} (M = ${formatNum(mean2)}, SD = ${formatNum(sd2)}) với t(${formatNum(df, 0)}) = ${formatNum(t)}, ${pStr}.`;
    } else {
        const higherGroup = mean1 > mean2 ? group1Name : group2Name;
        const lowerGroup = mean1 > mean2 ? group2Name : group1Name;
        const mHigh = mean1 > mean2 ? mean1 : mean2;
        const mLow = mean1 > mean2 ? mean2 : mean1;
        const sdHigh = mean1 > mean2 ? sd1 : sd2;
        const sdLow = mean1 > mean2 ? sd2 : sd1;

        summary = `Kết quả kiểm định ${testName} xác nhận có sự khác biệt có ý nghĩa thống kê về "${targetVar}" giữa hai nhóm đối tượng nghiên cứu (t(${formatNum(df, 0)}) = ${formatNum(t)}, ${pStr}). Cụ thể, giá trị trung bình của nhóm ${higherGroup} (M = ${formatNum(mHigh)}, SD = ${formatNum(sdHigh)}) cao hơn có ý nghĩa so với nhóm ${lowerGroup} (M = ${formatNum(mLow)}, SD = ${formatNum(sdLow)}).`;
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
        summary = `Kết quả phân tích phương sai một yếu tố (${testName}) cho thấy sự khác biệt về giá trị trung bình của "${targetVar}" giữa các nhóm "${factorVar}" là không có ý nghĩa thống kê (F(${formatNum(dfBetween, 0)}, ${formatNum(dfWithin, 0)}) = ${formatNum(F)}, ${pStr}).`;
    } else {
        summary = `Kết quả kiểm định ${testName} xác nhận có sự khác biệt có ý nghĩa thống kê về giá trị trung bình của "${targetVar}" giữa các phân lớp thuộc biến "${factorVar}" (F(${formatNum(dfBetween, 0)}, ${formatNum(dfWithin, 0)}) = ${formatNum(F)}, ${pStr}).`;

        // Post-hoc
        if (postHoc && postHoc.length > 0) {
            const sigPairs = postHoc.filter(p => p.pAdj < 0.05);
            if (sigPairs.length > 0) {
                const pairStr = sigPairs.map(p => p.comparison).join(', ');
                details.push(`Phân tích so sánh cặp (Post-hoc) chỉ ra các cặp nhóm có sự khác biệt thực sự là: ${pairStr}.`);
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

    // Check normality per variable
    let allNormal = true;
    const nonNormalVars: string[] = [];
    
    columnNames.forEach((name, i) => {
        const mean = means[i];
        const sd = sds[i];
        const skew = skews[i];
        const kurt = kurtoses[i];
        
        // Strict thresholds: Skewness & Kurtosis within [-2, 2] (George & Mallery, 2010)
        const isSkewNormal = Math.abs(skew) <= 2;
        const isKurtNormal = Math.abs(kurt) <= 2;

        let varNote = `Biến "${name}": M = ${formatNum(mean)}, SD = ${formatNum(sd)}. `;
        
        if (isSkewNormal && isKurtNormal) {
            varNote += `Chỉ số Skewness (${formatNum(skew)}) và Kurtosis (${formatNum(kurt)}) nằm trong ngưỡng lý tưởng ([-2, 2]).`;
        } else {
            allNormal = false;
            nonNormalVars.push(name);
            let violation = [];
            if (!isSkewNormal) violation.push(`Skewness = ${formatNum(skew)}`);
            if (!isKurtNormal) violation.push(`Kurtosis = ${formatNum(kurt)}`);
            varNote += `Phát hiện dấu hiệu lệch chuẩn (${violation.join(', ')}).`;
            warnings.push(`Biến "${name}" không đạt tiêu chuẩn phân phối chuẩn (ngưỡng +/- 2).`);
        }
        
        details.push(varNote);
    });

    // Dynamic summary based on results
    let summary = '';
    if (allNormal) {
        summary = `Phân tích thống kê mô tả cho ${columnNames.length} biến (N = ${N[0]}) cho thấy dữ liệu có phân phối chuẩn tốt, đảm bảo tính đại diện cho các phân tích tham số (Parametric) tiếp theo.`;
        details.push('Dựa trên các chỉ số mô tả, toàn bộ các biến đều có xu hướng phân phối chuẩn hoặc tiệm cận chuẩn, đáp ứng tốt các giả định nghiên cứu.');
    } else {
        summary = `Phát hiện ${nonNormalVars.length}/${columnNames.length} biến quan sát vi phạm giả định phân phối chuẩn (Skewness hoặc Kurtosis nằm ngoài khoảng [-2, 2]). Cần thận trọng khi thực hiện các phép kiểm định tham số.`;
        details.push(`Các biến [${nonNormalVars.slice(0, 3).join(', ')}${nonNormalVars.length > 3 ? '...' : ''}] có độ lệch hoặc độ nhọn vượt ngưỡng cho phép. Tùy thuộc vào tổng cỡ mẫu, Researcher có thể cân nhắc chuyển sang các phép kiểm định phi tham số (Non-parametric tests).`);
    }

    return { summary, details, warnings, citations };
}


