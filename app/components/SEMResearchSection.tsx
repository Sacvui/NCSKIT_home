"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamic import để tránh SSR issues - Using Advanced SEM Visualization
const AdvancedSEMVisualization = dynamic(() => import("./AdvancedSEMVisualization").then(mod => ({ default: mod.AdvancedSEMVisualization })), {
  ssr: false,
  loading: () => <div className="sem-visualization" style={{ minHeight: "800px", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading advanced SEM model...</div>
});

// Q1 Research Model - Extended TAM with Trust, Risk, and Social Influence
const q1Variables = [
  {
    id: "PEOU", label: "Perceived\nEase of Use", type: "exogenous" as const, x: 150, y: 150,
    observedVars: [
      { id: "PEOU1", label: "PEOU1", x: 50, y: 130, loading: 0.85, errorId: "e1" },
      { id: "PEOU2", label: "PEOU2", x: 50, y: 150, loading: 0.88, errorId: "e2" },
      { id: "PEOU3", label: "PEOU3", x: 50, y: 170, loading: 0.82, errorId: "e3" }
    ]
  },
  {
    id: "PU", label: "Perceived\nUsefulness", type: "mediator" as const, x: 350, y: 150,
    observedVars: [
      { id: "PU1", label: "PU1", x: 270, y: 80, loading: 0.89, errorId: "e4" },
      { id: "PU2", label: "PU2", x: 350, y: 80, loading: 0.91, errorId: "e5" },
      { id: "PU3", label: "PU3", x: 430, y: 80, loading: 0.87, errorId: "e6" }
    ]
  },
  {
    id: "TR", label: "Trust", type: "exogenous" as const, x: 150, y: 300,
    observedVars: [
      { id: "TR1", label: "TR1", x: 50, y: 280, loading: 0.84, errorId: "e7" },
      { id: "TR2", label: "TR2", x: 50, y: 300, loading: 0.86, errorId: "e8" },
      { id: "TR3", label: "TR3", x: 50, y: 320, loading: 0.81, errorId: "e9" }
    ]
  },
  {
    id: "PR", label: "Perceived\nRisk", type: "exogenous" as const, x: 150, y: 450,
    observedVars: [
      { id: "PR1", label: "PR1", x: 50, y: 430, loading: 0.79, errorId: "e10" },
      { id: "PR2", label: "PR2", x: 50, y: 450, loading: 0.82, errorId: "e11" },
      { id: "PR3", label: "PR3", x: 50, y: 470, loading: 0.75, errorId: "e12" }
    ]
  },
  {
    id: "SI", label: "Social\nInfluence", type: "exogenous" as const, x: 350, y: 450,
    observedVars: [
      { id: "SI1", label: "SI1", x: 270, y: 520, loading: 0.88, errorId: "e13" },
      { id: "SI2", label: "SI2", x: 350, y: 520, loading: 0.90, errorId: "e14" },
      { id: "SI3", label: "SI3", x: 430, y: 520, loading: 0.85, errorId: "e15" }
    ]
  },
  {
    id: "ATT", label: "Attitude", type: "mediator" as const, x: 600, y: 300,
    observedVars: [
      { id: "ATT1", label: "ATT1", x: 520, y: 230, loading: 0.92, errorId: "e16" },
      { id: "ATT2", label: "ATT2", x: 600, y: 230, loading: 0.94, errorId: "e17" },
      { id: "ATT3", label: "ATT3", x: 680, y: 230, loading: 0.89, errorId: "e18" }
    ]
  },
  {
    id: "BI", label: "Behavioral\nIntention", type: "endogenous" as const, x: 850, y: 300,
    observedVars: [
      { id: "BI1", label: "BI1", x: 950, y: 280, loading: 0.95, errorId: "e19" },
      { id: "BI2", label: "BI2", x: 950, y: 300, loading: 0.93, errorId: "e20" },
      { id: "BI3", label: "BI3", x: 950, y: 320, loading: 0.91, errorId: "e21" }
    ]
  },
];

const q1Paths = [
  { from: "PEOU", to: "PU", coefficient: 0.387, pValue: 0.001, significant: true, label: "H1" },
  { from: "PU", to: "ATT", coefficient: 0.452, pValue: 0.001, significant: true, label: "H2" },
  { from: "TR", to: "ATT", coefficient: 0.321, pValue: 0.001, significant: true, label: "H3" },
  { from: "TR", to: "BI", coefficient: 0.234, pValue: 0.005, significant: true, label: "H4" },
  { from: "PR", to: "ATT", coefficient: -0.189, pValue: 0.012, significant: true, label: "H5" },
  { from: "PR", to: "BI", coefficient: -0.156, pValue: 0.023, significant: true, label: "H6" },
  { from: "SI", to: "BI", coefficient: 0.278, pValue: 0.001, significant: true, label: "H7" },
  { from: "ATT", to: "BI", coefficient: 0.512, pValue: 0.001, significant: true, label: "H8" },
];

const q1FitIndices = {
  chiSquare: 342.18,
  df: 142,
  cfi: 0.971,
  tli: 0.965,
  rmsea: 0.045,
  srmr: 0.038,
  gfi: 0.954,
};

type SEMResearchSectionProps = {
  title?: string;
  subtitle?: string;
  description?: string;
};

export function SEMResearchSection({
  title = "Structural Equation Modeling (SEM) Results",
  subtitle = "Q1 Journal Publication - Technology Acceptance in Digital Banking",
  description = "Interactive visualization of a comprehensive research model examining factors influencing behavioral intention to adopt digital banking services. Click on variables or paths to explore relationships and significance levels.",
}: SEMResearchSectionProps) {
  return (
    <section id="sem-research" className="section sem-research-section">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">Research Methodology</p>
          <h2>{title}</h2>
          <p className="sem-subtitle">{subtitle}</p>
          <p>{description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AdvancedSEMVisualization
            variables={q1Variables}
            paths={q1Paths}
            fitIndices={q1FitIndices}
          />
        </motion.div>

        <motion.div
          className="sem-research-meta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="research-info-grid">
            <div className="research-info-item">
              <span className="info-label">Sample Size</span>
              <span className="info-value">N = 487</span>
            </div>
            <div className="research-info-item">
              <span className="info-label">Data Collection</span>
              <span className="info-value">Online Survey</span>
            </div>
            <div className="research-info-item">
              <span className="info-label">Analysis Tool</span>
              <span className="info-value">NCSKIT</span>
            </div>
            <div className="research-info-item">
              <span className="info-label">Hypotheses</span>
              <span className="info-value">8/8 Supported</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

