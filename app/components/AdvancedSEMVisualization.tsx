"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type SEMObservedVariable = {
  id: string;
  label: string;
  x: number;
  y: number;
  loading: number;
  errorId: string;
};

type SEMLatentVariable = {
  id: string;
  label: string;
  type: "exogenous" | "endogenous" | "mediator";
  x: number;
  y: number;
  observedVars?: SEMObservedVariable[];
  errorId?: string;
};

type SEMPath = {
  from: string;
  to: string;
  coefficient: number;
  pValue: number;
  significant: boolean;
  label: string;
};

type SEMFitIndices = {
  chiSquare: number;
  df: number;
  rmsea: number;
  cfi: number;
  gfi: number;
  tli: number;
};

type AdvancedSEMVisualizationProps = {
  variables?: SEMLatentVariable[];
  paths?: SEMPath[];
  fitIndices?: SEMFitIndices;
};

// Professional Color Palette
const COLORS = {
  exogenous: {
    primary: "#3b82f6", // Blue
    light: "#60a5fa",
    dark: "#2563eb",
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.3)",
  },
  endogenous: {
    primary: "#10b981", // Green
    light: "#34d399",
    dark: "#059669",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.3)",
  },
  mediator: {
    primary: "#8b5cf6", // Purple
    light: "#a78bfa",
    dark: "#7c3aed",
    bg: "rgba(139, 92, 246, 0.1)",
    border: "rgba(139, 92, 246, 0.3)",
  },
  observed: {
    primary: "#64748b", // Slate
    light: "#94a3b8",
    dark: "#475569",
    bg: "rgba(100, 116, 139, 0.08)",
    border: "rgba(100, 116, 139, 0.2)",
  },
  error: {
    primary: "#ef4444", // Red
    light: "#f87171",
    dark: "#dc2626",
  },
  path: {
    significant: "#10b981",
    notSignificant: "#d1d5db",
    negative: "#ef4444",
    hover: "#f59e0b",
  },
};

