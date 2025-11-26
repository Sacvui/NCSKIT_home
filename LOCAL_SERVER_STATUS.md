# 🚀 Local Server Status

## Development Server

Đã khởi động development server tại: **http://localhost:9090**

## ✅ Kiểm tra

### 1. Mở trình duyệt

Truy cập: **http://localhost:9090**

### 2. Test Authentication

1. **Login Page:** http://localhost:9090/login
   - Test đăng ký tài khoản mới
   - Test đăng nhập

2. **Test Accounts (fallback):**
   - Email: `demo@ncskit.org` / Password: `demo123`
   - Username: `hailp` / Password: `123456`

3. **Profile:** http://localhost:9090/profile (cần đăng nhập)
4. **Dashboard:** http://localhost:9090/dashboard (cần đăng nhập)

## 🔧 Commands

### Start Server
```bash
npm run dev
```

### Stop Server
Nhấn `Ctrl + C` trong terminal

### Check Status
```bash
# Kiểm tra port 9090
netstat -ano | findstr :9090
```

### Build Test
```bash
npm run build
```

## 📝 Environment Variables

File `.env.local` đã có:
- ✅ `POSTGRES_URL` - Database connection
- ✅ `NEXTAUTH_SECRET` - Secret key
- ✅ `NEXTAUTH_URL` - Local URL

## 🐛 Troubleshooting

### Port 9090 đã được sử dụng

```powershell
# Tìm process
netstat -ano | findstr :9090

# Kill process (thay <PID> bằng số PID)
taskkill /PID <PID> /F
```

### Server không khởi động

1. Kiểm tra dependencies:
   ```bash
   npm install
   ```

2. Kiểm tra build:
   ```bash
   npm run build
   ```

3. Xem logs trong terminal

### Database connection error

- Kiểm tra `POSTGRES_URL` trong `.env.local`
- Đảm bảo database đang chạy
- Hoặc dùng fallback accounts (không cần database)

## 📚 Documentation

- Xem `LOCAL_RUN.md` để biết chi tiết
- Xem `QUICK_START_AUTH.md` để setup authentication

---

**Status:** 🟢 Server running on http://localhost:9090

