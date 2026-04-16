# Design — ncsStat System Audit & Upgrade

## Tổng quan kiến trúc

Hệ thống ncsStat hiện tại theo mô hình:

```
Browser (React 19 + WebR WASM)
    ↕ HTTPS
Next.js 16 App Router (Vercel Edge)
    ↕ Supabase JS SDK
Supabase PostgreSQL (Auth + DB + RLS)
    ↕ HTTP (user-provided key)
Google Gemini API
```

Các thay đổi trong spec này không thay đổi kiến trúc tổng thể mà tập trung vào hardening từng layer.

---

## 1. Bảo mật — Thiết kế chi tiết

### 1.1 Gemini API Key — Server-side Proxy

**Vấn đề hiện tại:** Client gửi key qua `x-gemini-api-key` header → lộ trong DevTools.

**Giải pháp:** Hai chế độ hoạt động song song:

```
Chế độ A (Shared Key — mặc định):
  Client → POST /api/ai-explain (không có key)
  Server → đọc GEMINI_API_KEY từ env → gọi Gemini API
  → Giới hạn: rate limit chặt hơn (5 req/phút/user)

Chế độ B (Personal Key — tùy chọn):
  Client → lưu key trong localStorage (mã hóa AES-256)
  Client → POST /api/ai-explain với encrypted_key header
  Server → giải mã key → gọi Gemini API
  → Không lưu key trên server, không log key
```

**Implementation:**

```typescript
// utils/key-encryption.ts
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_KEY_SALT || 'ncsstat-v2';

export function encryptApiKey(key: string): string {
  return CryptoJS.AES.encrypt(key, ENCRYPTION_KEY).toString();
}

export function decryptApiKey(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
```

```typescript
// app/api/ai-explain/route.ts (updated)
// Priority: 1) GEMINI_API_KEY env var, 2) encrypted personal key
const serverKey = process.env.GEMINI_API_KEY;
const encryptedPersonalKey = req.headers.get('x-encrypted-key');

let apiKey: string;
if (serverKey) {
  apiKey = serverKey; // Shared key — no user key needed
} else if (encryptedPersonalKey) {
  apiKey = decryptApiKey(encryptedPersonalKey); // Personal key
} else {
  return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
}
```

**Migration path:** Thêm `GEMINI_API_KEY` vào Vercel env vars → tất cả users dùng shared key → personal key vẫn hoạt động như fallback.

---

### 1.2 Hardcoded Admin Email — Role-based RLS

**Migration SQL:**

```sql
-- Migration: Fix knowledge_articles RLS to use role-based check
-- File: supabase/migrations/20260417000000_fix_knowledge_rls.sql

DROP POLICY IF EXISTS "Admins can manage articles" ON public.knowledge_articles;

CREATE POLICY "Admins can manage articles"
ON public.knowledge_articles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'platform_admin', 'super_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'platform_admin', 'super_admin')
  )
);
```

---

### 1.3 Content Security Policy

**Thách thức:** WebR WASM yêu cầu `wasm-unsafe-eval` và `blob:` URLs. CSP phải cân bằng giữa security và WebR compatibility.

**CSP Header Design:**

```javascript
// next.config.js — thêm vào headers()
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'wasm-unsafe-eval' blob: https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com https://pub.orcid.org",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
  ].join('; ')
}
```

**Lưu ý:** `unsafe-inline` cho styles là cần thiết vì Tailwind CSS 4 dùng inline styles. Sẽ được tighten sau khi migrate sang CSS modules.

---

### 1.4 CSRF Protection — Áp dụng thực tế

**Hiện trạng:** `utils/csrf-protection.ts` đã có nhưng không được dùng.

**Design:** Dùng SameSite cookie + Origin header validation thay vì CSRF token (đơn giản hơn, phù hợp với Next.js App Router):

```typescript
// utils/csrf-protection.ts — thêm hàm mới
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  
  if (!origin || !host) return false; // Reject requests without origin
  
  const allowedOrigins = [
    `https://${host}`,
    'https://stat.ncskit.org',
    'https://ncsstat.ncskit.org',
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
  ];
  
  return allowedOrigins.some(allowed => origin.startsWith(allowed));
}
```

```typescript
// Áp dụng trong API routes có mutation:
// app/api/feedback/route.ts, app/api/unlock-researcher/route.ts
if (!validateOrigin(req)) {
  return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
}
```

---

### 1.5 Supabase TypeScript Types

**Giải pháp:** Generate types từ Supabase schema:

```bash
# Chạy một lần để generate types
npx supabase gen types typescript --project-id nflmoaclnyjwuloydmmv > types/database.types.ts
```

```typescript
// utils/supabase/client.ts — updated
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;
  supabaseInstance = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return supabaseInstance;
};
```

---

### 1.9 Token Transaction Atomicity

**Hiện trạng:** `deductCreditsAtomic` đã được implement trong `ncs-credits.ts` với RPC fallback. Vấn đề là `recordTokenTransaction` trong `token-service.ts` vẫn được dùng ở một số chỗ.

**Design:** Audit và replace tất cả calls đến `recordTokenTransaction` bằng `deductCreditsAtomic`:

```
Mapping:
  recordTokenTransaction(userId, -cost, ...) → deductCreditsAtomic(userId, cost, ...)
  recordTokenTransaction(userId, +amount, ...) → recordTokenTransactionAdmin(userId, amount, ...) [server-side only]
