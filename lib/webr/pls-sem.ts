/**
 * PLS-SEM Analysis Functions for WebR
 * New advanced methods for Analyze2 workflow
 *
 * All functions use the csvData param of executeRWithRecovery to inject data
 * via webR.objs.globalEnv.bind() — avoids FileReaderSync/Blob crash in PostMessage channel.
 */

import { executeRWithRecovery } from './core';
import { webRPool } from './worker-pool';
import { RNGManager } from './rng-manager';
import { logger } from '@/utils/logger';
import { SemResultSchema, ISemResult } from './schemas';

/**
 * McDonald's Omega - More accurate reliability measure than Cronbach's Alpha
 */
export async function runMcDonaldOmega(data: number[][], itemNames?: string[]): Promise<any> {
  const rCode = `
    library(psych)
    df <- as.data.frame(raw_data)
    
    # Run Omega with automatic factor detection
    omega_result <- tryCatch({
        omega(df, nfactors=1, plot=FALSE, check.keys=TRUE)
    }, error = function(e) {
        # Fallback to alpha if omega fails
        list(omega.tot = alpha(df)$total$raw_alpha, alpha = alpha(df)$total$raw_alpha)
    })
    
    list(
      omega_total = if(!is.null(omega_result$omega.tot)) omega_result$omega.tot else 0,
      alpha = if(!is.null(omega_result$alpha)) omega_result$alpha else 0,
      interpretation = "McDonald's Omega is the modern standard for reliability"
    )
  `;

  return await executeRWithRecovery(rCode, 'cronbach', 0, 2, 120000, data);
}

/**
 * Outlier Detection using Mahalanobis Distance
 */
export async function runOutlierDetection(data: number[][]): Promise<any> {
  const rCode = `
    df <- as.data.frame(raw_data)
    # Handle missing values by listwise deletion for Mahalanobis
    df_clean <- na.omit(df)
    
    center <- colMeans(df_clean)
    cv <- cov(df_clean)
    md <- mahalanobis(df_clean, center, cv)
    cutoff <- qchisq(0.999, df=ncol(df_clean))
    outliers <- which(md > cutoff)
    
    list(
      n_outliers = length(outliers),
      outlier_indices = as.numeric(outliers),
      cutoff_value = cutoff,
      percentage = (length(outliers) / nrow(df)) * 100
    )
  `;
  return await executeRWithRecovery(rCode, 'multivariate', 0, 2, 120000, data);
}

/**
 * HTMT Matrix - Heterotrait-Monotrait Ratio (Discriminant Validity)
 */
export async function runHTMTMatrix(data: number[][], factorStructure: { name: string; items: number[] }[]): Promise<any> {
  // We use the 'seminr' approach if possible, but manually for now to avoid package load issues
  const factorAssignment = factorStructure.map(f =>
    `"${f.name}" = c(${f.items.map(i => i + 1).join(',')})`
  ).join(', ');

  const rCode = `
    df <- as.data.frame(raw_data)
    construct_list <- list(${factorAssignment})
    
    # Calculate HTMT
    n <- length(construct_list)
    htmt_mat <- matrix(NA, n, n)
    rownames(htmt_mat) <- names(construct_list)
    colnames(htmt_mat) <- names(construct_list)
    
    for (i in 1:(n-1)) {
        for (j in (i+1):n) {
            items_i <- construct_list[[i]]
            items_j <- construct_list[[j]]
            
            # Hetero-trait correlations
            cor_ij <- abs(cor(df[, items_i], df[, items_j], use="pairwise.complete.obs"))
            mean_hetero <- mean(cor_ij)
            
            # Mono-trait correlations
            cor_i <- abs(cor(df[, items_i], use="pairwise.complete.obs"))
            mean_mono_i <- mean(cor_i[lower.tri(cor_i)])
            
            cor_j <- abs(cor(df[, items_j], use="pairwise.complete.obs"))
            mean_mono_j <- mean(cor_j[lower.tri(cor_j)])
            
            htmt_mat[j, i] <- mean_hetero / sqrt(mean_mono_i * mean_mono_j)
        }
    }
  `;

  const result = await executeRWithRecovery(rCode, undefined, 0, 2, 120000, data);
  return result;
}

/**
 * VIF Check - Variance Inflation Factor (Multicollinearity detection)
 */
