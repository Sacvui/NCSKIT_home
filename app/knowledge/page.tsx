'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, Clock, ArrowRight, TrendingUp, ShieldCheck, 
  Brain, FileSearch, LineChart, Hash, Zap, HelpCircle, Layers, Activity, Quote
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import Link from 'next/link';
import { getSupabase } from '@/utils/supabase/client';

const supabase = getSupabase();

// --- FALLBACK DATA (To ensure Hub is NEVER empty) ---
const STATIC_ARTICLES = [
    {
        slug: 'cronbach-alpha',
        category: 'Preliminary Analysis',
        icon_name: 'Brain',
        title_vi: 'Kiểm định Cronbach\'s Alpha: Bản giao hưởng của Tin cậy nội tại',
        title_en: 'Cronbach\'s Alpha Reliability Test: The Symphony of Internal Consistency'
    },
    {
        slug: 'efa-factor-analysis',
        category: 'Factor Analysis',
        icon_name: 'Layers',
        title_vi: 'Phân tích nhân tố khám phá (EFA): Khám phá cấu trúc ẩn',
        title_en: 'Exploratory Factor Analysis (EFA): Discovering Inner Structures'
    },
    {
        slug: 'regression-vif-multicollinearity',
        category: 'Impact Analysis',
        icon_name: 'LineChart',
        title_vi: 'Hồi quy đa biến và Đa cộng tuyến (VIF): Dự báo Tác động',
        title_en: 'Multiple Regression & VIF: Predicting the Future'
    },
    {
        slug: 'descriptive-statistics-interpretation',
        category: 'Preliminary Analysis',
        icon_name: 'Activity',
        title_vi: 'Thống kê mô tả: Nghệ thuật kể chuyện qua con số',
        title_en: 'Descriptive Statistics: The Art of Storytelling'
    },
    {
        slug: 'independent-t-test-guide',
        category: 'Comparison Analysis',
        icon_name: 'Activity',
        title_vi: 'Independent T-test: So sánh các nhóm đối đầu',
        title_en: 'Independent T-test: Comparing Opposite Groups'
    },
    {
        slug: 'one-way-anova-post-hoc',
        category: 'Comparison Analysis',
        icon_name: 'Layers',
        title_vi: 'Phân tích ANOVA: So sánh Đa nhóm chuyên sâu',
        title_en: 'One-way ANOVA: Deep Multi-group Analysis'
    },
    {
        slug: 'pearson-correlation-analysis',
        category: 'Relationship Analysis',
        icon_name: 'Hash',
        title_vi: 'Tương quan Pearson: Bản đồ các mối liên kết',
        title_en: 'Pearson Correlation: The Connection Map'
    },
    {
        slug: 'chi-square-test-independence',
        category: 'Categorical Analysis',
        icon_name: 'Zap',
        title_vi: 'Kiểm định Chi-square: Liên kết dữ liệu định danh',
        title_en: 'Chi-square Test: Linking Categorical Data'
    },
    {
        slug: 'mediation-analysis-sobel-test',
        category: 'Advanced Analysis',
        icon_name: 'Brain',
        title_vi: 'Biến trung gian (Mediation): Giải mã cơ chế tác động',
        title_en: 'Mediation Analysis: Decoding Core Mechanisms'
    },
    {
        slug: 'data-cleaning-outliers-detection',
        category: 'Preliminary Analysis',
        icon_name: 'FileSearch',
        title_vi: 'Làm sạch dữ liệu & Outliers: Vệ sinh Khoa học',
        title_en: 'Data Cleaning & Outliers: Scientific Scrubbing'
    },
    {
        slug: 'technology-acceptance-model-tam',
        category: 'Research Models',
        icon_name: 'TrendingUp',
        title_vi: 'Mô hình Chấp nhận Công nghệ (TAM): Hướng dẫn Chuyên sâu',
        title_en: 'Technology Acceptance Model (TAM): The Ultimate Guide'
    },
    {
        slug: 'theory-of-planned-behavior-tpb',
        category: 'Behavioral Research',
        icon_name: 'Brain',
        title_vi: 'Thuyết Hành vi Dự định (TPB): Chìa khóa giải mã Ý định',
        title_en: 'Theory of Planned Behavior (TPB): Decoding Intentions'
    },
    {
        slug: 'signaling-theory-research',
        category: 'Market Strategy',
        icon_name: 'Zap',
        title_vi: 'Lý thuyết Tín hiệu (Signaling Theory): Khi Hành động lên tiếng',
        title_en: 'Signaling Theory: Actions Speak Louder Than Words'
    },
    {
        slug: 'common-method-bias-survey-research',
        category: 'Advanced Research',
        icon_name: 'ShieldCheck',
        title_vi: 'Common Method Bias (CMB): Kẻ hủy diệt âm thầm của nghiên cứu khảo sát',
        title_en: 'Common Method Bias (CMB): The Silent Assassin of Survey Research'
    },
    {
        slug: 'pls-sem-vs-cb-sem-selection',
        category: 'Advanced Statistics',
        icon_name: 'Zap',
        title_vi: 'PLS-SEM vs CB-SEM: Chọn đúng "vũ khí" cho bài báo quốc tế',
        title_en: 'PLS-SEM vs CB-SEM: Choosing the Right Weapon for International Journals'
    },
    {
        slug: 'writing-academic-results-apa',
        category: 'Academic Writing',
        icon_name: 'Quote',
        title_vi: 'Viết kết quả nghiên cứu chuẩn Q1: Biến con số thành câu chuyện học thuật',
        title_en: 'Writing Q1-Level Results: Turning Numbers into Academic Narratives'
    }
];

// Map icon name to Lucide components
const iconMap: Record<string, any> = {
  Brain: Brain,
  FileSearch: FileSearch,
  LineChart: LineChart,
  Hash: Hash,
  Zap: Zap,
  HelpCircle: HelpCircle,
  Layers: Layers,
  Activity: Activity,
  BookOpen: BookOpen,
  TrendingUp: TrendingUp,
  Quote: Quote
};

export default function KnowledgeBase() {
  const [locale, setLocale] = useState<Locale>('vi');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<any[]>(STATIC_ARTICLES); // Init with fallback
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
    try {
        const { data, error } = await supabase
          .from('knowledge_articles')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (data && data.length > 0) {
            setArticles(data);
        } else {
            console.warn('Supabase Knowledge Hub empty - Using Fallback Data');
            setArticles(STATIC_ARTICLES);
        }
    } catch (err) {
        console.error('Supabase fetch failed - Using Fallback Data');
        setArticles(STATIC_ARTICLES);
    } finally {
        setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const title = locale === 'vi' ? (article.title_vi || '') : (article.title_en || '');
    const category = article.category || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           category.toLowerCase().includes(searchQuery.toLowerCase());
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

        {/* Grid Display */}
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => {
              const Icon = iconMap[article.icon_name || 'Brain'] || Brain;
              return (
                <Link 
                  key={article.slug} 
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
          
          {filteredArticles.length === 0 && (
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
