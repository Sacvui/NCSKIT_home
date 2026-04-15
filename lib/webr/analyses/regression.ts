/**
 * Regression Analysis Modules - Template-Driven
 */
import { initWebR, executeRWithRecovery, loadPackagesForMethod } from '../core';
import { parseWebRResult, arrayToRMatrix } from '../utils';
import { getAnalysisRTemplate } from '../templates';

/**
 * Run Multiple Linear Regression
 */
export async function runLinearRegression(data: number[][], names: string[]): Promise<{
    coefficients: {
        term: string;
        estimate: number;
        stdBeta: number;
        stdError: number;
        tValue: number;
        pValue: number;
        vif?: number;
    }[];
    modelFit: {
        rSquared: number;
        adjRSquared: number;
        fStatistic: number;
        df: number;
        dfResid: number;
        pValue: number;
        residualStdError: number;
        normalityP: number;
    };
    equation: string;
    chartData: {
        fitted: number[];
        residuals: number[];
        actual: number[];
    };
    rCode: string;
}> {
    await loadPackagesForMethod('linear-regression');

    const defaultRCode = `
    df <- as.data.frame({{data}});
    colnames(df) <- c({{names}});
    y_name <- colnames(df)[1];
    f_str <- paste0("\`", y_name, "\` ~ .");
    mod <- lm(as.formula(f_str), data = df);
    s <- summary(mod);
    cf <- coef(s);
    fs <- s$fstatistic;
    
    # VIF Calculation
    vifs <- tryCatch({
        x_data <- df[, -1, drop = FALSE];
        if (ncol(x_data) > 1) {
            v <- numeric(ncol(x_data));
            for (i in 1:ncol(x_data)) {
                r2 <- summary(lm(x_data[, i] ~ ., data = x_data[, -i, drop = FALSE]))$r.squared;
                v[i] <- if (r2 >= 0.9999) 999.99 else 1 / (1 - r2);
            }
            v;
        } else { 1.0 }
    }, error = function(e) numeric(0));

    # Standardized Betas
    sb <- tryCatch({
        b <- cf[-1, 1];
        sx <- sapply(df[, -1, drop = FALSE], sd, na.rm = TRUE);
        sy <- sd(df[, 1], na.rm = TRUE);
        c(NA, b * sx / sy);
    }, error = function(e) rep(NA, nrow(cf)));

    sh_p <- tryCatch(shapiro.test(residuals(mod))$p.value, error = function(e) 0);

    list(
        c_names = rownames(cf),
        estimates = as.vector(cf[, 1]),
        s_betas = as.vector(sb),
        errors = as.vector(cf[, 2]),
        t_vals = as.vector(cf[, 3]),
        p_vals = as.vector(cf[, 4]),
        r2 = as.numeric(s$r.squared),
        ar2 = as.numeric(s$adj.r.squared),
        f = if(is.null(fs)) 0 else fs[1],
        df_n = if(is.null(fs)) 0 else fs[2],
        df_d = if(is.null(fs)) 0 else fs[3],
        sigma = as.numeric(s$sigma),
        fit = as.vector(fitted(mod)),
        res = as.vector(residuals(mod)),
        act = as.vector(df[, 1]),
        vifs = as.vector(vifs),
        norm_p = as.numeric(sh_p)
    );
    `;

    const namesStr = names.map(n => `"${n}"`).join(',');
    const template = await getAnalysisRTemplate('regression', defaultRCode);
    const rCode = template
        .replace(/\{\{data\}\}/g, 'raw_data')
        .replace(/\{\{names\}\}/g, namesStr);

    const result = await executeRWithRecovery(rCode, 'linear-regression', 0, 2, 120000, data);
    const getValue = parseWebRResult(result);

    const cNames = getValue('c_names') || [];
    const estimates = getValue('estimates') || [];
    const sBetas = getValue('s_betas') || [];
    const errors = getValue('errors') || [];
    const tVals = getValue('t_vals') || [];
    const pVals = getValue('p_vals') || [];
    const vifs = getValue('vifs') || [];

    const coefficients = cNames.map((name: string, i: number) => ({
        term: name,
        estimate: estimates[i] || 0,
        stdBeta: sBetas[i] || 0,
        stdError: errors[i] || 0,
        tValue: tVals[i] || 0,
        pValue: pVals[i] || 0,
        vif: i > 0 ? vifs[i - 1] : undefined
    }));

    const f = getValue('f')?.[0] ?? 0;
    const df_n = getValue('df_n')?.[0] ?? 0;
    const df_d = getValue('df_d')?.[0] ?? 0;
    const fP = 1 - 0; // Simplified p-value for F in JS if needed or just use R value

    return {
        coefficients,
        modelFit: {
            rSquared: getValue('r2')?.[0] ?? 0,
            adjRSquared: getValue('ar2')?.[0] ?? 0,
            fStatistic: f,
            df: df_n,
            dfResid: df_d,
            pValue: 0, // Will be updated if needed or use R-side p-value
            residualStdError: getValue('sigma')?.[0] ?? 0,
            normalityP: getValue('norm_p')?.[0] ?? 0
        },
        equation: `${names[0]} = ...`, // Equation builder can be more complex
        chartData: {
            fitted: getValue('fit') || [],
            residuals: getValue('res') || [],
            actual: getValue('act') || []
        },
        rCode
    };
}

/**
 * Run Logistic Regression (Binary)
 */
export async function runLogisticRegression(data: number[][], names: string[]): Promise<any> {
    await loadPackagesForMethod('logistic-regression');
    const defaultRCode = `
    df <- as.data.frame({{data}});
    colnames(df) <- c({{names}});
    y_name <- colnames(df)[1];
    f_str <- paste0("\`", y_name, "\` ~ .");
    mod <- glm(as.formula(f_str), data = df, family = binomial);
    s <- summary(mod);
    cf <- coef(s);
    list(
        c_names = rownames(cf),
        estimates = as.vector(cf[, 1]),
        errors = as.vector(cf[, 2]),
        z_vals = as.vector(cf[, 3]),
        p_vals = as.vector(cf[, 4]),
        aic = s$aic,
        null_dev = s$null.deviance,
        resid_dev = s$deviance
    );
    `;
    const namesStr = names.map(n => `"${n}"`).join(',');
    const template = await getAnalysisRTemplate('logistic', defaultRCode);
    const rCode = template.replace(/\{\{data\}\}/g, 'raw_data').replace(/\{\{names\}\}/g, namesStr);
    const result = await executeRWithRecovery(rCode, 'logistic-regression', 0, 2, 120000, data);
    return { result, rCode };
}
