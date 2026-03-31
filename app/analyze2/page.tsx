'use client';

// Prevent prerendering - this page requires client-side Supabase
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { DataProfiler } from '@/components/DataProfiler';
import { profileData, DataProfile } from '@/lib/data-profiler';
import { BarChart3, FileText, Shield, Trash2, Eye, EyeOff, Wifi, WifiOff, RotateCcw, XCircle, Sparkles, TrendingUp, Target, Users, Upload, Search, Eraser, Ruler, Building2, Zap, CheckCircle2, Network, RefreshCw } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';
import { WebRStatus } from '@/components/WebRStatus';
import { useAnalysisSession } from '@/hooks/useAnalysisSession';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { AnalysisStep } from '@/types/analysis';
import { Badge } from '@/components/ui/Badge';
import Header from '@/components/layout/Header';
import AnalysisToolbar from '@/components/analyze/AnalysisToolbar';
import SaveProjectModal from '@/components/analyze/SaveProjectModal';
import Footer from '@/components/layout/Footer';
import { getSupabase } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { initWebR, getWebRStatus, setProgressCallback } from '@/lib/webr/core';
import { MobileWebRFallback } from '@/components/MobileWebRFallback';
import { preloadPLSSEMPackages, loadPackageIfNeeded } from '@/lib/webr/package-loader';
import { PLSSEMView } from '@/components/analyze/views/PLSSEMView';
import { ReliabilityView } from '@/components/analyze/views/ReliabilityView';
import { MultivariateView } from '@/components/analyze/views/MultivariateView';
import { RegressionView } from '@/components/analyze/views/RegressionView';
import { MediationView } from '@/components/analyze/views/MediationView';
import AdvancedMethodView from '@/components/analyze/views/AdvancedMethodView';
import { ResultSkeleton } from '@/components/results/shared/ResultSkeleton';
import dynamicImport from 'next/dynamic';
import { Locale, t, getStoredLocale } from '@/lib/i18n';

// Import PLS-SEM analysis functions
import {
    runMcDonaldOmega,
    runOutlierDetection,
    runHTMTMatrix,
    runVIFCheck,
    runPLSSEM,
    runBootstrapping,
    runMediationModeration,
    runIPMA,
    runMGA,
    runBlindfolding
} from '@/lib/webr/pls-sem';

// Import descriptive statistics
import { runDescriptiveStats } from '@/lib/webr/analyses/descriptive';
import { runCronbachAlpha } from '@/lib/webr/analyses/reliability';