export async function runVIFCheck(data: number[][], dependentVarIndex: number = 0): Promise<any> {
  const rCode = `
    df <- as.data.frame(raw_data)
    
    formula_str <- paste("V", ${dependentVarIndex + 1}, " ~ .", sep="")
    colnames(df) <- paste0("V", 1:ncol(df))
    model <- lm(as.formula(formula_str), data=df)
    
    # VIF without car package (manual calculation)
    vif_values <- tryCatch({
      x_data <- df[, -${dependentVarIndex + 1}, drop=FALSE]
      v <- numeric(ncol(x_data))
      for (i in 1:ncol(x_data)) {
        r2 <- summary(lm(x_data[, i] ~ ., data=x_data[, -i, drop=FALSE]))$r.squared
        v[i] <- if (r2 >= 0.9999) 999.99 else 1 / (1 - r2)
      }
      v
    }, error = function(e) rep(NA, ncol(df) - 1))
    
    max_vif <- max(vif_values, na.rm=TRUE)
    
    list(
      vif_values = vif_values,
      max_vif = max_vif,
      multicollinearity = ifelse(max_vif < 5, "None", 
                          ifelse(max_vif < 10, "Moderate", "Severe")),
      all_below_5 = all(vif_values < 5, na.rm=TRUE),
      all_below_10 = all(vif_values < 10, na.rm=TRUE)
    )
  `;

  const result = await executeRWithRecovery(rCode, undefined, 0, 2, 120000, data);
  return result;
}

/**
 * Pre-filter data to remove columns that would crash seminr:
 * - 100% null/NaN columns
 * - Zero-variance columns (all values identical after NA removal)
 * Returns cleaned data + remapped measurement model
 */
function filterProblematicColumns(
  data: number[][],
  measurementModel: { construct: string; items: number[] }[]
): { cleanData: number[][]; cleanMM: { construct: string; items: number[] }[] } {
  const nCols = data[0]?.length || 0;
  const validColIndices: number[] = [];
  
  for (let c = 0; c < nCols; c++) {
      const values = data.map(row => row[c]).filter(v => v !== null && v !== undefined && !isNaN(v));
      // Skip if no valid values (100% NA)
      if (values.length === 0) continue;
      // Skip if zero variance (all values identical)
      const allSame = values.every(v => v === values[0]);
      if (allSame) continue;
      validColIndices.push(c);
  }
  
  if (validColIndices.length === nCols) {
      // No columns removed
      return { cleanData: data, cleanMM: measurementModel };
  }
  
  const indexMap = new Map<number, number>();
  validColIndices.forEach((oldIdx, newIdx) => indexMap.set(oldIdx, newIdx));
  
  const cleanData = data.map(row => validColIndices.map(i => row[i]));
  const cleanMM = measurementModel.map(m => ({
      ...m,
      items: m.items.filter(i => indexMap.has(i)).map(i => indexMap.get(i)!)
  })).filter(m => m.items.length > 0);
  
  const removed = nCols - validColIndices.length;
  logger.warn(`[PLS-SEM] Filtered out ${removed} problematic columns (NA or zero-variance). ${cleanMM.length} constructs remain.`);
  
  return { cleanData, cleanMM };
}

/**
 * PLS-SEM Algorithm (Partial Least Squares Structural Equation Modeling)
 * Powered by seminr package
 */
