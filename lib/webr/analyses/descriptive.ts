/**
 * Descriptive Statistics & Validation Modules
 */
import { initWebR, executeRWithRecovery } from '../core';
import { parseWebRResult, arrayToRMatrix } from '../utils';

/**
 * Data Validation Helper
 */
export function validateData(data: number[][], minVars: number = 1, functionName: string = 'Analysis'): void {
    if (!data || data.length === 0) {
        throw new Error(`${functionName}: Dữ liệu trống`);
    }

    if (data[0].length < minVars) {
        throw new Error(`${functionName}: Cần ít nhất ${minVars} biến`);
    }

    // Check for invalid values (Infinity only, allow NaN/null/undefined for R to handle as NA)
    const hasInfinity = data.some(row =>
        row.some(val => val === Infinity || val === -Infinity)
    );

    if (hasInfinity) {
        throw new Error(`${functionName}: Dữ liệu chứa giá trị vô cực (Infinity)`);
    }

    // Check for constant columns (zero variance)
    for (let col = 0; col < data[0].length; col++) {
        const values = data.map(row => row[col]);
        const allSame = values.every(v => v === values[0]);
        if (allSame) {
            throw new Error(`${functionName}: Biến thứ ${col + 1} có giá trị không đổi(variance = 0)`);
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
    N: number[]; // Valid N per variable
    skew: number[];
    kurtosis: number[];
    se: number[];
}> {
    const webR = await initWebR();

    const rCode = `
    library(psych)
    data_mat <- ${arrayToRMatrix(data)}
    df <- as.data.frame(data_mat)
    colnames(df) <- paste0("V", 1:ncol(df))
    
    desc <- describe(df)
    
    list(
        mean = as.numeric(desc$mean),
        sd = as.numeric(desc$sd),
        min = as.numeric(desc$min),
        max = as.numeric(desc$max),
        median = as.numeric(desc$median),
        n = as.numeric(desc$n),
        skew = as.numeric(desc$skew),
        kurtosis = as.numeric(desc$kurtosis),
        se = as.numeric(desc$se)
    )
    `;

    const result = await executeRWithRecovery(rCode);
    // CRITICAL FIX: executeRWithRecovery returns unpacked plain object like:
    // {mean: [1,2,3], sd: [0.5,0.6], ...}
    // No need for parseWebRResult - just access properties directly!

    return {
        mean: result.mean || [],
        sd: result.sd || [],
        min: result.min || [],
        max: result.max || [],
        median: result.median || [],
        N: result.n || [],  // Note: R returns 'n', we map to 'N'
        skew: result.skew || [],
        kurtosis: result.kurtosis || [],
        se: result.se || []
    };
}
