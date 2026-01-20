# Vercel Deployment Guide for NCSKIT

## Quick Setup

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import from GitHub: `Sacvui/NCSKIT_home`
   - Select branch: `main`

2. **Build Settings** (Auto-detected by Vercel)
   - Framework Preset: **Next.js**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)
   - Node.js Version: **18.x** or **20.x**

3. **Environment Variables** (if needed)
   - No environment variables required for this project

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

## Configuration Files

### `vercel.json`
Already configured with:
- Build and dev commands
- Framework detection
- Region: `iad1` (Washington, D.C.)
- Security headers
- Sitemap rewrites

### `next.config.mjs`
- React Strict Mode: Enabled
- Image optimization: AVIF and WebP formats
- Remote image patterns: Configured for AI partner logos
- Compression: Enabled
- ETags: Enabled

### `package.json`
- Build script: `next build`
- Post-build: `next-sitemap` (generates sitemap.xml)

## Custom Domain Setup

1. In Vercel Dashboard → Project Settings → Domains
2. Add custom domain: `ncskit.org`
3. Configure DNS records as instructed by Vercel
4. SSL certificate will be automatically provisioned

## Build Output

The project builds as a static site with:
- Static pages: Home, Blog, Blog articles
- API routes: `/api/blog`
- Dynamic routes: `/blog/[slug]`

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18.x or 20.x)
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### Images Not Loading
- Verify image paths in `public/assets/`
- Check `next.config.mjs` remote patterns for external images
- Ensure images are optimized (AVIF/WebP)

### Sitemap Not Generated
- Check `next-sitemap.config.js` configuration
- Verify `postbuild` script runs after build
- Check `public/sitemap.xml` exists after build

## Performance Optimization

- Images are automatically optimized by Next.js
- Static pages are pre-rendered
- API routes are serverless functions
- CSS is automatically minified
- JavaScript is code-split and optimized

## Monitoring

- Vercel Analytics: Enable in project settings
- Error tracking: Check Vercel logs
- Performance: Use Vercel Speed Insights

