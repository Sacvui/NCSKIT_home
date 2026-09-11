/**
 * Reliability & Factor Analysis Modules
 */
import { WEBR_TIMEOUTS } from '../constants';
import { validateAndCleanData } from '../input-validator';
import { executeRWithRecovery, loadPackagesForMethod } from '../core';
import { useRawDataInCode, parseMatrix, parseWebRResult } from '../utils';
import { runLavaanAnalysis } from './sem';
import { CronbachResultSchema, ICronbachResult, EfaResultSchema, IEfaResult } from '../schemas';
import { getAnalysisRTemplate } from '../templates';

/**
 * Run Cronbach's Alpha analysis with SPSS-style Item-Total Statistics
 */
export async function runCronbachAlpha(
    data: number[][],
    likertMin: number = 1,
    likertMax: number = 5
): Promise<ICronbachResult> {
    // Lazy load required packages
    await loadPackagesForMethod('cronbach');

    // Validate and clean input data
    const validation = validateAndCleanData(data, {
        minRows: 10,
        minCols: 2,
        analysisName: "Cronbach's Alpha",
        allowPartialRows: true, // Allow NA so R can handle them
    });
    if (!validation.valid) {
        throw new Error(validation.warnings[validation.warnings.length - 1]);
    }
    const cleanData = validation.cleanData;

    const defaultRCode = `
    options(mc.cores = 1);
    
    # DATA CLEANING
    valid_min <- {{likertMin}};
    valid_max <- {{likertMax}};
    
    data <- raw_data
    data[data > valid_max] <- valid_max
    data[data < valid_min] <- valid_min
    data <- as.data.frame(data)
    
    # MANUAL CRONBACH'S ALPHA CALCULATION (NO PSYCH PACKAGE -> NO LAPACK CRASHES)
    calc_alpha <- function(df) {
        k <- ncol(df)
        if (k < 2) return(NA)
        
        # Use pairwise deletion for covariance to handle NAs
        cov_mat <- suppressWarnings(cov(df, use = "pairwise.complete.obs"))
        if (any(is.na(cov_mat))) return(NA)
        
        var_items <- diag(cov_mat)
        var_total <- sum(cov_mat)
        
        if (var_total <= 0) return(NA)
        (k / (k - 1)) * (1 - sum(var_items) / var_total)
    }

    n_items <- ncol(data)
    total_scores <- rowSums(data, na.rm = TRUE)
    scale_mean <- mean(total_scores, na.rm = TRUE)
    scale_var <- var(total_scores, na.rm = TRUE)
    
    raw_alpha <- calc_alpha(data)
    
    # Calculate item-total stats manually
    r_drop <- numeric(n_items)
    alpha_drop <- numeric(n_items)
    mean_drop <- numeric(n_items)
    var_drop <- numeric(n_items)
    
    for (i in 1:n_items) {
        # Data without item i
        df_drop <- data[, -i, drop = FALSE]
        
        # Alpha if deleted
        alpha_drop[i] <- calc_alpha(df_drop)
        
        # Corrected item-total correlation
        item_i <- data[, i]
        total_without_i <- rowSums(df_drop, na.rm = TRUE)
        
        r_drop[i] <- suppressWarnings(cor(item_i, total_without_i, use = "pairwise.complete.obs"))
        
        # Mean/Var if deleted
        mean_drop[i] <- mean(total_without_i, na.rm = TRUE)
        var_drop[i] <- var(total_without_i, na.rm = TRUE)
    }
    
    # Handle NAs
    r_drop[is.na(r_drop)] <- 0
    alpha_drop[is.na(alpha_drop)] <- 0
    
    list(
        raw_alpha = if(is.numeric(raw_alpha)) raw_alpha else 0,
        std_alpha = if(is.numeric(raw_alpha)) raw_alpha else 0, # Simplify
        omega_total = NA,
        omega_h = NA,
        n_items = n_items,
        likert_min = valid_min,
        likert_max = valid_max,
        scale_mean_deleted = mean_drop,
        scale_var_deleted = var_drop,
        corrected_item_total = r_drop,
        alpha_if_deleted = alpha_drop,
        average_r = 0, # Not strictly needed for UI
        scale_mean = scale_mean,
        scale_var = scale_var,
        alphaVal = if(is.numeric(raw_alpha)) raw_alpha else 0,
        omegaVal = NA,
        n = n_items
    )
    `;

    // Fetch customized template and render it
    let template = await getAnalysisRTemplate('cronbach', defaultRCode);
    template = useRawDataInCode(template);
    
    const rCode = template
        .replace(/\{\{likertMin\}\}/g, String(likertMin))
        .replace(/\{\{likertMax\}\}/g, String(likertMax));

    const result = await executeRWithRecovery(rCode, 'cronbach', 0, 2, WEBR_TIMEOUTS.COMPLEX, cleanData);
    const getValue = parseWebRResult(result);

    const extractScalar = (val: any) => Array.isArray(val) ? val[0] : val;
    const extractArray = (val: any) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === 'object') return Object.values(val);
        return [val];
    };

    // Support both new explicit JSON mapping and old legacy template keys
    const rawAlpha = extractScalar(getValue('raw_alpha')) ?? extractScalar(getValue('alphaVal')) ?? 0;
    const stdAlpha = extractScalar(getValue('std_alpha')) ?? 0;
    const omegaTotal = extractScalar(getValue('omega_total')) ?? extractScalar(getValue('omegaVal')) ?? 0;
    const omegaH = extractScalar(getValue('omega_h')) ?? 0;
    const nItems = extractScalar(getValue('n_items')) ?? extractScalar(getValue('n')) ?? 'N/A';

    const scaleMeanDeleted = extractArray(getValue('scale_mean_deleted'));
    const scaleVarDeleted = extractArray(getValue('scale_var_deleted'));
    const correctedItemTotal = extractArray(getValue('corrected_item_total'));
    const alphaIfDeleted = extractArray(getValue('alpha_if_deleted'));

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

    const rawResult = {
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

    return CronbachResultSchema.parse(rawResult);
}

