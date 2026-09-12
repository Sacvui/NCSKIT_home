/**
 * ASIG — pls-sem.ts
 * Interpreter: PLS-SEM (Partial Least Squares Structural Equation Modeling)
 * Covers: Outer loadings, AVE, Composite Reliability, Fornell-Larcker,
 *         HTMT, R-squared, path coefficients, bootstrapping results.
 * All prose conforms to APA 7th Edition reporting standards.
 * Primary reference: Hair et al. (2017, 2022).
 */

import { InterpretationResult, formatCoef, formatNum, formatPValue } from './shared';


export function interpretPLSSEM(params: {
    fornell_larcker?:   Record<string, Record<string, number>>;
    htmt?:              Record<string, Record<string, number>>;
    r_squared?:         Record<string, number>;
    ave?:               Record<string, number>;
    compositeReliability?: Record<string, number>;
    outerLoadings?:     Record<string, Record<string, number>>;
    pathCoefficients?:  { from: string; to: string; beta: number; tValue?: number; pValue?: number; ci95Lower?: number; ci95Upper?: number }[];
}): InterpretationResult {
    const {
        fornell_larcker, htmt, r_squared,
        ave, compositeReliability,
        outerLoadings, pathCoefficients
    } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Hair, J. F., Hult, G. T. M., Ringle, C. M., & Sarstedt, M. (2017). A primer on partial least squares structural equation modeling (PLS-SEM) (2nd ed.). SAGE Publications.',
        'Henseler, J., Ringle, C. M., & Sarstedt, M. (2015). A new criterion for assessing discriminant validity in variance-based structural equation modeling. Journal of the Academy of Marketing Science, 43(1), 115–135.',
        'Fornell, C., & Larcker, D. F. (1981). Evaluating structural equation models with unobservable variables and measurement error. Journal of Marketing Research, 18(1), 39–50.',
    ];

    let hasViolations = false;

    // ── SECTION 1: Outer Loadings ─────────────────────────────────────────────
    if (outerLoadings) {
        details.push('— Outer Loadings (Indicator Reliability) —');
        Object.entries(outerLoadings).forEach(([construct, items]) => {
            Object.entries(items).forEach(([item, loading]) => {
                if (loading < 0.40) {
                    warnings.push(`Outer loading for "${item}" (${construct}) = ${formatCoef(loading)} < .40: the item contributes negligible variance to the construct and should be considered for removal.`);
                } else if (loading < 0.70) {
                    details.push(`"${item}" (${construct}): outer loading = ${formatCoef(loading)} — acceptable but below the preferred threshold of .70.`);
                } else {
                    details.push(`"${item}" (${construct}): outer loading = ${formatCoef(loading)} ✓`);
                }
            });
        });
    }

    // ── SECTION 2: AVE & Convergent Validity ─────────────────────────────────
    if (ave) {
        details.push('— Average Variance Extracted (Convergent Validity) —');
        Object.entries(ave).forEach(([construct, aveVal]) => {
            if (aveVal < 0.50) {
                warnings.push(`AVE for "${construct}" = ${formatCoef(aveVal)} < .50: the construct does not capture more variance from its indicators than from measurement error (Fornell & Larcker, 1981). Consider removing low-loading items.`);
                hasViolations = true;
            } else {
                details.push(`"${construct}": AVE = ${formatCoef(aveVal)} ≥ .50 ✓ (convergent validity established).`);
            }
        });
    }

    // ── SECTION 3: Composite Reliability ─────────────────────────────────────
    if (compositeReliability) {
        details.push('— Composite Reliability (Internal Consistency) —');
        Object.entries(compositeReliability).forEach(([construct, cr]) => {
            if (cr < 0.70) {
                warnings.push(`Composite Reliability for "${construct}" = ${formatCoef(cr)} < .70, indicating insufficient internal consistency (Hair et al., 2017).`);
                hasViolations = true;
            } else if (cr > 0.95) {
                warnings.push(`Composite Reliability for "${construct}" = ${formatCoef(cr)} > .95, suggesting potential indicator redundancy. Consider revising the item set.`);
            } else {
                details.push(`"${construct}": CR = ${formatCoef(cr)} ✓`);
            }
        });
    }

    // ── SECTION 4: Fornell-Larcker Criterion ─────────────────────────────────
    if (fornell_larcker) {
        details.push('— Discriminant Validity: Fornell-Larcker Criterion —');
        const constructs         = Object.keys(fornell_larcker);
        const fornellViolations: string[] = [];

        constructs.forEach(c1 => {
            const diagVal = fornell_larcker[c1]?.[c1];
            if (diagVal == null) return;

            constructs.forEach(c2 => {
                if (c1 === c2) return;
                const corr = fornell_larcker[c1]?.[c2] ?? fornell_larcker[c2]?.[c1];
                if (corr != null && corr >= diagVal) {
                    fornellViolations.push(`${c1} vs. ${c2} (√AVE = ${formatCoef(diagVal)}, r = ${formatCoef(corr)})`);
                }
            });
        });

        if (fornellViolations.length === 0) {
            details.push('Fornell-Larcker criterion satisfied: the square root of each construct\'s AVE exceeds all inter-construct correlations, establishing discriminant validity.');
        } else {
            hasViolations = true;
            warnings.push(`Fornell-Larcker criterion violated for the following construct pair(s): ${fornellViolations.join('; ')}. These constructs are not sufficiently distinct. Inspect cross-loadings and consider item reassignment or construct merging.`);
        }
    }

    // ── SECTION 5: HTMT ───────────────────────────────────────────────────────
    if (htmt) {
        details.push('— Discriminant Validity: HTMT Criterion (Henseler et al., 2015) —');
        const constructs       = Object.keys(htmt);
        const htmtViolations09: string[] = [];
        const htmtWarnings85:   string[] = [];
        const seenPairs = new Set<string>();

        constructs.forEach(c1 => {
            constructs.forEach(c2 => {
                if (c1 >= c2) return;                    // avoid duplicates
                const key = `${c1}|${c2}`;
                if (seenPairs.has(key)) return;
                seenPairs.add(key);

                const val = htmt[c1]?.[c2] ?? htmt[c2]?.[c1];
                if (val == null) return;

                if (val >= 0.90) {
                    htmtViolations09.push(`${c1} & ${c2} (HTMT = ${formatCoef(val)})`);
                    hasViolations = true;
                } else if (val >= 0.85) {
                    htmtWarnings85.push(`${c1} & ${c2} (HTMT = ${formatCoef(val)})`);
                } else {
                    details.push(`${c1} & ${c2}: HTMT = ${formatCoef(val)} < .85 ✓`);
                }
            });
        });

        if (htmtViolations09.length > 0) {
            warnings.push(`HTMT ≥ .90 (discriminant validity violated) for: ${htmtViolations09.join('; ')}. These constructs lack conceptual distinctiveness and should be revised.`);
        }
        if (htmtWarnings85.length > 0) {
            warnings.push(`HTMT between .85 and .90 (borderline) for: ${htmtWarnings85.join('; ')}. Discriminant validity is questionable; bootstrap HTMT confidence intervals are recommended.`);
        }
        if (htmtViolations09.length === 0 && htmtWarnings85.length === 0) {
            details.push('HTMT criterion satisfied: all HTMT values < .85, confirming discriminant validity across all construct pairs (Henseler et al., 2015).');
        }
    }

    // ── SECTION 6: R-Squared ─────────────────────────────────────────────────
    if (r_squared) {
        details.push('— Structural Model: Explanatory Power (R²) —');
        Object.entries(r_squared).forEach(([construct, r2]) => {
            let level = '';
            if      (r2 >= 0.75) level = 'substantial';
            else if (r2 >= 0.50) level = 'moderate';
            else if (r2 >= 0.25) level = 'weak';
            else                  level = 'very weak';

            details.push(`"${construct}": R² = ${formatCoef(r2)} (${level}; Hair et al., 2017 benchmarks: weak ≥ .25, moderate ≥ .50, substantial ≥ .75).`);

            if (r2 < 0.10) {
                warnings.push(`"${construct}": R² = ${formatCoef(r2)} < .10 — the structural model has very limited predictive power for this endogenous variable.`);
            }
        });
    }

    // ── SECTION 7: Path Coefficients (Bootstrapping) ─────────────────────────
    if (pathCoefficients && pathCoefficients.length > 0) {
        details.push('— Structural Model: Path Coefficients (Bootstrap Results) —');
        for (const path of pathCoefficients) {
            const ciStr = (path.ci95Lower != null && path.ci95Upper != null)
                ? ` [95% CI: ${formatCoef(path.ci95Lower)}, ${formatCoef(path.ci95Upper)}]`
                : '';
            const tStr  = path.tValue != null ? `, t = ${formatNum(path.tValue)}` : '';
            const pStr  = path.pValue != null ? `, ${formatPValue(path.pValue)}` : '';
            const sig   = path.pValue != null ? (path.pValue < 0.05 ? ' ✓ significant' : ' ✗ not significant') : '';

            details.push(`${path.from} → ${path.to}: β = ${formatCoef(path.beta)}${tStr}${pStr}${ciStr}${sig}.`);

            if (path.pValue != null && path.pValue < 0.05 && Math.abs(path.beta) < 0.10) {
                warnings.push(`Path ${path.from} → ${path.to} is statistically significant but the effect size is very small (|β| = ${formatCoef(Math.abs(path.beta))}). Practical significance should be carefully evaluated.`);
            }
        }
    }

    // ── OVERALL SUMMARY ───────────────────────────────────────────────────────
    let summary = '';

    if (!fornell_larcker && !htmt && !r_squared && !ave && !compositeReliability && !pathCoefficients) {
        summary = 'No PLS-SEM matrix data were provided. Please supply at least one of: fornell_larcker, htmt, r_squared, ave, compositeReliability, or pathCoefficients.';
    } else if (hasViolations) {
        summary = 'PLS-SEM measurement model assessment identified one or more violations of recommended thresholds (Hair et al., 2017). Researchers should address the flagged issues — particularly discriminant validity violations — before proceeding to structural model interpretation. Specific concerns are detailed in the warnings below.';
    } else {
        summary = 'PLS-SEM measurement model assessment indicates that all evaluated criteria meet the recommended thresholds (Hair et al., 2017). Convergent validity (AVE ≥ .50), internal consistency (CR ≥ .70), and discriminant validity (Fornell-Larcker and/or HTMT criteria) are all satisfied. The measurement model provides an adequate foundation for structural model evaluation.';
    }

    return { summary, details, warnings, citations };
}
