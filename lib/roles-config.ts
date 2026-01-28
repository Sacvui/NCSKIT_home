/**
 * Academic User Roles Configuration
 * Defines user tiers with permissions and tokenomics multipliers
 */

export const USER_ROLES = {
    // Guest - Unregistered visitors
    guest: {
        id: 'guest',
        name: 'Khách',
        nameEn: 'Guest',
        level: 0,
        permissions: ['view_demo'],
        tokenMultiplier: 0,
        dailyLimit: 0,
        color: 'gray',
        icon: 'UserX',
    },

    // Student - Unverified students
    student: {
        id: 'student',
        name: 'Sinh viên',
        nameEn: 'Student',
        level: 1,
        permissions: ['basic_analysis', 'upload_data', 'view_results'],
        tokenMultiplier: 1,
        dailyLimit: 10,
        color: 'blue',
        icon: 'GraduationCap',
    },

    // Graduate Student - Master's students
    graduate_student: {
        id: 'graduate_student',
        name: 'Học viên Cao học',
        nameEn: 'Graduate Student',
        level: 2,
        permissions: ['basic_analysis', 'advanced_analysis', 'upload_data', 'view_results', 'export_word'],
        tokenMultiplier: 1.2,
        dailyLimit: 20,
        color: 'cyan',
        icon: 'BookOpen',
    },

    // Doctoral Candidate - PhD students
    doctoral_candidate: {
        id: 'doctoral_candidate',
        name: 'Nghiên cứu sinh',
        nameEn: 'Doctoral Candidate',
        level: 3,
        permissions: [
            'basic_analysis', 'advanced_analysis', 'sem_cfa',
            'upload_data', 'view_results', 'export_word', 'export_pdf',
            'ai_interpretation'
        ],
        tokenMultiplier: 1.5,
        dailyLimit: 50,
        color: 'indigo',
        icon: 'FileText',
    },

    // Researcher - Post-doctoral / Independent researchers
    researcher: {
        id: 'researcher',
        name: 'Nhà nghiên cứu',
        nameEn: 'Researcher',
        level: 4,
        permissions: [
            'basic_analysis', 'advanced_analysis', 'sem_cfa', 'mediation',
            'upload_data', 'view_results', 'export_word', 'export_pdf',
            'ai_interpretation', 'manuscript_preview'
        ],
        tokenMultiplier: 2,
        dailyLimit: 100,
        color: 'purple',
        icon: 'Microscope',
    },

    // Senior Researcher - Established researchers
    senior_researcher: {
        id: 'senior_researcher',
        name: 'Nghiên cứu viên cao cấp',
        nameEn: 'Senior Researcher',
        level: 5,
        permissions: [
            'basic_analysis', 'advanced_analysis', 'sem_cfa', 'mediation',
            'upload_data', 'view_results', 'export_word', 'export_pdf',
            'ai_interpretation', 'manuscript_preview', 'batch_analysis',
            'api_access'
        ],
        tokenMultiplier: 2.5,
        dailyLimit: 200,
        color: 'violet',
        icon: 'Award',
    },

    // Professor - Faculty members
    professor: {
        id: 'professor',
        name: 'Giáo sư / Giảng viên',
        nameEn: 'Professor',
        level: 6,
        permissions: [
            'basic_analysis', 'advanced_analysis', 'sem_cfa', 'mediation',
            'upload_data', 'view_results', 'export_word', 'export_pdf',
            'ai_interpretation', 'manuscript_preview', 'batch_analysis',
            'api_access', 'student_management', 'team_workspace'
        ],
        tokenMultiplier: 3,
        dailyLimit: 500,
        color: 'amber',
        icon: 'Crown',
    },

    // Institution Admin - University/Institute administrators
    institution_admin: {
        id: 'institution_admin',
        name: 'Quản trị viên cơ sở',
        nameEn: 'Institution Admin',
        level: 7,
        permissions: [
            'all_features', 'user_management', 'institution_stats',
            'bulk_invite', 'license_management'
        ],
        tokenMultiplier: 5,
        dailyLimit: -1, // Unlimited
        color: 'orange',
        icon: 'Building',
    },

    // Platform Admin - NCStat platform administrators
    platform_admin: {
        id: 'platform_admin',
        name: 'Quản trị viên hệ thống',
        nameEn: 'Platform Admin',
        level: 8,
        permissions: ['all_features', 'admin_panel', 'system_config', 'user_management'],
        tokenMultiplier: 10,
        dailyLimit: -1,
        color: 'red',
        icon: 'Shield',
    },

    // Super Admin - Full system access
    super_admin: {
        id: 'super_admin',
        name: 'Siêu quản trị',
        nameEn: 'Super Admin',
        level: 9,
        permissions: ['*'], // All permissions
        tokenMultiplier: -1, // Unlimited
        dailyLimit: -1,
        color: 'rose',
        icon: 'Zap',
    },
} as const;

export type UserRole = keyof typeof USER_ROLES;

// Get role by level
export function getRoleByLevel(level: number): UserRole | null {
    for (const [key, role] of Object.entries(USER_ROLES)) {
        if (role.level === level) return key as UserRole;
    }
    return null;
}

// Check if role has permission
export function hasPermission(role: UserRole, permission: string): boolean {
    const roleConfig = USER_ROLES[role];
    if (!roleConfig) return false;
    const permissions = roleConfig.permissions as readonly string[];
    if (permissions.includes('*')) return true;
    if (permissions.includes('all_features')) return true;
    return permissions.includes(permission);
}

// Get available roles for selection (excludes admin roles for regular users)
export function getSelectableRoles(currentRole: UserRole): UserRole[] {
    const currentLevel = USER_ROLES[currentRole]?.level || 0;

    return Object.keys(USER_ROLES).filter(role => {
        const roleLevel = USER_ROLES[role as UserRole].level;
        // Users can only select roles up to their current level
        // Admin can assign any role
        return currentLevel >= 7 ? true : roleLevel <= currentLevel;
    }) as UserRole[];
}

// Role display helpers
export function getRoleDisplayName(role: UserRole, locale: 'vi' | 'en' = 'vi'): string {
    const roleConfig = USER_ROLES[role];
    return locale === 'vi' ? roleConfig.name : roleConfig.nameEn;
}

export function getRoleColor(role: UserRole): string {
    return USER_ROLES[role]?.color || 'gray';
}

// Legacy role mapping (backward compatibility)
export const LEGACY_ROLE_MAP: Record<string, UserRole> = {
    'user': 'student',
    'researcher': 'researcher',
    'admin': 'platform_admin',
};

export function mapLegacyRole(legacyRole: string): UserRole {
    return LEGACY_ROLE_MAP[legacyRole] || 'student';
}
