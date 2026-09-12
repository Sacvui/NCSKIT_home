/**
 * ASIG — regression.ts
 * Interpreters: Linear Regression, Logistic Regression, Mediation Analysis,
 *               Moderation Analysis, Cluster Analysis
 * All prose conforms to APA 7th Edition reporting standards.
 */

import { formatPValue, formatCoef, formatNum, formatPct, InterpretationResult } from './shared';


// ─── LINEAR REGRESSION ───────────────────────────────────────────────────────

export function interpretLinearRegression(params: {
    dependentVar:  string;
    rSquared:      number;
    adjRSquared:   number;
    fStatistic:    number;
    fPValue:       number;
    coefficients:  {
        term:      string;
        estimate:  number;
        stdBeta:   number;
        pValue:    number;
        vif?:      number;
    }[];
    normalityP?:   number;
    durbinWatson?: number;
}): InterpretationResult {
    const { dependentVar, rSquared, adjRSquared, fStatistic, fPValue, coefficients, normalityP, durbinWatson } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Cohen, J., Cohen, P., West, S. G., & Aiken, L. S. (2003). Applied multiple regression/correlation analysis for the behavioral sciences (3rd ed.). Lawrence Erlbaum Associates.',
        'Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2010). Multivariate data analysis (7th ed.). Pearson.',
    ];

    const modelSig = fPValue < 0.05;
    const r2Label  = adjRSquared < 0.13 ? 'weak' : adjRSquared < 0.26 ? 'moderate' : 'substantial';

    let summary = '';
    if (modelSig) {
        summary = `Multiple linear regression was conducted to predict "${dependentVar}." The overall model was statistically significant, F(${formatNum(coefficients.filter(c => c.term !== '(Intercept)').length, 0)}, df_residual) = ${formatNum(fStatistic)}, ${formatPValue(fPValue)}, R² = ${formatCoef(rSquared)}, adjusted R² = ${formatCoef(adjRSquared)}. The model explained approximately ${formatPct(adjRSquared)} of the variance in "${dependentVar}" (${r2Label} explanatory power).`;
    } else {
        summary = `Multiple linear regression was conducted to predict "${dependentVar}." The overall model was not statistically significant, F = ${formatNum(fStatistic)}, ${formatPValue(fPValue)}, adjusted R² = ${formatCoef(adjRSquared)}, suggesting that the set of predictors did not explain a significant proportion of variance in the outcome.`;
    }

    // Predictors
    const predictors = coefficients.filter(c => c.term !== '(Intercept)');
    for (const coef of predictors) {
        const direction = coef.estimate > 0 ? 'positively' : 'negatively';
        if (coef.pValue < 0.05) {
            details.push(`"${coef.term}" significantly predicted "${dependentVar}" (β = ${formatCoef(coef.stdBeta)}, B = ${formatNum(coef.estimate)}, ${formatPValue(coef.pValue)}), ${direction} associated with the outcome.`);
        } else {
            details.push(`"${coef.term}" did not significantly predict "${dependentVar}" (β = ${formatCoef(coef.stdBeta)}, B = ${formatNum(coef.estimate)}, ${formatPValue(coef.pValue)}).`);
        }

        if (coef.vif != null && coef.vif >= 10) {
            warnings.push(`"${coef.term}": VIF = ${formatNum(coef.vif)} ≥ 10 — severe multicollinearity detected. Consider removing or combining correlated predictors.`);
        } else if (coef.vif != null && coef.vif >= 5) {
            warnings.push(`"${coef.term}": VIF = ${formatNum(coef.vif)} ≥ 5 — moderate multicollinearity. Monitor regression stability.`);
        }
    }

    // Diagnostics
    if (normalityP != null && normalityP < 0.05) {
        warnings.push(`Residuals violated the normality assumption (Shapiro-Wilk, ${formatPValue(normalityP)}). Bootstrap confidence intervals are recommended for robust inference.`);
    }
    if (durbinWatson != null && (durbinWatson < 1.5 || durbinWatson > 2.5)) {
        warnings.push(`Durbin-Watson statistic = ${formatNum(durbinWatson)} suggests potential autocorrelation in residuals (acceptable range: 1.5–2.5).`);
    }

    return { summary, details, warnings, citations };
}


// ─── LOGISTIC REGRESSION ─────────────────────────────────────────────────────

