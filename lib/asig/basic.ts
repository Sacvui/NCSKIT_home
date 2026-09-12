/**
 * ASIG — basic.ts
 * Interpreters: Descriptive Statistics, Correlation, Independent/Paired t-test,
 *               One-Way ANOVA, Two-Way ANOVA, Mann-Whitney U, Kruskal-Wallis,
 *               Wilcoxon Signed Rank, Chi-Square
 * All prose conforms to APA 7th Edition reporting standards.
 */

import { formatPValue, formatCoef, formatNum, formatPct, InterpretationResult } from './shared';


// ─── DESCRIPTIVE STATISTICS ───────────────────────────────────────────────────

export function interpretDescriptive(params: {
    columnNames: string[];
    means:       number[];
    sds:         number[];
    skews:       number[];
    kurtoses:    number[];
    N:           number[];
}): InterpretationResult {
    const { columnNames, means, sds, skews, kurtoses, N } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'George, D., & Mallery, P. (2010). SPSS for Windows step by step: A simple guide and reference (10th ed.). Pearson.',
        'Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2010). Multivariate data analysis (7th ed.). Pearson.',
    ];

    const nonNormal: string[] = [];

    columnNames.forEach((name, i) => {
        const skew = skews[i];
        const kurt = kurtoses[i];
        const skewOk = Math.abs(skew) <= 2;
        const kurtOk = Math.abs(kurt) <= 2;

        let note = `"${name}": M = ${formatNum(means[i])}, SD = ${formatNum(sds[i])}`;
        if (N[i] != null) note += `, N = ${N[i]}`;
        note += `; Skewness = ${formatNum(skew)}, Kurtosis = ${formatNum(kurt)}.`;

        if (!skewOk || !kurtOk) {
            nonNormal.push(name);
            const issues: string[] = [];
            if (!skewOk) issues.push(`skewness (${formatNum(skew)}) outside [−2, 2]`);
            if (!kurtOk) issues.push(`kurtosis (${formatNum(kurt)}) outside [−2, 2]`);
            warnings.push(`"${name}" violates normality: ${issues.join('; ')}.`);
        }

        details.push(note);
    });

    let summary = '';
    if (nonNormal.length === 0) {
        summary = `Descriptive statistics were computed for ${columnNames.length} variable${columnNames.length > 1 ? 's' : ''} (N = ${N[0]}). All variables exhibited skewness and kurtosis values within the acceptable range of ±2 (George & Mallery, 2010), indicating approximate normality suitable for parametric analyses.`;
    } else {
        summary = `Descriptive statistics were computed for ${columnNames.length} variable${columnNames.length > 1 ? 's' : ''} (N = ${N[0]}). ${nonNormal.length} of ${columnNames.length} variable${columnNames.length > 1 ? 's' : ''} (${nonNormal.join(', ')}) displayed skewness or kurtosis values outside the ±2 threshold (George & Mallery, 2010), suggesting departure from normality. Non-parametric alternatives should be considered for these variables.`;
    }

    return { summary, details, warnings, citations };
}


// ─── PEARSON / SPEARMAN / KENDALL CORRELATION ─────────────────────────────────

export function interpretCorrelation(params: {
    var1:    string;
    var2:    string;
    r:       number;
    pValue:  number;
    n?:      number;
    method?: 'pearson' | 'spearman' | 'kendall';
}): InterpretationResult {
    const { var1, var2, r, pValue, n, method = 'pearson' } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Cohen, J. (1988). Statistical power analysis for the behavioral sciences (2nd ed.). Lawrence Erlbaum Associates.',
    ];

    const methodLabel = method === 'pearson'
        ? 'Pearson product-moment correlation'
        : method === 'spearman'
            ? 'Spearman rank-order correlation'
            : 'Kendall rank correlation';

    const statSymbol = method === 'pearson' ? 'r' : method === 'spearman' ? 'r_s' : 'τ';
    const nStr = n != null ? `, N = ${n}` : '';

    let summary = '';

    if (pValue > 0.05) {
        summary = `A ${methodLabel} was conducted to examine the relationship between "${var1}" and "${var2}." The analysis revealed no statistically significant association (${statSymbol} = ${formatCoef(r)}${nStr}, ${formatPValue(pValue)}).`;
    } else {
        const direction = r > 0 ? 'positive' : 'negative';
        const absR = Math.abs(r);
        const strength = absR < 0.30 ? 'weak' : absR < 0.70 ? 'moderate' : 'strong';

        summary = `A ${methodLabel} was conducted to examine the relationship between "${var1}" and "${var2}." The results indicated a statistically significant ${strength} ${direction} correlation (${statSymbol} = ${formatCoef(r)}${nStr}, ${formatPValue(pValue)}). This suggests that higher values of "${var1}" are associated with ${r > 0 ? 'higher' : 'lower'} values of "${var2}."`;

        details.push(`Coefficient of determination: r² = ${formatCoef(r * r)}, indicating that "${var1}" accounts for approximately ${formatPct(r * r)} of the variance in "${var2}."`);
        details.push(`Effect size benchmark (Cohen, 1988): small r = .10, medium r = .30, large r = .50.`);
    }

    return { summary, details, warnings, citations };
}


