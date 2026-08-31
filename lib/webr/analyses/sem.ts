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
        gfi: number;
        agfi: number;
        nfi: number;
    };
    estimates: any[];
    rCode: string;
    warning?: string;
    error?: string;
}

/**
 * Run a true CFA or SEM using lavaan
 */
export async function runLavaanAnalysis(
    data: number[][], 
    columns: string[], 
    model: string,
    estimator: 'ML' | 'MLR' | 'MLM' | 'ULS' = 'MLR'
): Promise<SEMResult> {
    await loadPackagesForMethod('sem');

    const defaultRCode = `
    library(lavaan);
    df <- as.data.frame({{data}});
    colnames(df) <- c({{columns}});
    mod_str <- "{{model}}";
    
    # Use robust estimator by default for Likert data
    fit <- tryCatch({
        sem(model = mod_str, data = df, std.lv = TRUE, missing = "fiml", estimator = "{{estimator}}")
    }, error = function(e) { 
        # Fallback to listwise deletion if FIML fails
        sem(model = mod_str, data = df, std.lv = TRUE, missing = "listwise", estimator = "{{estimator}}")
    })
    
    # Extract fit measures safely
    fm <- tryCatch({ fitMeasures(fit) }, error = function(e) { c(cfi=0, tli=0, rmsea=0, srmr=0, chisq=0, df=1, pvalue=0) })
    est <- tryCatch({ parameterEstimates(fit, standardized = TRUE) }, error = function(e) { data.frame() })
    
    list(
        cfi = if("cfi" %in% names(fm) && !is.na(fm["cfi"])) as.numeric(fm["cfi"]) else 0,
        tli = if("tli" %in% names(fm) && !is.na(fm["tli"])) as.numeric(fm["tli"]) else 0,
        rmsea = if("rmsea" %in% names(fm) && !is.na(fm["rmsea"])) as.numeric(fm["rmsea"]) else 0,
        srmr = if("srmr" %in% names(fm) && !is.na(fm["srmr"])) as.numeric(fm["srmr"]) else 0,
        chisq = if("chisq" %in% names(fm) && !is.na(fm["chisq"])) as.numeric(fm["chisq"]) else 0,
        df = if("df" %in% names(fm) && !is.na(fm["df"])) as.numeric(fm["df"]) else 1,
        pvalue = if("pvalue" %in% names(fm) && !is.na(fm["pvalue"])) as.numeric(fm["pvalue"]) else 0,
        gfi = if("gfi" %in% names(fm) && !is.na(fm["gfi"])) as.numeric(fm["gfi"]) else 0,
        agfi = if("agfi" %in% names(fm) && !is.na(fm["agfi"])) as.numeric(fm["agfi"]) else 0,
        nfi = if("nfi" %in% names(fm) && !is.na(fm["nfi"])) as.numeric(fm["nfi"]) else 0,
        est_list = if(nrow(est) > 0) split(est, seq(nrow(est))) else list()
    );
    `;

    const colNames = columns.map(c => `"${c}"`).join(',');
    const escapeModel = model.replace(/\n/g, '\\n').replace(/"/g, '\\"');

    const template = await getAnalysisRTemplate('sem', defaultRCode);
    const rCode = template
        .replace(/\{\{data\}\}/g, 'raw_data')
        .replace(/\{\{columns\}\}/g, colNames)
        .replace(/\{\{model\}\}/g, escapeModel)
        .replace(/\{\{estimator\}\}/g, estimator);

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
                pvalue: getValue('pvalue')?.[0] || 0,
                gfi: getValue('gfi')?.[0] || 0,
                agfi: getValue('agfi')?.[0] || 0,
                nfi: getValue('nfi')?.[0] || 0
            },
            estimates,
            rCode
        };
    } catch (e: any) {
        return {
            fitMeasures: { cfi: 0, tli: 0, rmsea: 0, srmr: 0, chisq: 0, df: 0, pvalue: 0, gfi: 0, agfi: 0, nfi: 0 },
            estimates: [],
            rCode,
            error: e.message || String(e)
        };
    }
}

export const runSEM = runLavaanAnalysis;
