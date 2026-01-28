'use client';

/**
 * Role-Based Access Control Hook
 * Provides permission checking and role management
 */

import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/utils/supabase/client';
import { USER_ROLES, UserRole, hasPermission, mapLegacyRole } from './roles-config';
import { PermissionId } from './permissions-config';

interface RBACState {
    isLoading: boolean;
    userId: string | null;
    role: UserRole;
    permissions: string[];
    tokenMultiplier: number;
    dailyLimit: number;
}

interface UseRBACReturn extends RBACState {
    // Permission checks
    can: (permission: PermissionId) => boolean;
    canAny: (permissions: PermissionId[]) => boolean;
    canAll: (permissions: PermissionId[]) => boolean;

    // Role checks
    isAtLeast: (minimumRole: UserRole) => boolean;
    isAdmin: () => boolean;
    isSuperAdmin: () => boolean;

    // Actions
    refreshRole: () => Promise<void>;
}

export function useRBAC(): UseRBACReturn {
    const [state, setState] = useState<RBACState>({
        isLoading: true,
        userId: null,
        role: 'guest',
        permissions: [],
        tokenMultiplier: 0,
        dailyLimit: 0,
    });

    const loadUserRole = useCallback(async () => {
        const supabase = getSupabase();

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setState({
                    isLoading: false,
                    userId: null,
                    role: 'guest',
                    permissions: [...USER_ROLES.guest.permissions],
                    tokenMultiplier: 0,
                    dailyLimit: 0,
                });
                return;
            }

            // Get user profile with role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            // Map legacy roles or use new role
            let userRole: UserRole = 'student';
            if (profile?.role) {
                // Check if it's a legacy role
                if (['user', 'researcher', 'admin'].includes(profile.role)) {
                    userRole = mapLegacyRole(profile.role);
                } else if (profile.role in USER_ROLES) {
                    userRole = profile.role as UserRole;
                }
            }

            const roleConfig = USER_ROLES[userRole];

            setState({
                isLoading: false,
                userId: user.id,
                role: userRole,
                permissions: [...roleConfig.permissions],
                tokenMultiplier: roleConfig.tokenMultiplier,
                dailyLimit: roleConfig.dailyLimit,
            });
        } catch (err) {
            console.error('[useRBAC] Error loading role:', err);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    useEffect(() => {
        loadUserRole();
    }, [loadUserRole]);

    // Permission check functions
    const can = useCallback((permission: PermissionId): boolean => {
        if (state.permissions.includes('*')) return true;
        if (state.permissions.includes('all_features')) return true;
        return hasPermission(state.role, permission);
    }, [state.role, state.permissions]);

    const canAny = useCallback((permissions: PermissionId[]): boolean => {
        return permissions.some(p => can(p));
    }, [can]);

    const canAll = useCallback((permissions: PermissionId[]): boolean => {
        return permissions.every(p => can(p));
    }, [can]);

    // Role level checks
    const isAtLeast = useCallback((minimumRole: UserRole): boolean => {
        const currentLevel = USER_ROLES[state.role]?.level || 0;
        const requiredLevel = USER_ROLES[minimumRole]?.level || 0;
        return currentLevel >= requiredLevel;
    }, [state.role]);

    const isAdmin = useCallback((): boolean => {
        return isAtLeast('platform_admin');
    }, [isAtLeast]);

    const isSuperAdmin = useCallback((): boolean => {
        return state.role === 'super_admin';
    }, [state.role]);

    return {
        ...state,
        can,
        canAny,
        canAll,
        isAtLeast,
        isAdmin,
        isSuperAdmin,
        refreshRole: loadUserRole,
    };
}

/**
 * Server-side permission check logic has been moved to './rbac-server.ts'
 * to avoid importing 'next/headers' in a client component.
 */

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
    userId: string,
    newRole: UserRole
): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabase();

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

/**
 * Get all users with their roles (admin only)
 */
export async function getUsersWithRoles(): Promise<{
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
    roleDisplay: string;
    level: number;
    last_active: string | null;
    created_at: string;
}[]> {
    const supabase = getSupabase();

    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, last_active, created_at')
        .order('created_at', { ascending: false });

    if (error || !data) {
        console.error('[RBAC] Error fetching users:', error);
        return [];
    }

    return data.map((user: any) => {
        let role: UserRole = 'student';
        if (user.role) {
            if (['user', 'researcher', 'admin'].includes(user.role)) {
                role = mapLegacyRole(user.role);
            } else if (user.role in USER_ROLES) {
                role = user.role as UserRole;
            }
        }

        return {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role,
            roleDisplay: USER_ROLES[role].name,
            level: USER_ROLES[role].level,
            last_active: user.last_active,
            created_at: user.created_at,
        };
    });
}
