# 🚀 Deployment Checklist - Ngăn chặn lỗi Vercel

## ❓ Tại sao Local chạy được nhưng Vercel fail?

### Nguyên nhân chính:

1. **TypeScript Strict Mode**: Vercel chạy `tsc --noEmit` trước khi build, local dev không check
2. **Missing Imports**: Icon/component được dùng nhưng chưa import
3. **Type Errors**: Lỗi kiểu dữ liệu không được phát hiện ở dev mode
4. **Environment Variables**: Thiếu biến môi trường trên Vercel
5. **Node Version**: Vercel dùng Node 20.x, local có thể khác

---

## ✅ Quy trình kiểm tra TỰ ĐỘNG (Đã setup)

### 1. Pre-commit Hook (Kiểm tra nhẹ)
Tự động chạy khi `git commit`:
- ✓ TypeScript type check
- ✓ ESLint

### 2. Pre-push Hook (Kiểm tra đầy đủ)
Tự động chạy khi `git push`:
- ✓ TypeScript type check
- ✓ ESLint
- ✓ **Production build** (giống Vercel)

### 3. GitHub Actions (CI/CD)
Tự động chạy khi push lên GitHub:
- ✓ Chạy trên Node 20.x (giống Vercel)
- ✓ Full build verification
- ✓ Báo lỗi ngay trên GitHub

---

## 🛠️ Lệnh kiểm tra THỦ CÔNG

### Kiểm tra TypeScript (nhanh - 10s)
```bash
npm run type-check
```
**Khi nào dùng**: Sau khi thêm/sửa code TypeScript

### Kiểm tra ESLint (nhanh - 5s)
```bash
npm run lint
```
**Khi nào dùng**: Sau khi sửa code

### Kiểm tra FULL BUILD (chậm - 30-60s)
```bash
npm run verify-build
```
**Khi nào dùng**: Trước khi push lên GitHub/Vercel

### Build riêng lẻ (để debug)
```bash
npm run build
```
**Khi nào dùng**: Khi cần xem chi tiết lỗi build

---

## 🔧 Cách sửa lỗi thường gặp

### ❌ Lỗi: "Cannot find name 'X'"

**Nguyên nhân**: Thiếu import

**Cách sửa**:
```typescript
// ❌ SAI
<Network className="w-6 h-6" />

// ✅ ĐÚNG
import { Network } from 'lucide-react';
<Network className="w-6 h-6" />
```

### ❌ Lỗi: "Type 'X' is not assignable to type 'Y'"

**Nguyên nhân**: Sai kiểu dữ liệu

**Cách sửa**:
```typescript
// ❌ SAI
const [data, setData] = useState(null);

// ✅ ĐÚNG
const [data, setData] = useState<DataType | null>(null);
```

### ❌ Lỗi: "Module not found"

**Nguyên nhân**: Import sai đường dẫn hoặc thiếu package

**Cách sửa**:
```bash
# Kiểm tra package có trong package.json chưa
npm install <package-name>

# Hoặc sửa đường dẫn import
# ❌ SAI: import { X } from './components/X'
# ✅ ĐÚNG: import { X } from '@/components/X'
```

---

## 📋 Checklist trước khi Push

### Bước 1: Kiểm tra code
- [ ] Đã import đầy đủ các component/icon được sử dụng
- [ ] Không có `any` type không cần thiết
- [ ] Đã xử lý các trường hợp `null`/`undefined`

### Bước 2: Chạy lệnh kiểm tra
```bash
# Chạy lệnh này - nếu PASS thì an toàn để push
npm run verify-build
```

### Bước 3: Commit & Push
```bash
git add .
git commit -m "feat: your message"
git push
```

**Lưu ý**: Pre-push hook sẽ tự động chạy `verify-build`. Nếu fail, push sẽ bị chặn!

---

## 🎯 Workflow khuyến nghị

### Khi code tính năng mới:
1. Code feature
2. Test local: `npm run dev`
3. **Chạy type-check**: `npm run type-check`
4. Fix lỗi nếu có
5. Commit & push (hook tự động kiểm tra)

### Khi sửa lỗi khẩn cấp:
1. Sửa lỗi
2. **Chạy verify-build**: `npm run verify-build`
3. Nếu PASS → Push ngay
4. Nếu FAIL → Fix rồi mới push

### Khi thêm dependencies mới:
1. `npm install <package>`
2. Import và sử dụng
3. **Chạy verify-build**: `npm run verify-build`
4. Commit cả `package.json` và `package-lock.json`

---

## 🚨 Xử lý khi Vercel vẫn fail

### Nếu local PASS nhưng Vercel vẫn FAIL:

1. **Kiểm tra Node version**:
```bash
node --version  # Phải là 20.x
```

2. **Kiểm tra environment variables** trên Vercel:
   - Vào Vercel Dashboard → Settings → Environment Variables
   - Đảm bảo có đủ: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Clear Vercel cache**:
   - Vào Deployment → ... → Redeploy
   - Chọn "Clear cache and redeploy"

4. **Kiểm tra logs chi tiết**:
   - Vào Vercel Deployment → View Build Logs
   - Copy lỗi và search Google/ChatGPT

---

## 📊 Scripts đã thêm vào package.json

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",           // Kiểm tra TypeScript
    "verify-build": "npm run type-check && npm run lint && npm run build"  // Kiểm tra FULL
  }
}
```

---

## 🎓 Best Practices

### ✅ NÊN:
- Chạy `npm run type-check` sau mỗi lần code
- Chạy `npm run verify-build` trước khi push
- Để pre-push hook chạy (đừng skip với `--no-verify`)
- Xem GitHub Actions status trước khi merge PR

### ❌ KHÔNG NÊN:
- Push mà không chạy type-check
- Skip pre-push hook với `git push --no-verify`
- Ignore TypeScript errors bằng `// @ts-ignore`
- Dùng `any` type quá nhiều

---

## 🔗 Tài liệu tham khảo

- [Next.js TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Vercel Build Configuration](https://vercel.com/docs/deployments/configure-a-build)
- [Husky Git Hooks](https://typicode.github.io/husky/)

---

## 📞 Troubleshooting nhanh

| Lỗi | Giải pháp |
|-----|-----------|
| Cannot find name 'X' | Thêm import cho X |
| Type error | Thêm type annotation |
| Module not found | Kiểm tra đường dẫn import |
| Build timeout | Giảm kích thước bundle, optimize imports |
| Out of memory | Tăng Node memory: `NODE_OPTIONS=--max-old-space-size=4096` |

---

**Tóm lại**: Chạy `npm run verify-build` trước khi push = 99% tránh được lỗi Vercel! 🎉