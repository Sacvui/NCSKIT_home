---
inclusion: manual
---

# Session Notes — ncsStat

Ghi chú những thay đổi đã thực hiện trong dự án.

---

## 1. Phân tích & Đánh giá dự án (Audit)

Đã quét toàn bộ codebase và đưa ra đánh giá chi tiết về:

- **Mô tả dự án:** ncsStat là nền tảng phân tích thống kê trực tuyến (Next.js 16 + React 19 + WebR WASM) dành cho nghiên cứu sinh Việt Nam. 18 phương pháp thống kê, AI interpretation (Gemini), hệ thống token NCS, thư viện 500+ thang đo.
- **Hiệu năng (7/10):** WebR singleton tốt, lazy loading, IDBFS caching. Vấn đề: `page.tsx` 1258 dòng monolith, auto-save debounce bug, Supabase client dùng `any` type.
- **Bảo mật (7/10):** Zero-knowledge architecture xuất sắc, security headers đầy đủ. Vấn đề: Gemini API key truyền qua HTTP header từ client, thiếu CSP/CSRF.
- **Logic (7.5/10):** Workflow mode thông minh. Vấn đề: credit deduction không atomic, logic phân tán.
- **UX (7/10):** Flow rõ ràng, bilingual. Vấn đề: WebR loading UX kém, survey popup disruptive.

---

## 2. Fix lỗi WebR — FileReaderSync/Blob crash

**Vấn đề:** Khi chạy phân tích, WebR worker crash với lỗi:
```
Failed to execute 'readAsArrayBuffer' on 'FileReaderSync': parameter 1 is not of type 'Blob'
```
Sau đó engine tự reset và báo lỗi "Hệ thống R đang bận".

**Nguyên nhân:** Các analysis modules dùng `arrayToRMatrix(data)` nhúng data trực tiếp vào R code string. Khi string quá dài, WebR worker với `channelType: 3` (PostMessage) cố đọc nó qua `FileReaderSync` như Blob → crash.

**Fix:** Thay `arrayToRMatrix(data)` inline bằng `raw_data` placeholder trong R code, truyền data qua `csvData` param của `executeRWithRecovery()` — cơ chế đã có sẵn trong `core.ts` dùng `webR.objs.globalEnv.bind()`.

**Files đã sửa:**
- `lib/webr/analyses/hypothesis.ts` — `runCorrelation`: dùng `csvData` param
- `lib/webr/analyses/regression.ts` — `runLinearRegression`, `runLogisticRegression`: dùng `csvData` param
- `lib/webr/analyses/descriptive.ts` — `runDescriptiveStats`: dùng `csvData` param
- `lib/webr/analyses/multivariate.ts` — `runClusterAnalysis`: dùng `csvData` param
- `lib/webr/analyses/mediation.ts` — `runMediationAnalysis`, `runModerationAnalysis`: dùng `csvData` param
- `lib/webr/utils.ts` — thêm `RAW_DATA_PLACEHOLDER` và `useRawDataInCode()` helper, cập nhật JSDoc cho `arrayToRMatrix`

---

## 3. Fix lỗi Avatar bị chặn bởi COEP

**Vấn đề:** Avatar Google bị chặn với lỗi:
```
ERR_BLOCKED_BY_RESPONSE.NotSameOriginAfterDefaultedToSameOriginByCoep
```

**Nguyên nhân:** Header `Cross-Origin-Embedder-Policy: credentialless` (bắt buộc cho WebR WASM) chặn ảnh cross-origin từ `lh3.googleusercontent.com` không có `Cross-Origin-Resource-Policy` header.

**Fix:**
- `utils/avatarHelper.ts` — thêm hàm `proxyAvatarUrl()` tự động redirect URL từ các OAuth domain (Google, GitHub...) qua `/api/avatar-proxy`
- `app/api/avatar-proxy/route.ts` — tạo API route proxy ảnh với:
  - Domain allowlist chống SSRF (`lh3.googleusercontent.com`, `avatars.githubusercontent.com`, v.v.)
  - Chỉ cho phép HTTPS và content-type `image/*`
  - Header `Cross-Origin-Resource-Policy: cross-origin`
  - Cache 24h browser / 1h CDN

