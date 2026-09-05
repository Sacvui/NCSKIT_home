import { WebR } from 'webr';

async function main() {
  const webr = new WebR();
  await webr.init();
  console.log('WebR initialized');
  
  await webr.evalRVoid(`
    webr::install("seminr")
  `);
  console.log('seminr installed');

  // Let's copy the R code from runPLSSEM
  const rCode = `
    library(seminr)
    # mock data
    df <- mobi
    colnames(df) <- paste0("V", 1:ncol(df)) # V1 to V24
    
    # Define Measurement Model
    mm <- constructs(
      composite("Image", multi_items("V", c(1,2,3,4,5))),
      composite("Expectation", multi_items("V", c(6,7,8))),
      composite("Loyalty", multi_items("V", c(22,23,24)))
    )
    
    # Define Structural Model
    sm <- relationships(
      paths(from = "Image", to = "Expectation"),
      paths(from = "Image", to = "Loyalty"),
      paths(from = "Expectation", to = "Loyalty")
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
      # Replace diagonal with sqrt(AVE)
      if (length(ave) == nrow(fl) && !any(is.na(ave))) {
        diag(fl) <- sqrt(ave)
      }
      fl
    }, error = function(e) matrix(NA))
    
    # Parse paths securely
    paths_data <- NULL
    if (is.matrix(summ$paths) || is.data.frame(summ$paths)) {
        paths_data <- summ$paths
    } else if (is.list(summ$paths) && !is.null(summ$paths$coefficients)) {
        paths_data <- summ$paths$coefficients
    }
    
    # Extract metrics safely
    list(
      paths = if(!is.null(paths_data)) paths_data else matrix(NA),
      rSquared = if(!is.null(summ$paths) && is.list(summ$paths)) summ$paths$rSquared else matrix(NA),
      fSquare = if(!is.null(summ$fSquare)) summ$fSquare else matrix(NA),
      reliability = if(!is.null(summ$reliability)) summ$reliability else matrix(NA),
      htmt = htmt_res,
      fornell_larcker = fornell_larcker,
      vif = if(!is.null(summ$validity$vif_items)) summ$validity$vif_items else matrix(NA),
      loadings = if(!is.null(summ$loadings)) summ$loadings else matrix(NA),
      weights = if(!is.null(summ$weights)) summ$weights else matrix(NA)
    )
  `;
  
  const res = await webr.evalR(rCode);
  const result = await res.toJs();
  console.log("PLS-SEM run successfully!");
  console.log("Result summary contains keys:", Object.keys(result.values || {}));
  
  webr.destroy();
}

main().catch(console.error);
