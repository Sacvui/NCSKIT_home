# 🚀 Chạy Local và Push lên GitHub

Hướng dẫn chạy project ở local và push code lên GitHub.

## 🔧 Bước 1: Setup Local

### 1.1. Tạo Environment Variables

Tạo file `.env.local` trong thư mục root:

```env
POSTGRES_URL=your_postgres_connection_string
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:9090
```

**Lưu ý:** File `.env.local` đã được ignore bởi git, không lo bị push lên.

### 1.2. Install Dependencies

```bash
npm install
```

### 1.3. Run Database Migration (nếu có database)

```bash
npm run migrate
```

## ▶️ Bước 2: Chạy Local Development Server

```bash
npm run dev
```

Server sẽ chạy tại: **http://localhost:9090**

### Test Authentication

1. Mở: http://localhost:9090/login
2. Test đăng ký/đăng nhập
3. Test các trang: `/profile`, `/dashboard`

## 📝 Bước 3: Commit & Push lên GitHub

### 3.1. Kiểm tra Git Status

```bash
git status
```

### 3.2. Add Files

```bash
# Add tất cả files mới và đã thay đổi
git add .

# Hoặc add từng file cụ thể
git add app/
git add lib/
git add scripts/
git add docs/
```

### 3.3. Commit

```bash
git commit -m "feat: Add authentication system with Vercel Postgres

- Add login/register functionality
- Add user profile management
- Add dashboard page
- Add API routes for auth
- Add database schema and migration
- Add deployment documentation"
```

### 3.4. Push lên GitHub

```bash
# Push lên branch hiện tại (main)
git push origin main

# Hoặc push lên branch mới
git checkout -b feature/authentication
git push origin feature/authentication
```

## 🔍 Kiểm tra trước khi Push

- [ ] Build thành công: `npm run build`
- [ ] Không có file `.env.local` trong git (đã ignore)
- [ ] Không có `node_modules/` trong git (đã ignore)
- [ ] Không có `.next/` trong git (đã ignore)
- [ ] Code đã được test ở local

## 📋 Quick Commands

```bash
# Chạy local
npm run dev

# Build test
npm run build

# Kiểm tra files sẽ commit
git status

# Add và commit
git add .
git commit -m "your commit message"

# Push
git push origin main
```

## 🐛 Troubleshooting

### Port 9090 đã được sử dụng

```bash
# Windows: Tìm process
netstat -ano | findstr :9090

# Kill process
taskkill /PID <PID> /F

# Hoặc đổi port trong package.json
```

### Database connection failed

- Kiểm tra `.env.local` có đúng `POSTGRES_URL`
- Kiểm tra database đã được tạo chưa
- Kiểm tra network connection

### Git push failed

```bash
# Pull latest changes trước
git pull origin main

# Resolve conflicts nếu có
# Sau đó push lại
git push origin main
```

## ✅ Checklist

- [ ] `.env.local` đã được tạo (không commit)
- [ ] Dependencies đã install
- [ ] Local server chạy thành công
- [ ] Test authentication hoạt động
- [ ] Build thành công
- [ ] Git status clean
- [ ] Đã commit và push lên GitHub

---

**Happy Coding! 🎉**

