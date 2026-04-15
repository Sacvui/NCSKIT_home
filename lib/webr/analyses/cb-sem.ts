import { executeRWithRecovery } from '../core';

export interface SEMResult {
  fitIndices: Record<string, number>;
  parameterEstimates: any[];
  standardizedEstimates: any[];
  warnings: string[];
  errors: string[];
}

/**
 * Execute a lavaan model (CB-SEM)
 * Powered by lavaan (R package)
 *
 * Uses csvData param to inject data via webR.objs.globalEnv.bind()
 * — avoids FileReaderSync/Blob crash in PostMessage channel.
 */
export async function runCBSEM(
  data: number[][],
  columns: string[],
  modelString: string,
  analysisType: 'cfa' | 'sem' = 'sem'
): Promise<SEMResult> {
  const colNamesR = columns.map(c => `'${c}'`).join(',');
  const escapedModel = modelString.replace(/\n/g, '\\n').replace(/'/g, "\\'");

  const rCommand = `
    library(lavaan)
    colnames_r <- c(${colNamesR})
    df <- as.data.frame(raw_data)
    colnames(df) <- colnames_r
    
    model_syntax <- '${escapedModel}'
    fit <- ${analysisType}(model_syntax, data=df, std.lv=TRUE, missing="fiml")
    
    fit_measures <- fitMeasures(fit, c("chisq", "df", "pvalue", "gfi", "cfi", "tli", "rmsea", "srmr", "aic", "bic"))
    estimates <- parameterEstimates(fit, standardized=TRUE)
    
    list(
      fit = as.list(fit_measures),
      estimates = as.list(estimates)
    )
  `;

  const output = await executeRWithRecovery(rCommand, 'sem', 0, 2, 180000, data);

  // Parse result from list structure
  const fitIndices: Record<string, number> = {};
  if (output?.fit && output.fit.names) {
    output.fit.names.forEach((name: string, index: number) => {
      fitIndices[name] = output.fit.values[index];
    });
  }

  const estimates = output?.estimates?.values || [];

  return {
    fitIndices,
    parameterEstimates: estimates,
    standardizedEstimates: estimates.filter((p: any) => p.std_all !== undefined),
    warnings: [],
    errors: []
  };
}

/**
 * Helper to generate simple lavaan syntax from Factor metadata
 */
export function generateLavaanSyntax(factors: { name: string; indicators: string[] }[]): string {
  return factors
    .map(f => `${f.name} =~ ${f.indicators.join(' + ')}`)
    .join('\n');
}
