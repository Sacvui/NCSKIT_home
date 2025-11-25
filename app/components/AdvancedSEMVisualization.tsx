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

// Complex SEM Model based on the image
const defaultVariables: SEMLatentVariable[] = [
  {
    id: "HIEUQUA",
    label: "Hiệu quả",
    type: "exogenous",
    x: 100,
    y: 100,
    observedVars: [
      { id: "HIEUQUA1", label: "HIEUQUA1", x: 50, y: 50, loading: 1.0, errorId: "e22" },
      { id: "HIEUQUA2", label: "HIEUQUA2", x: 50, y: 100, loading: 0.89, errorId: "e23" },
      { id: "HIEUQUA3", label: "HIEUQUA3", x: 50, y: 150, loading: 0.92, errorId: "e24" },
      { id: "HIEUQUA4", label: "HIEUQUA4", x: 50, y: 200, loading: 0.85, errorId: "e25" },
    ],
  },
  {
    id: "XAHOI",
    label: "Xã hội",
    type: "exogenous",
    x: 100,
    y: 250,
    observedVars: [
      { id: "XAHOI4", label: "XAHOI4", x: 50, y: 200, loading: 1.0, errorId: "e18" },
      { id: "XAHOI1", label: "XAHOI1", x: 50, y: 250, loading: 0.87, errorId: "e19" },
      { id: "XAHOI2", label: "XAHOI2", x: 50, y: 300, loading: 0.91, errorId: "e20" },
      { id: "XAHOI3", label: "XAHOI3", x: 50, y: 350, loading: 0.88, errorId: "e21" },
    ],
  },
  {
    id: "TIENICH",
    label: "Tiện ích",
    type: "exogenous",
    x: 100,
    y: 400,
    observedVars: [
      { id: "TIENICH2", label: "TIENICH2", x: 50, y: 350, loading: 1.0, errorId: "e13" },
      { id: "TIENICH4", label: "TIENICH4", x: 50, y: 400, loading: 0.86, errorId: "e14" },
      { id: "TIENICH3", label: "TIENICH3", x: 50, y: 450, loading: 0.90, errorId: "e15" },
      { id: "TIENICH5", label: "TIENICH5", x: 50, y: 500, loading: 0.84, errorId: "e16" },
      { id: "TIENICH1", label: "TIENICH1", x: 50, y: 550, loading: 0.88, errorId: "e17" },
    ],
  },
  {
    id: "MARKETING",
    label: "Marketing",
    type: "exogenous",
    x: 100,
    y: 550,
    observedVars: [
      { id: "MARKETING6", label: "MARKETING6", x: 50, y: 500, loading: 1.0, errorId: "e7" },
      { id: "MARKETING5", label: "MARKETING5", x: 50, y: 550, loading: 0.85, errorId: "e8" },
      { id: "MARKETING3", label: "MARKETING3", x: 50, y: 600, loading: 0.89, errorId: "e9" },
      { id: "MARKETING1", label: "MARKETING1", x: 50, y: 650, loading: 0.87, errorId: "e10" },
      { id: "MARKETING2", label: "MARKETING2", x: 50, y: 700, loading: 0.83, errorId: "e11" },
      { id: "MARKETING4", label: "MARKETING4", x: 50, y: 750, loading: 0.86, errorId: "e12" },
    ],
  },
  {
    id: "CHIPHI",
    label: "Chi phí",
    type: "exogenous",
    x: 100,
    y: 700,
    observedVars: [
      { id: "CHIPHI6", label: "CHIPHI6", x: 50, y: 650, loading: 1.0, errorId: "e1" },
      { id: "CHIPHI3", label: "CHIPHI3", x: 50, y: 700, loading: 0.88, errorId: "e2" },
      { id: "CHIPHI4", label: "CHIPHI4", x: 50, y: 750, loading: 0.90, errorId: "e3" },
      { id: "CHIPHI5", label: "CHIPHI5", x: 50, y: 800, loading: 0.85, errorId: "e4" },
      { id: "CHIPHI2", label: "CHIPHI2", x: 50, y: 850, loading: 0.87, errorId: "e5" },
      { id: "CHIPHI1", label: "CHIPHI1", x: 50, y: 900, loading: 0.89, errorId: "e6" },
    ],
  },
  {
    id: "YDINH",
    label: "Ý định",
    type: "endogenous",
    x: 600,
    y: 400,
    errorId: "e35",
    observedVars: [
      { id: "YDINH5", label: "YDINH5", x: 750, y: 300, loading: 1.0, errorId: "e30" },
      { id: "YDINH4", label: "YDINH4", x: 750, y: 350, loading: 0.91, errorId: "e29" },
      { id: "YDINH1", label: "YDINH1", x: 750, y: 400, loading: 0.88, errorId: "e28" },
      { id: "YDINH3", label: "YDINH3", x: 750, y: 450, loading: 0.90, errorId: "e27" },
      { id: "YDINH2", label: "YDINH2", x: 750, y: 500, loading: 0.87, errorId: "e26" },
    ],
  },
  {
    id: "QUYETDINH",
    label: "Quyết định",
    type: "endogenous",
    x: 600,
    y: 700,
    errorId: "e36",
    observedVars: [
      { id: "QUYETDINH3", label: "QUYETDINH3", x: 750, y: 650, loading: 1.0, errorId: "e34" },
      { id: "QUYETDINH1", label: "QUYETDINH1", x: 750, y: 700, loading: 0.89, errorId: "e33" },
      { id: "QUYETDINH2", label: "QUYETDINH2", x: 750, y: 750, loading: 0.92, errorId: "e32" },
      { id: "QUYETDINH4", label: "QUYETDINH4", x: 750, y: 800, loading: 0.86, errorId: "e31" },
    ],
  },
];

const defaultPaths: SEMPath[] = [
  { from: "HIEUQUA", to: "YDINH", coefficient: 0.342, pValue: 0.001, significant: true, label: "H1" },
  { from: "XAHOI", to: "YDINH", coefficient: 0.287, pValue: 0.002, significant: true, label: "H2" },
  { from: "TIENICH", to: "YDINH", coefficient: 0.398, pValue: 0.001, significant: true, label: "H3" },
  { from: "MARKETING", to: "YDINH", coefficient: 0.256, pValue: 0.003, significant: true, label: "H4" },
  { from: "CHIPHI", to: "YDINH", coefficient: -0.189, pValue: 0.012, significant: true, label: "H5" },
  { from: "YDINH", to: "QUYETDINH", coefficient: 0.612, pValue: 0.001, significant: true, label: "H6" },
];

const defaultFitIndices: SEMFitIndices = {
  chiSquare: 1245.32,
  df: 342,
  rmsea: 0.052,
  cfi: 0.968,
  gfi: 0.951,
  tli: 0.963,
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
          viewBox="0 0 900 1000"
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

