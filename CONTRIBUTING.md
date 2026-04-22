# Contributing to ncsStat

Thank you for considering contributing to ncsStat! We welcome contributions that improve the statistical engine, the UI, or the interpretation logic (ASIG).

## How to Contribute

1.  **Reporting Bugs**: Use the GitHub Issues tracker to report bugs. Please include steps to reproduce and a sample dataset if possible.
2.  **Feature Requests**: We are always looking to expand our analysis methods (e.g., adding Meta-analysis or Multi-level modeling).
3.  **Code Contributions**:
    - Fork the repository.
    - Create a new branch (`feature/your-feature`).
    - Ensure code passes `npm run verify-build`.
    - Submit a Pull Request.

## Extending the ASIG Logic (Expert System)

The **Academic Statistical Interpretation Generator (ASIG)** is designed to be extensible. If you want to add new interpretation rules or modify existing thresholds (e.g., changing SEM fit guidelines):

1.  Navigate to `lib/interpretation-templates.ts`.
2.  The system uses a template-based mapping. You can add a new method or modify the thresholds in the `INTERPRETATION_RULES` object.
3.  Rules are defined using deterministic logic based on R output keys.
4.  If you want to contribute a new analysis method, ensure you also provide the corresponding R template in `lib/webr/analyses/`.

## Local Development Context

`ncsStat` requires a Cross-Origin Isolated environment to enable full performance (SharedArrayBuffer). If you are developing locally:
- Use `npm run dev`.
- Ensure your local browser environment supports the required security headers.

## Documentation and Standards

- We follow **TypeScript** strict mode for type safety.
- All R code must be compatible with **WebR (R 4.5)**.
- Statistical interpretations should aim for **APA 7th Edition** compliance.

---
*ncsStat is an open-source project aimed at democratizing science. We value clear, reproducible, and ethically-sound research tools.*
