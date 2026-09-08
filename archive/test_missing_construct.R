library(seminr)

data <- data.frame(
  V1 = rnorm(100),
  V2 = rnorm(100),
  V3 = rnorm(100)
)

# Construct A has V1. Construct B has V2. Construct C is missing from mm but in sm!
mm <- constructs(
  composite("A", multi_items("V", 1)),
  composite("B", multi_items("V", 2))
)

sm <- relationships(
  paths(from = "A", to = "B"),
  paths(from = "B", to = "C") # C is missing!
)

tryCatch({
  pls_model <- estimate_pls(data = data, measurement_model = mm, structural_model = sm)
  cat("Success\n")
}, error = function(e) cat("Error:", e$message, "\n"))
