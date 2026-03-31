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

            <div className="mt-6 text-center space-y-2">
                <button
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsProcessing(true);
                        try {
                            const response = await fetch('/data/ncsstat_sample_300.csv');
                            if (!response.ok) throw new Error(t(locale, 'analyze.upload.errorSample'));
                            const text = await response.text();

                            Papa.parse(text, {
                                header: true,
                                skipEmptyLines: true,
                                complete: (results) => {
                                    if (results.data && results.data.length > 0) {
                                        onDataLoaded(results.data, 'ncsstat_sample_300 (N=300).csv');
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
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                    {locale === 'vi' ? 'Dùng thử dữ liệu ncsStat (N=300)' : 'Try ncsStat Sample (N=300)'}
                </button>

                <span className="text-gray-300 mx-2">|</span>

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
                                        onDataLoaded(results.data, 'ncsstat_sample_500 (N=500).csv');
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
                    className="text-sm text-purple-600 hover:text-purple-800 hover:underline font-medium"
                >
                    {locale === 'vi' ? 'Dùng thử dữ liệu ncsStat (N=500)' : 'Try ncsStat Sample (N=500)'}
                </button>
            </div>


            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}
