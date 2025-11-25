# 🚀 Deploy lên Vercel - Hướng dẫn chi tiết

Hướng dẫn deploy NCSKIT website lên Vercel với authentication system.

## 📋 Yêu cầu trước khi deploy

1. **Tài khoản Vercel** - Đăng ký tại [vercel.com](https://vercel.com)
2. **Vercel Postgres Database** - Tạo database trong Vercel Dashboard
3. **Git Repository** - Code đã được push lên GitHub/GitLab/Bitbucket

## 🔧 Bước 1: Chuẩn bị Database

### 1.1. Tạo Vercel Postgres Database

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Vào **Storage** > **Create Database** > **Postgres**
3. Đặt tên database (ví dụ: `ncskit-db`)
4. Chọn region gần nhất
5. Click **Create**

### 1.2. Lấy Connection String

1. Vào database vừa tạo
2. Tab **Settings** > **Connection String**
3. Copy connection string (dạng: `postgresql://user:pass@host:port/db?sslmode=require`)

### 1.3. Run Migration

**Option 1: Sử dụng Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project (chọn database khi được hỏi)
vercel link

# Set environment variable locally
vercel env add POSTGRES_URL

# Run migration
npm run migrate
```

**Option 2: Sử dụng SQL Editor trong Vercel Dashboard**

1. Vào database > **SQL Editor**
2. Copy và chạy SQL sau:

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
```

## 🌐 Bước 2: Deploy qua Vercel Dashboard

### 2.1. Import Project

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** > **Project**
3. Import từ GitHub/GitLab/Bitbucket
4. Chọn repository của bạn
5. Click **Import**

### 2.2. Configure Project

**Framework Preset:** Next.js (auto-detected)

**Build Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

### 2.3. Environment Variables

Thêm các biến môi trường sau:

| Variable | Value | Description |
|----------|-------|-------------|
| `POSTGRES_URL` | `postgresql://...` | Connection string từ Vercel Postgres |
| `NEXTAUTH_SECRET` | `your-secret-key` | Secret key cho NextAuth (generate: `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | URL của production site |

**Lưu ý:**
- `POSTGRES_URL` sẽ tự động được thêm khi bạn link database
- `NEXTAUTH_SECRET` nên là unique và random
- `NEXTAUTH_URL` sẽ được set tự động sau khi deploy

**Cách thêm:**
1. Trong **Environment Variables** section
2. Click **Add** cho mỗi variable
3. Chọn environment (Production, Preview, Development)
4. Paste value
5. Click **Save**

### 2.4. Deploy

1. Click **Deploy**
2. Chờ build hoàn tất (thường 2-5 phút)
3. Visit URL được cung cấp (ví dụ: `https://ncskit.vercel.app`)

## 🛠 Bước 3: Deploy qua Vercel CLI

### 3.1. Install & Login

```bash
npm i -g vercel
vercel login
```

### 3.2. Link Project

```bash
# Trong thư mục project
vercel link

# Chọn:
# - Set up and deploy? Yes
# - Which scope? (chọn account của bạn)
# - Link to existing project? No (hoặc Yes nếu đã có)
# - Project name? ncskit-site (hoặc tên khác)
# - Directory? ./ (current directory)
```

### 3.3. Set Environment Variables

```bash
# Production
vercel env add POSTGRES_URL production
# Paste connection string khi được hỏi

vercel env add NEXTAUTH_SECRET production
# Paste secret key khi được hỏi

# Preview & Development (optional)
vercel env add POSTGRES_URL preview
vercel env add NEXTAUTH_SECRET preview
vercel env add POSTGRES_URL development
vercel env add NEXTAUTH_SECRET development
```

### 3.4. Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 3.5. Run Migration

Sau khi deploy, run migration:

```bash
# Link database first
vercel link

# Run migration (sẽ sử dụng production env vars)
npm run migrate
```

## 🔄 Bước 4: Post-Deployment

### 4.1. Update NEXTAUTH_URL

Sau khi deploy xong, update `NEXTAUTH_URL` trong Vercel Dashboard:

1. Vào **Settings** > **Environment Variables**
2. Tìm `NEXTAUTH_URL`
3. Update value thành production URL (ví dụ: `https://ncskit.vercel.app`)
4. Redeploy project

### 4.2. Run Migration (nếu chưa chạy)

Nếu chưa chạy migration trong Bước 1, có thể chạy qua Vercel CLI:

```bash
# Set local env vars từ Vercel
vercel env pull .env.local

# Run migration
npm run migrate
```

Hoặc chạy migration script qua Vercel Functions.

### 4.3. Test Authentication

1. Visit: `https://your-domain.vercel.app/login`
2. Test đăng ký tài khoản mới
3. Test đăng nhập
4. Test profile và dashboard

## 🔐 Bước 5: Custom Domain (Optional)

### 5.1. Add Custom Domain

1. Vào **Settings** > **Domains**
2. Click **Add Domain**
3. Nhập domain của bạn (ví dụ: `ncskit.com`)
4. Follow instructions để configure DNS

### 5.2. Update NEXTAUTH_URL

Sau khi domain đã active:

1. Update `NEXTAUTH_URL` = `https://ncskit.com`
2. Redeploy project

## 🐛 Troubleshooting

### Build Failed

**Error: Missing environment variables**
- Kiểm tra tất cả env vars đã được set trong Vercel Dashboard
- Đảm bảo chọn đúng environment (Production/Preview/Development)

**Error: Database connection failed**
- Kiểm tra `POSTGRES_URL` đúng format
- Đảm bảo database đã được tạo và active
- Kiểm tra region của database

### Migration Failed

**Error: Table already exists**
- Đây không phải lỗi, table đã tồn tại rồi
- Có thể bỏ qua hoặc check table structure

**Error: Permission denied**
- Đảm bảo connection string có đủ quyền
- Check database settings trong Vercel

### Authentication Not Working

**Error: NEXTAUTH_URL mismatch**
- Kiểm tra `NEXTAUTH_URL` đúng với production domain
- Redeploy sau khi update env vars

**Error: Invalid credentials**
- Check database đã có users table
- Check password hashing đúng
- Test với fallback accounts (demo@ncskit.org / demo123)

## 📝 Environment Variables Summary

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `POSTGRES_URL` | ✅ Yes | `postgresql://...` | Vercel Postgres connection |
| `NEXTAUTH_SECRET` | ✅ Yes | `abc123...` | NextAuth secret key |
| `NEXTAUTH_URL` | ✅ Yes | `https://ncskit.vercel.app` | Production URL |

## 🎯 Checklist

- [ ] Vercel Postgres database created
- [ ] Database migration run successfully
- [ ] Environment variables set in Vercel
- [ ] Project deployed to Vercel
- [ ] `NEXTAUTH_URL` updated to production URL
- [ ] Authentication tested on production
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)

## 🚀 Next Steps

Sau khi deploy thành công:

1. Test đầy đủ các tính năng authentication
2. Monitor logs trong Vercel Dashboard
3. Setup monitoring và alerts (optional)
4. Configure custom domain (optional)
5. Enable analytics (optional)

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [NextAuth.js](https://next-auth.js.org)

---

**Status:** ✅ Ready for Production
**Last Updated:** 2025-01-15

