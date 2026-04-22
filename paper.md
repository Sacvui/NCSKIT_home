---
title: 'ncsStat: A Web-Based Framework for Privacy-Preserving Decentralized Statistical Computing'
tags:
  - R
  - WebAssembly
  - Statistics
  - Next.js
  - Client-side Analysis
  - Psychometrics
  - SEM
authors:
  - name: Le Phuc Hai
    orcid: 0009-0004-1215-5023
    affiliation: 1
affiliations:
  - name: Independent Researcher, Vietnam
    index: 1
date: 22 April 2026
bibliography: paper.bib
---

# Summary

Modern psychological and social research increasingly demands analytical tools that combine mathematical rigor with stringent data privacy standards. `ncsStat` is an open-source, decentralized statistical framework designed to execute a full R engine (version 4.5) entirely within the user's browser sandbox via WebAssembly (WASM). By utilizing the `WebR` runtime, `ncsStat` enables sophisticated multivariate analyses—such as Structural Equation Modeling (SEM) and factor analysis—to be performed locally. This "Serverless-Client-Side" architecture ensures that sensitive research data never leaves the user's device, fulfilling the most rigorous ethical and privacy requirements while democratizing access to professional-grade statistical computing.

# Statement of Need

Data sovereignty is a critical requirement in contemporary research, where data privacy regulations (e.g., GDPR) often prohibit the transmission of sensitive raw data to external cloud servers. While native desktop applications like JASP or jamovi offer localized processing, they require administrative installation privileges—a significant barrier in institutional environments. 

`ncsStat` addresses these challenges through three core innovations:
1.  **Methodological Guardrails**: The framework acts as a "virtual mentor," enforcing rigorous pre-analysis checks based on established multivariate standards [@Hair2010] and automatically suggesting corrective paths.
2.  **Democratizing Science**: By being **offline-ready** and zero-cost, `ncsStat` empowers researchers in low-resource settings.
3.  **Reproducibility & Sustainability**: To ensure long-term reliability, `ncsStat` utilizes **version-locked WASM binaries** self-hosted within the application's infrastructure, shielding the system from upstream breaking changes or repository deprecations.

# Technical Architecture & Security

### Memory & Concurrency Management
To address WASM memory constraints and ensure a smooth user experience, `ncsStat` implements:
- **Locked Execution Pipeline**: A React-based orchestration layer that prevents race conditions during asynchronous R calls.
- **Graceful Degradation**: The system performs active **environment sniffing** to detect security headers. If `SharedArrayBuffer` is unavailable (non-Cross-Origin Isolated contexts), `ncsStat` automatically falls back to a single-threaded `PostMessage` communication channel, ensuring security and compatibility without sacrificing core functionality.

### ASIG: Contextual Guidance vs. Final Judgment
The **Academic Statistical Interpretation Generator (ASIG)** is designed not as a definitive judge, but as an expert guidance system. While it utilizes established thresholds for model fit (e.g., CFI > 0.90), it explicitly highlights these as "guidelines" rather than binary outcomes. By providing the equivalent R script for every analysis, `ncsStat` encourages users to verify results manually and promotes transparency in statistical reporting.

# Functionality

The framework integrates professional R packages such as `lavaan` [@Rosseel2012] and `psych` [@Psych2024] to provide:
- **Privacy-preserving Analysis**: 100% local processing.
- **Expert-Rule Interpretation**: Automated reporting logic with built-in pedagogical cues.
- **Script Export**: One-click generation of R scripts for RStudio reproduction.

# Sustainability and Maintainability

`ncsStat` follows a modular architecture, allowing for community-driven expansion of the ASIG rule engine. The public validation suite ensures that future updates maintain numerical parity with native R environments.

# AI Disclosure

Generative AI (Google Gemini 2.0 and Qwen 2.5) was used for refactoring and initial drafting. All scientific logic was rigorously verified by the primary author.

# References