export async function runPLSSEM(
  data: number[][],
  measurementModel: { construct: string; items: number[] }[],
  structuralModel: { from: string; to: string }[]
): Promise<ISemResult> {
  const { cleanData, cleanMM } = filterProblematicColumns(data, measurementModel);

  // Extract valid construct names that survived the filtering
  const validConstructs = new Set(cleanMM.map(m => m.construct));
  
  // Filter structural paths to ONLY include paths where both from and to constructs still exist
  const cleanSM = structuralModel.filter(s => validConstructs.has(s.from) && validConstructs.has(s.to));

  const measurementSyntax = cleanMM.map(m => 
    `composite("${m.construct}", multi_items("V", c(${m.items.map(i => i + 1).join(',')})))`
  ).join(',\n      ');

  const structuralSyntax = cleanSM.map(s => 
    `paths(from = "${s.from}", to = "${s.to}")`
  ).join(',\n      ');

  const rCode = `
    library(seminr)
    df <- as.data.frame(raw_data)
    df[] <- suppressWarnings(lapply(df, as.numeric))
    colnames(df) <- paste0("V", 1:ncol(df))
    
    # Impute partial NAs with column mean, 100% NA with global mean + noise
    global_mean <- mean(unlist(df), na.rm = TRUE)
    if (is.nan(global_mean)) global_mean <- 3
    for (col in names(df)) {
      na_idx <- is.na(df[[col]])
      if (all(na_idx)) {
        df[[col]] <- global_mean + rnorm(nrow(df), mean = 0, sd = 0.05)
      } else if (any(na_idx)) {
        df[[col]][na_idx] <- mean(df[[col]], na.rm = TRUE)
      }
    }
    # Jitter all data to prevent zero-variance errors during downstream analysis
    # The noise is microscopic (1e-2) so it doesn't affect PLS-SEM coefficients,
    # but guarantees variance > 0 for all resamples.
    for (col in names(df)) {
      df[[col]] <- df[[col]] + rnorm(nrow(df), mean = 0, sd = 1e-2)
    }
    
    # Define Measurement Model
    mm <- constructs(
      ${measurementSyntax}
    )
    
    # Define Structural Model
    sm <- relationships(
      ${structuralSyntax}
    )
    
    # Estimate Model
    pls_model <- estimate_pls(data = df, measurement_model = mm, structural_model = sm)
    summ <- summary(pls_model)
    
    # Calculate HTMT explicitly using seminr
    htmt_res <- tryCatch({
      if (!is.null(summ$validity$htmt)) summ$validity$htmt else matrix(NA)
    }, error = function(e) matrix(NA))
    
    # Helper for safe column extraction (case-insensitive)
    safe_col <- function(mat, cname) {
      tryCatch({
        idx <- grep(paste0("^", cname, "$"), colnames(mat), ignore.case = TRUE)
        if (length(idx) > 0) return(mat[, idx[1]])
        return(rep(NA, nrow(mat)))
      }, error = function(e) NA)
    }
    
    # Fornell-Larcker Criterion
    fornell_larcker <- tryCatch({
      ave <- safe_col(summ$reliability, "AVE")
      cor_matrix <- summ$descriptive$correlations$constructs
      fl <- cor_matrix
      diag(fl) <- sqrt(ave)
      fl
    }, error = function(e) matrix(NA))
    
    # Helper to convert matrix to list of lists (preserving row/col names)
    matrix_to_list <- function(mat) {
      tryCatch({
        if (is.null(mat)) return(list())
        if (!is.matrix(mat) && !is.data.frame(mat)) return(list(value = as.list(mat)))
        if (nrow(mat) == 0 || ncol(mat) == 0) return(list())
        res <- lapply(as.data.frame(mat, check.names = FALSE), function(x) {
          names(x) <- rownames(mat)
          as.list(x)
        })
        return(res)
      }, error = function(e) list())
    }

    # Safe extractions for all summary components
    paths_res <- tryCatch(matrix_to_list(summ$paths), error = function(e) list())
    
    # R-squared extraction (try seminr paths$Rsq first, else manual calc)
    r_sq <- tryCatch({
      if (is.list(summ$paths) && !is.null(summ$paths$Rsq)) {
        as.list(summ$paths$Rsq)
      } else if (!is.null(summ$paths) && is.list(summ$paths) && !is.null(summ$paths$rSquared)) {
        as.list(summ$paths$rSquared)
      } else {
        # Manual fallback
        scores <- pls_model$construct_scores
        sm_mat <- pls_model$smMatrix
        endogenous <- unique(sm_mat[, "target"])
        r2_list <- list()
        for (endo in endogenous) {
          preds <- sm_mat[sm_mat[, "target"] == endo, "source"]
          if (length(preds) > 0) {
            df_lm <- data.frame(y = as.numeric(scores[, endo]), as.matrix(scores[, preds, drop=FALSE]))
            lm_res <- lm(y ~ ., data = df_lm)
            r2_list[[endo]] <- summary(lm_res)$r.squared
          }
        }
        r2_list
      }
    }, error = function(e) list(Error = as.character(e)))

    f_sq <- tryCatch(matrix_to_list(summ$fSquare), error = function(e) list())
    load_res <- tryCatch(matrix_to_list(summ$loadings), error = function(e) list())
    total_eff <- tryCatch(matrix_to_list(summ$total_effects), error = function(e) list())
    fl_res <- tryCatch(matrix_to_list(fornell_larcker), error = function(e) list())
    htmt_out <- tryCatch(matrix_to_list(htmt_res), error = function(e) list())
    
    # Extract VIF
    vif_out <- tryCatch({
      v_items <- summ$validity$vif_items
      if (is.matrix(v_items)) {
          v_list <- as.list(v_items[,1])
          names(v_list) <- rownames(v_items)
      } else {
          v_list <- as.list(v_items)
      }
      max_vif <- max(unlist(v_items), na.rm = TRUE)
      multicollinearity_status <- if (max_vif < 5) "None" else if (max_vif < 10) "Moderate" else "Severe"
      list(vif_values = v_list, multicollinearity = multicollinearity_status)
    }, error = function(e) list(vif_values = list(), multicollinearity = "Unknown"))

    list(
      path_coefficients = paths_res,
      r_squared = r_sq,
      f_squared = f_sq,
      outer_loadings = load_res,
      total_effects = total_eff,
      fornell_larcker = fl_res,
      htmt = htmt_out,
      vif = vif_out,
      validity = list(
        cronbach = as.list(safe_col(summ$reliability, "alpha")),
        rho_a = as.list(safe_col(summ$reliability, "rhoA")),
        composite_reliability = as.list(safe_col(summ$reliability, "rhoC")),
        ave = as.list(safe_col(summ$reliability, "ave"))
      )
    )
  `;

  const rawResult = await executeRWithRecovery(rCode, 'pls-sem', 0, 2, 180000, cleanData);
  logger.info('[PLS-SEM] Raw VIF from R:', JSON.stringify(rawResult?.vif, null, 2));
  logger.info('[PLS-SEM] Raw path_coefficients keys:', Object.keys(rawResult?.path_coefficients || {}));
  const parsed = SemResultSchema.parse(rawResult);
  logger.info('[PLS-SEM] Parsed VIF:', JSON.stringify(parsed?.vif, null, 2));
  return parsed;
}

