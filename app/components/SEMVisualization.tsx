"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type SEMPath = {
  from: string;
  to: string;
  coefficient: number;
  pValue: number;
  significant: boolean;
  label: string;
};

type SEMVariable = {
  id: string;
  label: string;
  type: "exogenous" | "endogenous" | "mediator";
  x: number;
  y: number;
};

type SEMVisualizationProps = {
  variables?: SEMVariable[];
  paths?: SEMPath[];
  fitIndices?: {
    chiSquare: number;
    df: number;
    cfi: number;
    tli: number;
    rmsea: number;
    srmr: number;
  };
};

// NCSKIT Design Studio - SEM Model Example
const defaultVariables: SEMVariable[] = [
  { id: "PEOU", label: "Perceived\nEase of Use", type: "exogenous", x: 50, y: 200 },
  { id: "PU", label: "Perceived\nUsefulness", type: "mediator", x: 200, y: 200 },
  { id: "TR", label: "Trust", type: "exogenous", x: 50, y: 350 },
  { id: "BI", label: "Behavioral\nIntention", type: "endogenous", x: 350, y: 275 },
];

// Analysis Hub - SEM Results from Design Studio Model
const defaultPaths: SEMPath[] = [
  { from: "PEOU", to: "PU", coefficient: 0.387, pValue: 0.001, significant: true, label: "H1" },
  { from: "PU", to: "BI", coefficient: 0.452, pValue: 0.001, significant: true, label: "H2" },
  { from: "TR", to: "BI", coefficient: 0.321, pValue: 0.001, significant: true, label: "H3" },
];

const defaultFitIndices = {
  chiSquare: 245.32,
  df: 105,
  cfi: 0.967,
  tli: 0.961,
  rmsea: 0.048,
  srmr: 0.042,
};

export function SEMVisualization({
  variables = defaultVariables,
  paths = defaultPaths,
  fitIndices = defaultFitIndices,
}: SEMVisualizationProps) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getVariableColor = (type: string) => {
    switch (type) {
      case "exogenous":
        return "#3b82f6"; // blue
      case "mediator":
        return "#8b5cf6"; // purple
      case "endogenous":
        return "#10b981"; // green
      default:
        return "#6b7280";
    }
  };

  const getPathColor = (path: SEMPath) => {
    if (hoveredPath === path.label) return "#ef4444";
    if (!path.significant) return "#d1d5db";
    return path.coefficient > 0 ? "#10b981" : "#ef4444";
  };

  const getPathWidth = (path: SEMPath) => {
    return Math.abs(path.coefficient) * 4 + 2;
  };

  const calculatePath = (from: SEMVariable, to: SEMVariable) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return { distance, angle, dx, dy };
  };

  return (
    <div className="sem-visualization component-card">
      <div className="sem-header">
        <div>
          <h4>Interactive SEM Model</h4>
          <p>Click variables or paths to explore relationships and significance levels</p>
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
          viewBox="0 0 800 600"
          className="sem-canvas"
          style={{ width: "100%", height: "auto", maxHeight: "600px" }}
        >
          {/* Render paths */}
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
                  opacity={hoveredPath && hoveredPath !== path.label ? 0.3 : 1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  onMouseEnter={() => setHoveredPath(path.label)}
                  onMouseLeave={() => setHoveredPath(null)}
                  style={{ cursor: "pointer" }}
                />
                {/* Arrow head */}
                <motion.polygon
                  points={`${toVar.x - 15 * Math.cos((angle - 90) * (Math.PI / 180))},${
                    toVar.y - 15 * Math.sin((angle - 90) * (Math.PI / 180))
                  } ${toVar.x},${toVar.y} ${
                    toVar.x - 15 * Math.cos((angle + 90) * (Math.PI / 180))
                  },${toVar.y - 15 * Math.sin((angle + 90) * (Math.PI / 180))}`}
                  fill={getPathColor(path)}
                  opacity={hoveredPath && hoveredPath !== path.label ? 0.3 : 1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
                />
                {/* Path label */}
                <motion.text
                  x={midX}
                  y={midY - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill={getPathColor(path)}
                  initial={{ opacity: 0, y: midY }}
                  animate={{ opacity: 1, y: midY - 10 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.6 }}
                >
                  {path.label}: {path.coefficient.toFixed(3)}
                  {path.significant && (
                    <tspan fontSize="10" fill={path.coefficient > 0 ? "#10b981" : "#ef4444"}>
                      {" ***"}
                    </tspan>
                  )}
                </motion.text>
              </g>
            );
          })}

          {/* Render variables */}
          {variables.map((variable, index) => (
            <g key={variable.id}>
              <motion.circle
                cx={variable.x}
                cy={variable.y}
                r={45}
                fill={getVariableColor(variable.type)}
                fillOpacity={selectedVariable === variable.id ? 0.3 : 0.1}
                stroke={getVariableColor(variable.type)}
                strokeWidth={selectedVariable === variable.id ? 3 : 2}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                onMouseEnter={() => setSelectedVariable(variable.id)}
                onMouseLeave={() => setSelectedVariable(null)}
                style={{ cursor: "pointer" }}
              />
              <motion.text
                x={variable.x}
                y={variable.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="600"
                fill={getVariableColor(variable.type)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
              >
                {variable.label.split("\n").map((line, i) => (
                  <tspan key={i} x={variable.x} dy={i === 0 ? 0 : 14}>
                    {line}
                  </tspan>
                ))}
              </motion.text>
            </g>
          ))}
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
            <span className="fit-label">CFI</span>
            <span className="fit-value">{fitIndices.cfi.toFixed(3)}</span>
            <span className="fit-status excellent">Excellent</span>
          </div>
          <div className="fit-index-item">
            <span className="fit-label">TLI</span>
            <span className="fit-value">{fitIndices.tli.toFixed(3)}</span>
            <span className="fit-status excellent">Excellent</span>
          </div>
          <div className="fit-index-item">
            <span className="fit-label">RMSEA</span>
            <span className="fit-value">{fitIndices.rmsea.toFixed(3)}</span>
            <span className="fit-status good">Good</span>
          </div>
          <div className="fit-index-item">
            <span className="fit-label">SRMR</span>
            <span className="fit-value">{fitIndices.srmr.toFixed(3)}</span>
            <span className="fit-status excellent">Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
}

