/**
 * API Route: Admin Cache Purge
 * Allows admins to force all connected clients to reload fresh assets.
 * 
 * Mechanism:
 * 1. Stores a new cache_version timestamp in system_config
 * 2. Clients check this version on page load and force-reload if stale
 * 3. Also triggers Next.js revalidation for server-side cached pages
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        // Verify admin role
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const adminRoles = ['platform_admin', 'super_admin', 'institution_admin', 'admin'];
        if (!adminRoles.includes(profile?.role || '')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Set new cache version in database
        const newVersion = Date.now().toString();
        const { error: configError } = await supabase
            .from('system_config')
            .upsert({
                key: 'cache_version',
                value: newVersion,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' });

        if (configError) {
            console.error('[Cache Purge] DB error:', configError);
            return NextResponse.json({ error: 'Failed to update cache version' }, { status: 500 });
        }

        // Trigger Next.js ISR revalidation for key routes
        try {
            revalidatePath('/', 'layout');
            revalidatePath('/analyze');
            revalidatePath('/knowledge');
            revalidatePath('/scales');
        } catch (e) {
            console.warn('[Cache Purge] Revalidation warning:', e);
        }

        console.log(`[Cache Purge] Admin ${user.email} triggered cache purge. Version: ${newVersion}`);

        return NextResponse.json({
            success: true,
            version: newVersion,
            message: 'Cache đã được xóa. Tất cả client sẽ tự động tải lại khi truy cập lần tới.'
        });

    } catch (error) {
        console.error('[Cache Purge] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
