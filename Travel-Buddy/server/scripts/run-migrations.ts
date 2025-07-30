import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { db, pool } from '../db';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('Running migrations...');
    
    await migrate(db, { 
      migrationsFolder: path.join(__dirname, '../migrations') 
    });
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runMigrations();