```

**SQL RPC (đã có trong comments của ncs-credits.ts, cần deploy):**

```sql
-- Đảm bảo RPC này đã được deploy lên Supabase
-- Xem full SQL trong lib/ncs-credits.ts comments
CREATE OR REPLACE FUNCTION public.deduct_credits_atomic(
  p_user_id uuid, p_amount integer, p_reason text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$ ... $$;
```

---

## 2. Vận hành — Thiết kế chi tiết

### 2.1 Error Monitoring — Sentry Integration

**Architecture:**

```
Client Error → Sentry SDK (browser) → Sentry Dashboard
Server Error → Sentry SDK (Node) → Sentry Dashboard
WebR Error → Custom Sentry wrapper → Sentry Dashboard (tagged: webr=true)
```

**Implementation:**

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

export function captureWebRError(error: Error, context: {
  method?: string;
  phase?: 'init' | 'package_load' | 'execution';
  browser?: string;
}) {
  Sentry.withScope(scope => {
    scope.setTag('component', 'webr');
    scope.setTag('webr_phase', context.phase || 'unknown');
    scope.setContext('webr', context);
    Sentry.captureException(error);
  });
}

export function captureAPIError(error: Error, endpoint: string, statusCode?: number) {
  Sentry.withScope(scope => {
    scope.setTag('component', 'api');
    scope.setTag('endpoint', endpoint);
    if (statusCode) scope.setTag('status_code', String(statusCode));
    // Never capture PII
    Sentry.captureException(error);
  });
}
```

**Config files cần tạo:**
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

---

### 2.2 CI/CD — Thêm Test Step

```yaml
# .github/workflows/verify-build.yml — thêm step
- name: 🧪 Run unit tests
  run: npm test -- --passWithNoTests
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

---

### 2.4 Structured Logging

**Design:** Tạo logger utility thay thế console.log:

```typescript
// utils/logger.ts
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (msg: string, data?: object) => {
    if (isDev) console.log(`[DEBUG] ${msg}`, data || '');
  },
  info: (msg: string, data?: object) => {
    if (isDev) console.log(`[INFO] ${msg}`, data || '');
  },
  warn: (msg: string, data?: object) => {
    console.warn(`[WARN] ${msg}`, data || '');
  },
  error: (msg: string, error?: unknown) => {
    console.error(`[ERROR] ${msg}`, error || '');
  }
};
```

**Áp dụng:** Replace `console.log` trong `middleware.ts`, `auth/callback/route.ts`, `lib/webr/core.ts` bằng `logger.debug/info`.

---

### 2.6 WebR Cache Strategy — Cải thiện

**Vấn đề hiện tại:** IDBFS sanity check dùng `writeLines/readLines` — chậm và có thể fail trên một số browsers.

**Improved design:**

```typescript
// lib/webr/cache.ts — thêm version-based invalidation
const CACHE_VERSION = 'v2.1.0'; // Bump khi WebR version thay đổi

export function getCachedWebRState(): { valid: boolean; version: string } {
  if (typeof localStorage === 'undefined') return { valid: false, version: '' };
  
  const cached = localStorage.getItem('webr_cache_state');
  if (!cached) return { valid: false, version: '' };
  
  try {
    const state = JSON.parse(cached);
    const isValid = state.version === CACHE_VERSION && state.packagesLoaded === true;
    return { valid: isValid, version: state.version };
  } catch {
    return { valid: false, version: '' };
  }
}

export function setCachedWebRState(packagesLoaded: boolean): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('webr_cache_state', JSON.stringify({
    version: CACHE_VERSION,
    packagesLoaded,
    timestamp: Date.now()
  }));
}
```

---

## 3. UX — Thiết kế chi tiết

### 3.1 WebR Loading Progress Component

**Component design:**

```tsx
// components/WebRLoadingProgress.tsx
interface WebRLoadingProgressProps {
  phase: 'idle' | 'starting' | 'packages' | 'ready' | 'error';
  progress: string;
  isFromCache: boolean;
  onRetry?: () => void;
}

