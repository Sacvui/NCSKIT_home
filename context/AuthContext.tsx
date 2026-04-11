'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { getSupabase } from '@/utils/supabase/client';
import { getORCIDUser, clearORCIDUser } from '@/utils/cookie-helper';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

export interface Profile {
    id: string;
    full_name: string | null;
    email: string | null;
    orcid_id: string | null;
    tokens: number;
    avatar_url: string | null;
    role: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    isAdmin: boolean;
    isOrcidUser: boolean;
    refreshProfile: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    isAdmin: false,
    isOrcidUser: false,
    refreshProfile: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const lastUserRef = useRef<string | null>(null);
    const isFirstRun = useRef(true);
    const isExchangingCode = useRef(false);
    const supabase = getSupabase();

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (data) setProfile(data as Profile);
        } catch (err) {
            console.error('[Auth] Profile fetch fail', err);
        }
    }, [supabase]);

    const handleUser = useCallback((sessionUser: User | null) => {
        const userId = sessionUser?.id || null;
        if (userId !== lastUserRef.current) {
            lastUserRef.current = userId;
            setUser(sessionUser || null);
            if (userId) {
                fetchProfile(userId);
            } else {
                setProfile(null);
            }
        }
    }, [fetchProfile]);

    useEffect(() => {
        if (!isFirstRun.current) return;
        isFirstRun.current = false;

        const initSession = async () => {
            // Step 1: Check for OAuth code in URL
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');
                
                if (code) {
                    isExchangingCode.current = true;
                    console.log('[Auth] OAuth code detected, exchanging...');
                    try {
                        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                        if (error) {
                            console.error('[Auth] Code exchange failed:', error.message);
                        } else if (data.session?.user) {
                            console.log('[Auth] Exchange OK:', data.session.user.email);
                            handleUser(data.session.user);
                            window.history.replaceState({}, '', window.location.pathname);
                        }
                    } catch (err) {
                        console.error('[Auth] Exchange error:', err);
                    }
                    isExchangingCode.current = false;
                    setLoading(false);
                    return; // Done — don't call getSession again
                }
            }

            // Step 2: No code — restore session from cookies
            try {
                const { data: { session } } = await supabase.auth.getSession();
                handleUser(session?.user || null);
            } catch (err) {
                console.error('[Auth] Session restore error:', err);
            }
            setLoading(false);
        };
        
        initSession();

        // Auth state listener — but NEVER set loading=false while code exchange is in progress
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            if (isExchangingCode.current) {
                // Code exchange is still running — don't touch loading state
                return;
            }
            handleUser(session?.user || null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase, handleUser]);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        clearORCIDUser();
        window.location.href = '/login';
    }, [supabase]);

    const value = useMemo(() => ({
        user,
        profile,
        loading,
        isAdmin: profile?.role === 'admin',
        isOrcidUser: !!profile?.orcid_id || !!getORCIDUser(),
        refreshProfile: async () => { if (user) await fetchProfile(user.id); },
        signOut,
    }), [user, profile, loading, signOut, fetchProfile]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
