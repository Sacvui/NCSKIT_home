# ncsStat: A Web-Based Framework for Privacy-Preserving Decentralized Statistical Computing

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JOSS](https://joss.theoj.org/papers/unknown/status.svg)](https://joss.theoj.org/papers/unknown)

**ncsStat** is an open-source, decentralized statistical analysis platform that runs a full R engine (WebR) entirely within the browser. It is designed to provide high-performance, privacy-centric research tools without the need for server-side computation or data transmission.

🔗 **Live Application:** [https://stat.ncskit.org](https://stat.ncskit.org)

---

## 🚀 Key Features

- **Absolute Privacy:** 100% client-side data processing. No sensitive data is ever uploaded to a server.
- **Offline-Ready:** Once loaded, ncsStat can perform full statistical analyses without an internet connection, ideal for field research.
- **Methodological Guardrails:** Acts as a "virtual mentor" by automatically checking assumptions and suggesting corrective statistical paths.
- **R Script Export:** Seamlessly export analysis logic to R scripts for reproducibility in RStudio.
- **Comprehensive Analysis:** Supports 18+ methods including SEM, CFA, EFA, Logistic Regression, and Mediation Analysis.
- **ASIG Expert System:** Automatically generates APA-compliant textual interpretations of results.
- **Zero Installation:** Works in any modern browser across Windows, macOS, Linux, and tablets.
- **High Performance:** Powered by WebAssembly (WASM), leveraging a full R 4.5 runtime.

---

## 🛠️ Technology Stack

| Layer | Stack |
|-------|-------|
| **Core** | Next.js 16, React 19, TypeScript |
| **Statistical Engine** | WebR 0.5 (WebAssembly R) |
| **Key R Packages** | `psych`, `lavaan`, `GPArotation`, `cluster` |
| **Backend/Auth** | Supabase (PostgreSQL, OAuth) |
| **AI Integration** | Google Gemini 2.0 Flash (for optional advanced insights) |

---

## 🧪 JOSS Reviewer Guide

To facilitate the functional review process, please follow these instructions.

### 1. Local Development & SharedArrayBuffer
`ncsStat` requires high-performance memory buffers provided by `SharedArrayBuffer`. Browsers only enable this in **Cross-Origin Isolated** contexts.

**To run locally:**
```bash
# 1. Clone & Install
git clone https://github.com/Sacvui/NCSKIT_home.git
cd NCSKIT_home
npm install

# 2. Configure Environment
cp .env.example .env.local
# (Optional: Add Supabase/Gemini keys for cloud features, 
# but core analysis works offline with WebR)

# 3. Start Development Server
npm run dev
```
The Next.js configuration in `next.config.js` is already pre-configured with the required headers:
- `Cross-Origin-Embedder-Policy: credentialless`
- `Cross-Origin-Opener-Policy: same-origin`

Access the app at `http://localhost:3000`.

### 2. Verification of Mathematical Accuracy
We have provided a validation suite that compares `ncsStat` (WebR) outputs against native R results for critical algorithms (SEM, Cronbach's Alpha, ANOVA).
- **Validation Scripts:** See `__tests__/validation/`
- **Logic Documentation:** Detailed rule-base for the ASIG system is documented in [ASIG_LOGIC.md](./ASIG_LOGIC.md).

### 3. Automated Tests
Run the test suite using:
```bash
npm test
```

---

## 📦 Installation & Deployment

### Production Build
```bash
npm run build
npm start
```

### Deployment (Vercel)
The project is optimized for Vercel. Ensure the following Environment Variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📚 Citation

If you use ncsStat in your research, please cite it as follows:

**CFF File:** [CITATION.cff](./CITATION.cff)

**APA Format:**
> Le, P. H. (2026). *ncsStat: A Web-Based Statistical Analysis Platform for Privacy-Preserving Decentralized Computing*. https://stat.ncskit.org

---

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

Special thanks to the **WebR project** team at Posit and the authors of the `lavaan` and `psych` R packages.
