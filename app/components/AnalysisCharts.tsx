"use client";

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

type ChartType = "line" | "bar" | "pie" | "correlation";

type AnalysisChartsProps = {
  type: ChartType;
  title?: string;
  data?: any[];
  compact?: boolean;
};

const COLORS = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

const defaultLineData = [
  { name: "Q1", Value: 3.2, Target: 3.5 },
  { name: "Q2", Value: 3.8, Target: 3.5 },
  { name: "Q3", Value: 4.1, Target: 3.8 },
  { name: "Q4", Value: 4.3, Target: 4.0 },
  { name: "Q5", Value: 4.5, Target: 4.2 },
];

const defaultBarData = [
  { name: "PU", Mean: 4.23, SD: 0.89 },
  { name: "PEOU", Mean: 4.15, SD: 0.92 },
  { name: "BI", Mean: 4.31, SD: 0.85 },
  { name: "TR", Mean: 3.98, SD: 0.94 },
];

const defaultPieData = [
  { name: "Supported", value: 75, color: "#10b981" },
  { name: "Not Supported", value: 15, color: "#ef4444" },
  { name: "Partial", value: 10, color: "#f59e0b" },
];

const defaultCorrelationData = [
  { variable: "PU", PU: 1.0, PEOU: 0.623, BI: 0.712, TR: 0.534 },
  { variable: "PEOU", PU: 0.623, PEOU: 1.0, BI: 0.589, TR: 0.487 },
  { variable: "BI", PU: 0.712, PEOU: 0.589, BI: 1.0, TR: 0.601 },
  { variable: "TR", PU: 0.534, PEOU: 0.487, BI: 0.601, TR: 1.0 },
];

export function AnalysisCharts({ type, title, data, compact = false }: AnalysisChartsProps) {
  const chartData = data || (type === "line" ? defaultLineData : type === "bar" ? defaultBarData : type === "pie" ? defaultPieData : defaultCorrelationData);

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} domain={[0, 5]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Value"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ fill: "#2563eb", r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Target"
          stroke="#8b5cf6"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: "#8b5cf6", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} domain={[0, 5]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend />
        <Bar dataKey="Mean" fill="#2563eb" radius={[8, 8, 0, 0]} />
        <Bar dataKey="SD" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(props: any) => {
            const { name, percent } = props;
            return `${name || ""}: ${((percent || 0) * 100).toFixed(0)}%`;
          }}
          outerRadius={compact ? 70 : 100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderCorrelationHeatmap = () => {
    const variables = ["PU", "PEOU", "BI", "TR"];
    return (
      <div className="correlation-heatmap">
        <table className="correlation-table">
          <thead>
            <tr>
              <th></th>
              {variables.map((v) => (
                <th key={v}>{v}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chartData.map((row) => (
              <tr key={row.variable}>
                <th>{row.variable}</th>
                {variables.map((v) => {
                  const value = row[v];
                  const intensity = Math.abs(value);
                  const bgColor = value === 1
                    ? "#e5e7eb"
                    : value > 0.5
                    ? `rgba(16, 185, 129, ${intensity})`
                    : value > 0
                    ? `rgba(16, 185, 129, ${intensity * 0.6})`
                    : `rgba(239, 68, 68, ${intensity})`;
                  return (
                    <td
                      key={v}
                      style={{
                        backgroundColor: bgColor,
                        color: intensity > 0.5 ? "#fff" : "#1f2937",
                        fontWeight: value === 1 ? 700 : 600,
                      }}
                    >
                      {value.toFixed(3)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case "line":
        return renderLineChart();
      case "bar":
        return renderBarChart();
      case "pie":
        return renderPieChart();
      case "correlation":
        return renderCorrelationHeatmap();
      default:
        return renderLineChart();
    }
  };

  return (
    <motion.div
      className={`analysis-chart ${compact ? "compact" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && <h4 className="chart-title">{title}</h4>}
      <div className="chart-container">{renderChart()}</div>
    </motion.div>
  );
}

