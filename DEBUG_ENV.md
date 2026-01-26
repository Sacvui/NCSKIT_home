# 🐛 Debug Environment Variables

## Temporary Debug Code

Add this to any page to check if env vars are loaded:

```typescript
// Add to app/page.tsx or any page temporarily
console.log('=== ENV DEBUG ===');
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
console.log('Has ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('==================');
```

## Expected Output (in browser console):

```
=== ENV DEBUG ===
SUPABASE_URL: https://qshimpxmirkyfenhklfh.supabase.co
SITE_URL: https://ncsstat.ncskit.org
Has ANON_KEY: true
==================
```

## If you see:

```
SUPABASE_URL: https://placeholder.supabase.co
```

Then environment variables are NOT loaded properly.

## Quick Fix Commands:

```bash
# Force redeploy via Vercel CLI
vercel --prod --force

# Or via git
git commit --allow-empty -m "Force redeploy"
git push origin main
```