'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    BarChart2, Shield, Network, GitCompare, Layers, TrendingUp, Grid3x3,
    Activity, Binary, Target, ArrowRightLeft, Users, ChevronDown, ChevronRight,
    BookOpen, Code, ExternalLink, CircleDot, Server, Lock, CreditCard, FileDown,
    CheckCircle2, AlertCircle, Info, BookMarked, HelpCircle
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
        outputVi: ['Trung bình, Độ lệch chuẩn, Min, Max', 'Độ lệch (Skewness) & Độ nhọn (Kurtosis)', 'Số lượng giá trị thiếu (NA)'],
        outputEn: ['Mean, SD, Min, Max', 'Skewness & Kurtosis', 'Missing value counts']
    },
    {
        id: 'cronbach',
        nameVi: 'Độ tin cậy Cronbach Alpha',
        nameEn: "Scale Reliability (Cronbach's α)",
        categoryVi: 'Độ tin cậy & Mô tả',
        categoryEn: 'Reliability & Descriptive',
        descriptionVi: 'Đánh giá tính nhất quán nội tại của các thang đo đa biến.',
        descriptionEn: 'Assess internal consistency of multi-item measurement scales.',
        rFunction: 'psych::alpha(), psych::omega()',
        whenToUseVi: 'Dùng để kiểm tra chất lượng thang đo trước khi phân tích EFA/CFA.',
        whenToUseEn: 'Use to validate scale quality before factor analysis.',
        assumptionsVi: ['Các biến cùng đo lường một khái niệm', 'Thang đo dạng Likert'],
        assumptionsEn: ['Items measure the same construct', 'Likert-type scales'],
        outputVi: ['Hệ số Cronbach Alpha', 'Tương quan biến tổng', 'Alpha nếu loại biến'],
        outputEn: ["Cronbach's Alpha coefficient", 'Item-total correlations', 'Alpha if item deleted']
    },
    {
        id: 'efa',
        nameVi: 'Phân tích nhân tố khám phá (EFA)',
        nameEn: 'Exploratory Factor Analysis (EFA)',
        categoryVi: 'Cấu trúc & Nhân tố',
        categoryEn: 'Structure & Factor',
        descriptionVi: 'Rút gọn các biến quan sát thành các nhóm nhân tố có ý nghĩa.',
        descriptionEn: 'Reduce variables into meaningful latent factors.',
        rFunction: 'psych::fa() or stats::factanal()',
        whenToUseVi: 'Khi muốn khám phá cấu trúc của thang đo hoặc rút gọn dữ liệu.',
        whenToUseEn: 'To discover scale structure or reduce data dimensionality.',
        assumptionsVi: ['Mẫu đủ lớn (N > 100)', 'KMO >= 0.6', 'Bartlett < 0.05'],
        assumptionsEn: ['Adequate sample size (N > 100)', 'KMO >= 0.6', 'Bartlett test sig.'],
        outputVi: ['Hệ số KMO & Bartlett', 'Tổng phương sai trích', 'Ma trận xoay nhân tố'],
        outputEn: ['KMO & Bartlett tests', 'Total variance explained', 'Rotated factor matrix']
    },
    {
        id: 'correlation',
        nameVi: 'Phân tích tương quan Pearson',
        nameEn: 'Pearson Correlation',
        categoryVi: 'Tương quan & Hồi quy',
        categoryEn: 'Correlation & Regression',
        descriptionVi: 'Đo lường mức độ quan hệ tuyến tính giữa hai biến định lượng.',
        descriptionEn: 'Measure the strength of linear relationship between two variables.',
        rFunction: 'stats::cor.test()',
        whenToUseVi: 'Kiểm tra mối liên hệ sơ bộ giữa các biến trước khi chạy hồi quy.',
        whenToUseEn: 'Check preliminary relationships before regression.',
        outputVi: ['Hệ số tương quan (r)', 'Mức ý nghĩa (p-value)', 'Ma trận tương quan'],
        outputEn: ['Correlation coefficient (r)', 'Significance (p-value)', 'Correlation matrix']
    },
    {
        id: 'regression',
        nameVi: 'Hồi quy tuyến tính bội',
        nameEn: 'Multiple Linear Regression',
        categoryVi: 'Tương quan & Hồi quy',
        categoryEn: 'Correlation & Regression',
        descriptionVi: 'Dự báo tác động của nhiều biến độc lập lên một biến phụ thuộc.',
        descriptionEn: 'Predict the impact of multiple independent variables on a dependent variable.',
        rFunction: 'stats::lm()',
        whenToUseVi: 'Kiểm tra các giả thuyết về mối quan hệ nhân quả trong mô hình nghiên cứu.',
        whenToUseEn: 'Testing causal hypotheses in research models.',
        assumptionsVi: ['Quan hệ tuyến tính', 'Không đa cộng tuyến (VIF < 10)', 'Phần dư phân phối chuẩn'],
        assumptionsEn: ['Linear relationship', 'No multicollinearity (VIF < 10)', 'Normal residuals'],
        outputVi: ['R-Square (Hệ số xác định)', 'Bảng ANOVA', 'Hệ số Beta (chuẩn hóa & chưa chuẩn hóa)'],
        outputEn: ['R-Square (R2)', 'ANOVA table', 'Standardized and Unstandardized Betas']
    }
];

