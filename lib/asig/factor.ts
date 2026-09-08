import { formatPValue, formatCoef, formatNum, InterpretationResult, AnalysisType } from './shared';

// ===== CRONBACH'S ALPHA =====

export function interpretCronbachAlpha(params: {
    scaleName: string;
    nItems: number;
    alpha: number;
    omega?: number;
    badItems?: string[];
    isOmegaPrimary?: boolean;
}): InterpretationResult {
    const { scaleName, nItems, alpha, omega, badItems, isOmegaPrimary } = params;
    const alphaStr = formatCoef(alpha);
    const omegaStr = omega ? formatCoef(omega) : '';

    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = isOmegaPrimary 
        ? ['Hayes, A. F., & Coutts, J. J. (2020). Use Omega Rather than Cronbach’s Alpha for Estimating Reliability.'] 
        : ['Nunnally, J. C. (1978). Psychometric theory (2nd ed.). McGraw-Hill.'];

    const primaryCoef = isOmegaPrimary && omega ? omega : alpha;
    const primaryStr = isOmegaPrimary && omega ? omegaStr : alphaStr;
    const primaryName = isOmegaPrimary && omega ? "McDonald's Omega (ω)" : "Cronbach's Alpha (α)";

    if (primaryCoef >= 0.7) {
        summary = `Kết quả kiểm định độ tin cậy cho thấy thang đo "${scaleName}" (gồm ${nItems} biến quan sát) đạt hệ số ${primaryName} = ${primaryStr}. Chỉ số này vượt ngưỡng khuyến nghị (.700), khẳng định thang đo có tính nhất quán nội tại cao, đủ độ tin cậy để thực hiện các phân tích đa biến tiếp theo.`;
        if (isOmegaPrimary) {
            summary += ` McDonald's Omega được sử dụng thay cho Cronbach's Alpha để vượt qua giới hạn của giả định tau-equivalent, mang lại ước lượng độ tin cậy chính xác hơn.`;
        } else if (omega && omega > 0) {
            summary += ` McDonald's Omega ω = ${formatCoef(omega)}.`;
        }
    } else if (primaryCoef >= 0.6) {
        summary = `Hệ số ${primaryName} của thang đo "${scaleName}" đạt = ${primaryStr}. Mặc dù chưa đạt ngưỡng lý tưởng (.700) nhưng giá trị này vẫn nằm trong mức chấp nhận được đối với các nghiên cứu mang tính khám phá (Exploratory Research).`;
        if (!isOmegaPrimary && omega) summary += ` Hệ số McDonald's Omega đạt ω = ${formatCoef(omega)}.`;
        citations.push('Hair, J. F., et al. (2010). Multivariate data analysis (7th ed.). Pearson.');
    } else {
        summary = `Thang đo "${scaleName}" có hệ số ${primaryName} = ${primaryStr} (< .600), không đảm bảo độ tin cậy cần thiết cho các phân tích khoa học.`;
        warnings.push('Độ tin cậy không đạt yêu cầu quy chuẩn. Cần xem xét điều chỉnh cấu trúc thang đo.');
    }

    if (!isOmegaPrimary && omega && omega > 0) {
        details.push(`Chỉ số McDonald's Omega (ω) = ${formatCoef(omega)} bổ trợ thêm bằng chứng về tính nhất quán tổng thể của cấu trúc.`);
    } else if (isOmegaPrimary) {
        details.push(`Chỉ số Cronbach's Alpha tham khảo (α) = ${alphaStr}.`);
    }

    // Bad items
    if (badItems && badItems.length > 0) {
        warnings.push(`Các biến [${badItems.join(', ')}] có hệ số tương quan biến-tổng (Corrected Item-Total Correlation) nhỏ hơn .300. Việc loại bỏ các biến này có thể giúp tối ưu hóa độ tin cậy của thang đo.`);
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