/**
 * Run Exploratory Factor Analysis (EFA)
 */
export async function runEFA(
    data: number[][], 
    nFactors: number = 0, 
    rotation: string = 'varimax',
    method: 'minres' | 'pca' | 'pa' | 'ml' = 'minres'
): Promise<IEfaResult> {
    // Lazy load required packages (needs psych and GPArotation)
    await loadPackagesForMethod('efa');

    const defaultRCode = `
    library(psych)
    
    # Clean Data
    df <- as.data.frame(raw_data)
    
    # Validation: Check for identical columns (perfect collinearity) which crashes WASM LAPACK
    if (any(duplicated(as.list(df)))) {
        stop("Lỗi: Dữ liệu chứa các biến giống hệt nhau (đa cộng tuyến hoàn hảo). Vui lòng loại bỏ các cột trùng lặp.")
    }
    
    # Use pairwise correlation for max data retention
    cor_mat <- cor(df, use = "pairwise.complete.obs")
    
    # Validation: check if correlation matrix is positive definite or contains NAs (constant variables)
    if (any(is.na(cor_mat))) { 
        stop("Lỗi: Dữ liệu có giá trị khuyết (NA) hoặc biến không đổi (phương sai = 0). Vui lòng làm sạch dữ liệu.") 
    }
    
    eigenvalues <- eigen(cor_mat)$values

    # Determine n for Bartlett and stats
    # For pairwise, we use the average N or minimum N of the pairs
    n_obs <- nrow(na.omit(df))
    if (n_obs < 10) n_obs <- nrow(df) # Fallback if listwise is too small

    # Kaiser criterion (fast, no simulation)
    n_factors_kaiser <- sum(eigenvalues > 1)
    n_factors_run <- {{nFactors}}
    n_factors_parallel <- NA
    
    # Only run Parallel Analysis when user did NOT specify nFactors (auto-detect mode)
    if (n_factors_run <= 0) {
        n_factors_parallel <- tryCatch({
            pa <- fa.parallel(cor_mat, n.obs = n_obs, fm = "minres", fa = "fa", plot = FALSE, n.iter = 5)
            pa$nfact
        }, error = function(e) NA)
        n_factors_run <- if (!is.na(n_factors_parallel)) n_factors_parallel else n_factors_kaiser
    }
    if (n_factors_run < 1) n_factors_run <- 1

    # KMO and Bartlett
    kmo_result <- tryCatch(KMO(cor_mat), error = function(e) list(MSA = 0))
    # CRITICAL FIX: Bartlett's test needs the correct N for the correlation matrix
    bartlett_result <- tryCatch(cortest.bartlett(cor_mat, n = n_obs), error = function(e) list(p.value = 1))
    
    # Run Factor Analysis or PCA
    ext_method <- "{{method}}"
    efa_result <- if (ext_method == "pca") {
        principal(cor_mat, nfactors = n_factors_run, rotate = "{{rotation}}", n.obs = n_obs)
    } else {
        fa(cor_mat, nfactors = n_factors_run, rotate = "{{rotation}}", fm = ext_method, n.obs = n_obs)
    }

    list(
        kmo = if (is.numeric(kmo_result$MSA)) kmo_result$MSA[1] else 0,
        bartlett_p = bartlett_result$p.value,
        loadings = as.vector(t(unclass(efa_result$loadings))),
        communalities = efa_result$communalities,
        structure = as.vector(t(if(!is.null(efa_result$Structure)) unclass(efa_result$Structure) else unclass(efa_result$loadings))),
        eigenvalues = eigenvalues,
        n_factors_used = n_factors_run,
        n_factors_suggested = if(is.na(n_factors_parallel)) n_factors_kaiser else n_factors_parallel,
        extraction_method = ext_method
    )
    `;

    const template = await getAnalysisRTemplate('efa', defaultRCode);
    const rCode = template
        .replace(/\{\{nFactors\}\}/g, String(nFactors))
        .replace(/\{\{rotation\}\}/g, rotation)
        .replace(/\{\{method\}\}/g, method);

    const jsResult = await executeRWithRecovery(rCode, 'efa', 0, 2, WEBR_TIMEOUTS.COMPLEX, data);
    const getValue = parseWebRResult(jsResult);
    const extractScalar = (val: any) => Array.isArray(val) ? val[0] : val;
    const extractArray = (val: any) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === 'object') return Object.values(val);
        return [val];
    };

    const nFactorsUsed = extractScalar(getValue('n_factors_used')) || nFactors || 1;

    const rawResult = {
        kmo: extractScalar(getValue('kmo')) ?? 0,
        bartlettP: extractScalar(getValue('bartlett_p')) ?? 1,
        loadings: parseMatrix(getValue('loadings'), nFactorsUsed),
        communalities: extractArray(getValue('communalities')),
        structure: parseMatrix(getValue('structure'), nFactorsUsed),
        eigenvalues: extractArray(getValue('eigenvalues')),
        nFactorsUsed: nFactorsUsed,
        nFactorsSuggested: extractScalar(getValue('n_factors_suggested')) || nFactorsUsed,
        factorMethod: extractScalar(getValue('extraction_method')) || method,
        extractionMethod: extractScalar(getValue('extraction_method')) || method,
        rCode
    };

    return EfaResultSchema.parse(rawResult);
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
            // Do NOT fall back to EFA â€” return a clear error instead
            return {
                fitMeasures: { cfi: 0, tli: 0, rmsea: 0, srmr: 0, chisq: 0, df: 0, pvalue: 0 },
                estimates: [],
                rCode: '',
                error: `CFA yÃªu cáº§u thÆ° viá»‡n lavaan. Lá»—i: ${result.error}. Vui lÃ²ng thá»­ láº¡i sau khi WebR táº£i xong.`,
                warning: undefined
            };
        }

        return {
            ...result,
            warning: "PhÃ¢n tÃ­ch CFA thÃ nh cÃ´ng báº±ng thÆ° viá»‡n lavaan chuyÃªn sÃ¢u."
        };
    } catch (e: any) {
        console.warn("Lavaan not available or failed:", e);
        // Return a clear error â€” do NOT simulate CFA with EFA (statistically invalid)
        return {
            fitMeasures: { cfi: 0, tli: 0, rmsea: 0, srmr: 0, chisq: 0, df: 0, pvalue: 0 },
            estimates: [],
            rCode: '',
            error: `CFA yêu cầu thư viện lavaan chưa được tải. Vui lòng đợi WebR khởi động hoàn tất và thử lại. Chi tiết: ${e?.message || String(e)}`,
            warning: undefined
        };
    }
    // NOTE: The previous EFA-as-CFA fallback was removed because it produced
    // statistically invalid results (EFA â‰  CFA â€” no fixed measurement model,
    // fit indices are not comparable). Better to show a clear error than wrong results.
}

