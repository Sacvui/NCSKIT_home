'use client';

import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet } from 'lucide-react';

import { Locale, t } from '@/lib/i18n';

interface FileUploadProps {
    onDataLoaded: (data: any[], filename: string) => void;
    locale: Locale;
}

export function FileUpload({ onDataLoaded, locale }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = useCallback(async (file: File) => {
        setIsProcessing(true);
        setError(null);

        try {
            const ext = file.name.split('.').pop()?.toLowerCase();

            if (ext === 'csv') {
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.data && results.data.length > 0) {
                            onDataLoaded(results.data, file.name);
                        } else {
                            setError(t(locale, 'analyze.upload.errorEmpty'));
                        }
                        setIsProcessing(false);
                    },
                    error: (error) => {
                        setError(`${t(locale, 'analyze.upload.errorRead')} (CSV): ${error.message}`);
                        setIsProcessing(false);
                    }
                });
            } else if (ext === 'xlsx' || ext === 'xls') {
                const buffer = await file.arrayBuffer();
                const workbook = XLSX.read(buffer);
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(worksheet);

                if (data && data.length > 0) {
                    onDataLoaded(data, file.name);
                } else {
                    setError(t(locale, 'analyze.upload.errorEmpty'));
                }
                setIsProcessing(false);
            } else {
                setError(t(locale, 'analyze.upload.errorFormat'));
                setIsProcessing(false);
            }
        } catch (err) {
            setError(`${t(locale, 'analyze.upload.errorRead')}: ${err}`);
            setIsProcessing(false);
        }
    }, [onDataLoaded]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center
          transition-all duration-300 cursor-pointer
          ${isDragging
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                    disabled={isProcessing}
                />

                <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-4">
                        {isProcessing ? (
                            <div className="animate-spin">
                                <FileSpreadsheet className="w-16 h-16 text-blue-500" />
                            </div>
                        ) : (
                            <Upload className="w-16 h-16 text-gray-400" />
                        )}

                        <div>
                            <p className="text-xl font-bold text-gray-700 mb-2">
                                {isProcessing ? t(locale, 'analyze.upload.processing') : t(locale, 'analyze.upload.dropzone')}
                            </p>
                            <p className="text-gray-500">
                                {t(locale, 'analyze.upload.orClick')}
                            </p>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                .csv
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                .xlsx
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                .xls
                            </span>
                        </div>
                    </div>
                </label>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700 delay-300">
                <div className="flex items-center gap-4 w-full max-w-sm">
                    <div className="h-[1px] flex-1 bg-slate-200"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hoặc thử với dữ liệu mẫu</span>
                    <div className="h-[1px] flex-1 bg-slate-200"></div>
                </div>

                <button
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsProcessing(true);
                        try {
                            const response = await fetch('/data/ncsstat_sample_500.csv');
                            if (!response.ok) throw new Error(t(locale, 'analyze.upload.errorSample'));
                            const text = await response.text();

                            Papa.parse(text, {
                                header: true,
                                skipEmptyLines: true,
                                complete: (results) => {
                                    if (results.data && results.data.length > 0) {
                                        onDataLoaded(results.data, 'ncsstat_sample_500.csv');
                                    } else {
                                        setError(t(locale, 'analyze.upload.errorEmpty'));
                                    }
                                    setIsProcessing(false);
                                },
                                error: (err: Error) => {
                                    setError(`${t(locale, 'analyze.upload.errorRead')}: ` + err.message);
                                    setIsProcessing(false);
                                }
                             });
                        } catch (err: any) {
                            setError(`${t(locale, 'analyze.upload.errorRead')}: ` + (err.message || err));
                            setIsProcessing(false);
                        }
                    }}
                    disabled={isProcessing}
                    className="group relative flex items-center gap-4 bg-white border-2 border-blue-900 px-8 py-4 rounded-2xl transition-all hover:bg-blue-900 hover:shadow-2xl hover:shadow-blue-200 active:scale-95 group"
                >
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-900 group-hover:bg-white/10 group-hover:text-white transition-colors">
                        <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-900 group-hover:text-blue-50 transition-colors">Dữ liệu mẫu chuẩn nghiên cứu</p>
                        <p className="text-sm font-black text-blue-900 group-hover:text-white transition-colors uppercase tracking-tight">SEM Standard Dataset (N=500)</p>
                    </div>
                    <div className="ml-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="ArrowRight" />
                           <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                </button>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight italic">Chứa 24 biến quan sát xây dựng trên mô hình SEM chuẩn Q1</p>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}
