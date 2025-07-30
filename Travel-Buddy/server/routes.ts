import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";

declare global {
  namespace Express {
    interface User {
      id: string | number;
      role: string;
    }
    interface Request {
      user?: User;
      isAuthenticated(): this is { user: User };
    }
  }
}
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTripPreferenceSchema, insertItinerarySchema, insertMessageSchema, insertReviewSchema, insertAgentProfileSchema } from "@shared/schema";
import { z } from "zod";
import { WebSocketServer, WebSocket } from "ws";
import { placesService } from "./services/places";
import axios from 'axios';

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple API documentation endpoint for developers
  app.get("/api/docs", (req, res) => {
    res.json({
      message: "TravelBuddy API Documentation",
      version: "1.0.0",
      endpoints: [
        { path: "/api/health", method: "GET", description: "API health check" },
        { path: "/api/agents", method: "GET", description: "Get all travel agents" },
        { path: "/api/user", method: "GET", description: "Get current authenticated user" },
        { path: "/api/trip-preferences", method: "GET", description: "Get trip preferences" },
        { path: "/api/itineraries", method: "GET", description: "Get itineraries" }
      ]
    });
  });

  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Simple health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Places API - Handle both GET and POST requests
  app.all("/api/places/search", async (req, res) => {
    try {
      let query, city;
      
      // Handle both GET and POST requests
      if (req.method === 'GET') {
        query = req.query.q;
        city = req.query.city || req.query.q; // For backward compatibility
      } else if (req.method === 'POST') {
        query = req.body.query;
        city = req.body.city || req.body.query;
      } else {
        return res.status(405).json({ 
          success: false,
          message: 'Method not allowed. Use GET or POST.'
        });
      }
      
      if (!city || typeof city !== 'string') {
        return res.status(400).json({ 
          success: false,
          message: 'City name is required',
          received: { query, city }
        });
      }

      console.log(`[API] Searching for places in: ${city}`);
      
      try {
        const cityInfo = await placesService.getCityPlaces(city);
        
        if (!cityInfo) {
          console.log(`[API] No places found for: ${city}`);
          return res.status(200).json({ 
            success: true, 
            message: 'No places found for the specified location',
            data: {
              name: city.split(',')[0],
              description: `Explore the beautiful city of ${city.split(',')[0]}, known for its rich culture, history, and attractions.`,
              bestTimeToVisit: 'The best time to visit is during spring (March to May) and fall (September to November) when the weather is pleasant.',
              places: []
            }
          });
        }

        console.log(`[API] Found ${cityInfo.places.length} places for: ${city}`);
        return res.json({
          success: true,
          data: cityInfo
        });
        
      } catch (serviceError) {
        console.error('[API] Service error:', serviceError);
        throw serviceError; // This will be caught by the outer catch
      }
      
    } catch (error: unknown) {
      console.error('[API] Error in places search:', error);
      
      // More detailed error response
      const errorResponse: {
        success: boolean;
        message: string;
        details: {
          message?: string;
          name?: string;
          status?: number;
          statusText?: string;
          data?: any;
        };
      } = {
        success: false,
        message: 'Failed to search places',
        details: {}
      };
      
      if (error instanceof Error) {
        errorResponse.details.message = error.message;
        errorResponse.details.name = error.name;
        
        // Check if it's an Axios error
        if (axios.isAxiosError(error)) {
          errorResponse.details.status = error.response?.status;
          errorResponse.details.statusText = error.response?.statusText;
          errorResponse.details.data = error.response?.data;
        }
      }
      
      res.status(500).json(errorResponse);
      return; // <-- ensure return
    }
  });

  // API routes
  // Agent profiles
  app.get("/api/agents", async (_req, res) => { // removed unused req
    try {
      const agents = await storage.getAgents();
      return res.json(agents);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const agent = await storage.getAgentById(id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      return res.json(agent);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch agent" });
    }
  });

  app.post("/api/agents", async (req: Request, res: Response) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user.role !== "agent") {
      return res.status(403).json({ message: "Forbidden: Agent role required" });
    }
    
    try {
      const data = insertAgentProfileSchema.parse(req.body);
      const agentProfile = await storage.createAgentProfile({
        ...data,
        userId: parseInt(String(req.user.id), 10),
      });
      return res.status(201).json(agentProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid agent profile data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create agent profile" });
    }
  });

  // Trip preferences
  app.post("/api/trip-preferences", async (req, res) => {
    if (!req.isAuthenticated() || !req.user || req.user.role !== "traveler") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const data = insertTripPreferenceSchema.parse(req.body);
      const tripPreference = await storage.createTripPreference({
        ...data,
        travelerId: parseInt(String(req.user.id), 10),
      });
      return res.status(201).json(tripPreference);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trip preference data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create trip preference" });
    }
  });

  app.get("/api/trip-preferences", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      let tripPreferences;
      if (req.user.role === "traveler") {
        tripPreferences = await storage.getTripPreferencesByTravelerId(parseInt(String(req.user.id), 10));
      } else if (req.user.role === "agent") {
        tripPreferences = await storage.getAllTripPreferences();
      }
      return res.json(tripPreferences);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch trip preferences" });
    }
  });

  // Itineraries
  app.post("/api/itineraries", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "agent") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const data = insertItinerarySchema.parse(req.body);
      const itinerary = await storage.createItinerary({
        ...data,
        agentId: parseInt(String(req.user.id), 10),
      });
      return res.status(201).json(itinerary);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid itinerary data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create itinerary" });
    }
  });

  app.get("/api/itineraries", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      let itineraries;
      if (req.user.role === "traveler") {
        itineraries = await storage.getItinerariesByTravelerId(parseInt(String(req.user.id), 10));
      } else if (req.user.role === "agent") {
        itineraries = await storage.getItinerariesByAgentId(parseInt(String(req.user.id), 10));
      }
      return res.json(itineraries);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch itineraries" });
    }
  });

  app.get("/api/itineraries/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid itinerary ID" });
      }

      const itinerary = await storage.getItineraryById(id);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      // Check if the user is authorized to access this itinerary
      if (req.user.role === "traveler" && itinerary.travelerId !== parseInt(String(req.user.id), 10)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (req.user.role === "agent" && itinerary.agentId !== parseInt(String(req.user.id), 10)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      return res.json(itinerary);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      return res.status(500).json({ message: "Failed to fetch itinerary" });
    }
  });

  app.patch("/api/itineraries/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid itinerary ID" });
      }

      const itinerary = await storage.getItineraryById(id);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      // Only the agent can update the itinerary
      if (req.user.role !== "agent" || itinerary.agentId !== parseInt(String(req.user.id), 10)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedItinerary = await storage.updateItinerary(id, req.body);
      return res.json(updatedItinerary);
    } catch (error) {
      console.error('Error updating itinerary:', error);
      return res.status(500).json({ message: "Failed to update itinerary" });
    }
  });

  // Messages
  app.post("/api/messages", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const senderId = parseInt(String(req.user.id), 10);
      if (isNaN(senderId)) {
        return res.status(400).json({ message: "Invalid sender ID" });
      }

      const data = insertMessageSchema.parse({
        ...req.body,
        senderId,
      });
      
      const message = await storage.createMessage(data);
      return res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid message data", 
          errors: error.errors 
        });
      }
      console.error('Error sending message:', error);
      return res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/messages", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = parseInt(String(req.user.id), 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const receiverId = req.query.receiverId ? parseInt(req.query.receiverId as string, 10) : undefined;
      if (receiverId !== undefined && isNaN(receiverId)) {
        return res.status(400).json({ message: "Invalid receiver ID" });
      }
      
      const messages = await storage.getMessagesByUserId(userId, receiverId);
      return res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Reviews
  app.post("/api/reviews", async (req: Request, res: Response) => {
    if (!req.isAuthenticated() || req.user.role !== "traveler") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const travelerId = parseInt(String(req.user.id), 10);
      if (isNaN(travelerId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const reviewData = {
        ...req.body,
        userId: travelerId
      };
      
      const data = insertReviewSchema.parse(reviewData);
      
      // Get all itineraries for this traveler
      const itineraries = await storage.getItinerariesByTravelerId(travelerId);
      
      // Check if the traveler has worked with this agent
      const hasWorkedWithAgent = itineraries.some(
        it => it.agentId === data.agentId
      );
      
      if (!hasWorkedWithAgent) {
        return res.status(403).json({ message: "You can only review agents you've worked with" });
      }

      const review = await storage.createReview(data);
      
      // Update agent's rating
      await storage.updateAgentRating(data.agentId);
      
      return res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get("/api/reviews/agent/:agentId", async (req, res) => {
    try {
      const agentId = parseInt(req.params.agentId);
      const reviews = await storage.getReviewsByAgentId(agentId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Client connection mapping
  const clients = new Map<number, WebSocket>();
  
  wss.on('connection', (ws /*, req*/) => { // removed unused req
    console.log('WebSocket client connected');
    
    // Handle receiving messages
    ws.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        
        // Expected message format: { type: 'auth', userId: number } or { type: 'message', to: number, content: string }
        if (parsedMessage.type === 'auth') {
          // Authenticate and store the connection
          const userId = parsedMessage.userId;
          if (userId) {
            clients.set(userId, ws);
            console.log(`User ${userId} authenticated on WebSocket`);
            
            // Send confirmation
            ws.send(JSON.stringify({ 
              type: 'auth_success', 
              message: 'Authentication successful' 
            }));
          }
        } else if (parsedMessage.type === 'message') {
          // Process and store the message
          if (!parsedMessage.senderId || !parsedMessage.receiverId || !parsedMessage.content) {
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: 'Invalid message format' 
            }));
            return;
          }
          
          // Store message in database
          const messageData = {
            senderId: parsedMessage.senderId,
            receiverId: parsedMessage.receiverId,
            content: parsedMessage.content,
            isRead: false
          };
          
          const savedMessage = await storage.createMessage(messageData);
          
          // Format the message for sending
          const outgoingMessage = {
            type: 'new_message',
            message: savedMessage
          };
          
          // Send to recipient if they're connected
          const recipientWs = clients.get(parsedMessage.receiverId);
          if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
            recipientWs.send(JSON.stringify(outgoingMessage));
          }
          
          // Send confirmation to sender
          ws.send(JSON.stringify({
            type: 'message_sent',
            messageId: savedMessage.id
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Failed to process message' 
        }));
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      // Remove client from the connections map
      clients.forEach((client, userId) => {
        if (client === ws) {
          clients.delete(userId);
          console.log(`User ${userId} disconnected from WebSocket`);
        }
      });
    });
  });

  return httpServer;
}
