/**
 * Reliability & Factor Analysis Modules
 */
import { initWebR, executeRWithRecovery } from '../core';
import { parseWebRResult, parseMatrix, arrayToRMatrix } from '../utils';

/**
 * Run Cronbach's Alpha analysis with SPSS-style Item-Total Statistics
 */
export async function runCronbachAlpha(
    data: number[][],
    likertMin: number = 1,
    likertMax: number = 5
): Promise<{
    alpha: number;
    rawAlpha: number;
    standardizedAlpha: number;
    omega: number; // McDonald's Omega (total)
    omegaHierarchical: number; // Omega hierarchical (general factor)
    nItems: number | string;
    likertRange: { min: number; max: number };
    itemTotalStats: {
        itemName: string;
        scaleMeanIfDeleted: number;
        scaleVarianceIfDeleted: number;
        correctedItemTotalCorrelation: number;
        alphaIfItemDeleted: number;
    }[];
    rCode: string;
}> {
    const rCode = `
    library(psych)
    raw_data <- ${arrayToRMatrix(data)}
    
    # DATA CLEANING: Clamp outliers to valid Likert range
    valid_min <- ${likertMin}
    valid_max <- ${likertMax}
    data <- pmax(pmin(raw_data, valid_max), valid_min)
    
    # Run Cronbach's Alpha with auto key checking for reversed items
    result <- alpha(data, check.keys = TRUE)
    
    # === McDonald's Omega (more robust than Alpha) ===
    # omega() requires at least 3 items
    omega_result <- tryCatch({
        if (ncol(data) >= 3) {
            om <- omega(data, nfactors = 1, plot = FALSE, warnings = FALSE, check.keys = TRUE)
            list(
                omega_total = om$omega.tot,
                omega_h = om$omega_h
            )
        } else {
            list(omega_total = NA, omega_h = NA)
        }
    }, error = function(e) list(omega_total = NA, omega_h = NA))
    
    # Extract item-total statistics
    item_stats <- result$item.stats
    alpha_drop <- result$alpha.drop
    n_items <- ncol(data)
    
    # Calculate scale totals for reference
    total_scores <- rowSums(data, na.rm = TRUE)
    scale_mean <- mean(total_scores, na.rm = TRUE)
    scale_var <- var(total_scores, na.rm = TRUE)

    list(
        raw_alpha = result$total$raw_alpha,
        std_alpha = result$total$std.alpha,
        omega_total = omega_result$omega_total,
        omega_h = omega_result$omega_h,
        n_items = n_items,
        likert_min = valid_min,
        likert_max = valid_max,
        
        # Item-total statistics
        scale_mean_deleted = alpha_drop$mean,
        scale_var_deleted = alpha_drop$sd^2,  # Convert SD to Variance
        corrected_item_total = item_stats$r.drop,
        alpha_if_deleted = alpha_drop$raw_alpha,
        
        # Additional useful metrics
        average_r = result$total$average_r,
        scale_mean = scale_mean,
        scale_var = scale_var
    )
    `;

    const result = await executeRWithRecovery(rCode);
    const jsResult = await result.toJs() as any;
    const getValue = parseWebRResult(jsResult);

    const rawAlpha = getValue('raw_alpha')?.[0] || 0;
    const stdAlpha = getValue('std_alpha')?.[0] || 0;
    const omegaTotal = getValue('omega_total')?.[0] || 0;
    const omegaH = getValue('omega_h')?.[0] || 0;
    const nItems = getValue('n_items')?.[0] || 'N/A';

    const scaleMeanDeleted = getValue('scale_mean_deleted') || [];
    const scaleVarDeleted = getValue('scale_var_deleted') || [];
    const correctedItemTotal = getValue('corrected_item_total') || [];
    const alphaIfDeleted = getValue('alpha_if_deleted') || [];

    const itemCount = typeof nItems === 'number' ? nItems : 0;
    const itemTotalStats = [];

    for (let i = 0; i < itemCount; i++) {
        itemTotalStats.push({
            itemName: `VAR${(i + 1).toString().padStart(2, '0')} `,
            scaleMeanIfDeleted: scaleMeanDeleted[i] || 0,
            scaleVarianceIfDeleted: scaleVarDeleted[i] || 0,
            correctedItemTotalCorrelation: correctedItemTotal[i] || 0,
            alphaIfItemDeleted: alphaIfDeleted[i] || 0
        });
    }

    return {
        alpha: rawAlpha,
        rawAlpha: rawAlpha,
        standardizedAlpha: stdAlpha,
        omega: omegaTotal,
        omegaHierarchical: omegaH,
        nItems: nItems,
        likertRange: { min: likertMin, max: likertMax },
        itemTotalStats: itemTotalStats,
        rCode: rCode
    };
}