// Phases và messages:
const PHASE_CONFIG = {
  idle:     { label: 'Chờ khởi động...', percent: 0 },
  starting: { label: 'Khởi động R Engine...', percent: 20 },
  packages: { label: 'Tải thư viện thống kê...', percent: 60 },
  ready:    { label: 'Sẵn sàng phân tích!', percent: 100 },
  error:    { label: 'Lỗi khởi động', percent: 0 },
};
```

**UI:**
```
┌─────────────────────────────────────────┐
│  ⚙️  Đang khởi động R Engine...          │
│  ████████░░░░░░░░░░  40%                │
│  Tải thư viện psych, lavaan...          │
│  ⏱ Lần đầu: ~30s | Từ cache: ~5s       │
└─────────────────────────────────────────┘
```

**Tích hợp với `getWebRStatus()` từ `lib/webr/core.ts`** — đã có `progress` string, chỉ cần parse thành phases.

---

### 3.2 Error Message System

**Design:** Mở rộng `translateRError()` trong `lib/webr/utils.ts`:

```typescript
interface UserFriendlyError {
  title: string;       // Tiêu đề ngắn
  message: string;     // Mô tả chi tiết
  suggestion: string;  // Gợi ý giải pháp
  canRetry: boolean;   // Có thể thử lại không
  canReport: boolean;  // Có nút báo cáo không
}

