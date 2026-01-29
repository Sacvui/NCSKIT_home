'use client';

import { Eye, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

interface BlindfoldingResultsProps {
    results: {
        omission_distance: number;
        n_omitted: number;
        status: string;
        note: string;
    };
}

export default function BlindfoldingResults({ results }: BlindfoldingResultsProps) {
    if (!results) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <p className="text-red-800 font-medium">Không có kết quả Blindfolding</p>
                </div>
            </div>
        );
    }

    const { omission_distance, n_omitted, status, note } = results;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                    <Eye className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Kết quả Blindfolding</h2>
                </div>
                <p className="text-teal-100">
                    Kiểm tra độ liên quan dự đoán (Predictive Relevance - Q²)
                </p>
            </div>

            {/* Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                        <p className="font-bold text-green-900">Trạng thái: {status}</p>
                        <p className="text-sm text-green-700">{note}</p>
                    </div>
                </div>
            </div>

            {/* Procedure Details */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Chi tiết quy trình
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-blue-900">Omission Distance</h4>
                        </div>
                        <p className="text-3xl font-bold text-blue-700 mb-1">
                            {omission_distance}
                        </p>
                        <p className="text-xs text-blue-600">
                            Khoảng cách giữa các điểm bị loại bỏ
                        </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye className="w-5 h-5 text-purple-600" />
                            <h4 className="font-bold text-purple-900">Số điểm bị loại bỏ</h4>
                        </div>
                        <p className="text-3xl font-bold text-purple-700 mb-1">
                            {n_omitted}
                        </p>
                        <p className="text-xs text-purple-600">
                            Số lượng observations được loại bỏ
                        </p>
                    </div>
                </div>
            </div>

            {/* Q² Interpretation Guide */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">
                    📊 Hướng dẫn giải thích Q²
                </h3>
                <div className="space-y-3 text-sm text-blue-800">
                    <div className="bg-white rounded p-3">
                        <p className="font-bold text-green-700 mb-1">✅ Q² {'>'} 0</p>
                        <p>Mô hình có độ liên quan dự đoán (predictive relevance)</p>
                    </div>
                    <div className="bg-white rounded p-3">
                        <p className="font-bold text-yellow-700 mb-1">⚠️ Q² ≈ 0</p>
                        <p>Mô hình không có hoặc có rất ít độ liên quan dự đoán</p>
                    </div>
                    <div className="bg-white rounded p-3">
                        <p className="font-bold text-red-700 mb-1">❌ Q² {'<'} 0</p>
                        <p>Mô hình kém hơn dự đoán trung bình - cần xem xét lại</p>
                    </div>
                </div>
            </div>

            {/* Methodology */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-teal-900 mb-3">
                    🔬 Phương pháp Blindfolding
                </h3>
                <div className="space-y-2 text-sm text-teal-800">
                    <p>
                        <strong>Bước 1:</strong> Loại bỏ một số điểm dữ liệu theo khoảng cách {omission_distance}
                    </p>
                    <p>
                        <strong>Bước 2:</strong> Ước lượng mô hình với dữ liệu còn lại
                    </p>
                    <p>
                        <strong>Bước 3:</strong> Dự đoán các điểm đã loại bỏ
                    </p>
                    <p>
                        <strong>Bước 4:</strong> So sánh dự đoán với giá trị thực tế
                    </p>
                    <p>
                        <strong>Kết quả:</strong> Tính Q² để đánh giá khả năng dự đoán
                    </p>
                </div>
            </div>

            {/* Best Practices */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-purple-900 mb-3">
                    💡 Best Practices
                </h3>
                <ul className="space-y-2 text-sm text-purple-800">
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                            <strong>Omission distance:</strong> Thường dùng 5-10. Giá trị {omission_distance} là phù hợp
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                            <strong>Số điểm loại bỏ:</strong> {n_omitted} điểm đảm bảo đủ dữ liệu cho cross-validation
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                            <strong>Mục tiêu:</strong> Q² {'>'} 0 cho thấy mô hình có khả năng dự đoán tốt
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                            <strong>Lưu ý:</strong> Blindfolding chỉ áp dụng cho các biến nội sinh (endogenous)
                        </span>
                    </li>
                </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-cyan-900 mb-3">
                    🎯 Khuyến nghị
                </h3>
                <div className="space-y-2 text-sm text-cyan-800">
                    <p>
                        ✅ Quy trình Blindfolding đã được thiết lập với {n_omitted} điểm loại bỏ
                    </p>
                    <p>
                        📊 Sử dụng kết quả Q² để đánh giá khả năng dự đoán của mô hình
                    </p>
                    <p>
                        🔍 Kết hợp với R² để có đánh giá toàn diện về chất lượng mô hình
                    </p>
                    <p>
                        💡 Q² cao cho thấy mô hình không chỉ giải thích tốt mà còn dự đoán tốt
                    </p>
                </div>
            </div>
        </div>
    );
}
