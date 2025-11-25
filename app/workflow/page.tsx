"use client";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InteractiveAnalysis } from "../components/InteractiveAnalysis";
import { LanguageProvider, useLanguageContext } from "../components/LanguageProvider";

export default function WorkflowPage() {
  return (
    <LanguageProvider>
      <WorkflowContent />
    </LanguageProvider>
  );
}

function WorkflowContent() {
  const { copy } = useLanguageContext();
  const { nav, headerCtas, workflow, automation } = copy;

  return (
    <>
      <Header nav={nav} headerCtas={headerCtas} />
      <main>
        <section className="section workflow" style={{ paddingTop: "6rem" }} id="workflow-section">
          <div className="container workflow-grid">
            <div>
              <div className="section-head">
                <p className="eyebrow">{workflow.eyebrow}</p>
                <h1>{workflow.title}</h1>
                <p>{workflow.description}</p>
              </div>
              <ul className="workflow-list">
                {workflow.steps.map((step, index) => (
                  <li key={step.title}>
                    <span>{index + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="api-card">
              <h3>{workflow.apiTitle}</h3>
              <div className="api-list">
                {workflow.apiHighlights.map((api) => (
                  <article key={api.title}>
                    <h4>{api.title}</h4>
                    <p>{api.detail}</p>
                  </article>
                ))}
              </div>
              <InteractiveAnalysis mode="table" initialView="overview" />
              <a href="/docs/ARCHITECTURE.md" className="ghost-btn" download>
                {workflow.apiCta}
              </a>
            </div>
          </div>
        </section>

        <section className="section automation" id="automation">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{automation.eyebrow}</p>
              <h2>{automation.title}</h2>
              <p>{automation.description}</p>
            </div>
            <div className="automation-grid">
              {automation.phases.map((phase) => (
                <article key={phase.title} className="automation-phase">
                  <header>
                    <h3>{phase.title}</h3>
                    <p className="phase-subtitle">{phase.subtitle}</p>
                  </header>
                  <p>{phase.description}</p>
                  <ul>
                    {phase.outputs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

