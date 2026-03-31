'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    Search, BookOpen, ChevronRight, Layout, Database, 
    TrendingUp, ShieldCheck, Microscope, Layers, Brain,
    Sparkles, ArrowUpRight, Clock, Star, Info, Target, Activity, Network
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';
import { motion } from 'framer-motion';
import Link from 'next/link';

const articles = [
    {
        id: 'cronbach-alpha',
        title_vi: 'Kiểm định độ tin cậy Cronbach\'s Alpha: Hướng dẫn từ A-Z',
        title_en: 'Cronbach\'s Alpha Reliability Test: A-Z Guide',
        excerpt_vi: 'Tìm hiểu cách đánh giá tính nhất quán nội tại của thang đo nghiên cứu theo tiêu chuẩn học thuật của Hair et al.',
        excerpt_en: 'Learn how to evaluate the internal consistency of research scales according to Hair et al. academic standards.',
        category: 'Preliminary Analysis',
        readTime: '8 min',
        icon: ShieldCheck,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50'
    },
    {
        id: 'efa-factor-analysis',
        title_vi: 'Phân tích nhân tố khám phá (EFA): Khi nào cần xoay nhân tố?',
        title_en: 'Exploratory Factor Analysis (EFA): When to Rotate Factors?',
        excerpt_vi: 'Khám phá cấu trúc ẩn của dữ liệu và cách tối ưu hóa các nhóm nhân tố bằng phương pháp Varimax và Promax.',
        excerpt_en: 'Explore hidden data structures and how to optimize factor groups using Varimax and Promax methods.',
        category: 'Factor Analysis',
        readTime: '12 min',
        icon: Layers,
        color: 'text-indigo-500',
        bg: 'bg-indigo-50'
    },
    {
        id: 'regression-vif-multicollinearity',
        title_vi: 'Hồi quy đa biến và kiểm tra Đa cộng tuyến (VIF)',
        title_en: 'Multiple Regression and Multicollinearity (VIF) Check',
        excerpt_vi: 'Cách đọc hiểu các chỉ số VIF, R-Square và hệ số Beta chuẩn hóa trong mô hình tác động đa biến.',
        excerpt_en: 'How to interpret VIF, R-Square, and standardized Beta coefficients in multivariate impact models.',
        category: 'Impact Analysis',
        readTime: '10 min',
        icon: TrendingUp,
        color: 'text-orange-500',
        bg: 'bg-orange-50'
    },
    {
        id: 'descriptive-statistics-interpretation',
        title_vi: 'Thống kê mô tả: Cách trình bày Mean, Std. Deviation chuẩn APA',
        title_en: 'Descriptive Statistics: Presenting Mean & Std. Deviation in APA',
        excerpt_vi: 'Hướng dẫn chi tiết cách báo cáo các chỉ số xu hướng trung tâm và độ phân tán của dữ liệu khảo sát.',
        excerpt_en: 'Detailed guide on reporting central tendency and dispersion metrics for survey data.',
        category: 'Preliminary Analysis',
        readTime: '6 min',
        icon: Microscope,
        color: 'text-blue-500',
        bg: 'bg-blue-50'
    },
    {
        id: 'independent-t-test-guide',
        title_vi: 'Kiểm định Independent T-test: So sánh trung bình hai nhóm',
        title_en: 'Independent T-test: Comparing Means Between Two Groups',
        excerpt_vi: 'Phân tích sự khác biệt về giới tính, khu vực hoặc các biến định danh 2 nhóm trong nghiên cứu.',
        excerpt_en: 'Analyzing differences in gender, region, or 2-group categorical variables in research.',
        category: 'Comparison Analysis',
        readTime: '7 min',
        icon: Target,
        color: 'text-rose-500',
        bg: 'bg-rose-50'
    },
    {
        id: 'one-way-anova-post-hoc',
        title_vi: 'Phân tích ANOVA và kiểm định Post-hoc (Bonferroni, Tukey)',
        title_en: 'One-way ANOVA and Post-hoc Tests (Bonferroni, Tukey)',
        excerpt_vi: 'Khi nào cần dùng ANOVA thay cho T-test? Cách đọc bảng so sánh cặp (Multiple Comparisons).',
        excerpt_en: 'When to use ANOVA over T-test? How to interpret Multiple Comparisons tables.',
        category: 'Comparison Analysis',
        readTime: '15 min',
        icon: Database,
        color: 'text-cyan-500',
        bg: 'bg-cyan-50'
    },
    {
        id: 'pearson-correlation-analysis',
        title_vi: 'Tương quan Pearson: Đo lường sức mạnh mối liên hệ',
        title_en: 'Pearson Correlation: Measuring Relationship Strength',
        excerpt_vi: 'Phân biệt giữa tương quan (Correlation) và hồi quy (Regression). Ý nghĩa của hệ số r.',
        excerpt_en: 'Distinguishing between Correlation and Regression. Significance of the r coefficient.',
        category: 'Relationship Analysis',
        readTime: '9 min',
        icon: Sparkles,
        color: 'text-purple-500',
        bg: 'bg-purple-50'
    },
    {
        id: 'chi-square-test-independence',
        title_vi: 'Kiểm định Chi-square: Phân tích mối liên hệ biến định danh',
        title_en: 'Chi-square Test: Analyzing Categorical Relationships',
        excerpt_vi: 'Kiểm tra xem hai biến định tính có độc lập với nhau hay không bằng phép thử Chi-bình phương.',
        excerpt_en: 'Testing whether two categorical variables are independent using the Chi-square test.',
        category: 'Categorical Analysis',
        readTime: '8 min',
        icon: Activity,
        color: 'text-teal-500',
        bg: 'bg-teal-50'
    },
    {
        id: 'mediation-analysis-sobel-test',
        title_vi: 'Phân tích biến trung gian (Mediation): Mô hình Baron & Kenny',
        title_en: 'Mediation Analysis: Baron & Kenny Model',
        excerpt_vi: 'Tìm hiểu cơ chế tác động gián tiếp giữa các biến trong mô hình nghiên cứu phức tạp.',
        excerpt_en: 'Understanding indirect impact mechanisms between variables in complex research models.',
        category: 'Advanced Analysis',
        readTime: '18 min',
        icon: Brain,
        color: 'text-pink-500',
        bg: 'bg-pink-50'
    },
    {
        id: 'data-cleaning-outliers-detection',
        title_vi: 'Làm sạch dữ liệu và xử lý giá trị ngoại lai (Outliers)',
        title_en: 'Data Cleaning and Outliers Detection (Z-Score & Boxplot)',
        excerpt_vi: 'Các bước chuẩn bị dữ liệu thô trước khi đưa vào phân tích chính để tránh sai lệch kết quả.',
        excerpt_en: 'Steps to prepare raw data before main analysis to avoid biased results.',
        category: 'Preliminary Analysis',
        readTime: '12 min',
        icon: Info,
        color: 'text-slate-500',
        bg: 'bg-slate-100'
    },
    {
        id: 'sem-cfa-structural-modeling',
        title_vi: 'Mô hình cấu trúc tuyến tính (SEM) và CFA: Đỉnh cao nghiên cứu',
        title_en: 'Structural Equation Modeling (SEM) & CFA: Research Standard',
        excerpt_vi: 'Tìm hiểu cách kiểm định mô hình lý thuyết phức tạp và các chỉ số độ phù hợp (Fit Indices) như GFI, CFI, RMSEA.',
        excerpt_en: 'Learn how to test complex theoretical models and Fit Indices like GFI, CFI, RMSEA.',
        category: 'Advanced Analysis',
        readTime: '25 min',
        icon: Network,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
    }
];

