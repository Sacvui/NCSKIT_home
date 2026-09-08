import { AnalysisType, InterpretationResult } from './shared';
import { interpretCronbachAlpha, interpretEFA, interpretCFA } from './factor';
import { interpretCorrelation, interpretTTest, interpretANOVA, interpretPairedTTest, interpretMannWhitney, interpretKruskalWallis, interpretWilcoxon, interpretTwoWayANOVA, interpretChiSquare } from './basic';
import { interpretLinearRegression, interpretLogisticRegression, interpretMediation, interpretModeration, interpretCluster } from './regression';

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
export function interpretVIF(params: {
    vifValues: number[];
    variableNames?: string[];
}): InterpretationResult {
    const { vifValues, variableNames } = params;

    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Hair, J. F., et al. (2010). Multivariate data analysis (7th ed.). Pearson.'];

    const hasSevere = vifValues.some(v => v >= 10);
    const hasModerate = vifValues.some(v => v >= 5 && v < 10);

    let summary = '';
    if (hasSevere) {
        summary = `Kết quả kiểm định đa cộng tuyến cho thấy CÓ DẤU HIỆU NGHIÊM TRỌNG (Severe Multicollinearity) trong mô hình. Có biến quan sát có hệ số VIF ≥ 10.`;
    } else if (hasModerate) {
        summary = `Mô hình có hiện tượng đa cộng tuyến ở mức TRUNG BÌNH. Một số biến có hệ số VIF nằm trong khoảng từ 5 đến 10.`;
    } else {
        summary = `Kết quả kiểm định cho thấy KHÔNG CÓ hiện tượng đa cộng tuyến trong mô hình. Tất cả các hệ số VIF đều nhỏ hơn ngưỡng khuyến nghị (VIF < 5).`;
    }

    vifValues.forEach((v, i) => {
        const name = variableNames?.[i] || `Biến ${i + 1}`;
        if (v >= 10) {
            warnings.push(`Biến "${name}" có VIF = ${formatNum(v)}, vi phạm nghiêm trọng giả định về đa cộng tuyến.`);
        } else if (v >= 5) {
            details.push(`Biến "${name}" có VIF = ${formatNum(v)}, ở mức chấp nhận được nhưng cần theo dõi.`);
        } else {
            details.push(`Biến "${name}" có VIF = ${formatNum(v)}, đảm bảo tính độc lập.`);
        }
    });

    return { summary, details, warnings, citations };
}

export function interpretOutlier(params: {
    nOutliers: number;
    totalN: number;
    cutoffValue: number;
}): InterpretationResult {
    const { nOutliers, totalN, cutoffValue } = params;

    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Tabachnick, B. G., & Fidell, L. S. (2013). Using Multivariate Statistics.'];

    let summary = '';
    const percentage = (nOutliers / totalN) * 100;

    if (nOutliers === 0) {
        summary = `Dữ liệu không có các giá trị ngoại lệ đa biến (Multivariate Outliers) dựa trên khoảng cách Mahalanobis (cutoff χ² = ${formatNum(cutoffValue)}).`;
        details.push(`Toàn bộ ${totalN} quan sát đều đảm bảo tính đồng nhất về phân phối không gian.`);
    } else {
        summary = `Phát hiện ${nOutliers} giá trị ngoại lệ đa biến (${formatNum(percentage, 1)}% tổng mẫu) có khoảng cách Mahalanobis vượt quá ngưỡng cho phép (χ² = ${formatNum(cutoffValue)}).`;
        warnings.push(`Sự hiện diện của các giá trị ngoại lệ có thể làm sai lệch kết quả phân tích. Cần xem xét loại bỏ hoặc điều chỉnh các quan sát này.`);
    }

    details.push(`Phương pháp sử dụng: Mahalanobis Distance với mức ý nghĩa p < .001.`);

    return { summary, details, warnings, citations };
}

export function interpretHTMT(params: {
    htmtMatrix: number[][];
    factorNames: string[];
    threshold: number;
}): InterpretationResult {
    const { htmtMatrix, factorNames, threshold } = params;

    const details: string[] = [];
    const warnings: string[] = [];
    const citations = ['Henseler, J., et al. (2015). A new criterion for assessing discriminant validity in variance-based structural equation modeling.'];

    let hasIssue = false;
    const issuesList: string[] = [];

    for (let i = 0; i < htmtMatrix.length; i++) {
        for (let j = i + 1; j < htmtMatrix[i].length; j++) {
            const val = htmtMatrix[i][j];
            if (val >= threshold) {
                hasIssue = true;
                const f1 = factorNames?.[i] || `Nhân tố ${i + 1}`;
                const f2 = factorNames?.[j] || `Nhân tố ${j + 1}`;
                issuesList.push(`${f1} & ${f2} (HTMT = ${formatCoef(val)})`);
            }
        }
    }

    let summary = '';
    if (hasIssue) {
        summary = `Kết quả kiểm định giá trị phân biệt (Discriminant Validity) qua hệ số HTMT cho thấy mô hình CÓ VẤN ĐỀ về tính phân biệt giữa các nhân tố. Một số cặp nhân tố có hệ số HTMT vượt ngưỡng khuyến nghị (${threshold}).`;
        warnings.push(`Cặp nhân tố sau không đạt tính phân biệt: ${issuesList.join(', ')}.`);
    } else {
        summary = `Kết quả kiểm định HTMT cho thấy mô hình đạt GIÁ TRỊ PHÂN BIỆT tốt. Tất cả các cặp nhân tố đều có hệ số HTMT nhỏ hơn ngưỡng khuyến nghị (${threshold}).`;
        details.push(`Các khái niệm trong mô hình có sự khác biệt rõ rệt và không bị trùng lắp về mặt ý nghĩa đo lường.`);
    }

    details.push(`Ngưỡng so sánh sử dụng: HTMT < ${formatCoef(threshold)}.`);

    return { summary, details, warnings, citations };
}

