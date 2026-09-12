import { InterpretationResult, formatCoef } from './shared';

/**
 * Interpret PLS-SEM Results (Discriminant Validity: Fornell-Larcker and HTMT)
 */
export function interpretPLSSEM(params: {
    fornell_larcker?: Record<string, Record<string, number>>;
    htmt?: Record<string, Record<string, number>>;
    r_squared?: Record<string, number>;
}): InterpretationResult {
    const { fornell_larcker, htmt, r_squared } = params;

    let summary = '';
    const details: string[] = [];
    const warnings: string[] = [];
    const citations = [
        'Hair, J. F., Hult, G. T. M., Ringle, C. M., & Sarstedt, M. (2017). A primer on partial least squares structural equation modeling (PLS-SEM).'
    ];

    let hasViolations = false;

    // 1. Evaluate Fornell-Larcker
    if (fornell_larcker) {
        const constructs = Object.keys(fornell_larcker);
        const fornellViolations: string[] = [];

        // Check each construct's AVE square root (diagonal) against correlations
        constructs.forEach(c1 => {
            const diagVal = fornell_larcker[c1]?.[c1];
            if (diagVal !== undefined && diagVal !== null) {
                constructs.forEach(c2 => {
                    if (c1 !== c2) {
                        const corr = fornell_larcker[c1]?.[c2] ?? fornell_larcker[c2]?.[c1];
                        if (corr !== undefined && corr !== null && corr >= diagVal) {
                            fornellViolations.push(`${c1} vs ${c2} (Corr: ${formatCoef(corr)} >= AVE_sqrt: ${formatCoef(diagVal)})`);
                        }
                    }
                });
            }
        });

        if (fornellViolations.length === 0) {
            details.push('Tiêu chuẩn Fornell-Larcker ĐẠT: Căn bậc hai của AVE đối với mỗi biến tiềm ẩn đều lớn hơn tất cả các tương quan của nó với các biến tiềm ẩn khác.');
        } else {
            hasViolations = true;
            warnings.push(`Vi phạm tiêu chuẩn Fornell-Larcker: ${fornellViolations[0]}${fornellViolations.length > 1 ? ` và ${fornellViolations.length - 1} cặp khác` : ''}. Các biến này chưa đạt giá trị phân biệt hợp lệ.`);
        }
    }

    // 2. Evaluate HTMT
    if (htmt) {
        const constructs = Object.keys(htmt);
        const htmtViolations: string[] = [];

        constructs.forEach(c1 => {
            constructs.forEach(c2 => {
                if (c1 !== c2) {
                    const val = htmt[c1]?.[c2];
                    // Strict threshold is 0.85, liberal is 0.90
                    if (val !== undefined && val !== null && val >= 0.90) {
                        // avoid duplicate pairs
                        const pair = [c1, c2].sort().join(' - ');
                        if (!htmtViolations.includes(pair)) {
                            htmtViolations.push(pair);
                        }
                    }
                }
            });
        });

        if (htmtViolations.length === 0) {
            details.push('Tiêu chuẩn HTMT ĐẠT: Tất cả các giá trị HTMT đều dưới ngưỡng 0.90, khẳng định giá trị phân biệt (Discriminant Validity) giữa các biến.');
            citations.push('Henseler, J., Ringle, C. M., & Sarstedt, M. (2015). A new criterion for assessing discriminant validity in variance-based structural equation modeling.');
        } else {
            hasViolations = true;
            warnings.push(`Vi phạm HTMT: Các cặp biến [${htmtViolations.join(', ')}] có giá trị HTMT ≥ 0.90, cho thấy chúng không có sự phân biệt rõ ràng về mặt khái niệm.`);
        }
    }

    // 3. Evaluate R-Squared
    if (r_squared) {
        const weakR2 = Object.entries(r_squared).filter(([_, r2]) => r2 < 0.25);
        const modR2 = Object.entries(r_squared).filter(([_, r2]) => r2 >= 0.25 && r2 < 0.5);
        const strongR2 = Object.entries(r_squared).filter(([_, r2]) => r2 >= 0.5 && r2 < 0.75);
        const subR2 = Object.entries(r_squared).filter(([_, r2]) => r2 >= 0.75);

        if (weakR2.length > 0) warnings.push(`Các biến nội sinh [${weakR2.map(v => v[0]).join(', ')}] có R² yếu (< 0.25).`);
        if (subR2.length > 0) details.push(`Các biến nội sinh [${subR2.map(v => v[0]).join(', ')}] có mức độ giải thích (R²) rất cao (≥ 0.75).`);
    }

    // Overall summary
    if (!fornell_larcker && !htmt) {
        summary = 'Không tìm thấy dữ liệu ma trận HTMT hoặc Fornell-Larcker để đánh giá Giá trị phân biệt (Discriminant Validity).';
    } else if (hasViolations) {
        summary = 'Kết quả đánh giá mô hình đo lường (Outer Model) cho thấy có SỰ VI PHẠM về Giá trị phân biệt (Discriminant Validity). Người nghiên cứu cần kiểm tra lại Cross-loadings và cân nhắc gộp hoặc loại bỏ các biến quan sát bị chồng chéo.';
    } else {
        summary = 'Mô hình đo lường (Outer Model) đạt tiêu chuẩn về Giá trị phân biệt (Discriminant Validity). Các biến tiềm ẩn độc lập thống kê với nhau và mô hình sẵn sàng cho bước kiểm định Bootstrap tiếp theo (Inner Model).';
    }

    return { summary, details, warnings, citations };
}
