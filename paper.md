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

Modern psychological and social research increasingly demands analytical tools that combine mathematical rigor with stringent data privacy standards. `ncsStat` is an open-source, decentralized statistical framework designed to execute a full R engine (version 4.5) entirely within the user's browser sandbox via WebAssembly (WASM). By utilizing the `WebR` runtime, `ncsStat` enables sophisticated multivariate analyses—such as Structural Equation Modeling (SEM) and factor analysis—to be performed locally. This "Serverless-Client-Side" architecture ensures that sensitive research data never leaves the user's device, fulfilling the most rigorous ethical and privacy requirements while democratizing access to professional-grade statistical computing.

# Statement of Need

Data sovereignty is a critical requirement in contemporary research, where data privacy regulations (e.g., GDPR) often prohibit the transmission of sensitive raw data to external cloud servers. While native desktop applications like JASP or jamovi offer localized processing, they require administrative installation privileges—a significant barrier in institutional environments. 

`ncsStat` addresses these challenges through three core innovations:
1.  **Methodological Guardrails**: The framework acts as a "virtual mentor," enforcing rigorous pre-analysis checks based on established multivariate standards [@Hair2010] and automatically suggesting corrective paths (e.g., switching to Welch ANOVA).
2.  **Democratizing Science**: By being **offline-ready** and zero-cost, `ncsStat` empowers researchers in low-resource settings.
3.  **Reproducibility via Script Export**: To bridge the gap between GUI and code, `ncsStat` provides an "Export to R Script" feature, allowing full reproducibility in native RStudio environments.

# State of the Field

While `shinylive` allows R Shiny apps to run in the browser, `ncsStat` offers superior **State Management** and **Concurrency Control**. By leveraging the React/Next.js ecosystem, `ncsStat` implements a custom **Locked Execution Pipeline** that prevents race conditions—a common failure point in reactive Shiny environments when multiple analysis requests are fired asynchronously. 

# Technical Architecture & Performance

### Memory Management & Stability
To address the inherent memory constraints of WASM (typically capped at 4GB), `ncsStat` implements an aggressive memory lifecycle management policy. This includes:
- **Active Garbage Collection**: Automated invocation of `gc()` and `webr::purge()` after heavy computational cycles (e.g., Bootstrap 5000 iterations).
- **Worker Isolation**: Each major analysis session operates within a dedicated worker context with a self-healing mechanism that resets the engine upon memory-induced crashes.

### Numerical Parity
Mathematical accuracy is verified through a dedicated validation suite. Benchmarks comparing `ncsStat` against Native R 4.4 for complex SEM models (using FIML for missing data) show numerical parity with an error margin of $\epsilon < 10^{-8}$ for point estimates and $\epsilon < 10^{-5}$ for standard errors. Detailed benchmark results are available in the repository documentation.

# Limitations

Despite its advantages, `ncsStat` has inherent limitations:
1.  **Memory Caps**: Analysis of extremely large datasets (e.g., $>10^6$ rows with hundreds of variables) may exceed the browser's WASM memory heap.
2.  **Computational Speed**: While near-native for standard tests, iterative procedures like complex SEM Bootstrapping are approximately 1.5x–2x slower than native execution.
3.  **Browser Compatibility**: Full performance requires modern browsers with `SharedArrayBuffer` support for multi-threaded operations.

# AI Disclosure

Generative AI (Google Gemini 2.0 and Qwen 2.5) was used for refactoring and initial drafting. All scientific logic was rigorously verified by the primary author.

# References
