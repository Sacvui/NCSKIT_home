"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LanguageProvider, useLanguageContext } from "../components/LanguageProvider";
import { AuthProvider } from "../components/AuthProvider";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <LanguageProvider>
            <DashboardPageContent />
        </LanguageProvider>
    );
}

function DashboardPageContent() {
    const { copy } = useLanguageContext();
    const { nav, headerCtas } = copy;
    const { data: session, status } = useSession();
    const router = useRouter();
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <>
                <Header nav={nav} headerCtas={headerCtas} />
                <main className="min-h-screen pt-24 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading dashboard...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!session?.user) {
        return null;
    }

    const stats = [
        { label: "Research Projects", value: "0", icon: "📊", color: "blue" },
        { label: "Data Analyses", value: "0", icon: "📈", color: "green" },
        { label: "Published Papers", value: "0", icon: "📝", color: "purple" },
        { label: "Collaborations", value: "0", icon: "👥", color: "orange" },
    ];

    const quickActions = [
        { title: "Create New Project", description: "Start a new research project", href: "#", icon: "➕" },
        { title: "Upload Data", description: "Import your research data", href: "#", icon: "📤" },
        { title: "Run Analysis", description: "Perform statistical analysis", href: "#", icon: "🔬" },
        { title: "View Reports", description: "Browse your research reports", href: "#", icon: "📑" },
    ];

    return (
        <>
            <Header nav={nav} headerCtas={headerCtas} />
            <main className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="container max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome back, {session.user.name?.split(" ")[0]}! 👋
                        </h1>
                        <p className="text-gray-600">Here&apos;s your research dashboard overview</p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`text-3xl p-3 rounded-lg bg-${stat.color}-100`}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={action.title}
                                    href={action.href}
                                    className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                                >
                                    <div className="text-3xl mb-3">{action.icon}</div>
                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{action.description}</p>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Comprehensive Statistical Analysis */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 cursor-pointer" onClick={() => setExpandedItems(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has('analysis')) newSet.delete('analysis'); else newSet.add('analysis');
                            return newSet;
                        })}>Comprehensive Statistical Analysis {expandedItems.has('analysis') ? '▲' : '▼'}</h2>
                        {expandedItems.has('analysis') && (
                            <div className="text-gray-700">
                                <p>Here you can display detailed statistical analysis results, charts, and tables. This placeholder can be replaced with actual components such as Recharts or custom visualizations.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Scientific Interpretation Guide */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 cursor-pointer" onClick={() => setExpandedItems(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has('guide')) newSet.delete('guide'); else newSet.add('guide');
                            return newSet;
                        })}>Scientific Interpretation Guide {expandedItems.has('guide') ? '▲' : '▼'}</h2>
                        {expandedItems.has('guide') && (
                            <div className="text-gray-700">
                                <p>This section provides guidance on interpreting the statistical results, offering explanations, confidence intervals, and practical implications.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Structural Equation Modeling (SEM) Results */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 cursor-pointer" onClick={() => setExpandedItems(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has('sem')) newSet.delete('sem'); else newSet.add('sem');
                            return newSet;
                        })}>Structural Equation Modeling (SEM) Results {expandedItems.has('sem') ? '▲' : '▼'}</h2>
                        {expandedItems.has('sem') && (
                            <div className="text-gray-700">
                                <p>Display SEM model fit indices, path coefficients, and visual diagram. Replace this placeholder with a proper SEM visualization component.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