export function interpretLogisticRegression(params: {
    dependentVar:  string;
    pseudoR2:      number;
    accuracy:      number;
    auc?:          number;
    coefficients:  {
        term:      string;
        estimate:  number;
        oddsRatio: number;
        ciLower?:  number;
        ciUpper?:  number;
        pValue:    number;
    }[];
}): InterpretationResult {
    const { dependentVar, pseudoR2, accuracy, auc, coefficients } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Hosmer, D. W., Lemeshow, S., & Sturdivant, R. X. (2013). Applied logistic regression (3rd ed.). Wiley.',
        'Nagelkerke, N. J. D. (1991). A note on a general definition of the coefficient of determination. Biometrika, 78(3), 691–692.',
    ];

    const r2Label = pseudoR2 < 0.10 ? 'weak' : pseudoR2 < 0.20 ? 'moderate' : 'strong';

    let summary = `Binary logistic regression was conducted to model the probability of "${dependentVar}." The model achieved McFadden's pseudo-R² = ${formatCoef(pseudoR2)} (${r2Label} model fit), with an overall classification accuracy of ${formatPct(accuracy)}.`;

    if (auc != null) {
        const aucLabel = auc < 0.70 ? 'poor' : auc < 0.80 ? 'acceptable' : auc < 0.90 ? 'excellent' : 'outstanding';
        summary += ` The area under the ROC curve (AUC) = ${formatCoef(auc)}, indicating ${aucLabel} discriminative ability.`;
        details.push(`AUC = ${formatCoef(auc)} (benchmarks: .70 = acceptable, .80 = excellent, .90 = outstanding).`);
    }

    const predictors = coefficients.filter(c => c.term !== '(Intercept)');
    for (const coef of predictors) {
        const or = coef.oddsRatio;
        const ciStr = (coef.ciLower != null && coef.ciUpper != null)
            ? ` [95% CI: ${formatNum(coef.ciLower)}, ${formatNum(coef.ciUpper)}]`
            : '';

        if (coef.pValue < 0.05) {
            if (or > 1) {
                details.push(`"${coef.term}" significantly increased the odds of "${dependentVar}" (OR = ${formatNum(or)}${ciStr}, ${formatPValue(coef.pValue)}). Each one-unit increase in "${coef.term}" was associated with a ${formatPct(or - 1)} increase in odds.`);
            } else {
                details.push(`"${coef.term}" significantly decreased the odds of "${dependentVar}" (OR = ${formatNum(or)}${ciStr}, ${formatPValue(coef.pValue)}). Each one-unit increase in "${coef.term}" was associated with a ${formatPct(1 - or)} decrease in odds.`);
            }
        } else {
            details.push(`"${coef.term}" was not a significant predictor (OR = ${formatNum(or)}${ciStr}, ${formatPValue(coef.pValue)}).`);
        }
    }

    return { summary, details, warnings, citations };
}


// ─── MEDIATION ANALYSIS ───────────────────────────────────────────────────────

