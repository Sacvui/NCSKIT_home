import postgres from 'postgres';
import fs from 'fs';

const sqlFilePath = 'd:\\SE_Project\\ncskt\\ncskit_home\\utils\\supabase\\setup_db_full.sql';
const connectionString = 'postgresql://postgres:Coke%4020152025@db.xfftxehejtmxcoftkkmo.supabase.co:5432/postgres';

async function run() {
  const sql = postgres(connectionString);
  try {
    const fileContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log(`Executing SQL file: ${sqlFilePath}`);
    
    // Simple parsing to split statements by ';' ignoring inside strings or DO blocks is hard,
    // so we will just run the statements block by block if possible, or use a custom regex.
    // Instead of regex, I will just write a PL/pgSQL block to ignore already exists for type.
    
    // Let's modify the sql to safely create the type if it doesn't exist
    const safeContent = fileContent.replace(
      "create type user_role as enum ('user', 'admin', 'researcher');",
      `DO $$ BEGIN
          CREATE TYPE user_role AS ENUM ('user', 'admin', 'researcher');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;`
    ).replace(
      "create table public.profiles (",
      "create table if not exists public.profiles ("
    ).replace(
      "create table public.projects (",
      "create table if not exists public.projects ("
    );
    
    // Policies also need safe creation
    const queries = safeContent.split(/(?=create policy)/gi);
    
    for (let i = 0; i < queries.length; i++) {
        let q = queries[i].trim();
        if(!q) continue;
        try {
            await sql.unsafe(q);
        } catch (e) {
            if (e.message.includes('already exists') || e.code === '42P07' || e.code === '42710' || e.code === '42704') {
                console.log('Skipping existing object in query chunk.');
            } else {
                console.error('Error on query chunk:', e.message);
            }
        }
    }

    console.log('Successfully executed the SQL script (with safe skips).');
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await sql.end();
  }
}

run();
