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
        expert_tip_vi: 'Đừng quá ám ảnh việc đạt Alpha > 0.9. Trong nhiều trường hợp, Alpha quá cao (> 0.95) có thể là dấu hiệu của việc các câu hỏi quá giống nhau (trùng lặp ý), gây lãng phí dữ liệu. Hãy hướng tới ngưỡng 0.7 - 0.9 để thang đo vừa tin cậy vừa có tính phân biệt tốt.',
        expert_tip_en: 'Don\'t be obsessed with Alpha > 0.9. In many cases, an extremely high Alpha (> 0.95) might indicate redundant questions. Aim for 0.7 - 0.9 for a reliable yet non-redundant scale.',
        items: [
            {
                h2_vi: '1. Bản chất của Cronbach\'s Alpha trong nghiên cứu',
                h2_en: '1. The Essence of Cronbach\'s Alpha',
                content_vi: 'Cronbach\'s Alpha là một phép kiểm định thống kê dùng để đo lường tính nhất quán nội tại (internal consistency). Trong các bài nghiên cứu (Thesis/Paper), đây là bước "lọc" đầu tiên để đảm bảo các biến quan sát (items) trong cùng một thang đo thực sự đang đo lường cùng một khái niệm trừu tượng. \n\nNếu Alpha thấp, có nghĩa là các câu hỏi của bạn đang "đá nhau", dẫn đến kết quả phân tích EFA hay Hồi quy sau đó sẽ hoàn toàn vô nghĩa.',
                content_en: 'Cronbach\'s Alpha is a statistical test used to measure internal consistency. In research papers, this is the first "filtering" step to ensure that the observed variables in a scale are truly measuring the same abstract concept.'
            },
            {
                h2_vi: '2. Các ngưỡng giá trị vàng (Academic Standards)',
                h2_en: '2. Standard Gold Thresholds',
                content_vi: 'Dựa trên tiêu chuẩn của Hair et al. (2010), chúng ta có các mốc quan trọng: \n\n• Alpha ≥ 0.8: Thang đo đạt độ tin cậy rất tốt, lý tưởng cho mọi bài công bố quốc tế.\n• 0.7 ≤ Alpha < 0.8: Độ tin cậy tốt, có thể sử dụng bình thường.\n• 0.6 ≤ Alpha < 0.7: Chấp nhận được đối với các nghiên cứu mới.\n• Alpha < 0.6: Loại bỏ thang đo vì không đạt tính nhất quán.',
                content_en: 'Based on Hair et al. (2010), we have these key milestones: \n\n• Alpha ≥ 0.8: Excellent reliability, ideal for international publication.\n• 0.7 ≤ Alpha < 0.8: Good reliability.\n• 0.6 ≤ Alpha < 0.7: Acceptable for exploratory research.\n• Alpha < 0.6: Reject the scale due to poor consistency.'
            }
        ]
    },
    'efa-factor-analysis': {
        title_vi: 'Phân tích nhân tố khám phá (EFA): Khi nào cần xoay nhân tố?',
        title_en: 'Exploratory Factor Analysis (EFA): Complete Guide',
        category: 'Factor Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Nếu dữ liệu của bạn có các nhân tố tương quan mạnh với nhau (> 0.3), hãy ưu tiên dùng phép xoay Promax thay vì Varimax. Promax cho phép các nhân tố không vuông góc, phản ánh đúng thực tế hành vi con người hơn.',
        expert_tip_en: 'If your factors are significantly correlated (> 0.3), prefer Promax rotation over Varimax. Promax allows non-orthogonal factors, which often reflects real human behavior more accurately.',
        items: [
            {
                h2_vi: '1. Mục tiêu cốt lõi của EFA',
                h2_en: '1. Core Objectives of EFA',
                content_vi: 'EFA giúp rút gọn một tập hợp nhiều biến quan sát thành một số ít các nhân tố có ý nghĩa hơn. Tiêu chuẩn quan trọng nhất là KMO (Kaiser-Meyer-Olkin) phải ≥ 0.5 và kiểm định Bartlett phải có Sig < 0.05 để đảm bảo dữ liệu đủ điều kiện phân tích nhân tố.',
                content_en: 'EFA reduces a large set of variables into fewer meaningful factors. KMO must be ≥ 0.5 and Bartlett\'s test p-value < 0.05 to ensure data suitability for factor analysis.'
            }
        ]
    },
    'regression-vif-multicollinearity': {
        title_vi: 'Hồi quy đa biến và kiểm tra Đa cộng tuyến (VIF)',
        title_en: 'Multiple Regression & VIF: Assessing Impact',
        category: 'Impact Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Mặc dù lý thuyết cho phép VIF < 10, nhưng thực tế nghiên cứu quản trị và kinh tế học hiện đại ưu tiên VIF < 2 hoặc 5 để đảm bảo các biến độc lập không "nuốt chửng" lẫn nhau, làm sai lệch hệ số Beta.',
        expert_tip_en: 'While theory allows VIF < 10, modern research in management and economics prefers VIF < 2 or 5 to ensure independent variables do not "overlap" too much, which can bias Beta coefficients.',
        items: [
            {
                h2_vi: '1. Đọc hiểu hệ số Beta chuẩn hóa',
                h2_en: '1. Interpreting Standardized Beta',
                content_vi: 'Hệ số Beta chuẩn hóa giúp bạn so sánh mức độ tác động mạnh/yếu của các biến độc lập lên biến phụ thuộc. Biến nào có Beta (giá trị tuyệt đối) lớn hơn sẽ có ảnh hưởng mạnh hơn trong mô hình.',
                content_en: 'Standardized Beta allows you to compare the relative impact of independent variables on the dependent variable. A higher absolute Beta signifies a stronger influence.'
            }
        ]
    },
    'independent-t-test-guide': {
        title_vi: 'Kiểm định Independent T-test: So sánh giới tính và đặc điểm mẫu',
        title_en: 'Independent T-test Guide: Analyzing Group Differences',
        category: 'Comparison Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Hãy luôn kiểm tra bảng Levene\'s Test trước. Nếu Sig của Levene < 0.05, bạn phải đọc kết quả ở dòng "Equal variances not assumed" để tránh sai số loại I.',
        expert_tip_en: 'Always check Levene\'s Test first. If Levene\'s p-value < 0.05, you must read the "Equal variances not assumed" row to avoid Type I error.',
        items: [
            {
                h2_vi: '1. Ý nghĩa phép thử T-test',
                h2_en: '1. Significance of T-test',
                content_vi: 'Dùng để kiểm định xem liệu sự khác biệt về giá trị trung bình giữa 2 nhóm (ví dụ: Sự hài lòng của nam giới và nữ giới) có ý nghĩa thống kê hay chỉ là do ngẫu nhiên.',
                content_en: 'Used to determine if the mean difference between two groups (e.g., satisfaction for males vs females) is statistically significant or just due to chance.'
            }
        ]
    },
    'one-way-anova-post-hoc': {
        title_vi: 'Phân tích ANOVA và kiểm định Post-hoc chuyên sâu',
        title_en: 'One-way ANOVA & Post-hoc: Comparing Multi-groups',
        category: 'Comparison Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Nếu phương sai không đồng nhất (Sig Levene < 0.05), đừng dùng kiểm định Tukey. Thay vào đó, hãy dùng phép thử Games-Howell trong ncsStat để có kết quả so sánh cặp chính xác nhất.',
        expert_tip_en: 'If variances are not homogeneous (Levene p < 0.05), avoid Tukey. Use Games-Howell test in ncsStat instead for the most accurate pairwise comparisons.',
        items: [
            {
                h2_vi: '1. ANOVA vs T-test',
                h2_en: '1. ANOVA vs T-test',
                content_vi: 'Trong khi T-test chỉ so sánh được 2 nhóm, ANOVA cho phép so sánh từ 3 nhóm trở lên (vd: Độ tuổi 18-25, 26-35, Trên 35) để tìm ra nhóm nào có sự khác biệt thực sự.',
                content_en: 'While T-test compares 2 groups, ANOVA handles 3 or more (e.g., ages 18-25, 26-35, 35+) to identify which specific groups differ.'
            }
        ]
    },
    'pearson-correlation-analysis': {
        title_vi: 'Tương quan Pearson: Bước đệm trước khi chạy Hồi quy',
        title_en: 'Pearson Correlation: Pre-regression Mandatory Step',
        category: 'Relationship Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Tương quan chỉ cho biết mối quan hệ đi cùng nhau, không khẳng định quan hệ nhân quả. Một cặp biến có r = 0.9 không có nghĩa là biến A gây ra biến B, chúng có thể cùng chịu tác động từ một biến C ẩn giấu.',
        expert_tip_en: 'Correlation only indicates a relationship; it does not prove causation. A coefficient r = 0.9 doesn\'t mean A causes B; both might be influenced by a hidden variable C.',
        items: [
            {
                h2_vi: '1. Giải mã hệ số tương quan r',
                h2_en: '1. Decoding Correlation r',
                content_vi: 'Hệ số r dao động từ -1 đến 1. \n• r > 0.7: Tương quan rất mạnh. \n• 0.4 < r < 0.7: Tương quan trung bình. \n• r < 0.3: Tương quan yếu, có khả năng không nên đưa vào mô hình hồi quy.',
                content_en: 'Coefficient r ranges from -1 to 1. r > 0.7 is a strong correlation, 0.4-0.7 is moderate, and < 0.3 is weak (likely unsuitable for regression).'
            }
        ]
    },
    'chi-square-test-independence': {
        title_vi: 'Kiểm định Chi-square: Phân tích sâu Biến định danh',
        title_en: 'Chi-square Test: Categorical Variables Deep Dive',
        category: 'Categorical Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Nếu có hơn 20% số ô trong bảng chéo có tần số kỳ vọng < 5, kết quả Chi-square có thể không tin cậy. Khi đó, hãy dùng kiểm định Fisher\'s Exact Test trong ncsStat.',
        expert_tip_en: 'If >20% of cells have expected frequencies < 5, Chi-square might be unreliable. Use Fisher\'s Exact Test in ncsStat for accurate results.',
        items: [
            {
                h2_vi: '1. Khi nào dùng Chi-sq?',
                h2_en: '1. When to use Chi-sq?',
                content_vi: 'Dùng khi bạn muốn biết liệu Nghề nghiệp (Giáo viên, Bác sĩ, Kinh doanh) có liên quan đến Sở thích mua sắm hay không. Cả hai biến đều là định danh (Nominal).',
                content_en: 'Used to test if Profession (Teacher, Doctor, Business) is related to Shopping preference. Both variables are Nominal.'
            }
        ]
    },
    'mediation-analysis-sobel-test': {
        title_vi: 'Phân tích biến trung gian (Mediation) và kiểm định Sobel',
        title_en: 'Mediation Analysis: The Baron & Kenny Strategy',
        category: 'Advanced Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Hiện nay, giới học thuật quốc tế ưa chuộng phương pháp Bootstrapping của Preacher & Hayes hơn là phép thử Sobel truyền thống vì nó không đòi hỏi giả định phân phối chuẩn.',
        expert_tip_en: 'International scholars now prefer Preacher & Hayes\' Bootstrapping method over the traditional Sobel test as it doesn\'t require normal distribution assumptions.',
        items: [
            {
                h2_vi: '1. Quy trình 4 bước Baron & Kenny',
                h2_en: '1. The 4-step Baron & Kenny Process',
                content_vi: 'Để khẳng định có biến trung gian: 1. Độc lập tác động Phụ thuộc; 2. Độc lập tác động Trung gian; 3. Trung gian tác động Phụ thuộc; 4. Khi có cả 2, mức độ tác động của Độc lập phải giảm xuống.',
                content_en: 'To prove mediation: 1. IV affects DV; 2. IV affects Mediator; 3. Mediator affects DV; 4. When both IV and Med are present, IV\'s impact must decrease.'
            }
        ]
    },
    'data-cleaning-outliers-detection': {
        title_vi: 'Làm sạch dữ liệu và xử lý giá trị ngoại lai (Outliers)',
        title_en: 'Data Cleaning: Handling Outliers for Scientific Accuracy',
        category: 'Preliminary Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Đừng vội xóa bỏ Outlier ngay khi thấy nó. Hãy kiểm tra xem đó là do lỗi nhập liệu hay là một trường hợp đặc biệt thực sự. Đôi khi Outlier lại chính là phát hiện thú vị nhất trong nghiên cứu của bạn!',
        expert_tip_en: 'Don\'t delete outliers immediately. Check if it\'s a typo or a genuine extreme case. Sometimes outliers are the most interesting findings in your research!',
        items: [
            {
                h2_vi: '1. Phương pháp Z-score & Boxplot',
                h2_en: '1. Z-score & Boxplot methods',
                content_vi: 'ncsStat cung cấp biểu đồ Boxplot giúp nhận diện trực quan các điểm nằm ngoài ngưỡng 1.5 IQR. Về mặt số liệu, các điểm có Z-score > 3 hoặc < -3 nên được xem xét kỹ lưỡng.',
                content_en: 'ncsStat provides Boxplots to visually identify points outside the 1.5 IQR range. Statistically, points with Z-score > 3 or < -3 should be closely examined.'
            }
        ]
    },
    'sem-cfa-structural-modeling': {
        title_vi: 'Mô hình cấu trúc tuyến tính (SEM) và CFA: Đỉnh cao nghiên cứu',
        title_en: 'SEM & CFA: High-end Research Standards',
        category: 'Advanced Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Để mô hình SEM có độ tin cậy, kích thước mẫu tối thiểu nên gấp 10 lần số lượng biến quan sát trong mô hình (Quy tắc 10:1 của Hair). Ví dụ mô hình có 20 biến thì cần ít nhất 200 mẫu.',
        expert_tip_en: 'For SEM reliability, your sample size should ideally be at least 10 times the number of observed variables (Hair\'s 10:1 Rule). 20 variables require at least 200 samples.',
        items: [
            {
                h2_vi: '1. Tầm quan trọng của CFA',
                h2_en: '1. The Importance of CFA',
                content_vi: 'CFA là bước bắt buộc trước khi chạy SEM để khẳng định tính đơn hướng, giá trị hội tụ và giá trị phân biệt của các khái niệm trong mô hình.',
                content_en: 'CFA is mandatory before SEM to confirm unidimensionality, convergent validity, and discriminant validity of the constructs.'
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
                    <Link href="/knowledge" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-10 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {isVi ? 'Quay lại thư viện' : 'Back to library'}
                    </Link>
                    
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 shadow-sm">
                            {article.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>15 min read</span>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                        {isVi ? article.title_vi : article.title_en}
                    </h1>
                    
                    <div className="flex items-center justify-between py-10 border-y border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                                <User className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 text-base uppercase tracking-tight leading-none mb-1.5">{article.author}</p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{article.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-3.5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors text-slate-600 hover:text-indigo-600 border border-slate-100">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-3.5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors text-slate-600 hover:text-indigo-600 border border-slate-100">
                                <Bookmark className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <article className="container mx-auto px-6 max-w-4xl">
                    <div className="prose prose-lg prose-slate max-w-none 
                        prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight 
                        prose-p:text-slate-800 prose-p:leading-[1.8] prose-p:text-lg prose-p:font-normal
                        prose-strong:text-indigo-600 prose-strong:font-black">
                        
                        {article.items.map((section, idx) => (
                            <div key={idx} className="mb-16 last:mb-0">
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 border-l-4 border-indigo-600 pl-6 py-1">
                                    {isVi ? section.h2_vi : section.h2_en}
                                </h2>
                                <div className="text-slate-800 leading-[1.8] text-lg lg:text-xl font-normal whitespace-pre-line bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                                    {isVi ? section.content_vi : section.content_en}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Professional Tip Box */}
                    <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden my-24 border border-white/10">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <CheckCircle2 className="w-48 h-48 rotate-12 text-indigo-400" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-2xl font-black mb-6 flex items-center gap-4 text-indigo-400 uppercase tracking-widest">
                                <ShieldCheck className="w-8 h-8" />
                                {isVi ? 'Tư vấn Chuyên gia ncsStat' : 'ncsStat Expert Strategy'}
                            </h4>
                            <p className="text-slate-300 text-xl font-light leading-relaxed mb-10">
                                {isVi ? article.expert_tip_vi : article.expert_tip_en}
                            </p>
                            <Link href="/analyze" className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/50">
                                {isVi ? 'Bắt đầu kiểm định ngay' : 'Start Analyzing Now'}
                                <TrendingUp className="w-5 h-5 ml-1" />
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
