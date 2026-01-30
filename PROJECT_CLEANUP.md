# 🗑️ Dọn dẹp dự án - Giảm từ 1.4GB xuống ~50MB

## 📊 Phân tích kích thước hiện tại

### Tổng quan:
- **Tổng dung lượng**: 1.32 GB
- **Nguyên nhân chính**: Build cache và dependencies

### Chi tiết từng thư mục:

| Thư mục | Kích thước | % | Có thể xóa? | Lý do |
|---------|-----------|---|-------------|-------|
| `node_modules` | 677 MB | 51% | ✅ Có | Dependencies - tái tạo bằng `npm install` |
| `.next` | 583 MB | 44% | ✅ Có | Build cache - tự động tạo lại khi `npm run dev/build` |
| `public` | 47 MB | 4% | ⚠️ Kiểm tra | Assets tĩnh - cần review |
| `components` | 0.85 MB | <1% | ❌ Không | Source code |
| `app` | 0.55 MB | <1% | ❌ Không | Source code |
| Còn lại | <1 MB | <1% | ❌ Không | Source code |

---

## 🎯 Giải pháp: Xóa an toàn

### Lệnh 1: Xóa build cache (.next)
```bash
# Windows PowerShell
Remove-Item -Recurse -Force .next

# Hoặc
npm run clean  # (nếu có script này)
```

**Lợi ích**: Giảm ~583 MB
**Rủi ro**: Không có - tự động tạo lại khi chạy dev/build

---

### Lệnh 2: Xóa node_modules (nếu cần)
```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules

# Cài lại
npm install
```

**Lợi ích**: Giảm ~677 MB (tạm thời)
**Lưu ý**: Phải chạy `npm install` lại sau khi xóa

---

### Lệnh 3: Kiểm tra thư mục public
```bash
# Xem file lớn trong public
Get-ChildItem -Path public -Recurse | Sort-Object Length -Descending | Select-Object -First 20 FullName, @{Name="SizeMB";Expression={[math]::Round($_.Length / 1MB, 2)}}
```

**Mục đích**: Tìm file ảnh/video lớn không cần thiết

---

## 🚀 Script tự động dọn dẹp

### Tạo file: `scripts/clean-project.ps1`

```powershell
# Clean Project Script
Write-Host "🗑️  Cleaning project..." -ForegroundColor Cyan

# 1. Clean .next build cache
if (Test-Path .next) {
    Write-Host "Removing .next build cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
    Write-Host "✅ Removed .next (583 MB freed)" -ForegroundColor Green
}

# 2. Clean coverage reports
if (Test-Path coverage) {
    Write-Host "Removing coverage reports..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force coverage
    Write-Host "✅ Removed coverage" -ForegroundColor Green
}

# 3. Clean TypeScript build info
Get-ChildItem -Recurse -Filter "*.tsbuildinfo" | Remove-Item -Force
Write-Host "✅ Removed TypeScript build info" -ForegroundColor Green

# 4. Show final size
$size = (Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB
Write-Host "`n📊 Current project size: $([math]::Round($size, 2)) GB" -ForegroundColor Cyan
```

### Thêm vào package.json:

```json
{
  "scripts": {
    "clean": "powershell -ExecutionPolicy Bypass -File ./scripts/clean-project.ps1",
    "clean:all": "npm run clean && Remove-Item -Recurse -Force node_modules",
    "fresh": "npm run clean:all && npm install"
  }
}
```

---

## 📋 Checklist dọn dẹp

### Dọn dẹp thường xuyên (Hàng tuần):
- [ ] Xóa `.next` - `npm run clean`
- [ ] Xóa `coverage` (nếu có)

### Dọn dẹp sâu (Khi cần):
- [ ] Xóa `node_modules` - `npm run clean:all`
- [ ] Cài lại dependencies - `npm install`
- [ ] Review file lớn trong `public`

### Kiểm tra định kỳ:
- [ ] Xóa file log cũ
- [ ] Xóa file backup không cần
- [ ] Review assets không dùng

---

## 🛡️ Cập nhật .gitignore

Đảm bảo `.gitignore` đã có các thư mục này:

```gitignore
# Build outputs
/.next/
/out/
/build

# Dependencies
/node_modules

# Testing
/coverage

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Logs
npm-debug.log*
yarn-debug.log*
*.log

# OS
.DS_Store
Thumbs.db
```

**Lưu ý**: File `.gitignore` hiện tại đã đúng! ✅

---

## 📊 Kích thước sau khi dọn dẹp

| Trạng thái | Kích thước | Mô tả |
|------------|-----------|-------|
| Hiện tại | 1.32 GB | Có `.next` + `node_modules` |
| Sau clean | ~700 MB | Chỉ có `node_modules` |
| Chỉ source code | ~50 MB | Không có build cache & dependencies |
| Trên Git | ~5-10 MB | Chỉ source code (theo .gitignore) |

---

## 🎯 Khuyến nghị

### Làm ngay:
1. **Xóa `.next`** - An toàn 100%, giảm 583 MB
   ```bash
   Remove-Item -Recurse -Force .next
   ```

2. **Kiểm tra `public`** - Có thể có file lớn không cần
   ```bash
   Get-ChildItem -Path public -Recurse | Sort-Object Length -Descending | Select-Object -First 10
   ```

### Không nên:
- ❌ Xóa `node_modules` trừ khi thực sự cần
- ❌ Xóa source code (`app`, `components`, `lib`, etc.)
- ❌ Commit `.next` hoặc `node_modules` lên Git

---

## 🔍 So sánh với dự án khác

| Dự án Next.js | Kích thước thông thường |
|---------------|------------------------|
| Small project | 200-400 MB |
| Medium project | 400-800 MB |
| Large project | 800-1500 MB |
| **ncsStat** | **1320 MB** ← Bình thường! |

**Kết luận**: Kích thước 1.32 GB là **BÌNH THƯỜNG** cho dự án Next.js có nhiều dependencies như ncsStat (WebR, Chart.js, Supabase, etc.)

---

## ✅ Hành động khuyến nghị

```bash
# Chạy lệnh này để giảm ngay 583 MB:
Remove-Item -Recurse -Force .next

# Kiểm tra kích thước sau khi xóa:
$size = (Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB
Write-Host "New size: $([math]::Round($size, 2)) GB"
```

**Kết quả mong đợi**: ~740 MB (giảm 44%)

---

**Lưu ý quan trọng**: 
- `.next` và `node_modules` **KHÔNG** được commit lên Git (đã có trong .gitignore)
- Trên GitHub repository chỉ ~5-10 MB (chỉ source code)
- Kích thước local lớn là **BÌNH THƯỜNG** và **CẦN THIẾT** để chạy dự án