export function interpretMediation(params: {
    xVar:          string;
    mVar:          string;
    yVar:          string;
    pathA:         { estimate: number; pValue: number };
    pathB:         { estimate: number; pValue: number };
    pathC:         { estimate: number; pValue: number };
    pathCprime:    { estimate: number; pValue: number };
    indirectEffect: number;
    sobelZ:        number;
    sobelP:        number;
    bootstrapCI?:  { lower: number; upper: number; nBootstrap?: number };
    mediationType: 'full' | 'partial' | 'none';
}): InterpretationResult {
    const {
        xVar, mVar, yVar,
        pathA, pathB, pathC, pathCprime,
        indirectEffect, sobelZ, sobelP,
        bootstrapCI, mediationType
    } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Baron, R. M., & Kenny, D. A. (1986). The moderator-mediator variable distinction in social psychological research. Journal of Personality and Social Psychology, 51(6), 1173–1182.',
        'Preacher, K. J., & Hayes, A. F. (2008). Asymptotic and resampling strategies for assessing and comparing indirect effects in multiple mediator models. Behavior Research Methods, 40(3), 879–891.',
    ];

    // Path table
    details.push(`Path a (${xVar} → ${mVar}): B = ${formatCoef(pathA.estimate)}, ${formatPValue(pathA.pValue)}.`);
    details.push(`Path b (${mVar} → ${yVar}): B = ${formatCoef(pathB.estimate)}, ${formatPValue(pathB.pValue)}.`);
    details.push(`Path c — Total effect (${xVar} → ${yVar}): B = ${formatCoef(pathC.estimate)}, ${formatPValue(pathC.pValue)}.`);
    details.push(`Path c′ — Direct effect (${xVar} → ${yVar} | ${mVar}): B = ${formatCoef(pathCprime.estimate)}, ${formatPValue(pathCprime.pValue)}.`);
    details.push(`Indirect effect (a × b): ${formatCoef(indirectEffect)}.`);
    details.push(`Sobel test: Z = ${formatNum(sobelZ)}, ${formatPValue(sobelP)}.`);

    if (bootstrapCI) {
        const n = bootstrapCI.nBootstrap ?? 5000;
        const ciInclZero = bootstrapCI.lower < 0 && bootstrapCI.upper > 0;
        details.push(`Bootstrap 95% CI (k = ${n}): [${formatCoef(bootstrapCI.lower)}, ${formatCoef(bootstrapCI.upper)}]${ciInclZero ? ' — CI includes zero, indirect effect non-significant' : ' — CI excludes zero, indirect effect significant'}.`);
    }

    let summary = '';
    if (mediationType === 'full') {
        summary = `Mediation analysis following Baron and Kenny (1986) indicated that "${mVar}" fully mediated the relationship between "${xVar}" and "${yVar}." The indirect effect was statistically significant (Sobel Z = ${formatNum(sobelZ)}, ${formatPValue(sobelP)}), while the direct effect of "${xVar}" on "${yVar}" became non-significant after controlling for the mediator (B = ${formatCoef(pathCprime.estimate)}, ${formatPValue(pathCprime.pValue)}), consistent with full mediation.`;
        if (bootstrapCI) {
            summary += ` Bootstrap resampling corroborated this finding (95% CI: [${formatCoef(bootstrapCI.lower)}, ${formatCoef(bootstrapCI.upper)}]).`;
        }
    } else if (mediationType === 'partial') {
        summary = `Mediation analysis indicated that "${mVar}" partially mediated the relationship between "${xVar}" and "${yVar}." Both the indirect effect (Sobel Z = ${formatNum(sobelZ)}, ${formatPValue(sobelP)}) and the direct effect (B = ${formatCoef(pathCprime.estimate)}, ${formatPValue(pathCprime.pValue)}) remained statistically significant, consistent with partial mediation.`;
    } else {
        summary = `Mediation analysis did not support a mediating role for "${mVar}" in the relationship between "${xVar}" and "${yVar}." The indirect effect was not statistically significant (Sobel Z = ${formatNum(sobelZ)}, ${formatPValue(sobelP)}).`;
    }

    warnings.push('Baron and Kenny\'s (1986) causal-steps approach has known limitations. Bootstrap-based methods (e.g., PROCESS macro, Hayes, 2018) are preferred for testing indirect effects.');

    return { summary, details, warnings, citations };
}


// ─── MODERATION ANALYSIS ─────────────────────────────────────────────────────

export function interpretModeration(params: {
    xVar:               string;
    mVar:               string;
    yVar:               string;
    interactionTerm:    string;
    interactionEstimate: number;
    interactionP:       number;
    r2Change?:          number;
    r2ChangeP?:         number;
    simpleSlopes?:      { level: string; slope: number; pValue: number }[];
}): InterpretationResult {
    const {
        xVar, mVar, yVar,
        interactionTerm, interactionEstimate, interactionP,
        r2Change, r2ChangeP,
        simpleSlopes
    } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Aiken, L. S., & West, S. G. (1991). Multiple regression: Testing and interpreting interactions. SAGE Publications.',
        'Hayes, A. F. (2018). Introduction to mediation, moderation, and conditional process analysis (2nd ed.). Guilford Press.',
    ];

    let summary = '';

    if (interactionP > 0.05) {
        summary = `Moderation analysis examined whether "${mVar}" moderated the relationship between "${xVar}" and "${yVar}." The interaction term (${interactionTerm}) was not statistically significant (B = ${formatCoef(interactionEstimate)}, ${formatPValue(interactionP)}), indicating that the effect of "${xVar}" on "${yVar}" did not significantly vary as a function of "${mVar}."`;
    } else {
        const direction = interactionEstimate > 0 ? 'strengthened' : 'attenuated';
        summary = `Moderation analysis revealed a statistically significant interaction between "${xVar}" and "${mVar}" in predicting "${yVar}" (B = ${formatCoef(interactionEstimate)}, ${formatPValue(interactionP)}), indicating that "${mVar}" moderates the effect of "${xVar}" on "${yVar}." Specifically, higher levels of "${mVar}" ${direction} the relationship between "${xVar}" and "${yVar}."`;

        if (r2Change != null) {
            const sig = r2ChangeP != null && r2ChangeP < 0.05 ? 'significant' : 'non-significant';
            details.push(`The interaction term explained an additional ΔR² = ${formatCoef(r2Change)} of variance in "${yVar}" (${sig}${r2ChangeP != null ? ', ' + formatPValue(r2ChangeP) : ''}).`);
        }

        if (simpleSlopes && simpleSlopes.length > 0) {
            details.push('Simple slopes analysis:');
            for (const s of simpleSlopes) {
                const sig = s.pValue < 0.05 ? 'significant' : 'non-significant';
                details.push(`  • At ${s.level} level of "${mVar}": slope = ${formatCoef(s.slope)}, ${formatPValue(s.pValue)} (${sig}).`);
            }
        }
    }

    warnings.push('Mean-centre continuous predictors and the moderator before computing the interaction term to reduce non-essential multicollinearity (Aiken & West, 1991).');

    return { summary, details, warnings, citations };
}


