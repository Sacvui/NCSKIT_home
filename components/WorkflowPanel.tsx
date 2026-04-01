/**
 * WorkflowPanel Component
 * 
 * Visual workflow guide for the statistical analysis flow:
 * Cronbach Alpha → EFA → CFA → SEM
 */

'use client';

import React from 'react';
import { CheckCircle, ArrowRight, AlertTriangle, TrendingUp } from 'lucide-react';

interface WorkflowStep {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    criteria: string;
    status: 'completed' | 'current' | 'pending' | 'skipped';
    result?: {
        value: number | string;
        label: string;
        passed: boolean;
    };
}

interface WorkflowPanelProps {
    currentStep: string;
    completedSteps: string[];
    cronbachAlpha?: number;
    kmo?: number;
    cfiFit?: number;
    onStepClick?: (stepId: string) => void;
}

const WORKFLOW_STEPS: Omit<WorkflowStep, 'status' | 'result'>[] = [
    {
        id: 'cronbach',
        name: 'Độ Tin Cậy',
        nameEn: "Cronbach's Alpha",
        description: 'Kiểm tra độ tin cậy nội tại của thang đo',
        criteria: 'α ≥ 0.70'
    },
    {
        id: 'efa',
        name: 'Khám Phá Nhân Tố',
        nameEn: 'EFA',
        description: 'Khám phá cấu trúc nhân tố tiềm ẩn',
        criteria: 'KMO ≥ 0.60, Bartlett p < 0.05'
    },
    {
        id: 'cfa',
        name: 'Khẳng Định Nhân Tố',
        nameEn: 'CFA',
        description: 'Xác nhận cấu trúc nhân tố từ EFA',
        criteria: 'CFI ≥ 0.90, RMSEA ≤ 0.08'
    },
    {
        id: 'sem',
        name: 'Mô Hình Cấu Trúc',
        nameEn: 'SEM',
        description: 'Kiểm định các giả thuyết nghiên cứu',
        criteria: 'Fit indices đạt chuẩn'
    }
];

