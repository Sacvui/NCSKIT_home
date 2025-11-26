# Understanding the 500 & 401 Errors

## Error 500: Internal Server Error (Database Connection)

The error `api/auth/register:1 Failed to load resource: the server responded with a status of 500` indicates that the server failed to process the registration request.

**Reason:**
The application is configured to use `@vercel/postgres` for database operations, but the `POSTGRES_URL` environment variable in `.env.local` is set to `file:./dev.db`.
- `@vercel/postgres` requires a valid PostgreSQL connection string (e.g., `postgres://user:password@host:port/database`).
- `file:./dev.db` is for SQLite, which is not supported by the current database driver configuration.

**Solution:**
1.  **Use Demo Accounts:** Since you are running locally without a Postgres database, you can use the built-in fallback accounts to log in:
    -   **Admin:** `hailp` / `123456`
    -   **Demo User:** `demo@ncskit.org` / `demo123`
    
    These accounts bypass the database check and allow you to access the application features.

2.  **Configure a Real Database:** If you want Registration to work, you need to provide a valid PostgreSQL connection string in `.env.local`:
    ```env
    POSTGRES_URL="postgres://username:password@localhost:5432/ncskit_db"
    ```
    (You would need to install and run PostgreSQL locally or use a cloud provider like Neon or Supabase).

## Error 401: Unauthorized

The error `Failed to load resource: the server responded with a status of 401` typically happens when:
1.  You try to access a protected route without being logged in.
2.  You try to log in with an account that doesn't exist (e.g., a newly registered account that failed to save to the DB due to the 500 error).

**Solution:**
Log in using one of the demo accounts mentioned above.
