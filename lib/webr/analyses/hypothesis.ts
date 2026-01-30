/**
 * Hypothesis Testing Modules
 */
import { initWebR, executeRWithRecovery } from '../core';
import { parseWebRResult, parseMatrix, arrayToRMatrix } from '../utils';

/**
 * Run correlation analysis
 */
export async function runCorrelation(
    data: number[][],
    method: 'pearson' | 'spearman' | 'kendall' = 'pearson'
): Promise<{
    correlationMatrix: number[][];
    pValues: number[][];
    method: string;
    rCode: string;
}> {
    const webR = await initWebR();

    const nCols = data[0]?.length || 0;

    const rCode = `
    library(psych)
    data_mat <- ${arrayToRMatrix(data)}
    df <- as.data.frame(data_mat)
    colnames(df) <- paste0("V", 1:ncol(df))

    method_name <- "${method}"
    ct <- corr.test(df, use = "pairwise", method = method_name, adjust = "none")

    list(
        correlation = as.vector(ct$r),
        p_values = as.vector(ct$p),
        n_cols = ncol(df),
        method = method_name
    )
    `;

    const result = await webR.evalR(rCode);
    const jsResult = await result.toJs() as any;
    const getValue = parseWebRResult(jsResult);

    const numCols = getValue('n_cols')?.[0] || nCols;

    return {
        correlationMatrix: parseMatrix(getValue('correlation'), numCols),
        pValues: parseMatrix(getValue('p_values'), numCols),
        method: method,
        rCode: rCode
    };
}

/**
 * Run Independent Samples T-test
 */
export async function runTTestIndependent(group1: number[], group2: number[]): Promise<{
    t: number;
    df: number;
    pValue: number;
    mean1: number;
    mean2: number;
    meanDiff: number;
    ci95Lower: number;
    ci95Upper: number;
    effectSize: number;
    varTestP: number;
    normalityP1: number;
    normalityP2: number;
    rCode: string;
}> {
    const rCode = `
    group1 <- c(${group1.join(',')})
    group2 <- c(${group2.join(',')})
    
    # Normality Test (Shapiro-Wilk)
    shapiro_p1 <- tryCatch({
        if (length(group1) >= 3 && length(group1) <= 5000) shapiro.test(group1)$p.value else NA
    }, error = function(e) NA)
    
    shapiro_p2 <- tryCatch({
        if (length(group2) >= 3 && length(group2) <= 5000) shapiro.test(group2)$p.value else NA
    }, error = function(e) NA)
    
    # Levene's Test (Brown-Forsythe)
    med1 <- median(group1)
    med2 <- median(group2)
    z1 <- abs(group1 - med1)
    z2 <- abs(group2 - med2)
    z_val <- c(z1, z2)
    g_fac <- factor(c(rep(1, length(z1)), rep(2, length(z2))))
    levene_test <- oneway.test(z_val ~ g_fac, var.equal = TRUE)
    levene_p <- levene_test$p.value
    
    var_equal <- levene_p > 0.05

    # T-Test
    result <- t.test(group1, group2, var.equal = var_equal)
    
    # Cohen's d
    pooledSD <- sqrt(((length(group1) - 1) * sd(group1)^2 + (length(group2) - 1) * sd(group2)^2) / (length(group1) + length(group2) - 2))
    cohensD <- (mean(group1) - mean(group2)) / pooledSD

    list(
        t = result$statistic,
        df = result$parameter,
        pValue = result$p.value,
        mean1 = mean(group1),
        mean2 = mean(group2),
        meanDiff = mean(group1) - mean(group2),
        ci95Lower = result$conf.int[1],
        ci95Upper = result$conf.int[2],
        effectSize = cohensD,
        leveneP = levene_p,
        normalityP1 = if(is.na(shapiro_p1)) -1 else shapiro_p1,
        normalityP2 = if(is.na(shapiro_p2)) -1 else shapiro_p2
    )
    `;

    const result = await executeRWithRecovery(rCode);

    return {
        t: result.t?.[0] || 0,
        df: result.df?.[0] || 0,
        pValue: result.pValue?.[0] || 0,
        mean1: result.mean1?.[0] || 0,
        mean2: result.mean2?.[0] || 0,
        meanDiff: result.meanDiff?.[0] || 0,
        ci95Lower: result.ci95Lower?.[0] || 0,
        ci95Upper: result.ci95Upper?.[0] || 0,
        effectSize: result.effectSize?.[0] || 0,
        varTestP: result.leveneP?.[0] || 0,
        normalityP1: result.normalityP1?.[0] || 0,
        normalityP2: result.normalityP2?.[0] || 0,
        rCode: rCode
    };
}