export default function KnowledgeBasePage() {
    const [locale, setLocale] = useState<Locale>('vi');
    const [searchQuery, setSearchQuery] = useState('');
    const isVi = locale === 'vi';

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    const filteredArticles = useMemo(() => {
        return articles.filter(art => 
            (isVi ? art.title_vi : art.title_en).toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, isVi]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Header />
            
            {/* Hero Section */}
            <div className="bg-slate-900 text-white pt-32 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black mb-6 uppercase tracking-widest border border-indigo-500/30">
                            <Brain className="w-3.5 h-3.5" />
                            <span>{isVi ? 'HỌC THUẬT & PHÉP TÍNH' : 'ACADEMIC & ALGORITHMS'}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                            {isVi ? 'Thư viện Tri thức Chuyên sâu' : 'Advanced Knowledge Hub'}
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 font-light">
                            {isVi 
                                ? 'Khám phá các giải thích chi tiết về phương pháp nghiên cứu, thuật toán R-Statistics và cách đọc hiểu kết quả phân tích chuẩn SEO học thuật.'
                                : 'Explore detailed explanations of research methods, R-Statistics algorithms, and how to interpret academic analysis results.'}
                        </p>
                        
                        {/* Search Bar */}
                        <div className="relative group max-w-2xl">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                                type="text"
                                placeholder={isVi ? 'Tìm kiếm chủ đề, thuật toán, phép tính...' : 'Search topics, algorithms, methods...'}
                                className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-slate-500 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Articles Grid */}
            <main className="container mx-auto px-6 max-w-6xl -mt-10 relative z-20 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArticles.map((art, idx) => (
                        <Link key={art.id} href={`/knowledge/${art.id}`} className="block">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all group cursor-pointer flex flex-col h-full"
                            >
                                <div className="p-8 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-14 h-14 ${art.bg} rounded-2xl flex items-center justify-center shadow-sm`}>
                                            <art.icon className={`w-7 h-7 ${art.color}`} />
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{art.readTime} read</span>
                                        </div>
                                    </div>
                                    
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 px-2 py-0.5 bg-indigo-50 rounded-md w-fit">
                                        {art.category}
                                    </span>
                                    
                                    <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                                        {isVi ? art.title_vi : art.title_en}
                                    </h3>
                                    
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 font-light line-clamp-3">
                                        {isVi ? art.excerpt_vi : art.excerpt_en}
                                    </p>
                                    
                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                            {isVi ? 'Đọc chi tiết' : 'Read more'}
                                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {filteredArticles.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                        <Info className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-slate-900 mb-2">
                            {isVi ? 'Không tìm thấy bài viết' : 'No articles found'}
                        </h3>
                        <p className="text-slate-500">
                            {isVi ? 'Thử tìm kiếm với từ khóa khác hoặc danh mục khác.' : 'Try searching with different keywords or categories.'}
                        </p>
                    </div>
                )}
                
                {/* CTA / Contribution Section */}
                <div className="mt-24 p-12 bg-indigo-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-indigo-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
                    <div className="max-w-xl relative z-10">
                        <h2 className="text-3xl font-black mb-4 leading-tight">
                            {isVi ? 'Bạn muốn đóng góp kiến thức?' : 'Want to contribute knowledge?'}
                        </h2>
                        <p className="text-indigo-200 text-lg font-light leading-relaxed">
                            {isVi 
                                ? 'Chúng tôi luôn hoan nghênh những chuyên gia phân tích dữ liệu cùng xây dựng thư viện tri thức học thuật chuẩn xác cho cộng đồng.'
                                : 'We always welcome data analysis experts to build a precise academic knowledge library for the community.'}
                        </p>
                    </div>
                    <button className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-black hover:bg-slate-100 transition-all shadow-xl whitespace-nowrap relative z-10 uppercase tracking-widest text-sm">
                        {isVi ? 'LIÊN HỆ ĐÓNG GÓP' : 'CONTACT US'}
                    </button>
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