const CATEGORIES = [
    { nameVi: 'Độ tin cậy & Mô tả', nameEn: 'Reliability & Descriptive', icon: BarChart2, color: 'blue' },
    { nameVi: 'Cấu trúc & Nhân tố', nameEn: 'Structure & Factor', icon: Layers, color: 'purple' },
    { nameVi: 'Tương quan & Hồi quy', nameEn: 'Correlation & Regression', icon: TrendingUp, color: 'green' },
    { nameVi: 'So sánh nhóm', nameEn: 'Group Comparison', icon: GitCompare, color: 'orange' },
    { nameVi: 'Mô hình nâng cao (SEM/CFA)', nameEn: 'Advanced Models (SEM/CFA)', icon: Network, color: 'teal' }
];

export default function DocsPage() {
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
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Hero Header */}
            <div className="bg-slate-900 text-white py-16 mb-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="bg-indigo-600/20 p-4 rounded-2xl border border-indigo-500/30">
                            <BookOpen className="w-16 h-16 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
                                {isVi ? 'Hướng dẫn Phân tích & Tài liệu Hệ thống' : 'Analysis Guide & System Documentation'}
                            </h1>
                            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                                {isVi 
                                    ? 'Cẩm nang toàn diện về các phương pháp thống kê, cách diễn giải kết quả và kiến trúc vận hành của ncsStat.'
                                    : 'A comprehensive guide to statistical methods, result interpretation, and ncsStat system architecture.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl">
                
                {/* Interpretation Dashboard */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800">
                            {isVi ? 'Cách đọc Sig.' : 'Interpreting Sig.'}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {isVi 
                                ? 'p < 0.05: Có ý nghĩa thống kê. p > 0.05: Không có bằng chứng thực nghiệm.'
                                : 'p < .05: Statistically significant. p > .05: Insufficient evidence.'}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800">
                            {isVi ? 'Đánh dấu sao (*)' : 'Star Notation (*)'}
                        </h3>
                        <p className="text-sm text-slate-500">
                            *: p &lt; .05; **: p &lt; .01; ***: p &lt; .001. 
                            {isVi ? ' Càng nhiều sao càng có ý nghĩa.' : ' More stars indicate higher significance.'}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800">
                            {isVi ? 'Bảo mật Dữ liệu' : 'Data Privacy'}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {isVi 
                                ? 'Dữ liệu được xử lý 100% tại trình duyệt. Không có dữ liệu tải lên Server.'
                                : 'Data processed 100% in-browser. No files uploaded to server.'}
                        </p>
                    </div>
                </div>

                {/* Methods Sections */}
                {CATEGORIES.map((cat, idx) => (
                    <section key={idx} className="mb-12">
                        <h2 className={`text-xl font-bold mb-6 flex items-center gap-2
                            ${cat.color === 'blue' ? 'text-blue-700' : ''}
                            ${cat.color === 'purple' ? 'text-purple-700' : ''}
                            ${cat.color === 'green' ? 'text-green-700' : ''}
                            ${cat.color === 'orange' ? 'text-orange-700' : ''}
                            ${cat.color === 'teal' ? 'text-teal-700' : ''}
                        `}>
                            <cat.icon className="w-6 h-6" />
                            {isVi ? cat.nameVi : cat.nameEn}
                        </h2>

                        <div className="space-y-4">
                            {METHODS.filter(m => m.categoryEn === cat.nameEn).length === 0 ? (
                                <div className="p-8 text-center bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                                    {isVi ? 'Tài liệu đang được cập nhật...' : 'Documentation being updated...'}
                                </div>
                            ) : (
                                METHODS.filter(m => m.categoryEn === cat.nameEn).map(method => (
                                    <div
                                        key={method.id}
                                        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setExpandedMethod(
                                                expandedMethod === method.id ? null : method.id
                                            )}
                                            className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="text-left">
                                                <h3 className="font-bold text-slate-800">
                                                    {method.nameVi} <span className="text-slate-400 font-normal">({method.nameEn})</span>
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    {isVi ? method.descriptionVi : method.descriptionEn}
                                                </p>
                                            </div>
                                            {expandedMethod === method.id ? (
                                                <ChevronDown className="w-5 h-5 text-slate-400" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-slate-400" />
                                            )}
                                        </button>

                                        {expandedMethod === method.id && (
                                            <div className="px-6 pb-6 border-t bg-slate-50/50">
                                                <div className="grid md:grid-cols-2 gap-8 mt-6">
                                                    <div>
                                                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                                                            <Target className="w-4 h-4" />
                                                            {isVi ? 'Khi nào sử dụng' : 'When to Use'}
                                                        </h4>
                                                        <p className="text-sm text-slate-700 leading-relaxed">
                                                            {isVi ? method.whenToUseVi : method.whenToUseEn}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                                                            <Code className="w-4 h-4" />
                                                            R-Engine Internal
                                                        </h4>
                                                        <code className="text-[13px] bg-slate-900 text-teal-400 px-3 py-1.5 rounded-lg flex items-center">
                                                            {method.rFunction}
                                                        </code>
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-8 mt-6">
                                                    {method.assumptionsVi && (
                                                        <div>
                                                            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                                                                <HelpCircle className="w-4 h-4" />
                                                                {isVi ? 'Giả định thống kê' : 'Statistical Assumptions'}
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                {(isVi ? method.assumptionsVi : method.assumptionsEn)?.map((a, i) => (
                                                                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                        <CircleDot className="w-3 h-3 mt-1 text-slate-300 flex-shrink-0" />
                                                                        {a}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                                                            <Info className="w-4 h-4" />
                                                            {isVi ? 'Kết quả đầu ra' : 'Standard Output'}
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {(isVi ? method.outputVi : method.outputEn).map((o, i) => (
                                                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-green-500 flex-shrink-0" />
                                                                    {o}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                ))}

                {/* Core Architecture */}
                <div className="mt-20 border-t pt-16">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 italic">
                            {isVi ? 'Kiến trúc & Vận hành' : 'Architecture & Operations'}
                        </h2>
                        <p className="text-slate-500">
                            {isVi ? 'Nền tảng được xây dựng trên các công nghệ hiện đại nhất.' : 'Building on the most modern technologies.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Server className="w-24 h-24" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                                <Code className="w-6 h-6 text-indigo-600" />
                                WebR (WebAssembly)
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                {isVi 
                                    ? 'ncsStat tích hợp máy chủ R trực tiếp vào trình duyệt qua chuẩn WebAssembly. Dữ liệu của bạn KHÔNG bao giờ rời khỏi máy tính cá nhân khi tính toán.'
                                    : 'ncsStat integrates the R engine directly into your browser via WebAssembly. Your data NEVER leaves your computer during calculation.'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">WASM</span>
                                <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">R 4.3.0</span>
                                <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">LAVAAN</span>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Shield className="w-24 h-24" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                                <Lock className="w-6 h-6 text-blue-600" />
                                {isVi ? 'Quyền riêng tư Tuyệt đối' : 'Privacy & Compliance'}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                {isVi 
                                    ? 'Chúng tôi tuân thủ triết lý "Client-side First". Chỉ các thông tin hồ sơ (Tên, Email) được lưu trữ tại Supabase Auth để đồng bộ hóa thiết bị.'
                                    : 'We follow a "Client-side First" philosophy. Only profile info (Name, Email) is stored at Supabase for synchronization across devices.'}
                            </p>
                            <Link href="/privacy" className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1">
                                {isVi ? 'Đọc Chính sách bảo mật' : 'Read Privacy Policy'}
                                <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* FAQ / Download */}
                <div className="mt-16 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 opacity-10">
                        <Target className="w-64 h-64 -mb-12 -mr-12" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4 italic">
                                {isVi ? 'Bạn cần thêm trợ giúp?' : 'Need more help?'}
                            </h2>
                            <p className="text-indigo-200">
                                {isVi 
                                    ? 'Kết nối với cộng đồng Nghiên cứu sinh ncsStat để trao đổi về phương pháp và kỹ thuật xử lý dữ liệu.'
                                    : 'Connect with the ncsStat community to discuss methods and data processing techniques.'}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                {isVi ? 'Tham gia Group' : 'Join Community'}
                            </button>
                            <button className="px-8 py-3 bg-transparent border-2 border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
                                <ExternalLink className="w-5 h-5" />
                                {isVi ? 'Liên hệ Admin' : 'Contact Support'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
