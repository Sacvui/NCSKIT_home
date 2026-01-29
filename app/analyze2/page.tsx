'use client';

// Prevent prerendering - this page requires client-side Supabase
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { DataProfiler } from '@/components/DataProfiler';
import { profileData, DataProfile } from '@/lib/data-profiler';
import { BarChart3, FileText, Shield, Trash2, Eye, EyeOff, Wifi, WifiOff, RotateCcw, XCircle, Sparkles, TrendingUp, Target, Users, Upload, Search, Eraser, Ruler, Building2, Zap, CheckCircle2 } from 'lucide-react';
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
import { OmegaResults } from '@/components/results/plssem/OmegaResults';
import { OutlierResults } from '@/components/results/plssem/OutlierResults';
import { HTMTResults } from '@/components/results/plssem/HTMTResults';
import { VIFResults } from '@/components/results/plssem/VIFResults';
import { BootstrapResults, IPMAResults, MGAResults, BlindfoldingResults } from '@/components/results/plssem';
import { CronbachResults } from '@/components/results/reliability/CronbachResults';
import { EFAResults } from '@/components/results/factor/EFAResults';
import { CFAResults } from '@/components/results/factor/CFAResults';
import { RegressionResults } from '@/components/results/regression/RegressionResults';
import { MediationResults } from '@/components/results/mediation/MediationResults';
import { ClusterResults } from '@/components/results/cluster/ClusterResults';


// Import new PLS-SEM analysis functions
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

type AnalysisPhase =
    | 'upload' | 'profile'
    | 'phase1' | 'phase2' | 'phase3' | 'phase4'
    | 'omega-select' | 'outlier-select' | 'cronbach-select' | 'efa-select' | 'cfa-select' | 'regression-select' | 'mediation-select' | 'cluster-select'
    | 'htmt-select' | 'vif-select'
    | 'bootstrap-select' | 'mediation-select'
    | 'ipma-select' | 'mga-select' | 'blindfolding-select' | 'plssem-select'
    | 'results';

