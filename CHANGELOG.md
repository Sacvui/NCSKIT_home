# Changelog & System State Updates

This document tracks the major structural changes, architectural decisions, and current state of the ncsStat system. It serves as a historical reference for future maintenance.

## [2026-09-08] - System Architecture & Security Refactoring

### Current System State
* **Analysis Engine (`app/analyze`)**: The core analytical interface has been fully decoupled from the God Object anti-pattern. The massive 1500+ line `page.tsx` was broken down into highly modular, reusable, and testable components:
  * `app/analyze/hooks/useAnalyzeLifecycle.ts`: Manages session validation, aggressive cache-busting, offline listeners, and auth logic.
  * `app/analyze/hooks/useAnalysisRunner.ts`: Encapsulates the WebR processing and atomic credit deduction logic.
  * `app/analyze/components/AnalyzeStepRenderer.tsx`: Handles dynamic routing for over 18 statistical view modes.
  * *Impact*: `page.tsx` size was reduced from ~82.4 KB to ~15.1 KB. `npm run type-check` compiles with 0 errors.

* **Admin Role-Based Access Control (RBAC)**: The `/admin` routes have been heavily secured.
  * Client-side protection has been completely removed in favor of **Server Components**.
  * `app/admin/layout.tsx` is now a Server Component that uses `createServerClient` to fetch sessions before rendering HTML. Unauthorized users receive an immediate HTTP 307 Redirect.
  * `utils/supabase/middleware.ts` was updated with a metadata fallback (`user.user_metadata?.role` & `user.app_metadata?.role`) to ensure admins are not locked out if the `profiles` table experiences RLS failures.
  * Interactive Sidebar UI was extracted to `app/admin/components/AdminSidebar.tsx` (Client Component).

* **Repository Maintenance**:
  * Removed over 25MB of unnecessary Git bloat (including `.tgz` R packages and large text tree files).
  * The CI workflow (`.github/workflows/ci.yml`) was temporarily dropped as it interfered with the strict WebR environment configurations.

### Outstanding Tasks (Next Steps)
1. Write 14 Test Scenarios for the `Auto Test Engine` (`components/admin/AdminAutoTest.tsx`).
2. Integrate WebR Deep Test routines.
3. Enhance the `AutoPilotView.tsx` with deeper LLM (Gemini 2.0 Flash) interpretations.