// ─── INDEPENDENT-SAMPLES T-TEST ───────────────────────────────────────────────

export function interpretTTestIndependent(params: {
    groupVar:   string;
    targetVar:  string;
    group1Name: string;
    group2Name: string;
    mean1:      number;
    sd1:        number;
    mean2:      number;
    sd2:        number;
    t:          number;
    df:         number;
    pValue:     number;
    cohensD?:   number;
    leveneP?:   number;
    shapiroP1?: number;
    shapiroP2?: number;
}): InterpretationResult {
    const {
        groupVar, targetVar, group1Name, group2Name,
        mean1, sd1, mean2, sd2, t, df, pValue,
        cohensD, leveneP, shapiroP1, shapiroP2
    } = params;

    const isWelch   = leveneP != null && leveneP < 0.05;
    const testLabel = isWelch ? "Welch's t-test" : 'an independent-samples t-test';

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Cohen, J. (1988). Statistical power analysis for the behavioral sciences (2nd ed.). Lawrence Erlbaum Associates.',
    ];

    let summary = '';

    if (pValue > 0.05) {
        summary = `An independent-samples t-test (${isWelch ? "Welch's correction applied" : "equal variances assumed"}) was conducted to compare "${targetVar}" between the ${group1Name} group (M = ${formatNum(mean1)}, SD = ${formatNum(sd1)}) and the ${group2Name} group (M = ${formatNum(mean2)}, SD = ${formatNum(sd2)}). The difference was not statistically significant, t(${formatNum(df, 0)}) = ${formatNum(t)}, ${formatPValue(pValue)}.`;
    } else {
        const higherGroup = mean1 > mean2 ? group1Name : group2Name;
        const lowerGroup  = mean1 > mean2 ? group2Name : group1Name;
        const mHigh = Math.max(mean1, mean2);
        const mLow  = Math.min(mean1, mean2);
        const sdHigh = mean1 > mean2 ? sd1 : sd2;
        const sdLow  = mean1 > mean2 ? sd2 : sd1;

        summary = `${isWelch ? "A Welch's t-test" : 'An independent-samples t-test'} revealed a statistically significant difference in "${targetVar}" between the ${group1Name} group (M = ${formatNum(mHigh)}, SD = ${formatNum(sdHigh)}) and the ${group2Name} group (M = ${formatNum(mLow)}, SD = ${formatNum(sdLow)}), t(${formatNum(df, 0)}) = ${formatNum(t)}, ${formatPValue(pValue)}. The ${higherGroup} group scored significantly higher than the ${lowerGroup} group.`;
    }

    // Effect size
    if (cohensD != null) {
        const d = Math.abs(cohensD);
        const label = d < 0.20 ? 'negligible' : d < 0.50 ? 'small' : d < 0.80 ? 'medium' : 'large';
        details.push(`Cohen's d = ${formatNum(cohensD)} (${label} effect; benchmarks: small = 0.20, medium = 0.50, large = 0.80; Cohen, 1988).`);
    }

    // Assumption checks
    if (leveneP != null && leveneP < 0.05) {
        warnings.push(`Levene's Test for Equality of Variances was significant (${formatPValue(leveneP)}), indicating heteroscedasticity. Welch's t-test (which does not assume equal variances) was therefore applied.`);
    }
    if (shapiroP1 != null && shapiroP1 < 0.05) {
        warnings.push(`The ${group1Name} group violated the normality assumption (Shapiro-Wilk, ${formatPValue(shapiroP1)}). Consider the Mann-Whitney U test as a non-parametric alternative.`);
    }
    if (shapiroP2 != null && shapiroP2 < 0.05) {
        warnings.push(`The ${group2Name} group violated the normality assumption (Shapiro-Wilk, ${formatPValue(shapiroP2)}). Consider the Mann-Whitney U test as a non-parametric alternative.`);
    }

    return { summary, details, warnings, citations };
}


