/**
 * TypeScript Interfaces for PLS-SEM Algorithm
 * Complete data structures for measurement and structural models
 */

// ============================================
// MEASUREMENT MODEL
// ============================================

export type ConstructType = 'reflective' | 'formative';

export interface LatentVariable {
    id: string;
    name: string;
    type: ConstructType;
    indicators: string[]; // column names from dataset
}

export interface MeasurementModel {
    constructs: LatentVariable[];
}

// ============================================
// STRUCTURAL MODEL
// ============================================

export interface StructuralPath {
    id: string;
    from: string; // construct name
    to: string;   // construct name
}

export interface StructuralModel {
    paths: StructuralPath[];
}

// ============================================
// ALGORITHM SETTINGS
// ============================================

export type WeightingScheme = 'path' | 'centroid' | 'factor';

export interface PLSSEMSettings {
    maxIterations: number;
    stopCriterion: number;
    weightingScheme: WeightingScheme;
}

export const DEFAULT_PLSSEM_SETTINGS: PLSSEMSettings = {
    maxIterations: 300,
    stopCriterion: 1e-7,
    weightingScheme: 'path'
};

// ============================================
// RESULTS
// ============================================

export interface PathCoefficient {
    from: string;
    to: string;
    coefficient: number;
    tStatistic?: number;
    pValue?: number;
}

export interface RSquared {
    construct: string;
    value: number;
    adjusted?: number;
}

export interface OuterLoading {
    construct: string;
    indicator: string;
    loading: number;
    weight?: number; // for formative constructs
}

export interface ModelFit {
    srmr?: number;
    nfi?: number;
    rmsTheta?: number;
}

export interface ConvergenceInfo {
    iterations: number;
    converged: boolean;
    finalCriterion?: number;
}

export interface PLSSEMResults {
    // Inner model (structural)
    pathCoefficients: PathCoefficient[];
    rSquared: RSquared[];

    // Outer model (measurement)
    outerLoadings: OuterLoading[];

    // Model quality
    modelFit?: ModelFit;
    convergence: ConvergenceInfo;

    // Additional info
    sampleSize: number;
    nConstructs: number;
    nIndicators: number;
}

// ============================================
// VALIDATION
// ============================================

export interface ValidationError {
    field: string;
    message: string;
}

export interface ModelValidation {
    isValid: boolean;
    errors: ValidationError[];
    warnings: string[];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function validateMeasurementModel(model: MeasurementModel): ModelValidation {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Check if at least 2 constructs
    if (model.constructs.length < 2) {
        errors.push({
            field: 'constructs',
            message: 'PLS-SEM requires at least 2 latent variables'
        });
    }

    // Check each construct
    model.constructs.forEach((construct, idx) => {
        // Name required
        if (!construct.name || construct.name.trim() === '') {
            errors.push({
                field: `construct_${idx}_name`,
                message: `Construct ${idx + 1} must have a name`
            });
        }

        // At least 2 indicators for reflective
        if (construct.type === 'reflective' && construct.indicators.length < 2) {
            errors.push({
                field: `construct_${idx}_indicators`,
                message: `Reflective construct "${construct.name}" needs at least 2 indicators`
            });
        }

        // At least 1 indicator for formative
        if (construct.type === 'formative' && construct.indicators.length < 1) {
            errors.push({
                field: `construct_${idx}_indicators`,
                message: `Formative construct "${construct.name}" needs at least 1 indicator`
            });
        }

        // Warn if too many indicators
        if (construct.indicators.length > 10) {
            warnings.push(
                `Construct "${construct.name}" has ${construct.indicators.length} indicators. Consider reducing for better model parsimony.`
            );
        }
    });

    // Check for duplicate construct names
    const names = model.constructs.map(c => c.name);
    const duplicates = names.filter((name, idx) => names.indexOf(name) !== idx);
    if (duplicates.length > 0) {
        errors.push({
            field: 'construct_names',
            message: `Duplicate construct names: ${duplicates.join(', ')}`
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

export function validateStructuralModel(
    structural: StructuralModel,
    measurement: MeasurementModel
): ModelValidation {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    const constructNames = measurement.constructs.map(c => c.name);

    // Check if at least 1 path
    if (structural.paths.length < 1) {
        errors.push({
            field: 'paths',
            message: 'Structural model needs at least 1 path'
        });
    }

    // Validate each path
    structural.paths.forEach((path, idx) => {
        // Check if constructs exist
        if (!constructNames.includes(path.from)) {
            errors.push({
                field: `path_${idx}_from`,
                message: `Source construct "${path.from}" does not exist`
            });
        }

        if (!constructNames.includes(path.to)) {
            errors.push({
                field: `path_${idx}_to`,
                message: `Target construct "${path.to}" does not exist`
            });
        }

        // Check for self-loop
        if (path.from === path.to) {
            errors.push({
                field: `path_${idx}`,
                message: `Path cannot connect construct to itself: ${path.from}`
            });
        }
    });

    // Check for duplicate paths
    const pathKeys = structural.paths.map(p => `${p.from}->${p.to}`);
    const duplicatePaths = pathKeys.filter((key, idx) => pathKeys.indexOf(key) !== idx);
    if (duplicatePaths.length > 0) {
        errors.push({
            field: 'paths',
            message: `Duplicate paths: ${duplicatePaths.join(', ')}`
        });
    }

    // Warn about endogenous constructs without paths
    const targets = new Set(structural.paths.map(p => p.to));
    const sources = new Set(structural.paths.map(p => p.from));

    constructNames.forEach(name => {
        if (!targets.has(name) && !sources.has(name)) {
            warnings.push(`Construct "${name}" is not connected to any paths`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

export function getEndogenousConstructs(structural: StructuralModel): string[] {
    return Array.from(new Set(structural.paths.map(p => p.to)));
}

export function getExogenousConstructs(
    structural: StructuralModel,
    measurement: MeasurementModel
): string[] {
    const endogenous = new Set(getEndogenousConstructs(structural));
    return measurement.constructs
        .map(c => c.name)
        .filter(name => !endogenous.has(name));
}