export function WorkflowPanel({
    currentStep,
    completedSteps = [],
    cronbachAlpha,
    kmo,
    cfiFit,
    onStepClick
}: WorkflowPanelProps) {

    const getStepStatus = (stepId: string): WorkflowStep['status'] => {
        if (completedSteps.includes(stepId)) return 'completed';
        if (currentStep === stepId) return 'current';
        return 'pending';
    };

    const getStepResult = (stepId: string): WorkflowStep['result'] | undefined => {
        switch (stepId) {
            case 'cronbach':
                if (cronbachAlpha !== undefined) {
                    return {
                        value: cronbachAlpha.toFixed(3),
                        label: 'α',
                        passed: cronbachAlpha >= 0.7
                    };
                }
                break;
            case 'efa':
                if (kmo !== undefined) {
                    return {
                        value: kmo.toFixed(3),
                        label: 'KMO',
                        passed: kmo >= 0.6
                    };
                }
                break;
            case 'cfa':
                if (cfiFit !== undefined) {
                    return {
                        value: cfiFit.toFixed(3),
                        label: 'CFI',
                        passed: cfiFit >= 0.9
                    };
                }
                break;
        }
        return undefined;
    };

    const steps: WorkflowStep[] = WORKFLOW_STEPS.map(step => ({
        ...step,
        status: getStepStatus(step.id),
        result: getStepResult(step.id)
    }));

    return (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900/60 dark:via-purple-950/20 dark:to-slate-900/60 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-8 shadow-md">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-600 dark:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none">
                    <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-indigo-950 dark:text-indigo-50 tracking-tight">Quy trình phân tích (Workflow)</h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-400 font-medium">Lộ trình chuẩn cho nghiên cứu định lượng</p>
                </div>
            </div>

            {/* Steps Container */}
            <div className="relative pt-2 pb-6 px-2">
                {/* Progress Line */}
                <div className="absolute top-8 left-10 right-10 h-1 bg-slate-200 dark:bg-slate-800 z-0 rounded-full">
                    <div
                        className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                        style={{
                            width: `${(completedSteps.length / (WORKFLOW_STEPS.length - 1)) * 100}%`
                        }}
                    />
                </div>

                <div className="relative z-10 flex justify-between">
                    {steps.map((step, idx) => (
                        <div
                            key={step.id}
                            className={`flex flex-col items-center group cursor-pointer ${step.status === 'current' ? 'scale-110' : 'hover:scale-105'
                                } transition-all duration-300`}
                            onClick={() => onStepClick?.(step.id)}
                        >
                            {/* Step Circle */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 transform ${step.status === 'completed'
                                ? 'bg-green-500 text-white shadow-xl shadow-green-100 dark:shadow-none'
                                : step.status === 'current'
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none ring-8 ring-indigo-50 dark:ring-indigo-900/30'
                                    : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-2 border-slate-100 dark:border-slate-700'
                                }`}>
                                {step.status === 'completed' ? (
                                    <CheckCircle className="w-8 h-8 animate-in zoom-in duration-300" />
                                ) : (
                                    <span className="font-black text-xl">{idx + 1}</span>
                                )}
                            </div>

                            {/* Step Metadata */}
                            <div className="mt-5 text-center px-1">
                                <div className={`text-xs font-black uppercase tracking-tighter transition-colors ${step.status === 'current' ? 'text-indigo-900 dark:text-indigo-100' :
                                        step.status === 'completed' ? 'text-green-700 dark:text-green-400' : 'text-slate-400 dark:text-slate-600'
                                    }`}>
                                    {step.nameEn}
                                </div>
                                <div className={`text-[10px] font-bold mt-1 max-w-[80px] leading-tight ${
                                    step.status === 'current' ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-500'
                                }`}>
                                    {step.name}
                                </div>
                            </div>

                            {/* Result Token */}
                            {step.result && (
                                <div className={`mt-3 px-3 py-1 rounded-lg text-[10px] font-black shadow-sm transform -rotate-2 ${step.result.passed
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50'
                                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50'
                                    }`}>
                                    {step.result.label}={step.result.value}
                                </div>
                            )}

                            {/* Threshold Marker */}
                            {step.status === 'current' && (
                                <div className="mt-2 text-[9px] font-bold text-indigo-500 dark:text-indigo-400 animate-pulse uppercase">
                                    Target: {step.criteria}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Detail Guidance */}
            {steps.find(s => s.status === 'current') && (
                <div className="mt-8 bg-white/90 dark:bg-slate-800/60 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30 shadow-inner">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg shadow-md">
                            <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="font-black text-indigo-950 dark:text-indigo-100 text-lg uppercase tracking-tight">
                                Bước {steps.findIndex(s => s.status === 'current') + 1}: {steps.find(s => s.status === 'current')?.name}
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed font-medium">
                                {steps.find(s => s.status === 'current')?.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * WorkflowNextStep Component
 * Shows recommendation for next step after analysis
 */
interface WorkflowNextStepProps {
    currentAnalysis: string;
    canProceed: boolean;
    nextStep: string;
    nextStepName: string;
    reason: string;
    onProceed: () => void;
}

export function WorkflowNextStep({
    currentAnalysis,
    canProceed,
    nextStep,
    nextStepName,
    reason,
    onProceed
}: WorkflowNextStepProps) {
    if (!canProceed) {
        return (
            <div className="bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900/30 rounded-2xl p-6 mt-8 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <h4 className="font-black text-orange-950 dark:text-orange-100 text-lg">Chưa đủ điều kiện tiến hành</h4>
                        <p className="text-sm text-orange-800 dark:text-orange-300 mt-2 font-medium leading-relaxed">{reason}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 mt-8 shadow-xl shadow-emerald-200 dark:shadow-none text-white overflow-hidden relative group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10 flex items-center gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg rotate-6 group-hover:rotate-0 transition-transform duration-500">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                    <div className="inline-block px-3 py-1 bg-emerald-500/50 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-white/20">
                        Recommendation (Khuyến nghị)
                    </div>
                    <h4 className="font-black mb-2 text-2xl tracking-tighter">
                        ĐỦ ĐIỀU KIỆN TIẾN HÀNH {nextStepName.toUpperCase()}
                    </h4>
                    <p className="text-emerald-50 text-sm mb-6 font-medium leading-relaxed max-w-2xl">{reason}</p>
                    <button
                        onClick={onProceed}
                        className="px-8 py-4 bg-white text-emerald-700 hover:bg-emerald-50 font-black rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 transform hover:-translate-y-1 active:scale-95 group/btn"
                    >
                        <span>TIẾP TỤC {nextStepName.toUpperCase()}</span>
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
