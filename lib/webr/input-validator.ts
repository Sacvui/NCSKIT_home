/**
 * WebR Input Validator
 *
 * Validates and cleans data before passing to R analysis functions.
 * Ensures consistent handling of missing values (NA, NaN, Inf) across all modules.
 */

import { MIN_OBSERVATIONS } from './constants';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ValidationResult {
    /** Whether the data is valid enough to proceed with analysis */
    valid: boolean;
    /** Cleaned data with invalid rows removed */
    cleanData: number[][];
    /** Human-readable warnings to show the user */
    warnings: string[];
    /** Number of rows removed due to invalid values */
    rowsRemoved: number;
    /** Number of rows in the cleaned dataset */
    rowCount: number;
    /** Number of columns */
    colCount: number;
}

export interface ValidationOptions {
    /** Minimum number of rows required (default: MIN_OBSERVATIONS.ABSOLUTE) */
    minRows?: number;
    /** Minimum number of columns required (default: 1) */
    minCols?: number;
    /** Whether to allow rows with some NA values (default: false — remove entire row) */
    allowPartialRows?: boolean;
    /** Analysis name for error messages */
    analysisName?: string;
}

// ─── Core validator ───────────────────────────────────────────────────────────

/**
 * Validate and clean a 2D numeric dataset before R analysis.
 *
 * Removes rows containing:
 * - null / undefined values
 * - NaN
 * - Infinity / -Infinity
 *
 * Returns a ValidationResult with cleaned data and user-facing warnings.
 *
 * @example
 * const { valid, cleanData, warnings } = validateAndCleanData(rawData, { minRows: 30 });
 * if (!valid) { showToast(warnings[0], 'error'); return; }
 * if (warnings.length > 0) { showToast(warnings[0], 'info'); }
 * const result = await runCronbachAlpha(cleanData);
 */
export function validateAndCleanData(
    data: (number | null | undefined)[][],
    options: ValidationOptions = {}
): ValidationResult {
    const {
        minRows = MIN_OBSERVATIONS.ABSOLUTE,
        minCols = 1,
        allowPartialRows = false,
        analysisName = 'phân tích',
    } = options;

    const warnings: string[] = [];

    // Empty data check
    if (!data || data.length === 0) {
        return {
            valid: false,
            cleanData: [],
            warnings: [`Dữ liệu trống. Vui lòng tải lên file CSV trước khi ${analysisName}.`],
            rowsRemoved: 0,
            rowCount: 0,
            colCount: 0,
        };
    }

    const totalRows = data.length;
    const colCount = data[0]?.length ?? 0;

    // Column count check
    if (colCount < minCols) {
        return {
            valid: false,
            cleanData: [],
            warnings: [`Cần ít nhất ${minCols} cột để ${analysisName}. Hiện có ${colCount} cột.`],
            rowsRemoved: 0,
            rowCount: 0,
            colCount,
        };
    }

    // Filter invalid rows
    const cleanData: number[][] = [];
    let rowsRemoved = 0;

    for (const row of data) {
        const hasInvalid = row.some(v =>
            v === null ||
            v === undefined ||
            (typeof v === 'number' && (isNaN(v) || !isFinite(v)))
        );

        if (hasInvalid) {
            if (allowPartialRows) {
                // Replace invalid values with 0 (not recommended, but available)
                const cleanRow = row.map(v =>
                    (v === null || v === undefined || (typeof v === 'number' && (isNaN(v) || !isFinite(v))))
                        ? 0
                        : (v as number)
                );
                cleanData.push(cleanRow);
            } else {
                rowsRemoved++;
            }
        } else {
            cleanData.push(row as number[]);
        }
    }

    // Warn about removed rows
    if (rowsRemoved > 0) {
        const pct = Math.round((rowsRemoved / totalRows) * 100);
        warnings.push(
            `Đã loại ${rowsRemoved} hàng (${pct}%) có giá trị trống hoặc không hợp lệ. ` +
            `Còn lại ${cleanData.length} quan sát.`
        );
    }

    // Check minimum rows after cleaning
    if (cleanData.length < minRows) {
        return {
            valid: false,
            cleanData,
            warnings: [
                ...warnings,
                `Không đủ dữ liệu: cần ít nhất ${minRows} quan sát hợp lệ để ${analysisName}, ` +
                `hiện có ${cleanData.length}.`,
            ],
            rowsRemoved,
            rowCount: cleanData.length,
            colCount,
        };
    }

    // Check for constant columns (zero variance → singular matrix)
    const constantCols: number[] = [];
    for (let j = 0; j < colCount; j++) {
        const col = cleanData.map(row => row[j]);
        const first = col[0];
        if (col.every(v => v === first)) {
            constantCols.push(j + 1); // 1-indexed for user display
        }
    }

    if (constantCols.length > 0) {
        warnings.push(
            `Cột ${constantCols.join(', ')} có giá trị không đổi (phương sai = 0). ` +
            `Điều này có thể gây lỗi đa cộng tuyến.`
        );
    }

    return {
        valid: true,
        cleanData,
        warnings,
        rowsRemoved,
        rowCount: cleanData.length,
        colCount,
    };
}

/**
 * Quick check: does the data have enough rows for a specific analysis type?
 */
export function hasEnoughData(
    data: (number | null | undefined)[][],
    analysisType: 'basic' | 'factor' | 'sem'
): boolean {
    const minMap = {
        basic: MIN_OBSERVATIONS.RECOMMENDED,
        factor: MIN_OBSERVATIONS.FACTOR_ANALYSIS,
        sem: MIN_OBSERVATIONS.SEM,
    };
    return data.length >= minMap[analysisType];
}
