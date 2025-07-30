import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  const client = await pool.connect();
  try {
    console.log('✅ Successfully connected to the database');
    const result = await client.query('SELECT NOW()');
    console.log('Database time:', result.rows[0].now);
    
    // Test users table
    const users = await client.query('SELECT * FROM users LIMIT 1');
    console.log('✅ Users table exists with', users.rowCount, 'rows');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('relation "users" does not exist')) {
      console.log('\n⚠️  The users table does not exist. You may need to run migrations.');
    }
    
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection();
