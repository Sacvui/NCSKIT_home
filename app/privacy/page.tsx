'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import { ShieldCheck, EyeOff, Server, UserCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
    const [locale, setLocale] = useState<Locale>('vi');
    const isVi = locale === 'vi';

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    const privacySections = [
        {
            icon: EyeOff,
            title_vi: '1. Xử lý Dữ liệu Cục bộ (Client-side Only)',
            title_en: '1. Client-side Data Processing',
            content_vi: 'ncsStat Academy sử dụng công nghệ WebAssembly để chạy R-Engine trực tiếp trong trình duyệt của bạn. Toàn bộ file dữ liệu nghiên cứu (CSV, Excel) KHÔNG bao giờ được tải lên máy chủ của chúng tôi. Dữ liệu này chỉ tồn tại trong bộ nhớ tạm thời của máy tính bạn.',
            content_en: 'ncsStat Academy utilizes WebAssembly technology to run the R-Engine directly within your browser. Your research data files (CSV, Excel) are NEVER uploaded to our servers. This data exists only in your local machine\'s temporary memory.'
        },
        {
            icon: UserCheck,
            title_vi: '2. Thông tin Tài khoản',
            title_en: '2. Account Information',
            content_vi: 'Chúng tôi chỉ thu thập thông tin cơ bản (Tên, Email) thông qua Google OAuth để cung cấp dịch vụ xác thực và lưu trữ các "phiên làm việc" đã mã hóa nếu bạn chọn lưu kết quả trên đám mây.',
            content_en: 'We only collect basic identification (Name, Email) via Google OAuth to provide authentication and store encrypted "analysis sessions" if you choose to cloud-save your results.'
        },
        {
            icon: Lock,
            title_vi: '3. Bảo mật Tuyệt đối',
            title_en: '3. Absolute Security',
            content_vi: 'Cam kết không bao giờ bán, chia sẻ hoặc tiết lộ dữ liệu nghiên cứu của bạn cho bất kỳ bên thứ ba nào. Mục tiêu duy nhất của ncsStat là hỗ trợ học thuật, không phục vụ mục đích thương mại hóa dữ liệu.',
            content_en: 'We promise to never sell, share, or disclose your research data to any third party. ncsStat\'s sole purpose is academic support, not data commercialization.'
        },
        {
            icon: Server,
            title_vi: '4. Lưu trữ Đám mây (Tùy chọn)',
            title_en: '4. Cloud Storage (Optional)',
            content_vi: 'Dữ liệu phiên làm việc được lưu trên Supabase với các tiêu chuẩn bảo mật ngân hàng. Bạn có quyền xóa toàn bộ lịch sử phân tích bất cứ lúc nào thông qua trang Hồ sơ.',
            content_en: 'Session data is stored on Supabase using bank-grade security standards. You have the right to delete your entire analysis history at any time via the Profile page.'
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
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-emerald-50">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Privacy First Architecture</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 underline decoration-emerald-500/30 decoration-8 underline-offset-8">
                            {isVi ? 'Chính sách Bảo mật' : 'Privacy Policy'}
                        </h1>
                        <p className="text-slate-500 font-light text-lg italic">
                            {isVi ? 'Dữ liệu của bạn thuộc về bạn. Mãi mãi.' : 'Your data belongs to you. Forever.'}
                        </p>
                    </motion.div>

                    <div className="space-y-8">
                        {privacySections.map((section, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-200 shadow-sm group hover:border-emerald-200 transition-all"
                            >
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-100 transition-transform group-hover:rotate-6">
                                        <section.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 mb-6">
                                            {isVi ? section.title_vi : section.title_en}
                                        </h2>
                                        <p className="text-lg text-slate-600 leading-relaxed font-light">
                                            {isVi ? section.content_vi : section.content_en}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 p-12 bg-white rounded-[4rem] border border-slate-200 text-center shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-50/50 -z-10"></div>
                        <h3 className="text-2xl font-black text-slate-900 mb-6 italic italic uppercase tracking-widest text-xs opacity-50">Data Sovereignty</h3>
                        <p className="text-slate-500 text-lg font-light leading-relaxed">
                            {isVi ? 'ncsStat Academy cam kết bảo vệ sự riêng tư cho trí tuệ nghiên cứu học thuật của bạn.' : 'ncsStat Academy is committed to protecting the privacy of your intellectual research and insights.'}
                        </p>
                    </div>
                </div>
            </main>
            <Footer locale={locale} />
        </div>
    );
}