/**
 * Run Paired Samples T-test
 */
export async function runTTestPaired(before: number[], after: number[]): Promise<{
    t: number;
    df: number;
    pValue: number;
    meanBefore: number;
    meanAfter: number;
    meanDiff: number;
    ci95Lower: number;
    ci95Upper: number;
    effectSize: number;
    normalityDiffP: number;
    rCode: string;
}> {
    const rCode = `
    before <- c(${before.join(',')})
    after <- c(${after.join(',')})
    diffs <- before - after
    
    shapiro_diff_p <- tryCatch({
        if (length(diffs) >= 3 && length(diffs) <= 5000) shapiro.test(diffs)$p.value else NA
    }, error = function(e) NA)

    result <- t.test(before, after, paired = TRUE)
    
    mean_diff <- mean(diffs)
    sd_diff <- sd(diffs)
    cohens_d <- mean_diff / sd_diff

    list(
        t = result$statistic,
        df = result$parameter,
        pValue = result$p.value,
        meanBefore = mean(before),
        meanAfter = mean(after),
        meanDiff = mean_diff,
        ci95Lower = result$conf.int[1],
        ci95Upper = result$conf.int[2],
        effectSize = cohens_d,
        normalityDiffP = if(is.na(shapiro_diff_p)) -1 else shapiro_diff_p
    )
    `;

    const result = await executeRWithRecovery(rCode);

    return {
        t: result.t?.[0] || 0,
        df: result.df?.[0] || 0,
        pValue: result.pValue?.[0] || 0,
        meanBefore: result.meanBefore?.[0] || 0,
        meanAfter: result.meanAfter?.[0] || 0,
        meanDiff: result.meanDiff?.[0] || 0,
        ci95Lower: result.ci95Lower?.[0] || 0,
        ci95Upper: result.ci95Upper?.[0] || 0,
        effectSize: result.effectSize?.[0] || 0,
        normalityDiffP: result.normalityDiffP?.[0] || 0,
        rCode: rCode
    };
}

/**
 * Run One-Way ANOVA
 */
