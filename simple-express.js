import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Create Express app
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TravelBuddy Test Page</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f7;
          color: #333;
          line-height: 1.6;
        }
        .container {
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #0071e3;
          margin-top: 0;
        }
        p {
          margin-bottom: 20px;
        }
        .demo-section {
          background-color: #f0f0f0;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .success {
          color: #34c759;
          font-weight: bold;
        }
        .server-time {
          font-family: monospace;
          background-color: #eee;
          padding: 8px;
          border-radius: 4px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>TravelBuddy Test Page</h1>
        <p>If you can see this page, the Express server is functioning correctly.</p>
        
        <div class="demo-section">
          <p class="success">✓ Server is online and responding to requests</p>
          <p class="success">✓ HTML rendering is working</p>
          <p>Current server time: <span class="server-time">${new Date().toLocaleString()}</span></p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// API health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Simple Express server is running on port ${PORT}`);
  console.log(`📝 Try accessing the following URLs:`);
  console.log(`   - http://localhost:${PORT}`);
  console.log(`   - http://0.0.0.0:${PORT}`);
  console.log(`   - http://127.0.0.1:${PORT}`);
});