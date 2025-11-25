# ✅ Deployment Checklist - Vercel

## 🔧 Trước khi deploy

- [ ] Code đã được commit và push lên Git repository
- [ ] Build thành công locally: `npm run build`
- [ ] Tất cả tests pass (nếu có)
- [ ] Environment variables đã được chuẩn bị

## 📦 Database Setup

- [ ] Vercel Postgres database đã được tạo
- [ ] Connection string đã được lưu
- [ ] Migration script đã được test locally
- [ ] Users table đã được tạo trong database

## 🔐 Environment Variables

Các biến môi trường cần thiết trong Vercel Dashboard:

- [ ] `POSTGRES_URL` - Vercel Postgres connection string
- [ ] `NEXTAUTH_SECRET` - Secret key (generate: `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` - Production URL (sẽ update sau khi deploy)

## 🚀 Deployment Steps

### Option 1: Deploy qua Vercel Dashboard

1. [ ] Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. [ ] Click "Add New" > "Project"
3. [ ] Import repository từ GitHub/GitLab
4. [ ] Configure project settings:
   - [ ] Framework: Next.js (auto-detect)
   - [ ] Build Command: `npm run build` (default)
   - [ ] Output Directory: `.next` (default)
5. [ ] Add Environment Variables:
   - [ ] `POSTGRES_URL`
   - [ ] `NEXTAUTH_SECRET`
   - [ ] `NEXTAUTH_URL` (tạm thời: `https://your-project.vercel.app`)
6. [ ] Link Vercel Postgres database (nếu có)
7. [ ] Click "Deploy"
8. [ ] Chờ build hoàn tất

### Option 2: Deploy qua CLI

1. [ ] Install Vercel CLI: `npm i -g vercel`
2. [ ] Login: `vercel login`
3. [ ] Link project: `vercel link`
4. [ ] Set environment variables:
   ```bash
   vercel env add POSTGRES_URL production
   vercel env add NEXTAUTH_SECRET production
   vercel env add NEXTAUTH_URL production
   ```
5. [ ] Deploy preview: `vercel`
6. [ ] Test preview deployment
7. [ ] Deploy production: `vercel --prod`

## 🔄 Post-Deployment

- [ ] Update `NEXTAUTH_URL` với production URL chính xác
- [ ] Run database migration (nếu chưa chạy):
  ```bash
  vercel env pull .env.local
  npm run migrate
  ```
- [ ] Test authentication:
  - [ ] Visit `/login`
  - [ ] Test đăng ký tài khoản mới
  - [ ] Test đăng nhập
  - [ ] Test profile page
  - [ ] Test dashboard
- [ ] Check logs trong Vercel Dashboard
- [ ] Test trên mobile devices (responsive)

## 🌐 Custom Domain (Optional)

- [ ] Add custom domain trong Vercel Dashboard
- [ ] Configure DNS records
- [ ] Wait for DNS propagation
- [ ] Update `NEXTAUTH_URL` với custom domain
- [ ] Redeploy project
- [ ] Test SSL certificate (auto với Vercel)

## 🐛 Troubleshooting

Nếu có lỗi, kiểm tra:

- [ ] Environment variables đã được set đúng
- [ ] Database connection string đúng format
- [ ] Migration đã chạy thành công
- [ ] Build logs trong Vercel Dashboard
- [ ] Runtime logs trong Vercel Dashboard

## ✅ Final Checks

- [ ] Site accessible tại production URL
- [ ] Authentication working correctly
- [ ] All pages load without errors
- [ ] Mobile responsive working
- [ ] SSL certificate active
- [ ] Performance acceptable
- [ ] No console errors

---

**Deployment Date:** ________________
**Deployed URL:** ________________
**Status:** ⬜ Success / ⬜ Failed / ⬜ Partial

