'use client';

import React, { useState, useEffect } from 'react';
import { 
    Search, BookOpen, Layers, LineChart, ArrowRight,
    Brain, ShieldCheck, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import { getAcademyResources } from '@/lib/services/academy';

export default function AcademyHub() {
    const router = useRouter();
    const [locale, setLocale] = useState<Locale>('vi');
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [activeTab, setActiveTab] = useState<'all' | 'theory' | 'scale' | 'method'>('all');
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        
        // Fetch resources
        getAcademyResources().then(res => {
            setResources(res.data);
            setLoading(false);
        });

        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    const isVi = locale === 'vi';

    const filteredResources = resources.filter(r => {
        if (activeTab !== 'all' && r.type !== activeTab) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (r.title_vi?.toLowerCase().includes(query) || 
                    r.title_en?.toLowerCase().includes(query) ||
                    r.description_vi?.toLowerCase().includes(query));
        }
        return true;
    });

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
            <Header />
            
            <main className="flex-grow pt-24 md:pt-32 pb-24">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                    
                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full mb-6 font-black text-[10px] uppercase tracking-[0.2em] border border-indigo-100 shadow-sm">
                            <BookOpen className="w-3 h-3" />
                            {isVi ? 'Trung tâm Tài nguyên' : 'Resource Center'}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[1.1] md:leading-[0.95]">
                            ncs<span className="text-indigo-600">Academy.</span>
                        </h1>
                        <p className="text-base md:text-xl text-slate-500 font-medium mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                            {isVi 
                                ? 'Hệ sinh thái tri thức toàn diện: Từ nền tảng lý thuyết, hệ thống thang đo chuẩn hóa, đến phương pháp phân tích chuyên sâu.' 
                                : 'Comprehensive knowledge ecosystem: From theoretical foundations and standardized scales to advanced analytical methods.'}
                        </p>
                        
                        {/* Universal Search */}
                        <div className="relative max-w-2xl mx-auto group z-20 mb-12">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-white rounded-[1.5rem] shadow-2xl border border-slate-100/50">
                                <Search className="ml-6 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder={isVi ? "Tìm thang đo, mô hình, hoặc phương pháp..." : "Search scales, models, or methods..."}
                                    className="w-full px-4 py-4 md:py-5 bg-transparent text-slate-900 font-bold text-base focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap justify-center gap-2 mb-10">
                            {[
                                { id: 'all', label: isVi ? 'Tất cả' : 'All' },
                                { id: 'theory', label: isVi ? 'Lý thuyết' : 'Theories' },
                                { id: 'scale', label: isVi ? 'Thang đo' : 'Scales' },
                                { id: 'method', label: isVi ? 'Phương pháp' : 'Methods' }
                            ].map(tab => (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                                        activeTab === tab.id 
                                            ? 'bg-slate-900 text-white shadow-lg' 
                                            : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="max-w-6xl mx-auto">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1,2,3,4,5,6].map(i => (
                                    <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 h-64 animate-pulse">
                                        <div className="w-12 h-12 bg-slate-100 rounded-xl mb-6"></div>
                                        <div className="w-3/4 h-6 bg-slate-100 rounded mb-4"></div>
                                        <div className="w-full h-4 bg-slate-50 rounded mb-2"></div>
                                        <div className="w-2/3 h-4 bg-slate-50 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredResources.length === 0 ? (
                            <div className="text-center py-20">
                                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy kết quả</h3>
                                <p className="text-slate-500">Vui lòng thử lại với từ khóa khác.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredResources.map((item, idx) => (
                                    <div key={idx} onClick={() => router.push(`/academy/${item.slug}`)} 
                                         className="group cursor-pointer bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col">
                                        
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-50 transition-colors"></div>
                                        
                                        <div className="mb-6">
                                            {item.type === 'theory' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold"><BookOpen className="w-3 h-3"/> {isVi ? 'Lý thuyết' : 'Theory'}</span>}
                                            {item.type === 'scale' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold"><Layers className="w-3 h-3"/> {isVi ? 'Thang đo' : 'Scale'}</span>}
                                            {item.type === 'method' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold"><LineChart className="w-3 h-3"/> {isVi ? 'Phương pháp' : 'Method'}</span>}
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                            {isVi ? item.title_vi : (item.title_en || item.title_vi)}
                                        </h3>
                                        
                                        <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-3 flex-grow">
                                            {isVi ? item.description_vi : (item.description_en || item.description_vi)}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex gap-2">
                                                {item.category?.slice(0, 2).map((cat: string) => (
                                                    <span key={cat} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{cat}</span>
                                                ))}
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
