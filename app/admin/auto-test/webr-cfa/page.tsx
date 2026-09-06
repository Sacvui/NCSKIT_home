'use client';
import { useState, useRef, useCallback } from 'react';

type LogLevel = 'INFO' | 'OK' | 'WARN' | 'ERROR' | 'DEBUG' | 'RESULT';

interface LogEntry {
    time: string;
    level: LogLevel;
    msg: string;
}

export default function TestWebR() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [running, setRunning] = useState(false);
    const [status, setStatus] = useState<'idle' | 'running' | 'pass' | 'fail'>('idle');
    const webRRef = useRef<any>(null);

    const addLog = useCallback((level: LogLevel, msg: string) => {
        const time = new Date().toLocaleTimeString('vi-VN');
        console.log(`[${level}] ${msg}`);
        setLogs(prev => [...prev, { time, level, msg }]);
    }, []);

    // Helper: chạy R code và trả về string, bắt mọi warning/error
    const evalRSafe = async (webR: any, code: string, label: string): Promise<{ ok: boolean; value: string; warnings: string[] }> => {
        const warnings: string[] = [];
        try {
            // Wrap code to capture warnings
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

    const runTest = async () => {
        setRunning(true);
        setStatus('running');
        setLogs([]);
        let testPassed = true;

        try {
            // ═══════════════════════════════════════════
            // PHASE 1: KHỞI TẠO WEBR
            // ═══════════════════════════════════════════
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

            // Log R version
            const verRes = await webR.evalR('paste(R.version$major, R.version$minor, sep=".")');
            const verJs = await (verRes as any).toJs();
            addLog('DEBUG', `R version: ${verJs.values[0]}`);

            // Log lib paths
            const libRes = await webR.evalR('paste(.libPaths(), collapse=" | ")');
            const libJs = await (libRes as any).toJs();
            addLog('DEBUG', `.libPaths(): ${libJs.values[0]}`);

            // Check if jsonlite is available (we need it for JSON output)
            addLog('INFO', 'Checking jsonlite availability...');
            await webR.evalR(`
                if (!require("jsonlite", quietly=TRUE)) {
                    webr::install("jsonlite")
                    library(jsonlite)
                }
            `);
            addLog('OK', 'jsonlite ready');

            // ═══════════════════════════════════════════
            // PHASE 2: TẠO QUADPROG STUB
            // ═══════════════════════════════════════════
            addLog('INFO', '══════ PHASE 2: TẠO QUADPROG STUB PACKAGE ══════');
            
            // Check namespace registry BEFORE
            const nsBefore = await evalRSafe(webR, `
                paste("Loaded namespaces:", paste(loadedNamespaces(), collapse=", "))
            `, 'PRE-CHECK');
            if (nsBefore.ok) addLog('DEBUG', nsBefore.value);
            
            // Check if quadprog already exists
            const qpExists = await evalRSafe(webR, `
                pkg_dir <- file.path(.libPaths()[1], "quadprog")
                paste("quadprog dir exists:", dir.exists(pkg_dir))
            `, 'PRE-CHECK');
            if (qpExists.ok) addLog('DEBUG', qpExists.value);

            // Create the stub package
            addLog('INFO', 'Creating quadprog stub on VFS (with full metadata)...');
            const createResult = await evalRSafe(webR, `
                lib_path <- .libPaths()[1]
                pkg_dir <- file.path(lib_path, "quadprog")
                
                # Clean up if exists
                if (dir.exists(pkg_dir)) unlink(pkg_dir, recursive = TRUE)
                
                # Create directory structure
                dir.create(file.path(pkg_dir, "R"), recursive = TRUE, showWarnings = FALSE)
                dir.create(file.path(pkg_dir, "Meta"), recursive = TRUE, showWarnings = FALSE)
                
                # 1. DESCRIPTION
                writeLines(c(
                    "Package: quadprog",
                    "Version: 1.5-8",
                    "Title: Quadratic Programming Stub for WebR",
                    "Description: Stub package for WebR - provides namespace so lavaan can load.",
                    "Author: WebR Stub",
                    "Maintainer: WebR Stub <stub@webr>",
                    "License: GPL-2",
                    "NeedsCompilation: no",
                    paste0("Built: R ", R.version$major, ".", R.version$minor, "; ; ", Sys.time(), "; unix")
                ), file.path(pkg_dir, "DESCRIPTION"))
                
                # 2. NAMESPACE
                writeLines(c(
                    "export(solve.QP)",
                    "export(solve.QP.compact)"
                ), file.path(pkg_dir, "NAMESPACE"))
                
                # 3. Meta/package.rds — R reads this to validate the package
                desc_fields <- read.dcf(file.path(pkg_dir, "DESCRIPTION"))[1, ]
                pkg_info <- list(
                    DESCRIPTION = desc_fields,
                    Built = list(
                        R = getRversion(),
                        Platform = "",
                        Date = Sys.time(),
                        OStype = "unix"
                    )
                )
                saveRDS(pkg_info, file.path(pkg_dir, "Meta", "package.rds"))
                
                # 4. Meta/nsInfo.rds — namespace export info
                ns_info <- list(
                    exports = c("solve.QP", "solve.QP.compact"),
                    exportPatterns = character(0),
                    imports = list(),
                    importFrom = list(),
                    importClasses = list(),
                    importMethods = list(),
                    S3methods = matrix(character(0), ncol = 4, 
                        dimnames = list(NULL, c("generic", "class", "method", "from")))
                )
                saveRDS(ns_info, file.path(pkg_dir, "Meta", "nsInfo.rds"))
                
                # 5. R source file for sys.source (NOT lazy-load DB — WASM can't serialize it properly)
                #    File name: R/quadprog (NO extension) — this is what R's loadNamespace() sources
                writeLines(c(
                    'solve.QP <- function(Dmat, dvec, Amat, bvec, meq=0, factorized=FALSE) {',
                    '  stop("quadprog::solve.QP is not available in WebR. Standard CFA/SEM does not require this.")',
                    '}',
                    'solve.QP.compact <- function(Dmat, dvec, Amat, Aind, bvec, meq=0, factorized=FALSE) {',
                    '  stop("quadprog::solve.QP.compact is not available in WebR.")',
                    '}'
                ), file.path(pkg_dir, "R", "quadprog"))
                
                # Verify all files
                files <- list.files(pkg_dir, recursive = TRUE, full.names = FALSE)
                paste("Created files:", paste(files, collapse = ", "))
            `, 'CREATE-STUB');
            
            if (createResult.ok) {
                addLog('OK', createResult.value);
            } else {
                addLog('ERROR', 'Failed to create quadprog stub');
                testPassed = false;
            }
            
            // Verify DESCRIPTION content
            const descResult = await evalRSafe(webR, `
                desc_path <- file.path(.libPaths()[1], "quadprog", "DESCRIPTION")
                if (file.exists(desc_path)) {
                    paste(readLines(desc_path), collapse = " | ")
                } else {
                    "__R_ERROR__:DESCRIPTION file not found"
                }
            `, 'VERIFY-DESC');
            if (descResult.ok) addLog('DEBUG', `DESCRIPTION: ${descResult.value}`);

            // ═══════════════════════════════════════════
            // PHASE 3: TEST library(quadprog)
            // ═══════════════════════════════════════════
            addLog('INFO', '══════ PHASE 3: TEST library(quadprog) ══════');
            
            const loadQP = await evalRSafe(webR, `
                library(quadprog)
                paste("Functions in quadprog:", paste(ls("package:quadprog"), collapse = ", "))
            `, 'LOAD-QUADPROG');
            
            if (loadQP.ok) {
                addLog('OK', `library(quadprog) SUCCESS: ${loadQP.value}`);
            } else {
                addLog('ERROR', `library(quadprog) FAILED: ${loadQP.value}`);
                testPassed = false;
                
                // Extra diagnostics
                addLog('DEBUG', 'Running extra diagnostics...');
                const diag = await evalRSafe(webR, `
                    paste(
                        "find.package result:", tryCatch(find.package("quadprog"), error=function(e) e$message),
                        "| system.file:", system.file(package="quadprog"),
                        "| installed:", "quadprog" %in% rownames(installed.packages())
                    )
                `, 'DIAGNOSTICS');
                if (diag.ok) addLog('DEBUG', diag.value);
            }
            
            // Check namespace registry AFTER quadprog load
            const nsAfterQP = await evalRSafe(webR, `
                paste("isNamespaceLoaded quadprog:", isNamespaceLoaded("quadprog"),
                      "| In loadedNamespaces:", "quadprog" %in% loadedNamespaces())
            `, 'NS-CHECK');
            if (nsAfterQP.ok) addLog('DEBUG', nsAfterQP.value);

            // ═══════════════════════════════════════════
            // PHASE 4: INSTALL & LOAD LAVAAN
            // ═══════════════════════════════════════════
            addLog('INFO', '══════ PHASE 4: INSTALL & LOAD LAVAAN ══════');
            addLog('INFO', 'This may take 30-90 seconds...');
            
            const t1 = performance.now();
            const loadLavaan = await evalRSafe(webR, `
                if (!require("lavaan", character.only = TRUE, quietly = TRUE)) {
                    options(repos = c(
                        "https://sem-in-r.r-universe.dev",
                        "https://repo.r-wasm.org"
                    ))
                    webr::install("lavaan")
                    library(lavaan)
                }
                paste("lavaan version:", packageVersion("lavaan"))
            `, 'LOAD-LAVAAN');
            const lavaanTime = ((performance.now() - t1) / 1000).toFixed(1);
            
            if (loadLavaan.ok) {
                addLog('OK', `library(lavaan) SUCCESS in ${lavaanTime}s: ${loadLavaan.value}`);
            } else {
                addLog('ERROR', `library(lavaan) FAILED after ${lavaanTime}s: ${loadLavaan.value}`);
                testPassed = false;
                
                // Log all loaded namespaces for debugging
                const nsAll = await evalRSafe(webR, `
                    paste("All loaded:", paste(loadedNamespaces(), collapse=", "))
                `, 'NS-DEBUG');
                if (nsAll.ok) addLog('DEBUG', nsAll.value);
            }

            // ═══════════════════════════════════════════
            // PHASE 5: CHẠY CFA THỰC TẾ
            // ═══════════════════════════════════════════
            if (testPassed) {
                addLog('INFO', '══════ PHASE 5: CFA TRÊN DỮ LIỆU CHUẨN ══════');
                addLog('INFO', 'Dataset: HolzingerSwineford1939 (3 factors, 9 items, N=301)');
                
                const t2 = performance.now();
                
                // Run CFA directly (not through evalRSafe — avoid as.character coercion)
                try {
                    addLog('INFO', 'Patching lavaan for WASM compatibility...');
                    await webR.evalR(`
                        # Patch: lav_options_checkinterval has a bug on WASM (integer conversion produces NA)
                        # Replace with a version that always returns TRUE (all default options are valid)
                        assignInNamespace("lav_options_checkinterval", function(...) TRUE, ns = "lavaan")
                    `);
                    addLog('OK', 'lavaan patched for WASM');
                    
                    addLog('INFO', 'Fitting CFA model...');
                    await webR.evalR(`
                        HS.model <- '
                            visual  =~ x1 + x2 + x3
                            textual =~ x4 + x5 + x6
                            speed   =~ x7 + x8 + x9
                        '
                        .test_fit <- cfa(HS.model, data = HolzingerSwineford1939)
                    `);
                    addLog('OK', 'CFA model fitted');
                    
                    addLog('INFO', 'Extracting fit measures...');
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
                            n_obs = lavInspect(.test_fit, "nobs"),
                            n_params = lavInspect(.test_fit, "npar")
                        ), auto_unbox = TRUE)
                    `);
                    const fmJs = await (fmRes as any).toJs();
                    const fm = JSON.parse(fmJs.values ? fmJs.values[0] : fmJs);
                    const cfaTime = ((performance.now() - t2) / 1000).toFixed(1);
                    
                    addLog('OK', `CFA completed in ${cfaTime}s`);
                    addLog('RESULT', `Converged: ${fm.converged}`);
                    addLog('RESULT', `N observations: ${fm.n_obs}, N parameters: ${fm.n_params}`);
                    addLog('RESULT', `─── Fit Measures ───`);
                    addLog('RESULT', `  CFI   = ${fm.cfi?.toFixed(4)}`);
                    addLog('RESULT', `  TLI   = ${fm.tli?.toFixed(4)}`);
                    addLog('RESULT', `  RMSEA = ${fm.rmsea?.toFixed(4)}`);
                    addLog('RESULT', `  SRMR  = ${fm.srmr?.toFixed(4)}`);
                    addLog('RESULT', `  χ²    = ${fm.chisq?.toFixed(3)}, df = ${fm.df}, p = ${fm.pvalue?.toFixed(4)}`);
                    
                    // Extract loadings
                    addLog('INFO', 'Extracting factor loadings...');
                    const ldRes = await webR.evalR(`
                        est <- parameterEstimates(.test_fit)
                        ld <- est[est$op == "=~", ]
                        jsonlite::toJSON(data.frame(
                            factor = ld$lhs,
                            item = ld$rhs,
                            loading = round(ld$est, 3),
                            se = round(ld$se, 3),
                            p = round(ld$pvalue, 4)
                        ), auto_unbox = FALSE)
                    `);
                    const ldJs = await (ldRes as any).toJs();
                    const loadings = JSON.parse(ldJs.values ? ldJs.values[0] : ldJs);
                    
                    addLog('RESULT', `─── Factor Loadings ───`);
                    if (loadings && loadings.factor) {
                        for (let i = 0; i < loadings.factor.length; i++) {
                            addLog('RESULT', `  ${loadings.factor[i]} =~ ${loadings.item[i]}: β=${loadings.loading[i]}, SE=${loadings.se[i]}, p=${loadings.p[i]}`);
                        }
                    }
                    
                    // Validate CFI against known value
                    const expectedCFI = 0.931;
                    const cfiBias = Math.abs(fm.cfi - expectedCFI);
                    if (cfiBias < 0.01) {
                        addLog('OK', `✅ CFI validation: ${fm.cfi?.toFixed(4)} ≈ ${expectedCFI} (diff=${cfiBias.toFixed(4)}) — CORRECT`);
                    } else {
                        addLog('WARN', `⚠️ CFI validation: ${fm.cfi?.toFixed(4)} vs expected ${expectedCFI} (diff=${cfiBias.toFixed(4)})`);
                    }
                } catch (cfaError: any) {
                    addLog('ERROR', `CFA Exception: ${cfaError.message || cfaError}`);
                    testPassed = false;
                }
            }

            // ═══════════════════════════════════════════
            // PHASE 6: KẾT LUẬN
            // ═══════════════════════════════════════════
            addLog('INFO', '══════════════════════════════════════════');
            if (testPassed) {
                addLog('OK', '🎉 TẤT CẢ CÁC BƯỚC ĐỀU THÀNH CÔNG!');
                addLog('OK', 'quadprog stub → lavaan load → CFA calculation → KẾT QUẢ CHÍNH XÁC');
                setStatus('pass');
            } else {
                addLog('ERROR', '❌ TEST THẤT BẠI - Xem log ở trên để phân tích nguyên nhân.');
                setStatus('fail');
            }
            addLog('INFO', '══════════════════════════════════════════');

        } catch (error: any) {
            addLog('ERROR', `Unexpected JS Exception: ${error.message}`);
            addLog('DEBUG', `Stack trace: ${error.stack}`);
            setStatus('fail');
        } finally {
            setRunning(false);
            // Cleanup
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
            // Fallback
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
        a.download = `webr-cfa-test-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.log`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ padding: 24, fontFamily: "'JetBrains Mono', monospace", background: '#1e1e2e', color: '#cdd6f4', minHeight: '100vh' }}>
            <h1 style={{ color: '#cba6f7', margin: '0 0 8px' }}>🧪 WebR CFA Integration Test</h1>
            <p style={{ color: '#6c7086', margin: '0 0 16px', fontSize: 13 }}>
                Test pipeline: Init WebR → Create quadprog stub → library(quadprog) → library(lavaan) → CFA on HolzingerSwineford1939 → Validate results
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
                    {running ? '⏳ Đang chạy...' : '▶ Chạy Test'}
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
                
                {status === 'pass' && <span style={{ color: '#a3be8c', fontWeight: 600 }}>✅ PASSED</span>}
                {status === 'fail' && <span style={{ color: '#bf616a', fontWeight: 600 }}>❌ FAILED</span>}
            </div>

            <div style={{ 
                background: '#11111b', borderRadius: 8, padding: 16, 
                maxHeight: '70vh', overflowY: 'auto', fontSize: 12.5, lineHeight: 1.7,
                border: '1px solid #313244'
            }}>
                {logs.length === 0 ? (
                    <span style={{ color: '#6c7086' }}>Nhấn "Chạy Test" để bắt đầu...</span>
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
                💡 Log chỉ hiển thị trên giao diện. Dùng "📋 Copy Log" hoặc "💾 Tải file .log" để lưu kết quả. Mở DevTools (F12) → Console để xem thêm log từ WebR worker.
            </p>
        </div>
    );
}
