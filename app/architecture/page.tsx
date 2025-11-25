"use client";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ArchitectureTabs } from "../components/ArchitectureTabs";
import { ModuleCapabilities } from "../components/ModuleCapabilities";
import { LanguageProvider, useLanguageContext } from "../components/LanguageProvider";

export default function ArchitecturePage() {
  return (
    <LanguageProvider>
      <ArchitectureContent />
    </LanguageProvider>
  );
}

function ArchitectureContent() {
  const { copy } = useLanguageContext();
  const { nav, headerCtas, architecture } = copy;

  return (
    <>
      <Header nav={nav} headerCtas={headerCtas} />
      <main>
        <section className="section architecture" style={{ paddingTop: "6rem" }}>
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{architecture.eyebrow}</p>
              <h1>{architecture.title}</h1>
              <p>{architecture.description}</p>
            </div>
            <ModuleCapabilities />
            <div className="architecture-grid">
              <div>
                <ArchitectureTabs tabs={architecture.tabs} />
              </div>
              <div className="architecture-card component-card">
                <h3>{architecture.techStackTitle}</h3>
                <dl>
                  {architecture.techStack.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

