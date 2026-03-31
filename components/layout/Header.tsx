'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import UserMenu from '@/components/UserMenu'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { NcsBalanceBadge } from '@/components/NcsBalanceBadge'
import { usePathname, useSearchParams } from 'next/navigation'
import { getStoredLocale, t, type Locale } from '@/lib/i18n'
import { useAuth } from '@/context/AuthContext'
import { ChevronDown, BarChart3, Layout, BookOpen, GraduationCap, Microscope, FileText, Network } from 'lucide-react'

interface HeaderProps {
    user?: any
    profile?: any
    centerContent?: React.ReactNode
    rightActions?: React.ReactNode
    hideNav?: boolean
}

function HeaderContent({ centerContent, rightActions, hideNav = false, user: propUser, profile: propProfile }: HeaderProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const mode = searchParams.get('mode')
    const { user: authUser, profile: authProfile, loading } = useAuth()

    // Use auth context if loaded, otherwise fallback to props to reduce flicker
    const user = authUser || propUser;
    const profile = authProfile || propProfile;
    const [locale, setLocale] = useState<Locale>('vi')

    useEffect(() => {
        setLocale(getStoredLocale())
        const handleStorageChange = () => setLocale(getStoredLocale())
        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('localeChange', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('localeChange', handleStorageChange)
        }
    }, [])

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-2 md:gap-4">
                {/* Left: Logo & Nav */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <img src="/logo.svg" alt="ncsStat" className="h-9 w-auto" />
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase tracking-wide">Beta</span>
                    </Link>

                    {/* Desktop Nav */}
                    {!hideNav && !centerContent && (
                        <nav className="hidden md:flex items-center gap-1">
                            <NavDropdown
                                label={t(locale, 'nav.analyze')}
                                active={pathname?.startsWith('/analyze')}
                                icon={BarChart3}
                            >
                                <NavDropdownItem
                                    href="/analyze"
                                    active={pathname === '/analyze'}
                                    label={t(locale, 'nav.analyze1')}
                                    icon={Microscope}
                                />
                                <NavDropdownItem
                                    href="/analyze2"
                                    active={pathname === '/analyze2'}
                                    label={t(locale, 'nav.analyze2')}
                                    icon={Network}
                                />
                            </NavDropdown>

                            <NavLink href="/scales" active={pathname?.startsWith('/scales')}>
                                {t(locale, 'nav.research_model')}
                            </NavLink>

                            <NavDropdown
                                label={t(locale, 'nav.docs')}
                                active={pathname?.startsWith('/docs')}
                                icon={BookOpen}
                            >
                                <NavDropdownItem
                                    href="/docs/theory"
                                    active={pathname === '/docs/theory'}
                                    label={t(locale, 'nav.theory')}
                                    icon={GraduationCap}
                                />
                                <NavDropdownItem
                                    href="/docs/case-study"
                                    active={pathname === '/docs/case-study'}
                                    label={t(locale, 'nav.casestudy')}
                                    icon={Microscope}
                                />
                                <NavDropdownItem
                                    href="/docs/user-guide"
                                    active={pathname === '/docs/user-guide'}
                                    label={t(locale, 'nav.userguide')}
                                    icon={FileText}
                                />
                            </NavDropdown>
                        </nav>
                    )}
                </div>

                {/* Center: Custom Content (e.g. Toolbar) or Spacer */}
                {centerContent ? (
                    <div className="flex-1 flex justify-center min-w-0">
                        {centerContent}
                    </div>
                ) : (
                    <div className="flex-1" /> // Spacer
                )}

                {/* Right: Actions & User */}
                <div className="flex items-center gap-3 shrink-0">
                    {rightActions}

                    {/* Separator if actions exist */}
                    {rightActions && <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />}

                    {/* NCS Balance Badge - show when user is logged in */}
                    {user && (
                        <NcsBalanceBadge balance={profile?.tokens || 0} size="sm" />
                    )}

                    {/* Language Switcher */}
                    <LanguageSwitcher compact />

                    {user ? (
                        <UserMenu user={user} profile={profile} />
                    ) : (
                        <Link href="/login" className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all shadow-sm">
                            {t(locale, 'nav.login')}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default function Header(props: HeaderProps) {
    return (
        <Suspense fallback={<header className="bg-white/80 h-16 w-full animate-pulse border-b border-slate-100"></header>}>
            <HeaderContent {...props} />
        </Suspense>
    )
}

function NavLink({ href, active, children }: { href: string, active?: boolean, children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${active
                ? 'text-indigo-600 bg-indigo-50/80'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            {children}
            {active && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-600 rounded-full" />
            )}
        </Link>
    )
}

function NavDropdown({ label, active, icon: Icon, children }: { label: string, active?: boolean, icon: any, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsOpen(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
    }

    return (
        <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${active
                    ? 'text-indigo-600 bg-indigo-50/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
            >
                <Icon className="w-4 h-4 opacity-70" />
                {label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'opacity-40'}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    )
}

function NavDropdownItem({ href, active, label, icon: Icon }: { href: string, active?: boolean, label: string, icon: any }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${active
                ? 'text-indigo-600 bg-indigo-50 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                <Icon className="w-4 h-4" />
            </div>
            {label}
        </Link>
    )
}
