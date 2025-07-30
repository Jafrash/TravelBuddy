import { Router, Request, Response, NextFunction } from 'express';
import aiService, { type ItineraryRequest } from '../services/AIService';
import { isAuthenticated, getAuthenticatedUser } from '../middleware/auth';
import { z } from 'zod';
import { User } from '@shared/schema';

// Define request schemas
const GenerateItinerarySchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  duration: z.number().int().positive('Duration must be a positive number'),
  interests: z.array(z.string()).optional().default([]),
  budget: z.enum(['low', 'medium', 'high']).optional().default('medium')
});

const router = Router();

// Generate new itinerary
router.post('/generate-itinerary', isAuthenticated, async (req: Request, res: Response, _next: NextFunction) => {
  console.log('Received request to /api/ai/generate-itinerary');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const user = getAuthenticatedUser<User>(req);
    if (!user) {
      console.error('No authenticated user found');
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }
    console.log('Authenticated user ID:', user.id);

    // Validate request body
    const validation = GenerateItinerarySchema.safeParse(req.body);
    if (!validation.success) {
      console.error('Request validation failed:', validation.error);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validation.error.flatten()
      });
    }

    const { destination, duration, interests, budget } = validation.data;
    console.log('Validated request data:', { destination, duration, interests, budget });
    
    const request: ItineraryRequest = {
      userId: user.id,
      destination,
      duration,
      interests: Array.isArray(interests) ? interests : [interests].filter(Boolean),
      budget: budget || 'medium'
    };
    
    console.log('Calling aiService.generateItinerary with:', request);
    const itinerary = await aiService.generateItinerary(request);
    
    console.log('Successfully generated itinerary');
    res.json({
      success: true,
      data: { itinerary }
    });
  } catch (error) {
    console.error('Error in /api/ai/generate-itinerary:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate itinerary';
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// Health check endpoint
router.get('/api/ai/health', async (req: Request, res: Response, _next: NextFunction) => {
  try {
    await aiService.initialize();
    res.json({ 
      status: 'ok', 
      message: 'AI service is ready',
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('AI health check failed:', error);
    res.status(503).json({ 
      status: 'error', 
      message: 'AI service is not available',
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
router.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('AI Route Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

export default router;