/**
 * Run Exploratory Factor Analysis (EFA)
 */
export async function runEFA(data: number[][], nFactors: number, rotation: string = 'varimax'): Promise<{
    kmo: number;
    bartlettP: number;
    loadings: number[][];
    communalities: number[];
    structure: number[][];
    eigenvalues: number[];
    nFactorsUsed: number;
    nFactorsSuggested: number;
    factorMethod: string;
    rCode: string;
}> {
    const webR = await initWebR(); // EFA often runs long, might not use executeWithRecovery for single-shot, but consistent init is key

    const rCode = `
    library(psych)
    raw_data <- matrix(c(${data.flat().join(',')}), nrow = ${data.length}, byrow = TRUE)
    
    # Clean Data
    df <- as.data.frame(raw_data)
    df_clean <- na.omit(df)
    df_clean <- df_clean[apply(df_clean, 1, function(x) all(is.finite(x))), ]

    if (nrow(df_clean) < ncol(df_clean)) { stop("Lỗi: Số lượng mẫu hợp lệ nhỏ hơn số lượng biến.") }
    if (nrow(df_clean) < 3) { stop("Quá ít dữ liệu hợp lệ để chạy phân tích.") }
    if (any(apply(df_clean, 2, sd) == 0)) { stop("Biến có phương sai bằng 0. Hãy loại bỏ biến này.") }

    cor_mat <- cor(df_clean)
    eigenvalues <- eigen(cor_mat)$values

    # PARALLEL ANALYSIS
    n_factors_parallel <- tryCatch({
        pa <- fa.parallel(df_clean, fm = "pa", fa = "fa", plot = FALSE, n.iter = 20, quant = 0.95)
        pa$nfact
    }, error = function(e) NA)
    
    n_factors_kaiser <- sum(eigenvalues > 1)
    if (n_factors_kaiser < 1) n_factors_kaiser <- 1

    n_factors_run <- ${nFactors}
    factor_method <- "user"
    
    if (n_factors_run <= 0) {
        if (!is.na(n_factors_parallel) && n_factors_parallel >= 1) {
            n_factors_run <- n_factors_parallel
            factor_method <- "parallel"
        } else {
            n_factors_run <- n_factors_kaiser
            factor_method <- "kaiser"
        }
    }
    if (n_factors_run < 1) n_factors_run <- 1

    # KMO and Bartlett
    kmo_result <- tryCatch(KMO(df_clean), error = function(e) list(MSA = 0))
    bartlett_result <- tryCatch(cortest.bartlett(cor_mat, n = nrow(df_clean)), error = function(e) list(p.value = 1))
    
    # Run EFA
    rotation_method <- "${rotation}"
    efa_result <- fa(df_clean, nfactors = n_factors_run, rotate = rotation_method, fm = "pa")

    list(
        kmo = if (is.numeric(kmo_result$MSA)) kmo_result$MSA[1] else 0,
        bartlett_p = bartlett_result$p.value,
        loadings = efa_result$loadings,
        communalities = efa_result$communalities,
        structure = efa_result$Structure,
        eigenvalues = eigenvalues,
        n_factors_used = n_factors_run,
        n_factors_suggested = if(is.na(n_factors_parallel)) n_factors_kaiser else n_factors_parallel,
        factor_method = factor_method
    )
    `;

    const result = await webR.evalR(rCode);
    const jsResult = await result.toJs() as any;

    const getValue = parseWebRResult(jsResult);
    const nFactorsUsed = getValue('n_factors_used')?.[0] || nFactors || 1;

    return {
        kmo: getValue('kmo')?.[0] || 0,
        bartlettP: getValue('bartlett_p')?.[0] || 1,
        loadings: parseMatrix(getValue('loadings'), nFactorsUsed),
        communalities: getValue('communalities') || [],
        structure: parseMatrix(getValue('structure'), nFactorsUsed),
        eigenvalues: getValue('eigenvalues') || [],
        nFactorsUsed: nFactorsUsed,
        nFactorsSuggested: getValue('n_factors_suggested')?.[0] || nFactorsUsed,
        factorMethod: getValue('factor_method')?.[0] || 'user',
        rCode
    };
}

/**
 * Run Confirmatory Factor Analysis (CFA) using lavaan emulation via psych
 */