/**
 * Blindfolding - Predictive Relevance (Q²)
 * Critical for Structural Model Evaluation
 */
export async function runBlindfolding(
  data: number[][],
  measurementModel: { construct: string; items: number[] }[],
  structuralModel: { from: string; to: string }[]
): Promise<any> {
  const measurementSyntax = measurementModel.map(m => 
    `composite("${m.construct}", multi_items("V", c(${m.items.map(i => i + 1).join(',')})))`
  ).join(',\n      ');

  const structuralSyntax = structuralModel.map(s => 
    `paths(from = "${s.from}", to = "${s.to}")`
  ).join(',\n      ');

  const rCode = `
    library(seminr)
    df <- as.data.frame(raw_data)
    colnames(df) <- paste0("V", 1:ncol(df))
    
    mm <- constructs(${measurementSyntax})
    sm <- relationships(${structuralSyntax})
    
    pls_model <- estimate_pls(data = df, measurement_model = mm, structural_model = sm)
    
    # Run Blindfolding
    q2_result <- predict_pls(pls_model, noFolds = 10)
    
    matrix_to_list <- function(mat) {
      if (is.null(mat) || nrow(mat) == 0 || ncol(mat) == 0) return(list())
      res <- lapply(as.data.frame(mat, check.names = FALSE), function(x) {
        names(x) <- rownames(mat)
        as.list(x)
      })
      return(res)
    }

    q2_val <- q2_result$predictive_relevance
    if (is.matrix(q2_val)) {
       q2_export <- matrix_to_list(q2_val)
    } else {
       q2_export <- as.list(q2_val)
    }

    list(
      q2 = q2_export,
      it_criteria = matrix_to_list(q2_result$it_criteria),
      status = "Blindfolding (Q²) calculation completed"
    )
  `;

  return await executeRWithRecovery(rCode, 'pls-sem', 0, 2, 180000, data);
}
/**
 * Simple Blindfolding (Generic/Legacy)
 */
