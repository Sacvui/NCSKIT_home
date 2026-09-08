library(seminr)

data <- data.frame(
  V1 = c(rep(3, 99), 4),
  V2 = rnorm(100),
  V3 = rnorm(100),
  V4 = rnorm(100)
)

data[] <- lapply(data, function(x) x + rnorm(length(x), 0, 1e-10))

mm <- constructs(
  composite("A", multi_items("V", 1:2)),
  composite("B", multi_items("V", 3:4))
)
sm <- relationships(
  paths(from = "A", to = "B")
)

pls_model <- estimate_pls(data = data, measurement_model = mm, structural_model = sm)
boot_model <- bootstrap_model(pls_model, nboot = 100, cores = 1)
cat("Success!\n")
