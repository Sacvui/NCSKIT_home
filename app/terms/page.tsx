import Link from 'next/link';
import { FileText, Copy, Check, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import { createClient } from '@/utils/supabase/server';

export const metadata = {
    title: 'Điều khoản sử dụng - ncsStat',
    description: 'Điều khoản sử dụng và yêu cầu trích dẫn khi sử dụng ncsStat'
};

export default async function TermsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Header user={user} />

            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại trang chủ
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Điều khoản sử dụng</h1>
                            <p className="text-slate-500">Terms of Service</p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed">
                            Chào mừng bạn đến với <strong>ncsStat</strong> - công cụ phân tích thống kê trực tuyến miễn phí dành cho nghiên cứu sinh và nhà nghiên cứu Việt Nam.
                        </p>

                        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Quyền sử dụng miễn phí</h2>
                        <p className="text-slate-600 leading-relaxed">
                            ncsStat được cung cấp <strong>hoàn toàn miễn phí</strong> cho mục đích học tập và nghiên cứu. Bạn có thể sử dụng tất cả các tính năng phân tích mà không phải trả phí.
                        </p>

                        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Yêu cầu bắt buộc: Trích dẫn khi sử dụng</h2>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-6">
                            <p className="text-amber-800 font-semibold mb-3">LƯU Ý QUAN TRỌNG</p>
                            <p className="text-amber-700">
                                Khi sử dụng ncsStat để phân tích dữ liệu trong luận văn, luận án, bài báo khoa học hoặc bất kỳ công trình nghiên cứu nào, bạn <strong>BẮT BUỘC</strong> phải trích dẫn công cụ này trong phần Tài liệu tham khảo (References) của bạn.
                            </p>
                        </div>

                        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Mẫu trích dẫn theo chuẩn APA 7th Edition</h2>

                        <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3">Tiếng Việt:</h3>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm">
                            <p className="text-slate-700">
                                Lê, P. H. (2026). <em>ncsStat: Công cụ phân tích thống kê trực tuyến cho nghiên cứu sinh Việt Nam</em> (Phiên bản 1.2.0) [Phần mềm]. https://stat.ncskit.org
                            </p>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3">English:</h3>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm">
                            <p className="text-slate-700">
                                Le, P. H. (2026). <em>ncsStat: Online statistical analysis tool for Vietnamese researchers</em> (Version 1.2.0) [Computer software]. https://stat.ncskit.org
                            </p>
                        </div>

                        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Bảo mật dữ liệu</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Tất cả dữ liệu và phân tích được xử lý <strong>100% trên trình duyệt của bạn</strong> (client-side). Dữ liệu nghiên cứu của bạn không bao giờ được gửi lên máy chủ của chúng tôi. Xem thêm tại <Link href="/privacy" className="text-indigo-600 hover:underline">Chính sách bảo mật</Link>.
                        </p>

                        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">5. Giới hạn trách nhiệm</h2>
                        <p className="text-slate-600 leading-relaxed">
                            ncsStat được cung cấp "nguyên trạng" (as-is) không có bất kỳ bảo đảm nào. Người dùng chịu trách nhiệm kiểm tra và xác minh kết quả phân tích trước khi sử dụng trong công trình nghiên cứu.
                        </p>

                        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">6. Liên hệ</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Mọi thắc mắc xin liên hệ qua email: <a href="mailto:support@ncskit.org" className="text-indigo-600 hover:underline">support@ncskit.org</a>
                        </p>

                        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
                            <p>Cập nhật lần cuối: Tháng 01/2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
