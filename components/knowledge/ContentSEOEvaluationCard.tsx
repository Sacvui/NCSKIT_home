'use client';

import React from 'react';
import { 
  BarChart3, CheckCircle, AlertCircle, XCircle, 
  Search, Eye, FileText, TrendingUp, Info
} from 'lucide-react';
import { type SEOEvaluation } from '@/lib/seo-evaluator';

interface ContentSEOEvaluationCardProps {
  evaluation: SEOEvaluation;
  locale: 'vi' | 'en';
  title: string;
  slug: string;
}

export default function ContentSEOEvaluationCard({ evaluation, locale, title, slug }: ContentSEOEvaluationCardProps) {
  const isVi = locale === 'vi';

  const getStatusColor = (status: 'pass' | 'warning' | 'fail') => {
    if (status === 'pass') return 'text-green-500 bg-green-50 border-green-100';
    if (status === 'warning') return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-red-500 bg-red-50 border-red-100';
  };

  const getIcon = (status: 'pass' | 'warning' | 'fail') => {
    if (status === 'pass') return <CheckCircle className="w-4 h-4" />;
    if (status === 'warning') return <AlertCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SEO Score */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <Search className="w-5 h-5 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">SEO Strength</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black">{evaluation.score}</span>
            <span className="text-slate-500 font-bold mb-1">/100</span>
          </div>
          <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${evaluation.score}%` }} />
          </div>
        </div>

        {/* Academic Score */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Authority</span>
          </div>
          <div className="flex items-end gap-2 text-slate-900">
            <span className="text-4xl font-black">{evaluation.academicScore}</span>
            <span className="text-slate-400 font-bold mb-1">/100</span>
          </div>
          <div className="mt-4 h-1.5 bg-slate-50 rounded-full overflow-hidden">
             <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${evaluation.academicScore}%` }} />
          </div>
        </div>

        {/* Visibility Score */}
        <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Visibility Index</span>
          </div>
          <div className="flex items-end gap-2 text-indigo-900">
            <span className="text-4xl font-black">High</span>
          </div>
          <p className="mt-3 text-[10px] font-bold text-indigo-400 uppercase tracking-tight">Optimal for Academic Search</p>
        </div>
      </div>

      {/* Google Preview */}
      <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
         <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <Eye className="w-4 h-4" /> Google SERP Preview
         </h4>
         <div className="max-w-xl">
             <div className="text-[14px] text-[#202124] mb-1">https://ncsstat.ncskit.org › knowledge › {slug}</div>
             <div className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer font-medium mb-1 line-clamp-1">{title} | ncsStat Academy</div>
             <div className="text-[14px] text-[#4d5156] line-clamp-2 leading-relaxed">
                 Tìm hiểu sâu về {title} trong nghiên cứu khoa học. Hướng dẫn phân tích chi tiết, tiêu chuẩn Scopus, ngưỡng học thuật (Thresholds) và cách nhận định chuẩn APA 7...
             </div>
         </div>
      </div>

      {/* Optimization Checklist */}
      <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
         <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-6">Optimization Checklist</h4>
         <div className="space-y-3">
            {evaluation.checks.map((check) => (
               <div key={check.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${getStatusColor(check.status)}`}>
                  <div className="mt-0.5">{getIcon(check.status)}</div>
                  <div>
                     <div className="text-[11px] font-black uppercase tracking-tight mb-1">{isVi ? check.label_vi : check.label_en}</div>
                     <div className="text-sm font-medium opacity-90 leading-tight">{isVi ? check.message_vi : check.message_en}</div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Semantic Keyword density */}
      <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl">
        <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <Search className="w-4 h-4" /> Semantic Entity Density
        </h4>
        <div className="flex flex-wrap gap-2">
            {evaluation.keywords.map((kw, idx) => (
                <div key={idx} className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${kw.found ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-100 scale-105' : 'bg-white text-slate-400 border-slate-100 opacity-60'}`}>
                    {kw.term} {kw.count > 0 && `(x${kw.count})`}
                </div>
            ))}
        </div>
        <div className="mt-8 flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-200/50 pt-6">
            <Info className="w-3.5 h-3.5" /> Optimize density for better semantic indexing
        </div>
      </div>
    </div>
  );
}
