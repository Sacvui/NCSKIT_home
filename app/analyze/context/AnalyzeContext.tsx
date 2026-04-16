'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnalysisStep } from '@/types/analysis';
import { DataProfile } from '@/lib/data-profiler';
import type { PreviousAnalysisData } from '@/types/analysis';
import { Locale } from '@/lib/i18n';

export interface AnalyzeState {
    // Core Data
    data: any[];
    filename: string;
    profile: DataProfile | null;

    // Analysis State
    analysisType: string;
    results: any;
    multipleResults: any[];
    scaleName: string;

    // UI State
    step: AnalysisStep;
    isAnalyzing: boolean;
    analysisProgress: number;

    // Session State
    isPrivateMode: boolean;
    previousAnalysis: PreviousAnalysisData | null;

    // Toast State
    toast: { message: string; type: 'success' | 'error' | 'info' } | null;

    // User/Balance State
    ncsBalance: number;
    showInsufficientCredits: boolean;
    requiredCredits: number;
    currentAnalysisCost: number;

    // Modal State
    isSaveModalOpen: boolean;
    showDemographics: boolean;
    showApplicability: boolean;
    locale: Locale;
}

export interface AnalyzeActions {
    // Data Actions
    setData: (data: any[]) => void;
    setFilename: (filename: string) => void;
    setProfile: (profile: DataProfile | null) => void;

    // Analysis Actions
    setAnalysisType: (type: string) => void;
    setResults: (results: any) => void;
    setMultipleResults: (results: any[]) => void;
    setScaleName: (name: string) => void;

    // UI Actions
    setStep: (step: AnalysisStep) => void;
    setIsAnalyzing: (analyzing: boolean) => void;
    setAnalysisProgress: (progress: number) => void;

    // Session Actions
    setIsPrivateMode: (mode: boolean) => void;
    setPreviousAnalysis: (analysis: PreviousAnalysisData | null) => void;

    // Toast Actions
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    hideToast: () => void;

    // Balance Actions
    setNcsBalance: (balance: number) => void;
    setShowInsufficientCredits: (show: boolean) => void;
    setRequiredCredits: (credits: number) => void;
    setCurrentAnalysisCost: (cost: number) => void;

    // Modal Actions
    setIsSaveModalOpen: (open: boolean) => void;
    setShowDemographics: (show: boolean) => void;
    setShowApplicability: (show: boolean) => void;
    setLocale: (locale: any) => void;

    // Reset
    resetSession: () => void;
}

interface AnalyzeContextType {
    state: AnalyzeState;
    actions: AnalyzeActions;
}

const initialState: AnalyzeState = {
    data: [],
    filename: '',
    profile: null,
    analysisType: '',
    results: null,
    multipleResults: [],
    scaleName: '',
    step: 'upload' as AnalysisStep,
    isAnalyzing: false,
    analysisProgress: 0,
    isPrivateMode: false,
    previousAnalysis: null,
    toast: null,
    ncsBalance: 0,
    showInsufficientCredits: false,
    requiredCredits: 0,
    currentAnalysisCost: 0,
    isSaveModalOpen: false,
    showDemographics: false,
    showApplicability: false,
    locale: 'vi',
};

const AnalyzeContext = createContext<AnalyzeContextType | undefined>(undefined);

export function AnalyzeProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AnalyzeState>(initialState);

    const actions: AnalyzeActions = {
        setData: useCallback((data: any[]) => {
            setState(prev => ({ ...prev, data }));
        }, []),

        setFilename: useCallback((filename: string) => {
            setState(prev => ({ ...prev, filename }));
        }, []),

        setProfile: useCallback((profile: DataProfile | null) => {
            setState(prev => ({ ...prev, profile }));
        }, []),

        setAnalysisType: useCallback((analysisType: string) => {
            setState(prev => ({ ...prev, analysisType }));
        }, []),

        setResults: useCallback((results: any) => {
            setState(prev => ({ ...prev, results }));
        }, []),

        setMultipleResults: useCallback((multipleResults: any[]) => {
            setState(prev => ({ ...prev, multipleResults }));
        }, []),

        setScaleName: useCallback((scaleName: string) => {
            setState(prev => ({ ...prev, scaleName }));
        }, []),

        setStep: useCallback((step: AnalysisStep) => {
            setState(prev => ({ ...prev, step }));
        }, []),

        setIsAnalyzing: useCallback((isAnalyzing: boolean) => {
            setState(prev => ({ ...prev, isAnalyzing }));
        }, []),

        setAnalysisProgress: useCallback((analysisProgress: number) => {
            setState(prev => ({ ...prev, analysisProgress }));
        }, []),

        setIsPrivateMode: useCallback((isPrivateMode: boolean) => {
            setState(prev => ({ ...prev, isPrivateMode }));
        }, []),

        setPreviousAnalysis: useCallback((previousAnalysis: PreviousAnalysisData | null) => {
            setState(prev => ({ ...prev, previousAnalysis }));
        }, []),

        showToast: useCallback((message: string, type: 'success' | 'error' | 'info') => {
            setState(prev => ({ ...prev, toast: { message, type } }));
            // Auto-hide after 3 seconds
            setTimeout(() => {
                setState(prev => ({ ...prev, toast: null }));
            }, 3000);
        }, []),

        hideToast: useCallback(() => {
            setState(prev => ({ ...prev, toast: null }));
        }, []),

        setNcsBalance: useCallback((ncsBalance: number) => {
            setState(prev => ({ ...prev, ncsBalance }));
        }, []),

        setShowInsufficientCredits: useCallback((showInsufficientCredits: boolean) => {
            setState(prev => ({ ...prev, showInsufficientCredits }));
        }, []),
        setRequiredCredits: useCallback((requiredCredits: number) => {
            setState(prev => ({ ...prev, requiredCredits }));
        }, []),
        setCurrentAnalysisCost: useCallback((currentAnalysisCost: number) => {
            setState(prev => ({ ...prev, currentAnalysisCost }));
        }, []),

        setIsSaveModalOpen: useCallback((isSaveModalOpen: boolean) => {
            setState(prev => ({ ...prev, isSaveModalOpen }));
        }, []),

        setShowDemographics: useCallback((showDemographics: boolean) => {
            setState(prev => ({ ...prev, showDemographics }));
        }, []),

        setShowApplicability: useCallback((showApplicability: boolean) => {
            setState(prev => ({ ...prev, showApplicability }));
        }, []),
        setLocale: useCallback((locale: any) => {
            setState(prev => ({ ...prev, locale }));
        }, []),

        resetSession: useCallback(() => {
            setState(initialState);
        }, []),
    };

    return (
        <AnalyzeContext.Provider value={{ state, actions }}>
            {children}
        </AnalyzeContext.Provider>
    );
}

export function useAnalyze() {
    const context = useContext(AnalyzeContext);
    if (context === undefined) {
        throw new Error('useAnalyze must be used within an AnalyzeProvider');
    }
    return context;
}

export function useAnalyzeState() {
    const { state } = useAnalyze();
    return state;
}

export function useAnalyzeActions() {
    const { actions } = useAnalyze();
    return actions;
}
