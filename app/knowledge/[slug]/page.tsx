'use client';

import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Clock, Share2, Bookmark, User, 
    BookOpen, ShieldCheck, CheckCircle2, AlertCircle,
    Info, Target, Layers, TrendingUp
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';
import Link from 'next/link';

// Mock content for the first authority article
const articleData = {
    'cronbach-alpha': {
        title_vi: 'Kiểm định độ tin cậy Cronbach\'s Alpha: Hướng dẫn từ A-Z',
        title_en: 'Cronbach\'s Alpha Reliability Test: A-Z Guide',
        category: 'Preliminary Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        items: [
            {
                h2_vi: '1. Cronbach\'s Alpha là gì?',
                h2_en: '1. What is Cronbach\'s Alpha?',
                content_vi: 'Cronbach\'s Alpha là một phép kiểm định thống kê dùng để đo lường tính nhất quán nội tại (internal consistency) của một thang đo. Nó cho biết các câu hỏi trong cùng một nhóm có đo lường cùng một khái niệm hay không.',
                content_en: 'Cronbach\'s Alpha is a statistical test used to measure the internal consistency of a scale. It indicates whether questions in the same group measure the same concept.'
            },
            {
                h2_vi: '2. Các ngưỡng giá trị cần lưu ý',
                h2_en: '2. Key Threshold Values',
                content_vi: 'Trong nghiên cứu học thuật, các ngưỡng sau thường được chấp nhận: \n- Alpha > 0.8: Rất tốt\n- 0.7 < Alpha < 0.8: Sử dụng được\n- 0.6 < Alpha < 0.7: Chấp nhận được (với các nghiên cứu mới)\n- Alpha < 0.6: Thang đo không đáng tin cậy.',
                content_en: 'In academic research, the following thresholds are commonly accepted: \n- Alpha > 0.8: Excellent\n- 0.7 < Alpha < 0.8: Good\n- 0.6 < Alpha < 0.7: Acceptable (for new research)\n- Alpha < 0.6: Internal consistency is low/unreliable.'
            }
        ]
    },
    'efa-factor-analysis': {
        title_vi: 'Phân tích nhân tố khám phá (EFA): Khi nào cần xoay nhân tố?',
        title_en: 'Exploratory Factor Analysis (EFA): When to Rotate Factors?',
        category: 'Factor Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        items: [
            {
                h2_vi: '1. Mục tiêu của EFA',
                h2_en: '1. Objectives of EFA',
                content_vi: 'EFA giúp rút gọn một tập hợp nhiều biến quan sát thành một số ít các nhân tố có ý nghĩa hơn. Điều này giúp mô hình nghiên cứu gọn nhẹ và tập trung vào các khái niệm chính.',
                content_en: 'EFA helps simplify a large set of observed variables into a fewer number of meaningful factors, making the research model concise and focused on core concepts.'
            },
            {
                h2_vi: '2. Các chỉ số quan trọng (KMO & Bartlett)',
                h2_en: '2. Key Metrics (KMO & Bartlett)',
                content_vi: 'KMO phải đạt >= 0.5 và kiểm định Bartlett phải có ý nghĩa thống kê (Sig < 0.05). Ngoài ra, hệ số tải nhân tố (Factor Loading) nên >= 0.5 để đảm bảo ý nghĩa thiết thực.',
                content_en: 'KMO must be >= 0.5 and Bartlett\'s test must be statistically significant (Sig < 0.05). Additionally, factor loadings should be >= 0.5 for practical significance.'
            }
        ]
    },
    'regression-vif-multicollinearity': {
        title_vi: 'Hồi quy đa biến và kiểm tra Đa cộng tuyến (VIF)',
        title_en: 'Multiple Regression and Multicollinearity (VIF) Check',
        category: 'Impact Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        items: [
            {
                h2_vi: '1. Kiểm tra Đa cộng tuyến',
                h2_en: '1. Checking Multicollinearity',
                content_vi: 'Đa cộng tuyến xảy ra khi các biến độc lập có tương quan quá mạnh với nhau. Điều này được đo qua hệ số VIF. Thông thường VIF < 10 là chấp nhận được, nhưng trong nghiên cứu khắt khe, VIF < 2 hoặc 5 là lý tưởng.',
                content_en: 'Multicollinearity occurs when independent variables are too strongly correlated. This is measured via VIF. Generally, VIF < 10 is acceptable, but VIF < 2 or 5 is ideal for rigorous studies.'
            }
        ]
    },
    'descriptive-statistics-interpretation': {
        title_vi: 'Thống kê mô tả: Cách trình bày Mean, Std. Deviation chuẩn APA',
        title_en: 'Descriptive Statistics: Presenting Mean & Std. Deviation in APA',
        category: 'Preliminary Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        items: [
            {
                h2_vi: '1. Tại sao cần Thống kê mô tả?',
                h2_en: '1. Why Use Descriptive Statistics?',
                content_vi: 'Nó cung cấp cái nhìn tổng quan về mẫu nghiên cứu, đặc điểm nhân khẩu học và mức độ đánh giá trung bình của đáp viên đối với các thang đo.',
                content_en: 'It provides an overview of the research sample, demographics, and respondents\' average ratings for the scales.'
            }
        ]
    },
    'independent-t-test-guide': {
        title_vi: 'Kiểm định Independent T-test: So sánh trung bình hai nhóm',
        title_en: 'Independent T-test: Comparing Means Between Two Groups',
        category: 'Comparison Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        items: [
            {
                h2_vi: '1. Điều kiện sử dụng',
                h2_en: '1. Usage Conditions',
                content_vi: 'Dùng để so sánh giá trị trung bình giữa hai nhóm độc lập (ví dụ Nam vs Nữ) về một biến định lượng nào đó.',
                content_en: 'Used to compare the average values between two independent groups (e.g., Male vs Female) on a quantitative variable.'
            }
        ]
    },
    'one-way-anova-post-hoc': {
        title_vi: 'Phân tích ANOVA và kiểm định Post-hoc (Bonferroni, Tukey)',
        title_en: 'One-way ANOVA and Post-hoc Tests (Bonferroni, Tukey)',
        category: 'Comparison Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        items: [
            {
                h2_vi: '1. Phép thử ANOVA',
                h2_en: '1. ANOVA Analysis',
                content_vi: 'Dùng khi bạn muốn so sánh từ 3 nhóm trở lên (ví dụ: trình độ học vấn Đại học, Thạc sĩ, Tiến sĩ).',
                content_en: 'Use ANOVA when comparing 3 or more groups (e.g., Education: Bachelor, Master, PhD).'
            }
        ]
    },
    'pearson-correlation-analysis': {
        title_vi: 'Tương quan Pearson: Đo lường sức mạnh mối liên hệ',
        title_en: 'Pearson Correlation: Measuring Relationship Strength',
        category: 'Relationship Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        items: [
            {
                h2_vi: '1. Hệ số tương quan r',
                h2_en: '1. Correlation Coefficient r',
                content_vi: 'Giá trị r nằm từ -1 đến 1. Dấu (+) là tương quan thuận, dấu (-) là tương quan nghịch.',
                content_en: 'r values range from -1 to 1. Positive (+) indicates a direct correlation, and negative (-) indicates an inverse correlation.'
            }
        ]
    },
    'chi-square-test-independence': {
        title_vi: 'Kiểm định Chi-square: Phân tích mối liên hệ biến định danh',
        title_en: 'Chi-square Test: Analyzing Categorical Relationships',
        category: 'Categorical Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        items: [
            {
                h2_vi: '1. Ứng dụng',
                h2_en: '1. Applications',
                content_vi: 'Dùng để kiểm tra mối quan hệ giữa hai biến định tính (ví dụ: Nghề nghiệp có liên quan đến việc chọn loại sản phẩm hay không).',
                content_en: 'Used to test the relationship between two qualitative variables (e.g., Is occupation related to product choice?).'
            }
        ]
    },
    'mediation-analysis-sobel-test': {
        title_vi: 'Phân tích biến trung gian (Mediation): Mô hình Baron & Kenny',
        title_en: 'Mediation Analysis: Baron & Kenny Model',
        category: 'Advanced Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        items: [
            {
                h2_vi: '1. Định nghĩa Biến trung gian',
                h2_en: '1. Defining Mediator Variables',
                content_vi: 'Biến trung gian giải thích tại sao một biến độc lập ảnh hưởng đến biến phụ thuộc.',
                content_en: 'A mediator explains the mechanism through which an independent variable affects a dependent variable.'
            }
        ]
    },
    'data-cleaning-outliers-detection': {
        title_vi: 'Làm sạch dữ liệu và xử lý giá trị ngoại lai (Outliers)',
        title_en: 'Data Cleaning and Outliers Detection (Z-Score & Boxplot)',
        category: 'Preliminary Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        items: [
            {
                h2_vi: '1. Tại sao cần xử lý Outliers?',
                h2_en: '1. Why Handle Outliers?',
                content_vi: 'Giá trị ngoại lai có thể làm sai lệch kết quả hồi quy và các phép kiểm định tham số nếu không được xử lý.',
                content_en: 'Outliers can skew regression results and parametric tests if left unhandled.'
            }
        ]
    },
    'sem-cfa-structural-modeling': {
        title_vi: 'Mô hình cấu trúc tuyến tính (SEM) và CFA: Đỉnh cao nghiên cứu',
        title_en: 'Structural Equation Modeling (SEM) & CFA: Expert Guide',
        category: 'Advanced Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        items: [
            {
                h2_vi: '1. CFA và SEM là gì?',
                h2_en: '1. What are CFA & SEM?',
                content_vi: 'CFA (Phân tích nhân tố khẳng định) dùng để kiểm định mức độ phù hợp của thang đo với dữ liệu thực tế. SEM là sự kết hợp giữa EFA và Hồi quy đa biến, cho phép kiểm định toàn bộ mô hình lý thuyết cùng lúc.',
                content_en: 'CFA (Confirmatory Factor Analysis) tests how well your scale fits the actual data. SEM combines EFA and Multiple Regression, allowing for simultaneous testing of the entire theoretical model.'
            },
            {
                h2_vi: '2. Các chỉ số độ phù hợp (Model Fit)',
                h2_en: '2. Model Fit Indices',
                content_vi: 'Các chỉ số phổ biến bao gồm:\n- Chi-square/df < 3 (hoặc 5)\n- GFI, CFI, TLI > 0.9\n- RMSEA < 0.08\nP-value của kiểm định Chi-square nên > 0.05, tuy nhiên với mẫu lớn ngưỡng này thường bị bỏ qua.',
                content_en: 'Common indices include:\n- Chi-square/df < 3 (or 5)\n- GFI, CFI, TLI > 0.9\n- RMSEA < 0.08\nChi-square p-value should ideally be > 0.05, though this is often relaxed for large samples.'
            }
        ]
    }
};

