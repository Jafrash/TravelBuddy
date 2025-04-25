import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createServer } from 'http';

// Create Express app
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', time: new Date().toISOString() });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the index.html file for all other routes (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Create HTTP server
const server = createServer(app);

// Start server on port 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});