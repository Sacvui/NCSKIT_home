/**
 * Package Registry for WebR Lazy Loading
 * Maps analysis methods to their required R packages
 */

export const PACKAGE_REGISTRY = {
    // Descriptive Statistics
    'descriptive': ['psych'],

    // Reliability Analysis
    'cronbach': ['psych'],
    'efa': ['psych', 'GPArotation'],
    'cfa': ['lavaan', 'quadprog'],

    // Hypothesis Testing (most use built-in stats)
    'ttest': [], // Uses built-in stats package
    'paired-ttest': [],
    'anova': [],
    'mann-whitney': ['psych'], // Uses psych::skew for distribution shape check
    'wilcoxon': [],
    'kruskal': [],
    'chi-square': [],

    // Correlation
    'correlation': ['psych', 'corrplot'],

    // Regression
    'linear-regression': ['car'], // For VIF
    'logistic-regression': ['car'],

    // SEM
    'sem': ['lavaan', 'quadprog'],

    // Multivariate
    'cluster': ['cluster'],
    'two-way-anova': [],

    // Mediation & Moderation
    'mediation': ['psych', 'boot'],
    'moderation': ['psych', 'car'],
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