---

## 4. Dọn dẹp & Chuẩn hóa tài liệu

**Đã xóa 60+ files và 5 folders:**

| Nhóm | Chi tiết |
|---|---|
| 9 file `.md` hướng dẫn cũ | DEPLOYMENT_CHECKLIST, GAP_ANALYSIS_ROADMAP, GIT_COMMIT_GUIDE, HUONG_DAN_VERCEL, DATABASE_SETUP_GUIDE, QUICKSTART, VERCEL_DEPLOYMENT_GUIDE, PROJECT_CLEANUP, USER_GUIDE_ANALYSIS |
| 8 file `.sql` root level | migration_schema, DATABASE_SETUP_COMPLETE, setup_rls_policies, fix_500_recursion, security_patch_20260414, add_expert_articles, import_part1-4, import_knowledge_data |
| `dbbackup/` (6 files) | Toàn bộ SQL backup đã apply vào DB |
| `seeders_knowledge/` (23 files) | Toàn bộ SQL seeder đã apply vào DB |
| `docs/` (3 files) | Testing guide, Google Sheets setup, Auto-save guide |
| `paper/` (2 files) | Publication brief, R code reference |
| `scratch/` | Folder rỗng |
| `scripts/` seeder (9 files) | auto_seed_db, seed_db (cjs+js), setup_cms_db, seed_knowledge_cms, generate_sample_data (js+mjs), test_webr_lavaan |
| Temp files (4 files) | tsc_output.txt, tsc_output_2.txt, check-r-repo.cjs, generate_sample.cjs |
| `supabase/seed_scales_2026.sql` | Seeder đã apply |

**Đã chuẩn hóa:**
- `env.example` → `.env.example` (tên chuẩn theo convention)
- `.gitignore` → thêm `!.env.example` để file template được commit vào git
- `README.md` → thêm phần **Database Setup**, **Deployment (Vercel)**, **Scripts hữu ích** thay thế các guide đã xóa

**Giữ lại (không xóa):**
- `README.md`, `LEGAL_DISCLAIMER.md` — tài liệu chính thức
- `supabase/migrations/` — 4 migration files cần thiết cho DB history
- `scripts/` — 9 scripts còn hữu ích: `copy-webr.js` (postinstall), `check-env.js`, `clean-project.ps1`, `download_r_packages.mjs`, `generate_official_test_data.cjs`, `generate_sample_sem.js`, `check-supabase-config.js`, `fix-supabase-config.js`, `patch-packages.ps1`

---

## Tóm tắt files đã tạo mới

| File | Mục đích |
|---|---|
| `app/api/avatar-proxy/route.ts` | Proxy ảnh avatar qua server để bypass COEP |
| `.env.example` | Template biến môi trường (đổi tên từ `env.example`) |

## Tóm tắt files đã sửa

| File | Thay đổi |
|---|---|
| `utils/avatarHelper.ts` | Thêm `proxyAvatarUrl()` cho COEP fix |
| `lib/webr/utils.ts` | Thêm `RAW_DATA_PLACEHOLDER`, `useRawDataInCode()` |
| `lib/webr/analyses/hypothesis.ts` | `runCorrelation` dùng `csvData` param |
| `lib/webr/analyses/regression.ts` | `runLinearRegression`, `runLogisticRegression` dùng `csvData` param |
| `lib/webr/analyses/descriptive.ts` | `runDescriptiveStats` dùng `csvData` param |
| `lib/webr/analyses/multivariate.ts` | `runClusterAnalysis` dùng `csvData` param |
| `lib/webr/analyses/mediation.ts` | `runMediationAnalysis`, `runModerationAnalysis` dùng `csvData` param |
| `.gitignore` | Thêm `!.env.example` |
| `README.md` | Thêm phần DB Setup, Deployment, Scripts |
