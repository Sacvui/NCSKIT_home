# 🚀 Vercel Environment Variables Setup

## ✅ Your Supabase Credentials

```bash
Project URL: https://qshimpxmirkyfenhklfh.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaGltcHhtaXJreWZlbmhrbGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNjY3NDgsImV4cCI6MjA4NDc0Mjc0OH0.HuI-xYfHgw0m757SQUqvxIEiScy0tH4BR7L3TTCPQR0
```

---

## 📋 Step 1: Get Service Role Key

⚠️ **CRITICAL:** You still need the **service_role** key!

1. Go to: https://supabase.com/dashboard/project/qshimpxmirkyfenhklfh/settings/api
2. Scroll to **Project API keys**
3. Find the key labeled **service_role** (with 🔒 Secret icon)
4. Click **Copy** (it's a long string starting with `eyJ...`)

---

## 📋 Step 2: Add to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to: https://vercel.com/dashboard
2. Select project: **ncsstat-kiro-ten**
3. Click: **Settings** → **Environment Variables**
4. Add these 4 variables:

#### Variable 1:
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://qshimpxmirkyfenhklfh.supabase.co
Environments: ✓ Production ✓ Preview ✓ Development
```

#### Variable 2:
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaGltcHhtaXJreWZlbmhrbGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNjY3NDgsImV4cCI6MjA4NDc0Mjc0OH0.HuI-xYfHgw0m757SQUqvxIEiScy0tH4BR7L3TTCPQR0
Environments: ✓ Production ✓ Preview ✓ Development
```

#### Variable 3:
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [PASTE YOUR SERVICE_ROLE KEY HERE]
Environments: ✓ Production ✓ Preview ✓ Development
```

#### Variable 4:
```
Name: NEXT_PUBLIC_SITE_URL
Value: https://ncsstat-kiro-ten.vercel.app
Environments: ✓ Production ✓ Preview ✓ Development
```

5. Click **Save** after each variable

---

### Option B: Via Vercel CLI (Advanced)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd ncsStat2
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste: https://qshimpxmirkyfenhklfh.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaGltcHhtaXJreWZlbmhrbGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNjY3NDgsImV4cCI6MjA4NDc0Mjc0OH0.HuI-xYfHgw0m757SQUqvxIEiScy0tH4BR7L3TTCPQR0

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Paste: [YOUR SERVICE_ROLE KEY]

vercel env add NEXT_PUBLIC_SITE_URL production
# Paste: https://ncsstat-kiro-ten.vercel.app
```

---

## 📋 Step 3: Redeploy

After adding environment variables:

### Option A: Via Vercel Dashboard
1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~2-3 minutes)

### Option B: Via Git Push
```bash
git add .
git commit -m "chore: Add environment variables setup guide"
git push origin main
```

### Option C: Via Vercel CLI
```bash
vercel --prod
```

---

## ✅ Step 4: Verify

After deployment completes:

1. Open: https://ncsstat-kiro-ten.vercel.app
2. Click **Login with Google**
3. Check the URL - should be:
   ```
   https://qshimpxmirkyfenhklfh.supabase.co/auth/v1/authorize...
   ```
4. ✅ Should NOT be `placeholder.supabase.co`

---

## 🔧 Step 5: Configure Supabase Auth URLs

1. Go to: https://supabase.com/dashboard/project/qshimpxmirkyfenhklfh/auth/url-configuration
2. Set **Site URL**: `https://ncsstat-kiro-ten.vercel.app`
3. Add **Redirect URLs**:
   ```
   https://ncsstat-kiro-ten.vercel.app/auth/callback
   https://ncsstat-kiro-ten.vercel.app/auth/orcid/callback
   https://ncsstat-kiro-ten.vercel.app/**
   ```
4. Click **Save**

---

## 🔐 Step 6: Configure Google OAuth (if using)

1. Go to: https://supabase.com/dashboard/project/qshimpxmirkyfenhklfh/auth/providers
2. Enable **Google** provider
3. Add your Google OAuth credentials
4. In Google Cloud Console, add authorized redirect URI:
   ```
   https://qshimpxmirkyfenhklfh.supabase.co/auth/v1/callback
   ```

---

## 🎯 Quick Checklist

- [ ] Got service_role key from Supabase
- [ ] Added all 4 environment variables to Vercel
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed the application
- [ ] Configured Site URL in Supabase
- [ ] Added redirect URLs in Supabase
- [ ] Tested login flow
- [ ] Verified URL is NOT placeholder.supabase.co

---

## 🐛 Troubleshooting

### Still seeing "placeholder.supabase.co"?

1. Check Vercel deployment logs for warnings
2. Verify environment variables are in **Production** environment
3. Force redeploy (not just rebuild)
4. Clear browser cache and cookies
5. Try incognito/private browsing mode

### "Invalid API key" error?

1. Double-check you copied the full anon key (very long string)
2. Make sure no extra spaces or line breaks
3. Verify the key is for the correct Supabase project

### CORS errors?

1. Check Site URL in Supabase matches your Vercel URL exactly
2. Ensure redirect URLs include `/auth/callback`
3. Try adding `/**` wildcard to redirect URLs

---

**Created:** January 26, 2026  
**Project:** ncsStat2  
**Supabase Project:** qshimpxmirkyfenhklfh
