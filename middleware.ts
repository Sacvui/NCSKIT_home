import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    const host = request.headers.get('host') || ''
    
    // FORCE PRIMARY DOMAIN: Avoid PKCE/Cookie mismatch between stat.ncskit.org and ncsstat.ncskit.org
    if (host.includes('stat.ncskit.org') && !host.includes('ncsstat.ncskit.org')) {
        console.log(`[Middleware] Redirecting from ${host} to ncsstat.ncskit.org`)
        url.hostname = 'ncsstat.ncskit.org'
        url.port = '' // Ensure port is stripped in production
        return NextResponse.redirect(url, { status: 301 })
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (files in public folder including images)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
