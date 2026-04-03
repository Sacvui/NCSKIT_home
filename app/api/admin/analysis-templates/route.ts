import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * GET /api/admin/analysis-templates
 * Fetch all R code templates for statistical analyses
 */
export async function GET(request: NextRequest) {
    const supabase = await createClient();
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Fetch templates from system_config
    const { data, error } = await supabase
        .from('system_config')
        .select('key, value')
        .like('key', 'r_template_%');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ templates: data });
}

/**
 * POST /api/admin/analysis-templates
 * Update or create an R code template
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { analysisKey, code } = await request.json();

    if (!analysisKey || code === undefined) {
        return NextResponse.json({ error: 'Missing analysisKey or code' }, { status: 400 });
    }

    const configKey = `r_template_${analysisKey}`;

    const { error } = await supabase
        .from('system_config')
        .upsert({
            key: configKey,
            value: code,
            updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
