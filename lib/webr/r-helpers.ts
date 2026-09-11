/**
 * R Script Helpers for WebR Validation & Protection
 * Centralizes safety checks to prevent WebAssembly / LAPACK aborts.
 */

export const R_SNIPPETS = {
    /**
     * Checks if a matrix is singular or ill-conditioned using eigenvalues.
     * Use this before passing matrices to `psych::fa()`, `psych::omega()`, or `solve()`.
     * 
     * Requires variables:
     * - `df`: The input data frame (numeric only)
     * 
     * Variables it creates/modifies:
     * - `cor_mat`: Correlation matrix
     * - `eigenvalues`: Array of eigenvalues
     */
    validateMatrixSingularity: `
    cor_mat <- suppressWarnings(cor(df, use = "pairwise.complete.obs"))
    
    if (any(is.na(cor_mat))) { 
        stop("Lỗi: Dữ liệu có giá trị khuyết (NA) hoặc biến không đổi (phương sai = 0). Vui lòng làm sạch dữ liệu.") 
    }
    
    # Calculate eigenvalues (eigen is stable and won't crash WASM LAPACK)
    eigenvalues <- eigen(cor_mat, symmetric=TRUE, only.values=TRUE)$values

    # CRITICAL: If the smallest eigenvalue is near zero, the matrix is singular (perfect collinearity)
    if (min(eigenvalues) < 1e-6) {
        stop("Lỗi: Ma trận dữ liệu không xác định dương (có đa cộng tuyến hoàn hảo hoặc kết hợp tuyến tính). Hệ thống đã chặn phân tích để ngăn sự cố.")
    }
    `
};
