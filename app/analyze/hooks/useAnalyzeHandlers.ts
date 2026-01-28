'use client';

/**
 * Analysis Handlers Hook - FIXED VERSION
 * 
 * This hook provides handlers that bridge between component state
 * and the low-level WebR analysis functions.
 */

import { useCallback } from 'react';
import { useAnalyze } from '../context/AnalyzeContext';
import { profileData, DataProfile } from '@/lib/data-profiler';
import {
    runDescriptiveStats as rawDescriptiveStats,
    runTTestIndependent as rawTTestIndependent,
    runTTestPaired as rawTTestPaired,
    runOneWayANOVA as rawANOVA,
    runChiSquare as rawChiSquare,
    runMannWhitneyU as rawMannWhitney,
    runCorrelation as rawCorrelation,
    runKruskalWallis as rawKruskalWallis,
    runWilcoxonSignedRank as rawWilcoxon,
} from '@/lib/webr-wrapper';
import { logAnalysisUsage } from '@/lib/activity-logger';

/**
 * Extract numeric column values from data
 */
function getColumnValues(data: any[], columnName: string): number[] {
    return data.map(row => parseFloat(row[columnName])).filter(v => !isNaN(v));
}

/**
 * Create numeric matrix from multiple columns
 */
function getColumnsAsMatrix(data: any[], columnNames: string[]): number[][] {
    return columnNames.map(col => getColumnValues(data, col));
}

/**
 * Group data by categorical variable
 */
function groupByCategory(data: any[], groupVar: string, valueVars: string[]): number[][] {
    const groups: { [key: string]: number[] } = {};

    data.forEach(row => {
        const groupKey = String(row[groupVar]);
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        // For now, take first value variable
        const value = parseFloat(row[valueVars[0]]);
        if (!isNaN(value)) {
            groups[groupKey].push(value);
        }
    });

    return Object.values(groups);
}

