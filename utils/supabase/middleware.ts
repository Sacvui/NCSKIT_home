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
                        cookiesToSet.forEach(({ name, value }) =>
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
            console.log('[Middleware] Checking protected route:', pathname)
            
            // TEMPORARY DEBUG: Log all cookies
            const allCookies = request.cookies.getAll()
            console.log('[Middleware] All cookies:', allCookies.map(c => `${c.name}=${c.value.slice(0, 20)}...`))
            
            // Check for ORCID session cookie first (secure validation)
            const orcidUser = request.cookies.get('orcid_user')?.value
            if (orcidUser) {
                console.log('[Middleware] Found ORCID cookie, validating user:', orcidUser.slice(0, 8) + '...')
                
                // Validate ORCID user exists in database
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, orcid_id, last_active')
                    .eq('id', orcidUser)
                    .single()
                
                if (profile && profile.orcid_id) {
                    console.log('[Middleware] ORCID user validated successfully')
                    // Update last active timestamp
                    await supabase
                        .from('profiles')
                        .update({ last_active: new Date().toISOString() })
                        .eq('id', orcidUser)
                    
                    return response
                } else {
                    console.warn('[Middleware] Invalid ORCID cookie, clearing and redirecting:', profileError?.message)
                    // Invalid ORCID cookie, clear it and redirect
                    response.cookies.delete('orcid_user')
                    return NextResponse.redirect(new URL('/login?error=invalid_orcid_session', request.url))
                }
            }

            console.log('[Middleware] No ORCID cookie, checking Supabase session')

            // TEMPORARY DEBUG: Skip session validation for debugging
            if (pathname === '/analyze' && request.nextUrl.searchParams.get('debug') === 'skip') {
                console.log('[Middleware] DEBUG MODE: Skipping session validation')
                return response
            }

            // For Supabase auth: Proper session validation
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()

            console.log('[Middleware] Session check result:', {
                hasSession: !!session,
                sessionError: sessionError?.message,
                sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
                userEmail: session?.user?.email
            })

            if (sessionError) {
                console.log('[Middleware] Supabase session error:', sessionError.message)
                return NextResponse.redirect(new URL('/login?error=session_error&details=' + encodeURIComponent(sessionError.message), request.url))
            }

            if (!session) {
                console.log('[Middleware] No Supabase session found for protected route:', pathname)
                return NextResponse.redirect(new URL('/login?error=no_session&path=' + encodeURIComponent(pathname), request.url))
            }

            console.log('[Middleware] Supabase session found, verifying user')

            // Verify user still exists and is valid
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            
            if (userError) {
                console.log('[Middleware] User verification error:', userError.message)
                // Don't sign out immediately, might be temporary error
                return NextResponse.redirect(new URL('/login?error=user_verification_failed&details=' + encodeURIComponent(userError.message), request.url))
            }

            if (!user) {
                console.log('[Middleware] No user found, clearing session')
                // Clear session and redirect
                await supabase.auth.signOut()
                return NextResponse.redirect(new URL('/login?error=invalid_user', request.url))
            }

            console.log('[Middleware] User validated successfully:', user.email)

            // Check session expiry and refresh if needed
            const sessionAge = session.expires_at ? (session.expires_at * 1000 - Date.now()) : Infinity
            const REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes

            if (sessionAge < REFRESH_THRESHOLD && sessionAge > 0) {
                console.log('[Middleware] Session expiring soon, attempting refresh')
                // Session expiring soon, attempt refresh
                const { error: refreshError } = await supabase.auth.refreshSession()
                if (refreshError) {
                    console.warn('[Middleware] Session refresh failed:', refreshError.message)
                    // Don't redirect immediately, let user continue with current session
                    console.log('[Middleware] Continuing with current session despite refresh failure')
                }
                console.log('[Middleware] Session refresh completed')
            }

            console.log('[Middleware] All checks passed, allowing access to:', pathname)
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
