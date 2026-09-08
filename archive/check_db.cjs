const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  const { data, error } = await supabase.rpc('get_schema');
  // Since we don't have rpc for sure, let's just use standard postgrest on information_schema if available,
  // Actually Postgrest doesn't expose information_schema by default.
  // I'll run a raw query if possible, or just create the tables.
}
    if (error) {
      console.log(`Error reading ${table}:`, error.message);
    } else {
      console.log('Columns:', data && data.length > 0 ? Object.keys(data[0]) : 'Empty table');
    }
  }
}

checkSchema();
