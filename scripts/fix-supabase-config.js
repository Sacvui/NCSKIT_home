#!/usr/bin/env node

/**
 * Supabase Configuration Fix Script
 * 
 * Attempts to automatically configure Supabase settings to fix authentication issues
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔧 Supabase Configuration Fix Script\n')

// Load environment variables
const envLocalPath = path.join(__dirname, '..', '.env.local')
if (!fs.existsSync(envLocalPath)) {
    console.log('❌ .env.local file not found')
    process.exit(1)
}

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

const siteUrl = envVars.NEXT_PUBLIC_SITE_URL || 'https://ncsstat.ncskit.org'
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY

console.log('📋 Current Configuration:')
console.log(`   Site URL: ${siteUrl}`)
console.log(`   Supabase URL: ${supabaseUrl}`)
console.log(`   Service Role Key: ${serviceRoleKey ? 'Present' : 'Missing'}`)

if (!supabaseUrl) {
    console.log('\n❌ NEXT_PUBLIC_SUPABASE_URL is missing')
    process.exit(1)
}

if (!serviceRoleKey) {
    console.log('\n⚠️  SUPABASE_SERVICE_ROLE_KEY is missing')
    console.log('   This is required for automatic configuration')
    console.log('   You can still configure manually in Supabase Dashboard')
}

// Extract project reference
const projectRef = supabaseUrl.split('//')[1]?.split('.')[0]
if (!projectRef) {
    console.log('\n❌ Invalid Supabase URL format')
    process.exit(1)
}

console.log(`   Project Reference: ${projectRef}`)

// Configuration to apply
const requiredConfig = {
    siteUrl: siteUrl,
    redirectUrls: [
        `${siteUrl}/auth/callback`,
        `${siteUrl}/auth/orcid/callback`
    ],
    oauthCallbackUrl: `${supabaseUrl}/auth/v1/callback`,
    dashboardUrl: `https://supabase.com/dashboard/project/${projectRef}/auth/settings`
}

console.log('\n🎯 Required Configuration:')
console.log(`   Site URL: ${requiredConfig.siteUrl}`)
console.log(`   Redirect URLs:`)
requiredConfig.redirectUrls.forEach(url => {
    console.log(`     - ${url}`)
})
console.log(`   OAuth Callback URL: ${requiredConfig.oauthCallbackUrl}`)

console.log('\n📋 Manual Configuration Steps:')
console.log('1. Open Supabase Dashboard:')
console.log(`   ${requiredConfig.dashboardUrl}`)
console.log('\n2. Set Authentication Settings:')
console.log(`   Site URL: ${requiredConfig.siteUrl}`)
console.log('   Redirect URLs (comma-separated):')
console.log(`   ${requiredConfig.redirectUrls.join(',')}`)
console.log('\n3. Configure OAuth Providers:')
console.log('   Google OAuth Console:')
console.log(`     - Add redirect URI: ${requiredConfig.oauthCallbackUrl}`)
console.log('   LinkedIn Developer Console:')
console.log(`     - Add redirect URI: ${requiredConfig.oauthCallbackUrl}`)

console.log('\n4. Test Configuration:')
console.log('   - Visit: https://ncsstat.ncskit.org/fix-auth')
console.log('   - Try: https://ncsstat.ncskit.org/test-callback')
console.log('   - Debug: https://ncsstat.ncskit.org/debug-auth')

if (serviceRoleKey) {
    console.log('\n🤖 Attempting Automatic Configuration...')
    
    // Try to configure via Management API
    const authConfig = {
        SITE_URL: siteUrl,
        URI_ALLOW_LIST: requiredConfig.redirectUrls.join(','),
        DISABLE_SIGNUP: false,
        ENABLE_SIGNUP: true,
        ENABLE_EMAIL_CONFIRMATIONS: false,
        ENABLE_EMAIL_AUTOCONFIRM: true
    }

    // Note: This would require the actual Management API call
    // For now, just show what would be configured
    console.log('   Configuration that would be applied:')
    Object.entries(authConfig).forEach(([key, value]) => {
        console.log(`     ${key}: ${value}`)
    })
    
    console.log('\n💡 To enable automatic configuration:')
    console.log('   Visit: https://ncsstat.ncskit.org/fix-auth')
    console.log('   Click: "Auto Fix Configuration"')
} else {
    console.log('\n💡 For automatic configuration:')
    console.log('   1. Add SUPABASE_SERVICE_ROLE_KEY to .env.local')
    console.log('   2. Visit: https://ncsstat.ncskit.org/fix-auth')
    console.log('   3. Click: "Auto Fix Configuration"')
}

console.log('\n✅ Configuration guide complete!')
console.log('🔗 Dashboard: ' + requiredConfig.dashboardUrl)