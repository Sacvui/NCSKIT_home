# 🔐 Authentication System Setup Guide

Hướng dẫn thiết lập hệ thống đăng nhập và quản lý tài khoản với Vercel Postgres.

## 📋 Tổng quan

Hệ thống authentication được xây dựng với:
- **NextAuth.js** - Authentication framework
- **Vercel Postgres** - Database
- **Drizzle ORM** - Database ORM
- **bcryptjs** - Password hashing

## 🗄️ Database Schema

Bảng `users` có các trường:
- `id` (SERIAL PRIMARY KEY)
- `name` (TEXT NOT NULL)
- `email` (TEXT NOT NULL UNIQUE)
- `password` (TEXT NOT NULL) - Hashed với bcrypt
- `role` (TEXT DEFAULT 'user') - 'user' hoặc 'admin'
- `created_at` (TIMESTAMP DEFAULT NOW())
- `updated_at` (TIMESTAMP DEFAULT NOW())
- `is_active` (BOOLEAN DEFAULT true)

## 🚀 Cài đặt

### 1. Environment Variables

Tạo file `.env.local` với các biến sau:

```env
# Vercel Postgres
POSTGRES_URL=postgresql://user:password@host:port/database?sslmode=require

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:9090
```

**Lưu ý:**
- `POSTGRES_URL`: Lấy từ Vercel Dashboard > Storage > Postgres > Connection String
- `NEXTAUTH_SECRET`: Tạo secret key bằng: `openssl rand -base64 32`

### 2. Cài đặt Dependencies

```bash
npm install
```

### 3. Tạo Database Table

Chạy migration script để tạo bảng `users`:

```bash
npm run migrate
```

Hoặc sử dụng Drizzle Kit:

```bash
npm run db:push
```

## 📁 Cấu trúc Files

```
app/
├── api/
│   └── auth/
│       ├── [...nextauth]/
│       │   └── route.ts          # NextAuth config
│       ├── register/
│       │   └── route.ts          # API đăng ký
│       └── profile/
│           └── route.ts          # API quản lý profile
├── login/
│   └── page.tsx                  # Trang đăng nhập/đăng ký
lib/
└── db/
    ├── index.ts                  # Database connection
    └── schema.ts                 # Database schema
scripts/
└── migrate.ts                    # Migration script
```

## 🔑 API Endpoints

### POST `/api/auth/register`
Đăng ký tài khoản mới.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

### GET `/api/auth/profile`
Lấy thông tin profile của user hiện tại.

**Headers:**
- Session cookie (tự động từ NextAuth)

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z",
  "isActive": true
}
```

### PUT `/api/auth/profile`
Cập nhật thông tin profile.

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "newemail@example.com",
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

## 🔐 NextAuth Configuration

NextAuth được cấu hình để:
- Sử dụng Credentials Provider
- Tích hợp với Vercel Postgres
- Hỗ trợ fallback accounts (Root Admin, Demo User)
- Session management với JWT

### Fallback Accounts

- **Root Admin**: `hailp` / `123456`
- **Demo User**: `demo@ncskit.org` / `demo123`

Những account này bypass database check và luôn available.

## 🎨 UI Components

### Login Page (`/login`)

Trang đăng nhập/đăng ký với:
- Toggle giữa Sign In và Sign Up
- Form validation
- Error/Success messages
- Loading states
- Responsive design

## 🔧 Troubleshooting

### Database Connection Error

1. Kiểm tra `POSTGRES_URL` trong `.env.local`
2. Đảm bảo Vercel Postgres database đã được tạo
3. Kiểm tra network connection

### Migration Failed

1. Kiểm tra database connection string
2. Đảm bảo có quyền CREATE TABLE
3. Chạy migration script với logging: `DEBUG=* npm run migrate`

### NextAuth Session Issues

1. Kiểm tra `NEXTAUTH_SECRET` và `NEXTAUTH_URL`
2. Xóa cookies và thử lại
3. Kiểm tra console logs

## 📝 Next Steps

1. ✅ Setup database connection
2. ✅ Tạo users table
3. ✅ Implement đăng ký/đăng nhập
4. ✅ API quản lý profile
5. 🔄 Tạo user dashboard page
6. 🔄 Add email verification
7. 🔄 Add password reset
8. 🔄 Add OAuth providers (Google, GitHub)

