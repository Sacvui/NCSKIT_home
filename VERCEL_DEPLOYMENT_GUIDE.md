# 🚀 Vercel Deployment Guide - ncsStat2

## ⚠️ CRITICAL: Environment Variables Required

Your app is currently using **placeholder values** because environment variables are not configured on Vercel.

### Current Issue:
```
Login redirects to: https://placeholder.supabase.co/auth/v1/authorize
❌ This is a placeholder URL - authentication will fail!
```

---

## 📋 Step-by-Step Fix

### 1. Get Your Supabase Credentials

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

### 2. Add Environment Variables to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/dashboard
2. Select project: **ncsstat-kiro-ten**
3. Click: **Settings** → **Environment Variables**
4. Add these variables:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site Configuration (REQUIRED)
NEXT_PUBLIC_SITE_URL=https://ncsstat-kiro-ten.vercel.app

# Optional: AI Features
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: ORCID OAuth
ORCID_CLIENT_ID=your-orcid-client-id
ORCID_CLIENT_SECRET=your-orcid-client-secret
```

5. **Important:** Select **All Environments** (Production, Preview, Development)
6. Click **Save**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_SITE_URL production
```

### 3. Redeploy Your Application

After adding environment variables, you MUST redeploy:

#### Option A: Via Vercel Dashboard
1. Go to **Deployments** tab
2. Click **...** menu on latest deployment
3. Click **Redeploy**

#### Option B: Via Git Push
```bash
git commit --allow-empty -m "Trigger redeploy after env vars"
git push origin main
```

#### Option C: Via Vercel CLI
```bash
vercel --prod
```

---

## ✅ Verification

After redeployment, check:

1. **Login should redirect to:**
   ```
   https://YOUR-PROJECT-ID.supabase.co/auth/v1/authorize
   ```
   ✅ NOT `placeholder.supabase.co`

2. **Check build logs:**
   ```
   [Supabase] Missing environment variables. Using placeholder values.
   ```
   ❌ This warning should NOT appear

3. **Test authentication:**
   - Click "Login with Google"
   - Should redirect to real Supabase auth page
   - After login, should redirect back to your app

---

## 🔍 Troubleshooting

### Issue: Still seeing "placeholder.supabase.co"

**Cause:** Environment variables not loaded or deployment not refreshed

**Fix:**
1. Double-check variables are added to **Production** environment
2. Force redeploy (not just rebuild)
3. Clear browser cache and try again

### Issue: "Invalid API key" error

**Cause:** Wrong anon key or service role key

**Fix:**
1. Go back to Supabase Dashboard → Settings → API
2. Copy the keys again (they're long strings starting with `eyJ`)
3. Update Vercel environment variables
4. Redeploy

### Issue: CORS errors

**Cause:** Site URL not configured in Supabase

**Fix:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add to **Site URL**: `https://ncsstat-kiro-ten.vercel.app`
3. Add to **Redirect URLs**: 
   - `https://ncsstat-kiro-ten.vercel.app/auth/callback`
   - `https://ncsstat-kiro-ten.vercel.app/auth/orcid/callback`

---

## 📱 Google OAuth Configuration

If using Google login, configure in Supabase:

1. Go to: Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google**
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add authorized redirect URIs in Google Cloud Console:
   ```
   https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
   ```

---

## 🎯 Quick Checklist

- [ ] Supabase credentials added to Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` set correctly
- [ ] Redeployed application
- [ ] Verified login redirects to real Supabase URL
- [ ] Tested authentication flow end-to-end
- [ ] Configured OAuth providers in Supabase
- [ ] Added redirect URLs to OAuth providers

---

## 📞 Need Help?

If you're still having issues:

1. Check Vercel deployment logs for errors
2. Check browser console for JavaScript errors
3. Check Supabase logs: Dashboard → Logs → Auth Logs
4. Verify all environment variables are set correctly

---

**Last Updated:** January 26, 2026
