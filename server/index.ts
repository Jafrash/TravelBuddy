import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Debug log for server startup
console.log('Starting server process... Make sure port 5000 is accessible');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add a direct path to serve landing HTML if all else fails
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.get('/landing', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'src', 'landing.html'));
});

// Add a simple health check that will definitely work
app.get('/health', (req, res) => {
  res.send('OK - Server is healthy');
});

// Add a direct root handler as a fallback
app.get('/test', (req, res) => {
  res.send(`
    <html>
      <head><title>Server Test</title></head>
      <body>
        <h1>Server is running!</h1>
        <p>Current time: ${new Date().toLocaleString()}</p>
        <p>This is a test page to verify the server is accessible.</p>
      </body>
    </html>
  `);
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen(port, '0.0.0.0', () => {
      console.log(`✅ Server successfully started!`);
      console.log(`🌐 Server listening on http://0.0.0.0:${port}`);
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();
