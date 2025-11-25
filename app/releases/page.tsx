"use client";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LanguageProvider, useLanguageContext } from "../components/LanguageProvider";
import { motion } from "framer-motion";

export default function ReleasesPage() {
    return (
        <LanguageProvider>
            <ReleasesPageContent />
        </LanguageProvider>
    );
}

function ReleasesPageContent() {
    const { copy } = useLanguageContext();
    const { nav, headerCtas, changelog } = copy;

    return (
        <>
            <Header nav={nav} headerCtas={headerCtas} />
            <main className="pt-24 pb-20">
                <section className="container max-w-4xl">
                    <div className="section-head">
                        <p className="eyebrow">{changelog.eyebrow}</p>
                        <h2>{changelog.title}</h2>
                        <p>{changelog.description}</p>
                    </div>

                    <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-200">
                        {changelog.entries.map((entry, index) => (
                            <motion.div
                                key={entry.version}
                                className="relative pl-12"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="absolute left-0 top-1 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10">
                                    <span className="text-xs font-bold text-blue-600">v{entry.version}</span>
                                </div>
                                <div className="component-card p-6">
                                    <div className="flex flex-wrap items-baseline justify-between gap-4 mb-2">
                                        <h3 className="text-lg font-bold">Version {entry.version}</h3>
                                        <span className="text-sm text-gray-500 font-mono">{entry.date}</span>
                                    </div>
                                    <p className="text-gray-700">{entry.summary}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
