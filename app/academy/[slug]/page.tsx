'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import { getAcademyResources } from '@/lib/services/academy';
import { ArrowLeft, BookOpen, Layers, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function AcademyDetail(props: { params: Promise<{ slug: string }> }) {
    const params = React.use(props.params);
    const router = useRouter();
    const [locale, setLocale] = useState<Locale>('vi');
    const [mounted, setMounted] = useState(false);
    const [resource, setResource] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        setLocale(getStoredLocale());
        
        getAcademyResources().then(res => {
            const found = res.data.find((r: any) => r.slug === params.slug);
            setResource(found);
            setLoading(false);
        });
    }, [params.slug]);

    const isVi = locale === 'vi';

    if (!mounted) return null;

    if (loading) {
        return <div className="min-h-screen bg-slate-50 pt-32 pb-24 text-center">Đang tải dữ liệu...</div>;
    }

    if (!resource) {
        return <div className="min-h-screen bg-slate-50 pt-32 pb-24 text-center">Không tìm thấy tài nguyên.</div>;
    }

    const items = resource.meta_data?.items || [];
    const model = resource.meta_data?.research_model;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
            <Header />
            
            <main className="flex-grow pt-24 md:pt-32 pb-24">
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    
                    {/* Breadcrumbs */}
                    <div className="flex items-center text-sm font-bold text-slate-400 mb-8">
                        <Link href="/academy" className="hover:text-indigo-600 transition-colors">Academy</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-slate-600 truncate">{isVi ? resource.title_vi : (resource.title_en || resource.title_vi)}</span>
                    </div>

                    {/* Header */}
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        
                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                                {isVi ? resource.title_vi : (resource.title_en || resource.title_vi)}
                            </h1>
                            
                            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-8">
                                {isVi ? resource.description_vi : (resource.description_en || resource.description_vi)}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 items-center">
                                {resource.author && (
                                    <div className="px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-600">
                                        Tác giả: {resource.author} {resource.year ? `(${resource.year})` : ''}
                                    </div>
                                )}
                                {resource.category?.map((c: string) => (
                                    <div key={c} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold uppercase tracking-wider">
                                        {c}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Section (for Theory / Methods) */}
                    {(resource.content_vi || resource.content_en || (resource.content_structure && resource.content_structure.length > 0)) && (
                        <div className="prose prose-lg prose-indigo max-w-none bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 mb-10">
                            {/* Legacy string content */}
                            {(resource.content_vi || resource.content_en) && (
                                <ReactMarkdown>
                                    {isVi ? (resource.content_vi || '') : (resource.content_en || resource.content_vi || '')}
                                </ReactMarkdown>
                            )}

                            {/* New content_structure array */}
                            {resource.content_structure?.map((section: any, idx: number) => (
                                <div key={idx} className="mb-8">
                                    {section.h2_vi && (
                                        <h2 className="text-2xl font-bold text-slate-800 mb-4">
                                            {isVi ? section.h2_vi : (section.h2_en || section.h2_vi)}
                                        </h2>
                                    )}
                                    <div className="text-slate-600 leading-relaxed">
                                        {section.is_html ? (
                                            <div dangerouslySetInnerHTML={{ __html: isVi ? (section.content_vi || '') : (section.content_en || section.content_vi || '') }} />
                                        ) : (
                                            <ReactMarkdown>
                                                {isVi ? (section.content_vi || '') : (section.content_en || section.content_vi || '')}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Scale Items Section */}
                    {items.length > 0 && (
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 mb-10">
                            <div className="flex items-center gap-3 mb-8">
                                <Layers className="w-8 h-8 text-emerald-600" />
                                <h2 className="text-2xl font-black text-slate-900">Thang đo chi tiết (Scale Items)</h2>
                            </div>
                            
                            {model && (
                                <div className="mb-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 font-medium text-sm">
                                    <span className="font-bold">Mô hình nghiên cứu: </span> {model}
                                </div>
                            )}

                            <div className="space-y-4">
                                {items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 md:p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all">
                                        <div className="shrink-0 w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl font-black flex items-center justify-center">
                                            {item.code}
                                        </div>
                                        <div className="pt-1">
                                            <p className="text-slate-900 font-bold mb-1">{isVi ? item.text_vi : item.text_en}</p>
                                            {isVi && item.text_en && <p className="text-slate-400 text-sm">{item.text_en}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Next Steps / Analyze Now */}
                    {resource.type === 'scale' && (
                        <div className="text-center bg-indigo-600 rounded-[3rem] p-10 shadow-xl shadow-indigo-200">
                            <h3 className="text-2xl font-black text-white mb-4">Sẵn sàng phân tích dữ liệu?</h3>
                            <p className="text-indigo-100 mb-8 max-w-lg mx-auto">Sử dụng Hệ thống thống kê chuyên sâu ncsStat để kiểm định độ tin cậy và phân tích nhân tố cho bộ thang đo này.</p>
                            <button onClick={() => router.push('/dashboard/analyze')} className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all">
                                Phân tích ngay
                            </button>
                        </div>
                    )}

                </div>
            </main>
            <Footer locale={locale} />
        </div>
    );
}
