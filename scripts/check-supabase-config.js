#!/usr/bin/env node

/**
 * Supabase Configuration Checker
 * 
 * Checks Supabase configuration and provides setup instructions
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 Checking Supabase Configuration...\n')

// Load environment variables
const envLocalPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envLocalPath, 'utf8')
const envVars = {}

envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
            envVars[key] = valueParts.join('=')
        }
    }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const siteUrl = envVars.NEXT_PUBLIC_SITE_URL

console.log('📋 Current Configuration:')
console.log(`Supabase URL: ${supabaseUrl}`)
console.log(`Site URL: ${siteUrl}`)
console.log('')

console.log('🔧 Required Supabase Dashboard Settings:')
console.log('')

console.log('1. 🌐 Site URL (Authentication → Settings → Site URL):')
console.log(`   ${siteUrl}`)
console.log('')

console.log('2. 🔄 Redirect URLs (Authentication → Settings → Redirect URLs):')
console.log(`   ${siteUrl}/auth/callback`)
console.log(`   ${siteUrl}/auth/orcid/callback`)
console.log('')

console.log('3. 📱 OAuth Providers (Authentication → Providers):')
console.log('')

console.log('   🔵 Google OAuth:')
console.log('   - Enable Google provider')
console.log('   - Add authorized redirect URI in Google Console:')
console.log(`     ${supabaseUrl}/auth/v1/callback`)
console.log('')

console.log('   🔗 LinkedIn OIDC:')
console.log('   - Enable LinkedIn OIDC provider')
console.log('   - Add authorized redirect URI in LinkedIn App:')
console.log(`     ${supabaseUrl}/auth/v1/callback`)
console.log('')

console.log('4. 🔐 OAuth Flow:')
console.log('   User clicks login → OAuth Provider → Supabase callback → Your app callback')
console.log(`   ${siteUrl}/login → Google/LinkedIn → ${supabaseUrl}/auth/v1/callback → ${siteUrl}/auth/callback`)
console.log('')

console.log('🚨 Common Issues:')
console.log('')
console.log('❌ Site URL not matching your domain')
console.log('❌ Redirect URLs not added to Supabase')
console.log('❌ OAuth provider redirect URI not matching Supabase URL')
console.log('❌ OAuth provider not enabled in Supabase')
console.log('')

console.log('✅ Quick Fix Steps:')
console.log('')
console.log('1. Go to Supabase Dashboard → Your Project → Authentication → Settings')
console.log(`2. Set Site URL to: ${siteUrl}`)
console.log(`3. Add Redirect URLs: ${siteUrl}/auth/callback`)
console.log('4. Go to Authentication → Providers')
console.log('5. Enable and configure Google/LinkedIn with correct redirect URIs')
console.log('')

console.log('🔗 Useful Links:')
console.log(`Supabase Dashboard: https://supabase.com/dashboard/project/${supabaseUrl.split('//')[1].split('.')[0]}`)
console.log('Google Console: https://console.developers.google.com/')
console.log('LinkedIn Developer: https://www.linkedin.com/developers/apps')
console.log('')

console.log('🧪 Test URLs:')
console.log(`Session Test: ${siteUrl}/session-test`)
console.log(`Debug Auth: ${siteUrl}/debug-auth`)
console.log(`Test Auth: ${siteUrl}/test-auth`)