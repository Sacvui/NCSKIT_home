import { formatPValue, formatCoef, formatNum, InterpretationResult, AnalysisType } from './shared';

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
    const summary = `Mô hình hồi quy tuyến tính được đánh giá là phù hợp với tập dữ liệu thực nghiệm (F = ${formatNum(fStatistic)}, ${formatPValue(fPValue)}). Hệ số R² hiệu chỉnh (Adjusted R-Square) đạt ${formatCoef(adjRSquared)}, cho biết các biến độc lập trong mô hình giải thích được khoảng ${formatNum(adjRSquared * 100, 1)}% sự biến thiên của biến phụ thuộc "${dependentVar}". Điều này khẳng định sức mạnh dự báo của mô hình ở mức độ tin cậy cao.`;

    // Coefficients
    const predictors = coefficients.filter(c => c.term !== '(Intercept)');
    for (const coef of predictors) {
        const direction = coef.estimate > 0 ? 'thuận' : 'nghịch';
        const accepted = coef.pValue < 0.05;

        if (accepted) {
            details.push(`Biến "${coef.term}" có tác động ${direction} chiều đến "${dependentVar}" (Standardized Beta = ${formatCoef(coef.stdBeta)}, ${formatPValue(coef.pValue)}). Kết quả này cho thấy giả thuyết nghiên cứu về vai trò của "${coef.term}" được ủng hộ về mặt thống kê.`);
        } else {
            details.push(`Biến "${coef.term}" không có tác động có ý nghĩa thống kê đến biến phụ thuộc trong mô hình này (${formatPValue(coef.pValue)}).`);
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


