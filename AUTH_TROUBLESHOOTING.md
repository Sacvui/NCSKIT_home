# 🔧 Authentication Troubleshooting Guide

## Common Issues and Solutions

### 1. "no_session" Error After Login

**Symptoms:**
- User gets redirected to `/login?error=no_session` after successful OAuth
- Debug shows no Supabase session despite successful login

**Causes:**
- Environment variables not properly configured
- Middleware rejecting session due to validation issues
- Cookie/session storage issues

**Solutions:**

1. **Check Environment Variables:**
   ```bash
   npm run check-env
   ```

2. **Verify Supabase Configuration:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the correct Project URL and anon key
   - Update `.env.local`

3. **Check Debug Pages:**
   - Visit `/debug-auth` to see detailed auth status
   - Visit `/test-auth` for interactive testing

### 2. ORCID Authentication Issues

**Symptoms:**
- ORCID login redirects but doesn't create session
- "invalid_orcid_session" error

**Solutions:**

1. **Check ORCID Configuration:**
   ```bash
   # Verify ORCID environment variables
   echo $ORCID_CLIENT_ID
   echo $NEXT_PUBLIC_ORCID_CLIENT_ID
   ```

2. **Verify ORCID App Settings:**
   - Go to https://orcid.org/developer-tools
   - Check redirect URI: `https://your-domain.com/auth/orcid/callback`
   - Ensure app is in production mode if needed

### 3. Environment Variable Issues

**Symptoms:**
- Placeholder values in cookies (`sb-placeholder-auth-token`)
- "Supabase not configured" errors

**Solutions:**

1. **Check .env.local file exists:**
   ```bash
   ls -la .env.local
   ```

2. **Verify environment variables are loaded:**
   ```bash
   npm run check-env
   ```

3. **For Vercel deployment:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required variables
   - Redeploy the project

### 4. Cookie/Session Storage Issues

**Symptoms:**
- Session doesn't persist across page reloads
- User gets logged out immediately

**Solutions:**

1. **Check cookie settings:**
   - Ensure HTTPS in production
   - Verify SameSite and Secure flags
   - Check domain settings

2. **Clear browser storage:**
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   document.cookie.split(";").forEach(c => {
       document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
   });
   ```

## Debug Tools

### 1. Debug Auth Page (`/debug-auth`)
- Shows detailed authentication status
- Displays cookies and localStorage
- Provides quick actions to clear auth data

### 2. Test Auth Page (`/test-auth`)
- Interactive authentication testing
- Environment status check
- Real-time session monitoring

### 3. Environment Checker
```bash
npm run check-env
```

### 4. Server Logs
Check Vercel function logs or local console for:
- `[Middleware]` logs
- `[Callback Route]` logs
- `[ORCID Callback]` logs

## Authentication Flow Diagram

```
1. User clicks login → /login
2. OAuth redirect → Provider (Google/LinkedIn/ORCID)
3. Provider callback → /auth/callback or /auth/orcid/callback
4. Session creation → Cookie/localStorage
5. Middleware validation → Protected routes
```

## Quick Fixes

### Reset All Authentication
```bash
# Clear all auth data
curl -X POST https://your-domain.com/api/debug-auth/reset
```

### Force Environment Reload
```bash
# Redeploy with fresh environment
vercel --prod --force
```

### Test Specific Auth Provider
```bash
# Test Supabase connection
curl https://your-domain.com/api/debug-auth

# Test ORCID configuration
curl https://your-domain.com/api/auth/orcid-profile
```

## Contact Support

If issues persist:
1. Check `/debug-auth` page and copy the output
2. Check browser console for errors
3. Check server logs in Vercel dashboard
4. Create issue with debug information

## Environment Variables Checklist

### Required:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_SITE_URL`

### Optional:
- [ ] `ORCID_CLIENT_ID`
- [ ] `NEXT_PUBLIC_ORCID_CLIENT_ID`
- [ ] `ORCID_CLIENT_SECRET`
- [ ] `GEMINI_API_KEY`

### Supabase OAuth Providers:
- [ ] Google OAuth configured in Supabase Dashboard
- [ ] LinkedIn OIDC configured in Supabase Dashboard
- [ ] Redirect URLs added: `https://your-domain.com/auth/callback`