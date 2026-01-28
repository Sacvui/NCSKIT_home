'use client';

/**
 * Admin Role Management Component
 * Allows admins to view, edit, and manage user roles
 */

import { useState, useEffect } from 'react';
import {
    Users, Search, Edit, Shield, ChevronDown, ChevronUp,
    GraduationCap, BookOpen, FileText, Microscope, Award,
    Crown, Building, Zap, UserX, Check, X, Loader2
} from 'lucide-react';
import { USER_ROLES, UserRole, getRoleDisplayName, getRoleColor } from '@/lib/roles-config';
import { PERMISSIONS, PERMISSION_CATEGORIES, PermissionCategory } from '@/lib/permissions-config';
import { getUsersWithRoles, updateUserRole } from '@/lib/use-rbac';

// Icon mapping for roles
const ROLE_ICONS: Record<UserRole, any> = {
    guest: UserX,
    student: GraduationCap,
    graduate_student: BookOpen,
    doctoral_candidate: FileText,
    researcher: Microscope,
    senior_researcher: Award,
    professor: Crown,
    institution_admin: Building,
    platform_admin: Shield,
    super_admin: Zap,
};

interface User {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
    roleDisplay: string;
    level: number;
    last_active: string | null;
    created_at: string;
}

export function AdminRoleManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<UserRole>('student');
    const [saving, setSaving] = useState(false);
    const [expandedPermissions, setExpandedPermissions] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const data = await getUsersWithRoles();
        setUsers(data);
        setLoading(false);
    };

    const handleEditRole = (user: User) => {
        setEditingUser(user.id);
        setSelectedRole(user.role);
    };

    const handleSaveRole = async (userId: string) => {
        setSaving(true);
        const result = await updateUserRole(userId, selectedRole);

        if (result.success) {
            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, role: selectedRole, roleDisplay: USER_ROLES[selectedRole].name, level: USER_ROLES[selectedRole].level }
                    : u
            ));
            setEditingUser(null);
        } else {
            alert('Lỗi: ' + result.error);
        }
        setSaving(false);
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    const togglePermissions = (userId: string) => {
        setExpandedPermissions(expandedPermissions === userId ? null : userId);
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    // Group users by role
    const usersByRole = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2">Đang tải danh sách người dùng...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-blue-600" />
                        Quản lý Roles & Phân quyền
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Quản lý vai trò và quyền hạn của người dùng
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{users.length}</div>
                    <div className="text-sm text-slate-500">Tổng người dùng</div>
                </div>
            </div>

            {/* Role Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(USER_ROLES).slice(1, 6).map(([key, role]) => {
                    const Icon = ROLE_ICONS[key as UserRole];
                    const count = usersByRole[key] || 0;
                    return (
                        <button
                            key={key}
                            onClick={() => setFilterRole(filterRole === key ? 'all' : key as UserRole)}
                            className={`p-3 rounded-xl border transition-all ${filterRole === key
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg bg-${role.color}-100`}>
                                    <Icon className={`w-4 h-4 text-${role.color}-600`} />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-slate-500">{role.name}</div>
                                    <div className="font-bold text-slate-800">{count}</div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo email hoặc tên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Tất cả roles</option>
                    {Object.entries(USER_ROLES).map(([key, role]) => (
                        <option key={key} value={key}>{role.name}</option>
                    ))}
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Người dùng</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Role hiện tại</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Level</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Hoạt động cuối</th>
                            <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map(user => {
                            const Icon = ROLE_ICONS[user.role];
                            const roleConfig = USER_ROLES[user.role];
                            const isEditing = editingUser === user.id;
                            const isExpanded = expandedPermissions === user.id;

                            return (
                                <>
                                    <tr key={user.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <div>
                                                <div className="font-medium text-slate-800">
                                                    {user.full_name || 'Chưa đặt tên'}
                                                </div>
                                                <div className="text-sm text-slate-500">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <select
                                                    value={selectedRole}
                                                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {Object.entries(USER_ROLES).map(([key, role]) => (
                                                        <option key={key} value={key}>
                                                            {role.name} (Level {role.level})
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1.5 rounded-lg bg-${roleConfig.color}-100`}>
                                                        <Icon className={`w-4 h-4 text-${roleConfig.color}-600`} />
                                                    </div>
                                                    <span className="font-medium text-slate-700">{roleConfig.name}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${roleConfig.color}-100 text-${roleConfig.color}-700`}>
                                                Level {user.level}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-500">
                                            {user.last_active
                                                ? new Date(user.last_active).toLocaleDateString('vi-VN')
                                                : 'Chưa có'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveRole(user.id)}
                                                            disabled={saving}
                                                            className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 disabled:opacity-50"
                                                        >
                                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditRole(user)}
                                                            className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                                            title="Chỉnh sửa role"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => togglePermissions(user.id)}
                                                            className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                                                            title="Xem quyền hạn"
                                                        >
                                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Expanded Permissions Row */}
                                    {isExpanded && (
                                        <tr className="bg-slate-50">
                                            <td colSpan={5} className="px-4 py-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {Object.entries(PERMISSION_CATEGORIES).map(([catKey, cat]) => (
                                                        <div key={catKey} className="bg-white rounded-lg p-3 border border-slate-200">
                                                            <div className="font-medium text-slate-700 mb-2">{cat.name}</div>
                                                            <div className="space-y-1">
                                                                {Object.entries(PERMISSIONS)
                                                                    .filter(([_, perm]) => perm.category === catKey)
                                                                    .map(([permKey, perm]) => {
                                                                        const permissions = roleConfig.permissions as readonly string[];
                                                                        const hasAccess = permissions.includes(permKey) ||
                                                                            permissions.includes('*') ||
                                                                            permissions.includes('all_features');
                                                                        return (
                                                                            <div key={permKey} className="flex items-center gap-2">
                                                                                <div className={`w-2 h-2 rounded-full ${hasAccess ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                                                <span className={`text-xs ${hasAccess ? 'text-slate-700' : 'text-slate-400'}`}>
                                                                                    {perm.name}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Không tìm thấy người dùng nào</p>
                    </div>
                )}
            </div>

            {/* Role Legend */}
            <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-700 mb-3">Bảng chú thích vai trò</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    {Object.entries(USER_ROLES).map(([key, role]) => {
                        const Icon = ROLE_ICONS[key as UserRole];
                        return (
                            <div key={key} className="flex items-center gap-2">
                                <Icon className={`w-4 h-4 text-${role.color}-600`} />
                                <div>
                                    <span className="font-medium">{role.name}</span>
                                    <span className="text-slate-400 ml-1">L{role.level}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
