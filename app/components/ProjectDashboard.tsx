"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type ResearchScenario = {
  id: string;
  title: string;
  description: string;
  workflow: string;
  steps: {
    id: string;
    label: string;
    details?: string;
    status: "completed" | "in-progress" | "pending";
    progress: number;
  }[];
};

const researchScenarios: ResearchScenario[] = [
  {
    id: "quantitative",
    title: "Quantitative Research",
    description: "Surveys, experiments, statistical data analysis",
    workflow: "Quantitative Flow",
    steps: [
      { id: "ideation", label: "Ideation Lab", details: "Select topic & Build theoretical framework", status: "completed", progress: 100 },
      { id: "literature", label: "Literature Review", details: "Synthesize references", status: "completed", progress: 100 },
      { id: "design", label: "Design Studio", details: "Design research model (SEM/CFA)", status: "completed", progress: 100 },
      { id: "survey", label: "Survey Builder", details: "Build questionnaire", status: "completed", progress: 100 },
      { id: "data", label: "Data Collection", details: "Gather data", status: "in-progress", progress: 85 },
      { id: "health", label: "Data Health Check", details: "Check missing values, outliers", status: "completed", progress: 100 },
      { id: "reliability", label: "Reliability & Validity", details: "Cronbach's Alpha, EFA", status: "completed", progress: 100 },
      { id: "descriptive", label: "Descriptive Statistics", details: "Mean, SD, Skewness", status: "completed", progress: 100 },
      { id: "assumptions", label: "Assumptions Testing", details: "Normality, Levene", status: "completed", progress: 100 },
      { id: "correlation", label: "Correlation Analysis", details: "Pearson/Spearman", status: "completed", progress: 100 },
      { id: "group", label: "Group Comparisons", details: "T-test, ANOVA, Mann-Whitney", status: "completed", progress: 100 },
      { id: "regression", label: "Regression / Modeling", details: "Linear, Logistic", status: "in-progress", progress: 70 },
      { id: "multivariate", label: "Multivariate Analysis", details: "PCA, SEM", status: "pending", progress: 0 },
      { id: "writing", label: "Writing & Publishing", details: "Export report", status: "pending", progress: 0 },
    ],
  },
  {
    id: "qualitative",
    title: "Qualitative Research",
    description: "Interviews, observations, content analysis",
    workflow: "Qualitative Flow",
    steps: [
      { id: "ideation", label: "Ideation Lab", details: "Define research questions", status: "completed", progress: 100 },
      { id: "literature", label: "Literature Review", details: "Synthesize background theory", status: "completed", progress: 100 },
      { id: "design", label: "Design Studio", details: "Design interview/Observation protocol", status: "completed", progress: 100 },
      { id: "data", label: "Data Collection", details: "Interviews, note-taking", status: "in-progress", progress: 80 },
      { id: "transcription", label: "Transcription", details: "Transcribe audio, normalize text", status: "in-progress", progress: 60 },
      { id: "coding", label: "Coding", details: "Open/Axial coding", status: "pending", progress: 0 },
      { id: "thematic", label: "Thematic Analysis", details: "Extract themes", status: "pending", progress: 0 },
      { id: "validation", label: "Validation", details: "Member checking", status: "pending", progress: 0 },
      { id: "writing", label: "Writing & Publishing", details: "Synthesize insights", status: "pending", progress: 0 },
    ],
  },
  {
    id: "systematic",
    title: "Systematic Review",
    description: "Systematic Review, Meta-analysis",
    workflow: "Systematic Review Flow",
    steps: [
      { id: "ideation", label: "Ideation Lab", details: "Define research questions", status: "completed", progress: 100 },
      { id: "search", label: "Search Strategy", details: "Keywords, databases (Scopus, WoS)", status: "completed", progress: 100 },
      { id: "screening", label: "Screening (PRISMA)", details: "Screen articles", status: "in-progress", progress: 75 },
      { id: "quality", label: "Quality Assessment", details: "Assess quality", status: "pending", progress: 0 },
      { id: "synthesis", label: "Synthesis", details: "Meta-analysis or Narrative", status: "pending", progress: 0 },
      { id: "writing", label: "Writing & Publishing", details: "Synthesis report", status: "pending", progress: 0 },
    ],
  },
];

export function ProjectDashboard() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const scenario = researchScenarios[activeScenario];
  const completed = scenario.steps.filter((s) => s.status === "completed").length;
  const inProgress = scenario.steps.filter((s) => s.status === "in-progress").length;
  const pending = scenario.steps.filter((s) => s.status === "pending").length;
  const totalProgress = Math.round(
    scenario.steps.reduce((sum, s) => sum + s.progress, 0) / scenario.steps.length
  );

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

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
          <h3>Scientific Research Scenarios</h3>
          <p className="dashboard-workflow">Select the workflow that matches your research type</p>
        </div>
        <div className="dashboard-stats">
          <div className="stat-item">
            <span className="stat-value">{totalProgress}%</span>
            <span className="stat-label">Overall Progress</span>
          </div>
        </div>
      </div>

      {/* Horizontal scrollable tabs for mobile */}
      <div className="scenario-tabs-container">
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
              <div
                className="checklist-header"
                onClick={() => item.details && toggleItem(item.id)}
                style={{ cursor: item.details ? 'pointer' : 'default' }}
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
                {item.details && (
                  <div className="checklist-expand-icon">
                    {expandedItems.has(item.id) ? '−' : '+'}
                  </div>
                )}
              </div>
              <AnimatePresence>
                {item.details && expandedItems.has(item.id) && (
                  <motion.div
                    className="checklist-details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p>{item.details}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
