/**
 * Package Registry for WebR Lazy Loading
 * Maps analysis methods to their required R packages
 */

export const PACKAGE_REGISTRY = {
    // Descriptive Statistics — now uses pure Base R (sapply, mean, sd, etc.)
    'descriptive': [],

    // Reliability Analysis
    'cronbach': [], // Calculated manually with Base R
    'efa': [],      // Uses factanal() + eigen() + varimax() from Base R. GPArotation loaded on-demand only for oblimin.
    'cfa': ['lavaan'],

    // Hypothesis Testing (most use built-in stats)
    'ttest': [],
    'paired-ttest': [],
    'anova': [],
    'mann-whitney': [],  // skewness calculated inline with Base R
    'wilcoxon': [],
    'kruskal': [],
    'chi-square': [],

    // Correlation — now uses Base R cor() + cor.test()
    'correlation': [],

    // Regression — VIF calculated manually, car package not needed
    'linear-regression': [],
    'logistic-regression': [],

    // SEM
    'sem': ['lavaan'],
    'cbsem': ['lavaan'],
    'cbsem-select': ['lavaan'],
    'cfa-select': ['lavaan'],
    'omega-select': [],  // Omega not currently active; will use Base R when implemented
    'pls-sem': ['seminr'],

    // Multivariate
    'cluster': ['cluster'],
    'two-way-anova': [],
    'anova2way': [],

    // Mediation & Moderation — uses Base R lm() + manual bootstrap
    'mediation': [],
    'moderation': [],
} as const;

export type AnalysisMethod = keyof typeof PACKAGE_REGISTRY;

// Track loaded packages in session
const loadedPackages = new Set<string>();

/**
 * Get required packages for an analysis method
 */
export function getRequiredPackages(method: string): string[] {
    const packages = PACKAGE_REGISTRY[method as AnalysisMethod];
    return packages ? [...packages] : []; // Convert readonly to mutable array
}

/**
 * Check if a package is already loaded
 */
export function isPackageLoaded(pkg: string): boolean {
    return loadedPackages.has(pkg);
}

/**
 * Mark a package as loaded
 */
export function markPackageLoaded(pkg: string): void {
    loadedPackages.add(pkg);
}

/**
 * Get all loaded packages
 */
export function getLoadedPackages(): string[] {
    return Array.from(loadedPackages);
}

/**
 * Reset loaded packages tracking (useful for testing)
 */
export function resetLoadedPackages(): void {
    loadedPackages.clear();
}
