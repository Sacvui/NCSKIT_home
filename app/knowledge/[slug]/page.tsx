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
                h2_vi: '1. Bản chất của Cronbach\'s Alpha trong nghiên cứu',
                h2_en: '1. The Essence of Cronbach\'s Alpha',
                content_vi: 'Cronbach\'s Alpha là một phép kiểm định thống kê dùng để đo lường tính nhất quán nội tại (internal consistency). Trong các bài nghiên cứu (Thesis/Paper), đây là bước "lọc" đầu tiên để đảm bảo các biến quan sát (items) trong cùng một thang đo thực sự đang đo lường cùng một khái niệm trừu tượng. \n\nNếu Alpha thấp, có nghĩa là các câu hỏi của bạn đang "đá nhau", dẫn đến kết quả phân tích EFA hay Hồi quy sau đó sẽ hoàn toàn vô nghĩa.',
                content_en: 'Cronbach\'s Alpha is a statistical test used to measure internal consistency. In research papers, this is the first "filtering" step to ensure that the observed variables in a scale are truly measuring the same abstract concept.'
            },
            {
                h2_vi: '2. Các ngưỡng giá trị vàng (Academic Standards)',
                h2_en: '2. Standard Gold Thresholds',
                content_vi: 'Dựa trên tiêu chuẩn của Hair et al. (2010) và Nunnally & Bernstein (1994), chúng ta có các mốc quan trọng sau: \n\n• Alpha ≥ 0.8: Thang đo đạt độ tin cậy rất tốt, lý tưởng cho mọi bài công bố quốc tế.\n• 0.7 ≤ Alpha < 0.8: Độ tin cậy tốt, có thể sử dụng bình thường.\n• 0.6 ≤ Alpha < 0.7: Chấp nhận được đối với các nghiên cứu mới hoặc thang đo mới phát triển.\n• Alpha < 0.6: Loại bỏ thang đo vì không đạt tính nhất quán.',
                content_en: 'Based on Hair et al. (2010) and Nunnally & Bernstein (1994), we have these key milestones: \n\n• Alpha ≥ 0.8: Excellent reliability, ideal for international publication.\n• 0.7 ≤ Alpha < 0.8: Good reliability.\n• 0.6 ≤ Alpha < 0.7: Acceptable for exploratory research.\n• Alpha < 0.6: Reject the scale due to poor consistency.'
            },
            {
                h2_vi: '3. Phân tích "Hệ số tương quan biến - tổng" (Item-Total Correlation)',
                h2_en: '3. Item-Total Correlation Analysis',
                content_vi: 'Đây là insight quan trọng nhất mà nhiều người thường bỏ qua. Khi chạy ncsStat, bạn cần nhìn vào cột "Corrected Item-Total Correlation". \n\n• Quy tắc: Bất kỳ biến nào có hệ số này < 0.3 thì phải loại bỏ ngay lập tức, dù Alpha tổng có cao đến đâu. \n• Lý do: Biến đó đang lạc lõng và không đóng góp giá trị vào khái niệm chung.',
                content_en: 'This is the most critical insight. When running ncsStat, look at the "Corrected Item-Total Correlation" column. \n\n• Rule: Any variable with a coefficient < 0.3 must be removed immediately, regardless of the total Alpha value.'
            },
            {
                h2_vi: '4. Case Study: Khi nào xóa biến làm tăng Alpha?',
                h2_en: '4. Case Study: Deleting Items to Increase Alpha',
                content_vi: 'Hãy chú ý đến cột "Cronbach\'s Alpha if Item Deleted". Nếu bạn thấy một biến mà khi xóa nó đi, Alpha tổng tăng vọt lên (ví dụ từ 0.65 lên 0.78), thì đó là "biến gây nhiễu". Hãy xóa nó để làm sạch thang đo trước khi tiến hành phân tích EFA.',
                content_en: 'Pay attention to the "Cronbach\'s Alpha if Item Deleted" column. If deleting a variable causes a sharp increase in total Alpha, it is a "noise variable". Remove it to clean your scale before EFA.'
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
                                {isVi 
                                    ? 'Đừng quá ám ảnh việc đạt Alpha > 0.9. Trong nhiều trường hợp, Alpha quá cao (> 0.95) có thể là dấu hiệu của việc các câu hỏi quá giống nhau (trùng lặp ý), gây lãng phí dữ liệu. Hãy hướng tới ngưỡng 0.7 - 0.9 để thang đo vừa tin cậy vừa có tính phân biệt tốt.' 
                                    : 'Don\'t be obsessed with Alpha > 0.9. In many cases, an extremely high Alpha (> 0.95) might indicate redundant questions. Aim for 0.7 - 0.9 for a reliable yet non-redundant scale.'}
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
