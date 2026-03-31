import React from 'react';
import ArticleClient from '@/components/knowledge/ArticleClient';
import { getSupabase } from '@/utils/supabase/client';

// MASTER REPOSITORY (FALLBACK - GUARANTEED UPTIME)
// Using this directly on Server helps SEO and initial render speed
const FALLBACK_ARTICLES: Record<string, any> = {
    'cronbach-alpha': {
        slug: 'cronbach-alpha', category: 'Preliminary Analysis',
        title_vi: 'Kiểm định Cronbach\'s Alpha: Bản giao hưởng của Tin cậy nội tại',
        title_en: 'Cronbach\'s Alpha Reliability Test: The Symphony of Internal Consistency',
        expert_tip_vi: 'Đặc biệt tập trung vào cột Corrected Item-Total Correlation. Bất kỳ biến nào < 0.3 cần loại bỏ ngay.',
        expert_tip_en: 'Look at Corrected Item-Total Correlation. Anything < 0.3 should be removed.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Bản chất & Triết lý', h2_en: '1. Essence & Philosophy',
            content_vi: 'Đo lường mức độ các câu hỏi trong thang đo hiểu ý nhau. Alpha > 0.7 là tỉ lệ vàng.',
            content_en: 'Measures internal consistency. Alpha > 0.7 is the gold standard.'
        }, {
            h2_vi: '2. Tiêu chuẩn quốc tế', h2_en: '2. International Standards',
            content_vi: '0.8-0.9: Tuyệt vời. 0.7-0.8: Tốt. <0.6: Loại bỏ.',
            content_en: '0.8-0.9: Excellent. 0.7-0.8: Good. <0.6: Reject.'
        }]
    },
    'efa-factor-analysis': {
        slug: 'efa-factor-analysis', category: 'Factor Analysis',
        title_vi: 'Phân tích nhân tố khám phá (EFA): Cấu trúc ẩn',
        title_en: 'Exploratory Factor Analysis (EFA): Invisible Structures',
        expert_tip_vi: 'Ưu tiên phép xoay Promax thay vì Varimax.', expert_tip_en: 'Prefer Promax rotation.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Gom nhóm biến', h2_en: '1. Variable Grouping',
            content_vi: 'Tìm ra các nhân tố mẹ điều khiển toàn bộ hành vi dữ liệu.',
            content_en: 'Discover latent factors controlling the dataset.'
        }]
    },
    'regression-vif-multicollinearity': {
        slug: 'regression-vif-multicollinearity', category: 'Impact Analysis',
        title_vi: 'Hồi quy đa biến và Đa cộng tuyến (VIF)', title_en: 'Multiple Regression & VIF',
        expert_tip_vi: 'Hệ số Beta chuẩn hóa giúp so sánh độ mạnh tác động.', expert_tip_en: 'Use Standardized Beta.',
        author: 'ncsStat Editorial', updated_at: new Date().toISOString(),
        content_structure: [{
            h2_vi: '1. Dự báo tác động', h2_en: '1. Impact Prediction',
            content_vi: 'Cho thấy biến X làm biến Y thay đổi bao nhiêu đơn vị.',
            content_en: 'Shows how much Y changes when X increases.'
        }]
    }
};

const DEFAULT_ARTICLE = {
    slug: 'unknown', category: 'Academy Content', title_vi: 'Đang tải nội dung...', title_en: 'Loading Content...',
    expert_tip_vi: 'Đang tải...', expert_tip_en: 'Loading...', author: 'ncsStat', updated_at: new Date().toISOString(),
    content_structure: [{ h2_vi: 'Đang tải...', h2_en: 'Loading...', content_vi: 'Nội dung đang được hệ thống nạp từ thư viện tri thức...', content_en: 'Please wait while content is loading...' }]
};

export async function generateStaticParams() {
    return [
        { slug: 'cronbach-alpha' }, { slug: 'efa-factor-analysis' }, { slug: 'regression-vif-multicollinearity' },
        { slug: 'descriptive-statistics-interpretation' }, { slug: 'independent-t-test-guide' }, { slug: 'one-way-anova-post-hoc' },
        { slug: 'pearson-correlation-analysis' }, { slug: 'chi-square-test-independence' }, { slug: 'mediation-analysis-sobel-test' },
        { slug: 'data-cleaning-outliers-detection' }, { slug: 'sem-cfa-structural-modeling' }
    ];
}

// Ensure the page stays dynamic even if pre-rendered
export const dynamicParams = true;

const supabase = getSupabase();

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    let article = FALLBACK_ARTICLES[slug] || DEFAULT_ARTICLE;
    
    try {
        const { data, error } = await supabase.from('knowledge_articles').select('*').eq('slug', slug).single();
        if (data && !error) {
            article = data;
        }
    } catch (e) {
        console.error("Server fetch error - Using Fallback");
    }

    return (
        <ArticleClient 
            initialArticle={article} 
            fallbackArticles={FALLBACK_ARTICLES} 
            slug={slug} 
        />
    );
}
