import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Ensure the database is provisioned.");
}

export default defineConfig({
  out: "./migrations",               // Output directory for migration files
  schema: "./shared/schema.ts",      // Path to your schema file
  dialect: "postgresql",             // Dialect for the database (PostgreSQL)
  dbCredentials: {                      // Correct field for connection details
    url: process.env.DATABASE_URL,   // URL for connecting to the database
  },
});

