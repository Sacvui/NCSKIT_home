import { NextResponse } from 'next/server';
import { FALLBACK_ARTICLES } from '@/lib/constants/knowledge-fallbacks';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('[sync-articles] Missing Supabase env vars — route will be disabled.');
}

const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export async function GET() {
    if (!supabase) {
        return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 503 });
    }
    try {
        const articles = Object.values(FALLBACK_ARTICLES);
        const results: any[] = [];
        for (const a of articles) {
            const { error } = await supabase.from('knowledge_articles').upsert({
                slug: a.slug,
                category: a.category,
                title_vi: a.title_vi,
                title_en: a.title_en,
                icon_name: a.icon_name || 'document-text-outline',
                expert_tip_vi: a.expert_tip_vi,
                expert_tip_en: a.expert_tip_en,
                content_structure: a.content_structure,
                updated_at: new Date().toISOString()
            }, { onConflict: 'slug' });
            
            if (error) {
                results.push({ slug: a.slug, error });
            } else {
                results.push({ slug: a.slug, success: true });
            }
        }
        return NextResponse.json({ success: true, count: articles.length, results });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}
