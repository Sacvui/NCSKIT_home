# 🔧 Fix NextAuth CLIENT_FETCH_ERROR

## Lỗi thường gặp

```
[next-auth][error][CLIENT_FETCH_ERROR] 
"Failed to execute 'json' on 'Response': Unexpected end of JSON input"
```

## ✅ Giải pháp

### 1. Kiểm tra Environment Variables

Đảm bảo `.env.local` có:

```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:9090
POSTGRES_URL=your-postgres-url
```

### 2. Restart Dev Server

Sau khi thay đổi `.env.local`:

```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

### 3. Kiểm tra NextAuth Route

API route tại `/api/auth/[...nextauth]` cần:
- Export GET và POST handlers
- Có error handling
- Secret được set

### 4. Test với Fallback Accounts

Nếu database chưa sẵn sàng, dùng:

- Email: `demo@ncskit.org` / Password: `demo123`
- Username: `hailp` / Password: `123456`

### 5. Check Browser Console

Mở DevTools > Console để xem lỗi chi tiết.

### 6. Clear Browser Cache

- Clear cookies cho localhost:9090
- Hard refresh: Ctrl+Shift+R

## 🔍 Debug Steps

1. Check API endpoint:
   ```
   http://localhost:9090/api/auth/providers
   ```

2. Check browser Network tab:
   - Xem request đến `/api/auth/*`
   - Kiểm tra response status

3. Check server logs:
   - Xem terminal nơi chạy `npm run dev`
   - Tìm lỗi database connection

## 🐛 Common Issues

### Issue: Database Connection Failed

**Solution:** 
- Kiểm tra POSTGRES_URL đúng format
- Hoặc dùng fallback accounts (không cần DB)

### Issue: NEXTAUTH_SECRET Missing

**Solution:**
```bash
# Generate new secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET=<generated-secret>
```

### Issue: Handler Not Exported Correctly

**Solution:**
- Đảm bảo route.ts export GET và POST
- Check Next.js version compatibility

---

**Status:** ✅ Fixed in latest commit

