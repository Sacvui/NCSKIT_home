# 🔐 OAuth Setup Checklist - ncsstat.ncskit.org

## ⚠️ CRITICAL: Environment Variables MUST be set first!

**Current Issue:** App is using `placeholder.supabase.co` because environment variables are not set.

---

## 📋 Step 1: Set Environment Variables on Hosting

### If using Vercel:
1. Go to: https://vercel.com/dashboard
2. Select project for `ncsstat.ncskit.org`
3. Settings → Environment Variables
4. Add these variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://qshimpxmirkyfenhklfh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaGltcHhtaXJreWZlbmhrbGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNjY3NDgsImV4cCI6MjA4NDc0Mjc0OH0.HuI-xYfHgw0m757SQUqvxIEiScy0tH4BR7L3TTCPQR0
SUPABASE_SERVICE_ROLE_KEY=[GET FROM SUPABASE DASHBOARD]
NEXT_PUBLIC_SITE_URL=https://ncsstat.ncskit.org
```

5. **IMPORTANT:** Select all environments (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** the application

### If using Netlify:
1. Site settings → Environment variables
2. Add the same variables above
3. Redeploy

### If using custom server:
Create `.env.production` file with the variables above.

---

## 📋 Step 2: Configure Supabase Auth URLs

1. Go to: https://supabase.com/dashboard/project/qshimpxmirkyfenhklfh/auth/url-configuration

2. Set **Site URL**:
   ```
   https://ncsstat.ncskit.org
   ```

3. Add **Redirect URLs**:
   ```
   https://ncsstat.ncskit.org/**
   https://ncsstat.ncskit.org/auth/callback
   https://ncsstat.ncskit.org/auth/orcid/callback
   ```

4. Click **Save**

---

## 📋 Step 3: Configure Google OAuth

### 3.1 Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID (or create new one)
3. Add **Authorized JavaScript origins**:
   ```
   https://ncsstat.ncskit.org
   https://qshimpxmirkyfenhklfh.supabase.co
   ```

4. Add **Authorized redirect URIs**:
   ```
   https://qshimpxmirkyfenhklfh.supabase.co/auth/v1/callback
   ```

5. Click **Save**
6. Copy **Client ID** and **Client Secret**

### 3.2 Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/qshimpxmirkyfenhklfh/auth/providers
2. Find **Google** provider
3. Click **Enable**
4. Paste:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
5. Click **Save**

---

## 📋 Step 4: Configure ORCID OAuth (Optional)

### 4.1 ORCID Developer Console

1. Go to: https://orcid.org/developer-tools
2. Login and go to **Developer Tools**
3. Register a new application (or edit existing)
4. Add **Redirect URI**:
   ```
   https://ncsstat.ncskit.org/auth/orcid/callback
   ```

5. Copy **Client ID** and **Client Secret**

### 4.2 Add to Environment Variables

Add to your hosting platform:
```bash
ORCID_CLIENT_ID=your-orcid-client-id
ORCID_CLIENT_SECRET=your-orcid-client-secret
```

### 4.3 Redeploy

After adding ORCID credentials, redeploy your application.

---

## 📋 Step 5: Configure LinkedIn OAuth (Optional)

### 5.1 LinkedIn Developer Portal

1. Go to: https://www.linkedin.com/developers/apps
2. Select your app (or create new one)
3. Go to **Auth** tab
4. Add **Authorized redirect URLs**:
   ```
   https://qshimpxmirkyfenhklfh.supabase.co/auth/v1/callback
   ```

5. Copy **Client ID** and **Client Secret**

### 5.2 Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/qshimpxmirkyfenhklfh/auth/providers
2. Find **LinkedIn (OIDC)** provider
3. Click **Enable**
4. Paste:
   - **Client ID** (from LinkedIn)
   - **Client Secret** (from LinkedIn)
5. Click **Save**

---

## ✅ Verification Checklist

After completing all steps:

### 1. Check Environment Variables
```bash
# On your hosting platform, verify these are set:
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] NEXT_PUBLIC_SITE_URL
- [ ] ORCID_CLIENT_ID (if using ORCID)
- [ ] ORCID_CLIENT_SECRET (if using ORCID)
```

### 2. Check Supabase Configuration
```bash
- [ ] Site URL set to https://ncsstat.ncskit.org
- [ ] Redirect URLs added
- [ ] Google provider enabled (if using)
- [ ] LinkedIn provider enabled (if using)
```

### 3. Check OAuth Providers
```bash
- [ ] Google Cloud Console: Redirect URI added
- [ ] ORCID: Redirect URI added (if using)
- [ ] LinkedIn: Redirect URI added (if using)
```

### 4. Test Login Flow

1. Open: https://ncsstat.ncskit.org
2. Click **Login with Google**
3. Check URL - should be:
   ```
   https://qshimpxmirkyfenhklfh.supabase.co/auth/v1/authorize...
   ```
   ✅ NOT `placeholder.supabase.co`

4. Complete login
5. Should redirect back to: `https://ncsstat.ncskit.org/auth/callback`
6. Then redirect to: `https://ncsstat.ncskit.org/analyze`

---

## 🐛 Troubleshooting

### Issue: Still seeing "placeholder.supabase.co"

**Cause:** Environment variables not loaded

**Fix:**
1. Verify variables are set in **Production** environment
2. Force redeploy (not just rebuild)
3. Clear browser cache
4. Check deployment logs for warnings

### Issue: "redirect_uri_mismatch" error

**Cause:** OAuth redirect URI not configured correctly

**Fix:**
1. Check Google Cloud Console redirect URIs
2. Must be exactly: `https://qshimpxmirkyfenhklfh.supabase.co/auth/v1/callback`
3. No trailing slash
4. HTTPS only

### Issue: "Invalid client" error

**Cause:** Wrong Client ID or Client Secret

**Fix:**
1. Re-copy credentials from OAuth provider
2. Make sure no extra spaces
3. Update in Supabase Dashboard
4. Wait 1-2 minutes for changes to propagate

### Issue: CORS errors

**Cause:** Site URL not configured

**Fix:**
1. Check Supabase Auth URL Configuration
2. Add `https://ncsstat.ncskit.org` to Site URL
3. Add wildcard: `https://ncsstat.ncskit.org/**`

---

## 📞 Quick Reference

### Supabase Project
- **Project ID:** qshimpxmirkyfenhklfh
- **Project URL:** https://qshimpxmirkyfenhklfh.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/qshimpxmirkyfenhklfh

### Site URLs
- **Production:** https://ncsstat.ncskit.org
- **Callback:** https://ncsstat.ncskit.org/auth/callback
- **ORCID Callback:** https://ncsstat.ncskit.org/auth/orcid/callback

### OAuth Redirect URIs
- **Supabase (Google/LinkedIn):** https://qshimpxmirkyfenhklfh.supabase.co/auth/v1/callback
- **ORCID (Direct):** https://ncsstat.ncskit.org/auth/orcid/callback

---

**Last Updated:** January 26, 2026  
**Status:** ⚠️ Waiting for environment variables to be set