export async function runOneWayANOVA(groups: number[][]): Promise<{
    F: number;
    dfBetween: number;
    dfWithin: number;
    pValue: number;
    groupMeans: number[];
    grandMean: number;
    etaSquared: number;
    assumptionCheckP: number;
    normalityResidP: number;
    methodUsed: string;
    postHoc: { comparison: string; diff: number; pAdj: number }[];
    postHocWarning: string;
    rCode: string;
}> {
    const rCode = `
    values <- c(${groups.map(g => g.join(',')).join(',')})
    groups <- factor(c(${groups.map((g, i) => g.map(() => i + 1).join(',')).join(',')}))
    
    # === Helper: Games-Howell Function ===
    # Calculates pairwise comparisons without assuming equal variances
    run_games_howell <- function(vals, grps) {
        # Prepare statistics
        means <- tapply(vals, grps, mean)
        vars <- tapply(vals, grps, var)
        ns <- tapply(vals, grps, length)
        grps_unique <- levels(grps)
        k <- length(grps_unique)
        
        # Create combinations
        combs <- combn(k, 2)
        n_pairs <- ncol(combs)
        
        comparisons <- character(n_pairs)
        diffs <- numeric(n_pairs)
        p_adjs <- numeric(n_pairs)
        
        for (i in 1:n_pairs) {
            idx1 <- combs[1, i]
            idx2 <- combs[2, i]
            
            # Group specific stats
            m1 <- means[idx1]; m2 <- means[idx2]
            v1 <- vars[idx1]; v2 <- vars[idx2]
            n1 <- ns[idx1]; n2 <- ns[idx2]
            
            # Welch t-statistic components
            mean_diff <- m1 - m2
            se <- sqrt(v1/n1 + v2/n2)
            t_val <- abs(mean_diff) / se
            
            # Welch-Satterthwaite Degrees of Freedom
            df_num <- (v1/n1 + v2/n2)^2
            df_denom <- (v1/n1)^2/(n1-1) + (v2/n2)^2/(n2-1)
            df <- df_num / df_denom
            
            # Games-Howell uses Studentized Range (q = t * sqrt(2))
            q_val <- t_val * sqrt(2)
            
            # P-value from Studentized Range distribution
            p_val <- ptukey(q_val, k, df, lower.tail = FALSE)
            
            comparisons[i] <- paste0(grps_unique[idx1], "-", grps_unique[idx2])
            diffs[i] <- mean_diff
            p_adjs[i] <- p_val
        }
        
        list(comparisons = comparisons, diffs = diffs, p_adjs = p_adjs)
    }

    # Levene's Test (Brown-Forsythe)
    group_medians <- tapply(values, groups, median)
    deviations <- numeric(length(values))
    group_indices <- as.numeric(groups)
    for(i in 1:length(values)) { deviations[i] <- abs(values[i] - group_medians[group_indices[i]]) }
    levene_model <- aov(deviations ~ groups)
    levene_p <- summary(levene_model)[[1]][1, 5]
    
    ph_comparisons <- c()
    ph_diffs <- c()
    ph_padj <- c()
    posthoc_warning <- ""
    
    if (levene_p < 0.05) {
        # === UNEQUAL VARIANCE -> WELCH ANOVA + GAMES-HOWELL ===
        welch_result <- oneway.test(values ~ groups, var.equal = FALSE)
        f_stat <- welch_result$statistic
        df_between <- welch_result$parameter[1]
        df_within <- welch_result$parameter[2]
        p_val <- welch_result$p.value
        method_used <- "Welch ANOVA"
        
        # Calculate Eta Squared (approximate for Welch)
        # Note: Eta squared is tricky with Welch, using raw SS from standard ANOVA as approximation or omitting
        model_temp <- aov(values ~ groups)
        ssb <- summary(model_temp)[[1]][1, 2]
        sst <- ssb + summary(model_temp)[[1]][2, 2]
        eta_squared <- ssb / sst
        
        # Run Games-Howell
        gh <- run_games_howell(values, groups)
        ph_comparisons <- gh$comparisons
        ph_diffs <- gh$diffs
        ph_padj <- gh$p_adjs
        posthoc_warning <- "Phương sai không đồng nhất (Levene p < 0.05). Sử dụng Welch ANOVA & Games-Howell Post-hoc."
        
    } else {
        # === EQUAL VARIANCE -> CLASSIC ANOVA + TUKEY HSD ===
        model <- aov(values ~ groups)
        result_sum <- summary(model)[[1]]
        
        # Ensure we extract simple scalars, not named vectors
        f_stat <- as.numeric(result_sum[1, "F value"])
        df_between <- as.numeric(result_sum[1, "Df"])
        df_within <- as.numeric(result_sum[2, "Df"])
        p_val <- as.numeric(result_sum[1, "Pr(>F)"])
        method_used <- "Classic ANOVA"
        
        ssb <- result_sum[1, "Sum Sq"]
        sst <- ssb + result_sum[2, "Sum Sq"]
        eta_squared <- ssb / sst
        resids <- residuals(model)
        
        # Run Tukey HSD
        tukey_result <- TukeyHSD(model)$groups
        ph_comparisons <- rownames(tukey_result)
        ph_diffs <- tukey_result[, "diff"]
        ph_padj <- tukey_result[, "p adj"]
        posthoc_warning <- "Phương sai đồng nhất. Sử dụng Classic ANOVA & Tukey HSD."
    }
    
    model_resid <- aov(values ~ groups)
    resids <- residuals(model_resid)
    
    shapiro_resid_p <- tryCatch({
        if (length(resids) >= 3 && length(resids) <= 5000) shapiro.test(resids)$p.value else NA
    }, error = function(e) NA)
    
    groupMeans <- tapply(values, groups, mean)
    
    list(
        F = as.numeric(f_stat),
        dfBetween = as.numeric(df_between),
        dfWithin = as.numeric(df_within),
        pValue = as.numeric(p_val),
        groupMeans = as.numeric(groupMeans),
        grandMean = mean(values, na.rm=TRUE),
        etaSquared = as.numeric(eta_squared),
        leveneP = as.numeric(levene_p),
        normalityResidP = if(is.na(shapiro_resid_p)) -1 else shapiro_resid_p,
        methodUsed = method_used,
        postHocWarning = posthoc_warning,
        tukeyComparisons = ph_comparisons,
        tukeyDiffs = ph_diffs,
        tukeyPAdj = ph_padj
    )
    `;

    const result = await executeRWithRecovery(rCode);

    const comparisons = result.tukeyComparisons || [];
    const diffs = result.tukeyDiffs || [];
    const pAdjs = result.tukeyPAdj || [];
    const postHoc = [];

    // Safety check for array lengths
    const len = Math.min(comparisons.length, diffs.length, pAdjs.length);
    for (let i = 0; i < len; i++) {
        postHoc.push({ comparison: comparisons[i], diff: diffs[i], pAdj: pAdjs[i] });
    }

    return {
        F: result.F?.[0] || 0,
        dfBetween: result.dfBetween?.[0] || 0,
        dfWithin: result.dfWithin?.[0] || 0,
        pValue: result.pValue?.[0] || 0,
        groupMeans: result.groupMeans || [],
        grandMean: result.grandMean?.[0] || 0,
        etaSquared: result.etaSquared?.[0] || 0,
        assumptionCheckP: result.leveneP?.[0] || 0,
        normalityResidP: result.normalityResidP?.[0] || 0,
        methodUsed: result.methodUsed?.[0] || 'Classic ANOVA',
        postHoc: postHoc,
        postHocWarning: result.postHocWarning?.[0] || '',
        rCode
    };
}

