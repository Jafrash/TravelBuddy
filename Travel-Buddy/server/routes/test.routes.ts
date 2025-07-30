import { Router } from 'express';
import AIService from '../services/AIService';

export const testRouter = Router();

testRouter.get('/test-ai', async (req, res) => {
  try {
    const testRequest = {
      userId: 1,
      destination: 'Paris',
      duration: 5,
      interests: ['museums', 'food', 'sightseeing'],
      budget: 'medium' as const
    };

    console.log('Generating test itinerary...');
    const result = await AIService.generateItinerary(testRequest);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
