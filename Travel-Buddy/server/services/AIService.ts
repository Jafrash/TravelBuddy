import { pipeline, type Pipeline, type PipelineType } from '@xenova/transformers';
import { createHash } from 'crypto';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import type { CreateItinerary } from '@shared/itinerary.schema';

// Define types for the model and its response
type AIModel = Pipeline;
type AIModelResponse = Array<{ generated_text: string }>;

export type ItineraryRequest = {
  userId: number;
  destination: string;
  duration: number;
  interests: string[];
  budget: 'low' | 'medium' | 'high';
};

export class AIService {
  private model: AIModel | null = null;
  private isInitialized = false;
  private static instance: AIService;
  private cache: Map<string, string> = new Map();
  private rateLimitMap: Map<number, { lastRequest: number; count: number }> = new Map();
  private readonly RATE_LIMIT = {
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MAX_REQUESTS: 10, // Max requests per hour per user
  };
  private readonly MODEL_CONFIG = {
    name: 'Xenova/t5-small' as const,
    quantized: true,
    max_new_tokens: 1000,
    temperature: 0.7,
    top_k: 50,
    top_p: 0.9,
    do_sample: true,
    timeout: 30000, // 30 seconds
  };

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    console.log('🚀 Initializing AI model (this may take a minute)...');
    
