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

        // SYNCHRONOUS: Detect code BEFORE registering listener (listener fires immediately!)
        const urlCode = typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('code')
            : null;
        
        if (urlCode) {
            isExchangingCode.current = true;
        }

        const initSession = async () => {
            // STEP 1: Restore existing session from cookies
            try {
                console.log('[Auth] Initiating session restoration...');
                
                // Brief delay to allow Supabase JS to hydrate cookies
                await new Promise(resolve => setTimeout(resolve, 800));
                
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user) {
                    console.log('[Auth] Session successfully recovered for:', session.user.email);
                    handleUser(session.user);
                } else {
                    console.log('[Auth] Still no session after delay, checking for OAuth code...');
                    
                    const params = new URLSearchParams(window.location.search);
                    const code = params.get('code');
                    if (code && !isExchangingCode.current) {
                        isExchangingCode.current = true;
                        console.log('[Auth] OAuth code found, exchanging on client...');
                        const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                        if (!exchangeError && exchangeData.session?.user) {
                            console.log('[Auth] Client exchange successful.');
                            handleUser(exchangeData.session.user);
                            window.history.replaceState({}, '', window.location.pathname);
                        } else {
                            console.error('[Auth] Client exchange failed:', exchangeError);
                        }
                        isExchangingCode.current = false;
                    }
                }
            } catch (err) {
                console.error('[Auth] Session restoration sequence failed:', err);
            }
            
            // Final check: if we still have no user, wait one more tiny bit before letting the UI redirect
            setTimeout(() => {
                setLoading(false);
                console.log('[Auth] Initialization complete.');
            }, 500);
        };
        
        initSession();

        // Auth state listener — NEVER touch loading while code exchange is in progress
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            if (isExchangingCode.current) {
                return; // Code exchange owns the loading state
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
