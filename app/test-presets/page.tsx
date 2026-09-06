'use client';
import { useState, useRef, useCallback } from 'react';
import { Target, AlertTriangle, CheckCircle2, ChevronRight, Play, Server, Clock, Search, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

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

export default function TestWebRPresets() {
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

    const runTests = async () => {
        if (running) return;
        setRunning(true);
        setStatus('running');
        setLogs([]);
        setPhaseResults([]);
        
        let hasError = false;

        try {
            // ================== GIAI ĐOẠN 1: KHỞI TẠO WEBR VÀ MÔI TRƯỜNG ==================
            const t0 = performance.now();
            addLog('INFO', '══════ GIAI ĐOẠN 1: KHỞI TẠO WEBR ══════');
            const { WebR } = await import('webr');
            const webR = new WebR();
            webRRef.current = webR;
            await webR.init();
            
            await webR.installPackages(['jsonlite', 'psych', 'lavaan', 'seminr', 'car']);
            await evalRSafe(webR, `library(jsonlite); library(psych); library(lavaan); library(seminr); library(car)`, 'Init Libraries');
            
            // Tạo Dummy Data cho các Preset
            await evalRSafe(webR, `
                set.seed(42)
                n <- 100
                F1_1 <- rnorm(n)
                F1_2 <- F1_1 + rnorm(n, 0, 0.5)
                F1_3 <- F1_1 + rnorm(n, 0, 0.5)
                F2_1 <- rnorm(n)
                F2_2 <- F2_1 + rnorm(n, 0, 0.5)
                F2_3 <- F2_1 + rnorm(n, 0, 0.5)
                F3_1 <- 0.5*F1_1 + 0.5*F2_1 + rnorm(n, 0, 0.5)
                F3_2 <- F3_1 + rnorm(n, 0, 0.5)
                F3_3 <- F3_1 + rnorm(n, 0, 0.5)
                Gender <- sample(c("Nam", "Nữ"), n, replace = TRUE)
                Purchase <- ifelse(runif(n) > 0.5, 1, 0)
                
                df <- data.frame(F1_1, F1_2, F1_3, F2_1, F2_2, F2_3, F3_1, F3_2, F3_3, Gender, Purchase)
            `, 'Init Dummy Data');
            addPhaseResult('Initialize WebR & Data', 'pass', performance.now() - t0);

            // ================== PRESET 1: PLS-SEM ==================
            const t1 = performance.now();
            addLog('INFO', '══════ PRESET 1: PLS-SEM STANDARD ══════');
            let p1Ok = true;
            const plsCode = `
                mm <- constructs(
                    composite("F1", multi_items("F1_", 1:3)),
                    composite("F2", multi_items("F2_", 1:3)),
                    composite("F3", multi_items("F3_", 1:3))
                )
                sm <- relationships(
                    paths(from = c("F1", "F2"), to = c("F3"))
                )
                pls_model <- estimate_pls(data = df, measurement_model = mm, structural_model = sm)
                pls_summary <- summary(pls_model)
                round(pls_summary$paths[1,1], 3)
            `;
            const r1 = await evalRSafe(webR, plsCode, 'PLS-SEM Estimation');
            if (!r1.ok) p1Ok = false;
            else addLog('RESULT', 'PLS-SEM Path (F1->F3): ' + r1.value);
            addPhaseResult('Preset 1: PLS-SEM Standard', p1Ok ? 'pass' : 'fail', performance.now() - t1);
            if (!p1Ok) hasError = true;

            // ================== PRESET 2: CB-SEM (Lavaan) ==================
            const t2 = performance.now();
            addLog('INFO', '══════ PRESET 2: CB-SEM (LAVAAN) ══════');
            let p2Ok = true;
            const cbsemCode = `
                model <- '
                    F1 =~ F1_1 + F1_2 + F1_3
                    F2 =~ F2_1 + F2_2 + F2_3
                    F3 =~ F3_1 + F3_2 + F3_3
                    F3 ~ F1 + F2
                '
                fit <- sem(model, data=df)
                round(fitMeasures(fit, c("cfi", "rmsea")), 3)
            `;
            const r2 = await evalRSafe(webR, cbsemCode, 'CB-SEM Estimation');
            if (!r2.ok) p2Ok = false;
            else addLog('RESULT', 'CB-SEM Fit: ' + r2.value);
            addPhaseResult('Preset 2: CB-SEM (Lavaan)', p2Ok ? 'pass' : 'fail', performance.now() - t2);
            if (!p2Ok) hasError = true;

            // ================== PRESET 3: Regression ==================
            const t3 = performance.now();
            addLog('INFO', '══════ PRESET 3: MULTIPLE REGRESSION ══════');
            let p3Ok = true;
            const regCode = `
                df$F1_mean <- rowMeans(df[, c("F1_1", "F1_2", "F1_3")])
                df$F2_mean <- rowMeans(df[, c("F2_1", "F2_2", "F2_3")])
                df$F3_mean <- rowMeans(df[, c("F3_1", "F3_2", "F3_3")])
                
                model_lm <- lm(F3_mean ~ F1_mean + F2_mean, data=df)
                round(summary(model_lm)$r.squared, 3)
            `;
            const r3 = await evalRSafe(webR, regCode, 'Linear Regression');
            if (!r3.ok) p3Ok = false;
            else addLog('RESULT', 'R-Squared: ' + r3.value);
            addPhaseResult('Preset 3: Multiple Regression', p3Ok ? 'pass' : 'fail', performance.now() - t3);
            if (!p3Ok) hasError = true;

            // ================== PRESET 4: Group Comparison ==================
            const t4 = performance.now();
            addLog('INFO', '══════ PRESET 4: GROUP COMPARISON ══════');
            let p4Ok = true;
            const compCode = `
                res_ttest <- t.test(F1_mean ~ Gender, data=df)
                round(res_ttest$p.value, 4)
            `;
            const r4 = await evalRSafe(webR, compCode, 'T-Test');
            if (!r4.ok) p4Ok = false;
            else addLog('RESULT', 'T-Test p-value: ' + r4.value);
            addPhaseResult('Preset 4: Group Comparison', p4Ok ? 'pass' : 'fail', performance.now() - t4);
            if (!p4Ok) hasError = true;

            // ================== PRESET 5: Scale Development ==================
            const t5 = performance.now();
            addLog('INFO', '══════ PRESET 5: SCALE DEVELOPMENT ══════');
            let p5Ok = true;
            const scaleCode = `
                efa_res <- fa(df[, 1:9], nfactors=3, rotate="oblimin", fm="minres")
                round(efa_res$Vaccounted[2, 1], 3)
            `;
            const r5 = await evalRSafe(webR, scaleCode, 'EFA');
            if (!r5.ok) p5Ok = false;
            else addLog('RESULT', 'EFA Variance Extracted: ' + r5.value);
            addPhaseResult('Preset 5: Scale Development', p5Ok ? 'pass' : 'fail', performance.now() - t5);
            if (!p5Ok) hasError = true;

            // ================== PRESET 6: Logistic Regression ==================
            const t6 = performance.now();
            addLog('INFO', '══════ PRESET 6: LOGISTIC REGRESSION ══════');
            let p6Ok = true;
            const logCode = `
                model_log <- glm(Purchase ~ F1_mean + F2_mean, data=df, family=binomial)
                round(summary(model_log)$coefficients[2,4], 4)
            `;
            const r6 = await evalRSafe(webR, logCode, 'Logistic Regression');
            if (!r6.ok) p6Ok = false;
            else addLog('RESULT', 'Logistic p-value for F1: ' + r6.value);
            addPhaseResult('Preset 6: Logistic Regression', p6Ok ? 'pass' : 'fail', performance.now() - t6);
            if (!p6Ok) hasError = true;

            setStatus(hasError ? 'fail' : 'pass');
            addLog('INFO', '══════ HOÀN TẤT KIỂM THỬ ══════');

        } catch (error: any) {
            addLog('ERROR', 'System crash: ' + error.message);
            setStatus('fail');
        } finally {
            if (webRRef.current) {
                webRRef.current.destroy();
                webRRef.current = null;
            }
            setRunning(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                            <Server className="w-8 h-8 text-indigo-600" />
                            Deep Test: Auto Pilot Presets
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            Kiểm thử tự động 6 kịch bản Auto Pilot bằng WebR. Giúp phát hiện lỗi thư viện R và warning.
                        </p>
                    </div>
                    <button
                        onClick={runTests}
                        disabled={running}
                        className={\`px-8 py-4 rounded-2xl font-black text-white uppercase tracking-wider flex items-center gap-3 transition-all \${
                            running ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 hover:shadow-xl'
                        }\`}
                    >
                        {running ? 'Đang chạy Test...' : 'Bắt đầu Test'}
                        {!running && <Play className="w-5 h-5" />}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-800 p-4 border-b border-slate-700">
                                <h2 className="text-white font-bold flex items-center gap-2">
                                    <Target className="w-5 h-5 text-blue-400" /> Kết quả từng Phase
                                </h2>
                            </div>
                            <div className="p-4 space-y-3">
                                {phaseResults.length === 0 && (
                                    <div className="text-slate-400 text-sm text-center py-8">Chưa có kết quả test</div>
                                )}
                                {phaseResults.map((pr, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            {pr.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                            {pr.status === 'fail' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                                            <span className="font-bold text-slate-700 text-sm">{pr.name}</span>
                                        </div>
                                        <div className="text-xs font-mono text-slate-400">
                                            {pr.duration > 1000 ? (pr.duration / 1000).toFixed(1) + 's' : pr.duration.toFixed(0) + 'ms'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {status !== 'idle' && status !== 'running' && (
                            <div className={\`p-6 rounded-3xl border shadow-sm \${
                                status === 'pass' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                            }\`}>
                                <div className={\`text-2xl font-black mb-2 \${
                                    status === 'pass' ? 'text-emerald-700' : 'text-rose-700'
                                }\`}>
                                    {status === 'pass' ? '🎉 TẤT CẢ ĐỀU PASS' : '❌ CÓ LỖI XẢY RA'}
                                </div>
                                <p className={\`text-sm font-medium \${
                                    status === 'pass' ? 'text-emerald-600' : 'text-rose-600'
                                }\`}>
                                    {status === 'pass' 
                                        ? 'Tất cả các preset đều hoạt động bình thường.' 
                                        : 'Vui lòng kiểm tra Log bên cạnh để xem chi tiết lỗi.'}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-[#0D1117] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[700px]">
                            <div className="bg-[#161B22] p-4 border-b border-slate-700 flex items-center justify-between shrink-0">
                                <h2 className="text-white font-mono font-bold text-sm flex items-center gap-2">
                                    <Server className="w-4 h-4 text-slate-400" /> WebR Console Log
                                </h2>
                            </div>
                            <div className="p-4 flex-1 overflow-auto font-mono text-xs sm:text-sm custom-scrollbar" id="log-container">
                                {logs.length === 0 ? (
                                    <div className="text-slate-500 h-full flex flex-col items-center justify-center gap-3">
                                        <Clock className="w-8 h-8 opacity-50" />
                                        <span>Đang chờ chạy test...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        {logs.map((log, idx) => (
                                            <div key={idx} className="flex gap-3 hover:bg-white/5 p-1 rounded transition-colors break-words">
                                                <span className="text-slate-500 shrink-0 select-none">[{log.time}]</span>
                                                <span className={\`font-bold shrink-0 w-16 select-none \${
                                                    log.level === 'INFO' ? 'text-blue-400' :
                                                    log.level === 'OK' ? 'text-emerald-400' :
                                                    log.level === 'WARN' ? 'text-amber-400' :
                                                    log.level === 'ERROR' ? 'text-rose-400' :
                                                    log.level === 'RESULT' ? 'text-purple-400' : 'text-slate-400'
                                                }\`}>
                                                    {log.level}
                                                </span>
                                                <span className={\`\${
                                                    log.level === 'ERROR' ? 'text-rose-300' :
                                                    log.level === 'WARN' ? 'text-amber-200' :
                                                    log.level === 'RESULT' ? 'text-purple-200' : 'text-slate-300'
                                                }\`}>
                                                    {log.msg}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