// Lazy load result components to reduce initial bundle size
const OmegaResults = dynamicImport(() => import('@/components/results/plssem/OmegaResults').then(m => ({ default: m.OmegaResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const OutlierResults = dynamicImport(() => import('@/components/results/plssem/OutlierResults').then(m => ({ default: m.OutlierResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const HTMTResults = dynamicImport(() => import('@/components/results/plssem/HTMTResults').then(m => ({ default: m.HTMTResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const VIFResults = dynamicImport(() => import('@/components/results/plssem/VIFResults').then(m => ({ default: m.VIFResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const BootstrapResults = dynamicImport(() => import('@/components/results/plssem').then(m => ({ default: m.BootstrapResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const IPMAResults = dynamicImport(() => import('@/components/results/plssem').then(m => ({ default: m.IPMAResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const MGAResults = dynamicImport(() => import('@/components/results/plssem').then(m => ({ default: m.MGAResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const BlindfoldingResults = dynamicImport(() => import('@/components/results/plssem').then(m => ({ default: m.BlindfoldingResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const CronbachResults = dynamicImport(() => import('@/components/results/reliability/CronbachResults').then(m => ({ default: m.CronbachResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const EFAResults = dynamicImport(() => import('@/components/results/factor/EFAResults').then(m => ({ default: m.EFAResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const CFAResults = dynamicImport(() => import('@/components/results/factor/CFAResults').then(m => ({ default: m.CFAResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const RegressionResults = dynamicImport(() => import('@/components/results/regression/RegressionResults').then(m => ({ default: m.RegressionResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const MediationResults = dynamicImport(() => import('@/components/results/mediation/MediationResults').then(m => ({ default: m.MediationResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});

const ClusterResults = dynamicImport(() => import('@/components/results/cluster/ClusterResults').then(m => ({ default: m.ClusterResults })), {
    loading: () => <ResultSkeleton />,
    ssr: false
});





type AnalysisPhase =
    | 'upload' | 'profile'
    | 'phase1' | 'phase2' | 'phase3' | 'phase4'
    | 'omega-select' | 'outlier-select' | 'cronbach-select' | 'efa-select' | 'cfa-select' | 'regression-select' | 'mediation-select' | 'cluster-select'
    | 'htmt-select' | 'vif-select'
    | 'bootstrap-select' | 'mediation-select'
    | 'ipma-select' | 'mga-select' | 'blindfolding-select' | 'plssem-select' | 'cbsem-select'
    | 'results';

export default function Analyze2Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>}>
            <Analyze2Content />
        </Suspense>
    );
}

function Analyze2Content() {
    const router = useRouter();
    const { user, profile: userProfile, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);

    // Session State Management
    const {
        isPrivateMode, setIsPrivateMode,
        clearSession,
        data, setData,
        filename, setFilename,
        profile, setProfile,
    } = useAnalysisSession();

    const [locale, setLocale] = useState<Locale>(getStoredLocale());
    const isVi = locale === 'vi';

    useEffect(() => {
        setLocale(getStoredLocale());
    }, []);

    // Local state
    const [phase, setPhase] = useState<AnalysisPhase>('upload');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);

    // PLS-SEM method selection
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [currentResults, setCurrentResults] = useState<any>(null);
    const [results, setResults] = useState<any>(null);

    // Descriptive statistics results
    const [descriptiveResults, setDescriptiveResults] = useState<any>(null);
    const [cronbachResults, setCronbachResults] = useState<any>(null);

    // Credit management for insufficient credits modal
    const [requiredCredits, setRequiredCredits] = useState(0);
    const [currentAnalysisCost, setCurrentAnalysisCost] = useState(0);
    const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
    const [ncsBalance, setNcsBalance] = useState(userProfile?.ncs_balance || 0);

    // Results storage for each phase
    const [phase1Results, setPhase1Results] = useState<any>(null);
    const [phase2Results, setPhase2Results] = useState<any>(null);
    const [phase3Results, setPhase3Results] = useState<any>(null);
    const [phase4Results, setPhase4Results] = useState<any>(null);

    // States for ReliabilityView (Cronbach's Alpha)
    const [scaleName, setScaleName] = useState('');
    const [multipleResults, setMultipleResults] = useState<any[]>([]);
    const [analysisType, setAnalysisType] = useState('');

    // Online/Offline detection
    const { isOnline } = useOnlineStatus();

    useEffect(() => {
        if (!authLoading) {
            setLoading(false);
        }
    }, [authLoading]);

    // Auto-initialize WebR on page load
    useEffect(() => {
        const status = getWebRStatus();
        if (!status.isReady && !status.isLoading) {
            console.log('[WebR] Starting auto-initialization for Analyze2...');

            setProgressCallback((msg) => {
                setToast({ message: msg, type: 'info' });
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
    }, []);

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleDataLoaded = (loadedData: any[], fname: string) => {
        if (loadedData.length > 50000) {
            showToast(t(locale, 'analyze.common.file_too_large'), 'error');
            return;
        }

        let processedData = loadedData;
        if (loadedData.length > 10000) {
            showToast(locale === 'vi' ? `Dữ liệu lớn (${loadedData.length} dòng). Đang lấy mẫu ngẫu nhiên 10,000 dòng...` : `Large dataset (${loadedData.length} rows). Randomly sampling 10,000 rows...`, 'info');
            const shuffled = [...loadedData].sort(() => 0.5 - Math.random());
            processedData = shuffled.slice(0, 10000);
            showToast(locale === 'vi' ? 'Đã lấy mẫu 10,000 dòng. Kết quả đại diện cho toàn bộ dữ liệu.' : 'Sampled 10,000 rows. Results represent the entire dataset.', 'success');
        }

        setData(processedData);
        setFilename(fname);

        const prof = profileData(processedData);
        setProfile(prof);
        setPhase('profile');
    };

    const handleProceedToPhase1 = () => {
        setPhase('phase1');
    };

    const getNumericColumns = () => {
        if (!profile) return [];
        return Object.entries(profile.columnStats)
            .filter(([_, stats]) => stats.type === 'numeric')
            .map(([name, _]) => name);
    };

    const getAllColumns = () => {
        if (!profile) return [];
        return Object.keys(profile.columnStats);
    };

    // Handler for Descriptive Statistics
    const handleDescriptiveStats = async () => {
        try {
            setIsAnalyzing(true);
            showToast(t(locale, 'analyze.common.analyzing'), 'info');

            // Get numeric columns
            const numericCols = getNumericColumns();
            if (numericCols.length === 0) {
                showToast('Không có cột số để phân tích', 'error');
                setIsAnalyzing(false);
                return;
            }

            // Extract numeric data
            const numericData = data.map(row =>
                numericCols.map(col => {
                    const val = row[col];
                    return typeof val === 'number' ? val : parseFloat(val);
                })
            );

            // Run analysis
            const result = await runDescriptiveStats(numericData);

            // Add column names to results
            const resultsWithNames = {
                ...result,
                columnNames: numericCols
            };

            setDescriptiveResults(resultsWithNames);
            showToast(t(locale, 'analyze.common.analysis_complete'), 'success');
        } catch (error: any) {
            console.error('Descriptive stats error:', error);
            showToast(error.message || 'Lỗi khi tính toán thống kê', 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };


    // Phase navigation
    const phases = [
        { id: 'upload' as AnalysisPhase, label: t(locale, 'analyze.steps.upload'), icon: Upload, tooltip: locale === 'vi' ? 'Tải dữ liệu lên hệ thống' : 'Upload dataset' },
        { id: 'profile' as AnalysisPhase, label: t(locale, 'analyze.steps.profile'), icon: Search, tooltip: locale === 'vi' ? 'Kiểm tra chất lượng dữ liệu' : 'Data quality check' },
        { id: 'phase1' as AnalysisPhase, label: t(locale, 'pls_workflow.phases.phase1.title'), icon: Eraser, tooltip: t(locale, 'pls_workflow.phases.phase1.desc') },
        { id: 'phase2' as AnalysisPhase, label: t(locale, 'pls_workflow.phases.phase2.title'), icon: Ruler, tooltip: t(locale, 'pls_workflow.phases.phase2.desc') },
        { id: 'phase3' as AnalysisPhase, label: t(locale, 'pls_workflow.phases.phase3.title'), icon: Building2, tooltip: t(locale, 'pls_workflow.phases.phase3.desc') },
        { id: 'phase4' as AnalysisPhase, label: t(locale, 'pls_workflow.phases.phase4.title'), icon: Zap, tooltip: t(locale, 'pls_workflow.phases.phase4.desc') },
        { id: 'results' as AnalysisPhase, label: t(locale, 'analyze.steps.results'), icon: CheckCircle2, tooltip: locale === 'vi' ? 'Xem kết quả & Xuất báo cáo' : 'View results & export' },
    ];

    const getCurrentPhaseIndex = () => {
        return phases.findIndex(p => p.id === phase);
    };

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
            {/* Toast Notification */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Mobile WebR Fallback Warning */}
            <MobileWebRFallback />

            {/* Offline Warning Banner */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-2 px-4 text-center z-50 flex items-center justify-center gap-2">
                    <WifiOff className="w-5 h-5" />
                    <span className="font-semibold">{locale === 'vi' ? 'Không có kết nối Internet. Một số tính năng có thể không hoạt động.' : 'No internet connection. Some features may be limited.'}</span>
                </div>
            )}

            {/* Analysis Progress Bar */}
            {isAnalyzing && analysisProgress > 0 && (
                <div className="fixed top-0 left-0 right-0 z-40">
                    <div className="h-1 bg-purple-200">
                        <div
                            className="h-full bg-purple-600 transition-all duration-300"
                            style={{ width: `${analysisProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Main Navigation Header */}
            <Header
                user={user}
                profile={userProfile}
                hideNav={false}
            />

            {/* Dedicated Analysis Control Bar - Sits below Header */}
            <div className="sticky top-16 z-30 bg-slate-900 border-b border-slate-800 py-3 shadow-2xl">
                <div className="container mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 pr-4 border-r border-slate-700">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            <span className="font-black text-xs text-white uppercase tracking-widest">
                                PLS-SEM Engine
                            </span>
                        </div>
                        {filename && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg text-slate-400 text-[10px] font-bold uppercase tracking-tighter max-w-[150px] truncate">
                                <FileText className="w-3 h-3" /> {filename}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <AnalysisToolbar
                            isPrivateMode={isPrivateMode}
                            setIsPrivateMode={setIsPrivateMode}
                            clearSession={() => {
                                clearSession();
                                showToast(isVi ? 'Đã dọn dẹp phiên làm việc' : 'Session cleared', 'info');
                            }}
                            filename={filename}
                            onSave={() => setIsSaveModalOpen(true)}
                            locale={locale}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-purple-50/50 border-b border-purple-100 py-1">
                <div className="container mx-auto px-6 flex items-center justify-center gap-2 text-[11px] text-purple-600/80">
                    <Shield className="w-3 h-3" />
                    <span className="font-semibold">{t(locale, 'analyze.common.security_label')}:</span>
                    <span>{t(locale, 'pls_workflow.security')}</span>
                </div>
            </div>

            {/* Phase Progress Indicator */}
            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto">
                    {phases.map((p, idx) => {
                        const currentIdx = getCurrentPhaseIndex();
                        const isCompleted = currentIdx > idx;
                        const isCurrent = phase === p.id;
                        // Allow free navigation to all phases (analysis phases are independent)
                        // Only lock phases that require data (phase1-4, results) if no data uploaded
                        const requiresData = ['phase1', 'phase2', 'phase3', 'phase4', 'results'].includes(p.id);
                        const hasData = data.length > 0;
                        const isClickable = requiresData ? hasData : true;

                        return (
                            <div key={p.id} className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isClickable) {
                                            setPhase(p.id as AnalysisPhase);
                                        }
                                    }}
                                    disabled={!isClickable}
                                    className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all
                    ${isCurrent ? 'bg-purple-600 text-white ring-4 ring-purple-100 scale-105' :
                                            isCompleted ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105' :
                                                'bg-gray-200 text-gray-500 cursor-not-allowed'}
                    ${isClickable ? 'cursor-pointer hover:shadow-lg' : ''}
                  `}
                                    title={isClickable ? p.tooltip || p.label : undefined}
                                >
                                    {<p.icon className="w-6 h-6" />}
                                    <span className="text-xs font-medium whitespace-nowrap">{p.label}</span>
                                </button>
                                {idx < phases.length - 1 && (
                                    <div className={`w-8 h-1 mx-1 ${currentIdx > idx ? 'bg-green-500' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="py-8">
                    {phase === 'upload' && (
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

                    {phase === 'profile' && profile && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    {t(locale, 'analyze.profile.title')}
                                </h2>
                                <p className="text-gray-600">
                                    {t(locale, 'analyze.profile.desc')}
                                </p>
                            </div>
                            <DataProfiler profile={profile} onProceed={handleProceedToPhase1} locale={locale} />
                        </div>
                    )}

                    {phase === 'phase1' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Eraser className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {t(locale, 'pls_workflow.phases.phase1.title')}
                                        </h2>
                                        <p className="text-gray-600">{t(locale, 'pls_workflow.phases.phase1.desc')}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Descriptive Statistics */}
                                    <button
                                        onClick={handleDescriptiveStats}
                                        disabled={isAnalyzing}
                                        className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-lg transition-all text-left group bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={t(locale, 'methods_guide.descriptive.purpose')}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <BarChart3 className="w-6 h-6 text-purple-600" />
                                            <h3 className="font-bold text-lg group-hover:text-purple-600">Descriptive Statistics</h3>
                                            <Badge variant="success">Working</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{t(locale, 'methods_guide.descriptive.purpose')}</p>
                                    </button>

                                    {/* McDonald's Omega */}
                                    <button
                                        onClick={() => setPhase('omega-select')}
                                        className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-lg transition-all text-left group bg-purple-50"
                                        title={t(locale, 'pls_workflow.methods.omega.desc')}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Sparkles className="w-6 h-6 text-purple-600" />
                                            <h3 className="font-bold text-lg group-hover:text-purple-600">McDonald's Omega (ω)</h3>
                                            <Badge variant="success">{t(locale, 'analyze.common.working')}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{t(locale, 'pls_workflow.methods.omega.desc')}</p>
                                    </button>

                                    {/* Cronbach's Alpha */}
                                    <button
                                        onClick={() => setPhase('cronbach-select')}
                                        className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-lg transition-all text-left group bg-purple-50"
                                        title={t(locale, 'methods_guide.cronbach.purpose')}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-6 h-6 text-blue-600" />
                                            <h3 className="font-bold text-lg group-hover:text-purple-600">Cronbach's Alpha (α)</h3>
                                            <Badge variant="success">{t(locale, 'analyze.common.working')}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{t(locale, 'methods_guide.cronbach.purpose')}</p>
                                    </button>

                                    {/* Outlier Detection */}
                                    <button
                                        onClick={() => setPhase('outlier-select')}
                                        className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-lg transition-all text-left group bg-purple-50"
                                        title="Mahalanobis Distance method - Detects multivariate outliers that may distort results"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <XCircle className="w-6 h-6 text-red-600" />
                                            <h3 className="font-bold text-lg group-hover:text-purple-600">{locale === 'vi' ? 'Kiểm định Outlier' : 'Outlier Detection'}</h3>
                                            <Badge variant="success">{t(locale, 'analyze.common.working')}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Mahalanobis Distance - {locale === 'vi' ? 'Phát hiện và loại bỏ các điểm dị biệt' : 'Detect & remove multivariate outliers'}</p>
                                    </button>
                                </div>

                                {/* Descriptive Statistics Results */}
                                {descriptiveResults && (
                                    <div className="mt-6 bg-purple-50 rounded-lg p-6 border border-purple-200">
                                        <h3 className="text-lg font-bold text-purple-900 mb-4">{t(locale, 'analyze.results.title')} - {t(locale, 'methods.descriptive')}</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-purple-100">
                                                        <th className="px-4 py-2 text-left font-semibold">{t(locale, 'tables.variable')}</th>
                                                        <th className="px-4 py-2 text-right font-semibold">{t(locale, 'tables.n')}</th>
                                                        <th className="px-4 py-2 text-right font-semibold">{t(locale, 'tables.mean')}</th>
                                                        <th className="px-4 py-2 text-right font-semibold">{t(locale, 'tables.sd')}</th>
                                                        <th className="px-4 py-2 text-right font-semibold">{t(locale, 'tables.min')}</th>
                                                        <th className="px-4 py-2 text-right font-semibold">{t(locale, 'tables.max')}</th>
                                                        <th className="px-4 py-2 text-right font-semibold">{t(locale, 'tables.median')}</th>
                                                        <th className="px-4 py-2 text-right font-semibold">{t(locale, 'tables.skew')}</th>
                                                        <th className="px-4 py-2 text-right font-semibold">{t(locale, 'tables.kurtosis')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {descriptiveResults.columnNames.map((colName: string, idx: number) => (
                                                        <tr key={idx} className="border-b border-purple-100 hover:bg-purple-50">
                                                            <td className="px-4 py-2 font-medium">{colName}</td>
                                                            <td className="px-4 py-2 text-right">{descriptiveResults.N[idx]}</td>
                                                            <td className="px-4 py-2 text-right">{descriptiveResults.mean[idx].toFixed(3)}</td>
                                                            <td className="px-4 py-2 text-right">{descriptiveResults.sd[idx].toFixed(3)}</td>
                                                            <td className="px-4 py-2 text-right">{descriptiveResults.min[idx].toFixed(3)}</td>
                                                            <td className="px-4 py-2 text-right">{descriptiveResults.max[idx].toFixed(3)}</td>
                                                            <td className="px-4 py-2 text-right">{descriptiveResults.median[idx].toFixed(3)}</td>
                                                            <td className="px-4 py-2 text-right">{descriptiveResults.skew[idx].toFixed(3)}</td>
                                                            <td className="px-4 py-2 text-right">{descriptiveResults.kurtosis[idx].toFixed(3)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setPhase('phase2')}
                                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2"
                                    >
                                        <span>{t(locale, 'analyze.common.continue')}</span>
                                        <TrendingUp className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {phase === 'phase2' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Ruler className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {t(locale, 'pls_workflow.phases.phase2.title')}
                                        </h2>
                                        <p className="text-gray-600">{t(locale, 'pls_workflow.phases.phase2.desc')}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* EFA */}
                                    <button
                                        onClick={() => setPhase('efa-select')}
                                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all text-left group"
                                        title="Exploratory Factor Analysis - Discovers latent factor structure from observed variables"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <BarChart3 className="w-6 h-6 text-blue-600" />
                                            <h3 className="font-bold text-lg group-hover:text-blue-600">{t(locale, 'methods.efa')}</h3>
                                            <Badge variant="success">{t(locale, 'analyze.common.working')}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{t(locale, 'methods_guide.efa.purpose')}</p>
                                    </button>

                                    {/* CFA */}
                                    <button
                                        disabled
                                        className="p-6 border-2 border-gray-200 rounded-lg opacity-75 cursor-not-allowed text-left bg-gray-50"
                                        title="Confirmatory Factor Analysis - Validate measurement model (Lavaan)"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-6 h-6 text-gray-500" />
                                            <h3 className="font-bold text-lg text-gray-600">CFA</h3>
                                            <Badge variant="warning">Coming Soon</Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">Confirmatory Factor Analysis - {locale === 'vi' ? 'Kiểm định mô hình đo lường' : 'Validate measurement model'}</p>
                                    </button>

                                    {/* HTMT Matrix */}
                                    <button
                                        onClick={() => setPhase('htmt-select')}
                                        className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all text-left group bg-blue-50"
                                        title="Threshold: HTMT &lt; 0.85 (strict) or &lt; 0.90 (liberal) - Gold standard for discriminant validity"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Sparkles className="w-6 h-6 text-blue-600" />
                                            <h3 className="font-bold text-lg group-hover:text-blue-600">{t(locale, 'plssem.methods.htmt')}</h3>
                                            <Badge variant="success">{t(locale, 'analyze.common.working')}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">HTMT &lt; 0.85 - {locale === 'vi' ? 'Tiêu chuẩn vàng cho giá trị phân biệt' : 'Gold standard for discriminant validity'}</p>
                                    </button>

                                    {/* VIF Check */}
                                    <button
                                        onClick={() => setPhase('vif-select')}
                                        className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all text-left group bg-blue-50"
                                        title="Threshold: VIF &lt; 5.0 (acceptable), VIF &lt; 3.0 (ideal) - Detects multicollinearity issues"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Sparkles className="w-6 h-6 text-blue-600" />
                                            <h3 className="font-bold text-lg group-hover:text-blue-600">VIF Check</h3>
                                            <Badge variant="success">Working</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">VIF &lt; 5.0 - Variance Inflation Factor for collinearity</p>
                                    </button>
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={() => setPhase('phase1')}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        <span>{t(locale, 'analyze.common.back')}</span>
                                    </button>
                                    <button
                                        onClick={() => setPhase('phase3')}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2"
                                    >
                                        <span>{t(locale, 'analyze.common.continue')}</span>
                                        <TrendingUp className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {phase === 'phase3' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {t(locale, 'pls_workflow.phases.phase3.title')}
                                        </h2>
                                        <p className="text-gray-600">{t(locale, 'pls_workflow.phases.phase3.desc')}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Linear Regression */}
                                    <button
                                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:shadow-lg transition-all text-left group"
                                        title="Multiple linear regression - Analyzes relationships between variables"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <BarChart3 className="w-6 h-6 text-green-600" />
                                            <h3 className="font-bold text-lg group-hover:text-green-600">{t(locale, 'methods.regression')}</h3>
                                            <Badge variant="success">{t(locale, 'analyze.common.working')}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{t(locale, 'methods_guide.regression.purpose')}</p>
                                    </button>

                                    {/* CB-SEM */}
                                    <button
                                        disabled
                                        className="p-6 border-2 border-gray-200 rounded-lg opacity-75 cursor-not-allowed text-left bg-gray-50"
                                        title="Covariance-based SEM - AMOS style Structural Equation Modeling (Lavaan)"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Network className="w-6 h-6 text-gray-500" />
                                            <h3 className="font-bold text-lg text-gray-600">CB-SEM</h3>
                                            <Badge variant="warning">Coming Soon</Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">Covariance-based Structural Equation Modeling (Amos Style)</p>
                                    </button>

                                    {/* SmartPLS Algorithm */}
                                    <button
                                        onClick={() => setPhase('plssem-select')}
                                        className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:shadow-lg transition-all text-left group bg-green-50"
                                        title="PLS-SEM Algorithm - Variance-based approach for prediction and complex models"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Zap className="w-6 h-6 text-green-600" />
                                            <h3 className="font-bold text-lg group-hover:text-green-600">{t(locale, 'plssem.title')} Algorithm</h3>
                                            <Badge variant="success">{t(locale, 'analyze.common.working')}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{t(locale, 'plssem.description')}</p>
                                    </button>

                                    {/* Bootstrapping */}
                                    <button
                                        onClick={() => setPhase('bootstrap-select')}
                                        className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:shadow-lg transition-all text-left group bg-green-50"
                                        title="Bootstrap resampling (5000 iterations) - Tests significance of path coefficients"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <RefreshCw className="w-6 h-6 text-green-600" />
                                            <h3 className="font-bold text-lg group-hover:text-green-600">{t(locale, 'plssem.methods.bootstrap')}</h3>
                                            <Badge variant="success">{t(locale, 'analyze.common.working')}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{locale === 'vi' ? 'Kiểm định ý nghĩa các hệ số tác động (p-value)' : 'Tests significance of path coefficients (p-values)'}</p>
                                    </button>

                                    {/* Mediation & Moderation */}
                                    <button
                                        className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:shadow-lg transition-all text-left group bg-green-50 md:col-span-2"
                                        title="Mediation (Baron & Kenny + Sobel test) and Moderation (Interaction effects) analysis"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Sparkles className="w-6 h-6 text-green-600" />
                                            <h3 className="font-bold text-lg group-hover:text-green-600">Mediation & Moderation</h3>
                                            <Badge variant="success">Working</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Mediation (indirect effects) & Moderation (interaction) analysis</p>
                                    </button>
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={() => setPhase('phase2')}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        <span>{t(locale, 'analyze.common.back')}</span>
                                    </button>
                                    <button
                                        onClick={() => setPhase('phase4')}
                                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2"
                                    >
                                        <span>{t(locale, 'analyze.common.continue')}</span>
                                        <TrendingUp className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {phase === 'phase4' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <Target className="w-8 h-8 text-amber-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {t(locale, 'pls_workflow.phases.phase4.title')}
                                        </h2>
                                        <p className="text-gray-600">{t(locale, 'pls_workflow.phases.phase4.desc')}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* T-test */}
                                    <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <BarChart3 className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">T-test</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">{locale === 'vi' ? 'So sánh 2 nhóm' : 'Compare 2 groups'}</p>
                                    </button>

                                    {/* ANOVA */}
                                    <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">ANOVA</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">{locale === 'vi' ? 'So sánh nhiều nhóm' : 'Compare multiple groups'}</p>
                                    </button>

                                    {/* Chi-square */}
                                    <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <BarChart3 className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">Chi-square</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">{locale === 'vi' ? 'Kiểm định độc lập' : 'Independence test'}</p>
                                    </button>

                                    {/* Cluster Analysis */}
                                    <button
                                        onClick={() => setPhase('cluster-select')}
                                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group"
                                        title="K-Means clustering - Segments data into distinct groups based on similarity"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <BarChart3 className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">Cluster Analysis</h3>
                                            <Badge variant="success">Working</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">K-Means clustering - Segment data into groups</p>
                                    </button>


                                    {/* IPMA */}
                                    <button
                                        onClick={() => setPhase('ipma-select')}
                                        className="p-6 border-2 border-amber-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group bg-amber-50"
                                        title="Importance-Performance Map Analysis - Prioritizes improvement areas by importance vs performance"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <TrendingUp className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">IPMA Analysis</h3>
                                            <Badge variant="success">{t(locale, 'analyze.common.working')}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{locale === 'vi' ? 'Phân tích ma trận Tầm quan trọng - Hiệu suất' : 'Importance-Performance Map Analysis'}</p>
                                    </button>

                                    {/* MGA */}
                                    <button
                                        onClick={() => setPhase('mga-select')}
                                        className="p-6 border-2 border-amber-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group bg-amber-50"
                                        title="Multi-Group Analysis - Compares path coefficients across different groups (e.g., gender, age)"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Users className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">{locale === 'vi' ? 'Phân tích đa nhóm (MGA)' : 'Multi-Group Analysis (MGA)'}</h3>
                                            <Badge variant="success">{t(locale, 'analyze.common.working')}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{locale === 'vi' ? 'So sánh sự khác biệt giữa các nhóm (Giới tính, Khu vực...)' : 'Compare differences between groups'}</p>
                                    </button>

                                    {/* Blindfolding */}
                                    <button
                                        onClick={() => setPhase('blindfolding-select')}
                                        className="p-6 border-2 border-amber-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group bg-amber-50"
                                        title="Blindfolding procedure - Calculates Q² (Stone-Geisser) for predictive relevance (Q² &gt; 0 indicates relevance)"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Eye className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">Blindfolding (Q²)</h3>
                                            <Badge variant="success">Working</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Q² (Stone-Geisser) - Predictive relevance (Q² &gt; 0)</p>
                                    </button>
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={() => setPhase('phase3')}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        <span>{t(locale, 'analyze.common.back')}</span>
                                    </button>
                                    <button
                                        onClick={() => showToast(locale === 'vi' ? 'Tính năng xuất kết quả đang được phát triển!' : 'Export feature is under development!', 'info')}
                                        className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                                    >
                                        {locale === 'vi' ? 'Hoàn thành & Xuất báo cáo' : 'Complete & Export Report'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Method Select Steps - Following /analyze pattern */}

                    {/* Omega Select Step */}
                    {
                        phase === 'omega-select' && (
                            <PLSSEMView
                                method="omega"
                                data={data}
                                columns={getNumericColumns()}
                                user={user}
                                setResults={(results) => {
                                    setResults({ type: 'omega', data: results });
                                    setPhase('results');
                                }}
                                setNcsBalance={setNcsBalance}
                                showToast={showToast}
                                onBack={() => setPhase('phase1')}
                                setRequiredCredits={setRequiredCredits}
                                setCurrentAnalysisCost={setCurrentAnalysisCost}
                                setShowInsufficientCredits={setShowInsufficientCredits}
                            />
                        )
                    }

                    {/* Outlier Select Step */}
                    {
                        phase === 'outlier-select' && (
                            <PLSSEMView
                                method="outlier"
                                data={data}
                                columns={getNumericColumns()}
                                user={user}
                                setResults={(results) => {
                                    setResults({ type: 'outlier', data: results });
                                    setPhase('results');
                                }}
                                setNcsBalance={setNcsBalance}
                                showToast={showToast}
                                onBack={() => setPhase('phase1')}
                                setRequiredCredits={setRequiredCredits}
                                setCurrentAnalysisCost={setCurrentAnalysisCost}
                                setShowInsufficientCredits={setShowInsufficientCredits}
                            />
                        )
                    }

                    {/* HTMT Select Step */}
                    {
                        phase === 'htmt-select' && (
                            <PLSSEMView
                                method="htmt"
                                data={data}
                                columns={getNumericColumns()}
                                user={user}
                                setResults={(results) => {
                                    setResults({ type: 'htmt', data: results });
                                    setPhase('results');
                                }}
                                setNcsBalance={setNcsBalance}
                                showToast={showToast}
                                onBack={() => setPhase('phase2')}
                                setRequiredCredits={setRequiredCredits}
                                setCurrentAnalysisCost={setCurrentAnalysisCost}
                                setShowInsufficientCredits={setShowInsufficientCredits}
                            />
                        )
                    }


                    {/* Cronbach Select Step - Reused from /analyze */}
                    {phase === 'cronbach-select' && (
                        <ReliabilityView
                            step="cronbach-select"
                            data={data}
                            columns={getNumericColumns()}
                            user={user}
                            setResults={(results) => {
                                setResults({ type: 'cronbach', data: results });
                                setPhase('results');
                            }}
                            setStep={(step) => {
                                // Convert AnalysisStep to AnalysisPhase
                                if (step === 'analyze') setPhase('phase1');
                                else setPhase(step as AnalysisPhase);
                            }}
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

                    {/* EFA Select Step - Reused from /analyze */}
                    {phase === 'efa-select' && (
                        <MultivariateView
                            step="efa-select"
                            data={data}
                            columns={getNumericColumns()}
                            profile={profile}
                            user={user}
                            setResults={(results) => {
                                setResults({ type: 'efa', data: results });
                                setPhase('results');
                            }}
                            setStep={(step) => {
                                if (step === 'analyze') setPhase('phase1');
                                else setPhase(step as AnalysisPhase);
                            }}
                            setNcsBalance={setNcsBalance}
                            showToast={showToast}
                            setRequiredCredits={setRequiredCredits}
                            setCurrentAnalysisCost={setCurrentAnalysisCost}
                            setShowInsufficientCredits={setShowInsufficientCredits}
                            locale={locale}
                        />
                    )}

                    {/* CFA Select Step */}
                    {phase === 'cfa-select' && (
                        <AdvancedMethodView
                            method="cfa"
                            data={data.map(row => getNumericColumns().map(col => row[col]))}
                            columnNames={getNumericColumns()}
                            onBack={() => setPhase('phase2')}
                            setResults={(results) => {
                                setResults({ type: 'cfa', data: results });
                                setPhase('results');
                            }}
                        />
                    )}

                    {/* Cluster Analysis Select Step - Reused from /analyze */}
                    {phase === 'cluster-select' && (
                        <MultivariateView
                            step="cluster-select"
                            data={data}
                            columns={getNumericColumns()}
                            allColumns={getAllColumns()}
                            profile={profile}
                            user={user}
                            setResults={(results) => {
                                setResults({ type: 'cluster', data: results });
                                setPhase('results');
                            }}
                            setStep={(step) => {
                                if (step === 'analyze') setPhase('phase1');
                                else setPhase(step as AnalysisPhase);
                            }}
                            setNcsBalance={setNcsBalance}
                            showToast={showToast}
                            setAnalysisType={setAnalysisType}
                            setRequiredCredits={setRequiredCredits}
                            setCurrentAnalysisCost={setCurrentAnalysisCost}
                            setShowInsufficientCredits={setShowInsufficientCredits}
                            locale={locale}
                        />
                    )}


                    {/* Regression Select Step - Reused from /analyze */}
                    {phase === 'regression-select' && (
                        <RegressionView
                            step="regression-select"
                            data={data}
                            columns={getNumericColumns()}
                            user={user}
                            setResults={(results) => {
                                setResults({ type: 'regression', data: results });
                                setPhase('results');
                            }}
                            setStep={(step) => {
                                if (step === 'analyze') setPhase('phase1');
                                else setPhase(step as AnalysisPhase);
                            }}
                            setNcsBalance={setNcsBalance}
                            showToast={showToast}
                            setRequiredCredits={setRequiredCredits}
                            setCurrentAnalysisCost={setCurrentAnalysisCost}
                            setShowInsufficientCredits={setShowInsufficientCredits}
                            locale={locale}
                        />
                    )}

                    {/* Mediation Select Step - Reused from /analyze */}
                    {phase === 'mediation-select' && (
                        <MediationView
                            step="mediation-select"
                            data={data}
                            columns={getNumericColumns()}
                            user={user}
                            setResults={(results) => {
                                setResults({ type: 'mediation', data: results });
                                setPhase('results');
                            }}
                            setStep={(step) => {
                                if (step === 'analyze') setPhase('phase1');
                                else setPhase(step as AnalysisPhase);
                            }}
                            setNcsBalance={setNcsBalance}
                            showToast={showToast}
                            setRequiredCredits={setRequiredCredits}
                            setCurrentAnalysisCost={setCurrentAnalysisCost}
                            setShowInsufficientCredits={setShowInsufficientCredits}
                            locale={locale}
                        />
                    )}

                    {/* IPMA Select Step */}
                    {phase === 'ipma-select' && (
                        <AdvancedMethodView
                            method="ipma"
                            data={data.map(row => getNumericColumns().map(col => row[col]))}
                            columnNames={getNumericColumns()}
                            onBack={() => setPhase('phase4')}
                            setResults={(results) => {
                                setResults({ type: 'ipma', data: results });
                                setPhase('results');
                            }}
                        />
                    )}

                    {/* MGA Select Step */}
                    {phase === 'mga-select' && (
                        <AdvancedMethodView
                            method="mga"
                            data={data.map(row => getNumericColumns().map(col => row[col]))}
                            columnNames={getNumericColumns()}
                            onBack={() => setPhase('phase4')}
                            setResults={(results) => {
                                setResults({ type: 'mga', data: results });
                                setPhase('results');
                            }}
                        />
                    )}

                    {/* Blindfolding Select Step */}
                    {phase === 'blindfolding-select' && (
                        <AdvancedMethodView
                            method="blindfolding"
                            data={data.map(row => getNumericColumns().map(col => row[col]))}
                            columnNames={getNumericColumns()}
                            onBack={() => setPhase('phase4')}
                            setResults={(results) => {
                                setResults({ type: 'blindfolding', data: results });
                                setPhase('results');
                            }}
                        />
                    )}

                    {/* VIF Select Step */}
                    {
                        phase === 'vif-select' && (
                            <PLSSEMView
                                method="vif"
                                data={data}
                                columns={getNumericColumns()}
                                user={user}
                                setResults={(results) => {
                                    setResults({ type: 'vif', data: results });
                                    setPhase('results');
                                }}
                                setNcsBalance={setNcsBalance}
                                showToast={showToast}
                                onBack={() => setPhase('phase2')}
                                setRequiredCredits={setRequiredCredits}
                                setCurrentAnalysisCost={setCurrentAnalysisCost}
                                setShowInsufficientCredits={setShowInsufficientCredits}
                            />
                        )
                    }

                    {/* PLS-SEM Algorithm Select Step */}
                    {phase === 'plssem-select' && (
                        <PLSSEMView
                            method="bootstrap"
                            data={data}
                            columns={getNumericColumns()}
                            user={user}
                            setResults={(results) => {
                                setResults({ type: 'plssem', data: results });
                                setPhase('results');
                            }}
                            setNcsBalance={setNcsBalance}
                            showToast={showToast}
                            onBack={() => setPhase('phase3')}
                            setRequiredCredits={setRequiredCredits}
                            setCurrentAnalysisCost={setCurrentAnalysisCost}
                            setShowInsufficientCredits={setShowInsufficientCredits}
                        />
                    )}

                    {/* Bootstrapping Select Step */}
                    {phase === 'bootstrap-select' && (
                        <PLSSEMView
                            method="bootstrap"
                            data={data}
                            columns={getNumericColumns()}
                            user={user}
                            setResults={(results) => {
                                setResults({ type: 'bootstrap', data: results });
                                setPhase('results');
                            }}
                            setNcsBalance={setNcsBalance}
                            showToast={showToast}
                            onBack={() => setPhase('phase3')}
                            setRequiredCredits={setRequiredCredits}
                            setCurrentAnalysisCost={setCurrentAnalysisCost}
                            setShowInsufficientCredits={setShowInsufficientCredits}
                        />
                    )}

                    {/* CB-SEM Select Step */}
                    {phase === 'cbsem-select' && (
                        <AdvancedMethodView
                            method="cbsem"
                            data={data.map(row => getNumericColumns().map(col => row[col]))}
                            columnNames={getNumericColumns()}
                            onBack={() => setPhase('phase3')}
                            setResults={(results) => {
                                setResults({ type: 'cbsem', data: results });
                                setPhase('results');
                            }}
                        />
                    )}

                    {/* Results Step - Display analysis results */}
                    {
                        phase === 'results' && results && (
                            <div className="max-w-6xl mx-auto space-y-6">
                                {/* Omega Results */}
                                {results.type === 'omega' && (
                                    <OmegaResults
                                        results={results.data}
                                        columns={results.columns}
                                        scaleName={results.scaleName}
                                    />
                                )}

                                {/* Outlier Results */}
                                {results.type === 'outlier' && (
                                    <OutlierResults
                                        results={results.data}
                                        columns={results.columns}
                                    />
                                )}

                                {/* HTMT Results */}
                                {results.type === 'htmt' && (
                                    <HTMTResults
                                        results={results.data}
                                        factorStructure={results.factorStructure}
                                    />
                                )}


                                {/* Cronbach Results - Reused */}
                                {results.type === 'cronbach' && (
                                    <CronbachResults
                                        results={results.data}
                                        columns={results.columns}
                                        scaleName={scaleName}
                                    />
                                )}

                                {/* EFA Results - Reused */}
                                {results.type === 'efa' && (
                                    <EFAResults
                                        results={results.data}
                                        columns={results.columns}
                                    />
                                )}

                                {/* CFA Results - Reused */}
                                {results.type === 'cfa' && (
                                    <CFAResults
                                        results={results.data}
                                    />
                                )}

                                {/* Regression Results - Reused */}
                                {results.type === 'regression' && (
                                    <RegressionResults
                                        results={results.data}
                                        columns={getNumericColumns()}
                                    />
                                )}

                                {/* Mediation Results - Reused */}
                                {results.type === 'mediation' && (
                                    <MediationResults
                                        results={results.data}
                                        columns={getNumericColumns()}
                                    />
                                )}

                                {/* Cluster Analysis Results - Reused */}
                                {results.type === 'cluster' && (
                                    <ClusterResults
                                        results={results.data}
                                        columns={getNumericColumns()}
                                    />
                                )}


                                {/* VIF Results */}
                                {results.type === 'vif' && (
                                    <VIFResults
                                        results={results.data}
                                        columns={results.columns}
                                    />
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex gap-4 justify-between">
                                    <button
                                        onClick={() => {
                                            // Determine which phase to go back to
                                            if (results.type === 'omega' || results.type === 'outlier' || results.type === 'cronbach') {
                                                setPhase('phase1');
                                            } else if (results.type === 'htmt' || results.type === 'vif' || results.type === 'efa' || results.type === 'cfa') {
                                                setPhase('phase2');
                                            } else if (results.type === 'regression' || results.type === 'mediation' || results.type === 'plssem' || results.type === 'bootstrap' || results.type === 'cbsem') {
                                                setPhase('phase3');
                                            } else if (results.type === 'ipma' || results.type === 'mga' || results.type === 'blindfolding' || results.type === 'cluster') {
                                                setPhase('phase4');
                                            } else {
                                                setPhase('phase1');
                                            }
                                            setResults(null);
                                        }}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        <span>{t(locale, 'analyze.results.back')}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setResults(null);
                                            setPhase('phase1');
                                        }}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        {t(locale, 'analyze.results.newAnalysis')}
                                    </button>
                                </div>
                            </div>
                        )
                    }

                </div>
            </div>

            {/* Save Project Modal */}
            {isSaveModalOpen && (
                <SaveProjectModal
                    isOpen={isSaveModalOpen}
                    onClose={() => setIsSaveModalOpen(false)}
                    data={data}
                    analysisType="pls-sem-workflow"
                    step={phase}
                    results={null}
                    locale={locale}
                />
            )}

            <Footer locale={locale} />
        </div>
    );
}

