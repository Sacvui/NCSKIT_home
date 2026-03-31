import React, { useState } from 'react';
import { BarChart2, Shield, Network, Users, GitCompare, Layers, TrendingUp, Grid3x3, Activity, ChevronDown, ChevronRight, Star, Binary, FlaskConical, ArrowRightLeft, Target, CircleDot, Shuffle } from 'lucide-react';
import { PointBadge } from '@/components/ui/PointBadge';
import { Locale, t } from '@/lib/i18n';

interface AnalysisSelectorProps {
    onSelect: (step: string) => void;
    onRunAnalysis: (type: string) => void;
    isAnalyzing: boolean;
    mode?: string | null;
    locale: Locale;
}

interface AnalysisOption {
    id: string;
    title: string;
    desc: string;
    icon: any;
    action: 'select' | 'run';
    recommended?: boolean;
    costType?: string; // Maps to analysis cost type
    disabled?: boolean;
    badge?: string;
}

interface AnalysisCategory {
    name: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    options: AnalysisOption[];
}

export function AnalysisSelector({ onSelect, onRunAnalysis, isAnalyzing, mode, locale }: AnalysisSelectorProps) {
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    // Auto-expand categories based on mode
    React.useEffect(() => {
        if (mode === '1') {
            setExpandedCategories(['reliability', 'comparison', 'categorical']);
        } else if (mode === '2') {
            setExpandedCategories(['relationship', 'factor', 'clustering']);
        } else {
            setExpandedCategories(['reliability', 'comparison']); // Default
        }
    }, [mode]);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const categories: { id: string; category: AnalysisCategory }[] = [
        {
            id: 'reliability',
            category: {
                name: locale === 'vi' ? 'Độ tin cậy & Mô tả' : 'Reliability & Descriptive',
                description: locale === 'vi' ? 'Thống kê cơ bản và độ tin cậy thang đo' : 'Basic statistics and scale reliability',
                color: 'text-blue-700',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                options: [
                    { id: 'descriptive-select', title: t(locale, 'analyze.methods.descriptive'), desc: locale === 'vi' ? 'Mean, SD, Min, Max, Median, Độ lệch, Độ nhọn' : 'Mean, SD, Min, Max, Median, Skewness, Kurtosis', icon: BarChart2, action: 'select', costType: 'descriptive' },
                    { id: 'cronbach-select', title: t(locale, 'analyze.methods.cronbach'), desc: locale === 'vi' ? 'Độ tin cậy thang đo truyền thống (α)' : 'Classic scale reliability (α)', icon: Shield, action: 'select', recommended: true, costType: 'cronbach' },
                    { id: 'omega-select', title: t(locale, 'analyze.methods.omega'), desc: locale === 'vi' ? 'Độ tin cậy hiện đại (ω) cho độ chính xác cao hơn' : 'Modern reliability (ω) for better precision', icon: Shield, action: 'select', costType: 'cronbach' },
                ]
            }
        },
        {
            id: 'comparison',
            category: {
                name: locale === 'vi' ? 'So sánh nhóm' : 'Group Comparison',
                description: locale === 'vi' ? 'So sánh giá trị trung bình giữa các nhóm' : 'Compare means between groups',
                color: 'text-green-700',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                options: [
                    { id: 'ttest-select', title: t(locale, 'analyze.methods.ttest'), desc: locale === 'vi' ? 'So sánh 2 nhóm độc lập' : 'Compare 2 independent groups', icon: GitCompare, action: 'select', costType: 'ttest-indep' },
                    { id: 'ttest-paired-select', title: t(locale, 'analyze.methods.ttest_paired'), desc: locale === 'vi' ? 'So sánh trước-sau (theo cặp)' : 'Compare before-after (paired)', icon: Users, action: 'select', costType: 'ttest-paired' },
                    { id: 'anova-select', title: t(locale, 'analyze.methods.anova'), desc: locale === 'vi' ? 'So sánh nhiều nhóm' : 'Compare multiple groups', icon: Layers, action: 'select', costType: 'anova' },
                    { id: 'twoway-anova-select', title: 'Two-Way ANOVA', desc: locale === 'vi' ? 'ANOVA 2 nhân tố có tương tác' : 'Factorial ANOVA with interaction', icon: Grid3x3, action: 'select', costType: 'anova' },
                    { id: 'mannwhitney-select', title: 'Mann-Whitney U', desc: locale === 'vi' ? 'Kiểm định phi tham số cho 2 nhóm' : 'Non-parametric 2 groups', icon: Activity, action: 'select', costType: 'mann-whitney' },
                    { id: 'kruskalwallis-select', title: 'Kruskal-Wallis H', desc: locale === 'vi' ? 'Kiểm định phi tham số cho nhiều nhóm' : 'Non-parametric multiple groups', icon: Layers, action: 'select', costType: 'anova' },
                    { id: 'wilcoxon-select', title: 'Wilcoxon Signed-Rank', desc: locale === 'vi' ? 'So sánh cặp phi tham số' : 'Non-parametric paired comparison', icon: ArrowRightLeft, action: 'select', costType: 'ttest-paired' },
                ]
            }
        },
        {
            id: 'relationship',
            category: {
                name: locale === 'vi' ? 'Tương quan & Hồi quy' : 'Correlation & Regression',
                description: locale === 'vi' ? 'Phân tích mối quan hệ giữa các biến' : 'Analyze relationships between variables',
                color: 'text-purple-700',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200',
                options: [
                    { id: 'correlation', title: t(locale, 'analyze.methods.correlation'), desc: locale === 'vi' ? 'Tương quan Pearson/Spearman' : 'Pearson/Spearman correlation', icon: Network, action: 'run', costType: 'correlation' },
                    { id: 'regression-select', title: t(locale, 'analyze.methods.regression'), desc: locale === 'vi' ? 'Hồi quy tuyến tính đa biến với hệ số β' : 'Multiple linear regression with β', icon: TrendingUp, action: 'select', costType: 'regression' },
                    { id: 'logistic-select', title: 'Logistic Regression', desc: locale === 'vi' ? 'Dự báo kết quả nhị phân' : 'Binary outcome prediction', icon: Binary, action: 'select', costType: 'regression' },
                    { id: 'mediation-select', title: t(locale, 'analyze.methods.mediation'), desc: locale === 'vi' ? 'Phân tích trung gian (Baron & Kenny + Sobel)' : 'Baron & Kenny + Sobel test', icon: Target, action: 'select', costType: 'regression' },
                    { id: 'moderation-select', title: t(locale, 'analyze.methods.moderation'), desc: locale === 'vi' ? 'Phân tích hiệu ứng điều tiết' : 'Interaction effect with simple slopes', icon: Shuffle, action: 'select', costType: 'regression' },
                ]
            }
        },
        {
            id: 'factor',
            category: {
                name: locale === 'vi' ? 'Phân tích nhân tố & SEM' : 'Factor Analysis & SEM',
                description: locale === 'vi' ? 'EFA, CFA, SEM cho mô hình đo lường' : 'EFA, CFA, SEM for measurement models',
                color: 'text-orange-700',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-200',
                options: [
                    { id: 'efa-select', title: t(locale, 'analyze.methods.efa'), desc: locale === 'vi' ? 'Phân tích nhân tố khám phá + Parallel Analysis' : 'Exploratory Factor Analysis + Parallel Analysis', icon: Grid3x3, action: 'select', recommended: true, costType: 'efa' },
                    { id: 'cfa-select', title: t(locale, 'analyze.methods.cfa'), desc: locale === 'vi' ? 'Phân tích nhân tố khẳng định (Lavaan)' : 'Confirmatory Factor Analysis (Lavaan)', icon: Network, action: 'select', disabled: true, badge: 'Soon', costType: 'cfa' },
                    { id: 'sem-select', title: t(locale, 'analyze.methods.sem'), desc: locale === 'vi' ? 'Mô hình cấu trúc tuyến tính (Lavaan)' : 'Structural Equation Modeling (Lavaan)', icon: Layers, action: 'select', disabled: true, badge: 'Soon', costType: 'sem' },
                ]
            }
        },
        {
            id: 'categorical',
            category: {
                name: locale === 'vi' ? 'Biến định danh' : 'Categorical Variables',
                description: locale === 'vi' ? 'Các kiểm định cho dữ liệu định danh' : 'Tests for categorical data',
                color: 'text-teal-700',
                bgColor: 'bg-teal-50',
                borderColor: 'border-teal-200',
                options: [
                    { id: 'chisq-select', title: t(locale, 'analyze.methods.chisq'), desc: locale === 'vi' ? 'Kiểm định tính độc lập (Mẫu lớn)' : 'Test of independence (Large sample)', icon: Grid3x3, action: 'select', costType: 'chisquare' },
                    { id: 'fisher-select', title: locale === 'vi' ? 'Kiểm định chính xác Fisher' : "Fisher's Exact Test", desc: locale === 'vi' ? 'Kiểm định tính độc lập (Mẫu nhỏ)' : 'Test of independence (Small sample)', icon: Grid3x3, action: 'select', costType: 'chisquare' },
                ]
            }
        },
        {
            id: 'clustering',
            category: {
                name: locale === 'vi' ? 'Phân cụm & Phân đoạn' : 'Clustering & Segmentation',
                description: locale === 'vi' ? 'Phân đoạn dữ liệu thành các nhóm' : 'Segment data into groups',
                color: 'text-pink-700',
                bgColor: 'bg-pink-50',
                borderColor: 'border-pink-200',
                options: [
                    { id: 'cluster-select', title: t(locale, 'analyze.methods.cluster'), desc: locale === 'vi' ? 'Phân cụm K-Means với hồ sơ đặc trưng' : 'K-Means clustering with profiles', icon: CircleDot, action: 'select', costType: 'efa' },
                ]
            }
        }
    ];

    // Count total methods
    const totalMethods = categories.reduce((sum, cat) => sum + cat.category.options.length, 0);

    return (
        <div className="space-y-4">
            {/* Quick Stats */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <span className="px-2 py-1 bg-slate-100 rounded font-medium">{totalMethods} {locale === 'vi' ? 'phương pháp' : 'methods'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    {locale === 'vi' ? 'Đề xuất' : 'Recommended'}
                </span>
            </div>

            {categories.map(({ id, category }) => {
                const isExpanded = expandedCategories.includes(id);

                return (
                    <div key={id} className={`rounded-xl border-2 ${category.borderColor} overflow-hidden transition-all`}>
                        {/* Category Header */}
                        <button
                            onClick={() => toggleCategory(id)}
                            className={`w-full px-5 py-4 flex items-center justify-between ${category.bgColor} hover:brightness-95 transition-all`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center ${category.color}`}>
                                    {id === 'reliability' && <Shield className="w-5 h-5" />}
                                    {id === 'comparison' && <GitCompare className="w-5 h-5" />}
                                    {id === 'relationship' && <Network className="w-5 h-5" />}
                                    {id === 'factor' && <Layers className="w-5 h-5" />}
                                    {id === 'categorical' && <Grid3x3 className="w-5 h-5" />}
                                    {id === 'clustering' && <CircleDot className="w-5 h-5" />}
                                </div>
                                <div className="text-left">
                                    <h3 className={`font-semibold ${category.color}`}>{category.name}</h3>
                                    <p className="text-xs text-slate-500">{category.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">{category.options.length} {t(locale, 'analyze.methods_count')}</span>
                                {isExpanded ? (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                        </button>

                        {/* Category Content */}
                        {isExpanded && (
                            <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-3">
                                {category.options.map((opt) => {
                                    const Icon = opt.icon;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => opt.action === 'run' ? onRunAnalysis(opt.id) : onSelect(opt.id)}
                                            disabled={isAnalyzing || opt.disabled}
                                            className={`group relative p-4 bg-slate-50 rounded-lg border border-slate-200 
                                                ${opt.disabled
                                                    ? 'opacity-60 cursor-not-allowed grayscale-[0.5]'
                                                    : 'hover:border-slate-400 hover:bg-white hover:shadow-md'
                                                } 
                                                transition-all text-left`}
                                        >
                                            {opt.recommended && !opt.disabled && (
                                                <div className="absolute -top-2 -right-2">
                                                    <Star className="w-5 h-5 text-amber-500 fill-current drop-shadow" />
                                                </div>
                                            )}
                                            {opt.badge && (
                                                <div className="absolute -top-2 -right-2 z-10">
                                                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full shadow-sm ${opt.badge === 'Coming Soon' ? 'bg-gray-600 text-white' : 'bg-blue-600 text-white'
                                                        }`}>
                                                        {opt.badge}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg bg-white border border-slate-200 text-slate-600 ${!opt.disabled && 'group-hover:scale-110'} transition-transform shrink-0`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-semibold text-slate-800 text-sm leading-tight flex items-center gap-2">
                                                        {opt.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                        {opt.desc}
                                                    </p>
                                                    {opt.costType && (
                                                        <div className="mt-1.5">
                                                            <PointBadge analysisType={opt.costType} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
