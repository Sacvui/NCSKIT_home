# NCSKit Architecture & Technical Documentation

This document serves as the primary technical specification for developers maintaining or expanding NCSKit.

## 1. High-Level Architecture
NCSKit follows a **Client-Side Heavy, Serverless-Analytics** architecture. It is built on:
- **Frontend Framework**: Next.js 14 (App Router) with React 18
- **Styling**: Tailwind CSS & `shadcn/ui` components
- **Authentication & Database**: Supabase (PostgreSQL)
- **Core Statistical Engine**: WebAssembly-compiled R (WebR)
- **Deployment**: Vercel

### Why WebR? (The "Serverless" Analytics Model)
Unlike traditional tools that send data to a Python/R server via API, NCSKit downloads the entire R environment and necessary statistical packages (`lavaan`, `psych`, `seminr`) to the user's browser via WebAssembly.

**Benefits:**
- **Zero-Latency**: Computations happen directly on the user's CPU. No network round-trips for each analysis step.
- **100% Privacy**: Datasets never leave the browser.
- **Infinite Scalability**: Running 10,000 CFA models costs nothing in backend server compute.

---

## 2. Core Workflows

### The Analysis Pipeline (`/analyze`)
The analysis flow is a monolithic Single Page Application (SPA) driven by state rather than URLs. 

1. **State Management**: `useAnalysisSession.ts` holds the global state (data, columns, results).
2. **Step Controller**: `AnalyzeStepRenderer.tsx` acts as the master router. It receives the `step` string (e.g., `'upload'`, `'efa-select'`, `'plssem-select'`) and renders the appropriate View component.
3. **Execution**: `useAnalysisRunner.ts` intercepts requests, checks if the user has enough "NCS Credits" (Supabase RPC), deducts the credits atomically, and then fires the WebR function.
4. **Display**: When an analysis completes, `AnalyzeStepRenderer` transitions the step to `'results'`, and the `ResultsDisplay.tsx` component is rendered, formatting the raw JSON output from R into React components and ASIG narratives.

### Demo Mode (`/demo`)
The Demo route reuses `AnalyzeModule.tsx` but passes an `isDemo={true}` flag. 
- **Auth Bypass**: The lifecycle hook skips the redirect to `/login`.
- **Credit Bypass**: The `AnalyzeModule` forces `user = null`, which tricks the credit-deduction logic in `useAnalysisRunner` to skip billing entirely.
- **Upload Limits**: `FileUpload.tsx` enforces a 300-row, 50-column limit if `isDemo` is active.

---

## 3. Adding a New Statistical Method

To add a new statistical feature (e.g., "Logistic Regression"):

1. **R Implementation**:
   - Write the R wrapper function in `public/r-scripts/analysis.R` (if using custom R code) or directly in the TypeScript wrappers in `lib/webr/`.
   - Expose the function in `lib/webr-wrapper.ts`.

2. **Add to Cost Table**:
   - Add the method key to `lib/ncs-credits.ts` (`ANALYSIS_COSTS`) with its credit price.

3. **Create the View**:
   - Create `components/analyze/views/LogisticRegressionView.tsx` to handle variable selection.
   - Register the view in `AnalyzeStepRenderer.tsx`.

4. **Create the Result Component**:
   - Create `components/results/regression/LogisticResults.tsx`.
   - Update `ResultsDisplay.tsx` to route the `results.type === 'logistic'` to your new component.
   - Write the ASIG (Academic Scientific Interpretation Generator) narrative generator inside the result component.

---

## 4. Known Limitations & Future Work

- **Big Data Handling**: WebR currently runs on the main browser thread or a single Web Worker. Very large datasets (> 50,000 rows with complex PLS-SEM) may block the browser UI or crash due to memory limits in WebAssembly.
- **Package Management**: WebR requires packages to be compiled for Wasm. If a required R package is not available in the WebR public repo, it must be compiled from source using the Emscripten toolchain.
- **ASIG Variability**: The automated text generation relies on deterministic templates based on p-values and thresholds. Future versions could integrate an LLM (via an API) to produce more contextual writing, though this would break the 100% offline-privacy model.
