'use client';

/**
 * Analyze Page - Refactored Version
 * 
 * This is the NEW modular version of the analyze page.
 * Original: 2,068 lines → Refactored: ~100 lines
 * 
 * Architecture:
 * - AnalyzeContext: Centralized state management
 * - useAnalyzeHandlers: All action handlers
 * - Step components: UploadStep, ProfileStep, AnalyzeStep, ResultsStep
 */

export const dynamic = 'force-dynamic';

import React, { useEffect } from 'react';
import { AnalyzeProvider, useAnalyzeState, useAnalyzeActions } from './context/AnalyzeContext';
import { UploadStep, ProfileStep, AnalyzeStep, ResultsStep } from './components/steps';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Toast } from '@/components/ui/Toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { initWebR } from '@/lib/webr-wrapper';
import { getStoredLocale, t } from '@/lib/i18n';
import { BasicStatsView } from '@/components/analyze/views/BasicStatsView';
import { MultivariateView } from '@/components/analyze/views/MultivariateView';
import { MediationView } from '@/components/analyze/views/MediationView';
import { ReliabilityView } from '@/components/analyze/views/ReliabilityView';
import { RegressionView } from '@/components/analyze/views/RegressionView';
import { InsufficientCreditsModal } from '@/components/InsufficientCreditsModal';
import { useAnalyzeHandlers } from './hooks/useAnalyzeHandlers';
import { useAnalysisPersistence } from '@/hooks/useAnalysisPersistence';
import { useAutoSave } from '@/hooks/useAutoSave';
import { profileData } from '@/lib/data-profiler';
import { RotateCcw, XCircle } from 'lucide-react';

