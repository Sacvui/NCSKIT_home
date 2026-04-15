/**
 * Mediation and Moderation Analysis Modules
 * Uses 'psych' package for robust mediation/moderation modeling.
 */
import { initWebR, executeRWithRecovery, loadPackagesForMethod } from '../core';
import { parseWebRResult } from '../utils';

/**
 * Run Mediation Analysis
 * Path: X -> M -> Y
 * Supports bootstrapping for indirect effects.
 */
export async function runMediationAnalysis(
    data: number[][],
    columns: string[],
    xVar: string,
    mVar: string,
    yVar: string,
    nBoot: number = 1000
): Promise<{
    effects: {
        total: number; // c
        direct: number; // c'
        indirect: number; // ab
    };
    paths: {
        a: { est: number; p: number }; // X -> M
        b: { est: number; p: number }; // M -> Y
        c: { est: number; p: number }; // X -> Y (Total)
        c_prime: { est: number; p: number }; // X -> Y (Direct)
    };
    bootstrap: {
        indirectLower: number;
        indirectUpper: number;
    };
    sobelTest: {
        z: number;
        p: number;
    };
    rCode: string;
}> {
    const webR = await initWebR();

    // Lazy load required packages (needs boot for bootstrapping)
    await loadPackagesForMethod('mediation');

    const rCode = `
    library(psych)
    
    data_mat <- raw_data
    df <- as.data.frame(data_mat)
    colnames(df) <- c(${columns.map(c => `"${c}"`).join(',')})
    
    # Ensure variables exist
    if(!all(c("${xVar}", "${mVar}", "${yVar}") %in% colnames(df))) {
        stop("Biến không tồn tại trong dữ liệu")
    }
    
    # === Step 1: Path a (X -> M) ===
    model_a <- lm(${mVar} ~ ${xVar}, data = df)
    sa <- summary(model_a)$coefficients
    a_est <- sa["${xVar}", "Estimate"]
    a_p <- sa["${xVar}", "Pr(>|t|)"]
    
    # === Step 2: Path c (X -> Y, Total Effect) ===
    model_c <- lm(${yVar} ~ ${xVar}, data = df)
    sc <- summary(model_c)$coefficients
    c_est <- sc["${xVar}", "Estimate"]
    c_p <- sc["${xVar}", "Pr(>|t|)"]
    
    # === Step 3: Path b and c' (M -> Y controlling for X, Direct Effect) ===
    model_bc <- lm(${yVar} ~ ${xVar} + ${mVar}, data = df)
    sbc <- summary(model_bc)$coefficients
    b_est <- sbc["${mVar}", "Estimate"]
    b_p <- sbc["${mVar}", "Pr(>|t|)"]
    c_prime_est <- sbc["${xVar}", "Estimate"]
    c_prime_p <- sbc["${xVar}", "Pr(>|t|)"]
    
    # === Indirect effect ===
    indirect <- a_est * b_est
    total <- c_est
    direct <- c_prime_est
    
    # === Sobel Test ===
    se_a <- sa["${xVar}", "Std. Error"]
    se_b <- sbc["${mVar}", "Std. Error"]
    sobel_se <- sqrt(b_est^2 * se_a^2 + a_est^2 * se_b^2)
    sobel_z <- indirect / sobel_se
    sobel_p <- 2 * (1 - pnorm(abs(sobel_z)))
    
    # === Bootstrap CI for indirect effect ===
    set.seed(123)
    n_boot <- ${nBoot}
    boot_indirect <- numeric(n_boot)
    for(i in 1:n_boot) {
        idx <- sample(1:nrow(df), replace = TRUE)
        boot_df <- df[idx, ]
        boot_a <- coef(lm(${mVar} ~ ${xVar}, data = boot_df))["${xVar}"]
        boot_b <- coef(lm(${yVar} ~ ${xVar} + ${mVar}, data = boot_df))["${mVar}"]
        boot_indirect[i] <- boot_a * boot_b
    }
    boot_ci <- quantile(boot_indirect, c(0.025, 0.975))
    
    list(
        total = as.numeric(total),
        direct = as.numeric(direct),
        indirect = as.numeric(indirect),
        
        a_est = as.numeric(a_est),
        a_p = as.numeric(a_p),
        b_est = as.numeric(b_est),
        b_p = as.numeric(b_p),
        c_est = as.numeric(c_est),
        c_p = as.numeric(c_p),
        c_p_est = as.numeric(c_prime_est),
        c_p_p = as.numeric(c_prime_p),
        
        sobel_z = as.numeric(sobel_z),
        sobel_p = as.numeric(sobel_p),
        
        boot_lower = as.numeric(boot_ci[1]),
        boot_upper = as.numeric(boot_ci[2])
    )
    `;

    const result = await executeRWithRecovery(rCode, 'mediation', 0, 2, 120000, data);
    const getValue = parseWebRResult(result);

    return {
        effects: {
            total: getValue('total')?.[0] ?? 0,
            direct: getValue('direct')?.[0] ?? 0,
            indirect: getValue('indirect')?.[0] ?? 0,
        },
        paths: {
            a: { est: getValue('a_est')?.[0] ?? 0, p: getValue('a_p')?.[0] ?? 1 },
            b: { est: getValue('b_est')?.[0] ?? 0, p: getValue('b_p')?.[0] ?? 1 },
            c: { est: getValue('c_est')?.[0] ?? 0, p: getValue('c_p')?.[0] ?? 1 },
            c_prime: { est: getValue('c_p_est')?.[0] ?? 0, p: getValue('c_p_p')?.[0] ?? 1 }
        },
        sobelTest: {
            z: getValue('sobel_z')?.[0] ?? 0,
            p: getValue('sobel_p')?.[0] ?? 1
        },
        bootstrap: {
            indirectLower: getValue('boot_lower')?.[0] ?? 0,
            indirectUpper: getValue('boot_upper')?.[0] ?? 0
        },
        rCode
    };
}

