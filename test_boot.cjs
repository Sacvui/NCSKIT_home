const { WebR } = require('webr');
(async () => {
  const webR = new WebR();
  await webR.init();
  await webR.evalR('options(repos = c("https://sem-in-r.r-universe.dev", "https://repo.r-wasm.org"))');
  await webR.evalR('webr::install("seminr")');
  
  const rCode = `
      library(seminr)
      df <- as.data.frame(matrix(rnorm(500*9), ncol=9))
      colnames(df) <- paste0('V', 1:9)
      mm <- constructs(
        composite('F1', multi_items('V', 1:3)),
        composite('F2', multi_items('V', 4:6)),
        composite('F3', multi_items('V', 7:9))
      )
      sm <- relationships(paths(from='F1', to='F3'), paths(from='F2', to='F3'))
      
      pls_model <- estimate_pls(data = df, measurement_model = mm, structural_model = sm)
      orig_summ <- summary(pls_model)
      orig_paths <- orig_summ$paths
      
      n_boot <- 50
      n_obs <- nrow(df)
      path_names <- rownames(orig_paths)
      path_names <- path_names[!grepl("R\\\\^2|AdjR", path_names)]
      
      boot_estimates <- matrix(NA, nrow = n_boot, ncol = length(path_names))
      colnames(boot_estimates) <- path_names
      
      for (b in 1:n_boot) {
        tryCatch({
          idx <- sample(1:n_obs, n_obs, replace = TRUE)
          boot_df <- df[idx, , drop = FALSE]
          boot_pls <- estimate_pls(data = boot_df, measurement_model = mm, structural_model = sm)
          boot_summ <- summary(boot_pls)
          for (pn in path_names) {
            if (pn %in% rownames(boot_summ$paths)) {
              boot_estimates[b, pn] <- boot_summ$paths[pn, 1]
            }
          }
          rm(idx, boot_df, boot_pls, boot_summ)
        }, error = function(e) {})
        
        if (b %% 50 == 0) gc()
      }
      
      orig_vals <- sapply(path_names, function(pn) {
        if (pn %in% rownames(orig_paths)) orig_paths[pn, 1] else NA
      })
      
      boot_mean <- colMeans(boot_estimates, na.rm = TRUE)
      boot_sd <- apply(boot_estimates, 2, sd, na.rm = TRUE)
      t_stat <- orig_vals / boot_sd
      p_val <- 2 * pnorm(-abs(t_stat))
      
      result_paths <- list()
      result_paths[["Original Est."]] <- as.list(orig_vals)
      result_paths[["Boot Mean"]] <- as.list(boot_mean)
      result_paths[["Boot SD"]] <- as.list(boot_sd)
      result_paths[["T Stat."]] <- as.list(t_stat)
      result_paths[["P Value"]] <- as.list(p_val)
      
      final_res <- list(
        boot_paths = result_paths,
        boot_loadings = list(),
        n_bootstrap = n_boot
      )
      
      jsonlite::toJSON(final_res, auto_unbox = TRUE, force = TRUE, digits = 8)
  `;
  
  try {
      const res = await webR.evalR(rCode);
      const str = await res.toJs();
      console.log("RESULT SUCCESS:", str.values[0]);
  } catch(e) {
      console.error("R ERROR:", e);
  }
  process.exit(0);
})();
