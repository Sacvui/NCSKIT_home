"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const AnalysisCharts = dynamic(() => import("./AnalysisCharts").then(mod => ({ default: mod.AnalysisCharts })), {
  ssr: false,
  loading: () => <div className="analysis-chart" style={{ minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading chart...</div>
});

type ResearchMetric = {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "stable";
  unit?: string;
};

type ResearchMetricsProps = {
  metrics?: ResearchMetric[];
  showCharts?: boolean;
};

const defaultMetrics: ResearchMetric[] = [
  { label: "Active Projects", value: 12, change: 3, trend: "up" },
  { label: "Papers Indexed", value: 247, change: 15, trend: "up" },
  { label: "Data Analyses Run", value: 1.2, change: 0.3, trend: "up", unit: "K" },
  { label: "Export Success Rate", value: "98.5%", change: 2.1, trend: "up" },
];

export function ResearchMetrics({ metrics = defaultMetrics, showCharts = true }: ResearchMetricsProps) {
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case "up":
        return "#10b981";
      case "down":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="research-metrics">
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="metric-card component-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="metric-header">
              <span className="metric-label">{metric.label}</span>
              {metric.trend && (
                <span
                  className="metric-trend"
                  style={{ color: getTrendColor(metric.trend) }}
                >
                  {getTrendIcon(metric.trend)}
                </span>
              )}
            </div>
            <div className="metric-value">
              {metric.value}
              {metric.unit && <span className="metric-unit">{metric.unit}</span>}
            </div>
            {metric.change !== undefined && (
              <div className="metric-change" style={{ color: getTrendColor(metric.trend) }}>
                {metric.change > 0 ? "+" : ""}
                {metric.change}
                {typeof metric.change === "number" && "%"} vs last month
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {showCharts && (
        <div className="metrics-charts-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AnalysisCharts type="line" title="Research Activity Trend" compact />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <AnalysisCharts type="bar" title="Module Usage Statistics" compact />
          </motion.div>
        </div>
      )}
    </div>
  );
}

