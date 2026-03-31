import { WebR } from 'webr';

async function main() {
    const webR = new WebR();
    await webR.init();
    
    console.log("Setting repos...");
    await webR.evalR('options(repos = c(R_WASM = "https://repo.r-wasm.org/", CRAN = "https://cran.r-universe.dev/"))');
    
    try {
        console.log("Trying to install quadprog using R's install.packages...");
        await webR.evalR(`webr::install("quadprog")`);
        console.log("webr::install success.");
    } catch (e) {
        console.error("webr::install failed:", e.message);
    }
    
    try {
        console.log("Trying to install quadprog using JS API...");
        // Pass multiple repos if possible, but the SDK docs usually say one URL.
        // Let's see if relying on the R options works when calling install.packages explicitly
        await webR.evalR(`install.packages("quadprog")`);
        console.log("install.packages success.");
    } catch (e) {
        console.error("install.packages failed:", e.message);
    }
    
    webR.destroy();
}

main().catch(console.error);
