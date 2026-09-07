import { createClient } from '@/utils/supabase/client';
import { STATIC_SCALES } from '@/lib/constants/scales-fallbacks';
import { STATIC_ARTICLES } from '@/lib/constants/articles-fallback';

/**
 * Service to fetch unified Academy resources.
 * Falls back to static data if DB tables are empty or missing.
 */
export async function getAcademyResources(type?: 'scale' | 'theory' | 'method') {
    const supabase = createClient();

    try {
        let query = supabase.from('academy_resources').select('*');
        if (type) {
            query = query.eq('type', type);
        }
        
        const { data, error } = await query;
        
        // If DB table exists and has data
        if (!error && data && data.length > 0) {
            return { data, source: 'db' };
        }
    } catch (e) {
        console.warn("Academy DB query failed, using fallback.", e);
    }

    // FALLBACK LOGIC if DB is not yet set up
    const fallbackData: any[] = [];
    
    if (!type || type === 'scale') {
        STATIC_SCALES.forEach(s => {
            fallbackData.push({
                id: s.id,
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
                    research_model: s.research_model
                }
            });
        });
    }

    if (!type || type === 'theory' || type === 'method') {
        STATIC_ARTICLES.forEach((a: any) => {
            const isMethod = a.slug.startsWith('scenario') || a.type === 'method';
            
            if (!type || (type === 'theory' && !isMethod) || (type === 'method' && isMethod)) {
                fallbackData.push({
                    id: a.slug,
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
                        icon_name: a.icon_name
                    }
                });
            }
        });
    }

    return { data: fallbackData, source: 'fallback' };
}
