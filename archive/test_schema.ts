import { SemResultSchema } from './lib/webr/schemas';
const testData = {
    path_coefficients: {},
    r_squared: {},
    f_squared: {},
    outer_loadings: {},
    total_effects: {},
    htmt: {},
    fornell_larcker: {},
    validity: { cronbach: {}, rho_a: {}, rho_c: {}, composite_reliability: {}, ave: {} },
    vif: {
        vif_values: { "Item1": 1.5, "Item2": 2.1 },
        multicollinearity: "None"
    },
    bootstrapping: {
        boot_paths: { "Original Est.": { "Path1": 0.5 }, "Boot Mean": { "Path1": 0.51 } },
        boot_loadings: {},
        n_bootstrap: 5000
    },
    rCode: ""
};

try {
    const res = SemResultSchema.parse(testData);
    console.log("Parse success:", JSON.stringify(res, null, 2));
} catch (e) {
    console.error("Parse failed:", e);
}
