import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (isAuthenticatedRequest(req)) {
    return next();
  }
  
  res.status(401).json({ 
    error: 'Authentication required',
    message: 'Please log in to access this resource' 
  });
};

// Type guard to check if request is authenticated
export function isAuthenticatedRequest<T = any>(req: Request): req is AuthenticatedRequest<T> {
  return req.isAuthenticated !== undefined && req.isAuthenticated();
}

// Utility function to get the authenticated user (safely)
export function getAuthenticatedUser<T = any>(req: Request): T | null {
  return isAuthenticatedRequest<T>(req) ? (req.user as unknown as T) : null;
}

// Global error handler
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};
