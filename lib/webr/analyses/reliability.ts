/**
 * Reliability & Factor Analysis Modules
 */
import { executeRWithRecovery, loadPackagesForMethod } from '../core';
import { parseWebRResult, parseMatrix } from '../utils';
import { getAnalysisRTemplate } from '../templates';
import { runLavaanAnalysis } from './sem';

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
    // Lazy load required packages
    await loadPackagesForMethod('cronbach');

    const defaultRCode = `
    options(mc.cores = 1);
    library(psych);
    
    # DATA CLEANING
    valid_min <- {{likertMin}};
    valid_max <- {{likertMax}};
    data <- pmax(pmin(raw_data, valid_max), valid_min);
    
    # Run Cronbach's Alpha
    result <- alpha(data, check.keys = TRUE);
    
    # === McDonald's Omega (Robust) ===
    # Factor detection using parallel analysis
    omega_result <- tryCatch({
        if (ncol(data) >= 3) {
            nfactors_detected <- tryCatch({
                pa <- fa.parallel(data, fm="minres", fa="fa", plot=FALSE, n.iter=5);
                max(1, pa$nfact)
            }, error = function(e) { 1 });
            
            om <- suppressWarnings(suppressMessages(
                omega(data, nfactors = nfactors_detected, plot = FALSE, check.keys = TRUE)
            ));
            
            list(
                omega_total = if(is.numeric(om$omega.tot)) om$omega.tot else NA,
                omega_h = if(is.numeric(om$omega.h)) om$omega.h else NA
            )
        } else {
            list(omega_total = NA, omega_h = NA)
        }
    }, error = function(e) { list(omega_total = NA, omega_h = NA) });
    
    # Extract item-total statistics
    item_stats <- result$item.stats;
    alpha_drop <- result$alpha.drop;
    n_items <- ncol(data);
    
    total_scores <- rowSums(data, na.rm = TRUE);
    scale_mean <- mean(total_scores, na.rm = TRUE);
    scale_var <- var(total_scores, na.rm = TRUE);

    list(
        raw_alpha = result$total$raw_alpha,
        std_alpha = result$total$std.alpha,
        omega_total = omega_result$omega_total,
        omega_h = omega_result$omega_h,
        n_items = n_items,
        likert_min = valid_min,
        likert_max = valid_max,
        scale_mean_deleted = alpha_drop$mean,
        scale_var_deleted = alpha_drop$sd^2,
        corrected_item_total = item_stats$r.drop,
        alpha_if_deleted = alpha_drop$raw_alpha,
        average_r = result$total$average_r,
        scale_mean = scale_mean,
        scale_var = scale_var,
        alphaVal = result$total$raw_alpha,
        omegaVal = omega_result$omega_total,
        n = n_items
    )
    `;

    // Fetch customized template and render it
    const template = await getAnalysisRTemplate('cronbach', defaultRCode);
    const rCode = template
        .replace(/\{\{likertMin\}\}/g, String(likertMin))
        .replace(/\{\{likertMax\}\}/g, String(likertMax));

    const result = await executeRWithRecovery(rCode, 'cronbach', 0, 2, 120000, data);
    const getValue = parseWebRResult(result);

    const rawAlpha = getValue('raw_alpha')?.[0] ?? 0;
    const stdAlpha = getValue('std_alpha')?.[0] ?? 0;
    const omegaTotal = getValue('omega_total')?.[0] ?? 0;
    const omegaH = getValue('omega_h')?.[0] ?? 0;
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
    // Lazy load required packages (needs psych and GPArotation)
    await loadPackagesForMethod('efa');

    const defaultRCode = `
    library(psych)
    
    # Clean Data (Robust approach)
    df <- as.data.frame(raw_data)
    
    # Remove rows with ANY missing values for functions that require complete data
    # (KMO, fa.parallel, fa all need complete cases)
    df_clean <- na.omit(df)
    
    # Check if we have enough data after cleaning
    n_rows_total <- nrow(df)
    n_complete <- nrow(df_clean)
    
    if (n_complete < 3) { 
        stop("Quá ít dữ liệu hoàn chỉnh (< 3 mẫu). Vui lòng kiểm tra dữ liệu khuyết.") 
    }
    
    # Use pairwise correlation for eigenvalues (more robust)
    # but use complete data for actual EFA
    cor_mat <- tryCatch({
        cor(df, use = "pairwise.complete.obs")
    }, error = function(e) {
        # Fallback to complete cases
        cor(df_clean)
    })
    
    # Basic validation
    if (any(is.na(cor_mat))) { 
        stop("Lỗi: Dữ liệu có quá nhiều giá trị khuyết (NA) dẫn đến ma trận tương quan không hợp lệ.") 
    }
    
    eigenvalues <- eigen(cor_mat)$values

    # PARALLEL ANALYSIS (uses complete data)
    n_factors_parallel <- tryCatch({
        # Optimized n.iter for faster execution
        pa <- fa.parallel(df_clean, fm = "pa", fa = "fa", plot = FALSE, n.iter = 10, quant = 0.95)
        pa$nfact
    }, error = function(e) NA)
    
    n_factors_kaiser <- sum(eigenvalues > 1)
    if (n_factors_kaiser < 1) n_factors_kaiser <- 1

    n_factors_run <- {{nFactors}}
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

    # KMO and Bartlett (use complete data)
    kmo_result <- tryCatch(KMO(df_clean), error = function(e) list(MSA = 0))
    bartlett_result <- tryCatch(cortest.bartlett(cor_mat, n = nrow(df_clean)), error = function(e) list(p.value = 1))
    
    # Run EFA (use complete data)
    rotation_method <- "{{rotation}}"
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

    // Fetch customized template and render it
    const template = await getAnalysisRTemplate('efa', defaultRCode);
    const rCode = template
        .replace(/\{\{nFactors\}\}/g, String(nFactors))
        .replace(/\{\{rotation\}\}/g, rotation);

    const jsResult = await executeRWithRecovery(rCode, 'efa', 0, 2, 120000, data);

    const getValue = parseWebRResult(jsResult);
    const nFactorsUsed = getValue('n_factors_used')?.[0] || nFactors || 1;

    return {
        kmo: getValue('kmo')?.[0] ?? 0,
        bartlettP: getValue('bartlett_p')?.[0] ?? 1,
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
/**
 * Confirmatory Factor Analysis (CFA)
 * Upgraded to use true SEM engine (lavaan)
 */
export async function runCFA(data: number[][], columns: string[], modelSyntax: string): Promise<any> {
    // Lazy load required packages (needs lavaan)
    await loadPackagesForMethod('cfa');

    try {
        // Try running true CFA with lavaan
        const result = await runLavaanAnalysis(data, columns, modelSyntax);

        if (result.error) {
            console.warn("Lavaan failed:", result.error);
            // Do NOT fall back to EFA — return a clear error instead
            return {
                fitMeasures: { cfi: 0, tli: 0, rmsea: 0, srmr: 0, chisq: 0, df: 0, pvalue: 0 },
                estimates: [],
                rCode: '',
                error: `CFA yêu cầu thư viện lavaan. Lỗi: ${result.error}. Vui lòng thử lại sau khi WebR tải xong.`,
                warning: undefined
            };
        }

        return {
            ...result,
            warning: "Phân tích CFA thành công bằng thư viện lavaan chuyên sâu."
        };
    } catch (e: any) {
        console.warn("Lavaan not available or failed:", e);
        // Return a clear error — do NOT simulate CFA with EFA (statistically invalid)
        return {
            fitMeasures: { cfi: 0, tli: 0, rmsea: 0, srmr: 0, chisq: 0, df: 0, pvalue: 0 },
            estimates: [],
            rCode: '',
            error: `CFA yêu cầu thư viện lavaan chưa được tải. Vui lòng đợi WebR khởi động hoàn tất và thử lại. Chi tiết: ${e?.message || String(e)}`,
            warning: undefined
        };
    }
    // NOTE: The previous EFA-as-CFA fallback was removed because it produced
    // statistically invalid results (EFA ≠ CFA — no fixed measurement model,
    // fit indices are not comparable). Better to show a clear error than wrong results.
}
