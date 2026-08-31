import { initWebR } from './core';
import { logger } from '@/utils/logger';

export class RNGManager {
    /**
     * Initializes the L'Ecuyer-CMRG random number generator on the main WebR instance
     * and generates an array of independent seeds for the specified number of workers.
     * 
     * @param numWorkers The number of independent seeds needed
     * @param initialSeed Optional initial seed for reproducibility
     * @returns Array of seeds (each seed is a numeric array of length 7 representing the internal state of L'Ecuyer-CMRG)
     */
    public static async generateLecuyerSeeds(numWorkers: number, initialSeed: number = 42): Promise<number[][]> {
        const webR = await initWebR();
        try {
            // We use runLocked internally in core for safe execution, but here we can just use evalR
            // Since we need to setup the RNG state and extract the streams
            await webR.evalR(`
                # Ensure the parallel package is loaded
                if (!require("parallel", quietly = TRUE)) {
                    library("parallel")
                }

                # Set the RNG kind to L'Ecuyer-CMRG
                RNGkind("L'Ecuyer-CMRG")
                
                # Set the initial seed
                set.seed(${initialSeed})
                
                # Extract the first stream
                .seed_streams <- list(.Random.seed)
                
                # Generate subsequent streams
                if (${numWorkers} > 1) {
                    for (i in 2:${numWorkers}) {
                        .seed_streams[[i]] <- parallel::nextRNGStream(.seed_streams[[i-1]])
                    }
                }
                
                # Convert list to a clean JSON-serializable structure
                .json_seeds <- jsonlite::toJSON(.seed_streams)
                writeLines(as.character(.json_seeds), "/home/web_user/rng_seeds.json")
            `);

            const resultProxy = await webR.evalR(`readLines("/home/web_user/rng_seeds.json")`);
            const resultLines = await resultProxy.toJs() as any;
            const finalStr = Array.isArray(resultLines?.values)
                ? resultLines.values.join('\n')
                : String(resultLines?.values ?? '');

            const seeds: number[][] = JSON.parse(finalStr);
            
            logger.info(`[RNG Manager] Successfully generated ${numWorkers} independent L'Ecuyer-CMRG seed streams.`);
            return seeds;

        } catch (error) {
            logger.error('[RNG Manager] Failed to generate L\'Ecuyer-CMRG seeds:', error);
            // Fallback to simple seeds if parallel generation fails (not ideal for strict academic rigor, but prevents complete crash)
            logger.warn('[RNG Manager] Falling back to standard pseudo-random seeds.');
            return Array.from({ length: numWorkers }, (_, i) => [initialSeed + i]);
        }
    }
}
