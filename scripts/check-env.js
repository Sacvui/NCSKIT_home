#!/usr/bin/env node

/**
 * Environment Variables Checker
 * 
 * Checks if all required environment variables are properly configured
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 Checking Environment Variables...\n')

// Check if .env.local exists
const envLocalPath = path.join(__dirname, '..', '.env.local')
const envExamplePath = path.join(__dirname, '..', 'env.example')

if (!fs.existsSync(envLocalPath)) {
    console.log('❌ .env.local file not found')
    if (fs.existsSync(envExamplePath)) {
        console.log('💡 Copy env.example to .env.local and configure your values')
    }
    process.exit(1)
}

// Load environment variables
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

const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SITE_URL'
]

const productionRequiredVars = [
    'SUPABASE_SERVICE_ROLE_KEY'
]

const optionalVars = [
    'ORCID_CLIENT_ID',
    'NEXT_PUBLIC_ORCID_CLIENT_ID',
    'ORCID_CLIENT_SECRET',
    'GEMINI_API_KEY'
]

let hasErrors = false

console.log('📋 Required Variables:')
requiredVars.forEach(varName => {
    const value = envVars[varName]
    if (!value) {
        console.log(`❌ ${varName}: Missing`)
        hasErrors = true
    } else if (value.includes('placeholder') || value.includes('your-')) {
        console.log(`⚠️  ${varName}: Contains placeholder value`)
        hasErrors = true
    } else {
        const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
            ? value.slice(0, 10) + '...' 
            : value
        console.log(`✅ ${varName}: ${displayValue}`)
    }
})

console.log('\n📋 Production Required Variables:')
productionRequiredVars.forEach(varName => {
    const value = envVars[varName]
    if (!value) {
        console.log(`⚠️  ${varName}: Missing (required for production)`)
        // Don't fail build for missing production vars in development
    } else if (value.includes('placeholder') || value.includes('your-')) {
        console.log(`⚠️  ${varName}: Contains placeholder value`)
    } else {
        const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
            ? value.slice(0, 10) + '...' 
            : value
        console.log(`✅ ${varName}: ${displayValue}`)
    }
})

console.log('\n📋 Optional Variables:')
optionalVars.forEach(varName => {
    const value = envVars[varName]
    if (!value) {
        console.log(`⚪ ${varName}: Not set`)
    } else if (value.includes('placeholder') || value.includes('your-')) {
        console.log(`⚠️  ${varName}: Contains placeholder value`)
    } else {
        const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
            ? value.slice(0, 10) + '...' 
            : value
        console.log(`✅ ${varName}: ${displayValue}`)
    }
})

// Check Supabase URL format
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
if (supabaseUrl && !supabaseUrl.match(/^https:\/\/[a-z0-9]+\.supabase\.co$/)) {
    console.log('\n⚠️  Supabase URL format looks incorrect')
    console.log('   Expected format: https://your-project-id.supabase.co')
    hasErrors = true
}

// Check site URL format
const siteUrl = envVars.NEXT_PUBLIC_SITE_URL
if (siteUrl && !siteUrl.startsWith('https://')) {
    console.log('\n⚠️  Site URL should use HTTPS in production')
}

console.log('\n' + '='.repeat(50))

if (hasErrors) {
    console.log('❌ Environment configuration has issues')
    console.log('💡 Please fix the issues above before deploying')
    process.exit(1)
} else {
    console.log('✅ Environment configuration looks good!')
    console.log('🚀 Ready for deployment')
}