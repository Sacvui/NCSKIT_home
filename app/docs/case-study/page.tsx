'use client';

import React, { useState, useEffect } from 'react';
import { 
    Workflow, CheckCircle2, Sparkles, TrendingUp, BarChart2, Shield, GitCompare, Layers, FileText, Bookmark, GraduationCap, Microscope
} from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

export default function CaseStudyPage() {
    const [locale, setLocale] = useState<Locale>('vi');

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    const isVi = locale === 'vi';

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            <div className="container mx-auto px-4 max-w-5xl pt-16">
                <div className="text-center mb-20">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        {t(locale, 'docs.casestudy.title')}
                    </h1>
                    <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
                        {t(locale, 'docs.casestudy.subtitle')}
                    </p>
                </div>

                {/* Scenario Header */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Microscope className="w-48 h-48" />
                    </div>
                    <div className="relative z-10">
                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-widest rounded-full mb-6 inline-block border border-indigo-100">Economics Model</span>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 underline decoration-indigo-500 decoration-4 underline-offset-8">Kịch bản: Các yếu tố ảnh hưởng đến Ý định sử dụng Ngân hàng số</h2>
                        <p className="text-slate-600 leading-relaxed max-w-2xl mb-8">
                            Nghiên cứu này vận dụng mô hình chấp nhận công nghệ (TAM) kết hợp với các yếu tố Niềm tin và Rủi ro cảm nhận để giải thích hành vi người tiêu dùng trong lĩnh vực tài chính tại Việt Nam.
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                            <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg"><Bookmark className="w-4 h-4" /> 320 Quant Sample</span>
                            <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg"><Shield className="w-4 h-4" /> 5-point Likert Scale</span>
                            <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg"><GitCompare className="w-4 h-4" /> PLS-SEM Analysis</span>
                        </div>
                    </div>
                </div>

                {/* Vertical Workflow */}
                <div className="relative border-l-2 border-slate-200 ml-4 md:ml-12 pl-10 space-y-16 mb-24">
                    {/* Phase 1 */}
                    <div className="relative">
                        <div className="absolute -left-[53px] w-6 h-6 rounded-full bg-slate-900 border-4 border-white shadow-md"></div>
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:translate-x-2 transition-transform duration-300">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Giai đoạn 1: Sơ chế và Thống kê mô tả</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Kiểm tra ngoại lệ (Outliers) và sự thiếu hụt dữ liệu (Missing Values). Trình bày cơ cấu mẫu về độ tuổi, thu nhập và trình độ học vấn.
                            </p>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Chỉ số báo cáo chính:</span>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-600 rounded">Mean & S.D</span>
                                    <span className="px-2 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-600 rounded">Frequency Table</span>
                                    <span className="px-2 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-600 rounded">Demographics Plot</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="relative">
                        <div className="absolute -left-[53px] w-6 h-6 rounded-full bg-slate-900 border-4 border-white shadow-md"></div>
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:translate-x-2 transition-transform duration-300">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Giai đoạn 2: Đánh giá độ tin cậy và Kiểm định hội tụ</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Chạy Cronbach's Alpha và C.R cho từng nhân tố (Cảm nhận hữu ích, Rủi ro...). Kiểm tra hệ số tải ngoài (Outer Loadings) để đảm bảo các biến quan sát đo lường đúng khái niệm.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <p className="text-[10px] font-black text-emerald-700 uppercase mb-2">Đạt yêu cầu:</p>
                                    <ul className="text-[11px] text-emerald-800 space-y-1 font-bold">
                                        <li>Alpha & C.R &gt; 0.70</li>
                                        <li>Outer Loadings &gt; 0.708</li>
                                        <li>AVE &gt; 0.50</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <p className="text-[10px] font-black text-amber-700 uppercase mb-2">Lưu ý loại biến:</p>
                                    <p className="text-[11px] text-amber-800 font-medium">Loại bỏ các item có hệ số tải &lt; 0.40 hoặc ảnh hưởng xấu đến AVE.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="relative">
                        <div className="absolute -left-[53px] w-6 h-6 rounded-full bg-slate-900 border-4 border-white shadow-md"></div>
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:translate-x-2 transition-transform duration-300">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Giai đoạn 3: Kiểm định tính phân biệt (HTMT)</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Chứng minh các khái niệm nghiên cứu không bị chồng lấn. Sử dụng ma trận HTMT (Heterotrait-Monotrait Ratio).
                            </p>
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <p className="text-[11px] text-indigo-700 font-bold italic leading-relaxed">
                                    "Chỉ số HTMT giữa Cảm nhận rủi ro và Ý định sử dụng đạt 0.76 (dưới ngưỡng 0.85), khẳng định tính phân biệt giữa hai khái niệm này."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Phase 4 */}
                    <div className="relative">
                        <div className="absolute -left-[53px] w-6 h-6 rounded-full bg-slate-900 border-4 border-white shadow-md"></div>
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:translate-x-2 transition-transform duration-300">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Giai đoạn 4: Kiểm định Giả thuyết và Phân tích Cấu trúc</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Phân tích Path Coefficients thông qua kỹ thuật Bootstrapping (5000 lần lặp). Kiểm tra R-square để đánh giá mức độ giải thích của mô hình.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex-1 p-4 bg-slate-900 rounded-2xl text-white">
                                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-2">Kỳ vọng kết quả (Hypothesis):</p>
                                    <p className="text-xs font-bold underline decoration-indigo-400 underline-offset-4 mb-2">H1: Hữu ích -&gt; Ý định</p>
                                    <p className="text-[11px] text-slate-400">Beta = 0.45; p &lt; 0.001</p>
                                    <p className="text-[10px] text-emerald-400 font-bold mt-2">Chấp nhận giả thuyết (Supported)</p>
                                </div>
                                <div className="flex-1 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-4">Năng lực giải thích:</p>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl font-black text-slate-800">42%</div>
                                        <p className="text-[10px] text-slate-500 leading-tight">Biến thiên của Ý định sử dụng được giải thích bởi mô hình.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Reporting Tips */}
                <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <FileText className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 italic text-indigo-400">
                            <GraduationCap className="w-8 h-8" />
                            Hướng dẫn trình bày trong Luận văn / Bài báo
                        </h3>
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    Trình bày kết quả đánh giá mô hình đo lường trước (Độ tin cậy, Giá trị hội tụ, Giá trị phân biệt), sau đó mới trình bày kết quả mô hình cấu trúc.
                                </p>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    Sử dụng đồ thị Path Diagram xuất ra từ hệ thống ncsStat để minh họa trực quan các hệ số tác động và mức ý nghĩa.
                                </p>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    Đối với các biến trung gian, hãy báo cáo cụ thể Tác động trực tiếp (Direct Effect), Tác động gián tiếp (Indirect Effect) và Tổng tác động (Total Effect).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
