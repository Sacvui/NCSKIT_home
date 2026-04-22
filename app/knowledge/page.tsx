'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, Clock, ArrowRight, TrendingUp, ShieldCheck, 
  Brain, FileSearch, LineChart, Hash, Zap, HelpCircle, Layers, Activity, Quote, BarChart3
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
        title_vi: 'Cronbach\'s Alpha Masterclass: Từ Cơ bản đến Chuyên gia',
        title_en: 'Cronbach\'s Alpha Masterclass: From Basics to Expert'
    },
    {
        slug: 'descriptive-statistics-interpretation',
        category: 'Preliminary Analysis',
        icon_name: 'BarChart3',
        title_vi: 'Thống kê mô tả: Nghệ thuật kể chuyện qua con số',
        title_en: 'Descriptive Statistics: The Art of Storytelling'
    },
    {
        slug: 'cfa-confirmatory-factor-analysis',
        category: 'Advanced Statistics',
        icon_name: 'ShieldCheck',
        title_vi: 'CFA: Chìa khóa vàng thẩm định thang đo',
        title_en: 'CFA: The Gold Standard for Validation'
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
        slug: 'sem-cfa-structural-modeling',
        category: 'Structural Modeling',
        icon_name: 'Layers',
        title_vi: 'SEM & CFA: Đỉnh cao của Phân tích cấu trúc',
        title_en: 'SEM & CFA: Structural Modeling Masterclass'
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
    },
    {
        slug: 'interaction-effects-moderation',
        category: 'Impact Analysis',
        icon_name: 'Zap',
        title_vi: 'Biến tương tác & Điều tiết: Sự cộng hưởng của các nhân tố',
        title_en: 'Interaction & Moderation Effects: Factor Synergies'
    },
    {
        slug: 'manipulation-check-scenario',
        category: 'Research Design',
        icon_name: 'ShieldCheck',
        title_vi: 'Manipulation Check: Đảm bảo tính hợp lệ của kịch bản thực nghiệm',
        title_en: 'Manipulation Check: Validating Experimental Scenarios'
    },
    {
        slug: 'systematic-literature-review-slr',
        category: 'Research Design',
        icon_name: 'FileSearch',
        title_vi: 'SLR & Phân tích nội dung: Lược khảo tài liệu có hệ thống',
        title_en: 'SLR & Content Analysis: Systematic Literature Review'
    },
    {
        slug: 'qualitative-coding-expert-interview',
        category: 'Qualitative Research',
        icon_name: 'Brain',
        title_vi: 'Mã hóa định tính & Phỏng vấn chuyên gia: Hiệu chuẩn thang đo',
        title_en: 'Qualitative Coding & Expert Interviews: Scale Calibration'
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
  Quote: Quote,
  BarChart3: BarChart3,
  ShieldCheck: ShieldCheck
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

        {/* Dashboard Stats Bar */}
        <div className="container mx-auto px-6 max-w-7xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isVi ? 'Tổng bài viết' : 'Total Articles'}</p>
                <p className="text-2xl font-black text-slate-900">{articles.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isVi ? 'Độ tin cậy' : 'Reliability'}</p>
                <p className="text-2xl font-black text-slate-900">100%</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isVi ? 'Lượt xem tháng' : 'Monthly Views'}</p>
                <p className="text-2xl font-black text-slate-900">12.5K</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{isVi ? 'Trạng thái' : 'Status'}</p>
                <p className="text-2xl font-black text-white">Live</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Management Style List */}
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
            {/* Header / Filter Bar */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-10 py-8 bg-slate-900 items-center">
              <div className="col-span-5 flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                  {isVi ? 'Tên bài viết & Insight' : 'Article Title & Insight'}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                  {isVi ? 'Danh mục' : 'Category'}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <Hash className="w-4 h-4 text-indigo-400" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                  {isVi ? 'Từ khóa' : 'Keywords'}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                  {isVi ? 'Cập nhật' : 'Updated'}
                </span>
              </div>
              <div className="col-span-1 text-right">
                <Activity className="w-4 h-4 text-indigo-400 ml-auto" />
              </div>
            </div>

            {/* List Body */}
            <div className="divide-y divide-slate-100">
              {filteredArticles.map((article) => {
                const Icon = iconMap[article.icon_name || 'Brain'] || Brain;
                const updatedAt = article.updated_at ? new Date(article.updated_at).toLocaleDateString(isVi ? 'vi-VN' : 'en-US') : '22/04/2026';
                
                // Mock keywords based on category
                const keywords = article.category?.split(' ') || ['Academic', 'Research'];

                return (
                  <Link 
                    key={article.slug} 
                    href={`/knowledge/${article.slug}`}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 px-10 py-10 items-center hover:bg-indigo-50/30 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                    
                    {/* Title & Icon */}
                    <div className="col-span-1 md:col-span-5 flex items-center gap-8">
                      <div className="flex-shrink-0 w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center border-2 border-slate-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:rotate-6 transition-all shadow-md">
                        <Icon className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-2">
                          {isVi ? article.title_vi : article.title_en}
                        </h3>
                        <div className="flex items-center gap-4">
                          <p className="text-[11px] text-indigo-600 font-black uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Masterclass
                          </p>
                          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                            {isVi ? 'Học thuật' : 'Academic Grade'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="col-span-1 md:col-span-2">
                      <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-indigo-100 group-hover:text-indigo-700 group-hover:border-indigo-200 transition-colors">
                        {article.category}
                      </span>
                    </div>

                    {/* Keywords/Tags */}
                    <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2">
                      {keywords.slice(0, 2).map((kw: string, idx: number) => (
                        <span key={idx} className="text-[10px] text-slate-400 font-black px-3 py-1 border border-slate-100 rounded-lg bg-slate-50 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                          #{kw.replace(/[^a-zA-Z0-9]/g, '')}
                        </span>
                      ))}
                    </div>

                    {/* Updated At */}
                    <div className="col-span-1 md:col-span-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700 group-hover:text-indigo-900 transition-colors">{updatedAt}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{isVi ? 'Bởi ncsStat Team' : 'By ncsStat Team'}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 md:col-span-1 text-right">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center ml-auto group-hover:bg-indigo-600 transition-all group-hover:shadow-2xl group-hover:shadow-indigo-200 group-hover:-translate-y-1">
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[4rem] border-4 border-dotted border-slate-100 mt-12 shadow-inner">
              <HelpCircle className="w-20 h-20 text-slate-200 mx-auto mb-8 animate-bounce" />
              <p className="text-slate-400 font-black text-xl uppercase tracking-widest">
                {isVi ? 'Không tìm thấy dữ liệu' : 'Entry not found'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