export function useAnalyzeHandlers() {
    const { state, actions } = useAnalyze();

    /**
     * Handle data loaded from file upload
     */
    const handleDataLoaded = useCallback(async (loadedData: any[], fname: string) => {
        actions.setData(loadedData);
        actions.setFilename(fname);

        // Profile the data
        const dataProfile = profileData(loadedData);
        actions.setProfile(dataProfile);

        // Move to profile step
        actions.setStep('profile');

        actions.showToast(`Đã tải ${loadedData.length} dòng dữ liệu`, 'success');
    }, [actions]);

    /**
     * Handle proceed to analysis step
     */
    const handleProceedToAnalysis = useCallback(() => {
        actions.setStep('analyze');
    }, [actions]);

    /**
     * Get numeric columns from profile
     */
    const getNumericColumns = useCallback((): string[] => {
        if (!state.profile) return [];
        return Object.values(state.profile.columnStats)
            .filter(col => col.type === 'numeric')
            .map(col => col.name);
    }, [state.profile]);

    /**
     * Get all column names from profile
     */
    const getAllColumns = useCallback((): string[] => {
        if (!state.profile) return [];
        return Object.keys(state.profile.columnStats);
    }, [state.profile]);

    /**
     * Handle analysis error
     */
    const handleAnalysisError = useCallback((err: any) => {
        console.error('Analysis error:', err);
        actions.setIsAnalyzing(false);
        actions.setAnalysisProgress(0);

        const errorMessage = err.message || 'Đã xảy ra lỗi khi phân tích';
        actions.showToast(errorMessage, 'error');
    }, [actions]);

    /**
     * Run analysis with proper data transformation
     */
    const runAnalysis = useCallback(async (type: string, selectedVars: string[]) => {
        if (!state.data || state.data.length === 0) {
            actions.showToast('Chưa có dữ liệu để phân tích', 'error');
            return;
        }

        actions.setIsAnalyzing(true);
        actions.setAnalysisProgress(10);
        actions.setAnalysisType(type);

        try {
            let result: any = null;

            switch (type) {
                case 'descriptive': {
                    // Descriptive stats expects number[][] matrix
                    const matrix = getColumnsAsMatrix(state.data, selectedVars);
                    result = await rawDescriptiveStats(matrix);
                    break;
                }

                case 'ttest-indep': {
                    // T-test expects two number arrays
                    const groupVar = selectedVars[0];
                    const valueVar = selectedVars[1];
                    const groups = groupByCategory(state.data, groupVar, [valueVar]);
                    if (groups.length >= 2) {
                        result = await rawTTestIndependent(groups[0], groups[1]);
                    } else {
                        throw new Error('Need at least 2 groups for T-test');
                    }
                    break;
                }

                case 'ttest-paired': {
                    // Paired T-test expects two number arrays
                    const before = getColumnValues(state.data, selectedVars[0]);
                    const after = getColumnValues(state.data, selectedVars[1]);
                    result = await rawTTestPaired(before, after);
                    break;
                }

                case 'anova': {
                    // ANOVA expects groups as number[][]
                    const groupVar = selectedVars[0];
                    const valueVars = selectedVars.slice(1);
                    const groups = groupByCategory(state.data, groupVar, valueVars);
                    result = await rawANOVA(groups);
                    break;
                }

                case 'correlation': {
                    // Correlation expects number[][] matrix
                    const matrix = getColumnsAsMatrix(state.data, selectedVars);
                    result = await rawCorrelation(matrix, 'pearson');
                    break;
                }

                case 'chisquare': {
                    // Chi-square expects contingency table
                    // Build contingency table from two categorical variables
                    const var1 = selectedVars[0];
                    const var2 = selectedVars[1];

                    // Create cross-tabulation
                    const crosstab: { [key: string]: { [key: string]: number } } = {};
                    const rows = new Set<string>();
                    const cols = new Set<string>();

                    state.data.forEach((row: any) => {
                        const r = String(row[var1]);
                        const c = String(row[var2]);
                        rows.add(r);
                        cols.add(c);
                        if (!crosstab[r]) crosstab[r] = {};
                        crosstab[r][c] = (crosstab[r][c] || 0) + 1;
                    });

                    const rowArr = Array.from(rows);
                    const colArr = Array.from(cols);
                    const table = rowArr.map(r => colArr.map(c => crosstab[r]?.[c] || 0));

                    result = await rawChiSquare(table);
                    break;
                }

                case 'mann-whitney': {
                    const groupVar = selectedVars[0];
                    const valueVar = selectedVars[1];
                    const groups = groupByCategory(state.data, groupVar, [valueVar]);
                    if (groups.length >= 2) {
                        result = await rawMannWhitney(groups[0], groups[1]);
                    } else {
                        throw new Error('Need at least 2 groups for Mann-Whitney');
                    }
                    break;
                }

                case 'kruskal-wallis': {
                    const groupVar = selectedVars[0];
                    const valueVars = selectedVars.slice(1);
                    const groups = groupByCategory(state.data, groupVar, valueVars);
                    result = await rawKruskalWallis(groups);
                    break;
                }

                case 'wilcoxon': {
                    const before = getColumnValues(state.data, selectedVars[0]);
                    const after = getColumnValues(state.data, selectedVars[1]);
                    result = await rawWilcoxon(before, after);
                    break;
                }

                default:
                    throw new Error(`Unsupported analysis type: ${type}`);
            }

            actions.setAnalysisProgress(80);

            if (result) {
                result.columns = selectedVars;
                actions.setResults(result);
                actions.setStep('results');
                actions.showToast('Phân tích hoàn tất!', 'success');

                // Note: Activity logging is handled at component level with user context
            }
        } catch (err) {
            handleAnalysisError(err);
        } finally {
            actions.setIsAnalyzing(false);
            actions.setAnalysisProgress(0);
        }
    }, [state.data, actions, handleAnalysisError]);

    /**
     * Workflow: Proceed to EFA after Cronbach
     */
    const handleProceedToEFA = useCallback((goodItems: string[]) => {
        actions.setPreviousAnalysis({
            type: 'cronbach',
            variables: goodItems,
            goodItems: goodItems,
            results: state.results
        });
        actions.setStep('analyze');
        actions.showToast(`Tiếp tục EFA với ${goodItems.length} biến tốt`, 'info');
    }, [actions, state.results]);

    /**
     * Workflow: Proceed to CFA after EFA
     */
    const handleProceedToCFA = useCallback((factors: { name: string; indicators: string[] }[]) => {
        // Extract all variables from factors for the variables field
        const allVariables = factors.flatMap(f => f.indicators);
        actions.setPreviousAnalysis({
            type: 'efa',
            variables: allVariables,
            factors,
            results: state.results
        });
        actions.setStep('analyze');
        actions.showToast('Tiếp tục CFA với cấu trúc nhân tố', 'info');
    }, [actions, state.results]);

    /**
     * Workflow: Proceed to SEM after CFA
     */
    const handleProceedToSEM = useCallback((factors: { name: string; indicators: string[] }[]) => {
        const allVariables = factors.flatMap(f => f.indicators);
        actions.setPreviousAnalysis({
            type: 'cfa',
            variables: allVariables,
            factors,
            results: state.results
        });
        actions.setStep('analyze');
        actions.showToast('Tiếp tục SEM với mô hình đo lường', 'info');
    }, [actions, state.results]);

    /**
     * Reset and start new analysis
     */
    const handleNewAnalysis = useCallback(() => {
        actions.setResults(null);
        actions.setAnalysisType('');
        actions.setStep('analyze');
    }, [actions]);

    /**
     * Clear session completely
     */
    const handleClearSession = useCallback(() => {
        actions.resetSession();
    }, [actions]);

    return {
        handleDataLoaded,
        handleProceedToAnalysis,
        getNumericColumns,
        getAllColumns,
        handleAnalysisError,
        runAnalysis,
        handleProceedToEFA,
        handleProceedToCFA,
        handleProceedToSEM,
        handleNewAnalysis,
        handleClearSession,
    };
}
