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
  { id: "PEOU", label: "Perceived\nEase of Use", type: "exogenous" as const, x: 80, y: 150 },
  { id: "PU", label: "Perceived\nUsefulness", type: "mediator" as const, x: 280, y: 150 },
  { id: "TR", label: "Trust", type: "exogenous" as const, x: 80, y: 280 },
  { id: "PR", label: "Perceived\nRisk", type: "exogenous" as const, x: 80, y: 410 },
  { id: "SI", label: "Social\nInfluence", type: "exogenous" as const, x: 280, y: 410 },
  { id: "ATT", label: "Attitude", type: "mediator" as const, x: 480, y: 280 },
  { id: "BI", label: "Behavioral\nIntention", type: "endogenous" as const, x: 680, y: 280 },
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
          <AdvancedSEMVisualization />
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

