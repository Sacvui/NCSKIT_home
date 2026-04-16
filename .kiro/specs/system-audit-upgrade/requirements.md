# Requirements — ncsStat System Audit & Upgrade

## Tổng quan

ncsStat là nền tảng phân tích thống kê trực tuyến (Next.js 16 + React 19 + WebR WASM) dành cho nghiên cứu sinh Việt Nam. Spec này tổng hợp kết quả audit toàn hệ thống và định nghĩa các yêu cầu nâng cấp theo 5 nhóm: Bảo mật, Vận hành, UX, Code Quality, và R Code (WebR).

---

## 1. Bảo mật (Security)

### 1.1 Gemini API Key Exposure

**Vấn đề:** API key được truyền qua HTTP header `x-gemini-api-key` từ client → lộ trong DevTools, network logs, proxy logs.

**User Story:** Là một người dùng, tôi muốn API key Gemini của mình không bị lộ qua network traffic, để tài khoản Gemini của tôi không bị lạm dụng.

**Acceptance Criteria:**
- API key KHÔNG được truyền qua bất kỳ HTTP header nào từ client
- Key được lưu server-side (Vercel env var) hoặc mã hóa trước khi lưu client-side
- Nếu dùng key của user, phải có cơ chế mã hóa/proxy an toàn
- Không có key nào xuất hiện trong browser network tab

**Priority:** Must Have

---

### 1.2 Hardcoded Admin Email trong SQL

**Vấn đề:** Email admin `sacvui@gmail.com` hardcode trong RLS policy của `knowledge_articles` — không thể thay đổi không cần migration mới, lộ thông tin admin.

**User Story:** Là một admin, tôi muốn quyền quản lý bài viết được kiểm soát qua role system, không phải hardcode email, để dễ dàng thêm/xóa admin mà không cần migration.

**Acceptance Criteria:**
- RLS policy dùng `profiles.role` thay vì hardcode email
- Có thể thêm/xóa admin qua UPDATE profiles SET role = 'admin'
- Không có email cụ thể nào trong SQL migrations

**Priority:** Must Have

---

### 1.3 Thiếu Content Security Policy (CSP)

**Vấn đề:** `next.config.js` không có CSP header — dễ bị XSS, script injection.

**User Story:** Là một người dùng, tôi muốn trình duyệt chặn các script độc hại, để dữ liệu nghiên cứu của tôi không bị đánh cắp.

**Acceptance Criteria:**
- CSP header được thêm vào `next.config.js`
- CSP cho phép WebR WASM (`wasm-unsafe-eval` hoặc `unsafe-eval` nếu cần)
- CSP chặn inline scripts không được phép
- Không có CSP violation trong browser console khi dùng bình thường

**Priority:** Should Have

---

### 1.4 CSRF Protection chưa được áp dụng

**Vấn đề:** `utils/csrf-protection.ts` tồn tại nhưng không được dùng trong các API mutation endpoints (feedback, token transactions, profile update).

**User Story:** Là một người dùng đã đăng nhập, tôi muốn các hành động thay đổi dữ liệu của tôi được bảo vệ khỏi CSRF attacks.

**Acceptance Criteria:**
- CSRF token được validate trên tất cả POST/PUT/DELETE API routes có authentication
- Client tự động đính kèm CSRF token vào requests
- Request không có CSRF token hợp lệ bị từ chối với 403

**Priority:** Should Have

---

### 1.5 Supabase Client dùng `any` type

**Vấn đề:** `utils/supabase/client.ts` khai báo `supabaseInstance: any` — mất type safety, có thể gây runtime errors.

**User Story:** Là một developer, tôi muốn Supabase client có đầy đủ TypeScript types, để IDE có thể phát hiện lỗi trước khi runtime.

**Acceptance Criteria:**
- `supabaseInstance` có type `SupabaseClient<Database>` hoặc tương đương
- Không có `any` type trong utils/supabase/
- TypeScript strict mode không báo lỗi

**Priority:** Should Have

---

### 1.6 Over-fetching dữ liệu nhạy cảm

**Vấn đề:** `app/page.tsx` dùng `select('*')` trên bảng profiles — fetch toàn bộ dữ liệu kể cả các field nhạy cảm.

