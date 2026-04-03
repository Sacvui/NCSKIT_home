/**
 * WebR Utility Functions
 */

/**
 * Translate R errors to user-friendly Vietnamese messages
 */
export function translateRError(error: string): string {
    const errorMap: Record<string, string> = {
        'subscript out of bounds': 'Không tìm thấy biến được chọn. Kiểm tra lại tên cột.',
        'not enough observations': 'Không đủ dữ liệu để phân tích. Cần ít nhất 30 quan sát.',
        'singular matrix': 'Ma trận đặc dị - có đa cộng tuyến hoàn hảo hoặc biến hằng số.',
        'computational singular': 'Lỗi tính toán - dữ liệu có vấn đề về đa cộng tuyến.',
        'missing value': 'Dữ liệu chứa giá trị trống (NA). Hãy làm sạch dữ liệu trước.',
        'model is not identified': 'Mô hình SEM/CFA không xác định. Cần >= 3 biến/nhân tố.',
        'could not find function': 'Gói R chưa tải xong. Vui lòng thử lại sau 5 giây.',
        'covariance matrix is not positive definite': 'Ma trận hiệp phương sai không xác định dương. Kiểm tra đa cộng tuyến.',
        'object not found': 'Không tìm thấy đối tượng R. Có thể do lỗi khởi tạo.',
        'package not available': 'Gói R không khả dụng. Đang thử cài đặt lại...'
    };

    for (const [key, translation] of Object.entries(errorMap)) {
        if (error.toLowerCase().includes(key.toLowerCase())) {
            return translation;
        }
    }

    return `Lỗi R: ${error.substring(0, 100)}...`;
}

/**
 * Helper to parse WebR evaluation result (list) into a getter function
 */
export function parseWebRResult(jsResult: any) {
    if (!jsResult) return (name: string) => null;
    
    return (name: string): any => {
        let val: any = null;

        // Case 1: Plain JS object (unpacked)
        if (jsResult[name] !== undefined) {
            val = jsResult[name];
        } 
        // Case 2: Raw WebR toJs() object
        else if (jsResult.names && jsResult.values) {
            const idx = jsResult.names.indexOf(name);
            if (idx !== -1) {
                val = jsResult.values[idx];
                // Handle nested WebR structure { type: '...', values: [...] }
                if (val && typeof val === 'object' && val.values !== undefined) {
                    val = val.values;
                }
            }
        }

        if (val === null || val === undefined) return null;

        // Ensure we always return a standard JS array for UI consistency
        if (Array.isArray(val)) return val;
        
        // Handle TypedArrays (Float64Array, etc.) which are common in WebR
        if (val && typeof val === 'object' && typeof val.length === 'number' && val.buffer) {
            return Array.from(val);
        }

        // Single value
        return [val];
    };
}

/**
 * Helper to parse flat array to matrix
 */
export function parseMatrix(val: any, dim: number): number[][] {
    if (!val || !Array.isArray(val)) return [];
    const matrix: number[][] = [];
    for (let i = 0; i < dim; i++) {
        matrix.push(val.slice(i * dim, (i + 1) * dim));
    }
    return matrix;
}

/**
 * Convert JS array to R matrix string
 */
export function arrayToRMatrix(data: (number | null | undefined)[][]): string {
    const flat = data.flat().map(v => (v === null || v === undefined || isNaN(v as number)) ? 'NA' : v);
    return `matrix(c(${flat.join(',')}), nrow=${data.length}, byrow=TRUE)`;
}
