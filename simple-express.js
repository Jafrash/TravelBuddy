import express from 'express';
const app = express();
const PORT = 5000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Express Server Running</title>
        <style>
          body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
          h1 { color: #2563eb; }
          .success { color: #10b981; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Express Server is Running!</h1>
        <p class="success">Your server is successfully running on port ${PORT}.</p>
        <p>Current time: ${new Date().toLocaleString()}</p>
        
        <h2>Test Endpoints:</h2>
        <ul>
          <li><a href="/api/test">GET /api/test</a> - Returns a simple JSON response</li>
        </ul>
      </body>
    </html>
  `);
});

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});