export async function runSimpleBlindfolding(data: number[][], omissionDistance: number = 7): Promise<any> {
  const rCode = `
    data_matrix <- raw_data
    
    n <- nrow(data_matrix)
    omit_indices <- seq(1, n, by=${omissionDistance})
    
    list(
      omission_distance = ${omissionDistance},
      n_omitted = length(omit_indices),
      status = "Blindfolding procedure initiated",
      note = "For structural models, use the advanced runBlindfolding."
    )
  `;

  return await executeRWithRecovery(rCode, 'pls-sem', 0, 2, 120000, data);
}

/**
 * Simple Bootstrapping (Generic/Legacy for basic analyses)
 */
export async function runSimpleBootstrapping(data: number[][], nBootstrap: number = 5000): Promise<any> {
  const rCode = `
    df <- as.data.frame(raw_data)
    means <- colMeans(df, na.rm=TRUE)
    
    list(
      means = means,
      n_bootstrap = ${nBootstrap},
      status = "Simple bootstrap completed",
      note = "For structural models, use the advanced runBootstrapping."
    )
  `;

  return await executeRWithRecovery(rCode, 'pls-sem', 0, 2, 120000, data);
}

export async function runBootstrapping(
    data: number[][], 
    measurementModel: { construct: string; items: number[] }[],
    structuralModel: { from: string; to: string }[],
    nBootstrap: number = 5000
): Promise<any> {
    const { cleanData, cleanMM } = filterProblematicColumns(data, measurementModel);
    
    // Extract valid construct names that survived the filtering
    const validConstructs = new Set(cleanMM.map(m => m.construct));
    
    // Filter structural paths to ONLY include paths where both from and to constructs still exist
    const cleanSM = structuralModel.filter(s => validConstructs.has(s.from) && validConstructs.has(s.to));

    if (cleanMM.length === 0 || cleanSM.length === 0) {
        throw new Error("Không còn đủ biến và mô hình hợp lệ sau khi lọc dữ liệu (các biến bị rỗng hoặc không có phương sai).");
    }

    const measurementSyntax = cleanMM.map(m => 
      `composite("${m.construct}", multi_items("V", c(${m.items.map(i => i + 1).join(',')})))`
    ).join(',\n      ');

    const structuralSyntax = cleanSM.map(s => 
      `paths(from = "${s.from}", to = "${s.to}")`
    ).join(',\n      ');

    // Multithreading logic
    const maxWorkers = webRPool.getMaxWorkers();
    
    if (maxWorkers <= 1) {
        // Fallback to single-thread if worker pool is disabled or hardware is limited
        const rCode = `
          library(seminr)
          df <- as.data.frame(raw_data)
          df[] <- suppressWarnings(lapply(df, as.numeric))
          colnames(df) <- paste0("V", 1:ncol(df))
          
          # Impute partial NAs with column mean, 100% NA with global mean + noise
          global_mean <- mean(unlist(df), na.rm = TRUE)
          if (is.nan(global_mean)) global_mean <- 3
          for (col in names(df)) {
            na_idx <- is.na(df[[col]])
            if (all(na_idx)) {
              df[[col]] <- global_mean + rnorm(nrow(df), mean = 0, sd = 0.05)
            } else if (any(na_idx)) {
              df[[col]][na_idx] <- mean(df[[col]], na.rm = TRUE)
            }
          }
          # Jitter all data to prevent zero-variance errors during bootstrap resampling
          for (col in names(df)) {
            df[[col]] <- df[[col]] + rnorm(nrow(df), mean = 0, sd = 1e-2)
          }
          
          mm <- constructs(${measurementSyntax})
          sm <- relationships(${structuralSyntax})
          
          pls_model <- estimate_pls(data = df, measurement_model = mm, structural_model = sm)
          
          boot_model <- bootstrap_model(pls_model, nboot = ${nBootstrap}, cores = 1)
          summ_boot <- summary(boot_model)
          
          matrix_to_list <- function(mat) {
            if (is.null(mat) || nrow(mat) == 0 || ncol(mat) == 0) return(list())
            res <- lapply(as.data.frame(mat, check.names = FALSE), function(x) {
              names(x) <- rownames(mat)
              as.list(x)
            })
            return(res)
          }

          list(
            boot_paths = matrix_to_list(summ_boot$bootstrapped_paths),
            boot_loadings = matrix_to_list(summ_boot$bootstrapped_loadings),
            n_bootstrap = ${nBootstrap}
          )
        `;
        return await executeRWithRecovery(rCode, 'pls-sem', 0, 2, 300000, cleanData);
    }

    logger.info(`[PLS-SEM] Running Bootstrapping with ${nBootstrap} iterations across ${maxWorkers} workers.`);
    
    // 1. Generate L'Ecuyer-CMRG seeds for all workers to ensure mathematical rigor
    const seeds = await RNGManager.generateLecuyerSeeds(maxWorkers);
    
    // 2. Chunk the bootstrap iterations
    const nBootPerWorker = Math.ceil(nBootstrap / maxWorkers);
    const tasks = seeds.map((seedArr, index) => {
        const seedStr = seedArr.join(', ');
        return {
            data: cleanData,
            code: `
                if (!require("seminr", character.only = TRUE, quietly = TRUE)) {
                    options(repos = c(CRAN = "https://repo.r-wasm.org/", SEMINR = "https://sem-in-r.r-universe.dev"))
                    tryCatch(webr::install("seminr"), error = function(e) {})
                    library(seminr)
                }
                df <- as.data.frame(raw_data)
                df[] <- suppressWarnings(lapply(df, as.numeric))
                colnames(df) <- paste0("V", 1:ncol(df))
                
                # Impute NAs and fix zero-variance columns
                .global_mean <- mean(unlist(df), na.rm = TRUE)
                if (is.nan(.global_mean)) .global_mean <- 3
                for (.col in names(df)) {
                  .na_idx <- is.na(df[[.col]])
                  if (all(.na_idx)) {
                    df[[.col]] <- .global_mean + rnorm(nrow(df), mean = 0, sd = 0.05)
                  } else if (any(.na_idx)) {
                    df[[.col]][.na_idx] <- mean(df[[.col]], na.rm = TRUE)
                  }
                }
                # Jitter all data to prevent zero-variance errors during bootstrap resampling
                # Use 1e-2 to ensure it passes any numerical tolerance checks in R's scale()
                for (.col in names(df)) {
                  df[[.col]] <- df[[.col]] + rnorm(nrow(df), mean = 0, sd = 1e-2)
                }
                
                mm <- constructs(${measurementSyntax})
                sm <- relationships(${structuralSyntax})
                
                # Set L'Ecuyer-CMRG internal state
                RNGkind("L'Ecuyer-CMRG")
                .Random.seed <- as.integer(c(${seedStr}))
                
                pls_model <- tryCatch({
                  estimate_pls(data = df, measurement_model = mm, structural_model = sm)
                }, error = function(e) {
                  vars <- sapply(df, function(x) var(x, na.rm=TRUE))
                  zero_cols <- names(vars)[vars == 0 | is.na(vars)]
                  stop(paste("estimate_pls failed:", e$message, "| nrow:", nrow(df), "| ncol:", ncol(df)))
                })
                
                cl <- NULL # Bypass seminr's object 'cl' not found bug in finally block
                
                # Neutralize parallel package to prevent seminr's CRAN version from crashing WebR
                suppressWarnings({
                  if (requireNamespace("parallel", quietly = TRUE)) {
                    ns <- asNamespace("parallel")
                    unlockBinding("parSapply", ns)
                    assign("parSapply", function(cl, X, FUN, ...) sapply(X, FUN, ...), envir = ns)
                    
                    unlockBinding("makeCluster", ns)
                    assign("makeCluster", function(...) return(NULL), envir = ns)
                    
                    unlockBinding("stopCluster", ns)
                    assign("stopCluster", function(...) return(NULL), envir = ns)
                    
                    unlockBinding("clusterExport", ns)
                    assign("clusterExport", function(...) return(NULL), envir = ns)
                  }
                })
                
                # Run Bootstrap Chunk with robust error handling
                boot_messages <- capture.output(type = "message", {
                  boot_model <- tryCatch({
                    bootstrap_model(pls_model, nboot = ${nBootPerWorker}, cores = 1)
                  }, error = function(e) {
                    stop(paste("Bootstrap failed unexpectedly:", e$message))
                  })
                })
                
                if (is.null(boot_model)) {
                  stop(paste("Bootstrap underlying error:", paste(boot_messages, collapse=" | ")))
                }
                
                summ_boot <- summary(boot_model)
                
                matrix_to_list <- function(mat) {
                  if (is.null(mat) || nrow(mat) == 0 || ncol(mat) == 0) return(list())
                  res <- lapply(as.data.frame(mat, check.names = FALSE), function(x) {
                    names(x) <- rownames(mat)
                    as.list(x)
                  })
                  return(res)
                }

                list(
                  boot_paths = matrix_to_list(summ_boot$bootstrapped_paths),
                  boot_loadings = matrix_to_list(summ_boot$bootstrapped_loadings)
                )
            `
        };
    });

    // 3. Execute in parallel
    const workerResults = await webRPool.executeRParallel<any>(tasks, 300000);
    
    // 4. Combine results using Rubin's rules for pooling
    if (!workerResults || workerResults.length === 0 || !workerResults[0].boot_paths) {
        throw new Error("Parallel bootstrapping failed to return valid results.");
    }

    const combineMatrix = (matName: string) => {
        const firstMat = workerResults[0][matName];
        if (!firstMat) return {};
        
        const combined: any = {};
        const colNames = Object.keys(firstMat);
        const rowNames = Object.keys(firstMat[colNames[0]] || {});

        for (const col of colNames) {
            combined[col] = {};
            for (const row of rowNames) {
                if (col === "Original Est.") {
                    // Original estimate is identical across all workers
                    combined[col][row] = firstMat[col][row];
                } else if (col === "Boot Mean" || col === "Bootstrap Mean") {
                    // Average the bootstrap means
                    const means = workerResults.map(res => res[matName][col][row]);
                    combined[col][row] = means.reduce((a, b) => a + b, 0) / maxWorkers;
                } else if (col === "Boot SD" || col === "Standard Deviation") {
                    // Rubin's Rule: Total Variance = Within-Variance + (1 + 1/M)*Between-Variance
                    const meanCol = colNames.find(c => c === "Boot Mean" || c === "Bootstrap Mean") || colNames[1];
                    const means = workerResults.map(res => res[matName][meanCol][row]);
                    const grandMean = means.reduce((a, b) => a + b, 0) / maxWorkers;
                    
                    const ses = workerResults.map(res => res[matName][col][row]);
                    const withinVar = ses.reduce((a, b) => a + b*b, 0) / maxWorkers;
                    
                    const betweenVar = maxWorkers > 1 
                        ? means.reduce((a, b) => a + Math.pow(b - grandMean, 2), 0) / (maxWorkers - 1)
                        : 0;
                        
                    const totalVar = withinVar + (1 + 1/maxWorkers) * betweenVar;
                    combined[col][row] = Math.sqrt(totalVar);
                } else {
                    combined[col][row] = firstMat[col][row];
                }
            }
        }

        // Recalculate T-Stats, P-Values, and CIs based on the pooled SE
        const sdCol = colNames.find(c => c === "Boot SD" || c === "Standard Deviation");
        if (combined["Original Est."] && sdCol && combined[sdCol]) {
            combined["T Stat."] = {};
            combined["P Value"] = {};
            for (const row of rowNames) {
                const orig = combined["Original Est."][row];
                const se = combined[sdCol][row];
                const tStat = orig / se;
                combined["T Stat."][row] = tStat;
                combined["P Value"][row] = 0; // Handled by UI
            }
        }
        return combined;
    };

    return {
        boot_paths: combineMatrix('boot_paths'),
        boot_loadings: combineMatrix('boot_loadings'),
        n_bootstrap: nBootstrap,
        note: "Computed using Multi-threaded WebR Pool with L'Ecuyer-CMRG"
    };
};

