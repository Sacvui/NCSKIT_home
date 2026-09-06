'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
    BarChart2, GitCompare, TrendingUp, Layers, 
    ChevronDown, ChevronRight, Target, HelpCircle, Code, CheckCircle2, CircleDot,
    FileUp, Search, Activity, FileSpreadsheet, Download, Info, AlertTriangle
} from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

export default function UserGuidePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>}>
            <UserGuideContent />
        </Suspense>
    );
}

function UserGuideContent() {
    const [locale, setLocale] = useState<Locale>('vi');
    const [mounted, setMounted] = useState(false);
    const [expandedMethod, setExpandedMethod] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'workflow' | 'methods' | 'faq'>('workflow');

    useEffect(() => {
        setLocale(getStoredLocale());
        setMounted(true);

        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    if (!mounted) return null;

    const WORKFLOW_STEPS = [
        {
            id: 1,
            title: locale === 'vi' ? 'Bước 1: Khởi tạo & Chuẩn hóa Dữ liệu' : 'Step 1: Data Initialization & Standardization',
            desc: locale === 'vi' ? 'Tải tệp CSV (.csv) hoặc Excel (.xlsx, .xls) lên hệ thống. Đảm bảo dữ liệu đã được làm sạch, không chứa ký tự đặc biệt ở tiêu đề cột, và mã hóa các biến định tính về dạng số (ví dụ: Nam=1, Nữ=2).' : 'Upload CSV (.csv) or Excel (.xlsx, .xls) files. Ensure data is cleaned, no special characters in column headers, and categorical variables are numeric encoded (e.g., Male=1, Female=2).',
            icon: FileUp,
            color: 'bg-blue-500'
        },
        {
            id: 2,
            title: locale === 'vi' ? 'Bước 2: Kiểm định Sơ bộ & Phân phối' : 'Step 2: Preliminary & Distribution Check',
            desc: locale === 'vi' ? 'Sử dụng Thống kê mô tả (Descriptive Statistics) và Tần số (Frequencies) để nhận diện đặc điểm mẫu, phát hiện các giá trị dị biệt (outliers) và kiểm tra tính phân phối chuẩn của dữ liệu.' : 'Use Descriptive Statistics and Frequencies to identify sample characteristics, detect outliers, and check data normality.',
            icon: Search,
            color: 'bg-indigo-500'
        },
        {
            id: 3,
            title: locale === 'vi' ? 'Bước 3: Đánh giá Chất lượng Thang đo' : 'Step 3: Scale Quality Evaluation',
            desc: locale === 'vi' ? 'Tiến hành kiểm định Cronbach Alpha để đo lường độ tin cậy nhất quán nội tại. Sau đó chạy Phân tích nhân tố khám phá (EFA) để đánh giá giá trị hội tụ và phân biệt, loại bỏ các biến quan sát tải chéo hoặc hệ số tải thấp.' : 'Run Cronbach Alpha for internal consistency. Then execute Exploratory Factor Analysis (EFA) to evaluate convergent/discriminant validity, removing cross-loading or low-loading indicators.',
            icon: Layers,
            color: 'bg-purple-500'
        },
        {
            id: 4,
            title: locale === 'vi' ? 'Bước 4: Kiểm định Giả thuyết Mô hình' : 'Step 4: Model Hypothesis Testing',
            desc: locale === 'vi' ? 'Dựa vào mô hình nghiên cứu để chọn phép tính phù hợp: T-Test/ANOVA cho kiểm định sự khác biệt, Hệ số tương quan Pearson cho mối liên hệ tuyến tính, hoặc Hồi quy/PLS-SEM để kiểm tra các tác động nhân quả.' : 'Choose methods based on your research model: T-Test/ANOVA for differences, Pearson Correlation for linear relationships, or Regression/PLS-SEM to test causal impacts.',
            icon: Activity,
            color: 'bg-emerald-500'
        },
        {
            id: 5,
            title: locale === 'vi' ? 'Bước 5: Xuất Báo cáo Chuẩn Quốc tế' : 'Step 5: Exporting International Standard Report',
            desc: locale === 'vi' ? 'Kết quả phân tích được hệ thống tự động định dạng thành bảng biểu chuẩn APA 7th Edition. Bạn có thể tải xuống bằng Word, Excel hoặc PDF và đưa thẳng vào luận văn mà không cần căn chỉnh lại.' : 'Analysis results are automatically formatted into APA 7th Edition tables. You can download as Word, Excel or PDF and insert directly into your thesis without realignment.',
            icon: Download,
            color: 'bg-amber-500'
        }
    ];

    const FAQ_LIST = [
        {
            q: locale === 'vi' ? 'Quy định định dạng File dữ liệu tải lên như thế nào?' : 'What is the required data file format?',
            a: locale === 'vi' ? 'Hệ thống hỗ trợ .CSV, .XLSX, và .XLS. Tiêu đề cột nên viết liền không dấu (VD: QL1, QL2). Hãy loại bỏ các dòng hướng dẫn, chỉ giữ lại dòng đầu tiên là Tên biến, các dòng sau là Dữ liệu (số).' : 'Supports .CSV, .XLSX, and .XLS. Column headers should be continuous without special chars (e.g., QL1, QL2). Remove instruction rows, keeping only the first row as Variable Name and the rest as Numeric Data.'
        },
        {
            q: locale === 'vi' ? 'Dữ liệu của tôi có được bảo mật không?' : 'Is my data secure?',
            a: locale === 'vi' ? 'Bảo mật 100%. NCSSTAT xử lý dữ liệu hoàn toàn tại trình duyệt của bạn nhờ công nghệ WebAssembly (Client-side). Dữ liệu sẽ KHÔNG BAO GIỜ được gửi lên bất kỳ máy chủ nào.' : '100% secure. NCSSTAT processes data entirely in your browser using WebAssembly (Client-side). Your data is NEVER sent to any external server.'
        },
        {
            q: locale === 'vi' ? 'Làm sao để biết kết quả kiểm định có ý nghĩa thống kê?' : 'How to know if the test is statistically significant?',
            a: locale === 'vi' ? 'Hệ thống tuân theo chuẩn mực thống kê: p-value < 0.05 được coi là có ý nghĩa. Kết quả sẽ tự động được đánh dấu (*) tương ứng với các mức ý nghĩa (95%, 99%, 99.9%) để hỗ trợ bạn đọc nhanh.' : 'The system follows statistical standards: p-value < 0.05 is considered significant. Results are automatically marked with (*) corresponding to significance levels (95%, 99%, 99.9%) to help you read quickly.'
        },
        {
            q: locale === 'vi' ? 'Tại sao hệ thống báo lỗi khi tôi chạy Phân tích Nhân tố (EFA) hoặc PLS-SEM?' : 'Why do I get an error running EFA or PLS-SEM?',
            a: locale === 'vi' ? 'Các thuật toán này yêu cầu dữ liệu không được có "Missing Values" (Giá trị trống). Hãy kiểm tra báo cáo ở bước Khởi tạo dữ liệu, nếu có giá trị trống, bạn cần lọc bỏ hoặc thay thế bằng giá trị Trung bình (Mean) trong Excel trước khi tải lên lại.' : 'These algorithms require data to have no Missing Values. Please check the report in the Data Initialization step. If missing values exist, filter them out or replace them with Mean values in Excel before re-uploading.'
        },
        {
            q: locale === 'vi' ? 'Làm sao để xuất các bảng biểu sang Word mà không bị vỡ khung?' : 'How to export tables to Word without breaking the layout?',
            a: locale === 'vi' ? 'Tất cả các kết quả phân tích trong NCSSTAT đều có nút "Xuất Word". Khi bấm vào, hệ thống sẽ tự động cấu hình độ rộng cột và viền chuẩn APA, bạn chỉ cần Copy & Paste trực tiếp vào Luận văn.' : 'All results have an "Export Word" button. When clicked, the system auto-configures column widths and APA borders. You can simply Copy & Paste directly into your Thesis.'
        }
    ];

    const categories = [
        { key: 'reliability', icon: BarChart2, color: 'text-blue-700', methods: ['descriptive', 'cronbach'] },
        { key: 'comparison', icon: GitCompare, color: 'text-orange-700', methods: ['ttest', 'anova'] },
        { key: 'correlation', icon: TrendingUp, color: 'text-green-700', methods: ['correlation', 'regression'] },
        { key: 'structure', icon: Layers, color: 'text-purple-700', methods: ['efa'] }
    ];

    return (
        <div className="bg-slate-50 min-h-screen selection:bg-indigo-100 selection:text-indigo-900 pb-24 font-sans">
            {/* Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="relative z-10">
                <main className="container mx-auto px-6 max-w-5xl py-16 md:py-24">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            {t(locale, 'docs.userguide.title')}
                        </h1>
                        <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed font-light">
                            {t(locale, 'docs.userguide.subtitle')}
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-16">
                        <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex gap-1">
                            {(['workflow', 'methods', 'faq'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                        activeTab === tab 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    {tab === 'workflow' ? (locale === 'vi' ? 'Quy trình' : 'Workflow') :
                                     tab === 'methods' ? (locale === 'vi' ? 'Phương pháp' : 'Methods') :
                                     (locale === 'vi' ? 'Hỏi đáp' : 'FAQ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="animate-in fade-in duration-700">
                        {activeTab === 'workflow' && (
                            <div className="space-y-8">
                                <div className="grid gap-6">
                                    {WORKFLOW_STEPS.map((step, i) => (
                                        <div key={step.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                                            <div className={`w-16 h-16 rounded-2xl ${step.color} shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                                                <step.icon className="w-8 h-8" />
                                            </div>
                                            <div className="flex-grow text-center md:text-left">
                                                <h3 className="text-xl font-extrabold text-slate-900 mb-2">{step.title}</h3>
                                                <p className="text-slate-500 text-sm leading-relaxed font-light">{step.desc}</p>
                                            </div>
                                            <div className="text-5xl font-black text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity absolute right-8 top-1/2 -translate-y-1/2 select-none">
                                                0{step.id}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Info className="w-32 h-32" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 italic">
                                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                                        {locale === 'vi' ? 'Lời khuyên từ Chuyên gia Thống kê' : 'Tip from Statistical Experts'}
                                    </h3>
                                    <ul className="space-y-3 text-indigo-100 text-lg leading-relaxed font-light list-disc pl-5">
                                        <li>
                                            {locale === 'vi' 
                                                ? 'Hãy luôn quy đổi các biến Định tính (Chữ) sang Định lượng (Số) trước khi nhập liệu.'
                                                : 'Always convert Categorical variables (Text) to Quantitative (Numbers) before inputting.'}
                                        </li>
                                        <li>
                                            {locale === 'vi' 
                                                ? 'Nếu mẫu khảo sát của bạn dưới 100, hãy ưu tiên dùng PLS-SEM thay vì CB-SEM (AMOS) để giảm rủi ro mô hình không hội tụ.'
                                                : 'If your sample size is under 100, prefer PLS-SEM over CB-SEM (AMOS) to reduce non-convergence risks.'}
                                        </li>
                                        <li>
                                            {locale === 'vi' 
                                                ? 'Kiểm tra kỹ các dòng trống cuối File Excel. Hệ thống sẽ báo lỗi Missing Data nếu bạn quên xóa các dòng trắng này.'
                                                : 'Carefully check empty rows at the end of Excel files. The system will report Missing Data if you forget to delete them.'}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'methods' && (
                            <div className="space-y-16">
                                {categories.map((cat) => (
                                    <section key={cat.key}>
                                        <h2 className={`text-2xl font-extrabold mb-8 flex items-center gap-3 ${cat.color}`}>
                                            <cat.icon className="w-8 h-8" />
                                            {t(locale, `methods.${cat.key}`)}
                                        </h2>
                                        <div className="grid gap-6">
                                            {cat.methods.map((methodId) => {
                                                const steps = t(locale, `methods_guide.${methodId}.steps`);
                                                const stepsArray = Array.isArray(steps) ? steps : [];
                                                const output = t(locale, `methods_guide.${methodId}.output`);
                                                const outputArray = Array.isArray(output) ? output : [];

                                                return (
                                                    <div key={methodId} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
                                                        <button 
                                                            onClick={() => setExpandedMethod(expandedMethod === methodId ? null : methodId)} 
                                                            className={`w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 text-left transition-colors ${expandedMethod === methodId ? 'bg-indigo-50/30' : ''}`}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="font-extrabold text-slate-900 text-lg">
                                                                    {t(locale, `methods_guide.${methodId}.name`)}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                                    {t(locale, `methods_guide.${methodId}.desc`)}
                                                                </span>
                                                            </div>
                                                            <div className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-transform duration-300 ${expandedMethod === methodId ? 'rotate-180 bg-white shadow-sm' : ''}`}>
                                                                <ChevronDown className="w-4 h-4 text-slate-400" />
                                                            </div>
                                                        </button>
                                                        
                                                        {expandedMethod === methodId && (
                                                            <div className="px-8 py-10 border-t border-slate-100 bg-slate-50/30">
                                                                <p className="text-base text-slate-600 mb-10 italic leading-relaxed font-light">
                                                                    {t(locale, `methods_guide.${methodId}.purpose`)}
                                                                </p>
                                                                
                                                                <div className="grid md:grid-cols-2 gap-12">
                                                                    <div>
                                                                        <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] mb-6 flex items-center gap-2">
                                                                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                                                            {t(locale, 'docs_userguide_labels.procedure_title')}
                                                                        </h4>
                                                                        <ol className="space-y-4">
                                                                            {stepsArray.map((s: string, i: number) => (
                                                                                <li key={i} className="flex gap-4">
                                                                                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-900 shrink-0 shadow-sm">{i+1}</span>
                                                                                    <span className="text-slate-600 text-sm leading-snug">{s}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ol>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] mb-6 flex items-center gap-2">
                                                                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                                                                            {t(locale, 'docs_userguide_labels.output_title')}
                                                                        </h4>
                                                                        <ul className="space-y-4">
                                                                            {outputArray.map((o: string, i: number) => (
                                                                                <li key={i} className="flex items-center gap-4">
                                                                                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                                                                                        <CircleDot className="w-3.5 h-3.5 text-emerald-500" />
                                                                                    </div>
                                                                                    <span className="text-slate-600 text-sm font-medium">{o}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                                                                    <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
                                                                        <Code className="w-4 h-4 text-indigo-400" />
                                                                        <span className="text-[11px] font-mono font-bold text-indigo-100/80">
                                                                            R-Engine: psych & lavaan
                                                                        </span>
                                                                    </div>
                                                                    <a href="/analyze" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
                                                                        {t(locale, 'methods_guide.cta')} &rarr;
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        )}

                        {activeTab === 'faq' && (
                            <div className="max-w-3xl mx-auto space-y-6">
                                {FAQ_LIST.map((faq, i) => (
                                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 text-xs font-black">Q</div>
                                            {faq.q}
                                        </h3>
                                        <p className="text-slate-500 text-base leading-relaxed font-light pl-11">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                                
                                <div className="mt-12 p-8 bg-slate-100 rounded-[2.5rem] border border-dashed border-slate-300 text-center">
                                    <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                    <h4 className="font-bold text-slate-800 mb-2">{locale === 'vi' ? 'Vẫn còn thắc mắc?' : 'Still have questions?'}</h4>
                                    <p className="text-sm text-slate-500 mb-6">{locale === 'vi' ? 'Hãy liên hệ với đội ngũ kỹ thuật của ncsStat để được hỗ trợ tốt nhất.' : 'Contact ncsStat technical team for more support.'}</p>
                                    <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                                        {locale === 'vi' ? 'Gửi yêu cầu hỗ trợ' : 'Submit Support Request'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
