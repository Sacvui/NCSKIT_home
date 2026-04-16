/**
 * WebR Constants
 *
 * Centralized timeout and configuration constants for WebR analysis execution.
 * Use these instead of hardcoded numbers in analysis modules.
 */

/**
 * Execution timeouts (milliseconds) for different analysis complexity levels.
 *
 * Guidelines:
 * - SIMPLE:  Descriptive stats, basic correlation — fast, no iterative algorithms
 * - STANDARD: T-test, ANOVA, chi-square, Mann-Whitney — moderate computation
 * - COMPLEX:  EFA, CFA, SEM, mediation with bootstrap — heavy iterative algorithms
 * - INIT:     WebR engine initialization — includes package download on first run
 */
export const WEBR_TIMEOUTS = {
    /** 30 seconds — descriptive stats, simple correlation */
    SIMPLE: 30_000,
    /** 60 seconds — t-test, ANOVA, regression, chi-square, non-parametric */
    STANDARD: 60_000,
    /** 120 seconds — EFA, CFA, SEM, mediation with bootstrap */
    COMPLEX: 120_000,
    /** 180 seconds — WebR engine initialization (includes package download) */
    INIT: 180_000,
} as const;

/**
 * Maximum retry attempts for failed R executions.
 */
export const WEBR_MAX_RETRIES = 2;

/**
 * Minimum number of observations required for reliable analysis.
 */
export const MIN_OBSERVATIONS = {
    /** Minimum for any analysis */
    ABSOLUTE: 10,
    /** Recommended minimum for reliable results */
    RECOMMENDED: 30,
    /** Minimum for EFA/CFA */
    FACTOR_ANALYSIS: 50,
    /** Minimum for SEM */
    SEM: 100,
} as const;

/**
 * Analysis method → timeout mapping.
 * Use getTimeoutForMethod() to look up the appropriate timeout.
 */
const METHOD_TIMEOUTS: Record<string, number> = {
    // Simple
    descriptive: WEBR_TIMEOUTS.SIMPLE,
    correlation: WEBR_TIMEOUTS.SIMPLE,

    // Standard
    cronbach: WEBR_TIMEOUTS.STANDARD,
    omega: WEBR_TIMEOUTS.STANDARD,
    ttest: WEBR_TIMEOUTS.STANDARD,
    'ttest-indep': WEBR_TIMEOUTS.STANDARD,
    'ttest-paired': WEBR_TIMEOUTS.STANDARD,
    anova: WEBR_TIMEOUTS.STANDARD,
    chisquare: WEBR_TIMEOUTS.STANDARD,
    'mann-whitney': WEBR_TIMEOUTS.STANDARD,
    'kruskal-wallis': WEBR_TIMEOUTS.STANDARD,
    wilcoxon: WEBR_TIMEOUTS.STANDARD,
    regression: WEBR_TIMEOUTS.STANDARD,
    'linear-regression': WEBR_TIMEOUTS.STANDARD,
    'logistic-regression': WEBR_TIMEOUTS.STANDARD,

    // Complex
    efa: WEBR_TIMEOUTS.COMPLEX,
    cfa: WEBR_TIMEOUTS.COMPLEX,
    sem: WEBR_TIMEOUTS.COMPLEX,
    mediation: WEBR_TIMEOUTS.COMPLEX,
    moderation: WEBR_TIMEOUTS.COMPLEX,
    cluster: WEBR_TIMEOUTS.COMPLEX,
    bootstrap: WEBR_TIMEOUTS.COMPLEX,
    htmt: WEBR_TIMEOUTS.COMPLEX,
};

/**
 * Get the appropriate timeout for a given analysis method.
 * Falls back to STANDARD if method is not found.
 */
export function getTimeoutForMethod(method: string): number {
    return METHOD_TIMEOUTS[method.toLowerCase()] ?? WEBR_TIMEOUTS.STANDARD;
}
