"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type InteractiveAnalysisProps = {
  mode?: "chart" | "table" | "sem";
  initialView?: "overview" | "detailed";
};

const chartData = [
  { name: "Ideation", value: 95, target: 90 },
  { name: "Design", value: 88, target: 85 },
  { name: "Analysis", value: 92, target: 88 },
  { name: "Publishing", value: 87, target: 85 },
];

const tableData = [
  { variable: "PU", mean: 4.23, sd: 0.89, min: 2.1, max: 5.0, alpha: 0.92 },
  { variable: "PEOU", mean: 4.15, sd: 0.92, min: 1.9, max: 5.0, alpha: 0.89 },
  { variable: "BI", mean: 4.31, sd: 0.85, min: 2.3, max: 5.0, alpha: 0.94 },
  { variable: "TR", mean: 3.98, sd: 0.94, min: 1.8, max: 5.0, alpha: 0.87 },
];

const COLORS = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b"];

export function InteractiveAnalysis({ mode = "chart", initialView = "overview" }: InteractiveAnalysisProps) {
  const [view, setView] = useState<"overview" | "detailed">(initialView);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);

  if (mode === "chart") {
    return (
      <div className="interactive-analysis-chart component-card">
        <div className="analysis-header">
          <div>
            <h4>Research Workflow Progress</h4>
            <p>Real-time tracking across all modules</p>
          </div>
          <div className="view-toggle">
            <button
              className={view === "overview" ? "active" : ""}
              onClick={() => setView("overview")}
            >
              Overview
            </button>
            <button
              className={view === "detailed" ? "active" : ""}
              onClick={() => setView("detailed")}
            >
              Detailed
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--color-text-muted)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-text-muted)"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      boxShadow: "var(--shadow-lg)",
                    }}
                    cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Current"
                    fill="#2563eb"
                    radius={[8, 8, 0, 0]}
                    onMouseEnter={() => setHoveredItem("value")}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      filter: hoveredItem === "value" ? "brightness(1.2)" : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={hoveredItem === "value" ? "#3b82f6" : COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="target"
                    name="Target"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                    opacity={0.6}
                    onMouseEnter={() => setHoveredItem("target")}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      filter: hoveredItem === "target" ? "brightness(1.2)" : "none",
                      transition: "all 0.3s ease",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <motion.div
              key="detailed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--color-text-muted)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-text-muted)"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      boxShadow: "var(--shadow-lg)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Current Progress"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: "#2563eb", r: 6 }}
                    activeDot={{ r: 8, fill: "#3b82f6" }}
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Target"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#8b5cf6", r: 4 }}
                    opacity={0.7}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="analysis-stats">
          {chartData.map((item, index) => (
            <motion.div
              key={item.name}
              className="stat-item"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                background: hoveredItem === item.name ? "var(--color-card-alt)" : "transparent",
                borderColor: hoveredItem === item.name ? "var(--color-primary-light)" : "var(--color-border)",
              }}
            >
              <span className="stat-label">{item.name}</span>
              <span className="stat-value">{item.value}%</span>
              <div className="stat-progress">
                <motion.div
                  className="stat-progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  style={{ background: COLORS[index % COLORS.length] }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (mode === "table") {
    return (
      <div className="interactive-analysis-table component-card">
        <div className="analysis-header">
          <div>
            <h4>Descriptive Statistics</h4>
            <p>Click on any variable to see detailed analysis</p>
          </div>
        </div>

        <div className="table-container">
          <table className="interactive-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Mean</th>
                <th>SD</th>
                <th>Min</th>
                <th>Max</th>
                <th>α (Cronbach)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <motion.tr
                  key={row.variable}
                  className={selectedVariable === row.variable ? "selected" : ""}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedVariable(selectedVariable === row.variable ? null : row.variable)}
                  onMouseEnter={() => setHoveredItem(row.variable)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    background: selectedVariable === row.variable
                      ? "rgba(37, 99, 235, 0.1)"
                      : hoveredItem === row.variable
                      ? "rgba(37, 99, 235, 0.05)"
                      : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <td>
                    <strong>{row.variable}</strong>
                  </td>
                  <td>{row.mean.toFixed(2)}</td>
                  <td>{row.sd.toFixed(2)}</td>
                  <td>{row.min.toFixed(1)}</td>
                  <td>{row.max.toFixed(1)}</td>
                  <td>
                    <span className={row.alpha >= 0.9 ? "excellent" : row.alpha >= 0.7 ? "good" : "fair"}>
                      {row.alpha.toFixed(2)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <AnimatePresence>
          {selectedVariable && (
            <motion.div
              className="variable-detail"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h5>Detailed Analysis: {selectedVariable}</h5>
              <div className="detail-grid">
                <div className="detail-item">
                  <span>Reliability</span>
                  <strong>Excellent (α ≥ 0.9)</strong>
                </div>
                <div className="detail-item">
                  <span>Distribution</span>
                  <strong>Normal (Skewness: -0.23)</strong>
                </div>
                <div className="detail-item">
                  <span>Outliers</span>
                  <strong>None detected</strong>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null;
}

