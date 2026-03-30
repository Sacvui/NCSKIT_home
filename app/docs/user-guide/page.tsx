'use client';

import React, { useState, useEffect } from 'react';
import {
    BarChart2, GitCompare, TrendingUp, Layers, Network, 
    ChevronDown, ChevronRight, Target, ListChecks, HelpCircle, Info, Code, CheckCircle2, CircleDot
} from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

interface Method {
    id: string;
    nameVi: string;
    nameEn: string;
    categoryVi: string;
    categoryEn: string;
    descriptionVi: string;
    descriptionEn: string;
    rFunction: string;
    whenToUseVi: string;
    whenToUseEn: string;
    stepsVi: string[];
    stepsEn: string[];
    assumptionsVi?: string[];
    assumptionsEn?: string[];
    outputVi: string[];
    outputEn: string[];
}

const METHODS: Method[] = [
    {
        id: 'descriptive',
        nameVi: 'Thống kê mô tả',
        nameEn: 'Descriptive Statistics',
        categoryVi: 'Độ tin cậy & Mô tả',
        categoryEn: 'Reliability & Descriptive',
        descriptionVi: 'Tính toán các chỉ số thống kê cơ bản để hiểu đặc điểm dữ liệu.',
        descriptionEn: 'Calculate basic summary statistics to understand data characteristics.',
        rFunction: 'psych::describe()',
        whenToUseVi: 'Luôn thực hiện đầu tiên để kiểm tra phân phối và các giá trị bất thường.',
        whenToUseEn: 'Always run first to check distributions and find anomalies.',
        stepsVi: ['Chọn menu Descriptive.', 'Chọn các biến cần tính toán.', 'Nhấn Chạy Phân Tích.'],
        stepsEn: ['Select Descriptive.', 'Select variables.', 'Click Run Analysis.'],
        outputVi: ['Trung bình, SD, Min, Max', 'Skewness & Kurtosis'],
        outputEn: ['Mean, SD, Min, Max', 'Skewness & Kurtosis']
    },
    {
        id: 'cronbach',
        nameVi: 'Cronbach Alpha',
        nameEn: "Cronbach's α",
        categoryVi: 'Độ tin cậy & Mô tả',
        categoryEn: 'Reliability & Descriptive',
        descriptionVi: 'Đánh giá tính nhất quán nội tại của thang đo.',
        descriptionEn: 'Assess internal consistency of measurement scales.',
        rFunction: 'psych::alpha()',
        whenToUseVi: 'Kiểm tra chất lượng thang đo trước khi phân tích nhân tố.',
        whenToUseEn: 'Validate scale quality before factor analysis.',
        stepsVi: ['Chọn menu Cronbach\'s Alpha.', 'Chọn các items của nhân tố.', 'Nhấn Chạy Phân Tích.'],
        stepsEn: ['Select Cronbach\'s Alpha.', 'Select factor items.', 'Click Run Analysis.'],
        outputVi: ['Hệ số Alpha', 'Cronbach Alpha if item deleted'],
        outputEn: ['Alpha coefficient', 'Alpha if item deleted']
    },
    {
        id: 'efa',
        nameVi: 'EFA',
        nameEn: 'Exploratory Factor Analysis',
        categoryVi: 'Cấu trúc & Nhân tố',
        categoryEn: 'Structure & Factor',
        descriptionVi: 'Rút gọn các biến quan sát thành các nhóm nhân tố.',
        descriptionEn: 'Reduce variables into meaningful latent factors.',
        rFunction: 'psych::fa()',
        whenToUseVi: 'Khám phá cấu trúc của thang đo hoặc rút gọn dữ liệu.',
        whenToUseEn: 'Discover scale structure or reduce data dimensionality.',
        stepsVi: ['Chọn menu EFA.', 'Chọn tất cả các biến quan sát.', 'Cấu hình phép trích & phép quay.', 'Nhấn Chạy EFA.'],
        stepsEn: ['Select EFA.', 'Select all indicators.', 'Set extraction/rotation.', 'Click Run EFA.'],
        outputVi: ['KMO & Bartlett', 'Ma trận xoay nhân tố'],
        outputEn: ['KMO & Bartlett', 'Rotated factor matrix']
    },
    {
        id: 'regression',
        nameVi: 'Hồi quy tuyến tính',
        nameEn: 'Linear Regression',
        categoryVi: 'Tương quan & Hồi quy',
        categoryEn: 'Correlation & Regression',
        descriptionVi: 'Dự báo tác động của biến độc lập lên biến phụ thuộc.',
        descriptionEn: 'Predict the impact of IVs on a DV.',
        rFunction: 'stats::lm()',
        whenToUseVi: 'Kiểm tra mối quan hệ nhân quả trong mô hình nghiên cứu.',
        whenToUseEn: 'Testing causal hypotheses.',
        stepsVi: ['Chọn menu Regression.', 'Chọn 1 biến phụ thuộc (Y).', 'Chọn các biến độc lập (X).', 'Nhấn Chạy Hồi Quy.'],
        stepsEn: ['Select Regression.', 'Choose 1 DV (Y).', 'Choose IVs (X).', 'Click Run Regression.'],
        outputVi: ['R-Square (R2)', 'Hệ số Beta'],
        outputEn: ['R-Square', 'Beta coefficients']
    }
];

