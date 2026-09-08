import { WebR } from 'webr';

async function test() {
    const webr = new WebR();
    await webr.init();
    try {
        await webr.evalR(`webr::install("quadprog", repos = "https://ncskit.org/webr_repo_v3")`);
        console.log("Success local!");
    } catch (e) {
        console.error("Local failed:", e);
    }
    process.exit(0);
}
test();
