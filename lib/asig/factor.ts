/**
 * ASIG — factor.ts
 * Interpreters: Cronbach's Alpha / McDonald's Omega, EFA, CFA
 * All prose conforms to APA 7th Edition reporting standards.
 */

import { formatPValue, formatCoef, formatNum, formatPct, InterpretationResult } from './shared';

// ─── RELIABILITY ANALYSIS ─────────────────────────────────────────────────────

export function interpretCronbachAlpha(params: {
    scaleName: string;
    nItems: number;
    alpha: number;
    omega?: number;
    badItems?: string[];
    isOmegaPrimary?: boolean;
}): InterpretationResult {
    const { scaleName, nItems, alpha, omega, badItems, isOmegaPrimary } = params;

    const primaryCoef   = isOmegaPrimary && omega != null ? omega : alpha;
    const primaryStr    = formatCoef(primaryCoef);
    const primaryName   = isOmegaPrimary && omega != null
        ? "McDonald's Omega (ω)"
        : "Cronbach's Alpha (α)";

    const alphaStr = formatCoef(alpha);
    const omegaStr = omega != null ? formatCoef(omega) : '';

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = isOmegaPrimary
        ? ['Hayes, A. F., & Coutts, J. J. (2020). Use omega rather than Cronbach\'s alpha for estimating reliability. Communication Methods and Measures, 14(1), 1–24. https://doi.org/10.1080/19312458.2020.1718629']
        : ['Nunnally, J. C. (1978). Psychometric theory (2nd ed.). McGraw-Hill.'];

    let summary = '';

    if (primaryCoef >= 0.90) {
        summary = `Reliability analysis of the "${scaleName}" scale (${nItems} items) yielded ${primaryName} = ${primaryStr}, indicating excellent internal consistency that exceeds the recommended threshold of .70 (Nunnally, 1978). The scale is considered highly reliable for use in confirmatory research contexts.`;
    } else if (primaryCoef >= 0.80) {
        summary = `Reliability analysis of the "${scaleName}" scale (${nItems} items) yielded ${primaryName} = ${primaryStr}, demonstrating good internal consistency above the conventional threshold of .70 (Nunnally, 1978). The scale is suitable for confirmatory research.`;
    } else if (primaryCoef >= 0.70) {
        summary = `Reliability analysis of the "${scaleName}" scale (${nItems} items) yielded ${primaryName} = ${primaryStr}, which meets the widely accepted threshold of .70 (Nunnally, 1978). The scale demonstrates adequate internal consistency for research purposes.`;
    } else if (primaryCoef >= 0.60) {
        summary = `Reliability analysis of the "${scaleName}" scale (${nItems} items) yielded ${primaryName} = ${primaryStr}. Although this value falls below the conventional threshold of .70 (Nunnally, 1978), it remains within the acceptable range (.60–.70) for exploratory research (Hair et al., 2010). Caution is advised when interpreting results.`;
        citations.push('Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2010). Multivariate data analysis (7th ed.). Pearson.');
        warnings.push(`${primaryName} = ${primaryStr} is below .70. This scale is acceptable for exploratory research only; confirmatory use requires scale refinement.`);
    } else {
        summary = `Reliability analysis of the "${scaleName}" scale (${nItems} items) yielded ${primaryName} = ${primaryStr}, which falls below the minimum acceptable threshold of .60 (Nunnally, 1978; Hair et al., 2010). The scale does not demonstrate sufficient internal consistency for research use.`;
        citations.push('Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2010). Multivariate data analysis (7th ed.). Pearson.');
        warnings.push(`${primaryName} = ${primaryStr} is below the minimum acceptable threshold of .60. Scale revision is strongly recommended before further analysis.`);
    }

    // Supplementary coefficient
    if (isOmegaPrimary && omega != null) {
        summary += ` McDonald's Omega was chosen over Cronbach's Alpha as it does not assume tau-equivalence, providing a more accurate estimate of reliability.`;
        details.push(`Reference Cronbach's Alpha (α) = ${alphaStr}.`);
    } else if (!isOmegaPrimary && omega != null && omega > 0) {
        details.push(`Supplementary McDonald's Omega (ω) = ${omegaStr}, corroborating the internal consistency estimate.`);
    }

    // Problematic items
    if (badItems && badItems.length > 0) {
        warnings.push(
            `The following item(s) produced corrected item-total correlations below .30 and should be considered for removal: ${badItems.join(', ')}. Deletion of these items may improve the overall reliability coefficient.`
        );
    }

    return { summary, details, warnings, citations };
}


