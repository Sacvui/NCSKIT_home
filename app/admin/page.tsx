"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LanguageProvider, useLanguageContext } from "../components/LanguageProvider";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
    return (
        <LanguageProvider>
            <AdminDashboardContent />
        </LanguageProvider>
    );
}

function AdminDashboardContent() {
    const { copy } = useLanguageContext();
    const { nav, headerCtas } = copy;
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && session?.user?.role !== "admin") {
            router.push("/dashboard");
        }
    }, [status, session, router]);

    if (status === "loading" || !session?.user || session.user.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const adminCards = [
        {
            title: "User Management",
            description: "View users, manage roles, and assign credits.",
            href: "/admin/users",
            icon: "👥",
            color: "blue"
        },
        {
            title: "System Settings",
            description: "Configure global application settings.",
            href: "/admin/settings",
            icon: "⚙️",
            color: "gray"
        },
        {
            title: "Content Management",
            description: "Manage blog posts and resources.",
            href: "/admin/content",
            icon: "📝",
            color: "green"
        }
    ];

    return (
        <>
            <Header nav={nav} headerCtas={headerCtas} />
            <main className="min-h-screen pt-24 pb-20 bg-gray-50">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {session.user.name}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {adminCards.map((card, index) => (
                            <Link key={card.title} href={card.href}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full"
                                >
                                    <div className={`w-12 h-12 bg-${card.color}-100 rounded-lg flex items-center justify-center text-2xl mb-4`}>
                                        {card.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                                    <p className="text-gray-600">{card.description}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
