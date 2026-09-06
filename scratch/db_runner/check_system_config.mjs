import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey || supabaseKey);

async function main() {
    console.log("Checking connection to:", supabaseUrl);
    
    // 1. Check if we can query system_config
    const { data: configData, error: configError } = await supabase
        .from('system_config')
        .select('*')
        .limit(1);
        
    if (configError) {
        console.error("ERROR QUERYING system_config:", configError);
        
        // 2. Fallback: try to see if it's a permissions issue by querying profiles
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .limit(1);
            
        if (profileError) {
            console.error("ERROR QUERYING profiles (Auth/Connection issue?):", profileError);
        } else {
            console.log("Can query 'profiles'. But 'system_config' failed. This means system_config definitely does not exist or has zero permissions.");
        }
    } else {
        console.log("SUCCESS! system_config exists and returned data:", configData);
    }
}

main().catch(console.error);
