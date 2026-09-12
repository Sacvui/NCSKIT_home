import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { STATIC_SCALES } from '@/lib/constants/scales-fallbacks';
import { STATIC_ARTICLES } from '@/lib/constants/articles-fallback';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const fallbackData: any[] = [];
    
    // 1. Process Scales
    STATIC_SCALES.forEach(s => {
        fallbackData.push({
            slug: s.id,
            type: 'scale',
            title_vi: s.name_vi,
            title_en: s.name_en,
            description_vi: s.description_vi,
            description_en: s.description_en,
            category: s.category,
            tags: s.tags,
            author: s.author,
            year: s.year,
            citation: s.citation,
            meta_data: {
                items: s.scale_items,
                research_model: s.research_model,
                content_structure: s.content_structure
            }
        });
    });

    // 2. Process Theories & Methods
    STATIC_ARTICLES.forEach((a: any) => {
        const isMethod = a.slug.startsWith('scenario') || a.type === 'method';
        
        fallbackData.push({
            slug: a.slug,
            type: isMethod ? 'method' : 'theory',
            title_vi: a.title_vi,
            title_en: a.title_en,
            description_vi: a.description_vi || (a.title_vi + ' overview'),
            description_en: a.description_en || (a.title_en + ' overview'),
            content_vi: a.content_vi,
            content_en: a.content_en,
            category: a.category,
            meta_data: {
                icon_name: a.icon_name,
                content_structure: a.content_structure // if any exists in future
            }
        });
    });

    try {
        const { error } = await supabase
            .from('academy_resources')
            .upsert(fallbackData, { onConflict: 'slug' });

        if (error) throw error;
        
        return NextResponse.json({ 
            success: true, 
            message: 'Academy database synced successfully',
            count: fallbackData.length 
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