// ─── PAIRED-SAMPLES T-TEST ────────────────────────────────────────────────────

export function interpretTTestPaired(params: {
    targetVar:      string;
    meanBefore:     number;
    sdBefore:       number;
    meanAfter:      number;
    sdAfter:        number;
    meanDiff:       number;
    t:              number;
    df:             number;
    pValue:         number;
    cohensD?:       number;
    normalityDiffP?: number;
}): InterpretationResult {
    const {
        targetVar, meanBefore, sdBefore, meanAfter, sdAfter,
        meanDiff, t, df, pValue, cohensD, normalityDiffP
    } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Cohen, J. (1988). Statistical power analysis for the behavioral sciences (2nd ed.). Lawrence Erlbaum Associates.',
    ];

    let summary = '';

    if (pValue > 0.05) {
        summary = `A paired-samples t-test was conducted to evaluate the change in "${targetVar}" across two measurement occasions. The pre-measurement (M = ${formatNum(meanBefore)}, SD = ${formatNum(sdBefore)}) and post-measurement (M = ${formatNum(meanAfter)}, SD = ${formatNum(sdAfter)}) did not differ significantly, t(${formatNum(df, 0)}) = ${formatNum(t)}, ${formatPValue(pValue)}.`;
    } else {
        const direction = meanDiff > 0 ? 'decreased' : 'increased';
        const from = formatNum(meanBefore);
        const to   = formatNum(meanAfter);
        summary = `A paired-samples t-test indicated a statistically significant change in "${targetVar}" between the two measurement occasions, t(${formatNum(df, 0)}) = ${formatNum(t)}, ${formatPValue(pValue)}. Scores ${direction} from pre-test (M = ${from}, SD = ${formatNum(sdBefore)}) to post-test (M = ${to}, SD = ${formatNum(sdAfter)}), with a mean difference of ${formatNum(Math.abs(meanDiff))}.`;
    }

    if (cohensD != null) {
        const d = Math.abs(cohensD);
        const label = d < 0.20 ? 'negligible' : d < 0.50 ? 'small' : d < 0.80 ? 'medium' : 'large';
        details.push(`Cohen's d = ${formatNum(cohensD)} (${label} effect).`);
    }

    if (normalityDiffP != null && normalityDiffP > 0 && normalityDiffP < 0.05) {
        warnings.push(`The distribution of difference scores violated normality (Shapiro-Wilk, ${formatPValue(normalityDiffP)}). The Wilcoxon Signed-Rank Test is recommended as a non-parametric alternative.`);
    }

    return { summary, details, warnings, citations };
}


// ─── ONE-WAY ANOVA ────────────────────────────────────────────────────────────

