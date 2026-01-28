import React from 'react';

interface FitIndicesProps {
    indices: {
        cfi?: number;
        tli?: number;
        rmsea?: number;
        srmr?: number;
        chisq?: number;
        df?: number;
        pvalue?: number;
    };
    type?: 'cfa' | 'sem';
}

/**
 * Fit Indices Component
 * Displays model fit indices with color-coded interpretation
 * Used by CFA and SEM results
 */
export function FitIndices({ indices, type = 'cfa' }: FitIndicesProps) {
    // Helper to color fit indices
    const getFitColor = (val: number, type: 'high' | 'low'): string => {
        if (type === 'high') {
            // Higher is better (CFI, TLI)
            if (val >= 0.95) return 'text-green-600 font-bold';
            if (val >= 0.90) return 'text-yellow-600';
            return 'text-red-600';
        } else {
            // Lower is better (RMSEA, SRMR)
            if (val <= 0.05) return 'text-green-600 font-bold';
            if (val <= 0.08) return 'text-yellow-600';
            return 'text-red-600';
        }
    };

    const getInterpretation = (index: string, value: number): string => {
        switch (index) {
            case 'CFI':
            case 'TLI':
                if (value >= 0.95) return 'Excellent';
                if (value >= 0.90) return 'Acceptable';
                return 'Poor';
            case 'RMSEA':
            case 'SRMR':
                if (value <= 0.05) return 'Excellent';
                if (value <= 0.08) return 'Acceptable';
                return 'Poor';
            default:
                return '';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-sm font-bold uppercase mb-4 tracking-wide text-gray-700">
                Model Fit Indices
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* CFI */}
                {indices.cfi !== undefined && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 uppercase mb-1">CFI</div>
                        <div className={`text-2xl font-bold ${getFitColor(indices.cfi, 'high')}`}>
                            {indices.cfi.toFixed(3)}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">
                            {getInterpretation('CFI', indices.cfi)}
                        </div>
                    </div>
                )}

                {/* TLI */}
                {indices.tli !== undefined && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 uppercase mb-1">TLI</div>
                        <div className={`text-2xl font-bold ${getFitColor(indices.tli, 'high')}`}>
                            {indices.tli.toFixed(3)}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">
                            {getInterpretation('TLI', indices.tli)}
                        </div>
                    </div>
                )}

                {/* RMSEA */}
                {indices.rmsea !== undefined && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 uppercase mb-1">RMSEA</div>
                        <div className={`text-2xl font-bold ${getFitColor(indices.rmsea, 'low')}`}>
                            {indices.rmsea.toFixed(3)}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">
                            {getInterpretation('RMSEA', indices.rmsea)}
                        </div>
                    </div>
                )}

                {/* SRMR */}
                {indices.srmr !== undefined && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 uppercase mb-1">SRMR</div>
                        <div className={`text-2xl font-bold ${getFitColor(indices.srmr, 'low')}`}>
                            {indices.srmr.toFixed(3)}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">
                            {getInterpretation('SRMR', indices.srmr)}
                        </div>
                    </div>
                )}
            </div>

            {/* Chi-square test */}
            {indices.chisq !== undefined && indices.df !== undefined && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                        <span className="font-semibold">χ² Test:</span> χ²({indices.df}) = {indices.chisq.toFixed(2)}
                        {indices.pvalue !== undefined && (
                            <span>, p = {indices.pvalue.toFixed(4)}</span>
                        )}
                    </div>
                </div>
            )}

            {/* Interpretation Guide */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-[10px] text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-600 rounded"></span>
                        <span>Excellent: CFI/TLI ≥ 0.95, RMSEA/SRMR ≤ 0.05</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-yellow-600 rounded"></span>
                        <span>Acceptable: CFI/TLI ≥ 0.90, RMSEA/SRMR ≤ 0.08</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-600 rounded"></span>
                        <span>Poor: Below acceptable thresholds</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FitIndices;
