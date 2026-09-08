const { WebR } = require('webr');
(async () => {
    const webr = new WebR();
    await webr.init();
    await webr.evalRVoid('webr::install("seminr")');
    await webr.evalRVoid('library(seminr)');
    const res = await webr.evalR('paste(deparse(bootstrap_model), collapse="\\n")');
    console.log(await res.toString());
    process.exit(0);
})();
