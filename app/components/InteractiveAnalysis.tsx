"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type InteractiveAnalysisProps = {
  mode?: "chart" | "table" | "sem";
  initialView?: "overview" | "detailed";
};

type ChartDataItem = {
  name: string;
  value: number;
  target: number;
  completed?: number;
  total?: number;
  description?: string;
};

// Real workflow progress based on quantitative research flow
const chartData: ChartDataItem[] = [
  {
    name: "Ideation & Design",
    value: 100,
    target: 100,
    completed: 4,
    total: 4,
    description: "Topic selection, theoretical framework, research model design, and questionnaire development"
  },
  {
    name: "Data Collection",
    value: 85,
    target: 100,
    completed: 1,
    total: 1,
    description: "Survey distribution and data gathering phase"
  },
  {
    name: "Data Analysis",
    value: 92,
    target: 95,
    completed: 8,
    total: 9,
    description: "Data health check, reliability, descriptive stats, assumptions, correlation, group comparisons, regression"
  },
  {
    name: "Advanced Analysis",
    value: 0,
    target: 100,
    completed: 0,
    total: 1,
    description: "Multivariate analysis (PCA, SEM) and model validation"
  },
  {
    name: "Writing & Publishing",
    value: 0,
    target: 100,
    completed: 0,
    total: 1,
    description: "Manuscript writing, peer review response, and final submission"
  },
];

type ExtendedTableData = {
  variable: string;
  mean: number;
  sd: number;
  min: number;
  max: number;
  median: number;
  skewness: number;
  kurtosis: number;
  alpha: number;
  normality?: { test: string; statistic: number; pValue: number; normal: boolean };
  correlations?: { variable: string; coefficient: number; pValue: number }[];
  reliability?: { cr: number; ave: number };
};

const tableData: ExtendedTableData[] = [
  {
    variable: "PU",
    mean: 4.23,
    sd: 0.89,
    min: 2.1,
    max: 5.0,
    median: 4.3,
    skewness: -0.34,
    kurtosis: -0.12,
    alpha: 0.92,
    normality: { test: "Shapiro-Wilk", statistic: 0.987, pValue: 0.234, normal: true },
    correlations: [
      { variable: "PEOU", coefficient: 0.67, pValue: 0.001 },
      { variable: "BI", coefficient: 0.72, pValue: 0.001 },
    ],
    reliability: { cr: 0.93, ave: 0.76 },
  },
  {
    variable: "PEOU",
    mean: 4.15,
    sd: 0.92,
    min: 1.9,
    max: 5.0,
    median: 4.2,
    skewness: -0.41,
    kurtosis: -0.08,
    alpha: 0.89,
    normality: { test: "Shapiro-Wilk", statistic: 0.983, pValue: 0.156, normal: true },
    correlations: [
      { variable: "PU", coefficient: 0.67, pValue: 0.001 },
      { variable: "BI", coefficient: 0.58, pValue: 0.001 },
    ],
    reliability: { cr: 0.91, ave: 0.72 },
  },
  {
    variable: "BI",
    mean: 4.31,
    sd: 0.85,
    min: 2.3,
    max: 5.0,
    median: 4.4,
    skewness: -0.28,
    kurtosis: -0.15,
    alpha: 0.94,
    normality: { test: "Shapiro-Wilk", statistic: 0.991, pValue: 0.389, normal: true },
    correlations: [
      { variable: "PU", coefficient: 0.72, pValue: 0.001 },
      { variable: "PEOU", coefficient: 0.58, pValue: 0.001 },
      { variable: "TR", coefficient: 0.64, pValue: 0.001 },
    ],
    reliability: { cr: 0.95, ave: 0.79 },
  },
  {
    variable: "TR",
    mean: 3.98,
    sd: 0.94,
    min: 1.8,
    max: 5.0,
    median: 4.0,
    skewness: -0.19,
    kurtosis: -0.22,
    alpha: 0.87,
    normality: { test: "Shapiro-Wilk", statistic: 0.978, pValue: 0.089, normal: true },
    correlations: [
      { variable: "BI", coefficient: 0.64, pValue: 0.001 },
    ],
    reliability: { cr: 0.89, ave: 0.68 },
  },
  {
    variable: "SAT",
    mean: 4.18,
    sd: 0.88,
    min: 2.0,
    max: 5.0,
    median: 4.2,
    skewness: -0.31,
    kurtosis: -0.11,
    alpha: 0.91,
    normality: { test: "Shapiro-Wilk", statistic: 0.985, pValue: 0.201, normal: true },
    correlations: [
      { variable: "PU", coefficient: 0.69, pValue: 0.001 },
      { variable: "BI", coefficient: 0.71, pValue: 0.001 },
    ],
    reliability: { cr: 0.92, ave: 0.74 },
  },
  {
    variable: "PE",
    mean: 3.92,
    sd: 0.96,
    min: 1.7,
    max: 5.0,
    median: 4.0,
    skewness: -0.25,
    kurtosis: -0.18,
    alpha: 0.88,
    normality: { test: "Shapiro-Wilk", statistic: 0.980, pValue: 0.112, normal: true },
    correlations: [
      { variable: "TR", coefficient: -0.52, pValue: 0.001 },
      { variable: "BI", coefficient: -0.48, pValue: 0.001 },
    ],
    reliability: { cr: 0.90, ave: 0.70 },
  },
];