export function interpretANOVA(params: {
    factorVar:        string;
    targetVar:        string;
    F:                number;
    dfBetween:        number;
    dfWithin:         number;
    pValue:           number;
    etaSquared?:      number;
    methodUsed?:      string;
    leveneP?:         number;
    normalityResidP?: number;
    postHoc?:         { comparison: string; diff: number; pAdj: number }[];
}): InterpretationResult {
    const {
        factorVar, targetVar, F, dfBetween, dfWithin, pValue,
        etaSquared, methodUsed, leveneP, normalityResidP, postHoc
    } = params;

    const isWelch   = methodUsed === 'Welch ANOVA';
    const testLabel = isWelch ? 'a Welch one-way ANOVA' : 'a one-way ANOVA';

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Richardson, J. T. E. (2011). Eta squared and partial eta squared as measures of effect size in educational research. Educational Research Review, 6(2), 135–147.',
        'Cohen, J. (1988). Statistical power analysis for the behavioral sciences (2nd ed.). Lawrence Erlbaum Associates.',
    ];

    let summary = '';

    if (pValue > 0.05) {
        summary = `${isWelch ? 'A Welch one-way ANOVA' : 'A one-way ANOVA'} was conducted to examine differences in "${targetVar}" across levels of "${factorVar}." The omnibus test was not statistically significant, F(${formatNum(dfBetween, 0)}, ${formatNum(dfWithin, 0)}) = ${formatNum(F)}, ${formatPValue(pValue)}, indicating that group means did not differ significantly.`;
    } else {
        summary = `${isWelch ? 'A Welch one-way ANOVA' : 'A one-way ANOVA'} revealed a statistically significant effect of "${factorVar}" on "${targetVar}", F(${formatNum(dfBetween, 0)}, ${formatNum(dfWithin, 0)}) = ${formatNum(F)}, ${formatPValue(pValue)}.`;

        if (postHoc) {
            const sigPairs = postHoc.filter(p => p.pAdj < 0.05);
            if (sigPairs.length > 0) {
                details.push(`Post-hoc pairwise comparisons identified the following significantly different group pairs: ${sigPairs.map(p => p.comparison).join('; ')}.`);
            }
        }
    }

    if (etaSquared != null) {
        const label = etaSquared < 0.01 ? 'negligible' : etaSquared < 0.06 ? 'small' : etaSquared < 0.14 ? 'medium' : 'large';
        details.push(`Effect size: η² = ${formatCoef(etaSquared)}, indicating that ${formatPct(etaSquared)} of the variance in "${targetVar}" is attributable to group membership (${label} effect; Cohen, 1988).`);
    }

    if (leveneP != null && leveneP < 0.05) {
        warnings.push(`Levene's Test for Equality of Variances was significant (${formatPValue(leveneP)}). Welch's ANOVA was applied to correct for heteroscedasticity.`);
    }
    if (normalityResidP != null && normalityResidP > 0 && normalityResidP < 0.05) {
        warnings.push(`Residuals violated the normality assumption (Shapiro-Wilk, ${formatPValue(normalityResidP)}). The Kruskal-Wallis H test is recommended as a robust non-parametric alternative.`);
    }

    return { summary, details, warnings, citations };
}


// ─── TWO-WAY ANOVA ────────────────────────────────────────────────────────────

export function interpretTwoWayANOVA(params: {
    factor1:       string;
    factor2:       string;
    targetVar:     string;
    mainEffect1F:  number;
    mainEffect1P:  number;
    mainEffect2F:  number;
    mainEffect2P:  number;
    interactionF:  number;
    interactionP:  number;
    df1:           number;
    df2:           number;
    dfError:       number;
}): InterpretationResult {
    const {
        factor1, factor2, targetVar,
        mainEffect1F, mainEffect1P,
        mainEffect2F, mainEffect2P,
        interactionF, interactionP,
        df1, df2, dfError
    } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Field, A. (2013). Discovering statistics using IBM SPSS statistics (4th ed.). SAGE Publications.',
    ];

    const hasInteraction = interactionP < 0.05;
    const hasMain1       = mainEffect1P < 0.05;
    const hasMain2       = mainEffect2P < 0.05;

    let summary = '';

    if (hasInteraction) {
        summary = `A two-way ANOVA revealed a statistically significant interaction effect between "${factor1}" and "${factor2}" on "${targetVar}", F(${formatNum(df1, 0)}, ${formatNum(dfError, 0)}) = ${formatNum(interactionF)}, ${formatPValue(interactionP)}. This indicates that the effect of "${factor1}" on "${targetVar}" depends on the level of "${factor2}" (and vice versa). Simple effects analysis is recommended to interpret this interaction.`;
        warnings.push('When a significant interaction is present, main effects should not be interpreted in isolation. Conduct simple effects (simple main effects) analysis to fully decompose the interaction.');
    } else {
        const mainEffects: string[] = [];
        if (hasMain1) mainEffects.push(`"${factor1}" (F(${formatNum(df1, 0)}, ${formatNum(dfError, 0)}) = ${formatNum(mainEffect1F)}, ${formatPValue(mainEffect1P)})`);
        if (hasMain2) mainEffects.push(`"${factor2}" (F(${formatNum(df2, 0)}, ${formatNum(dfError, 0)}) = ${formatNum(mainEffect2F)}, ${formatPValue(mainEffect2P)})`);

        if (mainEffects.length > 0) {
            summary = `A two-way ANOVA indicated no significant interaction between "${factor1}" and "${factor2}" on "${targetVar}" (F(${formatNum(df1, 0)}, ${formatNum(dfError, 0)}) = ${formatNum(interactionF)}, ${formatPValue(interactionP)}). However, statistically significant main effect${mainEffects.length > 1 ? 's' : ''} were observed for ${mainEffects.join(' and ')}.`;
        } else {
            summary = `A two-way ANOVA indicated neither a significant interaction effect (F(${formatNum(df1, 0)}, ${formatNum(dfError, 0)}) = ${formatNum(interactionF)}, ${formatPValue(interactionP)}) nor significant main effects for "${factor1}" or "${factor2}" on "${targetVar}."`;
        }
    }

    details.push(`Main effect of "${factor1}": F(${formatNum(df1, 0)}, ${formatNum(dfError, 0)}) = ${formatNum(mainEffect1F)}, ${formatPValue(mainEffect1P)}.`);
    details.push(`Main effect of "${factor2}": F(${formatNum(df2, 0)}, ${formatNum(dfError, 0)}) = ${formatNum(mainEffect2F)}, ${formatPValue(mainEffect2P)}.`);
    details.push(`Interaction effect (${factor1} × ${factor2}): F(${formatNum(df1, 0)}, ${formatNum(dfError, 0)}) = ${formatNum(interactionF)}, ${formatPValue(interactionP)}.`);

    return { summary, details, warnings, citations };
}


