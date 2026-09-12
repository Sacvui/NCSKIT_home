/**
 * ASIG - Auto Statistical Interpretation Generator
 * Template-based interpretation system (NO AI REQUIRED)
 * 
 * Math symbols use Unicode for cross-device compatibility:
 * - α (alpha), β (beta), χ² (chi-square), η² (eta-squared)
 * - M (mean), SD, p, r, F, t, df
 * - ≥, ≤, <, >, ≠
 */

// ===== UTILITY FUNCTIONS =====

/**
 * Format p-value according to APA style
 * - No leading zero
 * - If p < .001, show "p < .001"
 */
export function formatPValue(p: number): string {
    if (p < 0.001) return 'p < .001';
    if (p < 0.01) return `p = ${p.toFixed(3).replace('0.', '.')}`;
    if (p < 0.05) return `p = ${p.toFixed(3).replace('0.', '.')}`;
    return `p = ${p.toFixed(2).replace('0.', '.')}`;
}

/**
 * Format correlation/alpha values (no leading zero for values < 1)
 */
export function formatCoef(val: number, decimals: number = 2): string {
    if (Math.abs(val) < 1) {
        return val.toFixed(decimals).replace('0.', '.');
    }
    return val.toFixed(decimals);
}

/**
 * Format regular numbers (with leading zero)
 */
export function formatNum(val: number, decimals: number = 2): string {
    return val.toFixed(decimals);
}

// ===== INTERPRETATION TYPES =====

export type AnalysisType =
    | 'cronbach_alpha'
    | 'correlation'
    | 'ttest_independent'
    | 'ttest_paired'
    | 'anova'
    | 'two_way_anova'
    | 'efa'
    | 'cfa'
    | 'linear_regression'
    | 'logistic_regression'
    | 'mann_whitney'
    | 'kruskal_wallis'
    | 'wilcoxon_signed'
    | 'chi_square'
    | 'mediation'
    | 'moderation'
    | 'cluster'
    | 'descriptive'
    | 'vif'
    | 'outlier'
    | 'htmt'
    | 'pls-sem';

export interface InterpretationResult {
    summary: string;        // Main interpretation
    details: string[];      // Additional points
    warnings: string[];     // Assumption violations
    citations: string[];    // Academic references
}

