'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { getSupabase } from '@/utils/supabase/client';
import { getORCIDUser, clearORCIDUser } from '@/utils/cookie-helper';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { logLogin, logLogout } from '@/lib/activity-logger';

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
    const isInitialized = useRef(false);
    const lastUserRef = useRef<string | null>(null);
    const sessionStartRef = useRef<Date | null>(null);
    const supabase = getSupabase();

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            console.log(`[AuthProvider] Fetching profile for ${userId}...`);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.warn('[AuthProvider] Profile fetch warning:', error.message);
            }
            if (data) {
                setProfile(data as Profile);
            }
        } catch (err) {
            console.error('[AuthProvider] Profile fetch error:', err);
        }
    }, []);

    const initializeAuth = useCallback(async () => {
        if (isInitialized.current) return;
        isInitialized.current = true;
        console.log('[AuthProvider] Initializing...');

        try {
            // 1. Check Supabase Session
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUser(session.user);
                lastUserRef.current = session.user.id;
                sessionStartRef.current = new Date();
                await logLogin(session.user.id);
                await fetchProfile(session.user.id);
            } else {
                // 2. Check ORCID Session
                const orcidUserId = getORCIDUser();
                if (orcidUserId) {
                    // Fetch profile for ORCID user
                    const { data: orcidProfile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', orcidUserId)
                        .single();

                    if (orcidProfile) {
                        setProfile(orcidProfile as Profile);
                        // Mock user object for ORCID
                        setUser({
                            id: orcidUserId,
                            email: orcidProfile.email || `${orcidProfile.orcid_id}@orcid.org`,
                        } as any);
                    }
                }
            }
        } catch (err: any) {
            // Silence harmless AbortError commonly caused by React Strict Mode or rapid navigation
            if (err.name !== 'AbortError') {
                console.error('[AuthProvider] Init error:', err);
            }
        } finally {
            setLoading(false);
        }
    }, [supabase]); // initializeAuth should only depend on the client

    useEffect(() => {
        // Run deep initialization
        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            const user = session?.user || null;
            
            // 1. Always sync user state immediately for UI responsiveness
            setUser(user);

            // 2. Only handle "Heavy" logic (logging, profile fetch) if ID actually changed
            const currentUserId = user?.id || null;
            if (currentUserId !== lastUserRef.current) {
                lastUserRef.current = currentUserId;
                
                if (currentUserId) {
                    // New user detected!
                    console.log(`[AuthProvider] User detected: ${currentUserId} via ${event}`);
                    fetchProfile(currentUserId);
                    logLogin(currentUserId).catch(() => {});
                } else {
                    // Sign out detected!
                    setProfile(null);
                }
            } else if (currentUserId && !profile) {
                // Same user but profile missing (refresh case)
                fetchProfile(currentUserId);
            }

            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]); // ONLY depend on supabase client instance

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        clearORCIDUser();
        setUser(null);
        setProfile(null);
        lastUserRef.current = null;
        window.location.href = '/login';
    }, [supabase]);

    const refreshProfile = useCallback(async () => {
        const currentUserId = user?.id || (profile?.id);
        if (currentUserId) {
            await fetchProfile(currentUserId);
        }
    }, [user?.id, profile?.id, fetchProfile]);

    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user,
        profile,
        loading,
        isAdmin: profile?.role === 'admin',
        isOrcidUser: !!profile?.orcid_id,
        refreshProfile,
        signOut,
    }), [user, profile, loading, refreshProfile, signOut]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
