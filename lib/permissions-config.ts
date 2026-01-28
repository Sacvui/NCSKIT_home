/**
 * Permissions Configuration
 * Defines all available permissions in the system
 */

// All available permissions
export const PERMISSIONS = {
    // Analysis permissions
    'basic_analysis': {
        id: 'basic_analysis',
        name: 'Phân tích cơ bản',
        nameEn: 'Basic Analysis',
        category: 'analysis',
        description: 'Descriptive stats, Cronbach\'s Alpha, Correlation',
    },
    'advanced_analysis': {
        id: 'advanced_analysis',
        name: 'Phân tích nâng cao',
        nameEn: 'Advanced Analysis',
        category: 'analysis',
        description: 'EFA, Regression, T-Test, ANOVA',
    },
    'sem_cfa': {
        id: 'sem_cfa',
        name: 'SEM/CFA',
        nameEn: 'SEM/CFA Analysis',
        category: 'analysis',
        description: 'Structural Equation Modeling, Confirmatory Factor Analysis',
    },
    'mediation': {
        id: 'mediation',
        name: 'Phân tích trung gian',
        nameEn: 'Mediation Analysis',
        category: 'analysis',
        description: 'Mediation and Moderation Analysis',
    },
    'batch_analysis': {
        id: 'batch_analysis',
        name: 'Phân tích hàng loạt',
        nameEn: 'Batch Analysis',
        category: 'analysis',
        description: 'Run multiple analyses at once',
    },

    // Data permissions
    'upload_data': {
        id: 'upload_data',
        name: 'Tải lên dữ liệu',
        nameEn: 'Upload Data',
        category: 'data',
        description: 'Upload CSV/Excel files',
    },
    'view_results': {
        id: 'view_results',
        name: 'Xem kết quả',
        nameEn: 'View Results',
        category: 'data',
        description: 'View analysis results',
    },
    'view_demo': {
        id: 'view_demo',
        name: 'Xem demo',
        nameEn: 'View Demo',
        category: 'data',
        description: 'View demo data and results',
    },

    // Export permissions
    'export_word': {
        id: 'export_word',
        name: 'Xuất Word',
        nameEn: 'Export Word',
        category: 'export',
        description: 'Export results to Word format',
    },
    'export_pdf': {
        id: 'export_pdf',
        name: 'Xuất PDF',
        nameEn: 'Export PDF',
        category: 'export',
        description: 'Export results to PDF format',
    },

    // AI permissions
    'ai_interpretation': {
        id: 'ai_interpretation',
        name: 'Diễn giải AI',
        nameEn: 'AI Interpretation',
        category: 'ai',
        description: 'Get AI-powered result interpretations',
    },
    'manuscript_preview': {
        id: 'manuscript_preview',
        name: 'Xem trước bản thảo',
        nameEn: 'Manuscript Preview',
        category: 'ai',
        description: 'Generate manuscript previews',
    },

    // Team permissions
    'student_management': {
        id: 'student_management',
        name: 'Quản lý sinh viên',
        nameEn: 'Student Management',
        category: 'team',
        description: 'Manage student accounts under supervision',
    },
    'team_workspace': {
        id: 'team_workspace',
        name: 'Workspace nhóm',
        nameEn: 'Team Workspace',
        category: 'team',
        description: 'Create and manage team workspaces',
    },

    // API permissions
    'api_access': {
        id: 'api_access',
        name: 'Truy cập API',
        nameEn: 'API Access',
        category: 'api',
        description: 'Access ncsStat API for automation',
    },

    // Admin permissions
    'admin_panel': {
        id: 'admin_panel',
        name: 'Bảng quản trị',
        nameEn: 'Admin Panel',
        category: 'admin',
        description: 'Access admin dashboard',
    },
    'user_management': {
        id: 'user_management',
        name: 'Quản lý người dùng',
        nameEn: 'User Management',
        category: 'admin',
        description: 'Manage user accounts and roles',
    },
    'system_config': {
        id: 'system_config',
        name: 'Cấu hình hệ thống',
        nameEn: 'System Config',
        category: 'admin',
        description: 'Configure system settings',
    },
    'institution_stats': {
        id: 'institution_stats',
        name: 'Thống kê cơ sở',
        nameEn: 'Institution Stats',
        category: 'admin',
        description: 'View institution-wide statistics',
    },
    'bulk_invite': {
        id: 'bulk_invite',
        name: 'Mời hàng loạt',
        nameEn: 'Bulk Invite',
        category: 'admin',
        description: 'Send bulk invitation emails',
    },
    'license_management': {
        id: 'license_management',
        name: 'Quản lý license',
        nameEn: 'License Management',
        category: 'admin',
        description: 'Manage institutional licenses',
    },
    'all_features': {
        id: 'all_features',
        name: 'Tất cả tính năng',
        nameEn: 'All Features',
        category: 'admin',
        description: 'Access all platform features',
    },
} as const;

export type PermissionId = keyof typeof PERMISSIONS;

// Permission categories
export const PERMISSION_CATEGORIES = {
    analysis: { name: 'Phân tích', nameEn: 'Analysis', icon: 'BarChart3' },
    data: { name: 'Dữ liệu', nameEn: 'Data', icon: 'Database' },
    export: { name: 'Xuất file', nameEn: 'Export', icon: 'Download' },
    ai: { name: 'AI', nameEn: 'AI', icon: 'Sparkles' },
    team: { name: 'Nhóm', nameEn: 'Team', icon: 'Users' },
    api: { name: 'API', nameEn: 'API', icon: 'Code' },
    admin: { name: 'Quản trị', nameEn: 'Admin', icon: 'Shield' },
} as const;

export type PermissionCategory = keyof typeof PERMISSION_CATEGORIES;

// Get permissions by category
export function getPermissionsByCategory(category: PermissionCategory): PermissionId[] {
    return Object.keys(PERMISSIONS).filter(
        key => PERMISSIONS[key as PermissionId].category === category
    ) as PermissionId[];
}

// Get all permission IDs
export function getAllPermissionIds(): PermissionId[] {
    return Object.keys(PERMISSIONS) as PermissionId[];
}
