# 🚀 Hướng dẫn Deploy NCSKIT lên Vercel

## Bước 1: Kết nối GitHub Repository
1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Chọn **"Import Git Repository"**
4. Tìm và chọn repository: `Sacvui/NCSKIT_home`
5. Click **"Import"**

## Bước 2: Cấu hình Project
Vercel sẽ tự động detect Next.js và cấu hình:
- **Framework Preset**: Next.js ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅
- **Install Command**: `npm install` ✅
- **Node.js Version**: 18.x hoặc 20.x (tự động)

## Bước 3: Environment Variables
Không cần cấu hình environment variables cho dự án này.

## Bước 4: Deploy
1. Click **"Deploy"**
2. Vercel sẽ tự động:
   - Install dependencies
   - Build project
   - Deploy to production

## Bước 5: Custom Domain (Optional)
1. Vào **Project Settings** → **Domains**
2. Thêm domain: `ncskit.org`
3. Cấu hình DNS records theo hướng dẫn của Vercel
4. SSL certificate sẽ được tự động cấp phát

## ✅ Cấu hình đã sẵn sàng
- ✅ `vercel.json` - Security headers, rewrites
- ✅ `next.config.mjs` - Image optimization, remote patterns
- ✅ `package.json` - Build scripts
- ✅ `.gitignore` - Đầy đủ

## 🔍 Kiểm tra sau khi deploy
- [ ] Homepage load đúng
- [ ] Blog page hoạt động
- [ ] Blog articles hiển thị đúng
- [ ] Images load được
- [ ] CSS styles được apply
- [ ] Sitemap.xml accessible
- [ ] Mobile responsive

## 📝 Lưu ý
- File `sitemap-0.xml` sẽ được generate tự động sau mỗi lần build
- Vercel sẽ tự động rebuild khi có commit mới trên branch `main`
- Preview deployments sẽ được tạo cho mỗi Pull Request

