"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { LanguageProvider, useLanguageContext } from "../../components/LanguageProvider";
import { motion } from "framer-motion";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    credits: number;
    createdAt: string;
    isActive: boolean;
};

export default function UserManagementPage() {
    return (
        <LanguageProvider>
            <UserManagementContent />
        </LanguageProvider>
    );
}

function UserManagementContent() {
    const { copy } = useLanguageContext();
    const { nav, headerCtas } = copy;
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && session?.user?.role !== "admin") {
            router.push("/dashboard");
        } else if (status === "authenticated") {
            fetchUsers();
        }
    }, [status, session, router]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError("Error loading users");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = async (userId: number, updates: Partial<User>) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            if (!res.ok) throw new Error("Failed to update user");

            setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
        } catch (err) {
            alert("Failed to update user");
            console.error(err);
        }
    };

    if (status === "loading" || !session?.user || session.user.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <Header nav={nav} headerCtas={headerCtas} />
            <main className="min-h-screen pt-24 pb-20 bg-gray-50">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                            <p className="text-gray-600">Manage user access and credits</p>
                        </div>
                        <button
                            onClick={fetchUsers}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                        >
                            Refresh List
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">Loading users...</div>
                    ) : error ? (
                        <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-gray-900">User</th>
                                            <th className="px-6 py-4 font-semibold text-gray-900">Role</th>
                                            <th className="px-6 py-4 font-semibold text-gray-900">Credits</th>
                                            <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                                            <th className="px-6 py-4 font-semibold text-gray-900">Joined</th>
                                            <th className="px-6 py-4 font-semibold text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50/50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-gray-500">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                                                        className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm"
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono">{user.credits}</span>
                                                        <button
                                                            onClick={() => {
                                                                const amount = prompt("Enter new credit amount:", user.credits.toString());
                                                                if (amount !== null && !isNaN(Number(amount))) {
                                                                    handleUpdateUser(user.id, { credits: Number(amount) });
                                                                }
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800 text-xs"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                        }`}>
                                                        {user.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleUpdateUser(user.id, { isActive: !user.isActive })}
                                                        className={`text-sm font-medium ${user.isActive ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"
                                                            }`}
                                                    >
                                                        {user.isActive ? "Deactivate" : "Activate"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
