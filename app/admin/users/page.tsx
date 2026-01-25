'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientOnly } from '@/utils/supabase/client-only'
import UsersTable from '@/components/admin/UsersTable'
import { Loader2 } from 'lucide-react'

export default function AdminUsersPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClientOnly()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login?next=/admin/users')
                return
            }

            // Check Admin Role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role !== 'admin') {
                router.push('/')
                return
            }

            setIsAuthorized(true)
            setIsLoading(false)
        }

        checkAuth()
    }, [router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!isAuthorized) return null

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Quản lý người dùng</h1>
                <p className="text-slate-500 text-sm">Danh sách tài khoản và hồ sơ học thuật của thành viên.</p>
            </div>

            <UsersTable />
        </div>
    )
}
