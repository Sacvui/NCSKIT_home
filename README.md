# ncsStat: Nền tảng Phân tích Thống kê Trực tuyến

**"Democratizing Data Science for Vietnamese Researchers"**

🔗 **Live App:** [https://stat.ncskit.org](https://stat.ncskit.org)

📄 **Version:** 2.1.0 (2026-03-01)

---

## 📄 Giới Thiệu

**ncsStat** là nền tảng phân tích thống kê mã nguồn mở, chạy trực tiếp trên trình duyệt web, được thiết kế đặc biệt cho Nghiên cứu sinh và Giảng viên tại Việt Nam.

### Điểm nổi bật:
- 🔒 **Bảo mật tuyệt đối:** Dữ liệu xử lý 100% client-side, không upload lên server
- ⚡ **Tốc độ cao:** WebAssembly R runtime, không độ trễ mạng
- 💸 **Miễn phí hoàn toàn:** Thay thế SPSS/AMOS đắt đỏ
- 🧠 **AI hỗ trợ:** Gemini AI tự động giải thích kết quả bằng tiếng Việt
- 🌐 **Đa ngôn ngữ:** Hỗ trợ Tiếng Việt và English

---

## 🚀 Tính Năng Chính

### 1. Phân Tích Đa Dạng (18 phương pháp)

| Nhóm | Phương pháp | Chi tiết |
|------|-------------|----------|
| **Độ tin cậy** | Cronbach's Alpha + **McDonald's Omega** | Item-total stats, Alpha/Omega if deleted |
| **Tương quan** | Pearson, Spearman, Kendall | Ma trận r + p-values |
| **So sánh nhóm** | T-test (độc lập, ghép cặp) | Shapiro-Wilk, Levene's, Cohen's d |
| **ANOVA** | One-Way ANOVA (**Auto Welch**) | Tukey HSD, Eta², auto-switch |
| **Khám phá** | EFA (**Parallel Analysis**) | KMO, Bartlett, Varimax/Oblimin |
| **Khẳng định** | CFA | CFI, TLI, RMSEA, SRMR |
| **Mô hình** | SEM | Structural paths, Fit indices |
| **Hồi quy** | Linear Regression | VIF, R², **Standardized β** |
| **Hồi quy nhị phân** | **Logistic Regression** | Odds Ratio, Pseudo R², Confusion Matrix |
| **Phi tham số** | Mann-Whitney U, **Kruskal-Wallis** | Effect size (ε², r) |
| **Phi tham số cặp** | **Wilcoxon Signed-Rank** | Median diff, Effect r |
| **Phân loại** | Chi-Square + **Fisher's Exact** | Cramér's V, Warning < 5 |
| **Trung gian** | **Mediation Analysis** | Sobel test, Bootstrap CI 95% |
| **Mô tả** | Descriptive Stats | Mean, SD, Skew, Kurtosis, SE |

### 2. Kiểm định Giả định Tự động ✅

- **Shapiro-Wilk:** Phân phối chuẩn
- **Levene's Test:** Đồng nhất phương sai → **Auto Welch ANOVA**
- **Fisher's Exact:** Tự động cho bảng 2x2 nhỏ
- **Warning:** Cảnh báo khi expected < 5

### 3. Workflow Mode (Trợ lý thông minh) 🎯

- Cronbach's Alpha → EFA (khi α ≥ 0.7)
- EFA → CFA (khi cấu trúc rõ ràng)
- CFA → SEM (khi fit tốt)

### 4. AI Interpretation 🤖

- Tự động viết nhận xét học thuật
- Giải thích CFI, RMSEA, p-value cho người không chuyên
- Ngôn ngữ chuẩn paper

---

## 🛠️ Công Nghệ

| Layer | Stack |
|-------|-------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Lucide Icons |
| **R Engine** | WebR 0.5 (WebAssembly R) |
| **R Packages** | `psych`, `GPArotation`, `lavaan` |
| **AI** | Google Gemini 2.0 Flash |
| **Auth** | Supabase Auth (Google, ORCID, LinkedIn) |
| **Database** | Supabase PostgreSQL |
| **Hosting** | Vercel Edge Network |

---

## 📚 Hướng Dẫn Trích Dẫn (Citation)

### Trong phần Phương pháp:
> "Dữ liệu được phân tích bằng ngôn ngữ R (R Core Team, 2024) thông qua nền tảng **ncsStat** (Le, 2026). Các phân tích độ tin cậy và nhân tố sử dụng package `psych` (Revelle, 2024)."

### Trong Danh mục Tài liệu tham khảo:

**APA Format:**
> Le, P. H. (2026). *ncsStat: A Web-Based Statistical Analysis Platform for Vietnamese Researchers*. https://stat.ncskit.org

**Tiếng Việt:**
> Lê Phúc Hải (2026). *ncsStat: Nền tảng phân tích thống kê trực tuyến cho nghiên cứu sinh Việt Nam*. https://stat.ncskit.org

---

## 📦 Cài Đặt Local

```bash
# 1. Clone repo
git clone https://github.com/hailp1/ncsStat2.git
cd ncsStat2

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your Supabase URL, anon key, and optional Gemini API key

# 4. Run dev server
npm run dev
```

Truy cập `http://localhost:3000`

---

## 📂 Cấu trúc Project

```
ncsStat/
├── app/                    # Next.js App Router
│   ├── analyze/            # Trang phân tích chính (Basic)
│   ├── analyze2/           # Trang phân tích PLS-SEM
│   ├── api/                # API Routes (auth, feedback, AI)
│   ├── admin/              # Admin panel
│   ├── login/              # Đăng nhập OAuth
│   └── profile/            # Hồ sơ người dùng
├── components/             # React Components
│   ├── analyze/            # Analysis workflow components
│   ├── results/            # Result display (9 categories)
│   ├── ui/                 # Shared UI primitives
│   └── layout/             # Header, Footer
├── lib/
│   ├── webr/               # WebR engine & analysis modules
│   │   ├── core.ts         # WebR singleton, init, retry logic
│   │   └── analyses/       # 8 analysis modules (hypothesis, reliability, etc.)
│   ├── i18n.ts             # Internationalization (vi/en)
│   ├── interpretation-templates.ts  # ASIG template system
│   └── pdf-exporter.ts     # PDF export
├── hooks/                  # Custom React hooks
├── context/                # Auth & Language providers
├── types/                  # TypeScript type definitions
├── utils/supabase/         # Supabase client & migrations
├── scripts/                # Dev utilities (copy-webr, check-env, etc.)
└── supabase/migrations/    # Database migration files
```

---

## 🗄️ Database Setup

Dự án dùng Supabase PostgreSQL. Migrations nằm trong `supabase/migrations/` và được áp dụng theo thứ tự:

```bash
# Áp dụng migrations qua Supabase CLI
supabase db push

# Hoặc chạy thủ công từng file trong Supabase SQL Editor:
# supabase/migrations/20260124_performance_indexes.sql
# supabase/migrations/20260128000000_add_feedback_table.sql
# supabase/migrations/20260329000000_update_profile_and_rls.sql
# supabase/migrations/20260331035048_create_knowledge_base_table.sql
```

Sau khi setup, promote user lên admin:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## 🚀 Deployment (Vercel)

1. Push code lên GitHub
2. Import project vào [Vercel](https://vercel.com)
3. Thêm Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY` *(tùy chọn — nếu set, tất cả users dùng chung key này, không cần nhập key cá nhân)*
   - `NEXT_PUBLIC_KEY_SALT` *(tùy chọn — salt để mã hóa personal key trong localStorage)*
4. Cấu hình Supabase Auth → URL Configuration → thêm Vercel domain vào Redirect URLs
5. Deploy

> **Bảo mật AI Key:** Nếu `GEMINI_API_KEY` được set trên server, key không bao giờ xuất hiện trong browser. Nếu user dùng personal key, key được mã hóa AES-256 trước khi lưu localStorage và truyền qua network.

---

## 🛠️ Scripts hữu ích

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run type-check   # TypeScript check
npm run verify-build # Full check (type + lint + build)
npm run clean        # Xóa .next cache
```

---

## 📝 License

MIT License © 2026 Le Phuc Hai

---

## 🙏 Acknowledgments

- **WebR Project:** https://docs.r-wasm.org/
- **psych R Package:** William Revelle
- **Next.js:** Vercel Team
- **Supabase:** Open source Firebase alternative