/**
 * Run Mann-Whitney U Test
 */
export async function runMannWhitneyU(
    group1: number[],
    group2: number[]
): Promise<{
    statistic: number;
    pValue: number;
    median1: number;
    median2: number;
    effectSize: number;
    skew1: number;
    skew2: number;
    distShapeRun: string;
    rCode: string;
}> {
    const rCode = `
    library(psych)
    g1 <- c(${group1.join(',')})
    g2 <- c(${group2.join(',')})
    
    test <- wilcox.test(g1, g2, conf.int = TRUE)
    z_score <- qnorm(test$p.value / 2)
    effect_r <- abs(z_score) / sqrt(length(g1) + length(g2))
    
    # Check distribution shapes using Skewness
    sk1 <- skew(g1)
    sk2 <- skew(g2)
    
    # Heuristic: If skewness signs are same and diff < 1, shapes are "similar"
    similar_shape <- sign(sk1) == sign(sk2) && abs(sk1 - sk2) < 1.0
    dist_msg <- if(similar_shape) "Phân phối tương đồng (kiểm định Trung vị)" else "Phân phối khác biệt (kiểm định Mean Rank)"
    
    list(
        statistic = test$statistic,
        p_value = test$p.value,
        median1 = median(g1),
        median2 = median(g2),
        effect_size = effect_r,
        skew1 = sk1,
        skew2 = sk2,
        dist_msg = dist_msg
    )
    `;
    const result = await executeRWithRecovery(rCode);
    return {
        statistic: result.statistic?.[0] || 0,
        pValue: result.p_value?.[0] || 0,
        median1: result.median1?.[0] || 0,
        median2: result.median2?.[0] || 0,
        effectSize: result.effect_size?.[0] || 0,
        skew1: result.skew1?.[0] || 0,
        skew2: result.skew2?.[0] || 0,
        distShapeRun: result.dist_msg?.[0] || "Unknown",
        rCode
    };
}

/**
 * Run Chi-Square Test
 */
