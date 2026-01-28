'use client';

import React from 'react';
import { FileUpload } from '@/components/FileUpload';
import { useAnalyzeActions } from '../../context/AnalyzeContext';
import { useAnalyzeHandlers } from '../../hooks/useAnalyzeHandlers';

export function UploadStep() {
    const { handleDataLoaded } = useAnalyzeHandlers();

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Nhập dữ liệu nghiên cứu
                </h2>
                <p className="text-gray-600">
                    Hỗ trợ định dạng chuẩn .csv và .xlsx
                </p>
            </div>

            <FileUpload onDataLoaded={handleDataLoaded} />

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Lưu ý:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Dòng đầu tiên nên là tên biến (header)</li>
                    <li>• Dữ liệu được xử lý hoàn toàn trên trình duyệt của bạn</li>
                    <li>• Không có dữ liệu nào được gửi lên server</li>
                </ul>
            </div>
        </div>
    );
}
