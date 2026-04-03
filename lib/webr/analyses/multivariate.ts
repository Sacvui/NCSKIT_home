/**
 * Multivariate Analysis Modules - Template-Driven
 */
import { initWebR, executeRWithRecovery, loadPackagesForMethod } from '../core';
import { parseWebRResult, arrayToRMatrix } from '../utils';
import { getAnalysisRTemplate } from '../templates';

/**
 * Run Cluster Analysis (K-Means)
 */
export async function runClusterAnalysis(
    data: number[][],
    k: number = 3,
    method: string = 'kmeans',
    columns: string[] = []
): Promise<{
    clusters: number[];
    centers: number[][];
    size: number[];
    withinSS: number[];
    totWithinSS: number;
    betweensSS: number;
    totalSS: number;
    silhoutteScore?: number;
    rCode: string;
}> {
    await loadPackagesForMethod('cluster');

    const defaultRCode = `
    library(cluster);
    df <- as.data.frame({{data}});
    colnames(df) <- c({{columns}});
    df_scaled <- scale(df);
    set.seed(123);
    km <- kmeans(df_scaled, centers = {{k}}, nstart = 25);
    list(
        cluster = km$cluster,
        centers = as.numeric(t(km$centers)),
        cols = ncol(km$centers),
        size = km$size,
        withinss = km$withinss,
        tot_withinss = km$tot.withinss,
        betweenss = km$betweenss,
        totss = km$totss
    );
    `;

    const colNames = columns.map(c => `"${c}"`).join(',');
    const template = await getAnalysisRTemplate('cluster', defaultRCode);
    const rCode = template
        .replace(/\{\{data\}\}/g, arrayToRMatrix(data))
        .replace(/\{\{columns\}\}/g, colNames)
        .replace(/\{\{k\}\}/g, String(k));

    const result = await executeRWithRecovery(rCode);
    const getValue = parseWebRResult(await result.toJs() as any);

    const centersFlat = getValue('centers') || [];
    const nCols = getValue('cols')?.[0] || columns.length;
    const centers = [];
    for (let i = 0; i < k; i++) {
        centers.push(centersFlat.slice(i * nCols, (i + 1) * nCols));
    }

    return {
        clusters: getValue('cluster') || [],
        centers: centers,
        size: getValue('size') || [],
        withinSS: getValue('withinss') || [],
        totWithinSS: getValue('tot_withinss')?.[0] || 0,
        betweensSS: getValue('betweenss')?.[0] || 0,
        totalSS: getValue('totss')?.[0] || 0,
        rCode
    };
}

/**
 * Run Two-Way ANOVA
 */
export async function runTwoWayANOVA(
    y: number[],
    f1: string[],
    f2: string[],
    f1Name: string,
    f2Name: string,
    yName: string
): Promise<{
    table: {
        source: string;
        df: number;
        ss: number;
        ms: number;
        f: number;
        p: number;
    }[];
    rCode: string;
}> {
    await loadPackagesForMethod('anova');

    const defaultRCode = `
    y <- c({{y}});
    f1 <- factor(c({{f1}}));
    f2 <- factor(c({{f2}}));
    mod <- aov(y ~ f1 * f2);
    res <- summary(mod)[[1]];
    list(
        sources = rownames(res),
        df = res$Df,
        ss = res$"Sum Sq",
        ms = res$"Mean Sq",
        f = res$"F value",
        p = res$"Pr(>F)"
    );
    `;

    const f1Str = f1.map(v => `"${v}"`).join(',');
    const f2Str = f2.map(v => `"${v}"`).join(',');

    const template = await getAnalysisRTemplate('anova2way', defaultRCode);
    const rCode = template
        .replace(/\{\{y\}\}/g, y.join(','))
        .replace(/\{\{f1\}\}/g, f1Str)
        .replace(/\{\{f2\}\}/g, f2Str);

    const result = await executeRWithRecovery(rCode);
    const getValue = parseWebRResult(await result.toJs() as any);

    const sources = getValue('sources') || [];
    const df = getValue('df') || [];
    const ss = getValue('ss') || [];
    const ms = getValue('ms') || [];
    const f = getValue('f') || [];
    const p = getValue('p') || [];

    const table = sources.map((s: string, i: number) => ({
        source: s.trim(),
        df: df[i] || 0,
        ss: ss[i] || 0,
        ms: ms[i] || 0,
        f: f[i] || 0,
        p: p[i] || 0
    }));

    return { table, rCode };
}
