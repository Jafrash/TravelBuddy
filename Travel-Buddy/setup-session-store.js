import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupSessionStore() {
  const client = await pool.connect();
  try {
    // Check if the session table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'session'
      )
    `);

    if (!result.rows[0].exists) {
      console.log('Session table does not exist. Creating...');
      const sessionTable = connectPgSimple(session);
      const createTableQuery = sessionTable.createTableQuery();
      await client.query(createTableQuery);
      console.log('✅ Session table created successfully');
    } else {
      console.log('✅ Session table already exists');
    }

  } catch (error) {
    console.error('❌ Error setting up session store:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setupSessionStore();
