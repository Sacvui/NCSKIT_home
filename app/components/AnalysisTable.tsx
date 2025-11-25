"use client";

import { useState } from "react";

type TableType = "sem" | "regression" | "descriptive" | "correlation" | "anova";

type AnalysisTableProps = {
  type: TableType;
  title?: string;
  compact?: boolean;
};

export function AnalysisTable({ type, title, compact = false }: AnalysisTableProps) {
  const [activeTab, setActiveTab] = useState(0);

  const renderSEMTable = () => (
    <div className="analysis-table-wrapper">
      <div className="analysis-table-header">
        <h4>Structural Equation Modeling (SEM) Results</h4>
        <span className="analysis-badge">Model Fit: Excellent</span>
      </div>
      <div className="analysis-table-container">
        <table className="analysis-table">
          <thead>
            <tr>
              <th>Path</th>
              <th>Estimate</th>
              <th>Std. Error</th>
              <th>z-value</th>
              <th>p-value</th>
              <th>Significance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="significant">
              <td>PU → BI</td>
              <td>0.452</td>
              <td>0.089</td>
              <td>5.079</td>
              <td>&lt; 0.001</td>
              <td><span className="sig-star">***</span></td>
            </tr>
            <tr className="significant">
              <td>PEOU → PU</td>
              <td>0.387</td>
              <td>0.092</td>
              <td>4.207</td>
              <td>&lt; 0.001</td>
              <td><span className="sig-star">***</span></td>
            </tr>
            <tr className="significant">
              <td>TR → BI</td>
              <td>0.321</td>
              <td>0.095</td>
              <td>3.379</td>
              <td>0.001</td>
              <td><span className="sig-star">**</span></td>
            </tr>
            <tr className="not-significant">
              <td>PR → BI</td>
              <td>-0.089</td>
              <td>0.087</td>
              <td>-1.023</td>
              <td>0.306</td>
              <td>ns</td>
            </tr>
          </tbody>
        </table>
        <div className="analysis-table-footer">
          <div className="fit-indices">
            <span><strong>χ²/df:</strong> 2.34</span>
            <span><strong>CFI:</strong> 0.967</span>
            <span><strong>TLI:</strong> 0.961</span>
            <span><strong>RMSEA:</strong> 0.048</span>
            <span><strong>SRMR:</strong> 0.042</span>
          </div>
          <div className="sig-legend">
            <span>*** p &lt; 0.001, ** p &lt; 0.01, * p &lt; 0.05, ns = not significant</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegressionTable = () => (
    <div className="analysis-table-wrapper">
      <div className="analysis-table-header">
        <h4>Multiple Regression Analysis</h4>
        <span className="analysis-badge">R² = 0.642</span>
      </div>
      <div className="analysis-table-container">
        <table className="analysis-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>B</th>
              <th>SE</th>
              <th>β</th>
              <th>t</th>
              <th>p</th>
              <th>VIF</th>
            </tr>
          </thead>
          <tbody>
            <tr className="significant">
              <td>(Constant)</td>
              <td>2.145</td>
              <td>0.389</td>
              <td>-</td>
              <td>5.512</td>
              <td>&lt; 0.001</td>
              <td>-</td>
            </tr>
            <tr className="significant">
              <td>Perceived Usefulness</td>
              <td>0.423</td>
              <td>0.078</td>
              <td>0.387</td>
              <td>5.423</td>
              <td>&lt; 0.001</td>
              <td>1.234</td>
            </tr>
            <tr className="significant">
              <td>Ease of Use</td>
              <td>0.298</td>
              <td>0.091</td>
              <td>0.245</td>
              <td>3.275</td>
              <td>0.001</td>
              <td>1.456</td>
            </tr>
            <tr className="not-significant">
              <td>Social Influence</td>
              <td>0.089</td>
              <td>0.067</td>
              <td>0.078</td>
              <td>1.328</td>
              <td>0.185</td>
              <td>1.189</td>
            </tr>
          </tbody>
        </table>
        <div className="analysis-table-footer">
          <div className="model-summary">
            <span><strong>F(3, 296):</strong> 176.42, <strong>p:</strong> &lt; 0.001</span>
            <span><strong>Adjusted R²:</strong> 0.638</span>
            <span><strong>Durbin-Watson:</strong> 1.98</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDescriptiveTable = () => (
    <div className="analysis-table-wrapper">
      <div className="analysis-table-header">
        <h4>Descriptive Statistics</h4>
        <span className="analysis-badge">N = 300</span>
      </div>
      <div className="analysis-table-container">
        <table className="analysis-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Mean</th>
              <th>SD</th>
              <th>Skewness</th>
              <th>Kurtosis</th>
              <th>α</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Perceived Usefulness</td>
              <td>4.23</td>
              <td>0.89</td>
              <td>-0.34</td>
              <td>-0.12</td>
              <td>0.912</td>
            </tr>
            <tr>
              <td>Ease of Use</td>
              <td>4.15</td>
              <td>0.92</td>
              <td>-0.28</td>
              <td>0.05</td>
              <td>0.887</td>
            </tr>
            <tr>
              <td>Behavioral Intention</td>
              <td>4.31</td>
              <td>0.85</td>
              <td>-0.41</td>
              <td>-0.08</td>
              <td>0.901</td>
            </tr>
            <tr>
              <td>Trust</td>
              <td>3.98</td>
              <td>0.94</td>
              <td>-0.19</td>
              <td>-0.23</td>
              <td>0.876</td>
            </tr>
          </tbody>
        </table>
        <div className="analysis-table-footer">
          <div className="note">
            <span>α = Cronbach&apos;s Alpha reliability coefficient</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCorrelationTable = () => (
    <div className="analysis-table-wrapper">
      <div className="analysis-table-header">
        <h4>Pearson Correlation Matrix</h4>
        <span className="analysis-badge">Two-tailed</span>
      </div>
      <div className="analysis-table-container">
        <table className="analysis-table correlation-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>PU</th>
              <th>PEOU</th>
              <th>BI</th>
              <th>TR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>PU</strong></td>
              <td className="diagonal">1.000</td>
              <td className="significant">0.623**</td>
              <td className="significant">0.712***</td>
              <td className="significant">0.534**</td>
            </tr>
            <tr>
              <td><strong>PEOU</strong></td>
              <td className="significant">0.623**</td>
              <td className="diagonal">1.000</td>
              <td className="significant">0.589**</td>
              <td className="significant">0.487*</td>
            </tr>
            <tr>
              <td><strong>BI</strong></td>
              <td className="significant">0.712***</td>
              <td className="significant">0.589**</td>
              <td className="diagonal">1.000</td>
              <td className="significant">0.601**</td>
            </tr>
            <tr>
              <td><strong>TR</strong></td>
              <td className="significant">0.534**</td>
              <td className="significant">0.487*</td>
              <td className="significant">0.601**</td>
              <td className="diagonal">1.000</td>
            </tr>
          </tbody>
        </table>
        <div className="analysis-table-footer">
          <div className="sig-legend">
            <span>*** p &lt; 0.001, ** p &lt; 0.01, * p &lt; 0.05</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderANOVATable = () => (
    <div className="analysis-table-wrapper">
      <div className="analysis-table-header">
        <h4>One-Way ANOVA Results</h4>
        <span className="analysis-badge">Group Comparison</span>
      </div>
      <div className="analysis-table-container">
        <table className="analysis-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>SS</th>
              <th>df</th>
              <th>MS</th>
              <th>F</th>
              <th>p</th>
              <th>η²</th>
            </tr>
          </thead>
          <tbody>
            <tr className="significant">
              <td>Between Groups</td>
              <td>124.56</td>
              <td>2</td>
              <td>62.28</td>
              <td>8.45</td>
              <td>&lt; 0.001</td>
              <td>0.142</td>
            </tr>
            <tr>
              <td>Within Groups</td>
              <td>752.34</td>
              <td>297</td>
              <td>2.53</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>876.90</strong></td>
              <td><strong>299</strong></td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
        <div className="analysis-table-footer">
          <div className="post-hoc">
            <strong>Post-hoc (Tukey HSD):</strong> Group 1 &gt; Group 2 (p &lt; 0.001), Group 1 &gt; Group 3 (p = 0.003)
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = () => {
    switch (type) {
      case "sem":
        return renderSEMTable();
      case "regression":
        return renderRegressionTable();
      case "descriptive":
        return renderDescriptiveTable();
      case "correlation":
        return renderCorrelationTable();
      case "anova":
        return renderANOVATable();
      default:
        return renderSEMTable();
    }
  };

  return (
    <div className={`analysis-mockup ${compact ? "compact" : ""}`}>
      {title && <h3 className="analysis-mockup-title">{title}</h3>}
      {renderTable()}
    </div>
  );
}

