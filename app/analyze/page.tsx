'use client';

// Prevent prerendering - this page requires client-side Supabase
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { DataProfiler } from '@/components/DataProfiler';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { SmartGroupSelector, VariableSelector, AISettings } from '@/components/VariableSelector';
import { profileData, DataProfile } from '@/lib/data-profiler';
import { runCorrelation, runDescriptiveStats, initWebR, getWebRStatus, setProgressCallback } from '@/lib/webr-wrapper';
import { BarChart3, FileText, Shield, Trash2, Eye, EyeOff, Wifi, WifiOff, RotateCcw, XCircle } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';
import { WebRStatus } from '@/components/WebRStatus';
import { AnalysisSelector } from '@/components/AnalysisSelector';
import { useAnalysisSession } from '@/hooks/useAnalysisSession';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { AnalysisStep } from '@/types/analysis';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Badge } from '@/components/ui/Badge';
import { RegressionView } from '@/components/analyze/views/RegressionView';
import { MediationView } from '@/components/analyze/views/MediationView';
import { MultivariateView } from '@/components/analyze/views/MultivariateView';
import { ReliabilityView } from '@/components/analyze/views/ReliabilityView';
import { BasicStatsView } from '@/components/analyze/views/BasicStatsView';
import type { PreviousAnalysisData } from '@/types/analysis';
import { DemographicSurvey } from '@/components/feedback/DemographicSurvey';
import { ApplicabilitySurvey } from '@/components/feedback/ApplicabilitySurvey';
import { FeedbackService } from '@/lib/feedback-service';
import { getSupabase } from '@/utils/supabase/client';
import Header from '@/components/layout/Header'
import AnalysisToolbar from '@/components/analyze/AnalysisToolbar';
import SaveProjectModal from '@/components/analyze/SaveProjectModal';
import Footer from '@/components/layout/Footer';
import { getAnalysisCost, checkBalance, deductCredits, getUserBalance } from '@/lib/ncs-credits';
import { logAnalysisUsage, logExport } from '@/lib/activity-logger';
import { InsufficientCreditsModal } from '@/components/InsufficientCreditsModal';
import { NcsBalanceBadge } from '@/components/NcsBalanceBadge';
import { MobileWebRFallback, useSharedArrayBufferSupport } from '@/components/MobileWebRFallback';
import { getORCIDUser } from '@/utils/cookie-helper';
import { useAuth } from '@/context/AuthContext';
import { useAnalysisPersistence } from '@/hooks/useAnalysisPersistence';
import { Locale, t, getStoredLocale } from '@/lib/i18n';

export default function AnalyzePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>}>
            <AnalyzeContent />
        </Suspense>
    );
}

function AnalyzeContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const mode = searchParams.get('mode')
    const { user, profile: userProfile, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [locale, setLocale] = useState<Locale>(getStoredLocale());

    // Sync locale with storage
    useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    // Synchronize balance with profile tokens
    useEffect(() => {
        if (userProfile?.tokens !== undefined) {
            setNcsBalance(userProfile.tokens);
        }
    }, [userProfile?.tokens]);

    // Overall loading state - follow auth context
    useEffect(() => {
        if (!authLoading) {
            setLoading(false);
        }
    }, [authLoading]);

    // Session State Management
    const {
        isPrivateMode, setIsPrivateMode,
        clearSession,
        step, setStep,
        data, setData,
        filename, setFilename,
        profile, setProfile,
        analysisType, setAnalysisType,
        results, setResults,
        multipleResults, setMultipleResults,
        scaleName, setScaleName
    } = useAnalysisSession();


    // Local ephemeral state
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Feedback State
    const [showDemographics, setShowDemographics] = useState(false);
    const [showApplicability, setShowApplicability] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

    // Workflow Mode State
    const [previousAnalysis, setPreviousAnalysis] = useState<PreviousAnalysisData | null>(null);

    // Online/Offline detection
    const { isOnline, wasOffline } = useOnlineStatus();

    // Progress tracking
    const [analysisProgress, setAnalysisProgress] = useState(0);

    // NCS Credit System State
    const [ncsBalance, setNcsBalance] = useState<number>(0);
    const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
    const [requiredCredits, setRequiredCredits] = useState(0);
    const [currentAnalysisCost, setCurrentAnalysisCost] = useState(0);

    // Auto-Save / Persistence Hook
    const { saveWorkspace, loadWorkspace, hasSavedData, clearWorkspace } = useAnalysisPersistence();
    const [showRestoreBanner, setShowRestoreBanner] = useState(false);

    // Check availability of saved data on mount
    // Safety check: if step requires data/profile but they are missing, redirect
    useEffect(() => {
        if (loading) return; // Wait until auth loading completes

        // If data is lost, always go back to upload
        if (data.length === 0 && step !== 'upload') {
            setStep('upload');
            return;
        }

        // If at profile step but no profile exists, try to recreate it or go back
        if (step === 'profile' && !profile && data.length > 0) {
            const prof = profileData(data);
            if (prof) {
                setProfile(prof);
            } else {
                setStep('upload');
            }
        }
    }, [step, data.length, profile, loading, setStep, setProfile]);

    useEffect(() => {
        if (hasSavedData && data.length === 0) {
            setShowRestoreBanner(true);
        } else {
            setShowRestoreBanner(false);
        }
    }, [hasSavedData, data.length]);

    // Auto-Save Effect (Debounced 1 minute for optimal performance)
    useEffect(() => {
        if (data.length > 0) {
            const timer = setTimeout(() => {
                saveWorkspace({
                    data,
                    columns: getNumericColumns(),
                    fileName: filename,
                    currentStep: step,
                    results,
                    analysisType,
                });
                console.log('✅ Auto-saved workspace at', new Date().toLocaleTimeString());
            }, 60000); // 60 seconds (1 minute) - optimal balance between safety and performance
            return () => clearTimeout(timer);
        }
    }, [data, step, results, analysisType, filename, saveWorkspace]);

    // Save before page unload (critical data protection)
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (data.length > 0) {
                saveWorkspace({
                    data,
                    columns: getNumericColumns(),
                    fileName: filename,
                    currentStep: step,
                    results,
                    analysisType,
                });
                console.log('✅ Saved workspace before page unload');
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [data, step, results, analysisType, filename, saveWorkspace]);

    // Handle Restoration
    const handleRestore = async () => {
        const saved = await loadWorkspace();
        if (saved) {
            setData(saved.data);
            setFilename(saved.fileName);
            // Re-profile data to ensure consistency
            const prof = profileData(saved.data);
            setProfile(prof);

            setStep(saved.currentStep);
            setResults(saved.results);
            setAnalysisType(saved.analysisType);
            showToast(t(locale, 'analyze.common.restored_success'), 'success');
            setShowRestoreBanner(false);
        }
    };

    const discardSaved = async () => {
        await clearWorkspace();
        setShowRestoreBanner(false);
        showToast(t(locale, 'analyze.common.data_cleared'), 'info');
    };

    // Persist workflow state to sessionStorage (Legacy - Keeping for now)
    useEffect(() => {
        if (previousAnalysis) {
            sessionStorage.setItem('workflow_state', JSON.stringify(previousAnalysis));
        }
    }, [previousAnalysis]);

    // Load workflow state on mount
    useEffect(() => {
        const saved = sessionStorage.getItem('workflow_state');
        if (saved) {
            try {
                setPreviousAnalysis(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse workflow state:', e);
            }
        }
    }, []);

    // Handle online/offline events
    useEffect(() => {
        const handleOnline = () => {
            showToast(t(locale, 'analyze.common.internet_restored'), 'success');
        };

        const handleOffline = () => {
            showToast(t(locale, 'analyze.common.internet_lost'), 'error');
        };

        window.addEventListener('app:online', handleOnline);
        window.addEventListener('app:offline', handleOffline);

        return () => {
            window.removeEventListener('app:online', handleOnline);
            window.removeEventListener('app:offline', handleOffline);
        };
    }, []);

    // Auto-initialize WebR on page load (eager loading)
    useEffect(() => {
        const status = getWebRStatus();
        if (!status.isReady && !status.isLoading) {
            console.log('[WebR] Starting auto-initialization...');

            setProgressCallback((msg) => {
                const translatedMsg = msg.includes('Cleaning') ? t(locale, 'analyze.common.processing') : msg;
                setToast({ message: translatedMsg, type: 'info' });
            });

            initWebR()
                .then(() => {
                    console.log('[WebR] Auto-initialization successful');
                    setToast({ message: t(locale, 'analyze.common.engine_ready'), type: 'success' });
                })
                .catch(err => {
                    console.error('[WebR] Auto-initialization failed:', err);
                    setToast({ message: t(locale, 'analyze.common.engine_error'), type: 'error' });
                });
        }
    }, [locale]);

    // Check for Demographics Survey (Part 1)
    useEffect(() => {
        // Delay slightly to let page load
        const timer = setTimeout(() => {
            if (!FeedbackService.hasCompletedDemographics()) {
                setShowDemographics(true);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Additional check when entering analyze step
    useEffect(() => {
        if (step === 'analyze') {
            const status = getWebRStatus();
            if (!status.isReady && !status.isLoading) {
                setToast({ message: t(locale, 'analyze.common.engine_initializing'), type: 'info' });
                initWebR().then(() => {
                    setToast({ message: t(locale, 'analyze.common.engine_ready'), type: 'success' });
                }).catch(err => {
                    setToast({ message: `Lỗi khởi tạo: ${err.message || err}`, type: 'error' });
                });
            }
        }
    }, [step]);

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
        // Auto-dismiss after 5 seconds
        setTimeout(() => setToast(null), 5000);
    };

    const handleAnalysisError = (err: any) => {
        const msg = err.message || String(err);
        console.error("Analysis Error:", err);

        if (msg.includes('subscript out of bounds')) {
            showToast('Lỗi: Không tìm thấy dữ liệu biến (Kiểm tra tên cột).', 'error');
        } else if (msg.includes('singular matrix') || msg.includes('computational singular')) {
            showToast('Lỗi: Ma trận đặc dị (Có đa cộng tuyến hoàn hảo hoặc biến hằng số).', 'error');
        } else if (msg.includes('missing value') || msg.includes('NA/NaN')) {
            showToast('Lỗi: Dữ liệu chứa giá trị trống (NA). Đang thử dùng FIML, nhưng nếu vẫn lỗi hãy làm sạch dữ liệu.', 'error');
        } else if (msg.includes('model is not identified')) {
            showToast('Lỗi SEM/CFA: Mô hình không xác định (Not Identified). Kiểm tra lại số lượng biến quan sát (cần >= 3 biến/nhân tố) hoặc bậc tự do.', 'error');
        } else if (msg.includes('could not find function')) {
            showToast('Lỗi: Gói phân tích chưa tải xong. Vui lòng thử lại sau 5 giây.', 'error');
        } else if (msg.includes('covariance matrix is not positive definite')) {
            showToast('Lỗi: Ma trận hiệp phương sai không xác định dương (Not Positive Definite). Kiểm tra đa cộng tuyến hoặc kích thước mẫu quá nhỏ.', 'error');
        } else {
            // Translate common R errors if possible
            showToast(`Lỗi: ${msg.replace('Error in', '').substring(0, 100)}...`, 'error');
        }
    };

    // Workflow Mode Handlers (with batched updates)
    const handleProceedToEFA = (goodItems: string[]) => {
        // Batch state updates to reduce re-renders
        Promise.resolve().then(() => {
            setPreviousAnalysis({
                type: 'cronbach',
                variables: goodItems,
                goodItems,
                results: results?.data
            });
            setStep('efa-select');
            showToast(`Chuyển sang EFA với ${goodItems.length} items tốt`, 'success');
        });
    };

    const handleProceedToCFA = (factors: { name: string; indicators: string[] }[]) => {
        Promise.resolve().then(() => {
            setPreviousAnalysis({
                type: 'efa',
                variables: factors.flatMap(f => f.indicators),
                factors,
                results: results?.data
            });
            setStep('cfa-select');
            showToast(`Chuyển sang CFA với ${factors.length} factors`, 'success');
        });
    };

    const handleProceedToSEM = (factors: { name: string; indicators: string[] }[]) => {
        Promise.resolve().then(() => {
            setPreviousAnalysis({
                type: 'cfa',
                variables: factors.flatMap(f => f.indicators),
                factors,
                results: results?.data
            });
            setStep('sem-select');
            showToast(`Chuyển sang SEM với measurement model đã xác nhận`, 'success');
        });
    };

    const handleDataLoaded = (loadedData: any[], fname: string) => {
        // Validation: check file size
        if (loadedData.length > 50000) {
            showToast(t(locale, 'analyze.common.file_too_large'), 'error');
            return;
        }

        // Large data sampling (10k-50k rows)
        let processedData = loadedData;
        if (loadedData.length > 10000) {
            showToast(locale === 'vi' ? `Dữ liệu lớn (${loadedData.length} dòng). Đang lấy mẫu ngẫu nhiên 10,000 dòng...` : `Large dataset (${loadedData.length} rows). Randomly sampling 10,000 rows...`, 'info');
            // Random sampling
            const shuffled = [...loadedData].sort(() => 0.5 - Math.random());
            processedData = shuffled.slice(0, 10000);
            showToast(locale === 'vi' ? 'Đã lấy mẫu 10,000 dòng. Kết quả đại diện cho toàn bộ dữ liệu.' : 'Sampled 10,000 rows. Results represent the entire dataset.', 'success');
        }

        setData(processedData);
        setFilename(fname);

        // Profile the data
        const prof = profileData(processedData);
        setProfile(prof);
        setStep('profile');
    };

    const handleProceedToAnalysis = () => {
        setStep('analyze');
    };

    // Get numeric columns from profile
    const getNumericColumns = () => {
        if (!profile) return [];
        return Object.entries(profile.columnStats)
            .filter(([_, stats]) => stats.type === 'numeric')
            .map(([name, _]) => name);
    };

    // Get all column names from profile
    const getAllColumns = () => {
        if (!profile) return [];
        return Object.keys(profile.columnStats);
    };



    const runAnalysis = async (type: string) => {
        setIsAnalyzing(true);
        setAnalysisType(type);
        let progressInterval: NodeJS.Timeout | undefined;

        try {
            const numericColumns = getNumericColumns();

            if (numericColumns.length < 2) {
                showToast('Cần ít nhất 2 biến số để phân tích', 'error');
                setIsAnalyzing(false);
                setIsAnalyzing(false);
                return;
            }

            // NCS Credit Check
            if (user) {
                const cost = await getAnalysisCost(type);
                const hasEnough = await checkBalance(user.id, cost);
                if (!hasEnough) {
                    setRequiredCredits(cost);
                    setCurrentAnalysisCost(cost);
                    setShowInsufficientCredits(true);
                    setIsAnalyzing(false);
                    return;
                }
            }

            setAnalysisProgress(0);

            // Progress simulation
            progressInterval = setInterval(() => {
                setAnalysisProgress(prev => Math.min(prev + 10, 90));
            }, 300);

            const numericData = data.map(row =>
                numericColumns.map(col => Number(row[col]) || 0)
            );

            let analysisResults;
            setAnalysisProgress(30);

            switch (type) {
                case 'correlation':
                    analysisResults = await runCorrelation(numericData);
                    break;
                case 'descriptive':
                    analysisResults = await runDescriptiveStats(numericData);
                    break;

                default:
                    throw new Error('Unknown analysis type');
            }

            clearInterval(progressInterval);
            setAnalysisProgress(100);

            // Deduct credits on success
            if (user) {
                const cost = await getAnalysisCost(type);
                await deductCredits(user.id, cost, `${type === 'correlation' ? 'Correlation Matrix' : 'Descriptive Stats'}`);
                await logAnalysisUsage(user.id, type, cost);
                setNcsBalance(prev => Math.max(0, prev - cost));
            }

            setResults({
                type,
                data: analysisResults,
                columns: numericColumns
            });
            setStep('results');
            showToast(t(locale, 'analyze.common.analysis_complete'), 'success');
        } catch (error) {
            handleAnalysisError(error);
        } finally {
            setIsAnalyzing(false);
            setAnalysisProgress(0);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ctrl+S: Export PDF
            if (e.ctrlKey && e.key === 's' && step === 'results' && results) {
                e.preventDefault();
                handleExportPDF();
                showToast('Đang xuất PDF... (Ctrl+S)', 'info');
            }

            // Ctrl+E: Export Excel (future feature)
            if (e.ctrlKey && e.key === 'e' && step === 'results' && results) {
                e.preventDefault();
                showToast('Excel export sẽ có trong phiên bản tiếp theo (Ctrl+E)', 'info');
            }

            // Ctrl+N: New analysis
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                setStep('upload');
                setData([]);
                setProfile(null);
                setResults(null);
                showToast('Bắt đầu phân tích mới (Ctrl+N)', 'success');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [step, results]);

    // Handle PDF Export (Actual Logic)
    const runExportPDF = async () => {
        try {
            const { exportToPDF } = await import('@/lib/pdf-exporter');

            showToast('Đang tạo PDF, vui lòng đợi...', 'info');

            // Capture charts if any
            const chartImages: string[] = [];
            const container = document.getElementById('analysis-results-container');
            if (container) {
                const canvases = container.querySelectorAll('canvas');
                canvases.forEach(canvas => {
                    try {
                        chartImages.push(canvas.toDataURL('image/png'));
                    } catch (e) {
                        console.warn('Canvas capture failed:', e);
                    }
                });
            }

            // Handle batch Cronbach export - SINGLE FILE with all scales
            if (analysisType === 'cronbach-batch' && multipleResults.length > 0) {
                // Combine all results into single PDF
                const combinedTitle = `Cronbach's Alpha - Phân tích ${multipleResults.length} thang đo`;
                const combinedResults = {
                    batchResults: multipleResults.map(r => ({
                        scaleName: r.scaleName,
                        alpha: r.data.alpha || r.data.rawAlpha,
                        rawAlpha: r.data.rawAlpha,
                        standardizedAlpha: r.data.standardizedAlpha,
                        nItems: r.data.nItems,
                        itemTotalStats: r.data.itemTotalStats,
                        columns: r.columns
                    }))
                };

                await exportToPDF({
                    title: combinedTitle,
                    analysisType: 'cronbach-batch',
                    results: combinedResults,
                    columns: [],
                    filename: `cronbach_batch_${multipleResults.length}_scales_${Date.now()}.pdf`,
                    chartImages: []
                });
                if (user) {
                    await logExport(user.id, 'PDF: cronbach-batch');
                }
                showToast(`Đã xuất 1 file PDF tổng hợp ${multipleResults.length} thang đo!`, 'success');
            } else {
                // Single result export
                await exportToPDF({
                    title: `Phân tích ${analysisType}`,
                    analysisType,
                    results: results?.data || results,
                    columns: results?.columns || [],
                    filename: `statviet_${analysisType}_${Date.now()}.pdf`,
                    chartImages
                });
                if (user) {
                    await logExport(user.id, `PDF: ${analysisType}`);
                }
                showToast('Đã xuất PDF thành công!', 'success');
            }
        } catch (error) {
            console.error(error);
            showToast('Lỗi xuất PDF: Vui lòng thử lại', 'error');
        }
    };

    // Trigger Export Flow (Check for Part 3)
    const handleExportPDF = () => {
        // Always show survey if not done? Or just export?
        // User requested: Part 3 appears when User clicks Export.
        // We'll show it if not done yet.
        /*
        // UNCOMMENT TO FORCE SURVEY EVERY TIME:
        setShowApplicability(true);
        */

        // Logic: Check if survey done. If not, show survey. If yes, just export.
        // But user might want to give feedback on THIS specific manuscript (Q8).
        // So we should probably show it, but maybe allow skipping?
        // For now, consistent with prompt "Part 3 appears..." -> We show it.
        setShowApplicability(true);
    };

    // Map steps for StepIndicator
    const getStepId = (): string => {
        if (step === 'upload') return 'upload';
        if (step === 'profile') return 'profile';
        if (step === 'results') return 'results';
        return 'analyze'; // All selection/analysis steps
    };

    const steps = [
        { id: 'upload', label: t(locale, 'analyze.steps.upload') },
        { id: 'profile', label: t(locale, 'analyze.steps.profile') },
        { id: 'analyze', label: t(locale, 'analyze.steps.analyze') },
        { id: 'results', label: t(locale, 'analyze.steps.results') }
    ];

    if (loading) {
        const webRStatus = getWebRStatus();
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium">{t(locale, 'analyze.common.authenticating')}</p>
                    {webRStatus.isReady && (
                        <p className="text-green-600 text-sm">✓ {t(locale, 'analyze.common.engine_ready')}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Toast Notification */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Mobile WebR Fallback Warning */}
            <MobileWebRFallback />

            {/* Offline Warning Banner */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-2 px-4 text-center z-50 flex items-center justify-center gap-2">
                    <WifiOff className="w-5 h-5" />
                    <span className="font-semibold">{locale === 'vi' ? 'Không có kết nối Internet. Một số tính năng có thể không hoạt động.' : 'No Internet connection. Some features may not work.'}</span>
                </div>
            )}

            {/* Analysis Progress Bar */}
            {isAnalyzing && analysisProgress > 0 && (
                <div className="fixed top-0 left-0 right-0 z-40">
                    <div className="h-1 bg-blue-200">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${analysisProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Status Indicators */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> R Engine Ready
                </div>
            </div>

            {showRestoreBanner && (
                 <div className="bg-amber-50 border-b border-amber-200 py-3 relative z-30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <RotateCcw className="w-5 h-5 text-amber-600" />
                            <p className="text-sm text-amber-800">
                                <span className="font-bold">{t(locale, 'analyze.common.restored_session')}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRestore}
                                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                            >
                                {t(locale, 'analyze.common.restore_now')}
                            </button>
                            <button
                                onClick={discardSaved}
                                className="px-3 py-1.5 text-amber-700 hover:bg-amber-100 text-sm font-medium rounded-lg transition-colors"
                            >
                                {t(locale, 'analyze.common.discard_session')}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Header with Integrated Toolbar */}
            <Header
                user={user}
                profile={userProfile}
                hideNav={false}
                centerContent={
                    <AnalysisToolbar
                        isPrivateMode={isPrivateMode}
                        setIsPrivateMode={setIsPrivateMode}
                        clearSession={() => {
                            clearSession();
                            showToast(t(locale, 'analyze.common.session_cleared'), 'info');
                        }}
                        filename={filename}
                        onSave={() => setIsSaveModalOpen(true)}
                        locale={locale}
                    />
                }
            />

            <div className="bg-blue-50/50 border-b border-blue-100 py-1">
                <div className="container mx-auto px-6 flex items-center justify-center gap-2 text-[11px] text-blue-600/80">
                    <Shield className="w-3 h-3" />
                    <span className="font-semibold">{t(locale, 'analyze.common.security_label')}:</span>
                    <span>{t(locale, 'analyze.common.security')}</span>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-center gap-4 mb-8">
                    {['upload', 'profile', 'analyze', 'results'].map((s, idx) => {
                        const stepOrder = ['upload', 'profile', 'analyze', 'results'];

                        // Map sub-steps to their main steps for UI consistency
                        const getMainStep = (current: string) => {
                            if (stepOrder.includes(current)) return current;
                            if (current.endsWith('-select')) return 'analyze';
                            return current;
                        };

                        const effectiveStep = getMainStep(step);
                        const currentIdx = stepOrder.indexOf(effectiveStep);
                        const isCompleted = currentIdx > idx;
                        const isCurrent = effectiveStep === s;
                        const isClickable = isCompleted || isCurrent;

                        return (
                            <div key={s} className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isClickable) {
                                            if (s === 'analyze' && step.endsWith('-select')) {
                                                setStep('analyze'); // Go back to selector
                                            } else {
                                                setStep(s as AnalysisStep);
                                            }
                                        }
                                    }}
                                    disabled={!isClickable}
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                                        ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                                            isCompleted ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-110' :
                                                'bg-gray-200 text-gray-500 cursor-not-allowed'}
                                        ${isClickable ? 'cursor-pointer hover:shadow-lg' : ''}
                                    `}
                                    title={isClickable ? `${t(locale, 'analyze.common.back')}: ${steps.find(st => st.id === s)?.label || s}` : undefined}
                                >
                                    {idx + 1}
                                </button>
                                {idx < 3 && (
                                    <div className={`w-16 h-1 ${currentIdx > idx ?
                                        'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="py-8">

                    {step === 'upload' && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    {t(locale, 'analyze.upload.title')}
                                </h2>
                                <p className="text-gray-600">
                                    {t(locale, 'analyze.upload.desc')}
                                </p>
                            </div>
                            <FileUpload onDataLoaded={handleDataLoaded} locale={locale} />
                        </div>
                    )}

                    {step === 'profile' && profile && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    {t(locale, 'analyze.profile.title')}
                                </h2>
                                <p className="text-gray-600">
                                    {t(locale, 'analyze.profile.desc')}
                                </p>
                            </div>
                            <DataProfiler profile={profile} onProceed={handleProceedToAnalysis} locale={locale} />
                        </div>
                    )}

                    {step === 'analyze' && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    {t(locale, 'analyze.selector.title')}
                                </h2>
                                <p className="text-gray-600">
                                    {t(locale, 'analyze.selector.desc')}
                                </p>
                            </div>

                            <AnalysisSelector
                                onSelect={(s) => setStep(s as AnalysisStep)}
                                onRunAnalysis={runAnalysis}
                                isAnalyzing={isAnalyzing}
                                mode={mode}
                                locale={locale}
                            />

                            {isAnalyzing && (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                                    <p className="mt-4 text-gray-600">{t(locale, 'analyze.common.analyzing')}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Basic Analysis Forms (Descriptive, T-Test, ANOVA, Chi-Square, Non-Parametric) */}
                    {['descriptive-select', 'ttest-select', 'ttest-paired-select', 'anova-select', 'chisq-select', 'fisher-select', 'mannwhitney-select', 'kruskalwallis-select', 'wilcoxon-select'].includes(step) && (
                        <BasicStatsView
                            step={step}
                            data={data}
                            columns={getNumericColumns()}
                            allColumns={getAllColumns()}
                            profile={profile}
                            user={user}
                            setResults={setResults}
                            setStep={setStep}
                            setNcsBalance={setNcsBalance}
                            showToast={showToast}
                            setAnalysisType={setAnalysisType}
                            setRequiredCredits={setRequiredCredits}
                            setCurrentAnalysisCost={setCurrentAnalysisCost}
                            setShowInsufficientCredits={setShowInsufficientCredits}
                            locale={locale}
                        />
                    )}

                    {/* Multivariate Analysis (Cluster & Two-Way ANOVA) */}
                    {['cluster-select', 'twoway-anova-select'].includes(step) && (
                        <MultivariateView
                            step={step}
                            data={data}
                            columns={getNumericColumns()} // For Cluster (numeric)
                            allColumns={getAllColumns()} // For Two-Way ANOVA (factors)
                            profile={profile}
                            user={user}
                            setResults={setResults}
                            setStep={setStep}
                            setNcsBalance={setNcsBalance}
                            showToast={showToast}
                            setAnalysisType={setAnalysisType}
                            setRequiredCredits={setRequiredCredits}
                            setCurrentAnalysisCost={setCurrentAnalysisCost}
                            setShowInsufficientCredits={setShowInsufficientCredits}
                            locale={locale}
                        />
                    )}

                    {/* Mediation & Moderation Analysis */}
                    {['mediation-select', 'moderation-select'].includes(step) && (
                        <MediationView
                            step={step}
                            data={data}
                            columns={getNumericColumns()}
                            user={user}
                            setResults={setResults}
                            setStep={setStep}
                            setNcsBalance={setNcsBalance}
                            showToast={showToast}
                            setAnalysisType={setAnalysisType}
                            setRequiredCredits={setRequiredCredits}
                            setCurrentAnalysisCost={setCurrentAnalysisCost}
                            setShowInsufficientCredits={setShowInsufficientCredits}
                            locale={locale}
                        />
                    )}

                    {/* Reliability & Factor Analysis */}
                    {['cronbach-select', 'cronbach-batch-select', 'omega-select', 'efa-select', 'cfa-select', 'sem-select'].includes(step) && (
                        <ReliabilityView
                            step={step}
                            data={data}
                            columns={getNumericColumns()}
                            user={user}
                            setResults={setResults}
                            setStep={setStep}
                            setNcsBalance={setNcsBalance}
                            showToast={showToast}
                            setScaleName={setScaleName}
                            setMultipleResults={setMultipleResults}
                            setAnalysisType={setAnalysisType}
                            setRequiredCredits={setRequiredCredits}
                            setCurrentAnalysisCost={setCurrentAnalysisCost}
                            setShowInsufficientCredits={setShowInsufficientCredits}
                            locale={locale}
                        />
                    )}

                    {/* Regression Analysis */}
                    {['regression-select', 'logistic-select'].includes(step) && (
                        <RegressionView
                            step={step}
                            data={data}
                            columns={getNumericColumns()}
                            user={user}
                            setResults={setResults}
                            setStep={setStep}
                            setNcsBalance={setNcsBalance}
                            showToast={showToast}
                            setAnalysisType={setAnalysisType}
                            setRequiredCredits={setRequiredCredits}
                            setCurrentAnalysisCost={setCurrentAnalysisCost}
                            setShowInsufficientCredits={setShowInsufficientCredits}
                            locale={locale}
                        />
                    )}







                    {step === 'results' && (results || multipleResults.length > 0) && (

                        <div className="max-w-6xl mx-auto space-y-6" id="results-container">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    {t(locale, 'analyze.results.title')}
                                </h2>
                                <p className="text-gray-600">
                                    {analysisType === 'cronbach' && `Cronbach's Alpha${results?.scaleName ? ` - ${results.scaleName}` : ''}`}
                                    {analysisType === 'omega' && `McDonald's Omega${results?.scaleName ? ` - ${results.scaleName}` : ''}`}
                                    {analysisType === 'cronbach-batch' && `Cronbach's Alpha - ${multipleResults.length} ${locale === 'vi' ? 'thang đo' : 'scales'}`}
                                    {analysisType === 'omega-batch' && `McDonald's Omega - ${multipleResults.length} ${locale === 'vi' ? 'thang đo' : 'scales'}`}
                                    {analysisType === 'correlation' && (locale === 'vi' ? "Ma trận tương quan" : "Correlation Matrix")}
                                    {analysisType === 'descriptive' && (locale === 'vi' ? "Thống kê mô tả" : "Descriptive Statistics")}
                                    {analysisType === 'ttest' && "Independent Samples T-test"}
                                    {analysisType === 'ttest-paired' && "Paired Samples T-test"}
                                    {analysisType === 'anova' && "One-Way ANOVA"}
                                    {analysisType === 'efa' && "Exploratory Factor Analysis"}
                                    {analysisType === 'regression' && "Multiple Linear Regression"}
                                    {analysisType === 'logistic' && "Logistic Regression"}
                                    {analysisType === 'twoway-anova' && "Two-Way ANOVA"}
                                    {analysisType === 'mediation' && "Mediation Analysis"}
                                    {analysisType === 'moderation' && "Moderation Analysis"}
                                    {analysisType === 'cluster' && "Cluster Analysis (K-Means)"}
                                    {analysisType === 'mann-whitney' && "Mann-Whitney U Test"}
                                    {analysisType === 'kruskal-wallis' && "Kruskal-Wallis Test"}
                                    {analysisType === 'wilcoxon' && "Wilcoxon Signed Rank Test"}
                                </p>
                            </div>

                            {/* Single Result Display */}
                            {results && analysisType !== 'cronbach-batch' && analysisType !== 'omega-batch' && (
                                <ResultsDisplay
                                    analysisType={analysisType}
                                    results={results.data}
                                    columns={results.columns}
                                    onProceedToEFA={handleProceedToEFA}
                                    onProceedToCFA={handleProceedToCFA}
                                    onProceedToSEM={handleProceedToSEM}
                                    userProfile={userProfile}
                                    scaleName={results.scaleName}
                                />
                            )}

                            {/* Batch Results Display */}
                            {(analysisType === 'cronbach-batch' || analysisType === 'omega-batch') && multipleResults.length > 0 && (
                                <div className="space-y-8">
                                    {/* Summary Table */}
                                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                                        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">{locale === 'vi' ? 'Tổng hợp độ tin cậy các thang đo' : 'Aggregated Scale Reliability'}</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm text-slate-800">
                                                <thead className="bg-slate-50 text-slate-700">
                                                    <tr className="border-b-2 border-slate-300">
                                                        <th className="py-3 px-4 font-semibold rounded-tl-lg">{locale === 'vi' ? 'Thang đo' : 'Scale'}</th>
                                                        <th className="py-3 px-4 font-semibold text-center">{locale === 'vi' ? 'Số biến' : 'Items'}</th>
                                                        <th className="py-3 px-4 font-semibold text-center">Cronbach&apos;s Alpha</th>
                                                        <th className="py-3 px-4 font-semibold text-center rounded-tr-lg">{locale === 'vi' ? 'Đánh giá' : 'Evaluation'}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {multipleResults.map((r, idx) => {
                                                        const alpha = r.data?.alpha || r.data?.rawAlpha || 0;
                                                        let evaluation = '';
                                                        let evalColor = '';
                                                        if (alpha >= 0.9) { evaluation = locale === 'vi' ? 'Xuất sắc' : 'Excellent'; evalColor = 'text-green-800 bg-green-100 ring-1 ring-green-200'; }
                                                        else if (alpha >= 0.8) { evaluation = locale === 'vi' ? 'Tốt' : 'Good'; evalColor = 'text-green-700 bg-emerald-50 ring-1 ring-emerald-200'; }
                                                        else if (alpha >= 0.7) { evaluation = locale === 'vi' ? 'Chấp nhận' : 'Acceptable'; evalColor = 'text-blue-700 bg-blue-50 ring-1 ring-blue-200'; }
                                                        else if (alpha >= 0.6) { evaluation = locale === 'vi' ? 'Khá' : 'Fair'; evalColor = 'text-amber-700 bg-amber-50 ring-1 ring-amber-200'; }
                                                        else { evaluation = locale === 'vi' ? 'Kém' : 'Poor'; evalColor = 'text-red-700 bg-red-50 ring-1 ring-red-200'; }

                                                        return (
                                                            <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                                                <td className="py-3 px-4 font-bold text-slate-700">{r.scaleName}</td>
                                                                <td className="py-3 px-4 text-center font-medium text-slate-600">{r.columns.length}</td>
                                                                <td className="py-3 px-4 text-center font-bold text-slate-900">{alpha.toFixed(3)}</td>
                                                                <td className="py-3 px-4 text-center">
                                                                    <span className={`px-2.5 py-1 rounded-md text-sm font-semibold shadow-sm ${evalColor}`}>
                                                                        {evaluation}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Detailed Results for Each Group */}
                                    {multipleResults.map((r, idx) => (
                                        <div key={idx} className="border-t pt-6">
                                            <h4 className="text-lg font-bold text-gray-800 mb-4">
                                                {locale === 'vi' ? 'Chi tiết' : 'Details'}: {r.scaleName} ({r.columns.join(', ')})
                                            </h4>
                                            <ResultsDisplay
                                                analysisType="cronbach"
                                                results={r.data}
                                                columns={r.columns}
                                                userProfile={userProfile}
                                                scaleName={r.scaleName}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        setResults(null);
                                        setStep('analyze');
                                    }}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                                >
                                    {t(locale, 'analyze.results.back')}
                                </button>
                                <button
                                    onClick={handleExportPDF}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    <FileText className="w-5 h-5" />
                                    {t(locale, 'analyze.results.exportPdf')}
                                </button>
                                <div className="relative group">
                                    <button
                                        disabled
                                        className="px-6 py-3 bg-blue-400 text-white font-semibold rounded-lg flex items-center gap-2 cursor-not-allowed opacity-70"
                                    >
                                        <FileText className="w-5 h-5" />
                                        {t(locale, 'analyze.results.exportWord')}
                                    </button>
                                    <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        Soon
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        setStep('upload');
                                        setData([]);
                                        setProfile(null);
                                        setResults(null);
                                        setMultipleResults([]);
                                    }}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    {t(locale, 'analyze.results.newAnalysis')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <Footer locale={locale} />

            {/* Feedback Part 1: Demographics Survey */}
            <DemographicSurvey
                isOpen={showDemographics}
                onComplete={() => {
                    setShowDemographics(false);
                    showToast(locale === 'vi' ? 'Cảm ơn bạn đã cung cấp thông tin!' : 'Thank you for your feedback!', 'success');
                }}
            />

            {/* Feedback Part 3: Applicability Survey */}
            <ApplicabilitySurvey
                isOpen={showApplicability}
                onComplete={() => {
                    setShowApplicability(false);
                    runExportPDF(); // Proceed to export
                }}
                onCancel={() => {
                    setShowApplicability(false);
                    // Just close, do not export? Or allow export without feedback?
                    // Typically "Cancel" means cancel the action.
                    // If they want to export without feedback, they should probably have a "Skip" option inside (not implemented yet),
                    // or we assume completing Q8 is mandatory for the "Value" (Export).
                }}
            />

            {/* Save Project Modal */}
            <SaveProjectModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                data={data}
                results={results}
                analysisType={analysisType}
                step={step}
                locale={locale}
            />

            {/* Insufficient Credits Modal */}
            <InsufficientCreditsModal
                isOpen={showInsufficientCredits}
                onClose={() => setShowInsufficientCredits(false)}
                required={requiredCredits}
                available={ncsBalance}
            />
        </div >
    );
}
