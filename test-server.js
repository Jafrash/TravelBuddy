import { createServer } from 'http';

// Create a simple HTTP server
const server = createServer((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Test server is running! This confirms the server can accept connections.');
});

// Listen on 0.0.0.0 (all interfaces) and port 5000 specifically for Replit
server.listen(5000, '0.0.0.0', () => {
  console.log('Test server is running on http://0.0.0.0:5000');
  console.log('If you can see this in the console but not access the server,');
  console.log('there might be a firewall or network configuration issue.');
});