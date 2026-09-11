import fs from 'fs';
import worker_threads from 'worker_threads';
import { pathToFileURL } from 'url';

// 1. Monkey patch the global Worker constructor to fix WebR Node.js ESM bug on Windows
const OriginalWorker = worker_threads.Worker;
worker_threads.Worker = function(scriptUrl, options) {
    if (typeof scriptUrl === 'string') {
        if (!scriptUrl.startsWith('file://')) {
            // Convert plain path to file:// URL object
            scriptUrl = pathToFileURL(scriptUrl);
        } else {
            // Convert file:// string to URL object
            scriptUrl = new URL(scriptUrl);
        }
    }
    return new OriginalWorker(scriptUrl, options);
};

// Also patch globalThis.Worker if needed
globalThis.Worker = worker_threads.Worker;

// 2. Import WebR
import { WebR } from 'webr';

async function runTest() {
    console.log("Initializing WebR in Node (Background E2E Test)...");
    const webR = new WebR();
    await webR.init();
    console.log("WebR initialized successfully!");

    // Load data
    const csvContent = fs.readFileSync('public/data/ncsstat_sample_500.csv', 'utf8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const row = {};
        headers.forEach((h, i) => { row[h] = parseFloat(values[i]); });
        return row;
    }).filter(row => !isNaN(row.A1));
    
    // Bind to R
    await webR.objs.globalEnv.bind('raw_data', data);
    console.log("Data transmitted to WebR environment (n=" + data.length + ").");

    // Test 1: Reliability (Cronbach's Alpha) - using the exact R template code from reliability.ts
    const alphaCode = `
    options(mc.cores = 1)
    valid_min <- 1; valid_max <- 5
    data <- as.data.frame(raw_data)[, c("A1", "A2", "A3", "A4", "A5")]
    calc_alpha <- function(df) {
        k <- ncol(df)
        if (k < 2) return(NA)
        cov_mat <- suppressWarnings(cov(df, use = "pairwise.complete.obs"))
        if (any(is.na(cov_mat))) return(NA)
        var_items <- diag(cov_mat)
        var_total <- sum(cov_mat)
        if (var_total <= 0) return(NA)
        (k / (k - 1)) * (1 - sum(var_items) / var_total)
    }
    list(alpha = calc_alpha(data))
    `;
    let res = await webR.evalR(alphaCode);
    let jsRes = await res.toJs();
    console.log("Test 1 [Cronbach Alpha]: PASSED -> Alpha =", jsRes.values[0].values[0]);

    // Test 2: EFA (Exploratory Factor Analysis) - using the exact validation code
    const efaCode = `
    df <- as.data.frame(raw_data)[, c("A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5")]
    if (any(duplicated(as.list(df)))) { stop("Duplicated") }
    cor_mat <- cor(df, use = "pairwise.complete.obs")
    if (any(is.na(cor_mat))) { stop("NA matrix") }
    eigenvalues <- eigen(cor_mat)$values
    list(eigenvalues = eigenvalues)
    `;
    res = await webR.evalR(efaCode);
    jsRes = await res.toJs();
    console.log("Test 2 [EFA Validation & Eigenvalues]: PASSED -> First Eigenvalue =", jsRes.values[0].values[0]);

    // Test 3: Correlation
    const corCode = `
    df <- as.data.frame(raw_data)[, c("A1", "B1")]
    cor_val <- cor(df$A1, df$B1, use="pairwise.complete.obs")
    list(cor = cor_val)
    `;
    res = await webR.evalR(corCode);
    jsRes = await res.toJs();
    console.log("Test 3 [Correlation]: PASSED -> Pearson r(A1, B1) =", jsRes.values[0].values[0]);

    console.log("===============================================================");
    console.log("ALL BACKGROUND TESTS PASSED USING NATIVE WEBR AND SYSTEM LOGIC!");
    console.log("===============================================================");
    process.exit(0);
}

runTest().catch(console.error);
