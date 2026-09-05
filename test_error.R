x <- c(1,1,1)
tryCatch({
  scale(x)
}, error = function(e) cat("scale error:", e$message, "\n"))
