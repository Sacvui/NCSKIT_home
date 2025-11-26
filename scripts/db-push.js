const { exec } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envConfig = dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (envConfig.error) {
    console.error('Error loading .env.local:', envConfig.error);
    process.exit(1);
}

console.log('Pushing schema to database...');

// Construct the command with environment variables injected
const cmd = 'npx drizzle-kit push';

const child = exec(cmd, {
    env: { ...process.env, ...envConfig.parsed },
    cwd: process.cwd()
});

child.stdout.on('data', (data) => console.log(data.toString()));
child.stderr.on('data', (data) => console.error(data.toString()));

child.on('exit', (code) => {
    if (code !== 0) {
        console.error(`drizzle-kit push failed with code ${code}`);
        process.exit(code);
    } else {
        console.log('Schema pushed successfully!');
    }
});
