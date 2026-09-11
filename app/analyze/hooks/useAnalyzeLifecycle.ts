'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getStoredLocale, t } from '@/lib/i18n';
import { initWebR, getWebRStatus, setProgressCallback } from '@/lib/webr-wrapper';
import { FeedbackService } from '@/lib/feedback-service';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useAnalysisPersistence } from '@/hooks/useAnalysisPersistence';
import { profileData } from '@/lib/data-profiler';

export function useAnalyzeLifecycle({
    data,
    step,
    setStep,
    profile,
    setProfile,
    filename,
    results,
    analysisType,
    isPrivateMode,
    setNcsBalance,
    setToast,
    setShowDemographics,
    isDemo = false
}: any) {
    const router = useRouter();
    const { user, profile: userProfile, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [locale, setLocale] = useState('vi');
    const [authTimeout, setAuthTimeout] = useState(false);
    const [showRestoreBanner, setShowRestoreBanner] = useState(false);
    const { saveWorkspace, loadWorkspace, hasSavedData, clearWorkspace } = useAnalysisPersistence();

    // 1. Cache Buster
    useEffect(() => {
        const CURRENT_DEPLOY_VERSION = "20260425_1557"; 
        const savedVersion = localStorage.getItem('ncs_deploy_version');
        
        if (savedVersion && savedVersion !== CURRENT_DEPLOY_VERSION) {
            console.log('[CacheBuster] New version detected, clearing site data and reloading...');
            localStorage.setItem('ncs_deploy_version', CURRENT_DEPLOY_VERSION);
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    for (let registration of registrations) registration.unregister();
                });
            }
            window.location.reload();
        } else {
            localStorage.setItem('ncs_deploy_version', CURRENT_DEPLOY_VERSION);
        }
    }, []);

    // 2. Sync locale & balance
    useEffect(() => setLocale(getStoredLocale()), []);
    useEffect(() => {
        if (userProfile?.tokens !== undefined) {
            setNcsBalance(userProfile.tokens);
        }
    }, [userProfile?.tokens, setNcsBalance]);

    // 3. Auth Guard
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' || isDemo) {
            setLoading(false);
            return;
        }

        const hasCode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('code');
        if (hasCode) return;

        if (!authLoading) {
            const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
            if (user || !isSupabaseConfigured) {
                setLoading(false);
            } else {
                router.push('/login?next=/analyze');
            }
        }
    }, [authLoading, user, router, isDemo]);

    // 4. Safety Timeout for Auth hangs
    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => setAuthTimeout(true), 8000);
            return () => clearTimeout(timer);
        } else {
            setAuthTimeout(false);
        }
    }, [loading]);

    // 5. Data & Profile Availability Check
    useEffect(() => {
        if (loading) return;
        if (data.length === 0 && step !== 'upload') {
            setStep('upload');
            return;
        }
        if (step === 'profile' && !profile && data.length > 0) {
            const prof = profileData(data);
            if (prof) setProfile(prof);
            else setStep('upload');
        }
    }, [step, data.length, profile, loading, setStep, setProfile]);

    useEffect(() => {
        setShowRestoreBanner(hasSavedData && data.length === 0);
    }, [hasSavedData, data.length]);

    // 6. Auto-Save
    const getNumericColumns = () => {
        if (!profile) return [];
        return Object.entries(profile.columnStats)
            .filter(([_, stats]: any) => stats.type === 'numeric')
            .map(([name, _]) => name);
    };

    useAutoSave(
        () => {
            if (data.length === 0) return;
            saveWorkspace({
                data,
                columns: getNumericColumns(),
                fileName: filename,
                currentStep: step,
                results,
                analysisType,
            });
        },
        [data, step, results, analysisType, filename],
        { delay: 60000, enabled: data.length > 0 && !isPrivateMode }
    );

    // 7. Save before page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (data.length > 0) {
                saveWorkspace({
                    data,
                    columns: getNumericColumns(),
                    fileName: filename,
                    currentStep: step,
                    results,
                    analysisType,
                });
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [data, step, results, analysisType, filename, saveWorkspace]);

    // 8. Online/Offline events
    useEffect(() => {
        const handleOnline = () => setToast(t(locale as any, 'analyze.common.internet_restored'), 'success');
        const handleOffline = () => setToast(t(locale as any, 'analyze.common.internet_lost'), 'error');
        window.addEventListener('app:online', handleOnline);
        window.addEventListener('app:offline', handleOffline);
        return () => {
            window.removeEventListener('app:online', handleOnline);
            window.removeEventListener('app:offline', handleOffline);
        };
    }, [locale, setToast]);

    // 9. WebR Eager Loading
    useEffect(() => {
        const status = getWebRStatus();
        if (!status.isReady && !status.isLoading) {
            setProgressCallback((msg) => {
                setToast(msg.includes('Cleaning') ? t(locale as any, 'analyze.common.processing') : msg, 'info');
            });
            initWebR()
                .then(() => setToast(t(locale as any, 'analyze.common.engine_ready'), 'success'))
                .catch(() => setToast(t(locale as any, 'analyze.common.engine_error'), 'error'));
        }
    }, [locale, setToast]);

    // 10. Demographics Survey Check
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!FeedbackService.hasCompletedDemographics()) {
                setShowDemographics(true);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [setShowDemographics]);

    const handleRestore = async (setData: any, setFilename: any, setStep: any, setResults: any, setAnalysisType: any) => {
        const saved = await loadWorkspace();
        if (saved) {
            setData(saved.data);
            setFilename(saved.fileName);
            setProfile(profileData(saved.data));
            setStep(saved.currentStep);
            setResults(saved.results);
            setAnalysisType(saved.analysisType);
            setToast(t(locale as any, 'analyze.common.restored_success') || 'Restored', 'success');
            setShowRestoreBanner(false);
        }
    };

    const discardSaved = async () => {
        await clearWorkspace();
        setShowRestoreBanner(false);
        setToast(t(locale as any, 'analyze.common.data_cleared') || 'Cleared', 'info');
    };

    return {
        loading,
        authTimeout,
        showRestoreBanner,
        handleRestore,
        discardSaved,
        locale,
        getNumericColumns
    };
}
