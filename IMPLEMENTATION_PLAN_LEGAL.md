# Legal & Beta Disclaimer Integration Plan

## Goal
To effectively communicate the "Beta/Testing" status of ncsStat and legally protect the platform/provider from liability regarding statistical accuracy and user research outcomes.

## 1. Legal Page Implementation
-   **File:** `app/legal/disclaimer/page.tsx` (New)
-   **Content:** Render the `LEGAL_DISCLAIMER.md` content in a clean, readable format.
-   **Route:** `/legal/disclaimer`

## 2. Homepage "Beta" Banner
-   **Component:** `components/landing/HomeContent.tsx`
-   **Action:** Add a prominent, full-width alert at the top of the Hero section.
-   **Message:** "System is in Beta Testing. Results should be cross-verified. Use at your own risk." (Multilingual support).

## 3. Global Header/Footer Updates
-   **Footer (`components/layout/Footer.tsx`):**
    -   Add link to `/legal/disclaimer`.
    -   Add a short "No Liability" sentence in the copyright section.
-   **Header (`components/layout/Header.tsx`):**
    -   Add a small badge: `[BETA MODE]` next to the logo.

## 4. Verification
-   Check visibility of the banner on the landing page.
-   Verify the link in the footer works from multiple pages.
-   Ensure the disclaimer page is formatted correctly.
