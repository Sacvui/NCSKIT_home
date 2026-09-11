import { WebR } from 'webr';
import fs from 'fs';

async function runTest() {
    console.log("Initializing WebR in Node...");
    
    // Fix Windows ESM Worker issue by providing a valid file:// baseUrl
    const baseUrl = 'file:///' + process.cwd().replace(/\\/g, '/') + '/node_modules/webr/dist/';
    
    const webR = new WebR({ baseUrl });
    await webR.init();
    console.log("WebR initialized successfully!");

    // 1. Load data
    console.log("Loading ncsstat_sample_500.csv...");
    const csvContent = fs.readFileSync('public/data/ncsstat_sample_500.csv', 'utf8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Extract a few numerical columns for testing (e.g. A1 to A5 for Cronbach)
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
            A1: parseFloat(values[headers.indexOf('A1')]),
            A2: parseFloat(values[headers.indexOf('A2')]),
            A3: parseFloat(values[headers.indexOf('A3')]),
            A4: parseFloat(values[headers.indexOf('A4')]),
            A5: parseFloat(values[headers.indexOf('A5')]),
        };
    }).filter(row => !isNaN(row.A1));

    console.log("Loaded " + data.length + " rows for testing Cronbach's Alpha...");

    // 2. Bind data to R exactly like the system does
    await webR.objs.globalEnv.bind('raw_data', data);

    // 3. Run EXACT Cronbach Alpha template from our system
    const rCode = `
    options(mc.cores = 1);
    
    valid_min <- 1;
    valid_max <- 5;
    
    data <- raw_data
    data[data > valid_max] <- valid_max
    data[data < valid_min] <- valid_min
    data <- as.data.frame(data)
    
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

    n_items <- ncol(data)
    total_scores <- rowSums(data, na.rm = TRUE)
    scale_mean <- mean(total_scores, na.rm = TRUE)
    scale_var <- var(total_scores, na.rm = TRUE)
    
    raw_alpha <- calc_alpha(data)
    
    r_drop <- numeric(n_items)
    alpha_drop <- numeric(n_items)
    mean_drop <- numeric(n_items)
    var_drop <- numeric(n_items)
    
    for (i in 1:n_items) {
        df_drop <- data[, -i, drop = FALSE]
        alpha_drop[i] <- calc_alpha(df_drop)
        item_i <- data[, i]
        total_without_i <- rowSums(df_drop, na.rm = TRUE)
        r_drop[i] <- suppressWarnings(cor(item_i, total_without_i, use = "pairwise.complete.obs"))
        mean_drop[i] <- mean(total_without_i, na.rm = TRUE)
        var_drop[i] <- var(total_without_i, na.rm = TRUE)
    }
    
    r_drop[is.na(r_drop)] <- 0
    alpha_drop[is.na(alpha_drop)] <- 0
    
    list(
        raw_alpha = if(is.numeric(raw_alpha)) raw_alpha else 0,
        n_items = n_items,
        corrected_item_total = r_drop,
        alpha_if_deleted = alpha_drop
    )
    `;

    console.log("Evaluating R Code...");
    try {
        const result = await webR.evalR(rCode);
        const jsResult = await result.toJs();
        console.log("=========================================");
        console.log("Cronbach Alpha Results on ncsstat_sample_500:");
        console.log("Overall Alpha:", jsResult.values[0]);
        console.log("Number of Items:", jsResult.values[1]);
        console.log("Corrected Item-Total Correlations:", jsResult.values[2].values);
        console.log("Alpha if Deleted:", jsResult.values[3].values);
        console.log("=========================================");
    } catch (e) {
        console.error("Test failed:", e);
    }

    process.exit(0);
}

runTest().catch(console.error);
