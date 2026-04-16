/**
 * WebR Utility Functions
 */

// ─── User-Friendly Error Types ────────────────────────────────────────────────

/**
 * Structured error object shown to end users.
 * All R errors should be translated to this format before display.
 */
export interface UserFriendlyError {
    /** Short title shown in error heading (e.g. "Không đủ dữ liệu") */
    title: string;
    /** Detailed explanation in plain Vietnamese */
    message: string;
    /** Actionable suggestion for the user */
    suggestion: string;
    /** Whether the user can retry the same analysis */
    canRetry: boolean;
    /** Whether to show a "Báo cáo lỗi" button */
    canReport: boolean;
}

// ─── Error mapping table ──────────────────────────────────────────────────────

interface ErrorMapping {
    pattern: RegExp;
    result: UserFriendlyError;
}

const ERROR_MAPPINGS: ErrorMapping[] = [
    {
        pattern: /not enough observations|too few observations|need at least/i,
        result: {
            title: 'Không đủ dữ liệu',
            message: 'Cần ít nhất 30 quan sát để phân tích đáng tin cậy.',
            suggestion: 'Thu thập thêm dữ liệu hoặc giảm số biến phân tích.',
            canRetry: false,
            canReport: false,
        },
    },
    {
        pattern: /singular matrix|computational singular|system is computationally singular/i,
        result: {
            title: 'Đa cộng tuyến hoàn hảo',
            message: 'Hai hoặc nhiều biến có tương quan hoàn hảo (r = 1.0) hoặc một biến là hằng số.',
            suggestion: 'Kiểm tra và loại bỏ các biến trùng lặp, biến hằng số, hoặc biến có phương sai = 0.',
            canRetry: false,
            canReport: false,
        },
    },
    {
        pattern: /missing value|na values|na\/nan|contains na/i,
        result: {
            title: 'Dữ liệu có giá trị trống',
            message: 'Dữ liệu chứa giá trị NA, NaN hoặc ô trống không thể phân tích.',
            suggestion: 'Làm sạch dữ liệu: xóa các hàng có giá trị trống hoặc thay thế bằng giá trị trung bình.',
            canRetry: true,
            canReport: false,
        },
    },
    {
        pattern: /model is not identified|not identified|underidentified/i,
        result: {
            title: 'Mô hình không xác định',
            message: 'Mô hình SEM/CFA không đủ điều kiện để ước lượng (underidentified).',
            suggestion: 'Mỗi nhân tố cần ít nhất 3 biến quan sát. Kiểm tra lại cấu trúc mô hình.',
            canRetry: false,
            canReport: false,
        },
    },
    {
        pattern: /could not find function|no package called|there is no package/i,
        result: {
            title: 'Thư viện R chưa sẵn sàng',
            message: 'Gói R cần thiết chưa được tải xong.',
            suggestion: 'Đợi R Engine khởi động hoàn tất (thanh tiến trình màu xanh) rồi thử lại.',
            canRetry: true,
            canReport: false,
        },
    },
    {
        pattern: /covariance matrix is not positive definite|not positive definite/i,
        result: {
            title: 'Ma trận hiệp phương sai không hợp lệ',
            message: 'Ma trận hiệp phương sai không xác định dương — thường do đa cộng tuyến hoặc cỡ mẫu quá nhỏ.',
            suggestion: 'Tăng cỡ mẫu, loại bỏ biến có tương quan cao (r > 0.9), hoặc giảm số nhân tố.',
            canRetry: false,
            canReport: false,
        },
    },
    {
        pattern: /subscript out of bounds|index out of bounds/i,
        result: {
            title: 'Lỗi chỉ số dữ liệu',
            message: 'Không tìm thấy biến hoặc cột được chọn trong dữ liệu.',
            suggestion: 'Kiểm tra lại tên cột và đảm bảo dữ liệu đã được tải đúng.',
            canRetry: true,
            canReport: false,
        },
    },
    {
        pattern: /object.*not found|undefined variable/i,
        result: {
            title: 'Biến R không tồn tại',
            message: 'R không tìm thấy đối tượng cần thiết — có thể do lỗi khởi tạo engine.',
            suggestion: 'Thử làm mới trang và chạy lại phân tích.',
            canRetry: true,
            canReport: true,
        },
    },
    {
        pattern: /timeout|timed out/i,
        result: {
            title: 'Phân tích quá thời gian',
            message: 'Phân tích mất quá nhiều thời gian và bị dừng tự động.',
            suggestion: 'Giảm số biến, giảm số lần bootstrap, hoặc dùng dataset nhỏ hơn.',
            canRetry: true,
            canReport: false,
        },
    },
    {
        pattern: /promise already under evaluation|filereadersync|blob/i,
        result: {
            title: 'R Engine bị treo',
            message: 'Hệ thống R gặp lỗi nội bộ và đã được khởi động lại tự động.',
            suggestion: 'Vui lòng thử lại phân tích sau vài giây.',
            canRetry: true,
            canReport: false,
        },
    },
    {
        pattern: /binary.*outcome|biến phụ thuộc.*nhị phân|must be binary/i,
        result: {
            title: 'Biến phụ thuộc không hợp lệ',
            message: 'Logistic Regression yêu cầu biến phụ thuộc là nhị phân (chỉ có 2 giá trị: 0/1).',
            suggestion: 'Chọn biến phụ thuộc chỉ có 2 giá trị phân biệt.',
            canRetry: false,
            canReport: false,
        },
    },
    {
        pattern: /lavaan.*error|lavaan.*warning|cfa.*failed|sem.*failed/i,
        result: {
            title: 'Lỗi mô hình CFA/SEM',
            message: 'Lavaan không thể ước lượng mô hình với dữ liệu hiện tại.',
            suggestion: 'Kiểm tra: (1) Mỗi nhân tố có ≥ 3 items, (2) Cỡ mẫu ≥ 200, (3) Không có biến hằng số.',
            canRetry: false,
            canReport: true,
        },
    },
];

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Translate an R error string to a structured UserFriendlyError.
 * Returns a generic error if no specific mapping is found.
 */
