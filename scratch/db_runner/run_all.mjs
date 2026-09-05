import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString = 'postgresql://postgres:Coke%4020152025@db.xfftxehejtmxcoftkkmo.supabase.co:5432/postgres';
const basePath = 'd:\\SE_Project\\ncskt\\ncskit_home';

const filesToRun = [
    'utils/supabase/token_system_schema.sql',
    'utils/supabase/user_activity_schema.sql',
    'supabase/migrations/20260124_performance_indexes.sql',
    'supabase/migrations/20260128000000_add_feedback_table.sql',
    'supabase/migrations/20260329000000_update_profile_and_rls.sql',
    'supabase/migrations/20260331035048_create_knowledge_base_table.sql',
    'supabase/migrations/20260417000000_fix_knowledge_rls.sql',
    'supabase/migrations/20260417000001_fix_feedback_rls.sql',
    'supabase/migrations/20260417000002_deploy_deduct_credits_rpc.sql',
    'supabase/migrations/20260418000000_add_feedback_rating.sql',
    'utils/supabase/setup_storage.sql'
];

function splitSqlStatements(sql) {
    const statements = [];
    let currentStatement = '';
    let inSingleQuote = false;
    let inDollarQuote = false;
    let dollarQuoteTag = '';
    
    for (let i = 0; i < sql.length; i++) {
        const char = sql[i];
        const nextChar = sql[i + 1] || '';
        
        currentStatement += char;
        
        if (!inSingleQuote && !inDollarQuote && char === '$' && nextChar === '$') {
            inDollarQuote = true;
            dollarQuoteTag = '$$';
            currentStatement += nextChar;
            i++;
            continue;
        } else if (inDollarQuote && char === '$' && nextChar === '$') {
            inDollarQuote = false;
            dollarQuoteTag = '';
            currentStatement += nextChar;
            i++;
            continue;
        }
        
        if (!inDollarQuote && char === "'" && sql[i-1] !== '\\') {
            inSingleQuote = !inSingleQuote;
        }
        
        if (!inSingleQuote && !inDollarQuote && char === ';') {
            if (currentStatement.trim().length > 0) {
                statements.push(currentStatement.trim());
            }
            currentStatement = '';
        }
    }
    
    if (currentStatement.trim().length > 0) {
        statements.push(currentStatement.trim());
    }
    
    return statements;
}

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
      for (const relFile of filesToRun) {
          const sqlFilePath = path.join(basePath, relFile);
          console.log(`\n===========================================`);
          console.log(`Executing file: ${relFile}`);
          
          if (!fs.existsSync(sqlFilePath)) {
              console.log(`FILE NOT FOUND: ${sqlFilePath}`);
              continue;
          }
          
          const fileContent = fs.readFileSync(sqlFilePath, 'utf8');
          const statements = splitSqlStatements(fileContent);
          
          let successCount = 0;
          let skipCount = 0;
          let errorCount = 0;
          
          for (const stmt of statements) {
              try {
                  await client.query(stmt);
                  successCount++;
              } catch (e) {
                  if (e.message.includes('already exists')) {
                      skipCount++;
                      // console.log(`Skipped existing object: ${e.message}`);
                  } else {
                      errorCount++;
                      console.error(`Error on statement (${stmt.substring(0, 50)}...): ${e.message}`);
                  }
              }
          }
          console.log(`File complete: ${successCount} success, ${skipCount} skipped, ${errorCount} errors.`);
      }

  } catch (err) {
    console.error('Error executing SQL script:', err);
  } finally {
    await client.end();
  }
}

run();
