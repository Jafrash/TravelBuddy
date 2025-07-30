import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import aiRoutes from './routes/ai.routes';
import { testRouter } from './routes/test.routes';

// Debug log for server startup
console.log('Starting server process... Using port 5000');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Get directory path for later use
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple API health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' });
});

// AI Routes
app.use(aiRoutes);

// Test Routes (temporary)
app.use('/api/test', testRouter);

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

    // Serve the app on port 5000
    // this serves both the API and the client.
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
