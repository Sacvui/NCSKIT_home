import { PermissionId } from './permissions-config';
import { USER_ROLES, UserRole, hasPermission, mapLegacyRole } from './roles-config';
import { createClient } from '@/utils/supabase/server';

/**
 * Server-side permission check
 * Use this ONLY in Server Components or API Routes
 */
export async function checkPermissionServer(
    userId: string,
    permission: PermissionId
): Promise<boolean> {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    if (!profile?.role) return false;

    let userRole: UserRole = 'student';
    if (['user', 'researcher', 'admin'].includes(profile.role)) {
        userRole = mapLegacyRole(profile.role);
    } else if (profile.role in USER_ROLES) {
        userRole = profile.role as UserRole;
    }

    return hasPermission(userRole, permission);
}
