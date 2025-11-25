"use client";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CoreTeam } from "../components/CoreTeam";
import { LanguageProvider, useLanguageContext } from "../components/LanguageProvider";

export default function TeamPage() {
    return (
        <LanguageProvider>
            <TeamPageContent />
        </LanguageProvider>
    );
}

function TeamPageContent() {
    const { copy } = useLanguageContext();
    const { nav, headerCtas } = copy;

    return (
        <>
            <Header nav={nav} headerCtas={headerCtas} />
            <main className="pt-20">
                <CoreTeam />
            </main>
            <Footer />
        </>
    );
}
