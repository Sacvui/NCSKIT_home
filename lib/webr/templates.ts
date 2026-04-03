import { getSupabase } from '@/utils/supabase/client';

// Cache for templates
let templateCache: Record<string, string> = {};
let lastFetchTime = 0;
const CACHE_TTL = 300 * 1000; // 5 minutes

/**
 * Get customized R code template from database
 * Falls back to defaultCode if not found
 */
export async function getAnalysisRTemplate(analysisKey: string, defaultCode: string): Promise<string> {
    // Check cache
    if (templateCache[analysisKey] && (Date.now() - lastFetchTime < CACHE_TTL)) {
        return templateCache[analysisKey];
    }

    try {
        const supabase = getSupabase();
        const configKey = `r_template_${analysisKey}`;
        
        const { data, error } = await supabase
            .from('system_config')
            .select('value')
            .eq('key', configKey)
            .maybeSingle();

        if (error || !data) {
            return defaultCode;
        }

        const template = typeof data.value === 'string' ? data.value : String(data.value);
        
        // Update cache
        templateCache[analysisKey] = template;
        lastFetchTime = Date.now();
        
        return template || defaultCode;
    } catch (err) {
        console.warn(`Failed to fetch R template for ${analysisKey}, using default`);
        return defaultCode;
    }
}

/**
 * Clear template cache (called after admin update)
 */
export function clearTemplateCache() {
    templateCache = {};
    lastFetchTime = 0;
}
