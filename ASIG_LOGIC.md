# ASIG Engine: Decision Logic and Methodological Thresholds

This document provides a complete reference of every decision threshold used
by the **Automated Statistical Insight Generation (ASIG)** engine in NCSKit.
It is intended for:

- **JOSS peer reviewers** verifying that thresholds match accepted methodological
  standards
- **Contributors** who wish to modify thresholds or add new analysis types
- **End users** who want to understand the basis for generated interpretations

All thresholds are implemented as pure TypeScript in `lib/asig/`.
Source: `lib/asig/generator.ts` (dispatch) and the five interpreter files.

---

## 1. Reliability Analysis (`lib/asig/factor.ts`)

### Cronbach's Alpha (α) / McDonald's Omega (ω)

| Coefficient range | Verdict | Rationale |
|:-----------------|:--------|:----------|
| ≥ .90 | Excellent | — |
| .80 – .89 | Good | — |
| .70 – .79 | Adequate (confirmatory research) | Nunnally (1978) |
| .60 – .69 | Exploratory only | Hair et al. (2010) |
| < .60 | Inadequate — revision required | Nunnally (1978) |

**McDonald's Omega preference:** When `isOmegaPrimary = true`, Omega (ω) is
the primary reported coefficient. Rationale: Omega does not assume
tau-equivalence, providing a more accurate reliability estimate
(Hayes & Coutts, 2020).

**Item removal flag:** Any item with corrected item-total correlation < .30 is
flagged for potential deletion (Nunnally, 1978).

### References
- Nunnally, J. C. (1978). *Psychometric theory* (2nd ed.). McGraw-Hill.
- Hair, J. F., et al. (2010). *Multivariate data analysis* (7th ed.). Pearson.
- Hayes, A. F., & Coutts, J. J. (2020). Use omega rather than Cronbach's alpha. *Communication Methods and Measures, 14*(1), 1–24.

---

## 2. Exploratory Factor Analysis — EFA (`lib/asig/factor.ts`)

### Kaiser-Meyer-Olkin (KMO)

| KMO value | Kaiser (1970) label |
|:----------|:-------------------|
| ≥ .90 | Marvellous |
| .80 – .89 | Meritorious |
| .70 – .79 | Middling |
| .60 – .69 | Mediocre |
| < .60 | Unacceptable — EFA not recommended |

**Bartlett's Test of Sphericity:** Must be significant (p < .05) to confirm
the correlation matrix is factorable.

**Total variance explained:** < 50% triggers a warning recommending additional
factors or item revision.

**Communalities:** Items with h² < .40 flagged as poorly represented.

### References
- Kaiser, H. F. (1970). A second generation little jiffy. *Psychometrika, 35*(4), 401–415.
- Hair, J. F., et al. (2010). *Multivariate data analysis* (7th ed.). Pearson.

---

## 3. Confirmatory Factor Analysis — CFA (`lib/asig/factor.ts`)

### Fit Indices (Hu & Bentler, 1999)

| Index | Acceptable | Excellent |
|:------|:----------|:---------|
| CFI | ≥ .90 | ≥ .95 |
| TLI | ≥ .90 | ≥ .95 |
| RMSEA | ≤ .08 | ≤ .06 |
| SRMR | ≤ .08 | ≤ .06 |

**Fit verdict logic:**
- All 4 indices pass + ≥ 3 at excellent level → **"excellent fit"**
- All 4 indices pass → **"acceptable fit"**
- Exactly 1 index fails → **"marginally acceptable fit"**
- ≥ 2 indices fail → **"poor fit"**

**χ² note:** Reported but not used as sole criterion; sensitive to N.

### References
- Hu, L., & Bentler, P. M. (1999). Cutoff criteria for fit indexes. *Structural Equation Modeling, 6*(1), 1–55.
- Kline, R. B. (2016). *Principles and practice of SEM* (4th ed.). Guilford.

---

## 4. Correlation (`lib/asig/basic.ts`)

### Effect Size (Cohen, 1988)

| |r| | Strength |
|:------|:--------|
| < .10 | Negligible |
| .10 – .29 | Weak |
| .30 – .69 | Moderate |
| ≥ .70 | Strong |

Significance threshold: p < .05 (two-tailed).

### References
- Cohen, J. (1988). *Statistical power analysis for the behavioral sciences* (2nd ed.). Lawrence Erlbaum.

---

## 5. Independent-Samples t-test (`lib/asig/basic.ts`)

