'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    BookOpen, Lightbulb, Workflow, PlayCircle, ChevronRight, 
    ArrowRight, Sparkles, Shield, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

export default function DocsOverviewPage() {
    const router = useRouter();
    const [locale, setLocale] = useState<Locale>('vi');

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    const isVi = locale === 'vi';

    const sections = [
        {
            id: 'theory',
            title: t(locale, 'docs.tabs.theory'),
            subtitle: t(locale, 'docs.theory.subtitle'),
            icon: Lightbulb,
            href: '/docs/theory',
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            description: isVi 
                ? 'Hiểu về p-value, Cronbach Alpha và cách đọc kết quả chuẩn khoa học.' 
                : 'Understand p-value, Cronbach Alpha, and how to interpret scientific results.'
        },
        {
            id: 'case-study',
            title: t(locale, 'docs.tabs.casestudy'),
            subtitle: t(locale, 'docs.casestudy.subtitle'),
            icon: Workflow,
            href: '/docs/case-study',
            color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            description: isVi 
                ? 'Quy trình 5 bước thực hiện một bài nghiên cứu định lượng chuẩn công bố.' 
                : 'A 5-step process for conducting a publication-ready quantitative research paper.'
        },
        {
            id: 'user-guide',
            title: t(locale, 'docs.tabs.userguide'),
            subtitle: t(locale, 'docs.userguide.subtitle'),
            icon: PlayCircle,
            href: '/docs/user-guide',
            color: 'bg-amber-50 text-amber-600 border-amber-100',
            description: isVi 
                ? 'Hướng dẫn chi tiết cách sử dụng các tính năng phân tích trên ncsStat.' 
                : 'Detailed instructions on how to use all ncsStat analysis features.'
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero Header */}
            <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 blur-[120px] rounded-full -mr-64 -mt-64"></div>
                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="bg-indigo-600/20 p-5 rounded-3xl border border-indigo-500/30 shadow-2xl backdrop-blur-sm">
                            <BookOpen className="w-16 h-16 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                                {isVi ? 'Trung tâm Hướng dẫn & Tài liệu' : 'Guidance & Documentation Center'}
                            </h1>
                            <p className="text-slate-400 text-xl max-w-2xl leading-relaxed">
                                {isVi 
                                    ? 'Khám phá kiến thức thống kê, quy trình nghiên cứu chuẩn và hướng dẫn vận hành hệ thống ncsStat.'
                                    : 'Explore statistical knowledge, standard research workflows, and ncsStat system operation guides.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl -mt-10">
                <div className="grid md:grid-cols-3 gap-8">
                    {sections.map((section) => (
                        <Link 
                            key={section.id} 
                            href={section.href}
                            className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border ${section.color} transition-colors group-hover:scale-110 duration-300`}>
                                <section.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                                {section.title}
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                            </h3>
                            <p className="text-slate-400 font-medium text-sm mb-4">{section.subtitle}</p>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                {section.description}
                            </p>
                            <div className="flex items-center text-indigo-600 font-bold text-sm">
                                {isVi ? 'Khám phá ngay' : 'Explore now'}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-24 p-12 bg-white rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Sparkles className="w-64 h-64" />
                    </div>
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 italic">
                            {isVi ? 'Tại sao tài liệu này quan trọng?' : 'Why is this documentation important?'}
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-1">{isVi ? 'Đảm bảo tính khoa học' : 'Ensure Scientific Accuracy'}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Giúp bạn hiểu bản chất của các con số thay vì chỉ chạy tính toán một cách máy móc.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-1">{isVi ? 'Chuẩn hóa quy trình' : 'Standardize Workflow'}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Cung cấp luồng xử lý chuẩn từ khâu làm sạch đến khâu báo cáo, hạn chế sai sót trong Luận văn/ Luận án.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
