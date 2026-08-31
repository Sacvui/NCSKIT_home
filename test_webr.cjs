const { WebR } = require('webr');

(async () => {
  const webR = new WebR();
  await webR.init();
  console.log("WebR initialized");

  await webR.evalR(`
    webr::install("seminr")
    library(seminr)
    mobi <- mobi
    
    mm <- constructs(
      composite("Image",        multi_items("IMAG", 1:5)),
      composite("Expectation",  multi_items("CUEX", 1:3)),
      composite("Value",        multi_items("PERV", 1:2))
    )
    
    sm <- relationships(
      paths(from = "Image",        to = c("Expectation", "Value")),
      paths(from = "Expectation",  to = "Value")
    )
    
    pls_model <- estimate_pls(data = mobi, measurement_model = mm, structural_model = sm)
    summ <- summary(pls_model)
    
    print(names(summ))
    
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
    print(r2_list)
    
    .json <- jsonlite::toJSON(list(r2=r2_list), auto_unbox = TRUE, force = TRUE, digits = 8)
    print(.json)
  `);
  
  process.exit(0);
})();
