"use client";

import { StatusBoard } from "./components/StatusBoard";
import { InteractiveAnalysis } from "./components/InteractiveAnalysis";
import { ProjectDashboard } from "./components/ProjectDashboard";
import { SEMResearchSection } from "./components/SEMResearchSection";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LanguageProvider, useLanguageContext } from "./components/LanguageProvider";



export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}

function HomeContent() {
  const { copy } = useLanguageContext();
  const {
    nav,
    headerCtas,
    hero,
    status,
    features,
  } = copy;

  return (
    <>
      <Header nav={nav} headerCtas={headerCtas} />

      <main>
        <section id="hero" className="hero">
          <div className="container hero-container">
            <div className="hero-content">
              <h1 className="hero-title">{hero.title}</h1>
              <p className="hero-subtitle">{hero.lede}</p>
              <div className="hero-actions">
                <a className="primary-btn hero-cta" href="/docs/ARCHITECTURE.md" download>
                  Download NCSKIT IDE
                </a>
                <a className="secondary-btn" href="#modules">
                  Explore Features
                </a>
              </div>
            </div>
            <div className="hero-demo">
              <div className="demo-container">
                <div className="demo-header">
                  <span className="demo-dot" />
                  <span className="demo-dot" />
                  <span className="demo-dot" />
                  <span className="demo-title">NCSKIT IDE Preview</span>
                </div>
                <div className="demo-content">
                  <StatusBoard columns={status.columns} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="modules" className="section features">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{features.eyebrow}</p>
              <h2>{features.title}</h2>
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

            {/* Interactive Analysis Showcase - Only one, but WOW */}
            {features.list.length > 0 && (
              <div className="interactive-showcase">
                <InteractiveAnalysis mode="chart" initialView="overview" />
              </div>
            )}
          </div>
        </section>

        {/* Comprehensive Statistical Analysis Section */}
        <section id="statistical-analysis" className="section">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Data Analysis Hub</p>
              <h2>Comprehensive Statistical Analysis</h2>
              <p>R & Python libraries choreographed for evidence-based publishing. Explore detailed statistical metrics including descriptive statistics, reliability analysis, validity tests, distribution checks, and correlation matrices.</p>
            </div>
            <InteractiveAnalysis mode="table" initialView="overview" />
          </div>
        </section>

        {/* SEM Research Section - Professional Q1 Research Model */}
        <SEMResearchSection />
      </main>

      <Footer />
    </>
  );
}

