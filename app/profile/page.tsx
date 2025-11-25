"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LanguageProvider, useLanguageContext } from "../components/LanguageProvider";
import { AuthProvider } from "../components/AuthProvider";
import { motion } from "framer-motion";

export default function ProfilePage() {
    return (
        <LanguageProvider>
            <ProfilePageContent />
        </LanguageProvider>
    );
}

function ProfilePageContent() {
    const { copy } = useLanguageContext();
    const { nav, headerCtas } = copy;
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated" && session) {
            fetchProfile();
        }
    }, [status, session, router]);

    const fetchProfile = async () => {
        try {
            const response = await fetch("/api/auth/profile");
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            setError("Failed to load profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSaving(true);

        // Validate passwords if changing
        if (formData.newPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                setError("New passwords do not match");
                setIsSaving(false);
                return;
            }
            if (formData.newPassword.length < 6) {
                setError("Password must be at least 6 characters long");
                setIsSaving(false);
                return;
            }
            if (!formData.currentPassword) {
                setError("Current password is required to change password");
                setIsSaving(false);
                return;
            }
        }

        try {
            const response = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    currentPassword: formData.currentPassword || undefined,
                    newPassword: formData.newPassword || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to update profile");
            } else {
                setSuccess("Profile updated successfully!");
                setProfile(data.user);
                setIsEditing(false);
                setFormData({
                    ...formData,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            setError("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <>
                <Header nav={nav} headerCtas={headerCtas} />
                <main className="min-h-screen pt-24 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading profile...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <>
            <Header nav={nav} headerCtas={headerCtas} />
            <main className="min-h-screen pt-24 pb-20">
                <div className="container max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                                <p className="text-gray-500 mt-1">Manage your account information</p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    ) : (
                                        <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    ) : (
                                        <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.email}</p>
                                    )}
                                </div>
                            </div>

                            {profile.role && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg inline-block">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                                            {profile.role}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {isEditing && (
                                <>
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={formData.currentPassword}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, currentPassword: e.target.value })
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Leave empty if not changing password"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={formData.newPassword}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, newPassword: e.target.value })
                                                        }
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="At least 6 characters"
                                                        minLength={6}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={formData.confirmPassword}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, confirmPassword: e.target.value })
                                                        }
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Re-enter new password"
                                                        minLength={6}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setError(null);
                                                setSuccess(null);
                                                fetchProfile();
                                            }}
                                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Member since:</span>
                                    <span className="ml-2 text-gray-900">
                                        {new Date(profile.createdAt || profile.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Account status:</span>
                                    <span className={`ml-2 font-medium ${profile.isActive !== false ? "text-green-600" : "text-red-600"}`}>
                                        {profile.isActive !== false ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}

