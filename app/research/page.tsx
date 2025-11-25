"use client";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SEMResearchSection } from "../components/SEMResearchSection";
import { LanguageProvider, useLanguageContext } from "../components/LanguageProvider";

export default function ResearchPage() {
  return (
    <LanguageProvider>
      <ResearchContent />
    </LanguageProvider>
  );
}

function ResearchContent() {
  const { copy } = useLanguageContext();
  const { nav, headerCtas } = copy;

  return (
    <>
      <Header nav={nav} headerCtas={headerCtas} />
      <main>
        <section className="section" style={{ paddingTop: "6rem" }}>
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Research Capabilities</p>
              <h1>Advanced Research Methodologies</h1>
              <p>
                NCSKIT supports comprehensive research workflows including quantitative analysis,
                Structural Equation Modeling (SEM), and automated research processes.
              </p>
            </div>
          </div>
        </section>
        <SEMResearchSection />
      </main>
      <Footer />
    </>
  );
}