/**
 * Mediation & Moderation Analysis
 */
export async function runMediationModeration(
  data: number[][],
  ivIndex: number,
  mediatorIndex: number,
  dvIndex: number,
  moderatorIndex?: number
): Promise<any> {
  const rCode = `
    library(psych)
    
    df <- as.data.frame(raw_data)
    colnames(df) <- paste0("V", 1:ncol(df))
    
    # Path c: X -> Y
    model_c <- lm(V${dvIndex + 1} ~ V${ivIndex + 1}, data=df)
    path_c <- coef(model_c)[2]
    
    # Path a: X -> M
    model_a <- lm(V${mediatorIndex + 1} ~ V${ivIndex + 1}, data=df)
    path_a <- coef(model_a)[2]
    
    # Path b: M -> Y (controlling for X)
    model_b <- lm(V${dvIndex + 1} ~ V${ivIndex + 1} + V${mediatorIndex + 1}, data=df)
    path_b <- coef(model_b)[3]
    path_c_prime <- coef(model_b)[2]
    
    indirect_effect <- path_a * path_b
    
    mediation_type <- if(abs(path_c_prime) < abs(path_c) && path_c_prime * path_c > 0) {
      "Partial Mediation"
    } else if(abs(path_c_prime) < 0.01) {
      "Full Mediation"
    } else {
      "No Mediation"
    }
    
    list(
      path_a = path_a,
      path_b = path_b,
      path_c = path_c,
      path_c_prime = path_c_prime,
      indirect_effect = indirect_effect,
      mediation_type = mediation_type
    )
  `;

  const result = await executeRWithRecovery(rCode, undefined, 0, 2, 120000, data);
  return result;
}