const COLORS = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b"];

export function InteractiveAnalysis({ mode = "chart", initialView = "overview" }: InteractiveAnalysisProps) {
  const [view, setView] = useState<"overview" | "detailed">(initialView);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);

  // Calculate selected data for table mode using useMemo
  const selectedData = useMemo(() => {
    if (mode === "table" && selectedVariable) {
      return tableData.find((d) => d.variable === selectedVariable) ?? null;
    }
    return null;
  }, [mode, selectedVariable]);

  switch (mode) {
    case "chart":
      return (
        <div className="interactive-analysis-chart component-card">
          <div className="analysis-header">
            <div>
              <h4>Research Workflow Progress</h4>
              <p>Quantitative research flow tracking: 13 steps across 5 phases. Completed: 13/15 steps (87% overall progress)</p>
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
                  <BarChart data={chartData.map(({ name, value, target }) => ({ name, value, target }))} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  <LineChart data={chartData.map(({ name, value, target }) => ({ name, value, target }))} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                <div className="stat-header">
                  <span className="stat-label">{item.name}</span>
                  <span className="stat-value">{item.value}%</span>
                </div>
                {item.total && (
                  <div className="stat-meta">
                    <span className="stat-steps">
                      {item.completed}/{item.total} steps completed
                    </span>
                  </div>
                )}
                {hoveredItem === item.name && item.description && (
                  <p className="stat-description">{item.description}</p>
                )}
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

    case "table":
      return (
        <div className="interactive-analysis-table component-card">
          <div className="analysis-header">
            <div>
              <h4>Comprehensive Statistical Analysis</h4>
              <p>Click on any variable to explore detailed metrics including reliability, validity, distribution, normality tests, and correlations</p>
            </div>
          </div>

          <div className="table-container" style={{ overflowX: "auto" }}>
            <table className="interactive-table">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Mean</th>
                  <th>SD</th>
                  <th>Median</th>
                  <th>Min</th>
                  <th>Max</th>
                  <th>Skewness</th>
                  <th>Kurtosis</th>
                  <th>α (Cronbach)</th>
                  <th>CR</th>
                  <th>AVE</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <motion.tr
                    key={row.variable}
                    className={selectedVariable === row.variable ? "selected" : ""}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                    <td>{row.median.toFixed(2)}</td>
                    <td>{row.min.toFixed(1)}</td>
                    <td>{row.max.toFixed(1)}</td>
                    <td>
                      <span style={{ color: Math.abs(row.skewness) > 1 ? "#ef4444" : Math.abs(row.skewness) > 0.5 ? "#f59e0b" : "#10b981" }}>
                        {row.skewness.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: Math.abs(row.kurtosis) > 1 ? "#ef4444" : Math.abs(row.kurtosis) > 0.5 ? "#f59e0b" : "#10b981" }}>
                        {row.kurtosis.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className={row.alpha >= 0.9 ? "excellent" : row.alpha >= 0.7 ? "good" : "fair"}>
                        {row.alpha.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className={row.reliability && row.reliability.cr >= 0.9 ? "excellent" : row.reliability && row.reliability.cr >= 0.7 ? "good" : "fair"}>
                        {row.reliability?.cr.toFixed(2) ?? "—"}
                      </span>
                    </td>
                    <td>
                      <span className={row.reliability && row.reliability.ave >= 0.5 ? "excellent" : "fair"}>
                        {row.reliability?.ave.toFixed(2) ?? "—"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <AnimatePresence>
            {selectedVariable && selectedData && (
              <motion.div
                key={selectedVariable}
                className="variable-detail"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h5>Comprehensive Analysis: {selectedVariable}</h5>

                <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                  {/* Reliability & Validity */}
                  <div className="detail-section">
                    <h6>Reliability & Validity</h6>
                    <div className="detail-item">
                      <span>Cronbach&apos;s Alpha</span>
                      <strong className={selectedData.alpha >= 0.9 ? "excellent" : selectedData.alpha >= 0.7 ? "good" : "fair"}>
                        {selectedData.alpha.toFixed(3)} {selectedData.alpha >= 0.9 ? "✓ Excellent" : selectedData.alpha >= 0.7 ? "✓ Good" : "⚠ Acceptable"}
                      </strong>
                    </div>
                    {selectedData.reliability && (
                      <>
                        <div className="detail-item">
                          <span>Composite Reliability (CR)</span>
                          <strong className={selectedData.reliability.cr >= 0.9 ? "excellent" : selectedData.reliability.cr >= 0.7 ? "good" : "fair"}>
                            {selectedData.reliability.cr.toFixed(3)}
                          </strong>
                        </div>
                        <div className="detail-item">
                          <span>Average Variance Extracted (AVE)</span>
                          <strong className={selectedData.reliability.ave >= 0.5 ? "excellent" : "fair"}>
                            {selectedData.reliability.ave.toFixed(3)} {selectedData.reliability.ave >= 0.5 ? "✓ Acceptable" : "⚠ Low"}
                          </strong>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Distribution & Normality */}
                  <div className="detail-section">
                    <h6>Distribution & Normality</h6>
                    <div className="detail-item">
                      <span>Normality Test</span>
                      <strong>
                        {selectedData.normality?.test ?? "Shapiro-Wilk"}: {selectedData.normality?.statistic.toFixed(3) ?? "—"}
                      </strong>
                    </div>
                    <div className="detail-item">
                      <span>Normality p-value</span>
                      <strong className={selectedData.normality?.normal ? "excellent" : "fair"}>
                        {selectedData.normality?.pValue.toFixed(3) ?? "—"} {selectedData.normality?.normal ? "✓ Normal" : selectedData.normality ? "⚠ Non-normal" : ""}
                      </strong>
                    </div>
                    <div className="detail-item">
                      <span>Skewness</span>
                      <strong style={{ color: Math.abs(selectedData.skewness) > 1 ? "#ef4444" : Math.abs(selectedData.skewness) > 0.5 ? "#f59e0b" : "#10b981" }}>
                        {selectedData.skewness.toFixed(3)} {Math.abs(selectedData.skewness) < 0.5 ? "✓ Normal" : Math.abs(selectedData.skewness) < 1 ? "⚠ Moderate" : "✗ Severe"}
                      </strong>
                    </div>
                    <div className="detail-item">
                      <span>Kurtosis</span>
                      <strong style={{ color: Math.abs(selectedData.kurtosis) > 1 ? "#ef4444" : Math.abs(selectedData.kurtosis) > 0.5 ? "#f59e0b" : "#10b981" }}>
                        {selectedData.kurtosis.toFixed(3)} {Math.abs(selectedData.kurtosis) < 0.5 ? "✓ Normal" : Math.abs(selectedData.kurtosis) < 1 ? "⚠ Moderate" : "✗ Severe"}
                      </strong>
                    </div>
                  </div>

                  {/* Correlations */}
                  {selectedData.correlations && selectedData.correlations.length > 0 && (
                    <div className="detail-section">
                      <h6>Significant Correlations</h6>
                      {selectedData.correlations.map((corr) => (
                        <div key={corr.variable} className="detail-item">
                          <span>with {corr.variable}</span>
                          <strong className={Math.abs(corr.coefficient) >= 0.7 ? "excellent" : Math.abs(corr.coefficient) >= 0.5 ? "good" : "fair"}>
                            r = {corr.coefficient.toFixed(3)} {corr.pValue < 0.001 ? "***" : corr.pValue < 0.01 ? "**" : corr.pValue < 0.05 ? "*" : ""}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Descriptive Stats */}
                  <div className="detail-section">
                    <h6>Descriptive Statistics</h6>
                    <div className="detail-item">
                      <span>Range</span>
                      <strong>{selectedData.min.toFixed(1)} - {selectedData.max.toFixed(1)}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Interquartile Range (IQR)</span>
                      <strong>{(selectedData.max - selectedData.min).toFixed(2)}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Mean vs Median</span>
                      <strong>
                        {selectedData.mean > selectedData.median ? "Right-skewed" : selectedData.mean < selectedData.median ? "Left-skewed" : "Symmetric"}
                      </strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scientific Interpretation Section */}
          <div className="statistical-interpretation">
            <h5>Scientific Interpretation Guide</h5>

            <div className="interpretation-grid">
              <div className="interpretation-section">
                <h6>Understanding Descriptive Statistics</h6>
                <p><strong>Mean</strong> represents the average value, providing a central tendency measure. <strong>Standard Deviation (SD)</strong> indicates data dispersion—smaller SD means data points cluster closer to the mean. <strong>Median</strong> shows the middle value, useful when data is skewed.</p>
                <p><strong>Skewness</strong> measures distribution asymmetry: values between -0.5 and 0.5 indicate approximately normal distribution. <strong>Kurtosis</strong> describes tail heaviness: values between -0.5 and 0.5 suggest normal tails.</p>
              </div>

              <div className="interpretation-section">
                <h6>Reliability & Validity Assessment</h6>
                <p><strong>Cronbach&apos;s Alpha (α)</strong> measures internal consistency: α ≥ 0.9 (excellent), 0.7-0.9 (good), &lt;0.7 (needs improvement). <strong>Composite Reliability (CR)</strong> ≥ 0.7 indicates adequate reliability. <strong>Average Variance Extracted (AVE)</strong> ≥ 0.5 confirms convergent validity.</p>
                <p>These metrics ensure your measurement scales consistently capture the intended constructs, which is essential for valid research conclusions.</p>
              </div>

              <div className="interpretation-section">
                <h6>Normality Testing</h6>
                <p>The <strong>Shapiro-Wilk test</strong> assesses whether data follows a normal distribution. A <em>p-value &gt; 0.05</em> suggests normal distribution, allowing use of parametric tests (t-test, ANOVA, regression). Non-normal distributions may require non-parametric alternatives (Mann-Whitney, Kruskal-Wallis).</p>
              </div>

              <div className="interpretation-section">
                <h6>Correlation Analysis</h6>
                <p><strong>Correlation coefficients (r)</strong> measure linear relationships: |r| ≥ 0.7 (strong), 0.5-0.7 (moderate), &lt;0.5 (weak). Significance levels (* p&lt;0.05, ** p&lt;0.01, *** p&lt;0.001) indicate statistical reliability.</p>
                <p>Correlations help identify relationships between variables but do not imply causation—always consider theoretical foundations when interpreting results.</p>
              </div>
            </div>

            <div className="interpretation-note">
              <p><strong>Research Application:</strong> These statistical analyses form the foundation for evidence-based research. Descriptive statistics provide initial data understanding, reliability tests ensure measurement quality, normality checks guide appropriate statistical methods, and correlation analysis reveals variable relationships. Together, they enable rigorous hypothesis testing and valid research conclusions suitable for ISI/Scopus publications.</p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
