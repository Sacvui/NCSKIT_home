import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AdminSidebar from './components/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // Server-side Auth Check
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login?next=/admin')
    }

    // Role-based Access Control (RBAC) Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const userRole = profile?.role || user.user_metadata?.role || user.app_metadata?.role || 'student'
    const adminRoles = ['platform_admin', 'super_admin', 'institution_admin', 'admin']

    if (!adminRoles.includes(userRole)) {
        console.warn(`[Admin Guard] User ${user.id} denied access with role: ${userRole}`)
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 min-h-screen overflow-y-auto">
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