export function translateRErrorDetailed(error: string): UserFriendlyError {
    const normalized = error.toLowerCase();

    for (const mapping of ERROR_MAPPINGS) {
        if (mapping.pattern.test(normalized)) {
            return mapping.result;
        }
    }

    // Generic fallback
    return {
        title: 'Lỗi phân tích',
        message: `Đã xảy ra lỗi không xác định trong quá trình phân tích.`,
        suggestion: 'Vui lòng thử lại. Nếu lỗi tiếp tục, hãy báo cáo để chúng tôi hỗ trợ.',
        canRetry: true,
        canReport: true,
    };
}

/**
 * Translate R errors to user-friendly Vietnamese messages (legacy — single string).
 * Prefer translateRErrorDetailed() for new code.
 */
export function translateRError(error: string): string {
    const detailed = translateRErrorDetailed(error);
    return `${detailed.title}: ${detailed.message}`;
}

/**
 * Helper to parse WebR evaluation result (list) into a getter function
 */
export function parseWebRResult(jsResult: any) {
    if (!jsResult) return (name: string) => null;
    
    return (name: string): any => {
        let val: any = null;

        // Case 1: Plain JS object (unpacked)
        if (jsResult && typeof jsResult === 'object' && jsResult[name] !== undefined) {
            val = jsResult[name];
        } 
        // Case 2: Raw WebR toJs() object
        else if (jsResult && jsResult.names && jsResult.values) {
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
        if (val && typeof val === 'object' && typeof val.length === 'number' && (val.buffer instanceof ArrayBuffer || val.buffer instanceof SharedArrayBuffer)) {
            return Array.from(val);
        }

        // Single value (force to array for consistency)
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
 * Convert JS array to R matrix string (inline embedding).
 * WARNING: Only use for small datasets (< 500 rows).
 * For larger data, use executeRWithRecovery's csvData param + RAW_DATA_PLACEHOLDER.
 */
export function arrayToRMatrix(data: (number | null | undefined)[][]): string {
    const flat = data.flat().map(v => (v === null || v === undefined || isNaN(v as number)) ? 'NA' : v);
    return `matrix(c(${flat.join(',')}), nrow=${data.length}, byrow=TRUE)`;
}

/**
 * Placeholder used in R code templates when data is passed via csvData param.
 * executeRWithRecovery pre-loads data as `raw_data` matrix before running the code.
 */
export const RAW_DATA_PLACEHOLDER = 'raw_data';

/**
 * Build R code that uses pre-loaded raw_data matrix (injected via csvData param).
 * Replaces {{data}} placeholder with `raw_data` reference.
 * This avoids the FileReaderSync/Blob crash in WebR PostMessage channel.
 */
export function useRawDataInCode(rCode: string): string {
    return rCode.replace(/\{\{data\}\}/g, RAW_DATA_PLACEHOLDER);
}
