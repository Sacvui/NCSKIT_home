"use client";

import { motion } from "framer-motion";

type ModuleCapability = {
  module: string;
  feature: string;
  status: "available" | "beta" | "planned";
  description: string;
};

type ModuleCapabilitiesProps = {
  capabilities?: ModuleCapability[];
};

const defaultCapabilities: ModuleCapability[] = [
  {
    module: "Ideation Lab",
    feature: "AI Research Assistant (RAG)",
    status: "available",
    description: "Chat with PDFs, auto-summarize papers, suggest research directions",
  },
  {
    module: "Ideation Lab",
    feature: "Literature Review Builder",
    status: "available",
    description: "Index papers, generate synthesis tables, theory mapping",
  },
  {
    module: "Ideation Lab",
    feature: "Topic Duplication Check",
    status: "beta",
    description: "Query Scholar/ArXiv APIs for existing research",
  },
  {
    module: "Design Studio",
    feature: "SEM/CFA Model Designer",
    status: "available",
    description: "Draw.io integration for research model visualization",
  },
  {
    module: "Design Studio",
    feature: "Survey Builder",
    status: "available",
    description: "SurveyJS-powered questionnaire creator, export to Google Forms/PDF",
  },
  {
    module: "Design Studio",
    feature: "Flowchart Designer",
    status: "available",
    description: "Research workflow diagrams and process mapping",
  },
  {
    module: "Analysis Hub",
    feature: "Smart Grid (Data Viewer)",
    status: "available",
    description: "Excel-like interface for data cleaning and exploration",
  },
  {
    module: "Analysis Hub",
    feature: "Data Health Check",
    status: "available",
    description: "Auto-detect missing values, outliers, zero variance",
  },
  {
    module: "Analysis Hub",
    feature: "Auto-Stats (T-test, ANOVA)",
    status: "available",
    description: "Automatic test selection based on variable types",
  },
  {
    module: "Analysis Hub",
    feature: "Regression Analysis",
    status: "available",
    description: "OLS regression with coefficient tables and diagnostics",
  },
  {
    module: "Analysis Hub",
    feature: "Cronbach's Alpha",
    status: "available",
    description: "Reliability analysis for Likert scale variables",
  },
  {
    module: "Analysis Hub",
    feature: "EFA/CFA/SEM",
    status: "beta",
    description: "Advanced multivariate analysis (lavaan integration)",
  },
  {
    module: "Analysis Hub",
    feature: "Auto-Viz (APA Charts)",
    status: "available",
    description: "Plotly-powered charts with APA 7th formatting",
  },
  {
    module: "Publishing Center",
    feature: "Markdown/LaTeX Editor",
    status: "available",
    description: "Live preview editor with syntax highlighting",
  },
  {
    module: "Publishing Center",
    feature: "Citation Manager",
    status: "available",
    description: "Replace EndNote/Zotero, manage .bib files",
  },
  {
    module: "Publishing Center",
    feature: "One-Click Export (DOCX/PDF)",
    status: "available",
    description: "Pandoc-powered export with university/journal templates",
  },
  {
    module: "Publishing Center",
    feature: "APA/PRISMA Checklists",
    status: "available",
    description: "Built-in compliance checklists for submissions",
  },
];

export function ModuleCapabilities({ capabilities = defaultCapabilities }: ModuleCapabilitiesProps) {
  const modules = ["Ideation Lab", "Design Studio", "Analysis Hub", "Publishing Center"];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return { text: "Available", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" };
      case "beta":
        return { text: "Beta", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" };
      default:
        return { text: "Planned", color: "#6b7280", bg: "rgba(107, 114, 128, 0.15)" };
    }
  };

  return (
    <div className="module-capabilities">
      <div className="capabilities-grid">
        {modules.map((module, moduleIndex) => {
          const moduleCaps = capabilities.filter((cap) => cap.module === module);
          return (
            <motion.div
              key={module}
              className="module-card component-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: moduleIndex * 0.1 }}
            >
              <div className="module-header">
                <h3>{module}</h3>
                <span className="module-count">{moduleCaps.length} features</span>
              </div>
              <div className="capabilities-list">
                {moduleCaps.map((cap, index) => {
                  const badge = getStatusBadge(cap.status);
                  return (
                    <motion.div
                      key={cap.feature}
                      className="capability-item"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: moduleIndex * 0.1 + index * 0.05 }}
                    >
                      <div className="capability-header">
                        <span className="capability-name">{cap.feature}</span>
                        <span
                          className="capability-badge"
                          style={{ color: badge.color, background: badge.bg }}
                        >
                          {badge.text}
                        </span>
                      </div>
                      <p className="capability-desc">{cap.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