// ─── EXPLORATORY FACTOR ANALYSIS ─────────────────────────────────────────────

export function interpretEFA(params: {
    kmo: number;
    bartlettP: number;
    nFactors: number;
    factorMethod: string;
    totalVariance?: number;
    communalities?: { item: string; value: number }[];
}): InterpretationResult {
    const { kmo, bartlettP, nFactors, factorMethod, totalVariance, communalities } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Kaiser, H. F. (1970). A second generation little jiffy. Psychometrika, 35(4), 401–415.',
        'Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2010). Multivariate data analysis (7th ed.). Pearson.',
    ];

    // KMO label
    let kmoLabel = '';
    if      (kmo >= 0.90) kmoLabel = 'marvellous';
    else if (kmo >= 0.80) kmoLabel = 'meritorious';
    else if (kmo >= 0.70) kmoLabel = 'middling';
    else if (kmo >= 0.60) kmoLabel = 'mediocre';
    else                   kmoLabel = 'unacceptable';

    if (kmo < 0.60) {
        warnings.push(`KMO = ${formatCoef(kmo)} is below .60, indicating that the correlation matrix is not suitable for factor analysis. Data collection should be reviewed before proceeding.`);
    }

    const bartlettSig = bartlettP < 0.05
        ? `statistically significant (${formatPValue(bartlettP)})`
        : `not statistically significant (${formatPValue(bartlettP)})`;

    const methodLabel = factorMethod === 'parallel'
        ? 'Parallel Analysis'
        : factorMethod === 'map'
            ? 'Minimum Average Partial (MAP)'
            : 'Kaiser criterion (eigenvalue > 1)';

    let summary = `Prior to conducting Exploratory Factor Analysis (EFA), the Kaiser-Meyer-Olkin (KMO) measure of sampling adequacy was assessed. The obtained value of KMO = ${formatCoef(kmo)} is classified as ${kmoLabel} (Kaiser, 1970). Bartlett's Test of Sphericity was ${bartlettSig}, confirming that the correlation matrix is factorable. EFA using ${methodLabel} extracted ${nFactors} factor${nFactors !== 1 ? 's' : ''}.`;

    details.push(`Extraction criterion: ${methodLabel}.`);
    details.push(`Number of factors retained: ${nFactors}.`);

    if (totalVariance != null) {
        details.push(`Total variance explained by the retained factor structure: ${formatPct(totalVariance)}.`);
        if (totalVariance < 0.50) {
            warnings.push(`Total variance explained (${formatPct(totalVariance)}) is below the recommended threshold of 50%. Consider retaining additional factors or revising the item pool.`);
        }
    }

    // Low communalities
    if (communalities) {
        const lowItems = communalities.filter(c => c.value < 0.40);
        if (lowItems.length > 0) {
            warnings.push(
                `The following item(s) have communalities below .40 and may not be well-represented by the factor structure: ${lowItems.map(c => `${c.item} (h² = ${formatCoef(c.value)})`).join(', ')}.`
            );
        }
    }

    return { summary, details, warnings, citations };
}


// ─── CONFIRMATORY FACTOR ANALYSIS ────────────────────────────────────────────

