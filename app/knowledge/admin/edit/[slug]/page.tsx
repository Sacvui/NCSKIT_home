'use client';

import React, { useState, useEffect, use } from 'react';
import { 
    Save, Eye, ArrowLeft, Plus, Trash2, Layout, BookOpen, 
    Type, ShieldCheck, ChevronRight, RefreshCw, Layers, Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import { getSupabase } from '@/utils/supabase/client';

const supabase = getSupabase();

export default function EditorialWorkplace({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = use(paramsPromise);
    const slug = params?.slug;

    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        if (slug) fetchArticle(slug);
    }, [slug]);

    const fetchArticle = async (currentSlug: string) => {
        setLoading(true);
        
        // Priority 1: Check LocalStorage for existing draft/imported content
        const localData = localStorage.getItem('ncs_knowledge_articles');
        if (localData) {
            const parsed = JSON.parse(localData);
            const found = parsed.find((a: any) => a.slug === currentSlug);
            if (found) {
                setArticle(found);
                setLoading(false);
                return;
            }
        }

        // Priority 2: Supabase
        const { data } = await supabase.from('knowledge_articles').select('*').eq('slug', currentSlug).single();
        if (data) setArticle(data);
        else {
            // Fallback for new/unsaved items
            setArticle({
                slug: currentSlug,
                title_vi: 'Bài viết mới',
                title_en: 'New Article',
                category: 'Unassigned',
                content_structure: []
            });
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        
        try {
            // Update LocalStorage (Instant Sync)
            const localData = localStorage.getItem('ncs_knowledge_articles');
            let articlesList = localData ? JSON.parse(localData) : [];
            
            const existingIdx = articlesList.findIndex((a: any) => a.slug === article.slug);
            if (existingIdx >= 0) {
                articlesList[existingIdx] = { ...article, updated_at: new Date().toISOString() };
            } else {
                articlesList.push({ ...article, updated_at: new Date().toISOString() });
            }
            
            localStorage.setItem('ncs_knowledge_articles', JSON.stringify(articlesList));

            // Background Sync to Supabase
            await supabase.from('knowledge_articles').upsert(article, { onConflict: 'slug' });
            
            alert('Đã lưu bản thảo thành công vào hệ thống CMS!');
        } catch (err: any) {
            console.error('Save error:', err);
            alert('Lỗi lưu trữ: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const addSection = () => {
        const newSections = [...(article.content_structure || [])];
        newSections.push({ h2_vi: 'Tiêu đề đoạn mới', h2_en: 'New Section Title', content_vi: '', content_en: '' });
        setArticle({ ...article, content_structure: newSections });
    };

    const removeSection = (index: number) => {
        const newSections = article.content_structure.filter((_: any, i: number) => i !== index);
        setArticle({ ...article, content_structure: newSections });
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-sans uppercase tracking-[0.5em] animate-pulse italic">Nạp Editorial Engine...</div>;

    return (
        <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
            {/* Editorial Header */}
            <header className="bg-slate-900 text-white px-8 py-5 flex items-center justify-between shadow-2xl z-50">
                <div className="flex items-center gap-6">
                    <Link href="/knowledge/admin" className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-black tracking-tight leading-none mb-1">{article.title_vi}</h1>
                        <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">ncsStat Authority CMS — Editing Article</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsPreview(!isPreview)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPreview ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        <Eye className="w-4 h-4" /> {isPreview ? 'Đang Xem trước' : 'Chế độ Xem trước'}
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-3 px-8 py-3 bg-indigo-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Lưu bản thảo
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Editor Area */}
                <div className={`flex-1 overflow-y-auto p-12 bg-white transition-all duration-500 ${isPreview ? 'md:max-w-[45%]' : 'max-w-none'}`}>
                    <div className="max-w-3xl mx-auto space-y-12">
                        {/* Meta Settings Card */}
                        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-8 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Meta Information
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tiêu đề bài viết (VI)</label>
                                    <input 
                                        className="w-full text-2xl font-black bg-white border border-slate-100 p-6 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-sans"
                                        value={article.title_vi}
                                        onChange={(e) => setArticle({...article, title_vi: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Expert Strategy Tip</label>
                                    <textarea 
                                        className="w-full min-h-[120px] bg-white border border-slate-100 p-6 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-sans italic"
                                        value={article.expert_tip_vi}
                                        onChange={(e) => setArticle({...article, expert_tip_vi: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Article Content Workplace */}
                        <div className="space-y-10">
                            <h3 className="text-[10px] font-black uppercase text-slate-900 tracking-widest mb-6 flex items-center gap-3">
                                <Layers className="w-5 h-5 text-indigo-600" /> Cấu trúc nội dung 1000 chữ
                            </h3>
                            
                            {article.content_structure?.map((section: any, idx: number) => (
                                <div key={idx} className="group relative bg-slate-50/50 p-10 rounded-[3.5rem] border border-slate-100 hover:bg-indigo-50/20 transition-all">
                                    <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => removeSection(idx)}
                                            className="p-3 bg-white text-red-400 hover:bg-red-500 hover:text-white rounded-full shadow-lg border border-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 font-bold border border-slate-100">{idx + 1}</div>
                                            <input 
                                                placeholder="Tên đoạn (H2)..."
                                                className="flex-1 bg-transparent border-none text-2xl font-black text-slate-900 outline-none focus:text-indigo-600 transition-colors tracking-tight"
                                                value={section.h2_vi}
                                                onChange={(e) => {
                                                    const newS = [...article.content_structure];
                                                    newS[idx].h2_vi = e.target.value;
                                                    setArticle({...article, content_structure: newS});
                                                }}
                                            />
                                        </div>
                                        <textarea 
                                            placeholder="Gõ nội dung chuyên sâu 1000 chữ cho đoạn này..."
                                            className="w-full min-h-[400px] bg-white rounded-[2.5rem] p-10 outline-none border border-slate-100 focus:ring-8 focus:ring-indigo-100 transition-all text-lg leading-relaxed text-slate-700"
                                            value={section.content_vi}
                                            onChange={(e) => {
                                                const newS = [...article.content_structure];
                                                newS[idx].content_vi = e.target.value;
                                                setArticle({...article, content_structure: newS});
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            
                            <button 
                                onClick={addSection}
                                className="w-full py-12 border-4 border-dashed border-slate-100 text-slate-400 rounded-[4rem] hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex flex-col items-center gap-4"
                            >
                                <Plus className="w-10 h-10" />
                                <span className="font-black uppercase text-[10px] tracking-widest leading-none">Chèn thêm đoạn nghiên cứu mới</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Area (Real-time) */}
                <div className={`bg-slate-50 border-l border-slate-100 overflow-y-auto transition-all duration-500 p-16 ${isPreview ? 'flex-1' : 'w-0 opacity-0 pointer-events-none'}`}>
                    <div className="max-w-2xl mx-auto">
                        <header className="mb-20">
                            <span className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg mb-8 inline-block">
                                {article.category}
                            </span>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-10 overflow-hidden">{article.title_vi}</h1>
                        </header>
                        
                        {article.content_structure?.map((section: any, idx: number) => (
                            <div key={idx} className="mb-20">
                                <h2 className="text-2xl font-black text-slate-900 mb-8 border-l-[6px] border-indigo-600 pl-6 leading-none py-1">{section.h2_vi}</h2>
                                <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-line bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100">
                                    {section.content_vi}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
