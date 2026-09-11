const { WebR } = require('webr');

async function runTest() {
    console.log("Initializing WebR...");
    const webR = new WebR();
    await webR.init();
    console.log("WebR initialized.");

    // Create a bad dataset (two identical columns)
    const badData = [
        { v1: 1, v2: 1, v3: 3 },
        { v1: 2, v2: 2, v3: 4 },
        { v1: 3, v2: 3, v3: 5 },
        { v1: 4, v2: 4, v3: 2 },
        { v1: 5, v2: 5, v3: 1 },
    ];

    console.log("Binding data...");
    await webR.objs.globalEnv.bind('raw_data', badData);

    const rCode = `
    df <- as.data.frame(raw_data)
    
    # Validation: Check for identical columns
    if (any(duplicated(as.list(df)))) {
        stop("Lỗi: Dữ liệu chứa các biến giống hệt nhau (đa cộng tuyến hoàn hảo). Vui lòng loại bỏ các cột trùng lặp.")
    }
    
    cor_mat <- cor(df, use = "pairwise.complete.obs")
    if (any(is.na(cor_mat))) { 
        stop("Lỗi: Dữ liệu có giá trị khuyết (NA) hoặc biến không đổi (phương sai = 0).") 
    }
    
    list(success = TRUE)
    `;

    console.log("Evaluating R code...");
    try {
        const result = await webR.evalR(rCode);
        const jsResult = await result.toJs();
        console.log("Result:", jsResult);
    } catch (e) {
        console.error("Caught expected error gracefully from R:", e.message);
    }

    console.log("Checking package loading mechanism...");
    const installCode = `
    if (!require("psych", quietly = TRUE)) {
        webr::install("psych")
        library(psych)
    }
    TRUE
    `;
    try {
        const pkgResult = await webR.evalR(installCode);
        const isLoaded = await pkgResult.toJs();
        console.log("psych package loaded successfully:", isLoaded.values[0]);
    } catch (e) {
        console.error("Package loading failed:", e);
    }

    process.exit(0);
}

runTest().catch(console.error);
