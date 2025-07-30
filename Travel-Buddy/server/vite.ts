import express, { type Express, type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import type { Server } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Logger function
export function log(message: string, source = 'express') {
  const time = new Date().toISOString();
  console.log(`[${time}] [${source}] ${message}`);
}

// Serve static files in production
export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, '../dist/client');
  
  if (!fs.existsSync(distPath)) {
    throw new Error(`Production build not found at ${distPath}. Run 'npm run build' first.`);
  }

  app.use(express.static(distPath, { index: false }));
  
  // Fallback to index.html for SPA routing
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

export async function setupVite(app: Express, server: Server) {
  try {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { 
        middlewareMode: true,
        hmr: { server },
      } as any, // Temporary type assertion to fix the type error
      appType: 'spa',
      logLevel: 'info',
      root: path.resolve(__dirname, '..'),
      publicDir: 'public',
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);

    // Serve index.html for all routes in development
    app.use('*', async (req: Request, res: Response) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(
          path.resolve(__dirname, '../client/index.html'),
          'utf-8'
        );

        // Apply Vite HTML transforms and inject HMR client
        template = await vite.transformIndexHtml(url, template);
        
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        const error = e as Error;
        if ('ssrFixStacktrace' in vite && typeof vite.ssrFixStacktrace === 'function') {
          vite.ssrFixStacktrace(error);
        }
        console.error('Vite dev server error:', error);
        return res.status(500).end(error.message);
      }
    });
  } catch (error) {
    console.error('Failed to start Vite dev server:', error);
    process.exit(1);
  }
}
