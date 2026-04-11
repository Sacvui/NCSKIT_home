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
    const supabase = getSupabase();

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (data) setProfile(data as Profile);
        } catch (err) {
            console.error('[Auth] Profile fetch fail', err);
        }
    }, [supabase]);

    useEffect(() => {
        if (!isFirstRun.current) return;
        isFirstRun.current = false;

        // 1. Initial Session Check (with PKCE code exchange)
        const initSession = async () => {
            try {
                // Check if there's an OAuth code in the URL that needs to be exchanged
                if (typeof window !== 'undefined') {
                    const params = new URLSearchParams(window.location.search);
                    const code = params.get('code');
                    
                    if (code) {
                        console.log('[Auth] OAuth code detected, exchanging for session...');
                        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                        
                        if (error) {
                            console.error('[Auth] Code exchange failed:', error.message);
                        } else if (data.session?.user) {
                            console.log('[Auth] Code exchange successful for:', data.session.user.email);
                            setUser(data.session.user);
                            lastUserRef.current = data.session.user.id;
                            fetchProfile(data.session.user.id);
                            
                            // Clean the URL to remove the code parameter
                            const cleanUrl = window.location.pathname;
                            window.history.replaceState({}, '', cleanUrl);
                        }
                        setLoading(false);
                        return;
                    }
                }
                
                // No code in URL — normal session restoration from cookies
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                    lastUserRef.current = session.user.id;
                    fetchProfile(session.user.id);
                }
            } catch (err) {
                console.error('[Auth] Session init error:', err);
            }
            setLoading(false);
        };
        
        initSession();

        // 2. Auth Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            const currentUserId = session?.user?.id || null;
            
            if (currentUserId !== lastUserRef.current) {
                lastUserRef.current = currentUserId;
                setUser(session?.user || null);
                
                if (currentUserId) {
                    fetchProfile(currentUserId);
                } else {
                    setProfile(null);
                }
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase, fetchProfile]);

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