// ─── MANN-WHITNEY U TEST ─────────────────────────────────────────────────────

export function interpretMannWhitney(params: {
    group1Name:     string;
    group2Name:     string;
    targetVar:      string;
    statistic:      number;
    pValue:         number;
    median1:        number;
    median2:        number;
    effectSize?:    number;
    distShapeRun?:  string;
}): InterpretationResult {
    const { group1Name, group2Name, targetVar, statistic, pValue, median1, median2, effectSize, distShapeRun } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Mann, H. B., & Whitney, D. R. (1947). On a test of whether one of two random variables is stochastically larger than the other. Annals of Mathematical Statistics, 18(1), 50–60.',
    ];

    let summary = '';

    if (pValue > 0.05) {
        summary = `A Mann-Whitney U test was conducted to compare "${targetVar}" between the ${group1Name} group (Mdn = ${formatNum(median1)}) and the ${group2Name} group (Mdn = ${formatNum(median2)}). The test indicated no statistically significant difference between the groups, U = ${formatNum(statistic)}, ${formatPValue(pValue)}.`;
    } else {
        const higherGroup = median1 > median2 ? group1Name : group2Name;
        const lowerGroup  = median1 > median2 ? group2Name : group1Name;
        summary = `A Mann-Whitney U test indicated that "${targetVar}" differed significantly between groups, U = ${formatNum(statistic)}, ${formatPValue(pValue)}. The ${higherGroup} group (Mdn = ${formatNum(Math.max(median1, median2))}) scored significantly higher than the ${lowerGroup} group (Mdn = ${formatNum(Math.min(median1, median2))}).`;
    }

    if (effectSize != null) {
        const r = Math.abs(effectSize);
        const label = r < 0.10 ? 'negligible' : r < 0.30 ? 'small' : r < 0.50 ? 'medium' : 'large';
        details.push(`Effect size: r = ${formatCoef(effectSize)} (${label}; benchmarks: small = .10, medium = .30, large = .50).`);
    }

    if (distShapeRun) {
        details.push(distShapeRun);
    }

    warnings.push('The Mann-Whitney U test compares rank distributions, not necessarily medians, unless distributional shapes are identical. Report medians for descriptive purposes alongside the U statistic.');

    return { summary, details, warnings, citations };
}


// ─── KRUSKAL-WALLIS H TEST ────────────────────────────────────────────────────

export function interpretKruskalWallis(params: {
    factorVar:  string;
    targetVar:  string;
    statistic:  number;
    df:         number;
    pValue:     number;
    medians:    number[];
    groupNames?: string[];
}): InterpretationResult {
    const { factorVar, targetVar, statistic, df, pValue, medians, groupNames } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Kruskal, W. H., & Wallis, W. A. (1952). Use of ranks in one-criterion variance analysis. Journal of the American Statistical Association, 47(260), 583–621.',
    ];

    let summary = '';

    if (pValue > 0.05) {
        summary = `A Kruskal-Wallis H test was conducted to examine differences in "${targetVar}" across groups of "${factorVar}." The test did not reach statistical significance, H(${df}) = ${formatNum(statistic)}, ${formatPValue(pValue)}, indicating no significant difference in the rank distributions across groups.`;
    } else {
        summary = `A Kruskal-Wallis H test revealed a statistically significant difference in "${targetVar}" across groups of "${factorVar}", H(${df}) = ${formatNum(statistic)}, ${formatPValue(pValue)}. Post-hoc pairwise comparisons (e.g., Dunn's test with Bonferroni correction) are recommended to identify which groups differ.`;

        const medStr = medians
            .map((m, i) => `${groupNames?.[i] ?? `Group ${i + 1}`}: Mdn = ${formatNum(m)}`)
            .join(', ');
        details.push(`Group medians — ${medStr}.`);
        details.push('Follow-up: Dunn\'s test with Bonferroni or Holm correction is recommended for post-hoc pairwise comparisons.');
    }

    return { summary, details, warnings, citations };
}