**Variance homogeneity:** If Levene's Test p < .05 → Welch's correction applied
automatically. Warning generated in output.

**Normality:** If Shapiro-Wilk p < .05 for either group → warning recommending
Mann-Whitney U.

### Cohen's d Effect Size

| |d| | Label |
|:----|:------|
| < .20 | Negligible |
| .20 – .49 | Small |
| .50 – .79 | Medium |
| ≥ .80 | Large |

### References
- Cohen, J. (1988). *Statistical power analysis for the behavioral sciences* (2nd ed.). Lawrence Erlbaum.

---

## 6. One-Way ANOVA (`lib/asig/basic.ts`)

**Variance homogeneity:** Levene p < .05 → Welch ANOVA applied.
**Normality of residuals:** Shapiro-Wilk p < .05 → warns, recommends Kruskal-Wallis.

### η² Effect Size (Richardson, 2011)

| η² | Label |
|:---|:------|
| < .01 | Negligible |
| .01 – .05 | Small |
| .06 – .13 | Medium |
| ≥ .14 | Large |

### References
- Richardson, J. T. E. (2011). Eta squared and partial eta squared. *Educational Research Review, 6*(2), 135–147.

---

## 7. Non-Parametric Tests (`lib/asig/basic.ts`)

### Mann-Whitney U
- Effect size r: < .10 negligible, .10 weak, .30 medium, ≥ .50 large.
- Footnote: compares rank distributions, not necessarily medians.

### Kruskal-Wallis H
- Significant result prompts recommendation for Dunn's test (Bonferroni correction).

### Wilcoxon Signed-Rank
- Effect size r same benchmarks as Mann-Whitney.

---

## 8. Chi-Square Test of Independence (`lib/asig/basic.ts`)

### Cramér's V Effect Size

| V | Label |
|:--|:------|
| < .10 | Negligible |
| .10 – .29 | Weak |
| .30 – .49 | Moderate |
| ≥ .50 | Strong |

Fisher's Exact Test reported when available (2×2 tables or sparse cells).

### References
- Cramér, H. (1946). *Mathematical methods of statistics*. Princeton University Press.
- Cohen, J. (1988). *Statistical power analysis for the behavioral sciences* (2nd ed.). Lawrence Erlbaum.

---

## 9. Linear Regression (`lib/asig/regression.ts`)

- **Model significance:** F-test p < .05
- **Multicollinearity:** VIF ≥ 5 → moderate warning; VIF ≥ 10 → severe warning, removal recommended
- **Normality of residuals:** Shapiro-Wilk p < .05 → bootstrap CI recommended
- **Autocorrelation:** Durbin-Watson outside [1.5, 2.5] → warning

### Adjusted R² (Cohen et al., 2003)

| adj. R² | Explanatory power |
|:--------|:-----------------|
| < .13 | Weak |
| .13 – .25 | Moderate |
| > .26 | Substantial |

### References
- Cohen, J., Cohen, P., West, S. G., & Aiken, L. S. (2003). *Applied multiple regression/correlation analysis* (3rd ed.). Lawrence Erlbaum.
- Hair, J. F., et al. (2010). *Multivariate data analysis* (7th ed.). Pearson.

---

## 10. Mediation Analysis (`lib/asig/regression.ts`)

- Full mediation: indirect effect significant AND direct effect (c′) non-significant
- Partial mediation: both indirect and direct effects significant
- No mediation: indirect effect not significant

Bootstrap 95% CI excluding zero → confirms significant indirect effect.

**Warning generated:** Baron-Kenny (1986) causal-steps approach has limitations;
bootstrap methods (Hayes, 2018 PROCESS) recommended.

---

## 11. PLS-SEM (`lib/asig/pls-sem.ts`)

### Outer Loadings (Hair et al., 2017)

| Loading | Assessment |
|:--------|:----------|
| < .40 | Inadequate — item removal recommended |
| .40 – .69 | Acceptable but below preferred threshold |
| ≥ .70 | Satisfactory |

### Average Variance Extracted (AVE)

| AVE | Assessment |
|:----|:----------|
| < .50 | Convergent validity not established (Fornell & Larcker, 1981) |
| ≥ .50 | Convergent validity established |

### Composite Reliability (CR)

| CR | Assessment |
|:---|:----------|
| < .70 | Insufficient internal consistency |
| .70 – .95 | Satisfactory |
| > .95 | Potential indicator redundancy |

