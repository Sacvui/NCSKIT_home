---
title: 'ncsStat: A Web-Based Framework for Privacy-Preserving Decentralized Statistical Computing'
tags:
  - R
  - WebAssembly
  - Statistics
  - Next.js
  - Client-side Analysis
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

The landscape of social science research is increasingly dependent on accessible, robust, and secure statistical software. However, researchers often face a dilemma between expensive proprietary tools like SPSS and high-learning-curve open-source languages like R. Furthermore, existing web-based solutions typically require uploading datasets to a central server, raising significant concerns regarding data privacy and compliance with regulations like GDPR.

`ncsStat` is an open-source, browser-based statistical framework that addresses these challenges by executing a full R engine entirely on the client-side. Built with Next.js and powered by `WebR` (R compiled to WebAssembly), `ncsStat` allows researchers to perform complex multivariate analyses—ranging from Cronbach's Alpha and EFA to Structural Equation Modeling (SEM)—without data ever leaving their local machine.

# Statement of Need

Modern academic research necessitates tools that are not only mathematically accurate but also privacy-centric and user-friendly. While desktop applications like JASP and jamovi provide excellent GUI interfaces for R, they require local installation and administrative privileges, which can be a barrier in institutional or restricted environments. Web-based alternatives like R Shiny apps often suffer from server-side bottlenecks and latency, and they inherently require data transmission.

`ncsStat` fills this gap by providing a "Serverless-Client-Side" paradigm. It caters specifically to researchers in developing regions and students who need a portable, zero-cost, and high-performance analytical environment. The inclusion of the Academic Statistical Interpretation Generator (ASIG) further bridges the gap between raw data and scholarly reporting by providing deterministic, template-driven results interpretation in multiple languages (Vietnamese and English).

# Functionality

The framework leverages the `WebR` runtime to execute specialized R packages such as `psych` [@Psych2024] for psychometrics and `lavaan` [@Rosseel2012] for latent variable modeling. Key features include:

- **Decentralized Execution**: Utilizes WebAssembly to run R code in a dedicated worker thread, ensuring high performance even with large datasets ($N > 10,000$).
- **Privacy-by-Design**: 100% of data processing occurs in the browser's memory sandbox.
- **ASIG System**: A rule-based expert system that provides automated, APA-compliant interpretations of statistical results, including effect sizes and assumption testing.
- **Workflow Mode**: Guided sequences for complex analyses (e.g., automatically suggesting SEM after a successful CFA).
- **Self-Healing Infrastructure**: Robust error recovery mechanisms that handle WASM worker crashes and IndexedDB corruptions automatically.

# Comparison to Other Software

| Feature | ncsStat | JASP / jamovi | R / RStudio | R Shiny Apps |
|---------|---------|---------------|-------------|--------------|
| **Installation** | None (Web) | Desktop Install | Local Install | None (Web) |
| **Privacy** | 100% Client-side | Local | Local | Server-side |
| **Engine** | WebR (WASM) | Native R | Native R | Remote R |
| **Interp.** | Automated (ASIG)| Minimal | Manual | Varies |
| **Cost** | Free (GPL/MIT) | Free | Free | Varies |

`ncsStat` distinguishes itself by offering the portability of a web app with the privacy and performance characteristics of a native desktop application.

# AI Disclosure

Generative AI (Google Gemini 2.0 and Qwen 2.5) was used during the development of this software for code refactoring, bug fixing, and drafting initial versions of the documentation and this manuscript. All AI-generated outputs, including statistical logic and architectural designs, were rigorously verified and validated by the primary author to ensure mathematical accuracy and adherence to scientific standards.

# Acknowledgements

The authors wish to thank the `WebR` project team at Posit and William Revelle for the `psych` package, which forms the backbone of the psychometric modules in `ncsStat`.

# References