export function interpretCFA(params: {
    chi2: number;
    df: number;
    pValue: number;
    cfi: number;
    tli: number;
    rmsea: number;
    rmseaCILower?: number;
    rmseaCIUpper?: number;
    srmr: number;
}): InterpretationResult {
    const { chi2, df, pValue, cfi, tli, rmsea, rmseaCILower, rmseaCIUpper, srmr } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Hu, L., & Bentler, P. M. (1999). Cutoff criteria for fit indexes in covariance structure analysis. Structural Equation Modeling, 6(1), 1–55. https://doi.org/10.1080/10705519909540118',
        'Kline, R. B. (2016). Principles and practice of structural equation modeling (4th ed.). Guilford Press.',
    ];

    // Evaluate each index
    const cfiBad   = cfi  < 0.90;
    const tliBad   = tli  < 0.90;
    const rmseaBad = rmsea > 0.08;
    const srmrBad  = srmr  > 0.08;

    const cfiFine   = cfi  >= 0.95;
    const tliFine   = tli  >= 0.95;
    const rmseaFine = rmsea <= 0.06;
    const srmrFine  = srmr  <= 0.06;

    const nBad  = [cfiBad, tliBad, rmseaBad, srmrBad].filter(Boolean).length;
    const nFine = [cfiFine, tliFine, rmseaFine, srmrFine].filter(Boolean).length;

    // χ²/df ratio
    const chiRatio = df > 0 ? chi2 / df : null;

    let fitVerdict = '';
    if (nBad === 0 && nFine >= 3) {
        fitVerdict = 'excellent fit';
    } else if (nBad === 0) {
        fitVerdict = 'acceptable fit';
    } else if (nBad <= 1) {
        fitVerdict = 'marginally acceptable fit';
    } else {
        fitVerdict = 'poor fit';
    }

    // RMSEA CI string
    const rmseaCI = (rmseaCILower != null && rmseaCIUpper != null)
        ? ` [90% CI: ${formatCoef(rmseaCILower)}, ${formatCoef(rmseaCIUpper)}]`
        : '';

    let summary = `Confirmatory Factor Analysis (CFA) was conducted to evaluate model fit. The overall pattern of fit indices indicated ${fitVerdict} with the observed data: CFI = ${formatCoef(cfi)}, TLI = ${formatCoef(tli)}, RMSEA = ${formatCoef(rmsea)}${rmseaCI}, SRMR = ${formatCoef(srmr)} (Hu & Bentler, 1999).`;

    // χ² note (sensitive to N, reported but not used as sole criterion)
    details.push(`χ²(${df}) = ${formatNum(chi2)}, ${formatPValue(pValue)}${chiRatio != null ? `; χ²/df = ${formatNum(chiRatio)}` : ''}.`);
    details.push(`CFI = ${formatCoef(cfi)} (threshold ≥ .90; excellent ≥ .95).`);
    details.push(`TLI = ${formatCoef(tli)} (threshold ≥ .90; excellent ≥ .95).`);
    details.push(`RMSEA = ${formatCoef(rmsea)}${rmseaCI} (threshold ≤ .08; excellent ≤ .06).`);
    details.push(`SRMR = ${formatCoef(srmr)} (threshold ≤ .08; excellent ≤ .06).`);

    // Specific warnings
    if (cfiBad)   warnings.push(`CFI = ${formatCoef(cfi)} falls below the recommended threshold of .90 (Hu & Bentler, 1999).`);
    if (tliBad)   warnings.push(`TLI = ${formatCoef(tli)} falls below the recommended threshold of .90.`);
    if (rmseaBad) warnings.push(`RMSEA = ${formatCoef(rmsea)} exceeds the recommended upper limit of .08. Model re-specification (e.g., correlated residuals based on modification indices) may be warranted.`);
    if (srmrBad)  warnings.push(`SRMR = ${formatCoef(srmr)} exceeds the recommended upper limit of .08, suggesting systematic residual misfit.`);

    if (pValue > 0.05) {
        details.push(`The non-significant χ² (${formatPValue(pValue)}) suggests the model closely approximates the observed covariance structure; however, χ² is highly sensitive to sample size and should not be the sole basis for model evaluation.`);
    }

    return { summary, details, warnings, citations };
}
