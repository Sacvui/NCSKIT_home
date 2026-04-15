/**
 * Descriptive Statistics & Validation - Template-Driven
 */
import { initWebR, executeRWithRecovery, loadPackagesForMethod } from '../core';
import { parseWebRResult } from '../utils';
import { getAnalysisRTemplate } from '../templates';

/**
 * Data Validation Helper
 */
export function validateData(data: number[][], minVars: number = 1, functionName: string = 'Analysis'): void {
    if (!data || data.length === 0) throw new Error(`${functionName}: Dữ liệu trống`);
    if (data[0].length < minVars) throw new Error(`${functionName}: Cần ít nhất ${minVars} biến`);
    if (data.some(row => row.some(val => val === Infinity || val === -Infinity))) {
        throw new Error(`${functionName}: Dữ liệu chứa giá trị vô cực (Infinity)`);
    }
    for (let col = 0; col < data[0].length; col++) {
        const values = data.map(row => row[col]);
        if (values.every(v => v === values[0])) {
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
    N: number[];
    skew: number[];
    kurtosis: number[];
    se: number[];
    rCode: string;
}> {
    await loadPackagesForMethod('descriptive');
    const defaultRCode = `
    library(psych);
    df <- as.data.frame({{data}});
    colnames(df) <- paste0("V", 1:ncol(df));
    desc <- describe(df, fast=FALSE);
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
    );
    `;
    const template = await getAnalysisRTemplate('descriptive', defaultRCode);
    const rCode = template.replace(/\{\{data\}\}/g, 'raw_data');
    const result = await executeRWithRecovery(rCode, 'descriptive', 0, 2, 120000, data);
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
