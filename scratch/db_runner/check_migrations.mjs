import { Client } from 'pg';

const connectionString = 'postgresql://postgres:Coke%4020152025@db.xfftxehejtmxcoftkkmo.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
    const res = await client.query(`
      SELECT version FROM supabase_migrations.schema_migrations ORDER BY version;
    `);
    console.log("APPLIED MIGRATIONS:");
    res.rows.forEach(r => console.log(r.version));
  } catch (err) {
    if (err.message.includes('does not exist')) {
       console.log("No schema_migrations table found in supabase_migrations schema.");
    } else {
       console.error('Error:', err.message);
    }
  } finally {
    await client.end();
  }
}

run();
