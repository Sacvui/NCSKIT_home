/**
 * Descriptive Statistics & Validation - Template-Driven
 */
import { WEBR_TIMEOUTS, getTimeoutForMethod } from '../constants';
import { executeRWithRecovery, loadPackagesForMethod } from '../core';
import { parseWebRResult } from '../utils';
import { getAnalysisRTemplate } from '../templates';

/**
 * Data Validation Helper
 */
export function validateData(data: number[][], minVars: number = 1, functionName: string = 'Analysis'): void {
    if (!data || data.length === 0) throw new Error(`${functionName}: Dá»¯ liá»‡u trá»‘ng`);
    if (data[0].length < minVars) throw new Error(`${functionName}: Cáº§n Ã­t nháº¥t ${minVars} biáº¿n`);
    if (data.some(row => row.some(val => val === Infinity || val === -Infinity))) {
        throw new Error(`${functionName}: Dá»¯ liá»‡u chá»©a giÃ¡ trá»‹ vÃ´ cá»±c (Infinity)`);
    }
    for (let col = 0; col < data[0].length; col++) {
        const values = data.map(row => row[col]);
        if (values.every(v => v === values[0])) {
            throw new Error(`${functionName}: Biáº¿n thá»© ${col + 1} cÃ³ giÃ¡ trá»‹ khÃ´ng Ä‘á»•i(variance = 0)`);
        }
    }
}

/**
 * Run descriptive statistics
 */
export async function runDescriptiveStats(data: number[][]): Promise<{
    mean: number[];
    sd: number[];
    min: number[];
    max: number[];
    median: number[];
    N: number[];
    skew: number[];
    kurtosis: number[];
    se: number[];
    rCode: string;
}> {
    await loadPackagesForMethod('descriptive');
    const defaultRCode = `
    # PURE BASE-R DESCRIPTIVE STATS (NO psych::describe)
    df <- as.data.frame(raw_data);
    colnames(df) <- paste0("V", 1:ncol(df));
    
    calc_skew <- function(x) {
        x <- x[!is.na(x)]
        n <- length(x)
        if (n < 3) return(NA)
        m <- mean(x)
        s <- sd(x)
        if (s == 0) return(0)
        (n / ((n-1)*(n-2))) * sum(((x - m) / s)^3)
    }
    
    calc_kurtosis <- function(x) {
        x <- x[!is.na(x)]
        n <- length(x)
        if (n < 4) return(NA)
        m <- mean(x)
        s <- sd(x)
        if (s == 0) return(0)
        ((n*(n+1)) / ((n-1)*(n-2)*(n-3))) * sum(((x - m) / s)^4) - (3*(n-1)^2) / ((n-2)*(n-3))
    }
    
    list(
        mean = sapply(df, mean, na.rm = TRUE),
        sd = sapply(df, sd, na.rm = TRUE),
        min = sapply(df, min, na.rm = TRUE),
        max = sapply(df, max, na.rm = TRUE),
        median = sapply(df, median, na.rm = TRUE),
        n = sapply(df, function(x) sum(!is.na(x))),
        skew = sapply(df, calc_skew),
        kurtosis = sapply(df, calc_kurtosis),
        se = sapply(df, function(x) { x <- x[!is.na(x)]; sd(x) / sqrt(length(x)) })
    );
    `;
    const template = await getAnalysisRTemplate('descriptive', defaultRCode);
    const rCode = template.replace(/\{\{data\}\}/g, 'raw_data');
    const result = await executeRWithRecovery(rCode, 'descriptive', 0, 2, WEBR_TIMEOUTS.COMPLEX, data);
    const getValue = parseWebRResult(result);
    return {
        mean: getValue('mean') || [],
        sd: getValue('sd') || [],
        min: getValue('min') || [],
        max: getValue('max') || [],
        median: getValue('median') || [],
        N: getValue('n') || [],
        skew: getValue('skew') || [],
        kurtosis: getValue('kurtosis') || [],
        se: getValue('se') || [],
        rCode
    };
}

