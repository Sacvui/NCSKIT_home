library(jsonlite)
x <- list(a = c(p1 = 0.5), b = c(p1 = NaN))
cat(toJSON(x, auto_unbox = TRUE))
