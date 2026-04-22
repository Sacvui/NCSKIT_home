---
title: 'ncsStat: A Web-Based Framework for Privacy-Preserving Decentralized Statistical Computing'
tags:
  - R
  - WebAssembly
  - Statistics
  - Next.js
  - Client-side Analysis
  - Psychometrics
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

Modern statistical analysis in social sciences and psychology traditionally relies on expensive proprietary software (e.g., SPSS) or server-dependent web platforms. `ncsStat` is an open-source, decentralized statistical framework that executes a full R engine entirely within the user's browser sandbox via WebAssembly (WASM). By leveraging the `WebR` runtime, it enables high-performance computing—including complex Structural Equation Modeling (SEM) and factor analysis—with zero data transmission to external servers. This paradigm shift ensures absolute data privacy by design while providing a user-friendly interface for researchers who may not be proficient in R programming.

# Statement of Need

Data sovereignty is a critical requirement in modern academic research, yet cloud-based analytical tools often necessitate the transmission of sensitive datasets to remote backends, creating potential security vulnerabilities and compliance challenges (e.g., GDPR). While desktop alternatives like JASP or jamovi offer excellent GUI-based R wrappers, they require local installation and administrative privileges, which are often restricted in institutional environments.

`ncsStat` addresses these limitations by providing a "Serverless-Client-Side" environment. It caters to a growing community of researchers and students—particularly in developing regions—who require portable, high-performance, and cost-free analytical tools. A unique contribution of the framework is the **Academic Statistical Interpretation Generator (ASIG)**, which automates the translation of numerical outputs into deterministic, APA-compliant interpretations, significantly reducing human error in statistical reporting.

# State of the Field

While `WebR` itself provides the underlying technology to run R in the browser, using it directly requires significant coding expertise and manual environment configuration (e.g., managing worker lifecycles, package installation, and data serialization). Other web-based R platforms, such as R Shiny, rely on server-side execution, which introduces network latency and privacy risks. 

`ncsStat` distinguishes itself from "raw" WebR implementations by providing:
1.  **Abstraction Layer**: A React-based orchestration layer that manages complex asynchronous WebR worker states, including a self-healing mechanism for crash recovery.
2.  **Expert System**: The ASIG module provides deterministic logic that goes beyond simple visualization, offering rigorous textual analysis similar to what is found in high-end commercial software.
3.  **Portability**: Unlike jamovi desktop, `ncsStat` is accessible from any modern browser (including tablets and high-end mobile devices) without installation, while maintaining the same mathematical accuracy through WASM-compiled R binaries.

# Functionality

The framework integrates professional R packages such as `psych` [@Psych2024] and `lavaan` [@Rosseel2012]. Key architectural innovations include:
- **Zero-Copy Data Stream**: Utilizing TypedArrays for fast data transfer between JavaScript and the WASM environment.
- **Workflow Enforcement**: Automatically suggesting subsequent analyses (e.g., suggesting SEM after CFA validity checks) to ensure methodological rigor.
- **WASM Optimization**: Utilizing `SharedArrayBuffer` for multi-threaded performance when supported by the browser context.

# AI Disclosure

Generative AI (Google Gemini 2.0 and Qwen 2.5) was utilized during the development of this software for code refactoring, structural debugging, and drafting technical documentation. All AI-generated logic and prose were strictly audited and verified by the primary author to ensure mathematical correctness and adherence to JOSS standards.

# Acknowledgements

The authors thank the Posit team for the `WebR` runtime and the open-source contributors of the `lavaan` and `psych` packages.

# References