/**
 * Run Moderation Analysis
 * Model: Y ~ X + M + X*M
 */
export async function runModerationAnalysis(
    data: number[][],
    columns: string[],
    xVar: string,
    mVar: string, // Moderator
    yVar: string
): Promise<{
    coefficients: {
        term: string;
        estimate: number;
        pValue: number;
    }[];
    interactionSignificant: boolean;
    slopes: {
        level: string; // -1 SD, Mean, +1 SD
        slope: number;
        pValue: number;
    }[];
    rCode: string;
}> {
    const webR = await initWebR();

    // Lazy load required packages (needs boot for simple slopes)
    await loadPackagesForMethod('moderation');

    const rCode = `
    library(psych)
    
    data_mat <- raw_data
    df <- as.data.frame(data_mat)
    colnames(df) <- c(${columns.map(c => `"${c}"`).join(',')})
    
    # Center variables (Good practice for moderation)
    df$${xVar}_c <- scale(df$${xVar}, scale = FALSE)
    df$${mVar}_c <- scale(df$${mVar}, scale = FALSE)
    
    # Manual Interaction Model (lm is robust enough and clearer than mediate(mod=...))
    f_str <- paste("${yVar} ~ ${xVar} * ${mVar}") # Auto includes main effects and interaction
    model <- lm(as.formula(f_str), data = df)
    
    s <- summary(model)
    coefs <- coef(s)
    
    # Interaction Term Name usually "${xVar}:${mVar}" or "${mVar}:${xVar}"
    # We find the one with ':'
    int_row_idx <- grep(":", rownames(coefs))[1]
    int_p_val <- if(is.na(int_row_idx)) 1 else coefs[int_row_idx, 4]
    
    # Simple Slopes Analysis (Spotlight at -1SD, Mean, +1SD of Moderator)
    m_mean <- mean(df$${mVar}, na.rm=TRUE)
    m_sd <- sd(df$${mVar}, na.rm=TRUE)
    
    m_low <- m_mean - m_sd
    m_high <- m_mean + m_sd
    
    # Calculate simple slopes using centered equation logic
    # Slope of X = b1 + b3 * M
    b1 <- coef(model)["${xVar}"]
    b3 <- coefs[int_row_idx, 1]
    
    slope_mean <- b1 + b3 * m_mean
    slope_low <- b1 + b3 * m_low
    slope_high <- b1 + b3 * m_high
    
    # Can also re-run LM with shifted moderator to get significance
    # Low
    df$adj_low <- df$${mVar} - m_low
    m_low_model <- lm(as.formula(paste("${yVar} ~ ${xVar} * adj_low")), data = df)
    p_low <- summary(m_low_model)$coefficients["${xVar}", 4]
    
    # High
    df$adj_high <- df$${mVar} - m_high
    m_high_model <- lm(as.formula(paste("${yVar} ~ ${xVar} * adj_high")), data = df)
    p_high <- summary(m_high_model)$coefficients["${xVar}", 4]
    
    # Mean
    p_mean <- coefs["${xVar}", 4] # Assuming centered? No, original model isn't centered on variables, wait.
    # To get p at mean, we should use centered M in original model regression
    # Actually let's use the centered calculation for cleaner P at mean
    
    # Correct approach for P at mean:
    df$adj_mean <- df$${mVar} - m_mean
    m_mean_model <- lm(as.formula(paste("${yVar} ~ ${xVar} * adj_mean")), data = df)
    p_mean_calc <- summary(m_mean_model)$coefficients["${xVar}", 4]
    
    list(
        terms = rownames(coefs),
        estimates = coefs[, 1],
        p_values = coefs[, 4],
        int_significant = int_p_val < 0.05,
        
        slope_low = slope_low,
        p_low = p_low,
        slope_mean = slope_mean,
        p_mean = (p_mean_calc), 
        slope_high = slope_high,
        p_high = p_high
    )
    `;

    const result = await executeRWithRecovery(rCode, 'moderation', 0, 2, 120000, data);
    const getValue = parseWebRResult(result);

    const terms = getValue('terms') || [];
    const estimates = getValue('estimates') || [];
    const pValues = getValue('p_values') || [];

    const coefficients = [];
    for (let i = 0; i < terms.length; i++) {
        coefficients.push({
            term: terms[i],
            estimate: estimates[i],
            pValue: pValues[i]
        });
    }

    return {
        coefficients,
        interactionSignificant: getValue('int_significant')?.[0] || false,
        slopes: [
            { level: 'Low (-1 SD)', slope: getValue('slope_low')?.[0] || 0, pValue: getValue('p_low')?.[0] || 0 },
            { level: 'Mean', slope: getValue('slope_mean')?.[0] || 0, pValue: getValue('p_mean')?.[0] || 0 },
            { level: 'High (+1 SD)', slope: getValue('slope_high')?.[0] || 0, pValue: getValue('p_high')?.[0] || 0 }
        ],
        rCode
    };
}