**User Story:** Là một người dùng, tôi muốn server chỉ trả về dữ liệu cần thiết, để giảm thiểu rủi ro lộ thông tin cá nhân.

**Acceptance Criteria:**
- Tất cả Supabase queries chỉ select các fields cần thiết (không dùng `select('*')` trên profiles)
- Các field nhạy cảm (email, phone, orcid_id) chỉ được fetch khi thực sự cần

**Priority:** Should Have

---

### 1.7 Rate Limiting chưa đầy đủ

**Vấn đề:** Rate limiting chỉ có trên `/api/ai-explain`. Các endpoint `/api/feedback`, `/api/unlock-researcher`, `/api/template-interpret` không có rate limiting.

**User Story:** Là một admin, tôi muốn tất cả API endpoints được bảo vệ khỏi abuse, để hệ thống không bị spam hoặc DDoS.

**Acceptance Criteria:**
- Rate limiting được áp dụng trên tất cả public API endpoints
- Feedback endpoint: tối đa 5 requests/phút/IP
- Unlock researcher: tối đa 3 requests/phút/IP
- Rate limit response trả về 429 với thông báo rõ ràng

**Priority:** Should Have

---

### 1.8 Feedback Table cho phép Anonymous Spam

**Vấn đề:** Policy "Anyone can insert feedback" với `user_id` nullable — không kiểm soát được anonymous spam.

**User Story:** Là một admin, tôi muốn feedback chỉ đến từ người dùng đã xác thực, để tránh spam và đảm bảo chất lượng feedback.

**Acceptance Criteria:**
- Feedback chỉ được insert khi user đã đăng nhập (auth.uid() IS NOT NULL)
- Hoặc có captcha/honeypot cho anonymous feedback
- Có rate limiting per user_id để tránh spam từ tài khoản thật

**Priority:** Should Have

---

### 1.9 Token Transaction không atomic

**Vấn đề:** `recordTokenTransaction` trong `token-service.ts` thực hiện 3 operations riêng biệt (read balance → update profile → insert transaction) — race condition nếu 2 requests đồng thời.

**User Story:** Là một người dùng, tôi muốn số dư token của mình luôn chính xác, kể cả khi thực hiện nhiều phân tích cùng lúc.

**Acceptance Criteria:**
- Token deduction được thực hiện trong một database transaction hoặc RPC function
- Không thể xảy ra race condition dẫn đến số dư âm hoặc double-spend
- `deductCreditsAtomic` trong `ncs-credits.ts` được dùng nhất quán thay vì `recordTokenTransaction`

**Priority:** Must Have

---

## 2. Vận hành (Operations)

### 2.1 Thiếu Error Monitoring

**Vấn đề:** Không có Sentry, Datadog, hay bất kỳ error tracking nào — lỗi production không được phát hiện chủ động.

**User Story:** Là một developer, tôi muốn được thông báo khi có lỗi xảy ra trong production, để có thể fix nhanh trước khi ảnh hưởng nhiều người dùng.

**Acceptance Criteria:**
- Tích hợp Sentry (hoặc tương đương) cho cả client-side và server-side errors
- Lỗi WebR initialization được track với context (browser, OS, WebR version)
- Lỗi API được track với request context (không bao gồm PII)
- Alert khi error rate tăng đột biến

**Priority:** Should Have

---

### 2.2 CI/CD thiếu Test Step

**Vấn đề:** `verify-build.yml` chạy type-check + lint + build nhưng không chạy `npm test` — unit tests không được verify trong CI.

**User Story:** Là một developer, tôi muốn CI pipeline chạy tests tự động, để phát hiện regression trước khi merge.

**Acceptance Criteria:**
- `verify-build.yml` thêm step `npm test -- --run` (hoặc `--passWithNoTests`)
- Test failures block merge
- Test coverage report được generate và lưu trữ

**Priority:** Should Have

---

### 2.3 Auto-sync dùng `--force` push

**Vấn đề:** `auto-sync.yml` dùng `git push target main --force` — nguy hiểm nếu mirror repo có diverged history.

**User Story:** Là một developer, tôi muốn auto-sync không làm mất lịch sử commit của mirror repo.

**Acceptance Criteria:**
- Thay `--force` bằng `--force-with-lease` hoặc kiểm tra trước khi push
- Có error handling nếu push thất bại
- Thông báo rõ ràng khi sync thất bại

