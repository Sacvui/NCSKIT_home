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
1.  **Methodological Guardrails**: The framework acts as a "virtual mentor," enforcing rigorous pre-analysis checks (e.g., multivariate normality, homogeneity of variance) and automatically suggesting corrective paths (e.g., switching to Welch ANOVA or robust estimators). This prevents common statistical pitfalls in academic publishing.
2.  **Democratizing Science**: By being **offline-ready** and zero-cost, `ncsStat` empowers researchers in low-resource settings or remote field environments where internet connectivity is unreliable and proprietary software licenses are unaffordable.
3.  **Reproducibility via Script Export**: To bridge the gap between GUI simplicity and code-based transparency, `ncsStat` provides an "Export to R Script" feature, allowing users to reproduce any analysis in a native RStudio environment.

# State of the Field

The emergence of WebAssembly has enabled browser-native R implementations like `shinylive`. However, `ncsStat` distinguishes itself from general-purpose WASM R wrappers by providing a domain-specific expert system. Through the **Academic Statistical Interpretation Generator (ASIG)**, the software translates numerical outputs into deterministic, APA-compliant textual interpretations, ensuring that even users with limited programming backgrounds can produce high-quality research reports.

Architecturally, `ncsStat` introduces significant technical contributions:
- **Asynchronous Worker Lifecycle**: Manages complex WebR worker states and memory-intensive computations without blocking the UI.
- **Self-Healing Persistence**: Automated detection and recovery of IndexedDB (IDBFS) corruptions.
- **Validation Suite**: A public suite of test cases ensuring numerical parity between `ncsStat` and native R for high-complexity models like FIML-based SEM.

# Functionality

The framework integrates professional R packages such as `lavaan` [@Rosseel2012] and `psych` [@Psych2024] to provide:
- **Privacy-preserving Analysis**: 100% local processing.
- **Expert-Rule Interpretation**: Automated reporting logic based on established statistical thresholds.
- **Methodological Guidance**: Context-aware suggestions for data cleaning and model refinement.

# Sustainability and Maintainability

`ncsStat` ensures long-term viability by maintaining a version-locked local repository of R binaries. The project follows a modular TypeScript architecture, facilitating community contributions and ensuring scalability for future statistical modules.

# AI Disclosure

Generative AI (Google Gemini 2.0 and Qwen 2.5) was used during development for code refactoring, structural debugging, and drafting initial manuscript versions. All AI-generated logic and architectural designs were strictly audited and verified by the primary author to ensure scientific accuracy.

# Acknowledgements

We thank the Posit team for the `WebR` project and the authors of the `lavaan` and `psych` R packages.

# References
