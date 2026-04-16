# Tasks — ncsStat System Audit & Upgrade

## Sprint 1 — Must Have (Bảo mật + UX Critical)

- [x] 1. Fix hardcoded admin email trong RLS
  - [x] 1.1 Tạo migration file `supabase/migrations/20260417000000_fix_knowledge_rls.sql`
  - [x] 1.2 Drop policy cũ dùng hardcoded email, tạo policy mới dùng `profiles.role`
  - [x] 1.3 Verify policy mới hoạt động đúng (admin có thể CRUD, user thường chỉ SELECT)

- [x] 2. Gemini API Key — Server-side proxy
  - [x] 2.1 Tạo `utils/key-encryption.ts` với `encryptApiKey` và `decryptApiKey` dùng CryptoJS AES-256
  - [x] 2.2 Cập nhật `app/api/ai-explain/route.ts`: ưu tiên `GEMINI_API_KEY` env var, fallback encrypted personal key
  - [x] 2.3 Cập nhật `app/api/ai-suggest/route.ts`: tương tự ai-explain
  - [x] 2.4 Cập nhật client-side: lưu key dưới dạng encrypted trong localStorage, gửi `x-encrypted-key` thay vì `x-gemini-api-key`
  - [x] 2.5 Thêm `GEMINI_API_KEY` vào `.env.example` và hướng dẫn trong README

- [x] 3. Token Transaction Atomicity
  - [x] 3.1 Tạo migration `supabase/migrations/20260417000002_deploy_deduct_credits_rpc.sql` với SQL từ comments trong `ncs-credits.ts`
  - [x] 3.2 Audit toàn bộ codebase tìm calls đến `recordTokenTransaction` với amount âm
  - [x] 3.3 Replace các calls đó bằng `deductCreditsAtomic`
  - [x] 3.4 Verify `deductCreditsAtomic` fallback hoạt động khi RPC chưa deploy

- [x] 4. WebR Loading Progress Component
  - [x] 4.1 Tạo `components/WebRLoadingProgress.tsx` với progress bar và phase indicators
  - [x] 4.2 Parse `getWebRStatus().progress` string thành phases (starting/packages/ready/error)
  - [x] 4.3 Hiển thị thời gian ước tính (lần đầu ~30s, từ cache ~5s)
  - [x] 4.4 Thêm nút "Thử lại" khi phase = error và đã quá 60 giây
  - [x] 4.5 Tích hợp component vào `app/analyze/page.tsx` và `app/analyze2/page.tsx`

- [x] 5. Error Message System
  - [x] 5.1 Tạo interface `UserFriendlyError` trong `lib/webr/utils.ts`
  - [x] 5.2 Implement `translateRErrorDetailed()` với ít nhất 10 error mappings phổ biến
  - [x] 5.3 Tạo `lib/webr/error-handler.ts` với `parseRResult()` để parse R output nhất quán
  - [x] 5.4 Cập nhật tất cả analysis modules dùng `parseRResult()` thay vì parse thủ công
  - [x] 5.5 Cập nhật UI components hiển thị `UserFriendlyError.title` + `suggestion` thay vì raw error

- [x] 6. R Analysis Correctness Tests
  - [x] 6.1 Tạo `__tests__/webr/analysis-correctness.test.ts`
  - [x] 6.2 Test P2: Pearson correlation symmetry với mock data
  - [x] 6.3 Test P4: T-test symmetry (t(G1,G2) == -t(G2,G1))
  - [x] 6.4 Test P5: Token balance invariant (balance_after = balance_before + amount)
  - [x] 6.5 Test P6: Rate limiter blocks after N requests, resets after window
  - [x] 6.6 Test P3: Linear regression R² ∈ [0,1] và sum(residuals) ≈ 0

---

## Sprint 2 — Should Have (Bảo mật + Vận hành)

- [x] 7. Content Security Policy
  - [x] 7.1 Thêm CSP header vào `next.config.js` với whitelist cho WebR WASM, Supabase, Gemini
  - [x] 7.2 Test không có CSP violation trong browser console khi dùng bình thường
  - [x] 7.3 Test WebR WASM vẫn hoạt động với CSP mới