**Priority:** Nice to Have

---

### 2.4 Console.log trong Production Code

**Vấn đề:** `middleware.ts`, `auth/callback/route.ts`, `core.ts` có nhiều `console.log` — gây noise trong production logs, có thể lộ thông tin nhạy cảm.

**User Story:** Là một developer, tôi muốn production logs chỉ chứa thông tin quan trọng, để dễ debug khi có vấn đề thực sự.

**Acceptance Criteria:**
- `console.log` trong production code được thay bằng structured logger (hoặc conditional `if (process.env.NODE_ENV !== 'production')`)
- Không có thông tin nhạy cảm (user ID, email, tokens) trong logs
- Error logs vẫn được giữ lại với `console.error`

**Priority:** Should Have

---

### 2.5 Không có Staging Environment

**Vấn đề:** Deploy thẳng từ main lên production — không có môi trường test trước khi release.

**User Story:** Là một developer, tôi muốn có staging environment để test trước khi deploy production.

**Acceptance Criteria:**
- Có Vercel preview deployment cho mỗi PR
- Branch `develop` deploy lên staging URL riêng
- Staging dùng Supabase project riêng (không dùng production DB)

**Priority:** Nice to Have

---

### 2.6 WebR Package Cache Strategy

**Vấn đề:** IDBFS caching có nhưng logic phức tạp, có thể fail silently — user phải download lại 30MB packages mỗi lần.

**User Story:** Là một người dùng, tôi muốn R engine khởi động nhanh sau lần đầu, để không phải chờ đợi lâu mỗi khi dùng.

**Acceptance Criteria:**
- IDBFS cache hoạt động ổn định trên Chrome, Firefox, Safari
- Có fallback rõ ràng khi IDBFS fail
- User được thông báo khi đang download packages lần đầu vs. load từ cache
- Cache invalidation khi WebR version thay đổi

**Priority:** Should Have

---

## 3. UX (User Experience)

### 3.1 WebR Loading UX kém

**Vấn đề:** Không có progress indicator rõ ràng khi R engine khởi động (10-30 giây) — user không biết hệ thống đang làm gì.

**User Story:** Là một người dùng mới, tôi muốn thấy tiến trình khởi động R engine, để biết hệ thống đang hoạt động và không bị bỏ rơi.

**Acceptance Criteria:**
- Progress bar hoặc step indicator hiển thị các giai đoạn: "Khởi động R Engine" → "Tải thư viện" → "Sẵn sàng"
- Thời gian ước tính được hiển thị (lần đầu vs. từ cache)
- Nếu quá 60 giây, hiển thị nút "Thử lại" và hướng dẫn
- Animation không gây distraction khi đang phân tích

**Priority:** Must Have

---

### 3.2 Error Messages không thân thiện

**Vấn đề:** Lỗi R analysis hiển thị technical error messages trực tiếp cho user — khó hiểu với người không biết R.

**User Story:** Là một nghiên cứu sinh không biết R, tôi muốn thông báo lỗi bằng tiếng Việt dễ hiểu, để biết cần làm gì tiếp theo.

**Acceptance Criteria:**
- Tất cả R errors được translate qua `translateRError()` trước khi hiển thị
- Error message bao gồm: mô tả vấn đề + gợi ý giải pháp
- Không có stack trace hay R error code hiển thị cho user
- Có nút "Báo cáo lỗi" để user gửi feedback

**Priority:** Must Have

---

### 3.3 Không có Onboarding Flow

**Vấn đề:** User mới không biết bắt đầu từ đâu — không có hướng dẫn, tutorial, hay sample data.

**User Story:** Là một nghiên cứu sinh lần đầu dùng ncsStat, tôi muốn có hướng dẫn bước đầu, để nhanh chóng thực hiện phân tích đầu tiên.

**Acceptance Criteria:**
- Có sample dataset để user thử ngay mà không cần upload file
- Có tooltip/guide cho các bước chính (upload → chọn phân tích → xem kết quả)
- Có video tutorial hoặc link đến documentation
- Onboarding có thể bỏ qua (skip) cho user đã quen

**Priority:** Should Have

---

### 3.4 Mobile Responsiveness

