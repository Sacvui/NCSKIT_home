import { Client } from 'pg';
import fs from 'fs';

const sqlFilePath = 'd:\\SE_Project\\ncskt\\ncskit_home\\utils\\supabase\\setup_db_full.sql';
const connectionString = 'postgresql://postgres:Coke%4020152025@db.xfftxehejtmxcoftkkmo.supabase.co:5432/postgres';

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
    const fileContent = fs.readFileSync(sqlFilePath, 'utf8');
    const statements = splitSqlStatements(fileContent);
    
    console.log(`Executing ${statements.length} SQL statements from: ${sqlFilePath}`);
    
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
                console.log(`Skipped existing object: ${e.message}`);
            } else {
                errorCount++;
                console.error(`Error on statement: ${stmt.substring(0, 50)}... -> ${e.message}`);
            }
        }
    }

    console.log(`Execution complete. Success: ${successCount}, Skipped: ${skipCount}, Errors: ${errorCount}`);
  } catch (err) {
    console.error('Error executing SQL script:', err);
  } finally {
    await client.end();
  }
}

run();
