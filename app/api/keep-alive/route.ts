import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * API Keep-Alive for Supabase
 * This route is called automatically by Vercel Cron to prevent Supabase Free Tier from pausing.
 */
export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nflmoaclnyjwuloydmmv.supabase.co';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    try {
        console.log(`[Keep-Alive] Pinging Supabase at ${supabaseUrl}...`);
        
        // We ping the REST endpoint to signal activity to the database
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            headers: {
                'apikey': anonKey || '',
                'Authorization': anonKey ? `Bearer ${anonKey}` : ''
            },
            next: { revalidate: 0 }
        });

        return NextResponse.json({
            success: true,
            status: response.status,
            project: supabaseUrl.replace('https://', '').split('.')[0],
            timestamp: new Date().toISOString(),
            message: 'Supabase keep-alive ping successful'
        });
    } catch (error: any) {
        console.error('[Keep-Alive] Error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