**Vấn đề:** Trang analyze phức tạp với nhiều bảng số liệu — chưa rõ UX trên mobile.

**User Story:** Là một người dùng dùng điện thoại, tôi muốn có thể xem kết quả phân tích trên mobile, để tiện theo dõi khi không có máy tính.

**Acceptance Criteria:**
- Trang analyze hiển thị đúng trên màn hình 375px (iPhone SE)
- Bảng kết quả có horizontal scroll trên mobile
- Các nút action đủ lớn để tap (tối thiểu 44x44px)
- Không có horizontal overflow trên mobile

**Priority:** Should Have

---

### 3.5 Accessibility

**Vấn đề:** Không có aria-labels, keyboard navigation chưa được kiểm tra — không accessible cho người dùng khuyết tật.

**User Story:** Là một người dùng dùng screen reader, tôi muốn có thể điều hướng và sử dụng ncsStat, để không bị phân biệt đối xử.

**Acceptance Criteria:**
- Tất cả interactive elements có aria-label hoặc aria-labelledby
- Keyboard navigation hoạt động cho các flow chính
- Color contrast đạt WCAG AA (4.5:1 cho text thường)
- Form inputs có labels liên kết đúng

**Priority:** Should Have

---

## 4. Code Quality

### 4.1 Monolithic page.tsx

**Vấn đề:** `app/analyze/page.tsx` có 1258 dòng — khó maintain, test, và debug. Đã có `page.refactored.tsx` nhưng chưa được áp dụng.

**User Story:** Là một developer, tôi muốn analyze page được chia thành các components nhỏ, để dễ maintain và test từng phần.

**Acceptance Criteria:**
- `page.tsx` được thay bằng `page.refactored.tsx` (hoặc refactor tương đương)
- Mỗi component không quá 300 dòng
- Logic được tách thành custom hooks
- Không có regression về functionality

**Priority:** Should Have

---

### 4.2 `any` Types rải rác

**Vấn đề:** `any` type xuất hiện trong supabase client, ORCID profile fetch, feedback API — mất type safety.

**User Story:** Là một developer, tôi muốn codebase có đầy đủ TypeScript types, để IDE phát hiện lỗi sớm.

**Acceptance Criteria:**
- Không có `any` type trong utils/supabase/
- ORCID profile types được định nghĩa đầy đủ
- Supabase Database types được generate và sử dụng
- `tsc --noEmit` không có warnings về `any`

**Priority:** Should Have

---

### 4.3 Thiếu Unit Tests

**Vấn đề:** Jest được cấu hình nhưng coverage không rõ — các business logic quan trọng (token service, credit wrapper) chưa có tests.

**User Story:** Là một developer, tôi muốn các business logic quan trọng có unit tests, để tự tin khi refactor.

**Acceptance Criteria:**
- Token service có tests cho: deduct, refund, race condition
- Credit wrapper có tests cho: insufficient balance, analysis failure refund
- R analysis modules có integration tests với mock WebR
- Coverage tối thiểu 60% cho lib/ directory

**Priority:** Should Have

---

### 4.4 Dynamic Import trong API Route

**Vấn đề:** `await import('@/lib/token-service')` trong `feedback/route.ts` là anti-pattern — gây cold start latency.

**User Story:** Là một người dùng, tôi muốn feedback submission nhanh, không bị delay do dynamic import.

**Acceptance Criteria:**
- `recordTokenTransactionAdmin` được import tĩnh ở đầu file
- Không có dynamic imports trong API routes (trừ khi có lý do rõ ràng)

**Priority:** Nice to Have

---

### 4.5 Unused Variables

**Vấn đề:** `host` trong `utils/supabase/server.ts` được đọc nhưng không dùng. `isPublicRoute` trong `middleware.ts` được tính nhưng không dùng.

**User Story:** Là một developer, tôi muốn codebase không có dead code, để dễ đọc và maintain.

**Acceptance Criteria:**
- Không có unused variables (ESLint `no-unused-vars` không báo lỗi)
- Không có unused imports
- Dead code được xóa hoặc comment rõ lý do giữ lại

**Priority:** Nice to Have

---

### 4.6 Dependencies không được pin version

**Vấn đề:** `package.json` dùng `^` prefix cho tất cả dependencies — có thể gây breaking changes khi install.

