"use client";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LanguageProvider, useLanguageContext } from "../components/LanguageProvider";
import { motion } from "framer-motion";

export default function ResourcesPage() {
    return (
        <LanguageProvider>
            <ResourcesPageContent />
        </LanguageProvider>
    );
}

function ResourcesPageContent() {
    const { copy } = useLanguageContext();
    const { nav, headerCtas, resources } = copy;

    return (
        <>
            <Header nav={nav} headerCtas={headerCtas} />
            <main className="pt-24 pb-20">
                <section className="container">
                    <div className="section-head">
                        <p className="eyebrow">{resources.eyebrow}</p>
                        <h2>{resources.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.cards.map((card, index) => (
                            <motion.a
                                key={card.title}
                                href={card.href}
                                className="component-card p-6 block hover:border-blue-500 transition-colors group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                download={card.download}
                            >
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{card.title}</h3>
                                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{card.description}</p>
                                <div className="flex items-center text-sm font-semibold text-blue-600">
                                    {card.label}
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
