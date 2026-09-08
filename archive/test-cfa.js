import { WebR } from 'webr';

async function runTest() {
    console.log("Initializing WebR...");
    const webR = new WebR();
    await webR.init();
    console.log("WebR initialized.");

    // 1. Mock quadprog
    console.log("Mocking quadprog...");
    await webR.evalR(`
        ns <- new.env(parent = emptyenv())
        ns$solve.QP <- function(...) stop("quadprog is stubbed for WebR")
        ns$.__NAMESPACE__. <- new.env(parent = emptyenv())
        ns$.__NAMESPACE__.$spec <- c(name="quadprog", version="1.5.8")
        base::assign("quadprog", ns, envir = base::.loadedNamespaces)
    `);

    // 2. Install lavaan if not exists (using r-universe CDN)
    console.log("Checking lavaan...");
    await webR.evalR(`
        if (!require("lavaan", character.only = TRUE, quietly = TRUE)) {
            options(repos = c(CRAN = "https://repo.r-wasm.org", "https://sem-in-r.r-universe.dev"))
            webr::install("lavaan")
            library("lavaan")
        }
    `);

    console.log("lavaan loaded successfully!");

    // 3. Run a simple CFA
    console.log("Running CFA...");
    const rCode = `
        # Use HolzingerSwineford1939 data
        HS.model <- ' visual  =~ x1 + x2 + x3
                      textual =~ x4 + x5 + x6
                      speed   =~ x7 + x8 + x9 '
        
        fit <- cfa(HS.model, data=HolzingerSwineford1939)
        summary(fit, fit.measures=TRUE)
        
        # Extract CFI
        fitMeasures(fit, "cfi")
    `;

    const res = await webR.evalR(rCode);
    const resultArr = await res.toArray();
    console.log("CFA result (CFI):", resultArr);

    webR.close();
    console.log("Test finished!");
}

runTest().catch(console.error);