    try {
      // Initialize with timeout to prevent hanging
      await Promise.race([
        (async () => {
          this.model = await pipeline(
            'text2text-generation' as PipelineType,
            this.MODEL_CONFIG.name,
            {
              quantized: this.MODEL_CONFIG.quantized,
              progress_callback: (progress: any) => {
                if (progress.status === 'progress') {
                  const percent = Math.round(progress.loaded * 100);
                  console.log(`📥 Download progress: ${percent}%`);
                }
              }
            }
          );
        })(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Model initialization timed out')), this.MODEL_CONFIG.timeout)
        )
      ]);
      
      this.isInitialized = true;
      console.log('✅ AI model initialized successfully');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to initialize AI model:', errorMessage);
      this.model = null;
      this.isInitialized = false;
      console.log('ℹ️ Using mock responses for all AI features');
      return false;
    }
  }

  async generateItinerary(request: ItineraryRequest): Promise<string> {
    const requestId = Math.random().toString(36).substring(2, 8);
    const log = (message: string, ...args: any[]) => 
      console.log(`[${requestId}] ${message}`, ...args);
    
    log(`Starting itinerary generation for user ${request.userId}`, {
      destination: request.destination,
      duration: request.duration,
      interests: request.interests,
      budget: request.budget
    });
    
    try {
      // Initialize if needed
      if (!this.isInitialized) {
        log('Initializing AI service...');
        const initialized = await this.initialize();
        if (!initialized) {
          log('Using mock response due to initialization failure');
          return this.generateMockItinerary(request);
        }
      }

      // Check rate limits
      this.checkRateLimit(request.userId);
      
      // Try to get from cache first
      const cacheKey = this.getCacheKey(request);
      const cachedResponse = this.cache.get(cacheKey);
      if (cachedResponse) {
        log('Returning cached response');
        return cachedResponse;
      }

      // Try to get from database
      try {
        log('Checking database for existing itinerary');
        const dbItinerary = await this.getItineraryFromDb(request);
        if (dbItinerary?.content) {
          log('Found existing itinerary in database');
          this.cache.set(cacheKey, dbItinerary.content);
          return dbItinerary.content;
        }
      } catch (dbError) {
        log('Error fetching from database, will continue:', dbError);
        // Continue with generation if DB fetch fails
      }

      // If model failed to initialize, return a mock response
      if (!this.model) {
        log('AI model not available, returning mock response');
        return this.generateMockItinerary(request);
      }

      log('Generating new AI itinerary');
      const prompt = await this.buildPrompt(request);
      log('Generated prompt:', prompt.substring(0, 150) + '...');
      
      try {
        log('Calling AI model with timeout...');
        const output = await Promise.race<AIModelResponse>([
          this.model(prompt, {
            max_new_tokens: this.MODEL_CONFIG.max_new_tokens,
            temperature: this.MODEL_CONFIG.temperature,
            do_sample: this.MODEL_CONFIG.do_sample,
            top_k: this.MODEL_CONFIG.top_k,
            top_p: this.MODEL_CONFIG.top_p,
          }),
          new Promise<AIModelResponse>((_, reject) => 
            setTimeout(() => reject(new Error('AI model generation timed out')), this.MODEL_CONFIG.timeout)
          )
        ]);
        
        if (!output?.[0]?.generated_text) {
          throw new Error('Empty or invalid response from AI model');
        }
        
        const content = output[0].generated_text;
        log('Successfully generated itinerary content');
        
        // Cache the response
        this.cache.set(cacheKey, content);
        
        // Save to database in the background (don't wait for it)
        this.saveItineraryToDb({
          ...request,
          content,
        }).catch(dbError => {
          log('Failed to save itinerary to DB (non-critical):', dbError);
        });
        
        return content;
      } catch (modelError) {
        log('Error generating with AI model:', modelError);
        return this.generateMockItinerary(request);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log('Error in generateItinerary:', errorMessage);
      
      if (error instanceof Error && error.stack) {
        log('Error stack:', error.stack.split('\n').slice(0, 3).join('\n') + '...');
      }
      
      // Return mock response on error
      log('Falling back to mock response due to error');
      return this.generateMockItinerary(request);
    }
  }

  private async getItineraryFromDb(request: ItineraryRequest): Promise<{ content: string } | null> {
    try {
      const result = await db.execute(sql`
        SELECT content 
        FROM itineraries 
        WHERE 
          user_id = ${request.userId} AND 
          destination = ${request.destination} AND 
          duration = ${request.duration}
        LIMIT 1
      `);
      
      const rows = result.rows as Array<{ content: string }>;
      return rows[0] || null;
    } catch (error) {
      console.error('[AIService] Error fetching itinerary from DB:', error);
      return null;
    }
  }

  private async saveItineraryToDb(itinerary: CreateItinerary): Promise<void> {
    try {
      await db.execute(sql`
        INSERT INTO itineraries (
          user_id, 
          destination, 
          duration, 
          interests, 
          budget, 
          content
        ) VALUES (
          ${itinerary.userId},
          ${itinerary.destination},
          ${itinerary.duration},
          ${JSON.stringify(itinerary.interests)}::text[],
          ${itinerary.budget},
          ${itinerary.content}
        )
      `);
      console.log('[AIService] Successfully saved itinerary to database');
    } catch (error) {
      console.error('[AIService] Error saving itinerary to DB:', error);
      throw error; // Re-throw to be handled by the caller
    }
  }

  private checkRateLimit(userId: number): void {
    const now = Date.now();
    const userLimit = this.rateLimitMap.get(userId) || { 
      lastRequest: 0, 
      count: 0 
    };

    // Reset counter if window has passed
    if (now - userLimit.lastRequest > this.RATE_LIMIT.WINDOW_MS) {
      userLimit.count = 0;
      userLimit.lastRequest = now;
    }

    // Check if user has exceeded rate limit
    if (userLimit.count >= this.RATE_LIMIT.MAX_REQUESTS) {
      const timeLeft = Math.ceil((userLimit.lastRequest + this.RATE_LIMIT.WINDOW_MS - now) / 1000 / 60);
      throw new Error(`Rate limit exceeded. Please try again in ${timeLeft} minutes.`);
    }

    // Increment counter
    userLimit.count++;
    this.rateLimitMap.set(userId, userLimit);
  }

  private getCacheKey(request: ItineraryRequest): string {
    const str = JSON.stringify({
      userId: request.userId,
      destination: request.destination.toLowerCase().trim(),
      duration: request.duration,
      interests: [...request.interests].sort()
    });
    
    return createHash('md5').update(str).digest('hex');
  }

  private async buildPrompt(request: ItineraryRequest): Promise<string> {
    // Simplified prompt for better performance with smaller models
    return `
    Create a travel itinerary with these details:
    Destination: ${request.destination}
    Duration: ${request.duration} days
    Interests: ${request.interests.join(', ')}
    Budget: ${request.budget}
    
    Return the response in this format:
    
    # ${request.destination} Itinerary (${request.duration} days)
    
    ## Day 1: [Main Activity]
    - Morning: [Activity]
    - Afternoon: [Activity]
    - Evening: [Dinner Suggestion]
    
    [Repeat for each day]
    
    ## Travel Tips
    - [Tip 1]
    - [Tip 2]
    
    ## Estimated Costs
    - [Category]: [Amount]
    
    Keep the response concise and focused on the destination and activities.`;
  }
  
  private generateMockItinerary(request: ItineraryRequest): string {
    console.log('[AIService] Generating mock itinerary');
    return `# Your ${request.duration}-Day Trip to ${request.destination}

## Day 1: Arrival
- Arrive in ${request.destination}
- Check into your accommodation
- Explore the local area
- Dinner at a local restaurant

## Day 2: Sightseeing
- Morning: Visit popular attractions
- Afternoon: ${request.interests.length > 0 ? `Enjoy ${request.interests.join(', ')} activities` : 'Free time to explore'}
- Evening: Relax at your accommodation

## Day 3: Departure
- Breakfast at the hotel
- Check out and head to the airport

This is a mock itinerary. The AI model is not currently available. Please check your internet connection and try again later.`;
  }
}

// Initialize the service when imported with better error handling
const aiService = AIService.getInstance();

// Don't block the main thread, but log initialization status
aiService.initialize()
  .then(initialized => {
    if (initialized) {
      console.log('✅ AI service initialized successfully');
    } else {
      console.warn('⚠️ AI service initialized with mock responses');
    }
  })
  .catch(error => {
    console.error('❌ Failed to initialize AI service:', error instanceof Error ? error.message : 'Unknown error');
  });

export default aiService;
