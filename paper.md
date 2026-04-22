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

Modern psychological and social research increasingly demands analytical tools that combine mathematical rigor with stringent data privacy standards. `ncsStat` is an open-source, decentralized statistical framework designed to execute a full R engine entirely within the user's browser sandbox via WebAssembly (WASM). Unlike traditional web-based statistical software that relies on server-side processing, `ncsStat` leverages the `WebR` runtime to perform high-level multivariate analyses—such as Structural Equation Modeling (SEM) and Factor Analysis—locally. This "Serverless-Client-Side" architecture ensures that sensitive raw data never leaves the user's device, fulfilling the most rigorous ethical and privacy requirements while democratizing access to professional-grade statistical computing.

# Statement of Need

Data sovereignty is a critical barrier in contemporary research, where data privacy regulations (e.g., GDPR) often conflict with the use of cloud-based analytical platforms. While native desktop applications like JASP or jamovi offer localized processing, they necessitate administrative installation privileges and lack the portability required for institutional research. Furthermore, the steep learning curve of the R language often prevents domain experts (e.g., psychologists, sociologists) from utilizing advanced latent variable modeling.

`ncsStat` addresses these challenges by providing a secure, browser-native framework that eliminates the need for installation and server-side data transmission. A significant contribution of the software is the **Academic Statistical Interpretation Generator (ASIG)**, a deterministic expert-rule engine that translates numerical outputs into APA-compliant textual interpretations, bridging the gap between raw data analysis and scholarly reporting.

# State of the Field

While `WebR` provides the low-level capability to run R in WASM, it remains an engine rather than a complete scientific application. `ncsStat` introduces **Architectural Novelty** by wrapping this engine in a sophisticated orchestration layer that manages:
1.  **Asynchronous Worker Lifecycle**: Preventing UI blocking through dedicated worker management.
2.  **Memory Management**: Implementing aggressive garbage collection and resource monitoring to handle high-memory SEM computations on low-powered devices.
3.  **Self-healing Persistence**: Automated detection and recovery of IndexedDB (IDBFS) corruptions, ensuring a stable local environment.

Compared to `shinylive` or raw WebR scripts, `ncsStat` provides a structured, GUI-driven workflow that enforces methodological rigor—automatically suggesting assumption tests and corrected models (e.g., Welch ANOVA)—without requiring the user to write a single line of code.

# Functionality

The framework integrates professional R packages such as `lavaan` [@Rosseel2012] and `psych` [@Psych2024] to provide:
- **Privacy-by-Design Execution**: 100% client-side data processing.
- **ASIG System**: An expert-rule system that generates academic interpretations based on rigorous statistical thresholds.
- **Automated Validation**: Real-time checking of normality, homogeneity of variance, and multicollinearity before executing main models.

# Sustainability and Maintainability

`ncsStat` ensures long-term viability by hosting a version-locked repository of R binaries locally, preventing breaking changes from upstream repositories. The project includes automated validation suites to verify mathematical parity between the WASM engine and native R environments.

# AI Disclosure

Generative AI (Google Gemini 2.0 and Qwen 2.5) was used during the development of this software for code refactoring, structural debugging, and drafting technical documentation. All AI-generated outputs, particularly the architectural designs and statistical logic, were rigorously audited and verified by the primary author.

# Acknowledgements

We acknowledge the Posit team for the `WebR` runtime and the authors of the `lavaan` and `psych` R packages.

# References