export async function runChiSquare(data: any[][]): Promise<{
    statistic: number;
    df: number;
    pValue: number;
    observed: { data: number[][]; rows: string[]; cols: string[] };
    expected: { data: number[][]; rows: string[]; cols: string[] };
    cramersV: number;
    phi: number; // For 2x2
    oddsRatio: number | null; // For 2x2
    fisherPValue: number | null;
    warning: string;
    rCode: string;
}> {
    const flatData = data.flat().map(v => `"${String(v).replace(/"/g, '\\"')}"`).join(',');
    const nRows = data.length;

    const rCode = `
    raw_vec <- c(${flatData})
    df_raw <- matrix(raw_vec, nrow = ${nRows}, byrow = TRUE)
    tbl <- table(df_raw[,1], df_raw[,2])
    test <- chisq.test(tbl)
    
    pct_cells_below_5 <- sum(test$expected < 5) / length(test$expected) * 100
    warning_msg <- if (pct_cells_below_5 > 20) paste0("Cảnh báo: ", round(pct_cells_below_5, 1), "% ô < 5. Nên dùng Fisher Exact.") else ""
    
    fisher_p <- NA
    odds_ratio <- NA
    phi_val <- NA
    
    n <- sum(tbl)
    
    # 2x2 Specific Metrics
    if (nrow(tbl) == 2 && ncol(tbl) == 2) {
        ft <- fisher.test(tbl)
        fisher_p <- ft$p.value
        odds_ratio <- ft$estimate # Conditional MLE Odds Ratio
        
        # Phi Coefficient
        phi_val <- sqrt(test$statistic / n)
    }
    
    cramers_v <- if(min(dim(tbl)) > 1) sqrt(test$statistic / (n * (min(dim(tbl)) - 1))) else 0
    
    list(
       statistic = test$statistic,
       parameter = test$parameter,
       p_value = test$p.value,
       observed = as.matrix(test$observed),
       expected = as.matrix(test$expected),
       cramers_v = cramers_v,
       phi = if(is.na(phi_val)) 0 else phi_val,
       odds_ratio = if(is.na(odds_ratio)) -1 else odds_ratio,
       fisher_p = fisher_p,
       warning_msg = warning_msg,
       row_names = rownames(tbl),
       col_names = colnames(tbl),
       n_rows = nrow(tbl),
       n_cols = ncol(tbl),
       obs_vals = as.vector(test$observed),
       exp_vals = as.vector(test$expected)
    )
    `;

    const result = await executeRWithRecovery(rCode);

    const nR = result.n_rows?.[0];
    const nC = result.n_cols?.[0];
    const obsVals = result.obs_vals;
    const expVals = result.exp_vals;

    const reconstruct = (vals: number[], rows: number, cols: number) => {
        const resMatrix = [];
        for (let r = 0; r < rows; r++) {
            const rowArr = [];
            for (let c = 0; c < cols; c++) rowArr.push(vals[r + c * rows]);
            resMatrix.push(rowArr);
        }
        return resMatrix;
    };

    return {
        statistic: result.statistic?.[0] || 0,
        df: result.parameter?.[0] || 0,
        pValue: result.p_value?.[0] || 0,
        observed: { data: reconstruct(obsVals, nR, nC), rows: result.row_names, cols: result.col_names },
        expected: { data: reconstruct(expVals, nR, nC), rows: result.row_names, cols: result.col_names },
        cramersV: result.cramers_v?.[0] || 0,
        phi: result.phi?.[0] || 0,
        oddsRatio: result.odds_ratio?.[0] === -1 ? null : result.odds_ratio?.[0],
        fisherPValue: result.fisher_p?.[0] ?? null,
        warning: result.warning_msg?.[0] || '',
        rCode
    };
}

/**
 * Run Kruskal-Wallis Test (Non-parametric One-Way ANOVA)
 */
export async function runKruskalWallis(
    groups: number[][]
): Promise<{
    statistic: number;
    df: number;
    pValue: number;
    medians: number[];
    method: string;
    rCode: string;
}> {
    const rCode = `
    values <- c(${groups.map(g => g.join(',')).join(',')})
    groups <- factor(c(${groups.map((g, i) => g.map(() => i + 1).join(',')).join(',')}))
    
    test <- kruskal.test(values ~ groups)
    group_medians <- tapply(values, groups, median)
    
    list(
        statistic = test$statistic,
        df = test$parameter,
        p_value = test$p.value,
        medians = as.numeric(group_medians),
        method = test$method
    )
    `;
    const result = await executeRWithRecovery(rCode);
    return {
        statistic: result.statistic?.[0] || 0,
        df: result.df?.[0] || 0,
        pValue: result.p_value?.[0] || 0,
        medians: result.medians || [],
        method: result.method?.[0] || "Kruskal-Wallis rank sum test",
        rCode
    };
}

/**
 * Run Wilcoxon Signed Rank Test (Non-parametric Paired T-test)
 */
export async function runWilcoxonSignedRank(
    before: number[],
    after: number[]
): Promise<{
    statistic: number;
    pValue: number;
    medianDiff: number;
    method: string;
    rCode: string;
}> {
    const rCode = `
    v_before <- c(${before.join(',')})
    v_after <- c(${after.join(',')})
    
    # Wilcoxon signed rank test with continuity correction
    test <- wilcox.test(v_before, v_after, paired = TRUE, conf.int = TRUE)
    
    list(
        statistic = test$statistic,
        p_value = test$p.value,
        median_diff = if(!is.null(test$estimate)) test$estimate else median(v_before - v_after),
        method = test$method
    )
    `;
    const result = await executeRWithRecovery(rCode);
    return {
        statistic: result.statistic?.[0] || 0,
        pValue: result.p_value?.[0] || 0,
        medianDiff: result.median_diff?.[0] || 0,
        method: result.method?.[0] || "Wilcoxon signed rank test",
        rCode
    };
}
