import { User } from '@shared/schema';
import { Request } from 'express';

declare global {
  namespace Express {
    // Extend the Express Request type to include user and isAuthenticated
    interface Request {
      user?: User;
      isAuthenticated(): this is AuthenticatedRequest<this>;
    }
  }
}

// Type for authenticated requests
export interface AuthenticatedRequest<T = any> extends Request {
  user: User;
  isAuthenticated(): this is AuthenticatedRequest<T>;
}
