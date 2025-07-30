"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.pool = void 0;
var serverless_1 = require("@neondatabase/serverless");
var neon_serverless_1 = require("drizzle-orm/neon-serverless");
var ws_1 = require("ws");
var schema = require("../shared/schema");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var url_1 = require("url");
// Get the root directory path (one level up from this file)
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var rootDir = path_1.default.resolve(__dirname, '..');
// Load environment variables from the root .env file
dotenv_1.default.config({ path: path_1.default.join(rootDir, '.env') });
// Debug log to verify environment variables
console.log('DB - Environment variables loaded from:', path_1.default.join(rootDir, '.env'));
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}
exports.pool = new serverless_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
exports.db = (0, neon_serverless_1.drizzle)(exports.pool, { schema: schema });
