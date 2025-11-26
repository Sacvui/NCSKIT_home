const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.POSTGRES_URL;

if (!url) {
    console.log('POSTGRES_URL is missing');
} else {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        console.log('POSTGRES_URL points to LOCALHOST');
    } else if (url.includes('vercel-storage.com') || url.includes('neon.tech')) {
        console.log('POSTGRES_URL points to VERCEL/NEON');
    } else {
        console.log('POSTGRES_URL points to UNKNOWN host');
    }
}
