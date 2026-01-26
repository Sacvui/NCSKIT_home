# 🚀 Hướng Dẫn Cấu Hình Vercel - ncsStat2

## Bước 1: Chuẩn Bị Thông Tin Supabase

Bạn đã có Supabase project rồi. Cần lấy thêm **service_role key**:

1. Vào: https://supabase.com/dashboard/project/qshimpxmirkyfenhklfh/settings/api
2. Tìm phần **Project API keys**
3. Copy key có nhãn **service_role** (có icon 🔒)

---

## Bước 2: Thêm Environment Variables vào Vercel

### Cách 1: Qua Vercel Dashboard (Khuyên dùng)

1. Vào: https://vercel.com/dashboard
2. Chọn project của bạn
3. Vào: **Settings** → **Environment Variables**
4. Thêm 4 biến sau:

```bash
# Biến 1: URL Supabase
NEXT_PUBLIC_SUPABASE_URL
Giá trị: https://qshimpxmirkyfenhklfh.supabase.co
Môi trường: ✓ Production ✓ Preview ✓ Development

# Biến 2: Anon Key
NEXT_PUBLIC_SUPABASE_ANON_KEY
Giá trị: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaGltcHhtaXJreWZlbmhrbGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNjY3NDgsImV4cCI6MjA4NDc0Mjc0OH0.HuI-xYfHgw0m757SQUqvxIEiScy0tH4BR7L3TTCPQR0
Môi trường: ✓ Production ✓ Preview ✓ Development

# Biến 3: Service Role Key (lấy từ Bước 1)
SUPABASE_SERVICE_ROLE_KEY
Giá trị: [DÁN KEY TỪ BƯỚC 1 VÀO ĐÂY]
Môi trường: ✓ Production ✓ Preview ✓ Development

# Biến 4: URL Website
NEXT_PUBLIC_SITE_URL
Giá trị: https://[tên-project-của-bạn].vercel.app
Môi trường: ✓ Production ✓ Preview ✓ Development
```

5. Nhấn **Save** sau mỗi biến

### Cách 2: Qua Vercel CLI

```bash
# Cài Vercel CLI
npm i -g vercel

# Đăng nhập
vercel login

# Link project
cd ncsStat2
vercel link

# Thêm từng biến
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL
```

---

## Bước 3: Deploy lại

Sau khi thêm biến môi trường, **BẮT BUỘC** phải deploy lại:

### Cách 1: Qua Vercel Dashboard
1. Vào tab **Deployments**
2. Nhấn **...** ở deployment mới nhất
3. Chọn **Redeploy**

### Cách 2: Push Git
```bash
git add .
git commit -m "Update environment variables"
git push origin main
```

### Cách 3: Qua CLI
```bash
vercel --prod
```

---

## Bước 4: Cấu Hình Supabase Auth

1. Vào: https://supabase.com/dashboard/project/qshimpxmirkyfenhklfh/auth/url-configuration

2. Thiết lập **Site URL**:
   ```
   https://[tên-project-của-bạn].vercel.app
   ```

3. Thêm **Redirect URLs**:
   ```
   https://[tên-project-của-bạn].vercel.app/auth/callback
   https://[tên-project-của-bạn].vercel.app/auth/orcid/callback
   https://[tên-project-của-bạn].vercel.app/**
   ```

4. Nhấn **Save**

---

## Bước 5: Cấu Hình Google OAuth (Nếu dùng)

### Trong Supabase:
1. Vào: https://supabase.com/dashboard/project/qshimpxmirkyfenhklfh/auth/providers
2. Bật **Google** provider
3. Nhập Google OAuth credentials

### Trong Google Cloud Console:
1. Vào: https://console.cloud.google.com/apis/credentials
2. Chọn OAuth 2.0 Client ID của bạn
3. Thêm **Authorized redirect URIs**:
   ```
   https://qshimpxmirkyfenhklfh.supabase.co/auth/v1/callback
   ```
4. Nhấn **Save**

---

## ✅ Kiểm Tra

Sau khi deploy xong:

1. Mở website: `https://[tên-project-của-bạn].vercel.app`
2. Nhấn **Login with Google**
3. Kiểm tra URL redirect - phải là:
   ```
   https://qshimpxmirkyfenhklfh.supabase.co/auth/v1/authorize...
   ```
4. ✅ KHÔNG được là `placeholder.supabase.co`

---

## 🐛 Xử Lý Lỗi

### Vẫn thấy "placeholder.supabase.co"?
- Kiểm tra biến môi trường đã thêm vào **Production** chưa
- Deploy lại (không chỉ rebuild)
- Xóa cache trình duyệt

### Lỗi "Invalid API key"?
- Kiểm tra lại key có đầy đủ không (rất dài)
- Không có khoảng trắng thừa
- Đúng project Supabase

### Lỗi CORS?
- Kiểm tra Site URL trong Supabase khớp với Vercel URL
- Đảm bảo có thêm `/auth/callback` vào redirect URLs

---

## 📋 Checklist Hoàn Thành

- [ ] Lấy service_role key từ Supabase
- [ ] Thêm 4 biến môi trường vào Vercel
- [ ] Chọn tất cả môi trường (Production, Preview, Development)
- [ ] Deploy lại ứng dụng
- [ ] Cấu hình Site URL trong Supabase
- [ ] Thêm Redirect URLs trong Supabase
- [ ] Cấu hình Google OAuth (nếu dùng)
- [ ] Test đăng nhập thành công

---

## 🔐 Biến Môi Trường Tùy Chọn

Nếu dùng thêm các tính năng khác:

```bash
# AI Features (Gemini)
GEMINI_API_KEY=your_gemini_api_key

# ORCID OAuth
ORCID_CLIENT_ID=your-orcid-client-id
ORCID_CLIENT_SECRET=your-orcid-client-secret
```

---

**Cập nhật:** 26/01/2026  
**Project:** ncsStat2  
**Supabase:** qshimpxmirkyfenhklfh