export default function Analyze2Page() {
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
                    setToast({ message: 'R Engine đã sẵn sàng với PLS-SEM!', type: 'success' });
                })
                .catch(err => {
                    console.error('[WebR] Auto-initialization failed:', err);
                    setToast({ message: 'Lỗi khởi tạo R Engine. Vui lòng tải lại trang.', type: 'error' });
                });
        }
    }, []);

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleDataLoaded = (loadedData: any[], fname: string) => {
        if (loadedData.length > 50000) {
            showToast('File quá lớn (>50,000 rows). Vui lòng giảm kích thước file.', 'error');
            return;
        }

        let processedData = loadedData;
        if (loadedData.length > 10000) {
            showToast(`Dữ liệu lớn (${loadedData.length} rows). Đang lấy mẫu ngẫu nhiên 10,000 rows...`, 'info');
            const shuffled = [...loadedData].sort(() => 0.5 - Math.random());
            processedData = shuffled.slice(0, 10000);
            showToast('Đã lấy mẫu 10,000 rows. Kết quả đại diện cho toàn bộ dữ liệu.', 'success');
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


    // Phase navigation
    const phases = [
        { id: 'upload', label: 'Upload', icon: Upload, tooltip: 'Tải dữ liệu lên hệ thống' },
        { id: 'profile', label: 'Check', icon: Search, tooltip: 'Kiểm tra chất lượng dữ liệu' },
        { id: 'phase1', label: 'Prepare', icon: Eraser, tooltip: 'Làm sạch dữ liệu & Đánh giá độ tin cậy' },
        { id: 'phase2', label: 'Measure', icon: Ruler, tooltip: 'Kiểm định thang đo (HTMT, VIF, EFA, CFA)' },
        { id: 'phase3', label: 'Structure', icon: Building2, tooltip: 'Mô hình cấu trúc (Regression, Mediation, Bootstrap)' },
        { id: 'phase4', label: 'Advanced', icon: Zap, tooltip: 'Phân tích nâng cao (IPMA, MGA, Blindfolding)' },
        { id: 'results', label: 'Results', icon: CheckCircle2, tooltip: 'Xem kết quả & Xuất báo cáo' },
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
                    <p className="text-slate-600 font-medium">Đang xác thực...</p>
                    {webRStatus.isReady && (
                        <p className="text-green-600 text-sm">✓ R Engine đã sẵn sàng</p>
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
                    <span className="font-semibold">Không có kết nối Internet. Một số tính năng có thể không hoạt động.</span>
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

            {/* Header with Integrated Toolbar */}
            <Header
                user={user}
                profile={userProfile}
                hideNav={true}
                centerContent={
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            PLS-SEM Workflow
                        </span>
                        <AnalysisToolbar
                            isPrivateMode={isPrivateMode}
                            setIsPrivateMode={setIsPrivateMode}
                            clearSession={() => {
                                clearSession();
                                showToast('Đã xóa dữ liệu phiên làm việc', 'info');
                            }}
                            filename={filename}
                            onSave={() => setIsSaveModalOpen(true)}
                        />
                    </div>
                }
            />

            <div className="bg-purple-50/50 border-b border-purple-100 py-1">
                <div className="container mx-auto px-6 flex items-center justify-center gap-2 text-[11px] text-purple-600/80">
                    <Shield className="w-3 h-3" />
                    <span className="font-semibold">Bảo mật:</span>
                    <span>Dữ liệu xử lý cục bộ 100% (Client-side), an toàn tuyệt đối.</span>
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
                                    Tải lên dữ liệu của bạn
                                </h2>
                                <p className="text-gray-600">
                                    Hỗ trợ file CSV và Excel (.xlsx, .xls)
                                </p>
                            </div>
                            <FileUpload onDataLoaded={handleDataLoaded} />
                        </div>
                    )}

                    {phase === 'profile' && profile && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    Báo cáo chất lượng dữ liệu
                                </h2>
                                <p className="text-gray-600">
                                    Kiểm tra và xác nhận dữ liệu trước khi phân tích
                                </p>
                            </div>
                            <DataProfiler profile={profile} onProceed={handleProceedToPhase1} />
                        </div>
                    )}

                    {phase === 'phase1' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-4xl">🧹</span>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Nhóm 1: Sơ chế & Độ tin cậy (The Foundation)
                                        </h2>
                                        <p className="text-gray-600">Làm sạch dữ liệu và kiểm tra độ tin cậy thang đo</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Descriptive Statistics */}
                                    <button
                                        onClick={() => showToast('Descriptive Statistics đang được phát triển', 'info')}
                                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-lg transition-all text-left group"
                                        title="Mean, SD, Min, Max, Median - Thống kê mô tả cơ bản cho dữ liệu"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <BarChart3 className="w-6 h-6 text-purple-600" />
                                            <h3 className="font-bold text-lg group-hover:text-purple-600">Descriptive Statistics</h3>
                                            <Badge variant="default">Coming Soon</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Mean, SD, Min, Max, Median, Skewness, Kurtosis</p>
                                    </button>

                                    {/* McDonald's Omega */}
                                    <button
                                        onClick={() => setPhase('omega-select')}
                                        className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-lg transition-all text-left group bg-purple-50"
                                        title="Threshold: ω &gt; 0.70 (acceptable), ω &gt; 0.80 (good) - Độ tin cậy hiện đại, chính xác hơn Cronbach's Alpha"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Sparkles className="w-6 h-6 text-purple-600" />
                                            <h3 className="font-bold text-lg group-hover:text-purple-600">McDonald's Omega (ω)</h3>
                                            <Badge variant="success">Working</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Modern reliability measure (ω &gt; 0.70) - More accurate than Cronbach's α</p>
                                    </button>

                                    {/* Cronbach's Alpha */}
                                    <button
                                        onClick={() => showToast('Cronbach\'s Alpha đang được phát triển', 'info')}
                                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-lg transition-all text-left group"
                                        title="Threshold: α &gt; 0.70 (acceptable), α &gt; 0.80 (good) - Classic reliability measure"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-6 h-6 text-blue-600" />
                                            <h3 className="font-bold text-lg group-hover:text-purple-600">Cronbach's Alpha (α)</h3>
                                            <Badge variant="default">Coming Soon</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Classic reliability (α &gt; 0.70) - Internal consistency measure</p>
                                    </button>

                                    {/* Outlier Detection */}
                                    <button
                                        onClick={() => setPhase('outlier-select')}
                                        className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-lg transition-all text-left group bg-purple-50"
                                        title="Mahalanobis Distance method - Detects multivariate outliers that may distort results"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <XCircle className="w-6 h-6 text-red-600" />
                                            <h3 className="font-bold text-lg group-hover:text-purple-600">Outlier Detection</h3>
                                            <Badge variant="success">Working</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Mahalanobis Distance - Detect & remove multivariate outliers</p>
                                    </button>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setPhase('phase2')}
                                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                                    >
                                        Tiếp tục → Kiểm định thang đo
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {phase === 'phase2' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-4xl">📏</span>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Nhóm 2: Kiểm định thang đo (Measurement Validation)
                                        </h2>
                                        <p className="text-gray-600">Cực kỳ quan trọng cho PLS-SEM</p>
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
                                            <h3 className="font-bold text-lg group-hover:text-blue-600">EFA</h3>
                                            <Badge variant="success">Working</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Exploratory Factor Analysis - Discover factor structure</p>
                                    </button>

                                    {/* CFA */}
                                    <button
                                        onClick={() => setPhase('cfa-select')}
                                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all text-left group"
                                        title="Confirmatory Factor Analysis - Validates pre-specified measurement model"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-6 h-6 text-blue-600" />
                                            <h3 className="font-bold text-lg group-hover:text-blue-600">CFA</h3>
                                            <Badge variant="success">Working</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Confirmatory Factor Analysis - Validate measurement model</p>
                                    </button>

                                    {/* HTMT Matrix */}
                                    <button
                                        onClick={() => setPhase('htmt-select')}
                                        className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all text-left group bg-blue-50"
                                        title="Threshold: HTMT &lt; 0.85 (strict) or &lt; 0.90 (liberal) - Gold standard for discriminant validity"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Sparkles className="w-6 h-6 text-blue-600" />
                                            <h3 className="font-bold text-lg group-hover:text-blue-600">HTMT Matrix</h3>
                                            <Badge variant="success">Working</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">HTMT &lt; 0.85 - Gold standard for discriminant validity</p>
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
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                                    >
                                        ← Quay lại
                                    </button>
                                    <button
                                        onClick={() => setPhase('phase3')}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                                    >
                                        Tiếp tục → Mô hình cấu trúc
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {phase === 'phase3' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-4xl">🏗️</span>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Nhóm 3: Mô hình cấu trúc (Structural Model - Tâm điểm)
                                        </h2>
                                        <p className="text-gray-600">PLS-SEM và các phân tích nâng cao</p>
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
                                            <h3 className="font-bold text-lg group-hover:text-green-600">Linear Regression</h3>
                                            <Badge variant="success">Working</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Multiple regression with path coefficients (β)</p>
                                    </button>

                                    {/* SEM */}
                                    <button
                                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:shadow-lg transition-all text-left group"
                                        title="Covariance-based SEM - Traditional approach for theory testing"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-6 h-6 text-green-600" />
                                            <h3 className="font-bold text-lg group-hover:text-green-600">CB-SEM</h3>
                                            <Badge variant="default">Coming Soon</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Covariance-based Structural Equation Modeling</p>
                                    </button>

                                    {/* SmartPLS Algorithm */}
                                    <button
                                        className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:shadow-lg transition-all text-left group bg-green-50"
                                        title="PLS-SEM Algorithm - Variance-based approach for prediction and complex models"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Sparkles className="w-6 h-6 text-green-600" />
                                            <h3 className="font-bold text-lg group-hover:text-green-600">PLS-SEM Algorithm</h3>
                                            <Badge variant="default">Coming Soon</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Partial Least Squares - Variance-based SEM</p>
                                    </button>

                                    {/* Bootstrapping */}
                                    <button
                                        className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:shadow-lg transition-all text-left group bg-green-50"
                                        title="Bootstrap resampling (5000 iterations) - Tests significance of path coefficients"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Sparkles className="w-6 h-6 text-green-600" />
                                            <h3 className="font-bold text-lg group-hover:text-green-600">Bootstrapping</h3>
                                            <Badge variant="default">Coming Soon</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Bootstrap resampling for significance testing (p-values)</p>
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
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                                    >
                                        ← Quay lại
                                    </button>
                                    <button
                                        onClick={() => setPhase('phase4')}
                                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                                    >
                                        Tiếp tục → Phân tích nâng cao
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {phase === 'phase4' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-4xl">🎯</span>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Nhóm 4: Phân tích thực nghiệm & So sánh
                                        </h2>
                                        <p className="text-gray-600">Experimental & Groups Analysis</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* T-test */}
                                    <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <BarChart3 className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">T-test</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">So sánh 2 nhóm</p>
                                    </button>

                                    {/* ANOVA */}
                                    <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">ANOVA</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">So sánh nhiều nhóm</p>
                                    </button>

                                    {/* Chi-square */}
                                    <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <BarChart3 className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">Chi-square</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">Kiểm định độc lập</p>
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
                                        className="p-6 border-2 border-amber-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group bg-amber-50"
                                        title="Importance-Performance Map Analysis - Prioritizes improvement areas by importance vs performance"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Sparkles className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">IPMA Matrix</h3>
                                            <Badge variant="default">Coming Soon</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Importance-Performance Map - Prioritize improvements</p>
                                    </button>

                                    {/* MGA */}
                                    <button
                                        className="p-6 border-2 border-amber-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group bg-amber-50"
                                        title="Multi-Group Analysis - Compares path coefficients across different groups (e.g., gender, age)"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Sparkles className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">MGA</h3>
                                            <Badge variant="default">Coming Soon</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Multi-Group Analysis - Compare groups (gender, age, etc.)</p>
                                    </button>

                                    {/* Blindfolding */}
                                    <button
                                        className="p-6 border-2 border-amber-200 rounded-lg hover:border-amber-400 hover:shadow-lg transition-all text-left group bg-amber-50"
                                        title="Blindfolding procedure - Calculates Q² (Stone-Geisser) for predictive relevance (Q² &gt; 0 indicates relevance)"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Sparkles className="w-6 h-6 text-amber-600" />
                                            <h3 className="font-bold text-lg group-hover:text-amber-600">Blindfolding (Q²)</h3>
                                            <Badge variant="default">Coming Soon</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Q² (Stone-Geisser) - Predictive relevance (Q² &gt; 0)</p>
                                    </button>
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={() => setPhase('phase3')}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                                    >
                                        ← Quay lại
                                    </button>
                                    <button
                                        onClick={() => showToast('Tính năng xuất kết quả đang được phát triển!', 'info')}
                                        className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                                    >
                                        Hoàn thành & Xuất báo cáo
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
                        />
                    )}

                    {/* CFA Select Step - Reused from /analyze */}
                    {phase === 'cfa-select' && (
                        <MultivariateView
                            step="cfa-select"
                            data={data}
                            columns={getNumericColumns()}
                            profile={profile}
                            user={user}
                            setResults={(results) => {
                                setResults({ type: 'cfa', data: results });
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
                                            if (results.type === 'omega' || results.type === 'outlier') {
                                                setPhase('phase1');
                                            } else if (results.type === 'htmt' || results.type === 'vif') {
                                                setPhase('phase2');
                                            } else {
                                                setPhase('phase1');
                                            }
                                            setResults(null);
                                        }}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                                    >
                                        ← Quay lại chọn phân tích khác
                                    </button>
                                    <button
                                        onClick={() => {
                                            setResults(null);
                                            setPhase('phase1');
                                        }}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        Chạy phân tích mới
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
                />
            )}

            <Footer />
        </div>
    );
}
