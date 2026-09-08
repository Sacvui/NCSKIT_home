const { WebR } = require('webr');
(async () => {
    const webr = new WebR();
    await webr.init();
    try {
        await webr.evalRVoid(`
            assignInNamespace("parSapply", function(cl, X, FUN, ...) sapply(X, FUN, ...), ns="parallel")
        `);
        console.log("SUCCESS");
    } catch (e) {
        console.log("ERROR", e.message);
    }
    process.exit(0);
})();
