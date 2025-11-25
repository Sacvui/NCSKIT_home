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
  type: "exogenous" | "endogenous";
  x: number;
  y: number;
  observedVars: SEMObservedVariable[];
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

  const getVariableColor = (type: "exogenous" | "endogenous") => {
    return type === "exogenous" ? COLORS.exogenous : COLORS.endogenous;
  };

  const getPathColor = (path: SEMPath) => {
    if (hoveredPath === path.label) return COLORS.path.hover;
    if (!path.significant) return COLORS.path.notSignificant;
    return path.coefficient > 0 ? COLORS.path.significant : COLORS.path.negative;
  };

  const getPathWidth = (path: SEMPath) => {
    return Math.abs(path.coefficient) * 5 + 2;
  };

  const calculatePath = (from: SEMLatentVariable, to: SEMLatentVariable) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return { distance, angle, dx, dy };
  };

  const selectedVar = variables.find((v) => v.id === selectedVariable);
  const selectedObs = selectedVar?.observedVars.find((o) => o.id === selectedObserved);

  return (
    <div className="advanced-sem-visualization component-card">
      <div className="sem-header">
        <div>
          <h4>Advanced Structural Equation Model</h4>
          <p>Click variables, observed indicators, or paths to explore relationships</p>
        </div>
        <button
          className="sem-toggle"
          onClick={() => setShowDetails(!showDetails)}
          aria-label="Toggle details"
        >
          {showDetails ? "Hide" : "Show"} Details
        </button>
      </div>

      <div className="sem-canvas-container">
        <svg
          viewBox="0 0 750 1000"
          className="sem-canvas"
          style={{ width: "100%", height: "auto", maxHeight: "800px" }}
        >
          {/* Render structural paths (between latent variables) */}
          {paths.map((path, index) => {
            const fromVar = variables.find((v) => v.id === path.from);
            const toVar = variables.find((v) => v.id === path.to);
            if (!fromVar || !toVar) return null;

            const { dx, dy, distance, angle } = calculatePath(fromVar, toVar);
            const midX = fromVar.x + dx / 2;
            const midY = fromVar.y + dy / 2;

            return (
              <g key={`path-${index}`}>
                <motion.line
                  x1={fromVar.x}
                  y1={fromVar.y}
                  x2={toVar.x}
                  y2={toVar.y}
                  stroke={getPathColor(path)}
                  strokeWidth={getPathWidth(path)}
                  strokeDasharray={path.significant ? "0" : "5,5"}
                  opacity={hoveredPath && hoveredPath !== path.label ? 0.2 : 1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: index * 0.15 }}
                  onMouseEnter={() => setHoveredPath(path.label)}
                  onMouseLeave={() => setHoveredPath(null)}
                  onClick={() => {
                    setSelectedVariable(null);
                    setSelectedObserved(null);
                    setShowDetails(true);
                  }}
                  style={{ cursor: "pointer" }}
                />
                {/* Arrow head */}
                <motion.polygon
                  points={`${toVar.x - 12 * Math.cos((angle - 90) * (Math.PI / 180))},${
                    toVar.y - 12 * Math.sin((angle - 90) * (Math.PI / 180))
                  } ${toVar.x},${toVar.y} ${
                    toVar.x - 12 * Math.cos((angle + 90) * (Math.PI / 180))
                  },${toVar.y - 12 * Math.sin((angle + 90) * (Math.PI / 180))}`}
                  fill={getPathColor(path)}
                  opacity={hoveredPath && hoveredPath !== path.label ? 0.2 : 1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: index * 0.15 + 0.5 }}
                />
                {/* Path label */}
                <motion.text
                  x={midX}
                  y={midY - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill={getPathColor(path)}
                  initial={{ opacity: 0, y: midY }}
                  animate={{ opacity: 1, y: midY - 8 }}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.7 }}
                >
                  {path.label}: {path.coefficient.toFixed(3)}
                  {path.significant && (
                    <tspan fontSize="9" fill={path.coefficient > 0 ? COLORS.path.significant : COLORS.path.negative}>
                      {" ***"}
                    </tspan>
                  )}
                </motion.text>
              </g>
            );
          })}

          {/* Render measurement paths (latent to observed) */}
          {variables.map((variable) =>
            variable.observedVars.map((observed, obsIndex) => {
              const { dx, dy, angle } = calculatePath(
                { x: variable.x, y: variable.y } as SEMLatentVariable,
                { x: observed.x, y: observed.y } as SEMLatentVariable,
              );
              const isSelected = selectedVariable === variable.id && selectedObserved === observed.id;
              const isHovered = selectedVariable === variable.id;

              return (
                <g key={`measure-${variable.id}-${observed.id}`}>
                  <motion.line
                    x1={variable.x}
                    y1={variable.y}
                    x2={observed.x}
                    y2={observed.y}
                    stroke={isSelected ? getVariableColor(variable.type).primary : COLORS.observed.primary}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    strokeDasharray="2,2"
                    opacity={isHovered && !isSelected ? 0.3 : 0.6}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: obsIndex * 0.1 }}
                  />
                  {/* Loading coefficient */}
                  {isSelected && (
                    <motion.text
                      x={(variable.x + observed.x) / 2}
                      y={(variable.y + observed.y) / 2 - 5}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      fill={getVariableColor(variable.type).primary}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {observed.loading.toFixed(2)}
                    </motion.text>
                  )}
                </g>
              );
            }),
          )}

          {/* Render error terms for observed variables */}
          {variables.map((variable) =>
            variable.observedVars.map((observed) => {
              const errorX = observed.x - 30;
              const errorY = observed.y;
              const isSelected = selectedVariable === variable.id && selectedObserved === observed.id;

              return (
                <g key={`error-${observed.errorId}`}>
                  <motion.circle
                    cx={errorX}
                    cy={errorY}
                    r={8}
                    fill={COLORS.error.primary}
                    fillOpacity={isSelected ? 0.8 : 0.4}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.line
                    x1={errorX + 8}
                    y1={errorY}
                    x2={observed.x}
                    y2={observed.y}
                    stroke={COLORS.error.primary}
                    strokeWidth={1}
                    strokeDasharray="1,1"
                    opacity={isSelected ? 0.6 : 0.3}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.text
                    x={errorX - 15}
                    y={errorY + 4}
                    fontSize="8"
                    fontWeight="600"
                    fill={COLORS.error.primary}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {observed.errorId}
                  </motion.text>
                </g>
              );
            }),
          )}

          {/* Render error terms for endogenous latent variables */}
          {variables
            .filter((v) => v.type === "endogenous" && v.errorId)
            .map((variable) => {
              const errorX = variable.x;
              const errorY = variable.y - 50;
              const isSelected = selectedVariable === variable.id;

              return (
                <g key={`error-${variable.errorId}`}>
                  <motion.circle
                    cx={errorX}
                    cy={errorY}
                    r={10}
                    fill={COLORS.error.primary}
                    fillOpacity={isSelected ? 0.8 : 0.5}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.line
                    x1={errorX}
                    y1={errorY + 10}
                    x2={variable.x}
                    y2={variable.y}
                    stroke={COLORS.error.primary}
                    strokeWidth={1.5}
                    strokeDasharray="2,2"
                    opacity={isSelected ? 0.7 : 0.4}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.text
                    x={errorX - 12}
                    y={errorY - 8}
                    fontSize="9"
                    fontWeight="700"
                    fill={COLORS.error.primary}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {variable.errorId}
                  </motion.text>
                </g>
              );
            })}

          {/* Render observed variables (rectangles) */}
          {variables.map((variable) =>
            variable.observedVars.map((observed, obsIndex) => {
              const isSelected = selectedVariable === variable.id && selectedObserved === observed.id;
              const isHovered = selectedVariable === variable.id;

              return (
                <g key={observed.id}>
                  <motion.rect
                    x={observed.x - 35}
                    y={observed.y - 12}
                    width={70}
                    height={24}
                    fill={isSelected ? COLORS.observed.primary : COLORS.observed.bg}
                    stroke={isSelected ? COLORS.observed.primary : COLORS.observed.border}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    rx={4}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: obsIndex * 0.1 }}
                    onMouseEnter={() => {
                      setSelectedVariable(variable.id);
                      setSelectedObserved(observed.id);
                    }}
                    onMouseLeave={() => {
                      if (!showDetails) {
                        setSelectedObserved(null);
                      }
                    }}
                    onClick={() => {
                      setSelectedObserved(selectedObserved === observed.id ? null : observed.id);
                      setShowDetails(true);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <motion.text
                    x={observed.x}
                    y={observed.y + 4}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill={isSelected ? COLORS.observed.primary : COLORS.observed.dark}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: obsIndex * 0.1 + 0.2 }}
                  >
                    {observed.label}
                  </motion.text>
                </g>
              );
            }),
          )}

          {/* Render latent variables (ovals) */}
          {variables.map((variable, index) => {
            const colors = getVariableColor(variable.type);
            const isSelected = selectedVariable === variable.id;

            return (
              <g key={variable.id}>
                <motion.ellipse
                  cx={variable.x}
                  cy={variable.y}
                  rx={60}
                  ry={35}
                  fill={colors.bg}
                  stroke={isSelected ? colors.primary : colors.border}
                  strokeWidth={isSelected ? 3.5 : 2.5}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={() => {
                    setSelectedVariable(variable.id);
                    setSelectedObserved(null);
                  }}
                  onMouseLeave={() => {
                    if (!showDetails) {
                      setSelectedVariable(null);
                    }
                  }}
                  onClick={() => {
                    setSelectedVariable(selectedVariable === variable.id ? null : variable.id);
                    setShowDetails(true);
                  }}
                  style={{ cursor: "pointer" }}
                />
                <motion.text
                  x={variable.x}
                  y={variable.y + 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill={colors.primary}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                >
                  {variable.label}
                </motion.text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Fit Indices Panel */}
      <div className="sem-fit-indices">
        <h4>Model Fit Indices</h4>
        <div className="fit-indices-grid">
          <div className="fit-index-item">
            <span className="fit-label">χ²/df</span>
            <span className="fit-value">{fitIndices.chiSquare.toFixed(2)}/{fitIndices.df}</span>
            <span className="fit-status good">= {(fitIndices.chiSquare / fitIndices.df).toFixed(2)}</span>
          </div>
          <div className="fit-index-item">
            <span className="fit-label">RMSEA</span>
            <span className="fit-value">{fitIndices.rmsea.toFixed(3)}</span>
            <span className="fit-status excellent">Excellent</span>
          </div>
          <div className="fit-index-item">
            <span className="fit-label">CFI</span>
            <span className="fit-value">{fitIndices.cfi.toFixed(3)}</span>
            <span className="fit-status excellent">Excellent</span>
          </div>
          <div className="fit-index-item">
            <span className="fit-label">GFI</span>
            <span className="fit-value">{fitIndices.gfi.toFixed(3)}</span>
            <span className="fit-status excellent">Excellent</span>
          </div>
          <div className="fit-index-item">
            <span className="fit-label">TLI</span>
            <span className="fit-value">{fitIndices.tli.toFixed(3)}</span>
            <span className="fit-status excellent">Excellent</span>
          </div>
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
          >
            {selectedVar && (
              <div>
                <h5>
                  {selectedVar.label} ({selectedVar.type === "exogenous" ? "Exogenous" : "Endogenous"})
                </h5>
                {selectedObs ? (
                  <div className="observed-details">
                    <p>
                      <strong>Observed Variable:</strong> {selectedObs.label}
                    </p>
                    <p>
                      <strong>Factor Loading:</strong> {selectedObs.loading.toFixed(3)}
                    </p>
                    <p>
                      <strong>Error Term:</strong> {selectedObs.errorId}
                    </p>
                  </div>
                ) : (
                  <div className="variable-details">
                    <p>
                      <strong>Observed Indicators:</strong> {selectedVar.observedVars.length}
                    </p>
                    <ul>
                      {selectedVar.observedVars.map((obs) => (
                        <li key={obs.id}>
                          {obs.label}: {obs.loading.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {hoveredPath && !selectedVar && (
              <div>
                <h5>Path: {paths.find((p) => p.label === hoveredPath)?.label}</h5>
                <p>
                  <strong>Coefficient:</strong> {paths.find((p) => p.label === hoveredPath)?.coefficient.toFixed(3)}
                </p>
                <p>
                  <strong>P-value:</strong> {paths.find((p) => p.label === hoveredPath)?.pValue.toFixed(3)}
                </p>
                <p>
                  <strong>Significance:</strong>{" "}
                  {paths.find((p) => p.label === hoveredPath)?.significant ? "***" : "Not significant"}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

