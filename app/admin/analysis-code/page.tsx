'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
    Code, Save, RefreshCw, AlertCircle, CheckCircle2, 
    Settings, Play, Database, History, Search, 
    ArrowLeft, ChevronRight, Terminal, Wand2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ANALYSIS_TYPES } from '@/lib/ncs-credits';
import defaultScriptsData from '@/lib/webr/default-scripts.json';

const defaultScripts = defaultScriptsData as Record<string, string>;

interface Template {
    key: string;
    value: string;
}

export default function AdminAnalysisCodePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [templates, setTemplates] = useState<Record<string, string>>({});
    const [selectedKey, setSelectedKey] = useState<string>('cronbach');
    const [editingCode, setEditingCode] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTemplates = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/analysis-templates');
            const data = await response.json();
            
            if (data.templates) {
                const templateMap: Record<string, string> = {};
                data.templates.forEach((t: Template) => {
                    const cleanKey = t.key.replace('r_template_', '');
                    templateMap[cleanKey] = t.value;
                });
                setTemplates(templateMap);
                
                // Initialize editor with selected template or actual default script
                setEditingCode(templateMap[selectedKey] || defaultScripts[selectedKey] || '# Mã hệ thống không khả dụng. Bạn có thể tự viết code R mới.');
            }
        } catch (error) {
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, [selectedKey]);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const handleSave = async () => {
        if (!selectedKey) return;
        
        setSaving(true);
        try {
            const response = await fetch('/api/admin/analysis-templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    analysisKey: selectedKey,
                    code: editingCode
                })
            });
            
            const data = await response.json();
            if (data.success) {
                toast.success('Đã lưu template thành công');
                setTemplates(prev => ({ ...prev, [selectedKey]: editingCode }));
            } else {
                toast.error(data.error || 'Lỗi khi lưu');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const resetToDefault = () => {
        if (confirm('Bạn có chắc chắn muốn xóa override và quay về code mặc định của hệ thống?')) {
            setEditingCode(defaultScripts[selectedKey] || '');
            // System uses default when string is empty in DB
            handleSaveEmpty();
        }
    };

    const handleSaveEmpty = async () => {
        setSaving(true);
        try {
            await fetch('/api/admin/analysis-templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ analysisKey: selectedKey, code: '' })
            });
            setTemplates(prev => ({ ...prev, [selectedKey]: '' }));
            toast.success('Đã reset về mặc định');
        } finally {
            setSaving(false);
        }
    };

    const filteredAnalyses = Object.entries(ANALYSIS_TYPES).filter(([key, label]) => 
        label.toLowerCase().includes(searchQuery.toLowerCase()) || key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Link href="/admin" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Admin Panel
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-600 font-bold">R-Engine Logic Manager</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                        <Terminal className="w-10 h-10 text-blue-600" />
                        Cấu hình Code tính toán
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Tùy chỉnh các đoạn mã R execute trực tiếp trên WebR. Thay đổi logic mà không cần deploy code.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Link 
                        href="/admin/analysis-code/report"
                        className="px-6 py-3 bg-white border border-slate-200 text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <History className="w-4 h-4" /> Báo Cáo PDF
                    </Link>
                    <button 
                        onClick={resetToDefault}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4" /> Reset Default
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar: List of Analyses */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Tìm phép tính..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                        />
                    </div>
                    
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-4 shadow-sm max-h-[600px] overflow-y-auto custom-scrollbar">
                        <div className="space-y-1">
                            {filteredAnalyses.map(([key, label]) => {
                                const isActive = selectedKey === key;
                                const isModified = templates[key] && templates[key].trim().length > 0;
                                
                                return (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setSelectedKey(key);
                                            setEditingCode(templates[key] || defaultScripts[key] || '');
                                        }}
                                        className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center justify-between transition-all group ${
                                            isActive 
                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                                            : 'hover:bg-slate-50 text-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isModified ? 'bg-amber-500 animate-pulse' : 'bg-slate-200'}`}></div>
                                            <span className="text-xs font-black uppercase tracking-tight truncate">{label}</span>
                                        </div>
                                        {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-black text-amber-900 uppercase mb-1">Cảnh báo Quan trọng</h4>
                                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                                    Thay đổi code R tại đây sẽ ảnh hưởng trực tiếp đến kết quả tính toán của mọi người dùng. Vui lòng kiểm tra cú pháp kỹ trước khi lưu.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main: Code Editor */}
                <div className="lg:col-span-9 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50 flex flex-col h-[700px]">
                        <CardHeader className="bg-slate-900 py-6 px-8 flex flex-row items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <Code className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black text-white tracking-tight">
                                        {(ANALYSIS_TYPES as any)[selectedKey] || selectedKey}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-mono rounded border border-slate-700">key: {selectedKey}</span>
                                        {templates[selectedKey] ? (
                                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded border border-amber-500/20">Overridden</span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-500/20">System Default</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    WebAssembly R-Engine 4.3.0
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="p-0 flex-1 relative bg-[#1e293b] flex flex-col">
                            {/* Editor Header / Tabs */}
                            <div className="flex items-center gap-1 p-4 bg-slate-800/50 border-b border-white/5">
                                <div className="px-4 py-2 bg-slate-900 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/30 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    analysis_template.R
                                </div>
                                <div className="px-4 py-2 text-slate-500 text-[10px] font-bold hover:text-slate-300 transition-colors cursor-pointer">
                                    variables.json
                                </div>
                            </div>
                            
                            <div className="flex-1 relative overflow-hidden group">
                                <textarea
                                    value={editingCode}
                                    onChange={(e) => setEditingCode(e.target.value)}
                                    spellCheck={false}
                                    className="absolute inset-0 w-full h-full p-8 bg-transparent text-indigo-100 font-mono text-sm leading-relaxed outline-none resize-none z-10 selection:bg-blue-500/30"
                                    placeholder="# Nhập code R của bạn tại đây..."
                                />
                                
                                {/* Background Line Numbers Simulation */}
                                <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-900/50 border-r border-white/5 pointer-events-none select-none flex flex-col items-center pt-8 text-[10px] text-slate-600 font-mono leading-relaxed">
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <div key={i}>{i + 1}</div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Editor Footer / Help */}
                            <div className="p-4 bg-slate-900 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Wand2 className="w-3 h-3" />
                                        Supported Tags: <span className="text-blue-400 font-mono lowercase">{"{{data}}"}, {"{{likertMin}}"}, {"{{nFactors}}"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span>UTF-8</span>
                                    <span>R Language</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Documentation / Snippets Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                            <h4 className="text-sm font-black text-slate-900 uppercase mb-4 flex items-center gap-2">
                                <Database className="w-4 h-4 text-blue-600" />
                                Dữ liệu đầu vào
                            </h4>
                            <div className="space-y-3">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">{"{{data}}"}</div>
                                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                        Chuyển đổi mảng Javascript thành ma trận R thông qua hàm <code className="text-blue-600">arrayToRMatrix()</code>. Tự động xử lý cấu trúc hàng/cột.
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">{"{{likertMin}} / {{likertMax}}"}</div>
                                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                        Giá trị chặn trên và chặn dưới cho thang đo Likert. Dùng cho các phép tính Reliability.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                            <h4 className="text-sm font-black text-slate-900 uppercase mb-4 flex items-center gap-2">
                                <History className="w-4 h-4 text-blue-600" />
                                Lưu ý trả về dữ liệu (Returns)
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4 italic">
                                Để hệ thống hiển thị được kết quả, đoạn mã R của bạn PHẢI trả về một list() chứa các key mà frontend đang mong đợi.
                            </p>
                            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 border-dashed">
                                <pre className="text-[10px] text-indigo-700 font-mono leading-tight">
{`list(
  raw_alpha = ...,
  std_alpha = ...,
  item_stats = list(...)
)`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