// ─── CLUSTER ANALYSIS ────────────────────────────────────────────────────────

export function interpretClusterAnalysis(params: {
    method:           string;
    nClusters:        number;
    totalSS:          number;
    withinSS:         number;
    betweenSS:        number;
    silhouetteScore?: number;
    clusterSizes?:    number[];
}): InterpretationResult {
    const { method, nClusters, totalSS, withinSS, betweenSS, silhouetteScore, clusterSizes } = params;

    const varianceExplained = betweenSS / totalSS;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2010). Multivariate data analysis (7th ed.). Pearson.',
        'Rousseeuw, P. J. (1987). Silhouettes: A graphical aid to the interpretation and validation of cluster analysis. Journal of Computational and Applied Mathematics, 20, 53–65.',
    ];

    let summary = `${method} cluster analysis identified ${nClusters} cluster${nClusters !== 1 ? 's' : ''} from the data. The between-cluster sum of squares accounted for ${formatPct(varianceExplained)} of the total variance (between-SS = ${formatNum(betweenSS)}, within-SS = ${formatNum(withinSS)}, total SS = ${formatNum(totalSS)}).`;

    details.push(`Total SS: ${formatNum(totalSS)}.`);
    details.push(`Within-cluster SS: ${formatNum(withinSS)} (${formatPct(withinSS / totalSS)}).`);
    details.push(`Between-cluster SS: ${formatNum(betweenSS)} (${formatPct(varianceExplained)}).`);

    if (clusterSizes && clusterSizes.length > 0) {
        details.push(`Cluster sizes: ${clusterSizes.map((s, i) => `Cluster ${i + 1} (n = ${s})`).join(', ')}.`);
        const minSize = Math.min(...clusterSizes);
        const total   = clusterSizes.reduce((a, b) => a + b, 0);
        if (minSize / total < 0.05) {
            warnings.push(`One or more clusters contain fewer than 5% of observations (minimum n = ${minSize}), which may reflect outlier clusters rather than meaningful subgroups.`);
        }
    }

    if (silhouetteScore != null) {
        let quality = '';
        if      (silhouetteScore >= 0.70) quality = 'strong';
        else if (silhouetteScore >= 0.50) quality = 'reasonable';
        else if (silhouetteScore >= 0.25) quality = 'weak';
        else                               quality = 'no substantial structure';

        details.push(`Average Silhouette Score = ${formatCoef(silhouetteScore)} → cluster quality: ${quality} (Rousseeuw, 1987).`);

        if (silhouetteScore < 0.25) {
            warnings.push(`Silhouette Score = ${formatCoef(silhouetteScore)} indicates that the cluster structure is weak or artificial. Consider different numbers of clusters or a hierarchical approach.`);
        }
    }

    if (varianceExplained < 0.50) {
        warnings.push(`Between-cluster variance explained (${formatPct(varianceExplained)}) is below 50%. The identified clusters may not be meaningfully distinct. Consider increasing the number of clusters or revising the feature set.`);
    }

    return { summary, details, warnings, citations };
}
