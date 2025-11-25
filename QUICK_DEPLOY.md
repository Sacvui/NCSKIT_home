# ⚡ Quick Deploy Guide - Vercel

Hướng dẫn nhanh deploy NCSKIT lên Vercel.

## 🚀 Deploy trong 5 phút

### Bước 1: Chuẩn bị Database

1. **Tạo Vercel Postgres:**
   - Vào [Vercel Dashboard](https://vercel.com/dashboard)
   - Storage > Create Database > Postgres
   - Copy connection string

2. **Run Migration:**
   ```bash
   # Set POSTGRES_URL locally
   echo "POSTGRES_URL=your_connection_string" > .env.local
   
   # Run migration
   npm run migrate
   ```

### Bước 2: Deploy qua Dashboard

1. **Import Project:**
   - Vào [Vercel Dashboard](https://vercel.com/dashboard)
   - Add New > Project
   - Import từ GitHub/GitLab

2. **Set Environment Variables:**
   ```
   POSTGRES_URL = your_postgres_connection_string
   NEXTAUTH_SECRET = openssl rand -base64 32
   NEXTAUTH_URL = https://your-project.vercel.app
   ```

3. **Deploy:**
   - Click Deploy
   - Chờ build xong

### Bước 3: Update & Test

1. **Update NEXTAUTH_URL:**
   - Settings > Environment Variables
   - Update `NEXTAUTH_URL` = production URL
   - Redeploy

2. **Test:**
   - Visit: `https://your-project.vercel.app/login`
   - Test đăng ký/đăng nhập

## 🛠 Deploy qua CLI

```bash
# 1. Install & Login
npm i -g vercel
vercel login

# 2. Link Project
vercel link

# 3. Set Env Vars
vercel env add POSTGRES_URL production
vercel env add NEXTAUTH_SECRET production

# 4. Deploy
vercel --prod
```

## ✅ Checklist

- [ ] Database created
- [ ] Migration run
- [ ] Env vars set
- [ ] Project deployed
- [ ] NEXTAUTH_URL updated
- [ ] Authentication tested

## 📚 Full Guide

Xem [docs/DEPLOY_VERCEL.md](./docs/DEPLOY_VERCEL.md) để biết chi tiết.

---

**🎉 Done! Site is live!**

