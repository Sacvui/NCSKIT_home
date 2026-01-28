'use client';

import { useCallback } from 'react';
import { useAnalyze } from '../context/AnalyzeContext';
import { profileData } from '@/lib/data-profiler';
import { runDescriptiveStats, runTTestIndependent, runTTestPaired, runOneWayANOVA, runChiSquare, runMannWhitneyU, runCorrelation, runKruskalWallis, runWilcoxonSignedRank, setProgressCallback } from '@/lib/webr-wrapper';
import { getAnalysisCost, checkBalance, deductCredits } from '@/lib/ncs-credits';
import { logAnalysisUsage } from '@/lib/activity-logger';

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
    const getNumericColumns = useCallback(() => {
        if (!state.profile) return [];
        return state.profile.columns
            .filter(col => col.type === 'numeric')
            .map(col => col.name);
    }, [state.profile]);

    /**
     * Get all column names from profile
     */
    const getAllColumns = useCallback(() => {
        if (!state.profile) return [];
        return state.profile.columns.map(col => col.name);
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
     * Run analysis
     */
    const runAnalysis = useCallback(async (type: string, selectedVars: string[]) => {
        if (!state.data || state.data.length === 0) {
            actions.showToast('Chưa có dữ liệu để phân tích', 'error');
            return;
        }

        actions.setIsAnalyzing(true);
        actions.setAnalysisProgress(0);
        actions.setAnalysisType(type);

        // Set progress callback
        setProgressCallback((progress: number) => {
            actions.setAnalysisProgress(progress);
        });

        try {
            let result: any = null;

            switch (type) {
                case 'descriptive':
                    result = await runDescriptiveStats(state.data, selectedVars);
                    break;
                case 'ttest-indep':
                    result = await runTTestIndependent(state.data, selectedVars[0], selectedVars[1]);
                    break;
                case 'ttest-paired':
                    result = await runTTestPaired(state.data, selectedVars[0], selectedVars[1]);
                    break;
                case 'anova':
                    result = await runOneWayANOVA(state.data, selectedVars[0], selectedVars.slice(1));
                    break;
                case 'correlation':
                    result = await runCorrelation(state.data, selectedVars);
                    break;
                case 'chisquare':
                    result = await runChiSquare(state.data, selectedVars[0], selectedVars[1]);
                    break;
                case 'mann-whitney':
                    result = await runMannWhitneyU(state.data, selectedVars[0], selectedVars[1]);
                    break;
                case 'kruskal-wallis':
                    result = await runKruskalWallis(state.data, selectedVars[0], selectedVars.slice(1));
                    break;
                case 'wilcoxon':
                    result = await runWilcoxonSignedRank(state.data, selectedVars[0], selectedVars[1]);
                    break;
                default:
                    throw new Error(`Unsupported analysis type: ${type}`);
            }

            if (result) {
                result.columns = selectedVars;
                actions.setResults(result);
                actions.setStep('results');
                actions.showToast('Phân tích hoàn tất!', 'success');

                // Log usage
                await logAnalysisUsage(type, state.data.length, selectedVars.length);
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
        actions.setPreviousAnalysis({
            type: 'efa',
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
        actions.setPreviousAnalysis({
            type: 'cfa',
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