// ─── WILCOXON SIGNED-RANK TEST ────────────────────────────────────────────────

export function interpretWilcoxonSigned(params: {
    targetVar:  string;
    statistic:  number;
    pValue:     number;
    medianDiff: number;
    effectSize?: number;
}): InterpretationResult {
    const { targetVar, statistic, pValue, medianDiff, effectSize } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Wilcoxon, F. (1945). Individual comparisons by ranking methods. Biometrics Bulletin, 1(6), 80–83.',
    ];

    let summary = '';

    if (pValue > 0.05) {
        summary = `A Wilcoxon Signed-Rank Test was conducted to assess change in "${targetVar}" between two related measurement occasions. The test indicated no statistically significant difference, W = ${formatNum(statistic)}, ${formatPValue(pValue)}.`;
    } else {
        const direction = medianDiff > 0 ? 'decreased' : 'increased';
        summary = `A Wilcoxon Signed-Rank Test indicated a statistically significant change in "${targetVar}" between the two measurement occasions, W = ${formatNum(statistic)}, ${formatPValue(pValue)}. Scores ${direction} significantly, with a median difference of ${formatNum(Math.abs(medianDiff))}.`;
    }

    if (effectSize != null) {
        const r = Math.abs(effectSize);
        const label = r < 0.10 ? 'negligible' : r < 0.30 ? 'small' : r < 0.50 ? 'medium' : 'large';
        details.push(`Effect size: r = ${formatCoef(effectSize)} (${label}).`);
    }

    details.push('This test is the non-parametric equivalent of the paired-samples t-test and is appropriate when the distribution of difference scores is non-normal.');

    return { summary, details, warnings, citations };
}


// ─── CHI-SQUARE TEST OF INDEPENDENCE ─────────────────────────────────────────

export function interpretChiSquare(params: {
    var1:          string;
    var2:          string;
    statistic:     number;
    df:            number;
    pValue:        number;
    cramersV:      number;
    fisherPValue?: number | null;
    warning?:      string;
    n?:            number;
}): InterpretationResult {
    const { var1, var2, statistic, df, pValue, cramersV, fisherPValue, warning, n } = params;

    const details:   string[] = [];
    const warnings:  string[] = [];
    const citations: string[] = [
        'Cramér, H. (1946). Mathematical methods of statistics. Princeton University Press.',
        'Cohen, J. (1988). Statistical power analysis for the behavioral sciences (2nd ed.). Lawrence Erlbaum Associates.',
    ];

    const nStr = n != null ? `, N = ${n}` : '';
    let summary = '';

    if (pValue > 0.05) {
        summary = `A chi-square test of independence was performed to examine the relationship between "${var1}" and "${var2}." The association was not statistically significant, χ²(${df}${nStr}) = ${formatNum(statistic)}, ${formatPValue(pValue)}. This suggests that the two variables are independent.`;
    } else {
        const label = cramersV < 0.10 ? 'negligible' : cramersV < 0.30 ? 'weak' : cramersV < 0.50 ? 'moderate' : 'strong';
        summary = `A chi-square test of independence indicated a statistically significant association between "${var1}" and "${var2}", χ²(${df}${nStr}) = ${formatNum(statistic)}, ${formatPValue(pValue)}. The strength of association was ${label} (Cramér's V = ${formatCoef(cramersV)}).`;
        details.push(`Effect size benchmarks for Cramér's V: negligible < .10, weak = .10–.29, moderate = .30–.49, strong ≥ .50 (Cohen, 1988).`);
    }

    if (fisherPValue != null) {
        details.push(`Fisher's Exact Test (applied for 2×2 tables or sparse cells): ${formatPValue(fisherPValue)}.`);
    }

    if (warning) {
        warnings.push(warning);
    }

    return { summary, details, warnings, citations };
}
