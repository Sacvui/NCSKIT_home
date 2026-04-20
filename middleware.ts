import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { logger } from '@/utils/logger'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    const host = request.headers.get('host') || ''
    const forwardedProto = request.headers.get('x-forwarded-proto')
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    
    // 1. FORCE HTTPS: Core security - secure cookies won't be sent over HTTP
    if (isProduction && forwardedProto === 'http') {
        url.protocol = 'https:'
        return NextResponse.redirect(url, { status: 301 })
    }

    // 2. FORCE PRIMARY DOMAIN: Avoid PKCE/Cookie mismatch between stat.ncskit.org and ncsstat.ncskit.org
    /*
    if (host.includes('stat.ncskit.org') && !host.includes('ncsstat.ncskit.org')) {
        console.log(`[Middleware] Redirecting from ${host} to ncsstat.ncskit.org`)
        url.hostname = 'ncsstat.ncskit.org'
        url.protocol = 'https:'
        url.port = '' // Ensure port is stripped in production
        return NextResponse.redirect(url, { status: 301 })
    }
    */

    // Block HTML 404 fallbacks for WebR R binary static files
    // If WebR fetches a missing .rds file, it chokes on the NextJS 404 HTML fallback.
    if (request.nextUrl.pathname.includes('/webr_repo_v2/') && request.nextUrl.pathname.endsWith('.rds')) {
        return new NextResponse(null, { status: 404 })
    }

    // Skip session update for static assets
    if (request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.includes('.')) {
        return NextResponse.next()
    }

    // CRITICAL: Skip ALL session processing when an OAuth code is present.
    // The middleware's getUser() call destroys the PKCE code_verifier cookie
    // before the client-side can use it for exchangeCodeForSession().
    if (request.nextUrl.searchParams.has('code')) {
        return NextResponse.next()
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
