import { initWebR, executeRWithRecovery } from '../core';

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
 */
export async function runCBSEM(
  data: number[][],
  columns: string[],
  modelString: string,
  analysisType: 'cfa' | 'sem' = 'sem'
): Promise<SEMResult> {
  // Use core recovery executor for stability
  const rCommand = `
    library(lavaan)
    # Using R vector syntax c(...) instead of JS array [...]
    colnames_r <- c(${columns.map(c => `'${c}'`).join(',')})
    df <- as.data.frame(matrix(unlist(raw_data), ncol = length(colnames_r), byrow = TRUE))
    colnames(df) <- colnames_r
    
    # Use raw string or paste to handle multi-line lavaan syntax accurately
    model_syntax <- '${modelString.replace(/\n/g, "\\n")}'
    fit <- ${analysisType}(model_syntax, data=df, std.lv=TRUE, missing="fiml")
    
    # Extract Standard Academic Fit Indices
    fit_measures <- fitMeasures(fit, c("chisq", "df", "pvalue", "gfi", "cfi", "tli", "rmsea", "srmr", "aic", "bic"))
    estimates <- parameterEstimates(fit, standardized=TRUE)
    
    list(
      fit = as.list(fit_measures),
      estimates = as.list(estimates)
    )
  `;

  // Bind data using the core method via WebR instance
  const webR = await initWebR();
  await webR.objs.globalEnv.set('raw_data', data);

  const output = await executeRWithRecovery(rCommand);

  // Parse result from list structure
  const fitIndices: Record<string, number> = {};
  if (output.fit && output.fit.names) {
    output.fit.names.forEach((name: string, index: number) => {
      fitIndices[name] = output.fit.values[index];
    });
  }

  const estimates = output.estimates?.values || [];

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