function AnalyzeContent() {
    const state = useAnalyzeState();
    const actions = useAnalyzeActions();
    const { user, profile: userProfile, loading: authLoading } = useAuth();
    const { getNumericColumns, getAllColumns } = useAnalyzeHandlers();

    // Persistence Hooks
    const { saveWorkspace, loadWorkspace, hasSavedData, clearWorkspace } = useAnalysisPersistence();
    const [showRestoreBanner, setShowRestoreBanner] = React.useState(false);

    // Sync locale with context
    useEffect(() => {
        actions.setLocale(getStoredLocale());
    }, []);

    // Initialize WebR on mount
    useEffect(() => {
        initWebR().catch(console.error);
    }, []);

    // Show restore banner if data exists but hasn't been loaded
    useEffect(() => {
        if (hasSavedData && state.data.length === 0) {
            setShowRestoreBanner(true);
        } else {
            setShowRestoreBanner(false);
        }
    }, [hasSavedData, state.data.length]);

    // Check if data is missing when in non-upload steps
    useEffect(() => {
        if (state.data.length === 0 && state.step !== 'upload') {
            actions.setStep('upload');
        }
    }, [state.step, state.data.length]);

    // Auto-Save Effect
    useAutoSave(
        () => {
            if (state.data.length === 0 || state.isPrivateMode) return;
            saveWorkspace({
                data: state.data,
                columns: getNumericColumns(),
                fileName: state.filename,
                currentStep: state.step,
                results: state.results,
                analysisType: state.analysisType,
            });
        },
        [state.data, state.step, state.results, state.analysisType, state.filename, state.isPrivateMode],
        { delay: 60000, enabled: state.data.length > 0 }
    );

    const handleRestore = async () => {
        const saved = await loadWorkspace();
        if (saved) {
            actions.setData(saved.data);
            actions.setFilename(saved.fileName);
            actions.setProfile(profileData(saved.data));
            actions.setStep(saved.currentStep);
            actions.setResults(saved.results);
            actions.setAnalysisType(saved.analysisType);
            actions.showToast(t(state.locale, 'analyze.common.restored_success') || 'Đã khôi phục dữ liệu', 'success');
            setShowRestoreBanner(false);
        }
    };

    const discardSaved = async () => {
        await clearWorkspace();
        setShowRestoreBanner(false);
        actions.showToast(t(state.locale, 'analyze.common.data_cleared') || 'Đã xóa dữ liệu lưu tạm', 'info');
    };

    // Step mapping for StepIndicator
    const getStepIndex = () => {
        if (state.step.includes('-select') || state.step.includes('-batch')) return 2;
        switch (state.step) {
            case 'upload': return 0;
            case 'profile': return 1;
            case 'analyze': return 2;
            case 'results': return 3;
            default: return 0;
        }
    };

    const steps = [
        { id: 'upload', label: t(state.locale, 'analyze.steps.upload') },
        { id: 'profile', label: t(state.locale, 'analyze.steps.profile') },
        { id: 'analyze', label: t(state.locale, 'analyze.steps.analyze') },
        { id: 'results', label: t(state.locale, 'analyze.steps.results') },
    ];

    // Render current step
    const renderStep = () => {
        switch (state.step) {
            case 'upload':
                return <UploadStep />;
            case 'profile':
                return <ProfileStep />;
            case 'analyze':
                return <AnalyzeStep />;
            case 'results':
                return <ResultsStep />;

            // Basic Analysis Selection Views
            case 'descriptive-select':
            case 'ttest-select':
            case 'ttest-paired-select':
            case 'anova-select':
            case 'chisq-select':
            case 'fisher-select':
            case 'mannwhitney-select':
            case 'kruskalwallis-select':
            case 'wilcoxon-select':
                return (
                    <BasicStatsView
                        step={state.step}
                        data={state.data}
                        columns={getNumericColumns()}
                        allColumns={getAllColumns()}
                        profile={state.profile}
                        user={user}
                        setResults={actions.setResults}
                        setStep={actions.setStep}
                        setNcsBalance={actions.setNcsBalance}
                        showToast={actions.showToast}
                        setAnalysisType={actions.setAnalysisType}
                        setRequiredCredits={actions.setRequiredCredits}
                        setCurrentAnalysisCost={actions.setCurrentAnalysisCost}
                        setShowInsufficientCredits={actions.setShowInsufficientCredits}
                        locale={state.locale}
                    />
                );

            // Multivariate Selection Views
            case 'cluster-select':
            case 'twoway-anova-select':
                return (
                    <MultivariateView
                        step={state.step}
                        data={state.data}
                        columns={getNumericColumns()}
                        allColumns={getAllColumns()}
                        profile={state.profile}
                        user={user}
                        setResults={actions.setResults}
                        setStep={actions.setStep}
                        setNcsBalance={actions.setNcsBalance}
                        showToast={actions.showToast}
                        setAnalysisType={actions.setAnalysisType}
                        setRequiredCredits={actions.setRequiredCredits}
                        setCurrentAnalysisCost={actions.setCurrentAnalysisCost}
                        setShowInsufficientCredits={actions.setShowInsufficientCredits}
                        locale={state.locale}
                    />
                );

            // Mediation & Moderation
            case 'mediation-select':
            case 'moderation-select':
                return (
                    <MediationView
                        step={state.step}
                        data={state.data}
                        columns={getNumericColumns()}
                        user={user}
                        setResults={actions.setResults}
                        setStep={actions.setStep}
                        setNcsBalance={actions.setNcsBalance}
                        showToast={actions.showToast}
                        setAnalysisType={actions.setAnalysisType}
                        setRequiredCredits={actions.setRequiredCredits}
                        setCurrentAnalysisCost={actions.setCurrentAnalysisCost}
                        setShowInsufficientCredits={actions.setShowInsufficientCredits}
                        locale={state.locale}
                    />
                );

            // Reliability & Factor Analysis
            case 'cronbach-select':
            case 'cronbach-batch-select':
            case 'omega-select':
            case 'efa-select':
            case 'cfa-select':
            case 'sem-select':
                return (
                    <ReliabilityView
                        step={state.step}
                        data={state.data}
                        columns={getNumericColumns()}
                        user={user}
                        setResults={actions.setResults}
                        setStep={actions.setStep}
                        setNcsBalance={actions.setNcsBalance}
                        showToast={actions.showToast}
                        setScaleName={actions.setScaleName}
                        setMultipleResults={actions.setMultipleResults}
                        setAnalysisType={actions.setAnalysisType}
                        setRequiredCredits={actions.setRequiredCredits}
                        setCurrentAnalysisCost={actions.setCurrentAnalysisCost}
                        setShowInsufficientCredits={actions.setShowInsufficientCredits}
                        locale={state.locale}
                    />
                );

            // Regression Analysis
            case 'regression-select':
            case 'logistic-select':
                return (
                    <RegressionView
                        step={state.step}
                        data={state.data}
                        columns={getNumericColumns()}
                        user={user}
                        setResults={actions.setResults}
                        setStep={actions.setStep}
                        setNcsBalance={actions.setNcsBalance}
                        showToast={actions.showToast}
                        setAnalysisType={actions.setAnalysisType}
                        setRequiredCredits={actions.setRequiredCredits}
                        setCurrentAnalysisCost={actions.setCurrentAnalysisCost}
                        setShowInsufficientCredits={actions.setShowInsufficientCredits}
                        locale={state.locale}
                    />
                );

            default:
                return <UploadStep />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-violet-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Restore Banner */}
                {showRestoreBanner && (
                    <div className="mb-6 bg-blue-900 text-white p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl animate-in slide-in-from-top duration-500">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <RotateCcw className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm tracking-tight">{t(state.locale, 'analyze.common.saved_session') || 'Phát hiện phiên làm việc cũ'}</h4>
                                <p className="text-[10px] text-blue-200 font-medium uppercase tracking-widest mt-0.5">{t(state.locale, 'analyze.common.restore_prompt') || 'Bạn có muốn khôi phục dữ liệu từ lần trước không?'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRestore}
                                className="px-5 py-2 bg-white text-blue-900 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                {t(state.locale, 'common.restore') || 'Khôi phục'}
                            </button>
                            <button
                                onClick={discardSaved}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step Indicator */}
                <div className="mb-8">
                    <StepIndicator
                        steps={steps}
                        currentStep={state.step}
                        onStepClick={(stepId: string) => {
                            const stepOrder = ['upload', 'profile', 'analyze', 'results'];
                            const currentIdx = (state.step.includes('-select') || state.step.includes('-batch')) ? 2 : stepOrder.indexOf(state.step);
                            const clickedIdx = stepOrder.indexOf(stepId);
                            // Only allow going back, not forward
                            if (clickedIdx <= currentIdx) {
                                actions.setStep(stepId as any);
                            }
                        }}
                    />
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    {renderStep()}
                </div>
            </main>

            <Footer />

            {/* Toast Notifications */}
            {state.toast && (
                <Toast
                    message={state.toast.message}
                    type={state.toast.type}
                    onClose={actions.hideToast}
                />
            )}

            {/* Modal for Insufficient Credits */}
            <InsufficientCreditsModal
                isOpen={state.showInsufficientCredits}
                onClose={() => actions.setShowInsufficientCredits(false)}
                required={state.requiredCredits}
                available={state.ncsBalance}
                analysisType={state.analysisType}
            />
        </div>
    );
}

export default function AnalyzePageRefactored() {
    return (
        <AnalyzeProvider>
            <AnalyzeContent />
        </AnalyzeProvider>
    );
}
