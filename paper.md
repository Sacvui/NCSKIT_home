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
    orcid: 0009-0000-0000-0000
    affiliation: 1
affiliations:
  - name: Independent Researcher, Vietnam
    index: 1
date: 22 April 2026
bibliography: paper.bib
---

# Summary

The rapid evolution of data science in psychological and social research has increased the demand for accessible yet mathematically rigorous analytical tools. However, the current landscape is bifurcated between high-cost proprietary software (SPSS, AMOS) and complex programming environments (R, Python). `ncsStat` bridges this gap by providing an open-source, decentralized statistical framework that executes a complete R engine (version 4.5) entirely within the user's browser sandbox via WebAssembly (WASM). By utilizing the `WebR` runtime, `ncsStat` enables sophisticated multivariate analyses—including Structural Equation Modeling (SEM) with Full Information Maximum Likelihood (FIML) estimation—to be performed locally. This architecture ensures absolute data privacy, as sensitive research data never leaves the client's device, while offering an intuitive interface and automated interpretation logic.

# Statement of Need

Data privacy regulations (e.g., GDPR, HIPAA) and institutional ethics requirements increasingly prohibit the transmission of sensitive raw data to external cloud servers. Traditional web-based statistical tools, such as those built with R Shiny, typically rely on server-side execution, which creates both privacy risks and network latency bottlenecks. Furthermore, desktop-bound solutions like JASP or jamovi, while excellent, require local installation and administrative rights—barriers that are often insurmountable in highly regulated institutional or shared computing environments.

`ncsStat` introduces a "Serverless-Client-Side" paradigm that caters to researchers, particularly in regions with limited server infrastructure. Beyond simple computation, `ncsStat` addresses the "interpretation gap" through its **Academic Statistical Interpretation Generator (ASIG)**. ASIG is a deterministic, rule-based expert system that translates numerical outputs into APA-compliant prose, ensuring methodological rigor and reducing reporting bias.

# State of the Field

The emergence of WebAssembly has led to projects like `shinylive`, which allows R Shiny apps to run in the browser. However, `shinylive` primarily focuses on dashboarding and reactive UI elements rather than a structured, workflow-driven statistical workbench. `ncsStat` distinguishes itself through:

1.  **High-Level Orchestration**: A specialized React layer that manages complex asynchronous WebR worker lifecycles, ensuring thread safety and memory optimization through active garbage collection (`gc()`) after heavy computations.
2.  **Scientific Rigor**: Unlike general-purpose WASM R apps, `ncsStat` enforces a pre-analysis pipeline, including automated assumption testing (e.g., Shapiro-Wilk for normality, Levene's for homogeneity) and automatic correction switching (e.g., Welch ANOVA).
3.  **Complex Modeling**: It successfully integrates and optimizes the `lavaan` [@Rosseel2012] and `psych` [@Psych2024] packages for the WASM environment, enabling SEM and McDonald's Omega calculations on consumer-grade hardware.

# Functionality & Implementation

`ncsStat` is built on a modular architecture using Next.js and TypeScript. It implements several technical innovations for WASM-side stability:
- **Zero-Copy Binary Transfer**: Optimized communication between JavaScript and R using `TypedArrays` to minimize serialization overhead.
- **Self-Healing Virtual FS**: A monitoring system that detects and repairs IndexedDB (IDBFS) corruptions, ensuring that the local R package repository remains intact.
- **ASIG Rule-Engine**: A deterministic mapping of R objects to standardized interpretations, supporting multi-language outputs (Vietnamese and English).

# Sustainability and Maintainability

`ncsStat` is designed for long-term academic use. The framework maintains a local, versioned repository of R binaries to protect against upstream dependency breakage. The codebase follows strict TypeScript typing and includes a growing suite of validation tests to ensure numerical parity with native R environments.

# AI Disclosure

Generative AI (Google Gemini 2.0 and Qwen 2.5) was used during the development of this software for code refactoring, structural debugging, and drafting initial versions of the documentation and this manuscript. All AI-generated outputs, particularly the statistical interpretation logic and architectural designs, were rigorously verified and mathematically validated by the primary author.

# Acknowledgements

We acknowledge the contributions of the Posit team for the `WebR` project and William Revelle for the `psych` package.

# References
