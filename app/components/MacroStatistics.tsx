"use client";

import { motion } from "framer-motion";
import { AnalysisCharts } from "./AnalysisCharts";

type MacroStat = {
  label: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "stable";
  unit?: string;
};

type MacroStatisticsProps = {
  stats?: MacroStat[];
  showCharts?: boolean;
};

const defaultStats: MacroStat[] = [
  { label: "GDP Growth", value: "5.2%", change: 0.3, trend: "up", unit: "%" },
  { label: "Inflation Rate", value: "2.8%", change: -0.2, trend: "down", unit: "%" },
  { label: "Unemployment", value: "3.5%", change: -0.1, trend: "down", unit: "%" },
  { label: "Trade Balance", value: "$12.5B", change: 1.2, trend: "up", unit: "B" },
];

export function MacroStatistics({ stats = defaultStats, showCharts = true }: MacroStatisticsProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  const getTrendColor = (trend: string) => {
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
    <div className="macro-statistics">
      <div className="macro-stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="macro-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="macro-stat-header">
              <span className="macro-stat-label">{stat.label}</span>
              <span
                className="macro-stat-trend"
                style={{ color: getTrendColor(stat.trend) }}
              >
                {getTrendIcon(stat.trend)}
              </span>
            </div>
            <div className="macro-stat-value">{stat.value}</div>
            <div className="macro-stat-change" style={{ color: getTrendColor(stat.trend) }}>
              {stat.change > 0 ? "+" : ""}
              {stat.change}% vs previous period
            </div>
          </motion.div>
        ))}
      </div>

      {showCharts && (
        <div className="macro-charts-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AnalysisCharts type="line" title="Economic Indicators Trend" compact />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <AnalysisCharts type="bar" title="Sector Performance" compact />
          </motion.div>
        </div>
      )}
    </div>
  );
}

