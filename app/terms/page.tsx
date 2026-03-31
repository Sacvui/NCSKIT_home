'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import { Shield, Scale, Gavel, AlertTriangle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
    const [locale, setLocale] = useState<Locale>('vi');
    const isVi = locale === 'vi';

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    const sections = [
        {
            icon: Shield,
            title_vi: '1. Chấp nhận Điều khoản',
            title_en: '1. Acceptance of Terms',
            content_vi: 'Bằng việc truy cập hoặc sử dụng ncsStat Academy, bạn đồng ý tuân thủ các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ ngay lập tức.',
            content_en: 'By accessing or using ncsStat Academy, you agree to bound by these Terms. If you disagree with any part of the terms, you may not access the service.'
        },
        {
            icon: AlertTriangle,
            title_vi: '2. Miễn trừ trách nhiệm Thống kê',
            title_en: '2. Statistical Disclaimer',
            content_vi: 'ncsStat cung cấp các thuật toán xử lý dữ liệu (R-Engine) cho mục đích học thuật. Mặc dù chúng tôi nỗ lực đảm bảo độ chính xác 100%, ncsStat không chịu trách nhiệm cho các quyết định, kết luận nghiên cứu hoặc việc bảo vệ luận án dựa trên kết quả từ hệ thống. Người dùng cần kiểm tra lại kết quả trước khi công bố.',
            content_en: 'ncsStat provides data processing algorithms (R-Engine) for academic purposes. While we strive for 100% accuracy, ncsStat is not responsible for research decisions, thesis defenses, or conclusions based on our results. Users must verify outputs before publication.'
        },
        {
            icon: Scale,
            title_vi: '3. Quyền sở hữu Trí tuệ',
            title_en: '3. Intellectual Property',
            content_vi: 'Toàn bộ mã nguồn, thiết kế giao diện và thư viện kiến thức thuộc sở hữu của dự án ncsStat. Bạn có quyền sử dụng kết quả phân tích (Bảng biểu, đồ thị) cho bài nghiên cứu cá nhân nhưng không được phép sao chép cấu trúc phần mềm cho mục đích thương mại.',
            content_en: 'All source code, UI design, and knowledge hub assets are owned by the ncsStat project. You have the right to use generated results (Tables, Charts) for personal research but may not replicate the software structure for commercial gain.'
        },
        {
            icon: FileText,
            title_vi: '4. Giới hạn Sử dụng',
            title_en: '4. Usage Limitations',
            content_vi: 'Hệ thống được thiết kế để xử lý dữ liệu nghiên cứu hợp pháp. Nghiêm cấm việc tấn công, đảo ngược kỹ thuật (Reverse engineering) hoặc sử dụng các công cụ tự động để làm gián đoạn hệ thống R-Engine.',
            content_en: 'The system is designed for legal research data. Attacks, reverse engineering, or the use of automated tools to disrupt the R-Engine system are strictly prohibited.'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Header />
            <main className="pt-24 pb-32">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-6">
                            <Gavel className="w-3.5 h-3.5" />
                            <span>Legal Documents</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 underline decoration-indigo-500/30 decoration-8 underline-offset-8">
                            {isVi ? 'Điều khoản Sử dụng' : 'Terms of Service'}
                        </h1>
                        <p className="text-slate-500 font-light text-lg">
                            {isVi ? 'Cập nhật lần cuối: 31/03/2026' : 'Last Updated: March 31, 2026'}
                        </p>
                    </motion.div>

                    <div className="space-y-8">
                        {sections.map((section, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:bg-indigo-600 transition-colors shadow-xl shadow-slate-100">
                                        <section.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 mb-6 font-sans">
                                            {isVi ? section.title_vi : section.title_en}
                                        </h2>
                                        <p className="text-lg text-slate-600 leading-relaxed font-light whitespace-pre-line">
                                            {isVi ? section.content_vi : section.content_en}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 p-12 bg-indigo-600 rounded-[3.5rem] text-white text-center shadow-2xl shadow-indigo-100">
                        <h3 className="text-2xl font-black mb-6 italic">“Building trust through scientific transparency.”</h3>
                        <p className="text-indigo-100 text-sm font-medium uppercase tracking-widest leading-relaxed">
                            {isVi ? 'Dự án ncsStat Academy dành cho cộng đồng Nghiên cứu sinh' : 'ncsStat Academy Project for the Global Research Community'}
                        </p>
                    </div>
                </div>
            </main>
            <Footer locale={locale} />
        </div>
    );
}