- [x] 8. CSRF / Origin Validation
  - [x] 8.1 Thêm `validateOrigin()` vào `utils/csrf-protection.ts`
  - [x] 8.2 Áp dụng `validateOrigin()` trong `app/api/feedback/route.ts`
  - [x] 8.3 Áp dụng `validateOrigin()` trong `app/api/unlock-researcher/route.ts`
  - [x] 8.4 Áp dụng `validateOrigin()` trong các API routes mutation khác

- [x] 9. Rate Limiting đầy đủ
  - [x] 9.1 Thêm rate limit vào `app/api/feedback/route.ts` (5 req/phút/IP)
  - [x] 9.2 Thêm rate limit vào `app/api/template-interpret/route.ts` (10 req/phút/IP)
  - [x] 9.3 Verify `app/api/unlock-researcher/route.ts` đã có rate limit (5 req/phút — đã có, kiểm tra)

- [x] 10. Feedback RLS Fix
  - [x] 10.1 Tạo migration `supabase/migrations/20260417000001_fix_feedback_rls.sql`
  - [x] 10.2 Drop policy "Anyone can insert feedback", tạo policy yêu cầu `auth.uid() IS NOT NULL`
  - [x] 10.3 Cập nhật `app/api/feedback/route.ts` để trả về lỗi rõ ràng khi user chưa đăng nhập

- [x] 11. Supabase TypeScript Types
  - [x] 11.1 Generate types: `npx supabase gen types typescript --project-id nflmoaclnyjwuloydmmv > types/database.types.ts`
  - [x] 11.2 Cập nhật `utils/supabase/client.ts` dùng `SupabaseClient<Database>` type
  - [x] 11.3 Cập nhật `utils/supabase/server.ts` dùng `Database` generic
  - [x] 11.4 Xóa `host` variable không dùng trong `utils/supabase/server.ts`
  - [x] 11.5 Verify `tsc --noEmit` không báo lỗi mới

- [x] 12. Structured Logger + Console.log Cleanup
  - [x] 12.1 Tạo `utils/logger.ts` với `logger.debug/info/warn/error`
  - [x] 12.2 Replace `console.log` trong `middleware.ts` bằng `logger.debug`
  - [x] 12.3 Replace `console.log` trong `app/auth/callback/route.ts` bằng `logger.debug`
  - [x] 12.4 Replace `console.log` trong `lib/webr/core.ts` bằng `logger.debug/info`
  - [x] 12.5 Giữ lại tất cả `console.error` (không thay đổi)

- [x] 13. CI/CD Test Step
  - [x] 13.1 Thêm step `npm test -- --passWithNoTests` vào `.github/workflows/verify-build.yml`
  - [x] 13.2 Verify CI pipeline chạy thành công với tests mới từ Sprint 1

