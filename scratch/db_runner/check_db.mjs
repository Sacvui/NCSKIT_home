import { Client } from 'pg';

const connectionString = 'postgresql://postgres:Coke%4020152025@db.xfftxehejtmxcoftkkmo.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
    const res = await client.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public';
    `);
    console.log("TABLES IN PUBLIC SCHEMA:");
    res.rows.forEach(r => console.log(r.tablename));

    const resFunc = await client.query(`
        SELECT p.proname as function_name
        FROM pg_catalog.pg_namespace n
        JOIN pg_catalog.pg_proc p ON p.pronamespace = n.oid
        WHERE n.nspname = 'public';
    `);
    console.log("\nFUNCTIONS IN PUBLIC SCHEMA:");
    resFunc.rows.forEach(r => console.log(r.function_name));
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