// Complex Q1 Research SEM Model - Extended TAM with Trust, Risk, and Social Influence
const defaultVariables: SEMLatentVariable[] = [
  {
    id: "PEFF",
    label: "Perceived\nEffectiveness",
    type: "exogenous",
    x: 80,
    y: 120,
    observedVars: [
      { id: "PEFF1", label: "PEFF1", x: 20, y: 60, loading: 1.0, errorId: "e1" },
      { id: "PEFF2", label: "PEFF2", x: 20, y: 110, loading: 0.91, errorId: "e2" },
      { id: "PEFF3", label: "PEFF3", x: 20, y: 160, loading: 0.88, errorId: "e3" },
      { id: "PEFF4", label: "PEFF4", x: 20, y: 210, loading: 0.85, errorId: "e4" },
    ],
  },
  {
    id: "SI",
    label: "Social\nInfluence",
    type: "exogenous",
    x: 80,
    y: 280,
    observedVars: [
      { id: "SI1", label: "SI1", x: 20, y: 230, loading: 1.0, errorId: "e5" },
      { id: "SI2", label: "SI2", x: 20, y: 280, loading: 0.89, errorId: "e6" },
      { id: "SI3", label: "SI3", x: 20, y: 330, loading: 0.87, errorId: "e7" },
      { id: "SI4", label: "SI4", x: 20, y: 380, loading: 0.92, errorId: "e8" },
    ],
  },
  {
    id: "PU",
    label: "Perceived\nUsefulness",
    type: "exogenous",
    x: 80,
    y: 440,
    observedVars: [
      { id: "PU1", label: "PU1", x: 20, y: 390, loading: 1.0, errorId: "e9" },
      { id: "PU2", label: "PU2", x: 20, y: 440, loading: 0.90, errorId: "e10" },
      { id: "PU3", label: "PU3", x: 20, y: 490, loading: 0.88, errorId: "e11" },
      { id: "PU4", label: "PU4", x: 20, y: 540, loading: 0.86, errorId: "e12" },
      { id: "PU5", label: "PU5", x: 20, y: 590, loading: 0.84, errorId: "e13" },
    ],
  },
  {
    id: "PEOU",
    label: "Perceived\nEase of Use",
    type: "exogenous",
    x: 80,
    y: 600,
    observedVars: [
      { id: "PEOU1", label: "PEOU1", x: 20, y: 550, loading: 1.0, errorId: "e14" },
      { id: "PEOU2", label: "PEOU2", x: 20, y: 600, loading: 0.91, errorId: "e15" },
      { id: "PEOU3", label: "PEOU3", x: 20, y: 650, loading: 0.89, errorId: "e16" },
      { id: "PEOU4", label: "PEOU4", x: 20, y: 700, loading: 0.87, errorId: "e17" },
    ],
  },
  {
    id: "TRUST",
    label: "Trust",
    type: "exogenous",
    x: 80,
    y: 760,
    observedVars: [
      { id: "TR1", label: "TR1", x: 20, y: 710, loading: 1.0, errorId: "e18" },
      { id: "TR2", label: "TR2", x: 20, y: 760, loading: 0.88, errorId: "e19" },
      { id: "TR3", label: "TR3", x: 20, y: 810, loading: 0.90, errorId: "e20" },
      { id: "TR4", label: "TR4", x: 20, y: 860, loading: 0.86, errorId: "e21" },
    ],
  },
  {
    id: "RISK",
    label: "Perceived\nRisk",
    type: "exogenous",
    x: 80,
    y: 920,
    observedVars: [
      { id: "RISK1", label: "RISK1", x: 20, y: 870, loading: 1.0, errorId: "e22" },
      { id: "RISK2", label: "RISK2", x: 20, y: 920, loading: 0.87, errorId: "e23" },
      { id: "RISK3", label: "RISK3", x: 20, y: 970, loading: 0.85, errorId: "e24" },
    ],
  },
  {
    id: "ATT",
    label: "Attitude",
    type: "endogenous",
    x: 500,
    y: 440,
    errorId: "e37",
    observedVars: [
      { id: "ATT1", label: "ATT1", x: 680, y: 380, loading: 1.0, errorId: "e25" },
      { id: "ATT2", label: "ATT2", x: 680, y: 440, loading: 0.92, errorId: "e26" },
      { id: "ATT3", label: "ATT3", x: 680, y: 500, loading: 0.89, errorId: "e27" },
    ],
  },
  {
    id: "BI",
    label: "Behavioral\nIntention",
    type: "endogenous",
    x: 500,
    y: 760,
    errorId: "e38",
    observedVars: [
      { id: "BI1", label: "BI1", x: 680, y: 700, loading: 1.0, errorId: "e28" },
      { id: "BI2", label: "BI2", x: 680, y: 760, loading: 0.91, errorId: "e29" },
      { id: "BI3", label: "BI3", x: 680, y: 820, loading: 0.88, errorId: "e30" },
      { id: "BI4", label: "BI4", x: 680, y: 880, loading: 0.90, errorId: "e31" },
    ],
  },
];

const defaultPaths: SEMPath[] = [
  // Direct effects on Attitude
  { from: "PU", to: "ATT", coefficient: 0.425, pValue: 0.001, significant: true, label: "H1" },
  { from: "PEOU", to: "ATT", coefficient: 0.312, pValue: 0.001, significant: true, label: "H2" },
  { from: "PEOU", to: "PU", coefficient: 0.387, pValue: 0.001, significant: true, label: "H3" },
  { from: "TRUST", to: "ATT", coefficient: 0.289, pValue: 0.002, significant: true, label: "H4" },
  { from: "SI", to: "ATT", coefficient: 0.198, pValue: 0.008, significant: true, label: "H5" },
  { from: "RISK", to: "ATT", coefficient: -0.234, pValue: 0.004, significant: true, label: "H6" },
  { from: "PEFF", to: "PU", coefficient: 0.351, pValue: 0.001, significant: true, label: "H7" },
  { from: "PEFF", to: "ATT", coefficient: 0.267, pValue: 0.003, significant: true, label: "H8" },

  // Direct effects on Behavioral Intention
  { from: "ATT", to: "BI", coefficient: 0.487, pValue: 0.001, significant: true, label: "H9" },
  { from: "PU", to: "BI", coefficient: 0.298, pValue: 0.001, significant: true, label: "H10" },
  { from: "SI", to: "BI", coefficient: 0.243, pValue: 0.002, significant: true, label: "H11" },
  { from: "TRUST", to: "BI", coefficient: 0.312, pValue: 0.001, significant: true, label: "H12" },
  { from: "RISK", to: "BI", coefficient: -0.186, pValue: 0.015, significant: true, label: "H13" },

  // Indirect effects (mediated)
  { from: "PEOU", to: "BI", coefficient: 0.152, pValue: 0.028, significant: true, label: "H14" }, // via PU and ATT
];

