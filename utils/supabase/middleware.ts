import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/profile', '/admin']
const PUBLIC_ROUTES = ['/', '/login', '/terms', '/privacy', '/docs', '/methods', '/auth', '/analyze', '/scales', '/knowledge']

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return response
    }

    const pathname = request.nextUrl.pathname
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Use getUser() instead of getSession() for better security and reliability in middleware
    const { data: { user } } = await supabase.auth.getUser()

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

    // CRITICAL: If the request carries an OAuth code, the user is mid-authentication.
    // We MUST let them through so the client-side Supabase can exchange the code for a session.
    // Blocking them here causes the infamous redirect loop to /login?error=no_session.
    const hasAuthCode = request.nextUrl.searchParams.has('code')

    if (!user && isProtectedRoute && !hasAuthCode) {
        console.log('[Middleware] Protected access denied:', pathname)
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('error', 'no_session')
        url.searchParams.set('next', pathname)
        return NextResponse.redirect(url)
    }

    return response
}
