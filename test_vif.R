library(seminr)
mobi <- mobi
mobi_mm <- constructs(
  composite("Image",        multi_items("IMAG", 1:5)),
  composite("Expectation",  multi_items("CUEX", 1:3)),
  composite("Value",        multi_items("PERV", 1:2)),
  composite("Satisfaction", multi_items("CUSA", 1:3))
)
mobi_sm <- relationships(
  paths(from = c("Image", "Expectation"), to = c("Value", "Satisfaction")),
  paths(from = "Value", to = "Satisfaction")
)
pls_model <- estimate_pls(data = mobi, measurement_model = mobi_mm, structural_model = mobi_sm)
summ <- summary(pls_model)
names(summ$validity)
summ$validity$vif_items
