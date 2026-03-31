'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, Clock, ArrowRight, TrendingUp, ShieldCheck, 
  Brain, FileSearch, LineChart, Hash, Zap, HelpCircle, Layers, Activity
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import Link from 'next/link';
import { getSupabase } from '@/utils/supabase/client';

const supabase = getSupabase();

// Map icon name from DB to Lucide components
const iconMap: Record<string, any> = {
  Brain: Brain,
  FileSearch: FileSearch,
  LineChart: LineChart,
  Hash: Hash,
  Zap: Zap,
  HelpCircle: HelpCircle,
  Layers: Layers,
  Activity: Activity,
  BookOpen: BookOpen
};

export default function KnowledgeBase() {
  const [locale, setLocale] = useState<Locale>('vi');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocale(getStoredLocale());
    fetchArticles();
    
    const handleLocaleChange = () => setLocale(getStoredLocale());
    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('knowledge_articles')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (data) setArticles(data);
    setLoading(false);
  };

  const filteredArticles = articles.filter(article => {
    const title = locale === 'vi' ? article.title_vi : article.title_en;
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           article.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const isVi = locale === 'vi';

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <div className="container mx-auto px-6 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full mb-8 border border-indigo-100 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] uppercase font-black tracking-widest">
                {isVi ? 'Kiến thức Chuyên sâu' : 'Expert Knowledge Hub'}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95]">
              {isVi ? 'Học viện Thống kê' : 'Statistics Academy'}
              <span className="text-indigo-600 block">ncsStat.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              {isVi 
                ? 'Thư viện hướng dẫn phân tích dữ liệu chuyên nghiệp, chuẩn hóa theo các tiêu chuẩn học thuật Scopus và ISI.' 
                : 'Professional data analysis guides, standardized for Scopus and ISI academic requirements.'}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text"
                placeholder={isVi ? "Tìm kiếm phép kiểm định hoặc hướng dẫn..." : "Search for tests or guides..."}
                className="w-full pl-16 pr-8 py-6 bg-white border-2 border-slate-100 rounded-[2rem] text-slate-900 font-bold text-lg focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all shadow-xl shadow-slate-200/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories / Grid */}
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => {
                const Icon = iconMap[article.icon_name || 'Brain'] || Brain;
                return (
                  <Link 
                    key={article.id} 
                    href={`/knowledge/${article.slug}`}
                    className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:rotate-6 transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-indigo-500">
                        <Icon className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                        {isVi ? article.title_vi : article.title_en}
                      </h3>
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{article.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" />
                        <span>15 min read</span>
                      </div>
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          
          {articles.length === 0 && !loading && (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <HelpCircle className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <p className="text-slate-400 font-bold text-lg">
                {isVi ? 'Không tìm thấy kiến thức phù hợp' : 'No matching knowledge found'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