### Discriminant Validity: Fornell-Larcker Criterion
√AVE for each construct must exceed all inter-construct correlations.
Violation → construct pairs listed in warning.

### Discriminant Validity: HTMT (Henseler et al., 2015)

| HTMT | Assessment |
|:-----|:----------|
| < .85 | Discriminant validity confirmed (strict threshold) |
| .85 – .89 | Borderline — bootstrap CI recommended |
| ≥ .90 | Discriminant validity violated (liberal threshold) |

### R² (Hair et al., 2017)

| R² | Explanatory power |
|:---|:-----------------|
| < .10 | Very weak |
| .10 – .24 | Weak |
| .25 – .49 | Moderate |
| .50 – .74 | Substantial |
| ≥ .75 | Very substantial |

### References
- Hair, J. F., et al. (2017). *A primer on PLS-SEM* (2nd ed.). SAGE.
- Fornell, C., & Larcker, D. F. (1981). Evaluating SEM with unobservable variables. *Journal of Marketing Research, 18*(1), 39–50.
- Henseler, J., et al. (2015). A new criterion for discriminant validity. *Journal of the Academy of Marketing Science, 43*(1), 115–135.

---

## 12. VIF Multicollinearity Diagnostic (`lib/asig/generator.ts`)

| VIF | Assessment |
|:----|:----------|
| < 5 | No problematic collinearity (default threshold) |
| 5 – 9.9 | Moderate — monitor stability |
| ≥ 10 | Severe — removal or orthogonalisation required |

Default threshold configurable via `threshold` parameter (Hair et al., 2010).

---

## 13. Multivariate Outlier Detection (`lib/asig/generator.ts`)

Method: Mahalanobis Distance, critical χ² at p < .001.
Outliers reported as count and percentage of N.
Researcher guidance: check for data entry errors; sensitivity analysis recommended.

### Reference
- Tabachnick, B. G., & Fidell, L. S. (2013). *Using multivariate statistics* (6th ed.). Pearson.

---

## 14. HTMT — Standalone (`lib/asig/generator.ts`)

Same thresholds as PLS-SEM section above.
Accepts 2D matrix input; reports all pairs with HTMT ≥ threshold.
Configurable threshold (default .85).

---

## Source Code Cross-Reference

| Analysis type | AnalysisType key | Interpreter function | File |
|:-------------|:----------------|:--------------------|:-----|
| Descriptive statistics | `descriptive` | `interpretDescriptive` | `basic.ts` |
| Correlation | `correlation` | `interpretCorrelation` | `basic.ts` |
| Independent t-test | `ttest_independent` | `interpretTTestIndependent` | `basic.ts` |
| Paired t-test | `ttest_paired` | `interpretTTestPaired` | `basic.ts` |
| One-way ANOVA | `anova` | `interpretANOVA` | `basic.ts` |
| Two-way ANOVA | `two_way_anova` | `interpretTwoWayANOVA` | `basic.ts` |
| Mann-Whitney U | `mann_whitney` | `interpretMannWhitney` | `basic.ts` |
| Kruskal-Wallis H | `kruskal_wallis` | `interpretKruskalWallis` | `basic.ts` |
| Wilcoxon Signed-Rank | `wilcoxon_signed` | `interpretWilcoxonSigned` | `basic.ts` |
| Chi-square | `chi_square` | `interpretChiSquare` | `basic.ts` |
| Cronbach's Alpha / Omega | `cronbach_alpha` | `interpretCronbachAlpha` | `factor.ts` |
| EFA | `efa` | `interpretEFA` | `factor.ts` |
| CFA | `cfa` | `interpretCFA` | `factor.ts` |
| Linear regression | `linear_regression` | `interpretLinearRegression` | `regression.ts` |
| Logistic regression | `logistic_regression` | `interpretLogisticRegression` | `regression.ts` |
| Mediation | `mediation` | `interpretMediation` | `regression.ts` |
| Moderation | `moderation` | `interpretModeration` | `regression.ts` |
| Cluster analysis | `cluster` | `interpretClusterAnalysis` | `regression.ts` |
| PLS-SEM | `pls-sem` | `interpretPLSSEM` | `pls-sem.ts` |
| VIF diagnostic | `vif` | `interpretVIF` | `generator.ts` |
| Outlier detection | `outlier` | `interpretOutlier` | `generator.ts` |
| HTMT standalone | `htmt` | `interpretHTMT` | `generator.ts` |
