const { WebR } = require('webr');

async function testSeminr() {
    const webR = new WebR();
    await webR.init();
    
    console.log("WebR initialized. Installing seminr...");
    await webR.evalR(`
        options(repos = c(CRAN = "https://repo.r-wasm.org/"))
        options(pkgType = "binary")
        install.packages("seminr")
        library(seminr)
    `);
    
    console.log("seminr installed. Finding MGA functions...");
    const res = await webR.evalR(`
        ls("package:seminr")
    `);
    const funcs = await res.toJs();
    console.log("Functions in seminr:", funcs.values.filter(f => f.toLowerCase().includes('mga') || f.toLowerCase().includes('group') || f.toLowerCase().includes('pls')));
    
    webR.destroy();
}

testSeminr().catch(console.error);