export default function ArticlePage({ params }: { params: { slug: string } }) {
    const [locale, setLocale] = useState<Locale>('vi');
    const isVi = locale === 'vi';
    const slug = params.slug;
    const article = articleData[slug as keyof typeof articleData] || articleData['cronbach-alpha'];

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Header />
            
            <main className="pt-32 pb-24">
                {/* Article Header */}
                <header className="container mx-auto px-6 max-w-4xl mb-12">
                    <Link href="/knowledge" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm mb-10 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {isVi ? 'Quay lại thư viện' : 'Back to library'}
                    </Link>
                    
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                            {article.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5" />
                            <span>10 min read</span>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-8 tracking-tight">
                        {isVi ? article.title_vi : article.title_en}
                    </h1>
                    
                    <div className="flex items-center justify-between py-8 border-y border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{article.author}</p>
                                <p className="text-xs text-slate-400 font-medium">{article.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-indigo-600">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-indigo-600">
                                <Bookmark className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <article className="container mx-auto px-6 max-w-4xl">
                    <div className="prose prose-slate max-w-none prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg prose-p:font-light">
                        {article.items.map((section, idx) => (
                            <div key={idx} className="mb-14">
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight">
                                    {isVi ? section.h2_vi : section.h2_en}
                                </h2>
                                <p className="whitespace-pre-line">
                                    {isVi ? section.content_vi : section.content_en}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    {/* Professional Tip Box */}
                    <div className="bg-indigo-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden my-16">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <CheckCircle2 className="w-32 h-32 rotate-12" />
                        </div>
                        <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-indigo-400" />
                            {isVi ? 'Lời khuyên từ chuyên gia' : 'Expert Insights'}
                        </h4>
                        <p className="text-indigo-100 text-lg font-light leading-relaxed mb-8">
                            {isVi 
                                ? 'Khi chạy Cronbach\'s Alpha trên ncsStat, hãy luôn chú ý đến mục "Alpha if Item Deleted". Nếu việc xóa một biến làm tăng đáng kể hệ số Alpha tổng, đó là tín hiệu cho thấy biến đó không thực sự nhất quán với nhóm.' 
                                : 'When running Cronbach\'s Alpha on ncsStat, always pay attention to the "Alpha if Item Deleted" section. If deleting a variable significantly increases the overall Alpha, it is a sign that the variable is not consistent with the group.'}
                        </p>
                        <Link href="/analyze" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl">
                            {isVi ? 'Thực hành phân tích ngay' : 'Analyze Now'}
                            <TrendingUp className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </article>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
