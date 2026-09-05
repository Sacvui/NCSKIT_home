import { Client } from 'pg';

const connectionString = 'postgresql://postgres:Coke%4020152025@db.xfftxehejtmxcoftkkmo.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
    const res = await client.query(`
      SELECT id, email, full_name, role
      FROM public.profiles
      WHERE role = 'admin';
    `);
    
    if (res.rows.length === 0) {
       console.log("NO_ADMINS_FOUND");
    } else {
       console.log("ADMINS:");
       res.rows.forEach(r => {
           console.log(`- Email: ${r.email}, Name: ${r.full_name}, ID: ${r.id}`);
       });
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
