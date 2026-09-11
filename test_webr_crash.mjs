import { WebR } from 'webr';

async function run() {
    const baseUrl = 'file:///' + process.cwd().replace(/\\/g, '/') + '/node_modules/webr/dist/';
    const webR = new WebR({ baseUrl });
    await webR.init();
    await webR.evalR('cor_mat <- matrix(c(1,1,1,1), 2, 2)');
    try {
        await webR.evalR('solve(cor_mat)');
        console.log('solve worked');
    } catch(e) { 
        console.log('solve threw R error:', e.message); 
    }
    process.exit(0);
}
run().catch(console.error);