**User Story:** Là một developer, tôi muốn build reproducible, để không bị surprise khi deploy.

**Acceptance Criteria:**
- Dependencies quan trọng (next, react, @supabase/*) được pin exact version
- `package-lock.json` được commit và không bị ignore
- Có process để update dependencies có kiểm soát (Dependabot hoặc manual)

**Priority:** Nice to Have

---

## 5. R Code (WebR)

### 5.1 R Code nhúng trong TypeScript Strings

**Vấn đề:** R code được viết dưới dạng template strings trong TypeScript — không có syntax highlighting, linting, hay IDE support.

**User Story:** Là một developer/statistician, tôi muốn R code có syntax highlighting và linting, để dễ đọc và phát hiện lỗi.

**Acceptance Criteria:**
- R code được tách ra file `.R` riêng hoặc dùng tagged template literals với R syntax support
- Có R linter (lintr) chạy trong CI để kiểm tra R code quality
- Hoặc có documentation rõ ràng về cách test R code locally

**Priority:** Nice to Have

---

### 5.2 Không có R Unit Tests

**Vấn đề:** Không có cách verify tính đúng đắn của các phép tính thống kê — Cronbach's Alpha, EFA, regression có thể trả về kết quả sai mà không ai biết.

**User Story:** Là một nghiên cứu sinh, tôi muốn tin tưởng rằng kết quả thống kê từ ncsStat là chính xác, để có thể dùng trong luận văn.

**Acceptance Criteria:**
- Mỗi analysis module có ít nhất 1 test với known dataset và expected output
- Cronbach's Alpha test: dataset chuẩn với α = 0.85 ± 0.01
- Pearson correlation test: r = 1.0 cho identical vectors
- Linear regression test: coefficients khớp với R reference implementation
- Tests chạy được trong CI (không cần WebR, dùng mock hoặc reference values)

**Priority:** Must Have (correctness properties)

---

### 5.3 Error Handling R không đồng nhất

**Vấn đề:** Mỗi analysis module xử lý lỗi khác nhau — một số dùng `tryCatch`, một số không — gây inconsistent UX.

**User Story:** Là một người dùng, tôi muốn nhận được thông báo lỗi nhất quán khi phân tích thất bại, bất kể loại phân tích nào.

**Acceptance Criteria:**
- Tất cả R code được wrap trong `tryCatch` với error message chuẩn
- Error format nhất quán: `list(error = TRUE, message = "...", code = "...")`
- TypeScript side parse error format nhất quán
- User nhận được cùng loại error message cho cùng loại lỗi

**Priority:** Should Have

---

### 5.4 Không có Timeout cho R Execution

**Vấn đề:** `executeRWithRecovery` có `timeoutMs = 120000` (2 phút) nhưng một số calls không truyền timeout — có thể hang vô thời hạn.

**User Story:** Là một người dùng, tôi muốn phân tích tự động dừng sau thời gian hợp lý, để không bị treo browser.

**Acceptance Criteria:**
- Tất cả `executeRWithRecovery` calls có explicit timeout
- Timeout mặc định là 60 giây (không phải 120)
- Khi timeout, user nhận được thông báo rõ ràng và gợi ý (giảm số biến, tăng timeout)
- WebR instance được reset sau timeout để tránh hung state

**Priority:** Should Have

---

### 5.5 Input Validation cho R Data

**Vấn đề:** Nếu data có NA, Inf, NaN không được xử lý nhất quán — một số modules có `na.omit`, một số không.

**User Story:** Là một người dùng có dữ liệu không hoàn chỉnh, tôi muốn hệ thống xử lý missing values một cách nhất quán, để không bị crash bất ngờ.

**Acceptance Criteria:**
- Tất cả analysis modules có bước validate input trước khi chạy R code
- Missing values (NA, Inf, NaN) được xử lý nhất quán (na.omit hoặc na.rm = TRUE)
- User được cảnh báo khi data có missing values và bao nhiêu rows bị loại
- Không có R crash do unhandled NA/Inf

**Priority:** Should Have

---

### 5.6 Package Loading không có Graceful Degradation

**Vấn đề:** Nếu CRAN package fail (network issue, incompatible version), analysis bị fail hoàn toàn — không có fallback.

**User Story:** Là một người dùng ở vùng mạng chậm, tôi muốn hệ thống thông báo rõ ràng khi không thể tải package, thay vì crash im lặng.

**Acceptance Criteria:**
- Package loading failure hiển thị thông báo rõ ràng với tên package và lý do
- Có retry mechanism với exponential backoff
- Nếu package không thể load sau 3 lần retry, disable tính năng đó và thông báo user
- Không có silent failure

**Priority:** Should Have

---

## Correctness Properties (Property-Based Testing)

Các properties sau phải được verify bằng tests với known datasets:

### P1: Cronbach's Alpha Monotonicity
- Nếu thêm một item có item-total correlation cao → Alpha tăng hoặc giữ nguyên
- Nếu xóa item có alpha-if-deleted cao hơn alpha hiện tại → Alpha tăng sau khi xóa

### P2: Pearson Correlation Symmetry
- `corr(X, Y) == corr(Y, X)` với mọi X, Y
- `corr(X, X) == 1.0` với mọi X không phải hằng số
- `-1.0 <= corr(X, Y) <= 1.0` với mọi X, Y

### P3: Linear Regression Residuals
- `sum(residuals) ≈ 0` (với intercept)
- `R² ∈ [0, 1]`
- Predicted values của training data: `mean(predicted) ≈ mean(actual)`

### P4: T-test Symmetry
- `t-test(G1, G2).t == -t-test(G2, G1).t`
- `t-test(G1, G2).p == t-test(G2, G1).p`

### P5: Token Balance Invariant
- `balance_after = balance_before + amount` cho mọi transaction
- `balance >= 0` sau mọi deduction (không thể âm)
- Tổng `total_earned - total_spent == current_balance` (accounting identity)

### P6: Rate Limiter Correctness
- Sau N requests trong window → request thứ N+1 bị từ chối
- Sau khi window reset → requests được chấp nhận lại
- Rate limiter không bị bypass bằng concurrent requests

---

## Phân loại ưu tiên tổng hợp

| # | Hạng mục | Priority | Effort |
|---|----------|----------|--------|
| 1.1 | Gemini API Key Exposure | Must Have | Medium |
| 1.9 | Token Transaction không atomic | Must Have | Medium |
| 3.1 | WebR Loading UX | Must Have | Small |
| 3.2 | Error Messages không thân thiện | Must Have | Small |
| 5.2 | R Unit Tests (correctness) | Must Have | Large |
| 1.2 | Hardcoded Admin Email | Must Have | Small |
| 1.3 | Thiếu CSP | Should Have | Medium |
| 1.4 | CSRF Protection | Should Have | Medium |
| 1.5 | Supabase `any` type | Should Have | Small |
| 1.6 | Over-fetching profiles | Should Have | Small |
| 1.7 | Rate Limiting đầy đủ | Should Have | Small |
| 1.8 | Feedback Anonymous Spam | Should Have | Small |
| 2.1 | Error Monitoring (Sentry) | Should Have | Medium |
| 2.2 | CI/CD Test Step | Should Have | Small |
| 2.4 | Console.log cleanup | Should Have | Small |
| 2.6 | WebR Cache Strategy | Should Have | Medium |
| 3.3 | Onboarding Flow | Should Have | Large |
| 3.4 | Mobile Responsiveness | Should Have | Medium |
| 3.5 | Accessibility | Should Have | Large |
| 4.1 | Monolithic page.tsx | Should Have | Large |
| 4.2 | `any` Types | Should Have | Medium |
| 4.3 | Unit Tests | Should Have | Large |
| 5.3 | R Error Handling | Should Have | Medium |
| 5.4 | R Execution Timeout | Should Have | Small |
| 5.5 | R Input Validation | Should Have | Medium |
| 5.6 | Package Graceful Degradation | Should Have | Small |
| 2.3 | Auto-sync force push | Nice to Have | Small |
| 2.5 | Staging Environment | Nice to Have | Large |
| 4.4 | Dynamic Import | Nice to Have | Small |
| 4.5 | Unused Variables | Nice to Have | Small |
| 4.6 | Pin Dependencies | Nice to Have | Small |
| 5.1 | R Code trong .R files | Nice to Have | Large |