- [x] 14. Sentry Integration
  - [x] 14.1 Cài đặt `@sentry/nextjs` package
  - [x] 14.2 Tạo `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
  - [x] 14.3 Tạo `lib/monitoring.ts` với `captureWebRError` và `captureAPIError`
  - [x] 14.4 Tích hợp `captureWebRError` vào `lib/webr/core.ts` khi init fail
  - [x] 14.5 Thêm `SENTRY_DSN` vào `.env.example`

---

## Sprint 3 — Should Have (Code Quality + R)

- [x] 15. Refactor page.tsx
  - [x] 15.1 Smoke test `app/analyze/page.refactored.tsx` — verify toàn bộ analyze flow hoạt động
  - [x] 15.2 Rename `page.tsx` → `page.legacy.tsx`
  - [x] 15.3 Rename `page.refactored.tsx` → `page.tsx`
  - [x] 15.4 Test regression: upload CSV, chọn phân tích, xem kết quả, export PDF
  - [x] 15.5 Xóa `page.legacy.tsx` sau khi verify

- [x] 16. Fix `any` Types
  - [x] 16.1 Fix `any` trong `utils/supabase/client.ts` (đã xử lý ở task 11)
  - [x] 16.2 Fix `any` trong `lib/orcid-auth.ts` (emails array type)
  - [x] 16.3 Fix `any` trong `app/api/feedback/route.ts` (error type)
  - [x] 16.4 Fix `any` trong `lib/ncs-credits.ts` (transaction insert response)
  - [x] 16.5 Fix `isPublicRoute` unused variable trong `utils/supabase/middleware.ts`

- [x] 17. Unit Tests — Business Logic
  - [x] 17.1 Tạo `__tests__/lib/token-service.test.ts` — test deduct, refund, insufficient balance
  - [x] 17.2 Tạo `__tests__/lib/analysis-credit-wrapper.test.ts` — test credit deduction + refund on failure
  - [x] 17.3 Tạo `__tests__/utils/security.test.ts` — test sanitizeInput với XSS payloads
  - [x] 17.4 Tạo `__tests__/utils/csrf-protection.test.ts` — test validateOrigin
  - [x] 17.5 Tạo `__tests__/lib/rate-limit.test.ts` — test rate limiter (đã có trong task 6.5-6.6)

- [x] 18. R Error Handling Standardization
  - [x] 18.1 Tạo `lib/webr/constants.ts` với `WEBR_TIMEOUTS` constants
  - [x] 18.2 Cập nhật `lib/webr/analyses/reliability.ts` — wrap R code trong tryCatch chuẩn, dùng WEBR_TIMEOUTS
  - [x] 18.3 Cập nhật `lib/webr/analyses/hypothesis.ts` — tương tự
  - [x] 18.4 Cập nhật `lib/webr/analyses/regression.ts` — tương tự
  - [x] 18.5 Cập nhật `lib/webr/analyses/descriptive.ts` — tương tự
  - [x] 18.6 Cập nhật `lib/webr/analyses/mediation.ts` — tương tự
  - [x] 18.7 Cập nhật `lib/webr/analyses/multivariate.ts` — tương tự

- [x] 19. R Input Validation Layer
  - [x] 19.1 Tạo `lib/webr/input-validator.ts` với `validateAndCleanData()`
  - [x] 19.2 Tích hợp validation vào `runCronbachAlpha`, `runEFA`, `runLinearRegression`
  - [x] 19.3 Tích hợp validation vào `runCorrelation`, `runTTestIndependent`, `runOneWayANOVA`
  - [x] 19.4 Hiển thị warning cho user khi rows bị loại do missing values

- [x] 20. WebR Cache Strategy Improvement
  - [x] 20.1 Cập nhật `lib/webr/cache.ts` với version-based cache invalidation
  - [x] 20.2 Thêm `CACHE_VERSION` constant — bump khi WebR hoặc packages thay đổi
  - [x] 20.3 Test cache hoạt động trên Chrome, Firefox (Safari nếu có thể)
  - [x] 20.4 Cập nhật WebRLoadingProgress để phân biệt "lần đầu" vs "từ cache"

- [x] 21. Over-fetching Fix
  - [x] 21.1 Cập nhật `app/page.tsx`: thay `select('*')` bằng `select('id, full_name, avatar_url, role, tokens')`
  - [x] 21.2 Audit các file khác dùng `select('*')` trên profiles và fix tương tự

---

## Sprint 4 — Nice to Have

- [x]* 22. Onboarding Flow
  - [x]* 22.1 Tạo `public/sample-data/cronbach-sample.csv` (5 items, 100 rows)
  - [x]* 22.2 Thêm banner "Lần đầu dùng?" vào analyze page
  - [x]* 22.3 Implement load sample data khi click banner
  - [x]* 22.4 Thêm tooltips cho các bước chính
  - [x]* 22.5 Lưu `ncsstat_onboarding_completed` vào localStorage

- [x]* 23. Mobile Responsiveness Audit
  - [x]* 23.1 Test analyze page trên 375px viewport
  - [x]* 23.2 Fix horizontal overflow nếu có
  - [x]* 23.3 Đảm bảo bảng kết quả có horizontal scroll trên mobile
  - [x]* 23.4 Kiểm tra touch targets tối thiểu 44x44px

- [x]* 24. Accessibility Improvements
  - [x]* 24.1 Thêm aria-labels cho tất cả buttons không có text
  - [x]* 24.2 Thêm aria-labels cho form inputs
  - [x]* 24.3 Test keyboard navigation cho upload → analyze → results flow
  - [x]* 24.4 Kiểm tra color contrast với browser DevTools

- [x]* 25. Auto-sync Safety
  - [x]* 25.1 Thay `--force` bằng `--force-with-lease` trong `auto-sync.yml`
  - [x]* 25.2 Thêm error handling khi push thất bại

- [x]* 26. Code Cleanup
  - [x]* 26.1 Fix dynamic import trong `app/api/feedback/route.ts` → static import
  - [x]* 26.2 Xóa unused variables còn lại sau Sprint 3
  - [x]* 26.3 Review và pin versions cho dependencies quan trọng trong `package.json`
