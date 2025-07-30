import { z } from 'zod';

export const ItinerarySchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  destination: z.string().min(1, 'Destination is required'),
  duration: z.number().int().positive('Duration must be a positive number'),
  interests: z.array(z.string()).min(1, 'At least one interest is required'),
  budget: z.enum(['low', 'medium', 'high']).default('medium'),
  content: z.string().min(1, 'Itinerary content is required'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export type Itinerary = z.infer<typeof ItinerarySchema>;

export const CreateItinerarySchema = ItinerarySchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type CreateItinerary = z.infer<typeof CreateItinerarySchema>;

export const UpdateItinerarySchema = ItinerarySchema.partial().omit({ 
  userId: true, 
  createdAt: true 
});

export type UpdateItinerary = z.infer<typeof UpdateItinerarySchema>;
