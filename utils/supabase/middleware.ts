import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require full user verification (server-side getUser)
const PROTECTED_ROUTES = ['/analyze', '/profile', '/admin']

// Routes that can skip auth check entirely (public)
const PUBLIC_ROUTES = ['/', '/login', '/terms', '/privacy', '/docs', '/methods', '/auth']

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Skip Supabase auth if environment variables are not configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return response
    }

    const pathname = request.nextUrl.pathname

    // OPTIMIZATION: Skip auth for public routes entirely
    const isPublicRoute = PUBLIC_ROUTES.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    )

    // Also skip for static assets and API routes (except auth API)
    const isStaticOrApi = pathname.startsWith('/_next') ||
        pathname.startsWith('/api/') ||
        pathname.includes('.')

    if (isPublicRoute || isStaticOrApi) {
        // Just refresh session cookies if they exist, but don't verify user
        return response
    }

    const host = request.headers.get('host')
    const forwardedProto = request.headers.get('x-forwarded-proto')
    const isHttps = forwardedProto === 'https' || request.nextUrl.protocol === 'https:'
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    const useSecureCookies = isHttps || isProduction

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            request.cookies.set(name, value)
                        )
                        response = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, {
                                ...options,
                                secure: useSecureCookies,
                                sameSite: 'lax',
                                path: '/',
                            })
                        )
                    },
                },
                cookieOptions: {
                    secure: useSecureCookies,
                    sameSite: 'lax',
                    path: '/',
                }
            }
        )

        // OPTIMIZATION: Check if this is a protected route
        const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

        if (isProtectedRoute) {
            // Check for ORCID session cookie first (secure validation)
            const orcidUser = request.cookies.get('orcid_user')?.value
            if (orcidUser) {
                // Validate ORCID user exists in database
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('id, orcid_id, last_active')
                    .eq('id', orcidUser)
                    .single()
                
                if (profile && profile.orcid_id) {
                    // Update last active timestamp
                    await supabase
                        .from('profiles')
                        .update({ last_active: new Date().toISOString() })
                        .eq('id', orcidUser)
                    
                    return response
                } else {
                    // Invalid ORCID cookie, clear it and redirect
                    response.cookies.delete('orcid_user')
                    return NextResponse.redirect(new URL('/login?error=invalid_session', request.url))
                }
            }

            // For Supabase auth: Proper session validation
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()

            if (sessionError || !session) {
                // No valid session, redirect to login
                return NextResponse.redirect(new URL('/login?error=no_session', request.url))
            }

            // Verify user still exists and is valid
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            
            if (userError || !user) {
                // Invalid user, clear session and redirect
                await supabase.auth.signOut()
                return NextResponse.redirect(new URL('/login?error=invalid_user', request.url))
            }

            // Check session expiry and refresh if needed
            const sessionAge = session.expires_at ? (session.expires_at * 1000 - Date.now()) : Infinity
            const REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes

            if (sessionAge < REFRESH_THRESHOLD) {
                // Session expiring soon, attempt refresh
                const { error: refreshError } = await supabase.auth.refreshSession()
                if (refreshError) {
                    console.warn('[Middleware] Session refresh failed:', refreshError)
                    return NextResponse.redirect(new URL('/login?error=session_expired', request.url))
                }
            }
        }
    } catch (error) {
        console.error('[Middleware] Auth error:', error)
        // On auth error for protected routes, redirect to login
        const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
        if (isProtectedRoute) {
            return NextResponse.redirect(new URL('/login?error=auth_error', request.url))
        }
    }

    return response
}
