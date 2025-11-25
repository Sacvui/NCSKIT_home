"use client";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ProjectDashboard } from "../components/ProjectDashboard";
import { InteractiveAnalysis } from "../components/InteractiveAnalysis";
import { LanguageProvider, useLanguageContext } from "../components/LanguageProvider";

export default function FeaturesPage() {
  return (
    <LanguageProvider>
      <FeaturesContent />
    </LanguageProvider>
  );
}

function FeaturesContent() {
  const { copy } = useLanguageContext();
  const { nav, headerCtas, features } = copy;

  return (
    <>
      <Header nav={nav} headerCtas={headerCtas} />
      <main>
        <section className="section features" style={{ paddingTop: "6rem" }}>
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{features.eyebrow}</p>
              <h1>{features.title}</h1>
              <p>{features.description}</p>
            </div>
            <ProjectDashboard />
            <div className="feature-grid">
              {features.list.map((feature, index) => (
                <article key={feature.title} className="component-card">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <ul>
                    {feature.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="interactive-showcase">
              <InteractiveAnalysis mode="chart" initialView="overview" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