const defaultFitIndices: SEMFitIndices = {
  chiSquare: 1823.45,
  df: 458,
  rmsea: 0.048,
  cfi: 0.972,
  gfi: 0.958,
  tli: 0.968,
};

export function AdvancedSEMVisualization({
  variables = defaultVariables,
  paths = defaultPaths,
  fitIndices = defaultFitIndices,
}: AdvancedSEMVisualizationProps) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const [selectedObserved, setSelectedObserved] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Enhanced Gradients (defs)
  const Gradients = () => (
    <defs>
      <linearGradient id="grad-exogenous" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="grad-endogenous" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
      </linearGradient>
      <filter id="glass-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
      </filter>
    </defs>
  );

  const getVariableColor = (type: "exogenous" | "endogenous" | "mediator") => {
    if (type === "mediator") return COLORS.mediator;
    return type === "exogenous" ? COLORS.exogenous : COLORS.endogenous;
  };

  const getPathColor = (path: SEMPath) => {
    if (hoveredPath === path.label) return COLORS.path.hover;
    if (!path.significant) return COLORS.path.notSignificant;
    return path.coefficient > 0 ? COLORS.path.significant : COLORS.path.negative;
  };

  const getPathWidth = (path: SEMPath) => {
    return Math.abs(path.coefficient) * 6 + 2;
  };

  const calculatePath = (from: SEMLatentVariable, to: SEMLatentVariable) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return { distance, angle, dx, dy };
  };

  const selectedVar = variables.find((v) => v.id === selectedVariable);
  const selectedObs = selectedVar?.observedVars?.find((o) => o.id === selectedObserved);

  return (
    <div className="advanced-sem-visualization component-card glass-panel" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.9))" }}>
      <motion.div
        className="sem-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div>
          <motion.h4
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ background: "linear-gradient(90deg, #2563eb, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Advanced Structural Equation Model
          </motion.h4>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            NCSKIT automatically constructs and validates complex SEM models, offering precise fit indices and path coefficients.
          </motion.p>
        </div>
        <motion.button
          className="sem-toggle"
          onClick={() => setShowDetails(!showDetails)}
          aria-label="Toggle details"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ background: showDetails ? "var(--color-primary)" : "transparent", color: showDetails ? "white" : "var(--color-primary)", border: "1px solid var(--color-primary)" }}
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </motion.button>
      </motion.div>

      <div className="sem-canvas-container" style={{ borderRadius: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", background: "rgba(255,255,255,0.5)" }}>
        <svg
          viewBox="-50 -50 1100 700"
          className="sem-canvas"
          style={{ width: "100%", height: "auto", maxHeight: "800px" }}
        >
          <Gradients />

          {/* Render paths first (z-index equivalent) */}
          {paths.map((path, index) => {
            const fromVar = variables.find((v) => v.id === path.from);
            const toVar = variables.find((v) => v.id === path.to);
            if (!fromVar || !toVar) return null;

            const { dx, dy, distance, angle } = calculatePath(fromVar, toVar);
            const midX = fromVar.x + dx / 2;
            const midY = fromVar.y + dy / 2;
            const labelBgWidth = 56;
            const labelBgHeight = 20;

            return (
              <g key={`path-${index}`}>
                <motion.line
                  x1={fromVar.x}
                  y1={fromVar.y}
                  x2={toVar.x}
                  y2={toVar.y}
                  stroke={getPathColor(path)}
                  strokeWidth={getPathWidth(path)}
                  strokeDasharray={path.significant ? "0" : "4,4"}
                  opacity={hoveredPath && hoveredPath !== path.label ? 0.2 : 0.8}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 1, delay: index * 0.15 }}
                  onMouseEnter={() => setHoveredPath(path.label)}
                  onMouseLeave={() => setHoveredPath(null)}
                  style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                />
                {/* Invisible wider hit area for easier hovering */}
                <line
                  x1={fromVar.x}
                  y1={fromVar.y}
                  x2={toVar.x}
                  y2={toVar.y}
                  stroke="transparent"
                  strokeWidth={20}
                  onMouseEnter={() => setHoveredPath(path.label)}
                  onMouseLeave={() => setHoveredPath(null)}
                  onClick={() => setShowDetails(true)}
                  style={{ cursor: "pointer" }}
                />

                <motion.polygon
                  points={`${toVar.x - 14 * Math.cos((angle - 90) * (Math.PI / 180))},${toVar.y - 14 * Math.sin((angle - 90) * (Math.PI / 180))
                    } ${toVar.x},${toVar.y} ${toVar.x - 14 * Math.cos((angle + 90) * (Math.PI / 180))
                    },${toVar.y - 14 * Math.sin((angle + 90) * (Math.PI / 180))}`}
                  fill={getPathColor(path)}
                  opacity={hoveredPath && hoveredPath !== path.label ? 0.2 : 1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: index * 0.15 + 0.5 }}
                />

                {/* Path Coefficient Label + Background Pill */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.15 + 0.6 }}
                >
                  <rect
                    x={midX - labelBgWidth / 2}
                    y={midY - 16}
                    width={labelBgWidth}
                    height={labelBgHeight}
                    rx={6}
                    fill="white"
                    fillOpacity="0.95"
                    stroke={getPathColor(path)}
                    strokeWidth={1.5}
                  />
                  <text
                    x={midX}
                    y={midY - 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={getPathColor(path)}
                    style={{ pointerEvents: "none" }}
                  >
                    {path.coefficient.toFixed(3)}
                    {path.significant && "***"}
                  </text>
                </motion.g>
              </g>
            );
          })}

          {/* Render error terms */}
          {variables
            .filter((v) => v.type === "endogenous" && v.errorId)
            .map((variable) => {
              const errorX = variable.x;
              const errorY = variable.y - 50;
              return (
                <g key={`error-${variable.errorId}`}>
                  <circle cx={errorX} cy={errorY} r={12} fill="white" stroke={COLORS.error.light} strokeWidth={1} />
                  <text x={errorX} y={errorY + 4} textAnchor="middle" fontSize="10" fill={COLORS.error.primary}>{variable.errorId}</text>
                  <line x1={errorX} y1={errorY + 12} x2={variable.x} y2={variable.y - 35} stroke={COLORS.error.light} strokeDasharray="3,3" />
                </g>
              )
            })}

          {/* Render Measurement Models */}
          {variables.map((variable) =>
            variable.observedVars?.map((observed, obsIndex) => {
              const isSelected = selectedVariable === variable.id && selectedObserved === observed.id;
              const isHovered = selectedVariable === variable.id;

              return (
                <g key={observed.id}>
                  {/* Link Line */}
                  <motion.line
                    x1={variable.x}
                    y1={variable.y}
                    x2={observed.x}
                    y2={observed.y}
                    stroke={COLORS.observed.border}
                    strokeWidth={1}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Observed Rect */}
                  <motion.rect
                    x={observed.x - 30}
                    y={observed.y - 12}
                    width={60}
                    height={24}
                    fill="white"
                    stroke={isSelected ? COLORS.exogenous.primary : COLORS.observed.border}
                    strokeWidth={isSelected ? 2 : 1}
                    rx={4}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: obsIndex * 0.05 }}
                    onClick={() => {
                      setSelectedObserved(selectedObserved === observed.id ? null : observed.id);
                      setSelectedVariable(variable.id);
                      setShowDetails(true);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <text x={observed.x} y={observed.y + 4} textAnchor="middle" fontSize="9" fill={COLORS.observed.dark} pointerEvents="none">{observed.label}</text>
                </g>
              );
            })
          )}

          {/* Render Latent Variables */}
          {variables.map((variable, index) => {
            const colors = getVariableColor(variable.type);
            const isSelected = selectedVariable === variable.id;

            return (
              <g key={variable.id}>
                <motion.ellipse
                  cx={variable.x}
                  cy={variable.y}
                  rx={55}
                  ry={32}
                  fill={`url(#grad-${variable.type})`}
                  stroke={isSelected ? colors.dark : colors.border}
                  strokeWidth={isSelected ? 3 : 2}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={() => setSelectedVariable(variable.id)}
                  onClick={() => {
                    setSelectedVariable(selectedVariable === variable.id ? null : variable.id);
                    setShowDetails(true);
                  }}
                  style={{ cursor: "pointer", filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.05))" }}
                />
                <motion.text
                  x={variable.x}
                  y={variable.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill={colors.dark}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ pointerEvents: "none" }}
                >
                  <tspan x={variable.x} dy="-0.4em">{variable.label.split('\n')[0]}</tspan>
                  {variable.label.split('\n')[1] && <tspan x={variable.x} dy="1.2em">{variable.label.split('\n')[1]}</tspan>}
                </motion.text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Fit Indices Panel */}
      <div className="sem-fit-indices" style={{ marginTop: "2rem" }}>
        <h4 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", marginBottom: "1rem" }}>Model Fit Indices</h4>
        <div className="fit-indices-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "1rem" }}>
          {[
            { label: "χ²/df", value: `${(fitIndices.chiSquare / fitIndices.df).toFixed(2)}`, status: "Acceptable", color: "#f59e0b" },
            { label: "RMSEA", value: fitIndices.rmsea.toFixed(3), status: "Excellent", color: "#10b981" },
            { label: "CFI", value: fitIndices.cfi.toFixed(3), status: "Excellent", color: "#10b981" },
            { label: "TLI", value: fitIndices.tli.toFixed(3), status: "Excellent", color: "#10b981" },
            { label: "SRMR", value: "0.042", status: "Good", color: "#10b981" }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="fit-index-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              style={{
                background: "white",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e293b", margin: "0.25rem 0" }}>{item.value}</div>
              <div style={{ fontSize: "0.7rem", color: item.color, fontWeight: 600, textTransform: "uppercase" }}>{item.status}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      <AnimatePresence>
        {showDetails && (selectedVar || hoveredPath) && (
          <motion.div
            className="sem-details-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 20px 40px -5px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)",
              marginTop: "1.5rem"
            }}
          >
            {selectedVar && (
              <div>
                <h5 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#1e293b" }}>
                  {selectedVar.label.replace('\n', ' ')} <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 400 }}>({selectedVar.type})</span>
                </h5>
                <p style={{ fontSize: "0.9rem", color: "#475569" }}>
                  This latent variable is measured by {selectedVar.observedVars?.length || 0} indicators.
                </p>
              </div>
            )}
            {hoveredPath && !selectedVar && (
              <div>
                <h5 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Path Effect: {hoveredPath}</h5>
                <div style={{ display: "flex", gap: "2rem" }}>
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b" }}>Coefficient</span>
                    <strong style={{ fontSize: "1.2rem", color: "#1e293b" }}>{paths.find((p) => p.label === hoveredPath)?.coefficient.toFixed(3)}</strong>
                  </div>
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b" }}>Significance</span>
                    <strong style={{ fontSize: "1.2rem", color: "#10b981" }}>P &lt; 0.001</strong>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

