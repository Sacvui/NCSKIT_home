import { WebR } from 'webr';
import { getOptimalChannelType, BASE_URL } from './core';
import { logger } from '@/utils/logger';

export class WebRPoolManager {
    private static instance: WebRPoolManager;
    private pool: WebR[] = [];
    private busyWorkers: Set<WebR> = new Set();
    private maxWorkers: number = 1;
    private isInitializing: boolean = false;

    private constructor() {
        // Leave 1 core for the main thread, max out at 4 to prevent out-of-memory on low-end devices
        const hardwareCores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 2 : 2;
        this.maxWorkers = Math.max(1, Math.min(hardwareCores - 1, 4));
    }

    public static getInstance(): WebRPoolManager {
        if (!WebRPoolManager.instance) {
            WebRPoolManager.instance = new WebRPoolManager();
        }
        return WebRPoolManager.instance;
    }

    /**
     * Initializes the worker pool. Can be called in the background.
     */
    public async initPool(): Promise<void> {
        if (this.isInitializing || this.pool.length >= this.maxWorkers) return;
        this.isInitializing = true;

        try {
            logger.info(`[WebR Pool] Initializing pool with ${this.maxWorkers} workers...`);
            
            // Spawn workers sequentially to avoid blocking the main thread entirely
            for (let i = this.pool.length; i < this.maxWorkers; i++) {
                const worker = new WebR({
                    baseUrl: BASE_URL,
                    channelType: getOptimalChannelType(),
                });
                
                await worker.init();

                // PURE RAM MODE for workers: No IDBFS mounting to avoid deadlocks.
                // Install seminr directly into each worker's RAM safely.
                await worker.installPackages(['seminr'], { repos: 'https://repo.r-wasm.org/' });
                
                // Generate unique RNG state per worker
                await worker.evalR(`
                    RNGkind("L'Ecuyer-CMRG")
                    options(repos = c(CRAN = "https://repo.r-wasm.org/"))
                    options(pkgType = "binary")
                `);
                
                this.pool.push(worker);
                logger.debug(`[WebR Pool] Worker ${i + 1}/${this.maxWorkers} ready.`);
            }
        } catch (error) {
            logger.error('[WebR Pool] Failed to initialize pool:', error);
        } finally {
            this.isInitializing = false;
        }
    }

    /**
     * Acquires an idle worker from the pool.
     */
    public async acquireWorker(): Promise<WebR | null> {
        // Find an idle worker
        const idleWorker = this.pool.find(w => !this.busyWorkers.has(w));
        
        if (idleWorker) {
            this.busyWorkers.add(idleWorker);
            return idleWorker;
        }

        // If no idle worker and we haven't reached max capacity, try to init more (auto-scale)
        if (this.pool.length < this.maxWorkers && !this.isInitializing) {
            await this.initPool();
            return this.acquireWorker();
        }

        return null;
    }

    /**
     * Releases a worker back to the pool.
     */
    public releaseWorker(worker: WebR): void {
        if (this.busyWorkers.has(worker)) {
            // Clean up memory before releasing
            worker.evalR('gc()').catch(e => logger.warn('[WebR Pool] Failed to GC worker:', e)).finally(() => {
                this.busyWorkers.delete(worker);
            });
        }
    }
    
    public getPoolSize(): number {
        return this.pool.length;
    }
    
    public getBusyCount(): number {
        return this.busyWorkers.size;
    }

    public getMaxWorkers(): number {
        return this.maxWorkers;
    }

    /**
     * Executes R code in parallel across available workers
     */
    public async executeRParallel<T>(
        tasks: { code: string; data?: number[][] }[],
        timeoutMs: number = 300000
    ): Promise<T[]> {
        await this.initPool();
        const results: T[] = [];
        const activePromises: Promise<void>[] = [];

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            
            const workerPromise = (async () => {
                let worker = await this.acquireWorker();
                // Wait for an available worker if all are busy
                while (!worker) {
                    await new Promise(r => setTimeout(r, 100));
                    worker = await this.acquireWorker();
                }

                try {
                    // Inject data if provided
                    if (task.data && task.data.length > 0) {
                        const CHUNK_SIZE = 500;
                        const numRows = task.data.length;
                        await worker.evalR(`raw_data <- NULL`);
                        for (let j = 0; j < numRows; j += CHUNK_SIZE) {
                            const chunk = task.data.slice(j, j + CHUNK_SIZE);
                            const chunkText = chunk.map(row =>
                                row.map(v => {
                                    if (v === null || v === undefined || (v as any) === '') return 'NA';
                                    const n = Number(v);
                                    return isNaN(n) ? 'NA' : n;
                                }).join(',')
                            ).join('\n');
                            const escapedChunk = chunkText.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                            await worker.evalR(`
                                .chunk <- read.csv(text = "${escapedChunk}", header = FALSE, stringsAsFactors = FALSE)
                                .chunk[] <- suppressWarnings(lapply(.chunk, as.numeric))
                                .chunk <- as.matrix(.chunk)
                                raw_data <- if(is.null(raw_data)) .chunk else rbind(raw_data, .chunk)
                                rm(.chunk)
                            `);
                        }
                    }

                    const wrappedCode = `
                        tryCatch({
                            .res <- { ${task.code} }
                            if (is.list(.res)) {
                                attributes(.res)$call <- NULL
                                attributes(.res)$model <- NULL
                            }
                            .json <- jsonlite::toJSON(.res, auto_unbox = TRUE, force = TRUE, digits = 8)
                            writeLines(as.character(.json), "/home/web_user/output_pool.json")
                            TRUE
                        }, error = function(e) {
                            writeLines(paste("ERROR:", e$message), "/home/web_user/output_pool.json")
                            FALSE
                        })
                    `;

                    const evalPromise = worker.evalR(wrappedCode);
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error("Worker timeout or silent crash. Execution took too long.")), 180000);
                    });
                    
                    await Promise.race([evalPromise, timeoutPromise]);

                    const resultProxy = await worker.evalR(`readLines("/home/web_user/output_pool.json")`);
                    const resultLines = await resultProxy.toJs() as any;
                    const finalStr = Array.isArray(resultLines?.values)
                        ? resultLines.values.join('\n')
                        : String(resultLines?.values ?? '');

                    if (finalStr.startsWith("ERROR:")) {
                        throw new Error(finalStr.replace("ERROR:", "").trim());
                    }

                    try {
                        results[i] = JSON.parse(finalStr);
                    } catch {
                        results[i] = finalStr as any;
                    }
                } finally {
                    this.releaseWorker(worker);
                }
            })();

            activePromises.push(workerPromise);
        }

        await Promise.all(activePromises);
        return results;
    }
}

export const webRPool = WebRPoolManager.getInstance();
