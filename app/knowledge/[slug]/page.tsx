import React from 'react';
import { Metadata } from 'next';
import ArticleClient from '@/components/knowledge/ArticleClient';
import { getSupabase } from '@/utils/supabase/client';
import { FALLBACK_ARTICLES, DEFAULT_ARTICLE } from '@/lib/constants/knowledge-fallbacks';

// Cấu hình Metadata động cho SEO bài viết
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;
    const supabase = getSupabase();
    
    // Thử lấy dữ liệu từ DB cho SEO
    const { data: article } = await supabase
        .from('knowledge_articles')
        .select('title_vi, category')
        .eq('slug', slug)
        .single();

    const currentArticle = article || FALLBACK_ARTICLES[slug];

    if (!currentArticle) {
        return { title: 'Bài viết không tồn tại | ncsStat' };
    }

    const title = `${currentArticle.title_vi || 'Kiến thức Thống kê'} - ncsStat Academy`;
    const description = `Tìm hiểu chuyên sâu về ${currentArticle.title_vi} và các ứng dụng trong nghiên cứu khoa học. Tài liệu học thuật chuẩn quốc tế tại ncsStat.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `https://ncskit.org/knowledge/${slug}`,
        }
    };
}

export async function generateStaticParams() {
    return [
        { slug: 'cronbach-alpha' }, 
        { slug: 'efa-factor-analysis' }, 
        { slug: 'regression-vif-multicollinearity' }
    ];
}

export const dynamicParams = true;

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    const supabase = getSupabase();
    let article = FALLBACK_ARTICLES[slug] || DEFAULT_ARTICLE;

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('knowledge_articles')
                .select('*')
                .eq('slug', slug)
                .single();
            
            if (data && !error) {
                article = data;
            }
        } catch (e) {
            console.error("Server fetch error - Using Fallback");
        }
    }

    return (
        <ArticleClient 
            initialArticle={article} 
            fallbackArticles={FALLBACK_ARTICLES} 
            slug={slug} 
        />
    );
}
