/**
 * Database Migration Script
 * Run this script to create the users table in Vercel Postgres
 * 
 * Usage:
 *   npm run migrate
 *   or
 *   npx tsx scripts/migrate.ts
 */

import { sql } from '@vercel/postgres';
import 'dotenv/config';

async function migrate() {
    try {
        console.log('🔄 Starting database migration...');
        
        // Check connection
        await sql`SELECT 1`;
        console.log('✅ Database connection successful');

        // Create users table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                is_active BOOLEAN DEFAULT true
            )
        `;
        console.log('✅ Users table created/verified');

        // Create index on email for faster lookups
        await sql`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
        `;
        console.log('✅ Index on email created/verified');

        // Create index on role
        await sql`
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)
        `;
        console.log('✅ Index on role created/verified');

        console.log('✨ Migration completed successfully!');
    } catch (error: any) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();

