'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    Microscope, Shield, Grid3x3, TrendingUp, BarChart2, Info, GraduationCap, Scale, Cpu, FileCheck
} from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

export default function TheoryPage() {
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
                        {t(locale, 'docs.theory.title')}
                    </h1>
                    <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
                        {t(locale, 'docs.theory.subtitle')}
                    </p>
                </div>

                <div className="space-y-24">
                    {/* Measurement Model Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-10 pb-4 border-b border-slate-200">
                            <Scale className="w-8 h-8 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-slate-900">1. Đánh giá Mô hình đo lường (Measurement Model)</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-emerald-600" />
                                    Độ tin cậy nhất quán nội tại
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    Sử dụng hệ số Cronbach's Alpha và C.R (Composite Reliability). Trong các nghiên cứu hiện đại, C.R được ưu tiên vì không bị ảnh hưởng bởi số lượng câu hỏi.
                                </p>
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-emerald-700">Ngưỡng chấp nhận:</span>
                                    <span className="text-sm font-black text-emerald-800 tracking-wider"> &gt; 0.70</span>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Microscope className="w-5 h-5 text-indigo-600" />
                                    Giá trị hội tụ (AVE)
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    AVE (Average Variance Extracted) đo lường mức độ biến thiên mà nhân tố giải thích được từ các biến quan sát. AVE thấp cho thấy các câu hỏi chưa phản ánh tốt nhân tố.
                                </p>
                                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-indigo-700">Ngưỡng chấp nhận:</span>
                                    <span className="text-sm font-black text-indigo-800 tracking-wider"> &gt; 0.50</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Grid3x3 className="w-5 h-5 text-purple-600" />
                                Giá trị phân biệt (Discriminant Validity)
                            </h3>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div>
                                    <p className="text-sm font-bold text-slate-700 mb-3 underline decoration-purple-200 underline-offset-4">Chỉ số HTMT (Heterotrait-Monotrait)</p>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Tiêu chuẩn nghiêm ngặt nhất hiện nay. Đo lường tỷ lệ tương quan giữa các nhân tố so với tương quan nội bộ.
                                    </p>
                                    <div className="mt-4 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded inline-block">Đạt: HTMT &lt; 0.85 hoặc 0.90</div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700 mb-3 underline decoration-purple-200 underline-offset-4">Fornell-Larcker Criterion</p>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Căn bậc hai của AVE của mỗi nhân tố phải lớn hơn tương quan giữa nhân tố đó với bất kỳ nhân tố nào khác.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Structural Model Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-10 pb-4 border-b border-slate-200">
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                            <h2 className="text-2xl font-bold text-slate-900">2. Đánh giá Mô hình cấu trúc (Structural Model)</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-110"></div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 relative z-10">R-Square (R²)</h3>
                                <p className="text-slate-500 text-xs leading-relaxed mb-6 relative z-10">
                                    Đo lường năng lực giải thích của mô hình. Trong khoa học xã hội, R² trên 0.26 được coi là mức ảnh hưởng lớn.
                                </p>
                                <div className="text-[10px] font-bold text-blue-700 uppercase tracking-tighter bg-blue-50 px-2 py-1 rounded inline-block">Predictive Accuracy</div>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 -mr-8 -mt-8 rounded-full"></div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 relative z-10">f-Square (f²)</h3>
                                <p className="text-slate-500 text-xs leading-relaxed mb-6 relative z-10">
                                    Kích thước tác động. Giúp xác định vai trò của từng biến độc lập trong việc đóng góp vào R² của biến phụ thuộc.
                                </p>
                                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter bg-emerald-50 px-2 py-1 rounded inline-block">Effect Size</div>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-400 transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 -mr-8 -mt-8 rounded-full"></div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 relative z-10">Q-Square (Q²)</h3>
                                <p className="text-slate-500 text-xs leading-relaxed mb-4 relative z-10">
                                    Khả năng dự báo ngoài mẫu (Predictive Relevance). Được tính toán thông qua kỹ thuật Blindfolding.
                                </p>
                                <div className="text-[10px] font-bold text-purple-700 uppercase tracking-tighter bg-purple-50 px-2 py-1 rounded inline-block">Predictive Relevance</div>
                            </div>
                        </div>

                        <div className="mt-10 bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <TrendingUp className="w-48 h-48" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <Cpu className="w-6 h-6 text-indigo-400" />
                                    Tác động Gián tiếp và Trung gian
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-2xl">
                                    Hệ thống ncsStat hỗ trợ kiểm định trung gian thông qua phương pháp Bootstrapping. Để kết luận về biến trung gian, cần kiểm tra khoảng tin cậy (Confidence Interval). Nếu khoảng tin cậy không chứa giá trị 0, tác động trung gian có ý nghĩa thống kê.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-indigo-300">Mediation Analysis</div>
                                    <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-indigo-300">Bootstrapping (5000 samples)</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Statistical Interpretation Section */}
                    <section>
                        <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <Info className="w-6 h-6 text-indigo-600" />
                                        Mức ý nghĩa thống kê (Sig.)
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        p-value xác định xác suất của một phát hiện đạt được là do ngẫu nhiên. Trong nghiên cứu kinh tế - xã hội, ngưỡng phổ biến là 5%.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-200">
                                            <span className="text-xs font-bold text-slate-500">* p &lt; 0.05</span>
                                            <span className="text-xs text-indigo-700 font-black">Ý nghĩa 95%</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-200">
                                            <span className="text-xs font-bold text-slate-500">** p &lt; 0.01</span>
                                            <span className="text-xs text-indigo-700 font-black">Ý nghĩa 99%</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-200">
                                            <span className="text-xs font-bold text-slate-500">*** p &lt; 0.001</span>
                                            <span className="text-xs text-indigo-700 font-black">Ý nghĩa 99.9%</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <FileCheck className="w-6 h-6 text-indigo-600" />
                                        Hệ số Beta (Path Coefficients)
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        Biểu thị mức độ thay đổi của biến phụ thuộc khi biến độc lập thay đổi một đơn vị. Beta có thể đạt giá trị dương (+) hoặc âm (-).
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2"></div>
                                            <p className="text-slate-500 text-sm italic">Beta dương: Tác động cùng chiều (A tăng leads to B tăng).</p>
                                        </li>
                                        <li className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2"></div>
                                            <p className="text-slate-500 text-sm italic">Beta âm: Tác động ngược chiều (A tăng leads to B giảm).</p>
                                        </li>
                                        <li className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2"></div>
                                            <p className="text-slate-500 text-sm italic">Beta chuẩn hóa: Dùng để so sánh cường độ tác động giữa các biến khác đơn vị đo.</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Bottom CTA */}
                <div className="mt-24 border-t border-slate-200 pt-16 flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                        <GraduationCap className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="text-center max-w-2xl px-4">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight underline decoration-indigo-500 decoration-4 underline-offset-8">Kiến thức là nền tảng của công bố</h2>
                        <p className="text-slate-500 text-lg leading-relaxed mb-10">
                            Việc hiểu sâu các chỉ số trên không chỉ giúp bài nghiên cứu của bạn vượt qua vòng thẩm định mà còn khẳng định uy tín khoa học của nhà nghiên cứu.
                        </p>
                        <Link href="/docs/case-study" className="inline-flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200">
                            Xem Kịch bản Nghiên cứu
                            <TrendingUp className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
