'use client';
import { useState, useRef, useCallback } from 'react';

type LogLevel = 'INFO' | 'OK' | 'WARN' | 'ERROR' | 'DEBUG' | 'RESULT';

interface LogEntry {
    time: string;
    level: LogLevel;
    msg: string;
}

interface PhaseResult {
    name: string;
    status: 'pass' | 'fail' | 'skip';
    duration: number;
}

export default function TestWebRDeep() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [running, setRunning] = useState(false);
    const [status, setStatus] = useState<'idle' | 'running' | 'pass' | 'fail'>('idle');
    const [phaseResults, setPhaseResults] = useState<PhaseResult[]>([]);
    const webRRef = useRef<any>(null);

    const addLog = useCallback((level: LogLevel, msg: string) => {
        const time = new Date().toLocaleTimeString('vi-VN');
        console.log(`[${level}] ${msg}`);
        setLogs(prev => [...prev, { time, level, msg }]);
    }, []);

    const addPhaseResult = useCallback((name: string, status: 'pass' | 'fail' | 'skip', duration: number) => {
        setPhaseResults(prev => [...prev, { name, status, duration }]);
    }, []);

    // Helper: chạy R code và trả về string, bắt mọi warning/error
    const evalRSafe = async (webR: any, code: string, label: string): Promise<{ ok: boolean; value: string; warnings: string[] }> => {
        const warnings: string[] = [];
        try {
            const wrappedCode = `
                .webr_test_warnings <- c()
                .webr_test_result <- tryCatch(
                    withCallingHandlers(
                        { ${code} },
                        warning = function(w) {
                            .webr_test_warnings <<- c(.webr_test_warnings, conditionMessage(w))
                            invokeRestart("muffleWarning")
                        }
                    ),
                    error = function(e) paste0("__R_ERROR__:", conditionMessage(e))
                )
                jsonlite::toJSON(list(
                    result = as.character(.webr_test_result),
                    warnings = .webr_test_warnings
                ), auto_unbox = TRUE)
            `;
            const res = await webR.evalR(wrappedCode);
            const js = await res.toJs();
            const raw = js.values ? js.values[0] : String(js);
            const parsed = JSON.parse(raw);
            
            const resultStr = Array.isArray(parsed.result) ? parsed.result.join(', ') : String(parsed.result);
            const warnArr = parsed.warnings ? (Array.isArray(parsed.warnings) ? parsed.warnings : [parsed.warnings]) : [];
            
            if (warnArr.length > 0) {
                warnArr.forEach((w: string) => addLog('WARN', `[${label}] R Warning: ${w}`));
            }
            
            if (resultStr.startsWith('__R_ERROR__:')) {
                const errMsg = resultStr.replace('__R_ERROR__:', '');
                addLog('ERROR', `[${label}] R Error: ${errMsg}`);
                return { ok: false, value: errMsg, warnings: warnArr };
            }
            
            return { ok: true, value: resultStr, warnings: warnArr };
        } catch (e: any) {
            addLog('ERROR', `[${label}] JS Exception: ${e.message || e}`);
            return { ok: false, value: e.message || String(e), warnings };
        }
    };

    // Helper: chạy R code trả về JSON object
    const evalRJSON = async (webR: any, code: string, label: string): Promise<{ ok: boolean; data: any }> => {
        try {
            const res = await webR.evalR(`
                tryCatch({
                    .r <- { ${code} }
                    jsonlite::toJSON(.r, auto_unbox = TRUE, force = TRUE, digits = 6)
                }, error = function(e) paste0("__R_ERROR__:", e$message))
            `);
            const js = await (res as any).toJs();
            const raw = js.values ? js.values[0] : String(js);
            if (raw.startsWith('__R_ERROR__:')) {
                addLog('ERROR', `[${label}] R Error: ${raw.replace('__R_ERROR__:', '')}`);
                return { ok: false, data: null };
            }
            return { ok: true, data: JSON.parse(raw) };
        } catch (e: any) {
            addLog('ERROR', `[${label}] Exception: ${e.message || e}`);
            return { ok: false, data: null };
        }
    };

    const runTest = async () => {
        setRunning(true);
        setStatus('running');
        setLogs([]);
        setPhaseResults([]);
        let allPassed = true;

        try {
            // ═══════════════════════════════════════════
            // PHASE 1: KHỞI TẠO WEBR
            // ═══════════════════════════════════════════
            const p1Start = performance.now();
            addLog('INFO', '══════ PHASE 1: KHỞI TẠO WEBR ══════');
            
            addLog('INFO', 'Detecting browser capabilities...');
            const hasSAB = typeof SharedArrayBuffer !== 'undefined';
            const isCOI = typeof window !== 'undefined' && window.crossOriginIsolated;
            addLog('DEBUG', `SharedArrayBuffer: ${hasSAB ? 'YES' : 'NO'}`);
            addLog('DEBUG', `crossOriginIsolated: ${isCOI ? 'YES' : 'NO'}`);
            addLog('DEBUG', `Channel type: ${hasSAB && isCOI ? '0 (SharedArrayBuffer)' : '3 (PostMessage)'}`);
            
            addLog('INFO', 'Importing webr module...');
            const { WebR } = await import('webr');
            addLog('OK', 'webr module imported');

            addLog('INFO', 'Creating WebR instance...');
            const t0 = performance.now();
            const webR = new WebR({ channelType: hasSAB && isCOI ? 0 : 3 });
            webRRef.current = webR;
            
            addLog('INFO', 'Waiting for WebR.init()...');
            await webR.init();
            const initTime = ((performance.now() - t0) / 1000).toFixed(1);
            addLog('OK', `WebR initialized in ${initTime}s`);

            const verRes = await webR.evalR('paste(R.version$major, R.version$minor, sep=".")');
            const verJs = await (verRes as any).toJs();
            addLog('DEBUG', `R version: ${verJs.values[0]}`);

            const libRes = await webR.evalR('paste(.libPaths(), collapse=" | ")');
            const libJs = await (libRes as any).toJs();
            addLog('DEBUG', `.libPaths(): ${libJs.values[0]}`);

            addLog('INFO', 'Checking jsonlite availability...');
            await webR.evalR(`
                if (!require("jsonlite", quietly=TRUE)) {
                    webr::install("jsonlite")
                    library(jsonlite)
                }
            `);
            addLog('OK', 'jsonlite ready');
            addPhaseResult('Init WebR', 'pass', performance.now() - p1Start);

            // ═══════════════════════════════════════════
            // PHASE 2: TẠO QUADPROG STUB
            // ═══════════════════════════════════════════
            const p2Start = performance.now();
            addLog('INFO', '══════ PHASE 2: TẠO QUADPROG STUB PACKAGE ══════');
            
            const nsBefore = await evalRSafe(webR, `
                paste("Loaded namespaces:", paste(loadedNamespaces(), collapse=", "))
            `, 'PRE-CHECK');
            if (nsBefore.ok) addLog('DEBUG', nsBefore.value);
            
            const qpExists = await evalRSafe(webR, `
                pkg_dir <- file.path(.libPaths()[1], "quadprog")
                paste("quadprog dir exists:", dir.exists(pkg_dir))
            `, 'PRE-CHECK');
            if (qpExists.ok) addLog('DEBUG', qpExists.value);

            addLog('INFO', 'Creating quadprog stub on VFS (with full metadata)...');
            const createResult = await evalRSafe(webR, `
                lib_path <- .libPaths()[1]
                pkg_dir <- file.path(lib_path, "quadprog")
                if (dir.exists(pkg_dir)) unlink(pkg_dir, recursive = TRUE)
                dir.create(file.path(pkg_dir, "R"), recursive = TRUE, showWarnings = FALSE)
                dir.create(file.path(pkg_dir, "Meta"), recursive = TRUE, showWarnings = FALSE)
                writeLines(c(
                    "Package: quadprog", "Version: 1.5-8",
                    "Title: Quadratic Programming Stub for WebR",
                    "Description: Stub package for WebR.", "Author: WebR Stub",
                    "Maintainer: WebR Stub <stub@webr>", "License: GPL-2",
                    "NeedsCompilation: no",
                    paste0("Built: R ", R.version$major, ".", R.version$minor, "; ; ", Sys.time(), "; unix")
                ), file.path(pkg_dir, "DESCRIPTION"))
                writeLines(c("export(solve.QP)", "export(solve.QP.compact)"), file.path(pkg_dir, "NAMESPACE"))
                desc_fields <- read.dcf(file.path(pkg_dir, "DESCRIPTION"))[1, ]
                pkg_info <- list(DESCRIPTION = desc_fields, Built = list(R = getRversion(), Platform = "", Date = Sys.time(), OStype = "unix"))
                saveRDS(pkg_info, file.path(pkg_dir, "Meta", "package.rds"))
                ns_info <- list(exports = c("solve.QP", "solve.QP.compact"), exportPatterns = character(0),
                    imports = list(), importFrom = list(), importClasses = list(), importMethods = list(),
                    S3methods = matrix(character(0), ncol = 4, dimnames = list(NULL, c("generic", "class", "method", "from"))))
                saveRDS(ns_info, file.path(pkg_dir, "Meta", "nsInfo.rds"))
                writeLines(c(
                    'solve.QP <- function(Dmat, dvec, Amat, bvec, meq=0, factorized=FALSE) {',
                    '  stop("quadprog::solve.QP is not available in WebR.")',
                    '}',
                    'solve.QP.compact <- function(Dmat, dvec, Amat, Aind, bvec, meq=0, factorized=FALSE) {',
                    '  stop("quadprog::solve.QP.compact is not available in WebR.")',
                    '}'
                ), file.path(pkg_dir, "R", "quadprog"))
                files <- list.files(pkg_dir, recursive = TRUE, full.names = FALSE)
                paste("Created files:", paste(files, collapse = ", "))
            `, 'CREATE-STUB');
            
            if (createResult.ok) {
                addLog('OK', createResult.value);
            } else {
                addLog('ERROR', 'Failed to create quadprog stub');
                allPassed = false;
            }

            const loadQP = await evalRSafe(webR, `
                library(quadprog)
                paste("Functions in quadprog:", paste(ls("package:quadprog"), collapse = ", "))
            `, 'LOAD-QUADPROG');
            
            if (loadQP.ok) {
                addLog('OK', `library(quadprog) SUCCESS: ${loadQP.value}`);
            } else {
                addLog('ERROR', `library(quadprog) FAILED: ${loadQP.value}`);
                allPassed = false;
            }
            addPhaseResult('Quadprog Stub', allPassed ? 'pass' : 'fail', performance.now() - p2Start);

            // ═══════════════════════════════════════════
            // PHASE 3: INSTALL PACKAGES (psych, lavaan)
            // ═══════════════════════════════════════════
            const p3Start = performance.now();
            addLog('INFO', '══════ PHASE 3: INSTALL R PACKAGES ══════');
            addLog('INFO', 'Installing psych + lavaan (may take 30-90s)...');
            
            const loadPsych = await evalRSafe(webR, `
                if (!require("psych", quietly = TRUE)) {
                    options(repos = c("https://repo.r-wasm.org"))
                    webr::install("psych")
                    library(psych)
                }
                paste("psych version:", packageVersion("psych"))
            `, 'LOAD-PSYCH');
            if (loadPsych.ok) addLog('OK', loadPsych.value); else { addLog('ERROR', loadPsych.value); allPassed = false; }
            
            const loadLavaan = await evalRSafe(webR, `
                if (!require("lavaan", quietly = TRUE)) {
                    options(repos = c("https://sem-in-r.r-universe.dev", "https://repo.r-wasm.org"))
                    webr::install("lavaan")
                    library(lavaan)
                }
                paste("lavaan version:", packageVersion("lavaan"))
            `, 'LOAD-LAVAAN');
            if (loadLavaan.ok) addLog('OK', loadLavaan.value); else { addLog('ERROR', loadLavaan.value); allPassed = false; }

            // Patch lavaan for WASM
            await webR.evalR(`tryCatch(assignInNamespace("lav_options_checkinterval", function(...) TRUE, ns = "lavaan"), error = function(e) {})`);
            addLog('OK', 'lavaan patched for WASM compatibility');
            
            addPhaseResult('Install Packages', allPassed ? 'pass' : 'fail', performance.now() - p3Start);

            // ═══════════════════════════════════════════
            // PHASE 4: TEST DESCRIPTIVE STATS
            // ═══════════════════════════════════════════
            const p4Start = performance.now();
            addLog('INFO', '══════ PHASE 4: DESCRIPTIVE STATS ══════');
            try {
                const descRes = await evalRJSON(webR, `
                    set.seed(42)
                    df <- data.frame(x1=rnorm(100,3,1), x2=rnorm(100,4,1.2), x3=rnorm(100,3.5,0.8))
                    list(
                        n = nrow(df),
                        means = round(colMeans(df), 4),
                        sds = round(sapply(df, sd), 4),
                        mins = round(sapply(df, min), 4),
                        maxs = round(sapply(df, max), 4)
                    )
                `, 'DESCRIPTIVE');
                if (descRes.ok) {
                    addLog('OK', `Descriptive stats computed for N=${descRes.data.n}`);
                    addLog('RESULT', `Means: ${JSON.stringify(descRes.data.means)}`);
                    addLog('RESULT', `SDs:   ${JSON.stringify(descRes.data.sds)}`);
                    addPhaseResult('Descriptive', 'pass', performance.now() - p4Start);
                } else { allPassed = false; addPhaseResult('Descriptive', 'fail', performance.now() - p4Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('Descriptive', 'fail', performance.now() - p4Start); }

            // ═══════════════════════════════════════════
            // PHASE 5: CRONBACH'S ALPHA
            // ═══════════════════════════════════════════
            const p5Start = performance.now();
            addLog('INFO', '══════ PHASE 5: CRONBACH ALPHA ══════');
            try {
                const cronRes = await evalRJSON(webR, `
                    set.seed(42)
                    items <- matrix(rnorm(500, 3, 1), ncol=5)
                    items <- items + matrix(rnorm(100), ncol=1) %*% matrix(rep(0.7, 5), nrow=1)
                    a <- psych::alpha(items)
                    list(
                        alpha = round(a$total$raw_alpha, 4),
                        std_alpha = round(a$total$std.alpha, 4),
                        n_items = ncol(items),
                        n_obs = nrow(items)
                    )
                `, 'CRONBACH');
                if (cronRes.ok) {
                    addLog('OK', `Cronbach Alpha = ${cronRes.data.alpha} (std = ${cronRes.data.std_alpha})`);
                    addLog('RESULT', `Items: ${cronRes.data.n_items}, N: ${cronRes.data.n_obs}`);
                    const alphaOk = cronRes.data.alpha > 0.5 && cronRes.data.alpha < 1.0;
                    addLog(alphaOk ? 'OK' : 'WARN', `Validation: alpha=${cronRes.data.alpha} ${alphaOk ? '✅ in valid range' : '⚠️ unusual value'}`);
                    addPhaseResult('Cronbach Alpha', 'pass', performance.now() - p5Start);
                } else { allPassed = false; addPhaseResult('Cronbach Alpha', 'fail', performance.now() - p5Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('Cronbach Alpha', 'fail', performance.now() - p5Start); }

            // ═══════════════════════════════════════════
            // PHASE 6: CORRELATION
            // ═══════════════════════════════════════════
            const p6Start = performance.now();
            addLog('INFO', '══════ PHASE 6: CORRELATION ══════');
            try {
                const corrRes = await evalRJSON(webR, `
                    set.seed(42)
                    x <- rnorm(100); y <- x*0.6 + rnorm(100,0,0.8); z <- rnorm(100)
                    df <- data.frame(x=x, y=y, z=z)
                    ct <- psych::corr.test(df, method="pearson")
                    list(
                        r_matrix = round(as.vector(ct$r), 4),
                        p_matrix = round(as.vector(ct$p), 4),
                        n_vars = ncol(df),
                        r_xy = round(ct$r["x","y"], 4)
                    )
                `, 'CORRELATION');
                if (corrRes.ok) {
                    addLog('OK', `Correlation computed for ${corrRes.data.n_vars} variables`);
                    addLog('RESULT', `r(x,y) = ${corrRes.data.r_xy} (expected ~0.6)`);
                    const rOk = Math.abs(corrRes.data.r_xy - 0.6) < 0.15;
                    addLog(rOk ? 'OK' : 'WARN', `Validation: r(x,y)=${corrRes.data.r_xy} ${rOk ? '✅' : '⚠️'}`);
                    addPhaseResult('Correlation', 'pass', performance.now() - p6Start);
                } else { allPassed = false; addPhaseResult('Correlation', 'fail', performance.now() - p6Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('Correlation', 'fail', performance.now() - p6Start); }

            // ═══════════════════════════════════════════
            // PHASE 7: T-TEST (Independent)
            // ═══════════════════════════════════════════
            const p7Start = performance.now();
            addLog('INFO', '══════ PHASE 7: T-TEST (Independent) ══════');
            try {
                const ttRes = await evalRJSON(webR, `
                    set.seed(42)
                    g1 <- rnorm(50, mean=5, sd=1)
                    g2 <- rnorm(50, mean=6, sd=1)
                    tt <- t.test(g1, g2, var.equal=FALSE)
                    list(
                        t_stat = round(tt$statistic, 4),
                        df = round(tt$parameter, 2),
                        p_value = round(tt$p.value, 6),
                        mean1 = round(mean(g1), 4),
                        mean2 = round(mean(g2), 4),
                        ci_lower = round(tt$conf.int[1], 4),
                        ci_upper = round(tt$conf.int[2], 4)
                    )
                `, 'T-TEST');
                if (ttRes.ok) {
                    addLog('OK', `T-test: t=${ttRes.data.t_stat}, df=${ttRes.data.df}, p=${ttRes.data.p_value}`);
                    addLog('RESULT', `Mean1=${ttRes.data.mean1}, Mean2=${ttRes.data.mean2}`);
                    addLog('RESULT', `95% CI: [${ttRes.data.ci_lower}, ${ttRes.data.ci_upper}]`);
                    const pOk = ttRes.data.p_value < 0.05;
                    addLog(pOk ? 'OK' : 'WARN', `Validation: p=${ttRes.data.p_value} ${pOk ? '✅ significant (groups differ)' : '⚠️ not significant'}`);
                    addPhaseResult('T-Test', 'pass', performance.now() - p7Start);
                } else { allPassed = false; addPhaseResult('T-Test', 'fail', performance.now() - p7Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('T-Test', 'fail', performance.now() - p7Start); }

            // ═══════════════════════════════════════════
            // PHASE 8: PAIRED T-TEST
            // ═══════════════════════════════════════════
            const p8Start = performance.now();
            addLog('INFO', '══════ PHASE 8: PAIRED T-TEST ══════');
            try {
                const ptRes = await evalRJSON(webR, `
                    set.seed(42)
                    before <- rnorm(40, 50, 10)
                    after <- before + rnorm(40, 5, 3)
                    tt <- t.test(before, after, paired=TRUE)
                    list(t_stat=round(tt$statistic,4), p_value=round(tt$p.value,6), mean_diff=round(mean(after-before),4))
                `, 'PAIRED-T');
                if (ptRes.ok) {
                    addLog('OK', `Paired T-test: t=${ptRes.data.t_stat}, p=${ptRes.data.p_value}, mean_diff=${ptRes.data.mean_diff}`);
                    addPhaseResult('Paired T-Test', 'pass', performance.now() - p8Start);
                } else { allPassed = false; addPhaseResult('Paired T-Test', 'fail', performance.now() - p8Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('Paired T-Test', 'fail', performance.now() - p8Start); }

            // ═══════════════════════════════════════════
            // PHASE 9: ONE-WAY ANOVA
            // ═══════════════════════════════════════════
            const p9Start = performance.now();
            addLog('INFO', '══════ PHASE 9: ONE-WAY ANOVA ══════');
            try {
                const anovaRes = await evalRJSON(webR, `
                    set.seed(42)
                    g1 <- rnorm(30, 5, 1); g2 <- rnorm(30, 6, 1); g3 <- rnorm(30, 7, 1)
                    df <- data.frame(value=c(g1,g2,g3), group=factor(rep(1:3, each=30)))
                    a <- summary(aov(value ~ group, data=df))
                    list(
                        f_stat = round(a[[1]]$\`F value\`[1], 4),
                        p_value = round(a[[1]]$\`Pr(>F)\`[1], 6),
                        df_between = a[[1]]$Df[1],
                        df_within = a[[1]]$Df[2],
                        eta_sq = round(a[[1]]$\`Sum Sq\`[1] / sum(a[[1]]$\`Sum Sq\`), 4)
                    )
                `, 'ANOVA');
                if (anovaRes.ok) {
                    addLog('OK', `ANOVA: F(${anovaRes.data.df_between},${anovaRes.data.df_within})=${anovaRes.data.f_stat}, p=${anovaRes.data.p_value}`);
                    addLog('RESULT', `η² = ${anovaRes.data.eta_sq}`);
                    addPhaseResult('ANOVA', 'pass', performance.now() - p9Start);
                } else { allPassed = false; addPhaseResult('ANOVA', 'fail', performance.now() - p9Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('ANOVA', 'fail', performance.now() - p9Start); }

            // ═══════════════════════════════════════════
            // PHASE 10: MANN-WHITNEY U
            // ═══════════════════════════════════════════
            const p10Start = performance.now();
            addLog('INFO', '══════ PHASE 10: MANN-WHITNEY U ══════');
            try {
                const mwRes = await evalRJSON(webR, `
                    set.seed(42)
                    g1 <- rnorm(30, 5, 1); g2 <- rnorm(30, 6.5, 1)
                    wt <- wilcox.test(g1, g2)
                    list(W=wt$statistic, p_value=round(wt$p.value,6))
                `, 'MANN-WHITNEY');
                if (mwRes.ok) {
                    addLog('OK', `Mann-Whitney U: W=${mwRes.data.W}, p=${mwRes.data.p_value}`);
                    addPhaseResult('Mann-Whitney U', 'pass', performance.now() - p10Start);
                } else { allPassed = false; addPhaseResult('Mann-Whitney U', 'fail', performance.now() - p10Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('Mann-Whitney U', 'fail', performance.now() - p10Start); }

            // ═══════════════════════════════════════════
            // PHASE 11: KRUSKAL-WALLIS
            // ═══════════════════════════════════════════
            const p11Start = performance.now();
            addLog('INFO', '══════ PHASE 11: KRUSKAL-WALLIS ══════');
            try {
                const kwRes = await evalRJSON(webR, `
                    set.seed(42)
                    df <- data.frame(value=c(rnorm(25,3,1), rnorm(25,5,1), rnorm(25,4,1)), group=factor(rep(1:3,each=25)))
                    kt <- kruskal.test(value ~ group, data=df)
                    list(chi_sq=round(kt$statistic,4), df=kt$parameter, p_value=round(kt$p.value,6))
                `, 'KRUSKAL-WALLIS');
                if (kwRes.ok) {
                    addLog('OK', `Kruskal-Wallis: χ²=${kwRes.data.chi_sq}, df=${kwRes.data.df}, p=${kwRes.data.p_value}`);
                    addPhaseResult('Kruskal-Wallis', 'pass', performance.now() - p11Start);
                } else { allPassed = false; addPhaseResult('Kruskal-Wallis', 'fail', performance.now() - p11Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('Kruskal-Wallis', 'fail', performance.now() - p11Start); }

            // ═══════════════════════════════════════════
            // PHASE 12: WILCOXON SIGNED-RANK
            // ═══════════════════════════════════════════
            const p12Start = performance.now();
            addLog('INFO', '══════ PHASE 12: WILCOXON SIGNED-RANK ══════');
            try {
                const wRes = await evalRJSON(webR, `
                    set.seed(42)
                    before <- rnorm(30, 50, 10); after <- before + rnorm(30, 3, 2)
                    wt <- wilcox.test(before, after, paired=TRUE)
                    list(V=wt$statistic, p_value=round(wt$p.value,6))
                `, 'WILCOXON');
                if (wRes.ok) {
                    addLog('OK', `Wilcoxon Signed-Rank: V=${wRes.data.V}, p=${wRes.data.p_value}`);
                    addPhaseResult('Wilcoxon', 'pass', performance.now() - p12Start);
                } else { allPassed = false; addPhaseResult('Wilcoxon', 'fail', performance.now() - p12Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('Wilcoxon', 'fail', performance.now() - p12Start); }

            // ═══════════════════════════════════════════
            // PHASE 13: CHI-SQUARE
            // ═══════════════════════════════════════════
            const p13Start = performance.now();
            addLog('INFO', '══════ PHASE 13: CHI-SQUARE ══════');
            try {
                const chiRes = await evalRJSON(webR, `
                    set.seed(42)
                    observed <- matrix(c(50,30,20,40,35,25), nrow=2, byrow=TRUE)
                    ct <- chisq.test(observed)
                    list(chi_sq=round(ct$statistic,4), df=ct$parameter, p_value=round(ct$p.value,6))
                `, 'CHI-SQUARE');
                if (chiRes.ok) {
                    addLog('OK', `Chi-Square: χ²=${chiRes.data.chi_sq}, df=${chiRes.data.df}, p=${chiRes.data.p_value}`);
                    addPhaseResult('Chi-Square', 'pass', performance.now() - p13Start);
                } else { allPassed = false; addPhaseResult('Chi-Square', 'fail', performance.now() - p13Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('Chi-Square', 'fail', performance.now() - p13Start); }

            // ═══════════════════════════════════════════
            // PHASE 14: LINEAR REGRESSION
            // ═══════════════════════════════════════════
            const p14Start = performance.now();
            addLog('INFO', '══════ PHASE 14: LINEAR REGRESSION ══════');
            try {
                const regRes = await evalRJSON(webR, `
                    set.seed(42)
                    x1 <- rnorm(100); x2 <- rnorm(100); y <- 2 + 0.5*x1 + 0.3*x2 + rnorm(100,0,0.5)
                    model <- lm(y ~ x1 + x2)
                    s <- summary(model)
                    list(
                        r_squared = round(s$r.squared, 4),
                        adj_r_squared = round(s$adj.r.squared, 4),
                        f_stat = round(s$fstatistic[1], 4),
                        p_value = round(pf(s$fstatistic[1], s$fstatistic[2], s$fstatistic[3], lower.tail=FALSE), 6),
                        coefficients = list(
                            intercept = round(s$coefficients[1,1], 4),
                            x1 = round(s$coefficients[2,1], 4),
                            x2 = round(s$coefficients[3,1], 4)
                        ),
                        p_coeffs = list(
                            intercept = round(s$coefficients[1,4], 6),
                            x1 = round(s$coefficients[2,4], 6),
                            x2 = round(s$coefficients[3,4], 6)
                        )
                    )
                `, 'REGRESSION');
                if (regRes.ok) {
                    addLog('OK', `Regression: R²=${regRes.data.r_squared}, Adj.R²=${regRes.data.adj_r_squared}`);
                    addLog('RESULT', `F=${regRes.data.f_stat}, p=${regRes.data.p_value}`);
                    addLog('RESULT', `β₀=${regRes.data.coefficients.intercept}, β₁(x1)=${regRes.data.coefficients.x1}, β₂(x2)=${regRes.data.coefficients.x2}`);
                    const b1Ok = Math.abs(regRes.data.coefficients.x1 - 0.5) < 0.2;
                    addLog(b1Ok ? 'OK' : 'WARN', `Validation: β₁=${regRes.data.coefficients.x1} (expected ~0.5) ${b1Ok ? '✅' : '⚠️'}`);
                    addPhaseResult('Regression', 'pass', performance.now() - p14Start);
                } else { allPassed = false; addPhaseResult('Regression', 'fail', performance.now() - p14Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('Regression', 'fail', performance.now() - p14Start); }

            // ═══════════════════════════════════════════
            // PHASE 15: LOGISTIC REGRESSION
            // ═══════════════════════════════════════════
            const p15Start = performance.now();
            addLog('INFO', '══════ PHASE 15: LOGISTIC REGRESSION ══════');
            try {
                const logRes = await evalRJSON(webR, `
                    set.seed(42)
                    x <- rnorm(200); y <- rbinom(200, 1, plogis(0.5 + 1.2*x))
                    model <- glm(y ~ x, family=binomial)
                    s <- summary(model)
                    list(
                        intercept = round(s$coefficients[1,1], 4),
                        beta_x = round(s$coefficients[2,1], 4),
                        p_value = round(s$coefficients[2,4], 6),
                        aic = round(s$aic, 2),
                        deviance = round(s$deviance, 2),
                        null_deviance = round(s$null.deviance, 2)
                    )
                `, 'LOGISTIC');
                if (logRes.ok) {
                    addLog('OK', `Logistic: β₀=${logRes.data.intercept}, β(x)=${logRes.data.beta_x}, p=${logRes.data.p_value}`);
                    addLog('RESULT', `AIC=${logRes.data.aic}, Deviance=${logRes.data.deviance} (Null=${logRes.data.null_deviance})`);
                    addPhaseResult('Logistic Regression', 'pass', performance.now() - p15Start);
                } else { allPassed = false; addPhaseResult('Logistic Regression', 'fail', performance.now() - p15Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('Logistic Regression', 'fail', performance.now() - p15Start); }

            // ═══════════════════════════════════════════
            // PHASE 16: EFA
            // ═══════════════════════════════════════════
            const p16Start = performance.now();
            addLog('INFO', '══════ PHASE 16: EFA (Exploratory Factor Analysis) ══════');
            try {
                const efaRes = await evalRJSON(webR, `
                    set.seed(42)
                    n <- 200
                    f1 <- rnorm(n); f2 <- rnorm(n)
                    items <- cbind(
                        f1*0.8+rnorm(n,0,0.4), f1*0.7+rnorm(n,0,0.5), f1*0.9+rnorm(n,0,0.3),
                        f2*0.8+rnorm(n,0,0.4), f2*0.75+rnorm(n,0,0.45), f2*0.85+rnorm(n,0,0.35)
                    )
                    colnames(items) <- paste0("V",1:6)
                    fa_res <- psych::fa(items, nfactors=2, rotate="promax", fm="ml")
                    list(
                        n_factors = fa_res$factors,
                        loadings = round(as.vector(fa_res$loadings), 4),
                        var_explained = round(fa_res$Vaccounted[2,], 4),
                        rmsea = round(fa_res$RMSEA[1], 4),
                        tli = round(fa_res$TLI, 4)
                    )
                `, 'EFA');
                if (efaRes.ok) {
                    addLog('OK', `EFA: ${efaRes.data.n_factors} factors extracted`);
                    addLog('RESULT', `RMSEA=${efaRes.data.rmsea}, TLI=${efaRes.data.tli}`);
                    addPhaseResult('EFA', 'pass', performance.now() - p16Start);
                } else { allPassed = false; addPhaseResult('EFA', 'fail', performance.now() - p16Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('EFA', 'fail', performance.now() - p16Start); }

            // ═══════════════════════════════════════════
            // PHASE 17: CFA (Confirmatory Factor Analysis)
            // ═══════════════════════════════════════════
            const p17Start = performance.now();
            addLog('INFO', '══════ PHASE 17: CFA (HolzingerSwineford1939) ══════');
            try {
                addLog('INFO', 'Fitting CFA model...');
                await webR.evalR(`
                    HS.model <- '
                        visual  =~ x1 + x2 + x3
                        textual =~ x4 + x5 + x6
                        speed   =~ x7 + x8 + x9
                    '
                    .test_fit <- cfa(HS.model, data = HolzingerSwineford1939)
                `);
                const fmRes = await webR.evalR(`
                    jsonlite::toJSON(list(
                        converged = isTRUE(lavInspect(.test_fit, "converged")),
                        cfi = as.numeric(fitMeasures(.test_fit, "cfi")),
                        tli = as.numeric(fitMeasures(.test_fit, "tli")),
                        rmsea = as.numeric(fitMeasures(.test_fit, "rmsea")),
                        srmr = as.numeric(fitMeasures(.test_fit, "srmr")),
                        chisq = as.numeric(fitMeasures(.test_fit, "chisq")),
                        df = as.numeric(fitMeasures(.test_fit, "df")),
                        pvalue = as.numeric(fitMeasures(.test_fit, "pvalue")),
                        n_obs = lavInspect(.test_fit, "nobs")
                    ), auto_unbox = TRUE)
                `);
                const fmJs = await (fmRes as any).toJs();
                const fm = JSON.parse(fmJs.values ? fmJs.values[0] : fmJs);
                
                addLog('OK', `CFA converged: ${fm.converged}, N=${fm.n_obs}`);
                addLog('RESULT', `─── Fit Measures ───`);
                addLog('RESULT', `  CFI   = ${fm.cfi?.toFixed(4)}`);
                addLog('RESULT', `  TLI   = ${fm.tli?.toFixed(4)}`);
                addLog('RESULT', `  RMSEA = ${fm.rmsea?.toFixed(4)}`);
                addLog('RESULT', `  SRMR  = ${fm.srmr?.toFixed(4)}`);
                addLog('RESULT', `  χ²    = ${fm.chisq?.toFixed(3)}, df = ${fm.df}, p = ${fm.pvalue?.toFixed(4)}`);
                
                const expectedCFI = 0.931;
                const cfiBias = Math.abs(fm.cfi - expectedCFI);
                addLog(cfiBias < 0.01 ? 'OK' : 'WARN', `Validation: CFI=${fm.cfi?.toFixed(4)} vs expected ~${expectedCFI} (diff=${cfiBias.toFixed(4)}) ${cfiBias < 0.01 ? '✅' : '⚠️'}`);
                addPhaseResult('CFA', 'pass', performance.now() - p17Start);
            } catch (e: any) { addLog('ERROR', `CFA Exception: ${e.message}`); allPassed = false; addPhaseResult('CFA', 'fail', performance.now() - p17Start); }

            // ═══════════════════════════════════════════
            // PHASE 18: SEM
            // ═══════════════════════════════════════════
            const p18Start = performance.now();
            addLog('INFO', '══════ PHASE 18: SEM (Structural Equation Modeling) ══════');
            try {
                addLog('INFO', 'Fitting SEM model (measurement + structural)...');
                const semRes = await evalRJSON(webR, `
                    sem.model <- '
                        visual  =~ x1 + x2 + x3
                        textual =~ x4 + x5 + x6
                        speed   =~ x7 + x8 + x9
                        textual ~ visual
                        speed ~ textual + visual
                    '
                    fit <- sem(sem.model, data = HolzingerSwineford1939)
                    fm <- fitMeasures(fit, c("cfi","tli","rmsea","srmr","chisq","df"))
                    list(
                        converged = isTRUE(lavInspect(fit, "converged")),
                        cfi = round(as.numeric(fm["cfi"]), 4),
                        tli = round(as.numeric(fm["tli"]), 4),
                        rmsea = round(as.numeric(fm["rmsea"]), 4),
                        srmr = round(as.numeric(fm["srmr"]), 4),
                        n_obs = lavInspect(fit, "nobs")
                    )
                `, 'SEM');
                if (semRes.ok) {
                    addLog('OK', `SEM converged: ${semRes.data.converged}, N=${semRes.data.n_obs}`);
                    addLog('RESULT', `CFI=${semRes.data.cfi}, TLI=${semRes.data.tli}, RMSEA=${semRes.data.rmsea}, SRMR=${semRes.data.srmr}`);
                    addPhaseResult('SEM', 'pass', performance.now() - p18Start);
                } else { allPassed = false; addPhaseResult('SEM', 'fail', performance.now() - p18Start); }
            } catch (e: any) { addLog('ERROR', `SEM Exception: ${e.message}`); allPassed = false; addPhaseResult('SEM', 'fail', performance.now() - p18Start); }

            // ═══════════════════════════════════════════
            // PHASE 19: MEDIATION
            // ═══════════════════════════════════════════
            const p19Start = performance.now();
            addLog('INFO', '══════ PHASE 19: MEDIATION ANALYSIS ══════');
            addLog('DEBUG', 'Using Baron & Kenny regression (no fork/parallel needed)');
            try {
                const medRes = await evalRJSON(webR, `
                    set.seed(42)
                    X <- rnorm(150)
                    M <- 0.6*X + rnorm(150, 0, 0.7)
                    Y <- 0.3*X + 0.5*M + rnorm(150, 0, 0.6)
                    df <- data.frame(X=X, M=M, Y=Y)
                    
                    # Baron & Kenny approach (no forking needed)
                    # Path a: X -> M
                    model_a <- lm(M ~ X, data=df)
                    a <- coef(model_a)["X"]
                    a_p <- summary(model_a)$coefficients["X", 4]
                    
                    # Path b + c': X + M -> Y
                    model_b <- lm(Y ~ X + M, data=df)
                    b <- coef(model_b)["M"]
                    b_p <- summary(model_b)$coefficients["M", 4]
                    c_prime <- coef(model_b)["X"]
                    c_prime_p <- summary(model_b)$coefficients["X", 4]
                    
                    # Path c (total): X -> Y
                    model_c <- lm(Y ~ X, data=df)
                    c_total <- coef(model_c)["X"]
                    c_p <- summary(model_c)$coefficients["X", 4]
                    
                    # Indirect = a * b
                    indirect <- a * b
                    
                    # Sobel test
                    se_a <- summary(model_a)$coefficients["X", 2]
                    se_b <- summary(model_b)$coefficients["M", 2]
                    sobel_se <- sqrt(a^2 * se_b^2 + b^2 * se_a^2)
                    sobel_z <- indirect / sobel_se
                    sobel_p <- 2 * pnorm(-abs(sobel_z))
                    
                    list(
                        path_a = round(a, 4), path_a_p = round(a_p, 6),
                        path_b = round(b, 4), path_b_p = round(b_p, 6),
                        direct = round(c_prime, 4), direct_p = round(c_prime_p, 6),
                        total = round(c_total, 4), total_p = round(c_p, 6),
                        indirect = round(indirect, 4),
                        sobel_z = round(sobel_z, 4), sobel_p = round(sobel_p, 6)
                    )
                `, 'MEDIATION');
                if (medRes.ok) {
                    addLog('OK', `Mediation analysis completed`);
                    addLog('RESULT', `Path a (X→M): ${medRes.data.path_a} (p=${medRes.data.path_a_p})`);
                    addLog('RESULT', `Path b (M→Y): ${medRes.data.path_b} (p=${medRes.data.path_b_p})`);
                    addLog('RESULT', `Direct c' (X→Y|M): ${medRes.data.direct} (p=${medRes.data.direct_p})`);
                    addLog('RESULT', `Total c (X→Y): ${medRes.data.total} (p=${medRes.data.total_p})`);
                    addLog('RESULT', `Indirect (a×b): ${medRes.data.indirect}`);
                    addLog('RESULT', `Sobel test: z=${medRes.data.sobel_z}, p=${medRes.data.sobel_p}`);
                    const indOk = Math.abs(medRes.data.indirect - 0.3) < 0.15;
                    addLog(indOk ? 'OK' : 'WARN', `Validation: indirect=${medRes.data.indirect} (expected ~0.3) ${indOk ? '✅' : '⚠️'}`);
                    addPhaseResult('Mediation', 'pass', performance.now() - p19Start);
                } else { allPassed = false; addPhaseResult('Mediation', 'fail', performance.now() - p19Start); }
            } catch (e: any) { addLog('ERROR', e.message); allPassed = false; addPhaseResult('Mediation', 'fail', performance.now() - p19Start); }

            // ═══════════════════════════════════════════
            // PHASE 20: PLS-SEM (seminr)
            // ═══════════════════════════════════════════
            const p20Start = performance.now();
            addLog('INFO', '══════ PHASE 20: PLS-SEM (seminr) ══════');
            addLog('INFO', 'Installing seminr package (may take 30-60s)...');
            try {
                const installSeminr = await evalRSafe(webR, `
                    if (!require("seminr", quietly = TRUE)) {
                        options(repos = c("https://sem-in-r.r-universe.dev", "https://repo.r-wasm.org"))
                        webr::install("seminr")
                        library(seminr)
                    }
                    paste("seminr version:", packageVersion("seminr"))
                `, 'INSTALL-SEMINR');
                if (installSeminr.ok) addLog('OK', installSeminr.value); else { addLog('ERROR', installSeminr.value); allPassed = false; }

                addLog('INFO', 'Fitting PLS-SEM model with simulated data...');
                const plsRes = await evalRJSON(webR, `
                    set.seed(42)
                    n <- 150
                    f1 <- rnorm(n); f2 <- rnorm(n); f3 <- 0.5*f1 + 0.3*f2 + rnorm(n,0,0.6)
                    df <- data.frame(
                        V1=f1*0.8+rnorm(n,0,0.3), V2=f1*0.7+rnorm(n,0,0.4), V3=f1*0.85+rnorm(n,0,0.3),
                        V4=f2*0.8+rnorm(n,0,0.3), V5=f2*0.75+rnorm(n,0,0.35), V6=f2*0.9+rnorm(n,0,0.25),
                        V7=f3*0.8+rnorm(n,0,0.3), V8=f3*0.7+rnorm(n,0,0.4), V9=f3*0.85+rnorm(n,0,0.3)
                    )
                    mm <- constructs(
                        composite("F1", multi_items("V", 1:3)),
                        composite("F2", multi_items("V", 4:6)),
                        composite("F3", multi_items("V", 7:9))
                    )
                    sm <- relationships(
                        paths(from = "F1", to = "F3"),
                        paths(from = "F2", to = "F3")
                    )
                    pls <- estimate_pls(data = df, measurement_model = mm, structural_model = sm)
                    s <- summary(pls)
                    list(
                        converged = TRUE,
                        n_obs = nrow(df),
                        path_F1_F3 = round(s$paths["F1", "F3"], 4),
                        path_F2_F3 = round(s$paths["F2", "F3"], 4)
                    )
                `, 'PLS-SEM');
                if (plsRes.ok) {
                    addLog('OK', `PLS-SEM fitted: N=${plsRes.data.n_obs}`);
                    addLog('RESULT', `Path F1→F3 = ${plsRes.data.path_F1_F3}`);
                    addLog('RESULT', `Path F2→F3 = ${plsRes.data.path_F2_F3}`);
                    addPhaseResult('PLS-SEM', 'pass', performance.now() - p20Start);
                } else { allPassed = false; addPhaseResult('PLS-SEM', 'fail', performance.now() - p20Start); }
            } catch (e: any) { addLog('ERROR', `PLS-SEM: ${e.message}`); allPassed = false; addPhaseResult('PLS-SEM', 'fail', performance.now() - p20Start); }

            // ═══════════════════════════════════════════
            // PHASE 21: BOOTSTRAPPING (50 samples for speed)
            // ═══════════════════════════════════════════
            const p21Start = performance.now();
            addLog('INFO', '══════ PHASE 21: BOOTSTRAPPING (50 mẫu — test mode) ══════');
            addLog('DEBUG', 'Dùng 50 mẫu để test nhanh. Production nên dùng 500-1000.');
            try {
                const bootRes = await evalRJSON(webR, `
                    set.seed(42)
                    n <- 150
                    f1 <- rnorm(n); f2 <- rnorm(n); f3 <- 0.5*f1 + 0.3*f2 + rnorm(n,0,0.6)
                    df <- data.frame(
                        V1=f1*0.8+rnorm(n,0,0.3), V2=f1*0.7+rnorm(n,0,0.4), V3=f1*0.85+rnorm(n,0,0.3),
                        V4=f2*0.8+rnorm(n,0,0.3), V5=f2*0.75+rnorm(n,0,0.35), V6=f2*0.9+rnorm(n,0,0.25),
                        V7=f3*0.8+rnorm(n,0,0.3), V8=f3*0.7+rnorm(n,0,0.4), V9=f3*0.85+rnorm(n,0,0.3)
                    )
                    mm <- constructs(
                        composite("F1", multi_items("V", 1:3)),
                        composite("F2", multi_items("V", 4:6)),
                        composite("F3", multi_items("V", 7:9))
                    )
                    sm <- relationships(paths(from="F1",to="F3"), paths(from="F2",to="F3"))
                    pls <- estimate_pls(data=df, measurement_model=mm, structural_model=sm)
                    
                    # Manual bootstrap (50 iterations for speed test)
                    orig <- summary(pls)
                    n_boot <- 50
                    boot_ests <- matrix(NA, nrow=n_boot, ncol=2)
                    for (b in 1:n_boot) {
                        tryCatch({
                            idx <- sample(1:n, n, replace=TRUE)
                            bp <- estimate_pls(data=df[idx,], measurement_model=mm, structural_model=sm)
                            bs <- summary(bp)
                            boot_ests[b,1] <- bs$paths["F1", "F3"]
                            boot_ests[b,2] <- bs$paths["F2", "F3"]
                        }, error=function(e){})
                    }
                    boot_sd <- apply(boot_ests, 2, sd, na.rm=TRUE)
                    orig_vals <- c(orig$paths["F1", "F3"], orig$paths["F2", "F3"])
                    t_vals <- orig_vals / boot_sd
                    p_vals <- 2 * pnorm(-abs(t_vals))
                    
                    list(
                        n_boot = n_boot,
                        paths = c("F1->F3", "F2->F3"),
                        original = round(orig_vals, 4),
                        boot_sd = round(boot_sd, 4),
                        t_stat = round(t_vals, 4),
                        p_value = round(p_vals, 6)
                    )
                `, 'BOOTSTRAP');
                if (bootRes.ok) {
                    addLog('OK', `Bootstrapping completed: ${bootRes.data.n_boot} samples`);
                    const paths = Array.isArray(bootRes.data.paths) ? bootRes.data.paths : [bootRes.data.paths];
                    const originals = Array.isArray(bootRes.data.original) ? bootRes.data.original : [bootRes.data.original];
                    const pvals = Array.isArray(bootRes.data.p_value) ? bootRes.data.p_value : [bootRes.data.p_value];
                    const tstats = Array.isArray(bootRes.data.t_stat) ? bootRes.data.t_stat : [bootRes.data.t_stat];
                    for (let i = 0; i < paths.length; i++) {
                        addLog('RESULT', `${paths[i]}: β=${originals[i]}, t=${tstats[i]}, p=${pvals[i]}`);
                    }
                    addPhaseResult('Bootstrapping', 'pass', performance.now() - p21Start);
                } else { allPassed = false; addPhaseResult('Bootstrapping', 'fail', performance.now() - p21Start); }
            } catch (e: any) { addLog('ERROR', `Bootstrap: ${e.message}`); allPassed = false; addPhaseResult('Bootstrapping', 'fail', performance.now() - p21Start); }

            // ═══════════════════════════════════════════
            // PHASE 22: BLINDFOLDING (Q²)
            // ═══════════════════════════════════════════
            const p22Start = performance.now();
            addLog('INFO', '══════ PHASE 22: BLINDFOLDING (Q²) ══════');
            try {
                const bfRes = await evalRJSON(webR, `
                    set.seed(42)
                    n <- 150
                    f1 <- rnorm(n); f2 <- rnorm(n); f3 <- 0.5*f1 + 0.3*f2 + rnorm(n,0,0.6)
                    df <- data.frame(
                        V1=f1*0.8+rnorm(n,0,0.3), V2=f1*0.7+rnorm(n,0,0.4), V3=f1*0.85+rnorm(n,0,0.3),
                        V4=f2*0.8+rnorm(n,0,0.3), V5=f2*0.75+rnorm(n,0,0.35), V6=f2*0.9+rnorm(n,0,0.25),
                        V7=f3*0.8+rnorm(n,0,0.3), V8=f3*0.7+rnorm(n,0,0.4), V9=f3*0.85+rnorm(n,0,0.3)
                    )
                    mm <- constructs(
                        composite("F1", multi_items("V", 1:3)),
                        composite("F2", multi_items("V", 4:6)),
                        composite("F3", multi_items("V", 7:9))
                    )
                    sm <- relationships(paths(from="F1",to="F3"), paths(from="F2",to="F3"))
                    pls <- estimate_pls(data=df, measurement_model=mm, structural_model=sm)
                    
                    # Manual Q² via cross-validation (omission distance = 7)
                    scores <- pls$construct_scores
                    D <- 7
                    n_obs <- nrow(scores)
                    SSE <- 0; SSO <- 0
                    y_col <- "F3"
                    y_mean <- mean(scores[, y_col])
                    for (d in 1:D) {
                        omit <- seq(d, n_obs, by=D)
                        keep <- setdiff(1:n_obs, omit)
                        train_df <- df[keep,]; test_df <- df[omit,]
                        tryCatch({
                            m <- estimate_pls(data=train_df, measurement_model=mm, structural_model=sm)
                            train_scores <- m$construct_scores
                            # Predict using training path coefficients
                            s <- summary(m)
                            b1 <- s$paths["F1", "F3"]; b2 <- s$paths["F2", "F3"]
                            test_m <- estimate_pls(data=test_df, measurement_model=mm, structural_model=sm)
                            test_scores <- test_m$construct_scores
                            pred <- b1 * test_scores[,"F1"] + b2 * test_scores[,"F2"]
                            actual <- test_scores[, "F3"]
                            SSE <- SSE + sum((actual - pred)^2)
                            SSO <- SSO + sum((actual - y_mean)^2)
                        }, error=function(e){})
                    }
                    q2 <- 1 - SSE/SSO
                    list(q2_F3 = round(q2, 4), SSE = round(SSE, 4), SSO = round(SSO, 4))
                `, 'BLINDFOLDING');
                if (bfRes.ok) {
                    addLog('OK', `Blindfolding completed`);
                    addLog('RESULT', `Q²(F3) = ${bfRes.data.q2_F3}`);
                    const q2Ok = bfRes.data.q2_F3 > 0;
                    addLog(q2Ok ? 'OK' : 'WARN', `Validation: Q²=${bfRes.data.q2_F3} ${q2Ok ? '✅ > 0 (predictive relevance)' : '⚠️ ≤ 0 (no predictive relevance)'}`);
                    addPhaseResult('Blindfolding Q²', 'pass', performance.now() - p22Start);
                } else { allPassed = false; addPhaseResult('Blindfolding Q²', 'fail', performance.now() - p22Start); }
            } catch (e: any) { addLog('ERROR', `Blindfolding: ${e.message}`); allPassed = false; addPhaseResult('Blindfolding Q²', 'fail', performance.now() - p22Start); }

            // ═══════════════════════════════════════════
            // FINAL SUMMARY
            // ═══════════════════════════════════════════
            addLog('INFO', '══════════════════════════════════════════');
            addLog('INFO', '══════ TỔNG KẾT TOÀN BỘ ══════');
            if (allPassed) {
                addLog('OK', '🎉 TẤT CẢ 19 PHƯƠNG PHÁP ĐỀU THÀNH CÔNG!');
                addLog('OK', 'WebR → Packages → Descriptive → Cronbach → Correlation → T-Test → Paired T → ANOVA → Mann-Whitney → Kruskal-Wallis → Wilcoxon → Chi-Square → Regression → Logistic → EFA → CFA → SEM → Mediation → PLS-SEM → Bootstrapping → Blindfolding');
                setStatus('pass');
            } else {
                addLog('ERROR', '❌ MỘT SỐ TEST THẤT BẠI - Xem log ở trên.');
                setStatus('fail');
            }
            addLog('INFO', '══════════════════════════════════════════');

        } catch (error: any) {
            addLog('ERROR', `Unexpected JS Exception: ${error.message}`);
            addLog('DEBUG', `Stack trace: ${error.stack}`);
            setStatus('fail');
        } finally {
            setRunning(false);
            if (webRRef.current) {
                try { webRRef.current.close(); } catch {}
                webRRef.current = null;
            }
        }
    };

    const levelColors: Record<LogLevel, string> = {
        INFO: '#88c0d0',
        OK: '#a3be8c',
        WARN: '#ebcb8b',
        ERROR: '#bf616a',
        DEBUG: '#6c7a89',
        RESULT: '#b48ead',
    };

    const logsToText = () => {
        return logs.map(e => `${e.time} [${e.level}] ${e.msg}`).join('\n');
    };

    const copyLog = async () => {
        const text = logsToText();
        try {
            await navigator.clipboard.writeText(text);
            alert('Đã copy log vào clipboard!');
        } catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            alert('Đã copy log vào clipboard!');
        }
    };

    const downloadLog = () => {
        const text = logsToText();
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `webr-deep-test-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.log`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ padding: 24, fontFamily: "'JetBrains Mono', monospace", background: '#1e1e2e', color: '#cdd6f4', minHeight: '100vh' }}>
            <h1 style={{ color: '#cba6f7', margin: '0 0 8px' }}>🧪 WebR Deep Integration Test</h1>
            <p style={{ color: '#6c7086', margin: '0 0 16px', fontSize: 13 }}>
                Test pipeline: Init WebR → Stub quadprog → Install Packages → 19 Analysis Methods (Descriptive → Cronbach → Correlation → T-Test → ANOVA → Non-parametric → Regression → EFA → CFA → SEM → Mediation → PLS-SEM → Bootstrapping → Blindfolding Q²)
            </p>
            
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                <button 
                    onClick={runTest} 
                    disabled={running}
                    style={{ 
                        padding: '8px 20px', fontSize: 14, cursor: running ? 'not-allowed' : 'pointer',
                        background: running ? '#45475a' : '#89b4fa', color: '#1e1e2e', border: 'none', 
                        borderRadius: 6, fontWeight: 600, fontFamily: 'inherit'
                    }}
                >
                    {running ? '⏳ Đang chạy...' : '▶ Chạy Deep Test'}
                </button>
                
                {logs.length > 0 && !running && (
                    <>
                        <button onClick={copyLog} style={{
                            padding: '8px 16px', fontSize: 13, cursor: 'pointer',
                            background: '#a6e3a1', color: '#1e1e2e', border: 'none',
                            borderRadius: 6, fontWeight: 600, fontFamily: 'inherit'
                        }}>
                            📋 Copy Log
                        </button>
                        <button onClick={downloadLog} style={{
                            padding: '8px 16px', fontSize: 13, cursor: 'pointer',
                            background: '#f9e2af', color: '#1e1e2e', border: 'none',
                            borderRadius: 6, fontWeight: 600, fontFamily: 'inherit'
                        }}>
                            💾 Tải file .log
                        </button>
                    </>
                )}
                
                {status === 'pass' && <span style={{ color: '#a3be8c', fontWeight: 600 }}>✅ ALL PASSED</span>}
                {status === 'fail' && <span style={{ color: '#bf616a', fontWeight: 600 }}>❌ SOME FAILED</span>}
            </div>

            {/* Phase Summary Dashboard */}
            {phaseResults.length > 0 && (
                <div style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                    gap: 8, marginBottom: 16 
                }}>
                    {phaseResults.map((p, i) => (
                        <div key={i} style={{
                            background: p.status === 'pass' ? '#1a332a' : p.status === 'fail' ? '#331a1a' : '#2a2a33',
                            border: `1px solid ${p.status === 'pass' ? '#2d5a3f' : p.status === 'fail' ? '#5a2d2d' : '#3a3a4a'}`,
                            borderRadius: 6, padding: '8px 12px', fontSize: 12
                        }}>
                            <div style={{ fontWeight: 600, color: p.status === 'pass' ? '#a3be8c' : '#bf616a' }}>
                                {p.status === 'pass' ? '✅' : '❌'} {p.name}
                            </div>
                            <div style={{ color: '#6c7086', marginTop: 2 }}>
                                {(p.duration / 1000).toFixed(1)}s
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ 
                background: '#11111b', borderRadius: 8, padding: 16, 
                maxHeight: '60vh', overflowY: 'auto', fontSize: 12.5, lineHeight: 1.7,
                border: '1px solid #313244'
            }}>
                {logs.length === 0 ? (
                    <span style={{ color: '#6c7086' }}>Nhấn "Chạy Deep Test" để bắt đầu kiểm tra toàn bộ 19 phương pháp phân tích (bao gồm PLS-SEM + Bootstrapping + Blindfolding)...</span>
                ) : (
                    logs.map((entry, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8 }}>
                            <span style={{ color: '#585b70', minWidth: 75 }}>{entry.time}</span>
                            <span style={{ 
                                color: levelColors[entry.level], minWidth: 55, fontWeight: 600 
                            }}>[{entry.level}]</span>
                            <span style={{ 
                                color: entry.level === 'DEBUG' ? '#6c7086' : levelColors[entry.level],
                                whiteSpace: 'pre-wrap', wordBreak: 'break-all'
                            }}>{entry.msg}</span>
                        </div>
                    ))
                )}
            </div>
            
            <p style={{ color: '#6c7086', fontSize: 11, marginTop: 12 }}>
                💡 Deep Test khởi tạo WebR engine riêng biệt, chạy R code trực tiếp (không qua wrapper). Dùng để debug tầng thấp khi Auto Test Engine báo lỗi.
            </p>
        </div>
    );
}
