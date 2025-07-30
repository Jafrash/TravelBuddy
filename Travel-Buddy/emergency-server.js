// Bare minimum HTTP server with no dependencies
import http from 'http';

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Emergency Server</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        h1 { color: #2563eb; }
        .info { background: #f3f4f6; padding: 15px; border-radius: 5px; }
        .success { color: #047857; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>TravelBuddy Emergency Server</h1>
      <p>This is a minimal server running to verify connectivity.</p>
      <div class="info">
        <p class="success">✓ Server is running correctly!</p>
        <p>Current time: ${new Date().toLocaleTimeString()}</p>
        <p>Request URL: ${req.url}</p>
        <p>Request Method: ${req.method}</p>
      </div>
    </body>
    </html>
  `);
});

// Listen on all network interfaces
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
  --------------------------------
  🚀 EMERGENCY SERVER IS RUNNING
  --------------------------------
  📡 PORT: ${PORT}
  🌐 URL: http://0.0.0.0:${PORT}
  ⏰ TIME: ${new Date().toLocaleTimeString()}
  `);
});