import { NextResponse } from 'next/server';
import { FALLBACK_ARTICLES } from '@/lib/constants/knowledge-fallbacks';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xfftxehejtmxcoftkkmo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnR4ZWhlanRteGNvZnRra21vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODk3MTY2OCwiZXhwIjoyMDg0NTQ3NjY4fQ.C8nIHqDdaZGfz4mX7eYK5Or_0gyVydXXX4jum8E_ITU";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function GET() {
    try {
        const articles = Object.values(FALLBACK_ARTICLES);
        const results = [];
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
