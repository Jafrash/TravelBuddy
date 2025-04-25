import { users, agentProfiles, tripPreferences, itineraries, messages, reviews, type User, type InsertUser, AgentProfile, InsertAgentProfile, TripPreference, InsertTripPreference, Itinerary, InsertItinerary, Message, InsertMessage, Review, InsertReview } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, and, or, desc } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Agent profiles
  getAgents(): Promise<(AgentProfile & User)[]>;
  getAgentById(id: number): Promise<(AgentProfile & User) | undefined>;
  createAgentProfile(profile: InsertAgentProfile): Promise<AgentProfile>;
  updateAgentRating(agentId: number): Promise<void>;
  
  // Trip preferences
  createTripPreference(preference: InsertTripPreference): Promise<TripPreference>;
  getTripPreferencesByTravelerId(travelerId: number): Promise<TripPreference[]>;
  getAllTripPreferences(): Promise<TripPreference[]>;
  
  // Itineraries
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;
  getItineraryById(id: number): Promise<Itinerary | undefined>;
  getItinerariesByTravelerId(travelerId: number): Promise<Itinerary[]>;
  getItinerariesByAgentId(agentId: number): Promise<Itinerary[]>;
  updateItinerary(id: number, data: Partial<Itinerary>): Promise<Itinerary>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByUserId(userId: number, receiverId?: number): Promise<Message[]>;
  
  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByAgentId(agentId: number): Promise<(Review & { traveler: Pick<User, 'fullName' | 'profilePicture'> })[]>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error retrieving user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error retrieving user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  // Agent profiles
  async getAgents(): Promise<(AgentProfile & User)[]> {
    try {
      const agentProfilesData = await db.select().from(agentProfiles);
      
      const agentsWithProfiles = await Promise.all(
        agentProfilesData.map(async (profile) => {
          const [user] = await db.select().from(users).where(eq(users.id, profile.userId));
          if (!user) throw new Error(`User not found for agent profile ID: ${profile.id}`);
          return { ...profile, ...user };
        })
      );
      
      return agentsWithProfiles;
    } catch (error) {
      console.error("Error retrieving agents:", error);
      return [];
    }
  }

  async getAgentById(id: number): Promise<(AgentProfile & User) | undefined> {
    try {
      const [agentProfile] = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, id));
      
      if (!agentProfile) return undefined;
      
      const [user] = await db.select().from(users).where(eq(users.id, agentProfile.userId));
      if (!user) return undefined;
      
      return { ...agentProfile, ...user };
    } catch (error) {
      console.error("Error retrieving agent by ID:", error);
      return undefined;
    }
  }

  async createAgentProfile(profile: InsertAgentProfile): Promise<AgentProfile> {
    try {
      const [agentProfile] = await db.insert(agentProfiles).values(profile).returning();
      return agentProfile;
    } catch (error) {
      console.error("Error creating agent profile:", error);
      throw error;
    }
  }
  
  async updateAgentRating(agentId: number): Promise<void> {
    try {
      const reviewsData = await db.select().from(reviews).where(eq(reviews.agentId, agentId));
      
      if (reviewsData.length === 0) return;
      
      const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = Math.round(totalRating / reviewsData.length);
      
      const [agentProfile] = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, agentId));
      
      if (agentProfile) {
        await db.update(agentProfiles)
          .set({ 
            rating: averageRating,
            reviewCount: reviewsData.length
          })
          .where(eq(agentProfiles.userId, agentId));
      }
    } catch (error) {
      console.error("Error updating agent rating:", error);
      throw error;
    }
  }
  
  // Trip preferences
  async createTripPreference(preference: InsertTripPreference): Promise<TripPreference> {
    try {
      const [tripPreference] = await db.insert(tripPreferences).values(preference).returning();
      return tripPreference;
    } catch (error) {
      console.error("Error creating trip preference:", error);
      throw error;
    }
  }

  async getTripPreferencesByTravelerId(travelerId: number): Promise<TripPreference[]> {
    try {
      return await db.select().from(tripPreferences).where(eq(tripPreferences.travelerId, travelerId));
    } catch (error) {
      console.error("Error retrieving trip preferences by traveler ID:", error);
      return [];
    }
  }

  async getAllTripPreferences(): Promise<TripPreference[]> {
    try {
      return await db.select().from(tripPreferences);
    } catch (error) {
      console.error("Error retrieving all trip preferences:", error);
      return [];
    }
  }
  
  // Itineraries
  async createItinerary(itinerary: InsertItinerary): Promise<Itinerary> {
    try {
      const [newItinerary] = await db.insert(itineraries).values(itinerary).returning();
      return newItinerary;
    } catch (error) {
      console.error("Error creating itinerary:", error);
      throw error;
    }
  }

  async getItineraryById(id: number): Promise<Itinerary | undefined> {
    try {
      const [itinerary] = await db.select().from(itineraries).where(eq(itineraries.id, id));
      return itinerary;
    } catch (error) {
      console.error("Error retrieving itinerary by ID:", error);
      return undefined;
    }
  }

  async getItinerariesByTravelerId(travelerId: number): Promise<Itinerary[]> {
    try {
      return await db.select().from(itineraries).where(eq(itineraries.travelerId, travelerId));
    } catch (error) {
      console.error("Error retrieving itineraries by traveler ID:", error);
      return [];
    }
  }

  async getItinerariesByAgentId(agentId: number): Promise<Itinerary[]> {
    try {
      return await db.select().from(itineraries).where(eq(itineraries.agentId, agentId));
    } catch (error) {
      console.error("Error retrieving itineraries by agent ID:", error);
      return [];
    }
  }

  async updateItinerary(id: number, data: Partial<Itinerary>): Promise<Itinerary> {
    try {
      const [itinerary] = await db.select().from(itineraries).where(eq(itineraries.id, id));
      
      if (!itinerary) {
        throw new Error("Itinerary not found");
      }
      
      const updatedData = { 
        ...data,
        updatedAt: new Date()
      };
      
      const [updatedItinerary] = await db.update(itineraries)
        .set(updatedData)
        .where(eq(itineraries.id, id))
        .returning();
      
      return updatedItinerary;
    } catch (error) {
      console.error("Error updating itinerary:", error);
      throw error;
    }
  }
  
  // Messages
  async createMessage(message: InsertMessage): Promise<Message> {
    try {
      const [newMessage] = await db.insert(messages).values(message).returning();
      return newMessage;
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }

  async getMessagesByUserId(userId: number, receiverId?: number): Promise<Message[]> {
    try {
      if (receiverId) {
        return await db.select()
          .from(messages)
          .where(
            or(
              and(
                eq(messages.senderId, userId),
                eq(messages.receiverId, receiverId)
              ),
              and(
                eq(messages.senderId, receiverId),
                eq(messages.receiverId, userId)
              )
            )
          )
          .orderBy(messages.sentAt);
      }
      
      return await db.select()
        .from(messages)
        .where(
          or(
            eq(messages.senderId, userId),
            eq(messages.receiverId, userId)
          )
        )
        .orderBy(messages.sentAt);
    } catch (error) {
      console.error("Error retrieving messages by user ID:", error);
      return [];
    }
  }
  
  // Reviews
  async createReview(review: InsertReview): Promise<Review> {
    try {
      const [newReview] = await db.insert(reviews).values(review).returning();
      return newReview;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  async getReviewsByAgentId(agentId: number): Promise<(Review & { traveler: Pick<User, 'fullName' | 'profilePicture'> })[]> {
    try {
      const reviewsData = await db.select().from(reviews).where(eq(reviews.agentId, agentId));
      
      return await Promise.all(
        reviewsData.map(async (review) => {
          const [traveler] = await db.select().from(users).where(eq(users.id, review.travelerId));
          return {
            ...review,
            traveler: {
              fullName: traveler?.fullName || "Unknown User",
              profilePicture: traveler?.profilePicture || ""
            }
          };
        })
      );
    } catch (error) {
      console.error("Error retrieving reviews by agent ID:", error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();
