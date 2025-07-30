import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup basic Express app
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from client/dist (for production)
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Basic API health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Serve our landing page for testing connectivity
app.get('/landing', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'src', 'landing.html'));
});

// Simple test route that definitely works
app.get('/test', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>TravelBuddy Server Test</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; }
          .success { color: #10b981; font-weight: bold; }
          .box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>TravelBuddy Test Page</h1>
        <p>This indicates the server is correctly listening on port 5000.</p>
        <div class="box">
          <p class="success">✅ Server connection successful!</p>
          <p>Server time: ${new Date().toLocaleString()}</p>
        </div>
        <p>Try these links:</p>
        <ul>
          <li><a href="/landing">View Landing Page</a></li>
          <li><a href="/api/health">API Health Check (JSON)</a></li>
        </ul>
      </body>
    </html>
  `);
});

// Default route - serve our React app
app.get('*', (req, res) => {
  // For the purposes of this test, direct to the test page
  res.redirect('/test');
});

// Create HTTP server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
  -----------------------------------------------
  ✅ TravelBuddy Server Started Successfully
  -----------------------------------------------
  🌐 Server URL:  http://0.0.0.0:${PORT}
  📝 Test URL:    http://0.0.0.0:${PORT}/test
  🔍 Health URL:  http://0.0.0.0:${PORT}/api/health
  ⏰ Started at:  ${new Date().toLocaleString()}
  -----------------------------------------------
  `);
});