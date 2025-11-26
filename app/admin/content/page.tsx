"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { LanguageProvider, useLanguageContext } from "../../components/LanguageProvider";

export default function AdminContentPage() {
    return (
        <LanguageProvider>
            <AdminContentContent />
        </LanguageProvider>
    );
}

function AdminContentContent() {
    const { copy } = useLanguageContext();
    const { nav, headerCtas } = copy;

    return (
        <>
            <Header nav={nav} headerCtas={headerCtas} />
            <main className="min-h-screen pt-24 pb-20 bg-gray-50">
                <div className="container max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Content Management</h1>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-gray-600">Blog posts and resource management will be available here.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
