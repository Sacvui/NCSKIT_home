# 🚀 Quick Start - Authentication Setup

Hướng dẫn nhanh để setup hệ thống authentication.

## 📋 Bước 1: Environment Variables

Tạo file `.env.local` trong thư mục root với nội dung:

```env
# Vercel Postgres Database
# Lấy từ: Vercel Dashboard > Storage > Postgres > Connection String
POSTGRES_URL=postgresql://user:password@host:port/database?sslmode=require

# NextAuth Configuration
# Tạo secret key: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:9090
```

**Lưu ý:**
- `POSTGRES_URL`: Copy từ Vercel Dashboard
- `NEXTAUTH_SECRET`: Chạy `openssl rand -base64 32` để tạo secret key

## 📦 Bước 2: Install Dependencies

```bash
npm install
```

## 🗄️ Bước 3: Run Database Migration

```bash
npm run migrate
```

Script này sẽ:
- ✅ Kết nối với Vercel Postgres
- ✅ Tạo bảng `users` nếu chưa có
- ✅ Tạo indexes cho performance

## ▶️ Bước 4: Start Development Server

```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:9090

## ✅ Bước 5: Test Authentication

1. Mở trình duyệt: http://localhost:9090/login
2. Click **Sign Up** để tạo tài khoản mới
3. Hoặc dùng tài khoản demo:
   - Email: `demo@ncskit.org` / Password: `demo123`
   - Username: `hailp` / Password: `123456`

## 🎯 Các Trang Chính

- `/login` - Đăng nhập/Đăng ký
- `/profile` - Quản lý profile (cần đăng nhập)
- `/dashboard` - Dashboard cá nhân (cần đăng nhập)

## 🔧 Troubleshooting

### Database Connection Error
- Kiểm tra `POSTGRES_URL` trong `.env.local`
- Đảm bảo database đã được tạo trên Vercel
- Kiểm tra network connection

### Migration Failed
- Kiểm tra database connection string
- Đảm bảo có quyền CREATE TABLE
- Xem log chi tiết: `npm run migrate`

### NextAuth Session Issues
- Kiểm tra `NEXTAUTH_SECRET` và `NEXTAUTH_URL`
- Xóa cookies và thử lại
- Kiểm tra console logs

## 📚 Xem Thêm

- [AUTH_SETUP.md](./docs/AUTH_SETUP.md) - Hướng dẫn chi tiết
- [AUTH_FEATURES.md](./docs/AUTH_FEATURES.md) - Danh sách tính năng

