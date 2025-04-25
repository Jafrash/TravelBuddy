import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTripPreferenceSchema, insertItinerarySchema, insertMessageSchema, insertReviewSchema, insertAgentProfileSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function registerRoutes(app: Express): Promise<Server> {
  // Add a direct landing page for connectivity testing
  app.get("/connectivity-test", (req, res) => {
    res.send(`
      <html>
        <head>
          <title>TravelBuddy - Connected!</title>
          <style>
            body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #2563eb; }
            .success { color: #10b981; font-weight: bold; }
            .info { background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>TravelBuddy Connectivity Test</h1>
          <p class="success">✓ Server is connected and responding!</p>
          
          <div class="info">
            <p>Current time: ${new Date().toLocaleString()}</p>
            <p>Server environment: ${process.env.NODE_ENV || 'development'}</p>
          </div>
          
          <h2>Available Test Endpoints:</h2>
          <ul>
            <li><a href="/api/health">API Health Check</a></li>
            <li><a href="/api/agents">List of Travel Agents</a></li>
          </ul>
        </body>
      </html>
    `);
  });
  
  // Add a fallback handler for root path
  app.get("/", (req, res) => {
    res.redirect("/connectivity-test");
  });

  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Simple health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API routes
  // Agent profiles
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const agent = await storage.getAgentById(id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent" });
    }
  });

  app.post("/api/agents", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "agent") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const data = insertAgentProfileSchema.parse(req.body);
      const agentProfile = await storage.createAgentProfile({
        ...data,
        userId: req.user.id,
      });
      res.status(201).json(agentProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid agent profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create agent profile" });
    }
  });

  // Trip preferences
  app.post("/api/trip-preferences", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "traveler") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const data = insertTripPreferenceSchema.parse(req.body);
      const tripPreference = await storage.createTripPreference({
        ...data,
        travelerId: req.user.id,
      });
      res.status(201).json(tripPreference);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trip preference data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create trip preference" });
    }
  });

  app.get("/api/trip-preferences", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      let tripPreferences;
      if (req.user.role === "traveler") {
        tripPreferences = await storage.getTripPreferencesByTravelerId(req.user.id);
      } else if (req.user.role === "agent") {
        tripPreferences = await storage.getAllTripPreferences();
      }
      res.json(tripPreferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trip preferences" });
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
        agentId: req.user.id,
      });
      res.status(201).json(itinerary);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid itinerary data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create itinerary" });
    }
  });

  app.get("/api/itineraries", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      let itineraries;
      if (req.user.role === "traveler") {
        itineraries = await storage.getItinerariesByTravelerId(req.user.id);
      } else if (req.user.role === "agent") {
        itineraries = await storage.getItinerariesByAgentId(req.user.id);
      }
      res.json(itineraries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch itineraries" });
    }
  });

  app.get("/api/itineraries/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      const itinerary = await storage.getItineraryById(id);

      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      // Check if the user is authorized to access this itinerary
      if (req.user.role === "traveler" && itinerary.travelerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (req.user.role === "agent" && itinerary.agentId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.json(itinerary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch itinerary" });
    }
  });

  app.patch("/api/itineraries/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      const itinerary = await storage.getItineraryById(id);

      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      // Only the agent can update the itinerary
      if (req.user.role !== "agent" || itinerary.agentId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedItinerary = await storage.updateItinerary(id, req.body);
      res.json(updatedItinerary);
    } catch (error) {
      res.status(500).json({ message: "Failed to update itinerary" });
    }
  });

  // Messages
  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const data = insertMessageSchema.parse({
        ...req.body,
        senderId: req.user.id,
      });
      const message = await storage.createMessage(data);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const receiverId = req.query.receiverId ? parseInt(req.query.receiverId as string) : undefined;
      const messages = await storage.getMessagesByUserId(req.user.id, receiverId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Reviews
  app.post("/api/reviews", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "traveler") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const data = insertReviewSchema.parse({
        ...req.body,
        travelerId: req.user.id,
      });
      
      // Verify the traveler has an itinerary with the agent
      const itinerary = await storage.getItineraryById(data.itineraryId);
      if (!itinerary || itinerary.travelerId !== req.user.id) {
        return res.status(403).json({ message: "You can only review agents you've worked with" });
      }

      const review = await storage.createReview(data);
      
      // Update agent's rating
      await storage.updateAgentRating(data.agentId);
      
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
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

  return httpServer;
}
