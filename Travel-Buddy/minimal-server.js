// Minimal server with no dependencies except Express
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static HTML directly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'src', 'landing.html'));
});

// Health check API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Create and start server - we'll use standard Node.js http server
// This is the most basic way to create an HTTP server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`💻 Server running at http://0.0.0.0:${PORT}`);
  console.log(`🌐 Open your browser to see the application`);
});