const CATEGORIES = [
    { nameVi: 'Độ tin cậy & Mô tả', nameEn: 'Reliability & Descriptive', icon: BarChart2, color: 'blue' },
    { nameVi: 'So sánh nhóm', nameEn: 'Group Comparison', icon: GitCompare, color: 'orange' },
    { nameVi: 'Tương quan & Hồi quy', nameEn: 'Correlation & Regression', icon: TrendingUp, color: 'green' },
    { nameVi: 'Cấu trúc & Nhân tố', nameEn: 'Structure & Factor', icon: Layers, color: 'purple' }
];

export default function UserGuidePage() {
    const [locale, setLocale] = useState<Locale>('vi');
    const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    const isVi = locale === 'vi';

    return (
        <div className="bg-slate-50 min-h-screen pt-12 pb-20">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{t(locale, 'docs.userguide.title')}</h1>
                    <p className="text-slate-500 text-lg">{t(locale, 'docs.userguide.subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <Target className="w-6 h-6 text-blue-600 mb-3" />
                        <h3 className="font-bold text-slate-800 mb-2">{isVi ? 'Cách chọn biến' : 'Selecting Variables'}</h3>
                        <p className="text-xs text-slate-500">Giữ phím Shift hoặc Ctrl để chọn nhiều biến cùng lúc trong các bảng menu.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-3" />
                        <h3 className="font-bold text-slate-800 mb-2">{isVi ? 'Kết quả chuẩn APA' : 'APA Reporting'}</h3>
                        <p className="text-xs text-slate-500">Hệ thống tự động định dạng bảng biểu và biểu đồ theo đúng chuẩn APA mới nhất.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <HelpCircle className="w-6 h-6 text-amber-600 mb-3" />
                        <h3 className="font-bold text-slate-800 mb-2">{isVi ? 'Hỗ trợ 24/7' : 'Support'}</h3>
                        <p className="text-xs text-slate-500">Tham gia cộng đồng ncsStat để được giải đáp các thắc mắc về phương pháp xử lý.</p>
                    </div>
                </div>

                {CATEGORIES.map((cat, idx) => (
                    <section key={idx} className="mb-12">
                        <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${cat.color === 'blue' ? 'text-blue-700' : ''}`}>
                            <cat.icon className="w-6 h-6" />
                            {isVi ? cat.nameVi : cat.nameEn}
                        </h2>
                        <div className="space-y-4">
                            {METHODS.filter(m => m.categoryEn === cat.nameEn).map(method => (
                                <div key={method.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <button onClick={() => setExpandedMethod(expandedMethod === method.id ? null : method.id)} className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50">
                                        <div className="text-left font-bold">{method.nameVi}</div>
                                        {expandedMethod === method.id ? <ChevronDown /> : <ChevronRight />}
                                    </button>
                                    {expandedMethod === method.id && (
                                        <div className="p-6 border-t bg-slate-50/50">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Quy trình thực hiện</h4>
                                                    <ol className="text-sm space-y-1">
                                                        {method.stepsVi.map((s, i) => <li key={i}>{i+1}. {s}</li>)}
                                                    </ol>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Đầu ra tiêu chuẩn</h4>
                                                    <ul className="text-sm space-y-1">
                                                        {method.outputVi.map((o, i) => <li key={i}>• {o}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
