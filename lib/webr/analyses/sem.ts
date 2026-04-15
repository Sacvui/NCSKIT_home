/**
 * SEM Analysis Modules - Template-Driven
 */
import { executeRWithRecovery, loadPackagesForMethod } from '../core';
import { parseWebRResult } from '../utils';
import { getAnalysisRTemplate } from '../templates';

export interface SEMResult {
    fitMeasures: {
        cfi: number;
        tli: number;
        rmsea: number;
        srmr: number;
        chisq: number;
        df: number;
        pvalue: number;
    };
    estimates: any[];
    rCode: string;
    warning?: string;
    error?: string;
}

/**
 * Run a true CFA or SEM using lavaan
 */
export async function runLavaanAnalysis(data: number[][], columns: string[], model: string): Promise<SEMResult> {
    await loadPackagesForMethod('sem');

    const defaultRCode = `
    library(lavaan);
    df <- as.data.frame({{data}});
    colnames(df) <- c({{columns}});
    mod_str <- "{{model}}";
    fit <- tryCatch({
        sem(model = mod_str, data = df, std.lv = TRUE);
    }, error = function(e) { stop(paste("Lavaan Error:", e$message)) });
    
    fm <- fitMeasures(fit);
    est <- parameterEstimates(fit, standardized = TRUE);
    
    list(
        cfi = as.numeric(fm["cfi"]),
        tli = as.numeric(fm["tli"]),
        rmsea = as.numeric(fm["rmsea"]),
        srmr = as.numeric(fm["srmr"]),
        chisq = as.numeric(fm["chisq"]),
        df = as.numeric(fm["df"]),
        pvalue = as.numeric(fm["pvalue"]),
        est_list = split(est, seq(nrow(est)))
    );
    `;

    const colNames = columns.map(c => `"${c}"`).join(',');
    const escapeModel = model.replace(/\n/g, '\\n').replace(/"/g, '\\"');

    const template = await getAnalysisRTemplate('sem', defaultRCode);
    const rCode = template
        .replace(/\{\{data\}\}/g, 'raw_data')
        .replace(/\{\{columns\}\}/g, colNames)
        .replace(/\{\{model\}\}/g, escapeModel);

    try {
        const result = await executeRWithRecovery(rCode, 'sem', 0, 2, 180000, data);
        const getValue = parseWebRResult(result);

        const estimatesRaw = getValue('est_list') || [];
        const estimates = estimatesRaw.map((item: any) => {
            const ev = parseWebRResult(item);
            return {
                lhs: ev('lhs')?.[0] || '',
                op: ev('op')?.[0] || '',
                rhs: ev('rhs')?.[0] || '',
                est: ev('est')?.[0] || 0,
                se: ev('se')?.[0] || 0,
                z: ev('z')?.[0] || 0,
                pvalue: ev('pvalue')?.[0] || 0,
                std: ev('std.all')?.[0] || 0
            };
        });

        return {
            fitMeasures: {
                cfi: getValue('cfi')?.[0] || 0,
                tli: getValue('tli')?.[0] || 0,
                rmsea: getValue('rmsea')?.[0] || 0,
                srmr: getValue('srmr')?.[0] || 0,
                chisq: getValue('chisq')?.[0] || 0,
                df: getValue('df')?.[0] || 0,
                pvalue: getValue('pvalue')?.[0] || 0
            },
            estimates,
            rCode
        };
    } catch (e: any) {
        return {
            fitMeasures: { cfi: 0, tli: 0, rmsea: 0, srmr: 0, chisq: 0, df: 0, pvalue: 0 },
            estimates: [],
            rCode,
            error: e.message || String(e)
        };
    }
}

export const runSEM = runLavaanAnalysis;
