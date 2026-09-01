import { z } from 'zod';

// Utility to safely parse values that might come back as weird R missing values
export const safeNumber = z.union([z.number(), z.string(), z.null()]).transform((v) => {
    if (v === null || v === 'NA' || v === 'NaN' || v === '') return NaN;
    const n = Number(v);
    return isNaN(n) ? NaN : n;
});

// A matrix can be an array of arrays of numbers, or empty
export const safeMatrix = z.array(z.array(safeNumber)).catch([]);

export const CronbachItemSchema = z.object({
    itemName: z.string(),
    scaleMeanIfDeleted: safeNumber,
    scaleVarianceIfDeleted: safeNumber,
    correctedItemTotalCorrelation: safeNumber,
    alphaIfItemDeleted: safeNumber
});

export const CronbachResultSchema = z.object({
    alpha: safeNumber,
    rawAlpha: safeNumber,
    standardizedAlpha: safeNumber,
    omega: safeNumber,
    omegaHierarchical: safeNumber,
    nItems: z.union([z.number(), z.string()]),
    likertRange: z.object({ min: safeNumber, max: safeNumber }).catch({ min: 1, max: 5 }),
    itemTotalStats: z.array(CronbachItemSchema).catch([]),
    rCode: z.string().catch('')
});

export const EfaResultSchema = z.object({
    kmo: safeNumber,
    bartlettP: safeNumber,
    loadings: safeMatrix,
    communalities: z.array(safeNumber).catch([]),
    structure: safeMatrix,
    eigenvalues: z.array(safeNumber).catch([]),
    nFactorsUsed: z.number().catch(1),
    nFactorsSuggested: z.number().catch(1),
    factorMethod: z.string().catch('minres'),
    extractionMethod: z.string().catch('minres'),
    rCode: z.string().catch('')
});

export const SemResultSchema = z.object({
    path_coefficients: z.record(z.string(),z.record(z.string(),safeNumber)).catch({}),
    r_squared: z.record(z.string(),safeNumber).catch({}),
    f_squared: z.record(z.string(),z.record(z.string(),safeNumber)).catch({}),
    outer_loadings: z.record(z.string(),z.record(z.string(),safeNumber)).catch({}),
    total_effects: z.record(z.string(),z.record(z.string(),safeNumber)).catch({}),
    htmt: z.record(z.string(),z.record(z.string(),safeNumber)).catch({}),
    fornell_larcker: z.record(z.string(),z.record(z.string(),safeNumber)).catch({}),
    validity: z.object({
        cronbach: z.record(z.string(),safeNumber).catch({}),
        rho_a: z.record(z.string(),safeNumber).catch({}),
        rho_c: z.record(z.string(),safeNumber).catch({}),
        composite_reliability: z.record(z.string(),safeNumber).catch({}),
        ave: z.record(z.string(),safeNumber).catch({})
    }).catch({ cronbach: {}, rho_a: {}, rho_c: {}, composite_reliability: {}, ave: {} }),
    vif: z.object({
        vif_values: z.record(z.string(),safeNumber).catch({})
    }).catch({ vif_values: {} }),
    bootstrapping: z.object({
        boot_paths: z.record(z.string(),z.record(z.string(),safeNumber)).catch({}),
        boot_loadings: z.record(z.string(),z.record(z.string(),safeNumber)).catch({}),
        n_bootstrap: z.number().catch(0)
    }).catch({ boot_paths: {}, boot_loadings: {}, n_bootstrap: 0 }),
    mga: z.any().optional(),
    q2: z.any().optional(),
    rCode: z.string().catch('')
});

export type ICronbachResult = z.infer<typeof CronbachResultSchema>;
export type IEfaResult = z.infer<typeof EfaResultSchema>;
export type ISemResult = z.infer<typeof SemResultSchema>;