export function translateRErrorDetailed(error: string): UserFriendlyError {
  // Map từ R error → user-friendly message
  const errorMappings: Array<{
    pattern: RegExp;
    result: UserFriendlyError;
  }> = [
    {
      pattern: /not enough observations|too few observations/i,
      result: {
        title: 'Không đủ dữ liệu',
        message: 'Cần ít nhất 30 quan sát để phân tích đáng tin cậy.',
        suggestion: 'Thu thập thêm dữ liệu hoặc giảm số biến phân tích.',
        canRetry: false,
        canReport: false
      }
    },
    {
      pattern: /singular matrix|computational singular/i,
      result: {
        title: 'Đa cộng tuyến hoàn hảo',
        message: 'Hai hoặc nhiều biến có tương quan hoàn hảo (r = 1.0).',
        suggestion: 'Kiểm tra và loại bỏ các biến trùng lặp hoặc biến hằng số.',
        canRetry: false,
        canReport: false
      }
    },
    // ... more mappings
  ];
  
  for (const mapping of errorMappings) {
    if (mapping.pattern.test(error)) return mapping.result;
  }
  
  return {
    title: 'Lỗi phân tích',
    message: 'Đã xảy ra lỗi không xác định.',
    suggestion: 'Vui lòng thử lại. Nếu lỗi tiếp tục, hãy báo cáo để chúng tôi hỗ trợ.',
    canRetry: true,
    canReport: true
  };
}
```

---

### 3.3 Onboarding Flow

**Design:** Minimal onboarding — không popup, không wizard phức tạp.

```
Lần đầu vào /analyze:
  1. Banner nhỏ ở top: "Lần đầu dùng? Thử với dữ liệu mẫu →"
  2. Click → load sample dataset (Cronbach's Alpha với 5 items, n=100)
  3. Tooltip xuất hiện tại bước "Chọn phân tích": "Thử Cronbach's Alpha trước"
  4. Sau khi chạy xong → tooltip: "Xem kết quả bên dưới. Nhấn 'AI Giải thích' để hiểu kết quả"
  
State lưu trong localStorage: 'ncsstat_onboarding_completed'
```

**Sample dataset:** File CSV nhỏ (5 cột, 100 rows) được bundle vào `/public/sample-data/cronbach-sample.csv`.

---

## 4. Code Quality — Thiết kế chi tiết

### 4.1 Refactor page.tsx

**Cấu trúc mới (đã có trong page.refactored.tsx):**

```
app/analyze/
├── page.tsx                    ← Entry point (< 50 dòng)
├── context/
│   └── AnalyzeContext.tsx      ← State management
├── hooks/
│   └── useAnalyzeHandlers.ts   ← Event handlers
└── components/
    └── steps/
        ├── UploadStep.tsx      ← Bước 1: Upload data
        ├── ProfileStep.tsx     ← Bước 2: Data profile
        ├── AnalyzeStep.tsx     ← Bước 3: Chọn phân tích
        └── ResultsStep.tsx     ← Bước 4: Kết quả
```

**Migration plan:**
1. Verify `page.refactored.tsx` hoạt động đúng (smoke test)
2. Rename `page.tsx` → `page.legacy.tsx`
3. Rename `page.refactored.tsx` → `page.tsx`
4. Test toàn bộ analyze flow
5. Xóa `page.legacy.tsx` sau 1 sprint

---

### 4.3 Unit Tests — Test Structure

```
__tests__/
├── lib/
│   ├── token-service.test.ts       ← Token balance invariants
│   ├── analysis-credit-wrapper.test.ts ← Credit deduction + refund
│   └── rate-limit.test.ts          ← Rate limiter correctness
├── utils/
│   ├── security.test.ts            ← sanitizeInput
│   └── csrf-protection.test.ts     ← validateOrigin
└── webr/
    └── analysis-correctness.test.ts ← R output validation với known values
```

**Test cho R correctness (không cần WebR — dùng reference values):**

```typescript
// __tests__/webr/analysis-correctness.test.ts
describe('Statistical Analysis Correctness', () => {
  // Known dataset: 5 items, n=10, expected alpha ≈ 0.85
  const KNOWN_DATASET = [
    [4, 3, 4, 5, 4],
    [3, 3, 3, 4, 3],
    // ... 10 rows
  ];
  
  it('P2: Pearson correlation is symmetric', () => {
    // Mock executeRWithRecovery to return known values
    // Verify corr(X,Y) == corr(Y,X)
  });
  
  it('P5: Token balance invariant', () => {
    // balance_after = balance_before + amount
    // balance >= 0 after deduction
  });
  
  it('P6: Rate limiter blocks after N requests', async () => {
    const limiter = rateLimit({ interval: 1000, uniqueTokenPerInterval: 100 });
    for (let i = 0; i < 5; i++) {
      const result = await limiter.check(5, 'test-ip');
      expect(result.success).toBe(true);
    }
    const blocked = await limiter.check(5, 'test-ip');
    expect(blocked.success).toBe(false);
  });
});
```

---

## 5. R Code — Thiết kế chi tiết

### 5.3 Standardized R Error Format

**R-side standard:**

```r
# Tất cả analysis modules wrap trong:
tryCatch({
  # ... analysis code ...
  list(
    success = TRUE,
    data = result_data
  )
}, error = function(e) {
  list(
    success = FALSE,
    error_code = "ANALYSIS_FAILED",
    error_message = e$message,
    error_type = class(e)[1]
  )
})
```

**TypeScript-side parsing:**

```typescript
// lib/webr/error-handler.ts
export function parseRResult(raw: any): { success: boolean; data?: any; error?: string } {
  if (!raw) return { success: false, error: 'Empty result from R' };
  
  // Check for R-side error format
  if (raw.success === false || raw.error_code) {
    const userMessage = translateRError(raw.error_message || '');
    return { success: false, error: userMessage };
  }
  
  // Legacy format (string starting with "ERROR:")
  if (typeof raw === 'string' && raw.startsWith('ERROR:')) {
    return { success: false, error: translateRError(raw.replace('ERROR:', '').trim()) };
  }
  
  return { success: true, data: raw.data || raw };
}
```

---

### 5.4 Execution Timeout — Standardization

**Timeout constants:**

```typescript
// lib/webr/constants.ts
export const WEBR_TIMEOUTS = {
  SIMPLE: 30_000,      // Descriptive stats, correlation
  STANDARD: 60_000,    // T-test, ANOVA, regression
  COMPLEX: 120_000,    // EFA, CFA, SEM, mediation
  INIT: 180_000,       // WebR initialization
} as const;
```

**Áp dụng nhất quán:**

```typescript
// Thay vì: executeRWithRecovery(rCode, 'efa', 0, 2, 120000, data)
// Dùng:    executeRWithRecovery(rCode, 'efa', 0, 2, WEBR_TIMEOUTS.COMPLEX, data)
```

---

### 5.5 Input Validation Layer

**Design:** Thêm validation function trước khi gọi R:

```typescript
// lib/webr/input-validator.ts
export interface ValidationResult {
  valid: boolean;
  cleanData: number[][];
  warnings: string[];
  rowsRemoved: number;
}

export function validateAndCleanData(
  data: (number | null | undefined)[][],
  options: { minRows?: number; minCols?: number } = {}
): ValidationResult {
  const warnings: string[] = [];
  let rowsRemoved = 0;
  
  // Remove rows with any NA/Inf/NaN
  const cleanData = data.filter(row => {
    const hasInvalid = row.some(v => 
      v === null || v === undefined || 
      (typeof v === 'number' && (isNaN(v) || !isFinite(v)))
    );
    if (hasInvalid) rowsRemoved++;
    return !hasInvalid;
  }) as number[][];
  
  if (rowsRemoved > 0) {
    warnings.push(`Đã loại ${rowsRemoved} hàng có giá trị trống hoặc không hợp lệ.`);
  }
  
  const minRows = options.minRows || 10;
  if (cleanData.length < minRows) {
    return {
      valid: false,
      cleanData: [],
      warnings,
      rowsRemoved
    };
  }
  
  return { valid: true, cleanData, warnings, rowsRemoved };
}
```

---

## Database Migrations cần tạo

| File | Mục đích |
|------|----------|
| `20260417000000_fix_knowledge_rls.sql` | Fix hardcoded admin email trong RLS |
| `20260417000001_fix_feedback_rls.sql` | Require auth.uid() cho feedback insert |
| `20260417000002_deploy_deduct_credits_rpc.sql` | Deploy atomic credit deduction RPC |

---

## Files cần tạo mới

| File | Mục đích |
|------|----------|
| `utils/key-encryption.ts` | AES encrypt/decrypt cho Gemini API key |
| `utils/logger.ts` | Structured logger thay thế console.log |
| `lib/webr/constants.ts` | Timeout constants cho WebR |
| `lib/webr/input-validator.ts` | Data validation trước khi gọi R |
| `lib/webr/error-handler.ts` | Standardized R error parsing |
| `lib/monitoring.ts` | Sentry wrapper functions |
| `types/database.types.ts` | Generated Supabase types |
| `components/WebRLoadingProgress.tsx` | Progress indicator component |
| `public/sample-data/cronbach-sample.csv` | Sample dataset cho onboarding |
| `sentry.client.config.ts` | Sentry client config |
| `sentry.server.config.ts` | Sentry server config |
| `__tests__/lib/token-service.test.ts` | Token service unit tests |
| `__tests__/lib/rate-limit.test.ts` | Rate limiter tests |
| `__tests__/webr/analysis-correctness.test.ts` | R analysis correctness tests |

---

## Files cần sửa

| File | Thay đổi |
|------|----------|
| `next.config.js` | Thêm CSP header |
| `app/api/ai-explain/route.ts` | Dùng server-side key, bỏ x-gemini-api-key header |
| `app/api/ai-suggest/route.ts` | Dùng server-side key, bỏ x-gemini-api-key header |
| `app/api/feedback/route.ts` | Thêm validateOrigin, static import, rate limit |
| `app/api/unlock-researcher/route.ts` | Thêm validateOrigin |
| `utils/supabase/client.ts` | Thêm Database generic type |
| `utils/supabase/server.ts` | Xóa unused `host` variable |
| `utils/csrf-protection.ts` | Thêm `validateOrigin()` function |
| `middleware.ts` | Xóa unused `isPublicRoute`, dùng logger |
| `app/page.tsx` | Thay `select('*')` bằng specific fields |
| `app/analyze/page.tsx` | Replace với page.refactored.tsx |
| `lib/webr/core.ts` | Dùng logger, thêm WEBR_TIMEOUTS |
| `lib/webr/utils.ts` | Mở rộng translateRError → translateRErrorDetailed |
| `lib/webr/analyses/*.ts` | Dùng WEBR_TIMEOUTS, validateAndCleanData, standardized error format |
| `.github/workflows/verify-build.yml` | Thêm npm test step |
| `.github/workflows/auto-sync.yml` | Thay --force bằng --force-with-lease |

---

## Thứ tự triển khai (Implementation Order)

### Sprint 1 — Must Have (Bảo mật + UX critical)
1. Fix hardcoded admin email (migration SQL)
2. Gemini API key → server-side proxy
3. Token atomic deduction (deploy RPC + audit usages)
4. WebR Loading Progress component
5. Error message system (translateRErrorDetailed)
6. R analysis correctness tests (known values)

### Sprint 2 — Should Have (Bảo mật + Vận hành)
7. CSP header
8. CSRF/Origin validation
9. Rate limiting đầy đủ
10. Feedback RLS fix
11. Supabase TypeScript types
12. Structured logger + console.log cleanup
13. CI/CD test step
14. Sentry integration

### Sprint 3 — Should Have (Code Quality + R)
15. Refactor page.tsx (apply page.refactored.tsx)
16. Fix any types
17. Unit tests (token service, credit wrapper, rate limiter)
18. R error handling standardization
19. R timeout constants
20. R input validation layer
21. WebR cache strategy improvement

### Sprint 4 — Nice to Have
22. Onboarding flow
23. Mobile responsiveness audit
24. Accessibility improvements
25. Auto-sync --force-with-lease
26. Dynamic import cleanup
27. Unused variables cleanup