export async function runCFA(
    data: number[][],
    columns: string[],
    modelSyntax: string
): Promise<{
    fitMeasures: {
        cfi: number;
        tli: number;
        rmsea: number;
        srmr: number;
        chisq: number;
        df: number;
        pvalue: number;
    };
    estimates: {
        lhs: string;
        op: string;
        rhs: string;
        est: number;
        std: number;
        pvalue: number;
        se: number;
    }[];
    rCode: string;
    warning?: string;
}> {
    const webR = await initWebR();

    const factorDefs = modelSyntax.split('\n').filter(line => line.includes('=~'));
    const nFactors = factorDefs.length;

    const rCode = `
    library(psych)
    
    data_mat <- ${arrayToRMatrix(data)}
    df <- as.data.frame(data_mat)
    colnames(df) <- c(${columns.map(c => `"${c}"`).join(',')})
    
    # Run Factor Analysis (psych::fa) as CFA approximation
    fa_result <- fa(df, nfactors = ${nFactors}, rotate = "oblimin", fm = "ml")
    
    fits <- fa_result$fit.stats
    n <- nrow(df)
    p <- ncol(df)
    chi_sq <- fa_result$STATISTIC
    df_val <- fa_result$dof
    p_val <- fa_result$PVAL
    
    rmsea_val <- fa_result$RMSEA[1]
    
    null_chisq <- fa_result$null.chisq
    null_df <- fa_result$null.dof
    
    tli_val <- if(!is.null(null_chisq) && !is.null(null_df) && null_df > 0 && df_val > 0) {
        ((null_chisq/null_df) - (chi_sq/df_val)) / ((null_chisq/null_df) - 1)
    } else { NA }
    
    cfi_val <- if(!is.null(null_chisq) && null_df > 0) {
        1 - max(chi_sq - df_val, 0) / max(null_chisq - null_df, chi_sq - df_val, 0)
    } else { NA }
    
    loadings_mat <- fa_result$loadings
    loadings_df <- as.data.frame(unclass(loadings_mat))
    
    estimates_list <- list()
    idx <- 1
    factor_names <- colnames(loadings_df)
    var_names <- rownames(loadings_df)
    
    for(f in 1:ncol(loadings_df)) {
        for(v in 1:nrow(loadings_df)) {
            loading <- loadings_df[v, f]
            if(abs(loading) > 0.001) { 
                estimates_list[[idx]] <- list(
                    lhs = factor_names[f],
                    op = "=~",
                    rhs = var_names[v],
                    est = loading,
                    std = loading,
                    se = NA,
                    pvalue = NA
                )
                idx <- idx + 1
            }
        }
    }
    
    list(
        cfi = if(is.na(cfi_val)) 0 else as.numeric(cfi_val),
        tli = if(is.na(tli_val)) 0 else as.numeric(tli_val),
        rmsea = if(is.na(rmsea_val)) 0 else as.numeric(rmsea_val),
        srmr = if(!is.null(fa_result$rms)) as.numeric(fa_result$rms) else 0,
        chisq = if(is.na(chi_sq)) 0 else as.numeric(chi_sq),
        df = if(is.na(df_val)) 0 else as.numeric(df_val),
        pvalue = if(is.na(p_val)) 0 else as.numeric(p_val),
        
        n_ests = length(estimates_list),
        estimates = estimates_list
    )
    `;

    try {
        const result = await webR.evalR(rCode);
        const jsResult = await result.toJs() as any;
        const getValue = parseWebRResult(jsResult);

        const fitMeasures = {
            cfi: getValue('cfi')?.[0] || 0,
            tli: getValue('tli')?.[0] || 0,
            rmsea: getValue('rmsea')?.[0] || 0,
            srmr: getValue('srmr')?.[0] || 0,
            chisq: getValue('chisq')?.[0] || 0,
            df: getValue('df')?.[0] || 0,
            pvalue: getValue('pvalue')?.[0] || 0,
        };

        const estimates: any[] = [];
        const estimatesRaw = getValue('estimates');

        if (estimatesRaw && Array.isArray(estimatesRaw)) {
            for (const est of estimatesRaw) {
                if (est && est.values) {
                    const estValues = parseWebRResult(est);
                    estimates.push({
                        lhs: estValues('lhs')?.[0] || '',
                        op: estValues('op')?.[0] || '=~',
                        rhs: estValues('rhs')?.[0] || '',
                        est: estValues('est')?.[0] || 0,
                        std: estValues('std')?.[0] || 0,
                        se: estValues('se')?.[0] || 0,
                        pvalue: estValues('pvalue')?.[0] || 0
                    });
                }
            }
        }

        return {
            fitMeasures,
            estimates,
            rCode,
            warning: "Lưu ý: Đây là mô phỏng CFA (dạng EFA cố định số nhân tố). Kết quả này chỉ mang tính chất tham khảo, không phải là CFA thực thụ (không thể cố định loading = 0 cho các biến chéo, không có Modification Indices)."
        };

    } catch (e: any) {
        console.error('CFA/EFA Validation Error:', e);
        throw e;
    }
}