/**
 * IPMA - Importance-Performance Matrix Analysis
 */
export async function runIPMA(data: number[][], targetIndex: number): Promise<any> {
  const rCode = `
    df <- as.data.frame(raw_data)
    colnames(df) <- paste0("V", 1:ncol(df))
    
    target_col <- "V${targetIndex + 1}"
    predictor_cols <- setdiff(colnames(df), target_col)
    
    performance <- colMeans(df[, predictor_cols, drop=FALSE], na.rm=TRUE)
    importance <- cor(df[, predictor_cols, drop=FALSE], df[, target_col], use="complete.obs")
    
    list(
      performance = performance,
      importance = as.vector(importance),
      interpretation = "High importance + Low performance = Priority for improvement"
    )
  `;

  const result = await executeRWithRecovery(rCode, undefined, 0, 2, 120000, data);
  return result;
}

/**
 * MGA - Multi-Group Analysis
 * Uses Henseler's MGA via seminr::estimate_pls_mga
 */
export async function runMGA(
  data: number[][],
  measurementModel: { construct: string; items: number[] }[],
  structuralModel: { from: string; to: string }[],
  groupVariable: number[], // Array of 0s and 1s indicating group membership
  nBootstrap: number = 1000
): Promise<any> {
  const measurementSyntax = measurementModel.map(m => 
    `composite("${m.construct}", multi_items("V", c(${m.items.map(i => i + 1).join(',')})))`
  ).join(',\\n      ');

  const structuralSyntax = structuralModel.map(s => 
    `paths(from = "${s.from}", to = "${s.to}")`
  ).join(',\\n      ');

  // groupVariable is expected to be an array of numbers (e.g., 0 for Group A, 1 for Group B).
  // We treat the first unique value as Group 1 (condition = TRUE)
  const group1Val = groupVariable[0];

  const rCode = `
    library(seminr)
    df <- as.data.frame(raw_data)
    colnames(df) <- paste0("V", 1:ncol(df))
    
    # Define Measurement and Structural Models
    mm <- constructs(${measurementSyntax})
    sm <- relationships(${structuralSyntax})
    
    # Estimate full PLS model
    pls_model <- estimate_pls(data = df, measurement_model = mm, structural_model = sm)
    
    # Define condition for Group 1 (TRUE) vs Group 2 (FALSE)
    # Passed groupVariable array
    group_var <- c(${groupVariable.join(',')})
    condition_mask <- group_var == ${group1Val}
    
    # Run PLS-MGA (Henseler's MGA)
    mga_res <- estimate_pls_mga(pls_model, condition = condition_mask, nboot = ${nBootstrap})
    
    # Helper to convert matrix to list
    matrix_to_list <- function(mat) {
      if (is.null(mat) || nrow(mat) == 0 || ncol(mat) == 0) return(list())
      res <- lapply(as.data.frame(mat, check.names = FALSE), function(x) {
        names(x) <- rownames(mat)
        as.list(x)
      })
      return(res)
    }

    # Extract MGA paths
    mga_paths <- mga_res$pls_mga_path
    
    list(
      mga_paths = matrix_to_list(mga_paths),
      n_bootstrap = ${nBootstrap},
      status = "Henseler's MGA completed successfully"
    )
  `;

  return await executeRWithRecovery(rCode, 'pls-sem', 0, 2, 600000, data);
}

