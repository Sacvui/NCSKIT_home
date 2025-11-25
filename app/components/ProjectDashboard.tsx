"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type ResearchScenario = {
  id: string;
  title: string;
  description: string;
  workflow: string;
  steps: {
    id: string;
    label: string;
    status: "completed" | "in-progress" | "pending";
    progress: number;
  }[];
};

const researchScenarios: ResearchScenario[] = [
  {
    id: "quantitative",
    title: "Nghiên cứu Định lượng",
    description: "Khảo sát, thực nghiệm, phân tích số liệu thống kê",
    workflow: "Quantitative Flow",
    steps: [
      { id: "ideation", label: "Ideation Lab - Chọn đề tài & Xây dựng khung lý thuyết", status: "completed", progress: 100 },
      { id: "literature", label: "Literature Review - Tổng hợp tài liệu tham khảo", status: "completed", progress: 100 },
      { id: "design", label: "Design Studio - Thiết kế mô hình nghiên cứu (SEM/CFA)", status: "completed", progress: 100 },
      { id: "survey", label: "Survey Builder - Xây dựng bảng hỏi", status: "completed", progress: 100 },
      { id: "data", label: "Data Collection - Thu thập dữ liệu", status: "in-progress", progress: 85 },
      { id: "health", label: "Data Health Check - Kiểm tra missing, outliers", status: "completed", progress: 100 },
      { id: "reliability", label: "Reliability & Validity - Cronbach's Alpha, EFA", status: "completed", progress: 100 },
      { id: "descriptive", label: "Descriptive Statistics - Mean, SD, Skewness", status: "completed", progress: 100 },
      { id: "assumptions", label: "Assumptions Testing - Normality, Levene", status: "completed", progress: 100 },
      { id: "correlation", label: "Correlation Analysis - Pearson/Spearman", status: "completed", progress: 100 },
      { id: "group", label: "Group Comparisons - T-test, ANOVA, Mann-Whitney", status: "completed", progress: 100 },
      { id: "regression", label: "Regression / Modeling - Linear, Logistic", status: "in-progress", progress: 70 },
      { id: "multivariate", label: "Multivariate Analysis - PCA, SEM", status: "pending", progress: 0 },
      { id: "writing", label: "Writing & Publishing - Xuất báo cáo", status: "pending", progress: 0 },
    ],
  },
  {
    id: "qualitative",
    title: "Nghiên cứu Định tính",
    description: "Phỏng vấn, quan sát, phân tích nội dung",
    workflow: "Qualitative Flow",
    steps: [
      { id: "ideation", label: "Ideation Lab - Xác định câu hỏi nghiên cứu", status: "completed", progress: 100 },
      { id: "literature", label: "Literature Review - Tổng hợp lý thuyết nền", status: "completed", progress: 100 },
      { id: "design", label: "Design Studio - Thiết kế phỏng vấn/Quan sát", status: "completed", progress: 100 },
      { id: "data", label: "Data Collection - Phỏng vấn, ghi chép", status: "in-progress", progress: 80 },
      { id: "transcription", label: "Transcription - Gỡ băng, chuẩn hóa văn bản", status: "in-progress", progress: 60 },
      { id: "coding", label: "Coding - Open/Axial coding", status: "pending", progress: 0 },
      { id: "thematic", label: "Thematic Analysis - Rút trích chủ đề", status: "pending", progress: 0 },
      { id: "validation", label: "Validation - Member checking", status: "pending", progress: 0 },
      { id: "writing", label: "Writing & Publishing - Tổng hợp insight", status: "pending", progress: 0 },
    ],
  },
  {
    id: "systematic",
    title: "Tổng quan Tài liệu",
    description: "Systematic Review, Meta-analysis",
    workflow: "Systematic Review Flow",
    steps: [
      { id: "ideation", label: "Ideation Lab - Xác định câu hỏi nghiên cứu", status: "completed", progress: 100 },
      { id: "search", label: "Search Strategy - Từ khóa, cơ sở dữ liệu (Scopus, WoS)", status: "completed", progress: 100 },
      { id: "screening", label: "Screening (PRISMA) - Sàng lọc bài báo", status: "in-progress", progress: 75 },
      { id: "quality", label: "Quality Assessment - Đánh giá chất lượng", status: "pending", progress: 0 },
      { id: "synthesis", label: "Synthesis - Meta-analysis hoặc Narrative", status: "pending", progress: 0 },
      { id: "writing", label: "Writing & Publishing - Báo cáo tổng hợp", status: "pending", progress: 0 },
    ],
  },
];

export function ProjectDashboard() {
  const [activeScenario, setActiveScenario] = useState(0);
  const scenario = researchScenarios[activeScenario];
  const completed = scenario.steps.filter((s) => s.status === "completed").length;
  const inProgress = scenario.steps.filter((s) => s.status === "in-progress").length;
  const pending = scenario.steps.filter((s) => s.status === "pending").length;
  const totalProgress = Math.round(
    scenario.steps.reduce((sum, s) => sum + s.progress, 0) / scenario.steps.length
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "in-progress":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓";
      case "in-progress":
        return "⟳";
      default:
        return "○";
    }
  };

  return (
    <div className="project-dashboard component-card">
      <div className="dashboard-header">
        <div>
          <h3>Kịch bản Nghiên cứu Khoa học</h3>
          <p className="dashboard-workflow">Chọn workflow phù hợp với loại hình nghiên cứu của bạn</p>
        </div>
        <div className="dashboard-stats">
          <div className="stat-item">
            <span className="stat-value">{totalProgress}%</span>
            <span className="stat-label">Overall Progress</span>
          </div>
        </div>
      </div>

      <div className="scenario-tabs">
        {researchScenarios.map((scenario, index) => (
          <button
            key={scenario.id}
            className={`scenario-tab ${index === activeScenario ? "active" : ""}`}
            onClick={() => setActiveScenario(index)}
          >
            <span className="scenario-tab-title">{scenario.title}</span>
            <span className="scenario-tab-desc">{scenario.description}</span>
          </button>
        ))}
      </div>

      <div className="scenario-info">
        <h4>{scenario.title}</h4>
        <p>{scenario.description}</p>
        <span className="scenario-workflow">{scenario.workflow}</span>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ background: `linear-gradient(90deg, #2563eb, #8b5cf6)` }}
          />
        </div>
        <div className="progress-stats">
          <span>✓ {completed} Completed</span>
          <span>⟳ {inProgress} In Progress</span>
          <span>○ {pending} Pending</span>
        </div>
      </div>

      <div className="dashboard-checklist">
        <h4>Research Workflow Checklist</h4>
        <div className="checklist-grid">
          {scenario.steps.map((item, index) => (
            <motion.div
              key={item.id}
              className="checklist-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="checklist-status" style={{ color: getStatusColor(item.status) }}>
                {getStatusIcon(item.status)}
              </div>
              <div className="checklist-content">
                <span className="checklist-label">{item.label}</span>
                {item.status === "in-progress" && (
                  <div className="checklist-progress">
                    <div className="checklist-progress-bar">
                      <motion.div
                        className="checklist-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        style={{ background: getStatusColor(item.status) }}
                      />
                    </div>
                    <span className="checklist-progress-text">{item.progress}%</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

