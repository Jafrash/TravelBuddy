import { users, type User, type InsertUser, AgentProfile, InsertAgentProfile, TripPreference, InsertTripPreference, Itinerary, InsertItinerary, Message, InsertMessage, Review, InsertReview } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private agentProfiles: Map<number, AgentProfile>;
  private tripPreferences: Map<number, TripPreference>;
  private itineraries: Map<number, Itinerary>;
  private messages: Map<number, Message>;
  private reviews: Map<number, Review>;
  
  userCurrentId: number;
  agentProfileCurrentId: number;
  tripPreferenceCurrentId: number;
  itineraryCurrentId: number;
  messageCurrentId: number;
  reviewCurrentId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.agentProfiles = new Map();
    this.tripPreferences = new Map();
    this.itineraries = new Map();
    this.messages = new Map();
    this.reviews = new Map();
    
    this.userCurrentId = 1;
    this.agentProfileCurrentId = 1;
    this.tripPreferenceCurrentId = 1;
    this.itineraryCurrentId = 1;
    this.messageCurrentId = 1;
    this.reviewCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Add some initial data for demo purposes
    this.initializeData();
  }
  
  private initializeData() {
    // This will run after the database is ready to provide some initial data
    // Implementing this is optional
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Agent profiles
  async getAgents(): Promise<(AgentProfile & User)[]> {
    const agents = Array.from(this.agentProfiles.values());
    return Promise.all(
      agents.map(async (profile) => {
        const user = await this.getUser(profile.userId);
        if (!user) throw new Error("User not found");
        return { ...profile, ...user };
      })
    );
  }

  async getAgentById(id: number): Promise<(AgentProfile & User) | undefined> {
    const agentProfile = Array.from(this.agentProfiles.values()).find(
      (profile) => profile.userId === id
    );
    
    if (!agentProfile) return undefined;
    
    const user = await this.getUser(agentProfile.userId);
    if (!user) return undefined;
    
    return { ...agentProfile, ...user };
  }

  async createAgentProfile(profile: InsertAgentProfile): Promise<AgentProfile> {
    const id = this.agentProfileCurrentId++;
    const agentProfile: AgentProfile = { ...profile, id };
    this.agentProfiles.set(id, agentProfile);
    return agentProfile;
  }
  
  async updateAgentRating(agentId: number): Promise<void> {
    const reviews = Array.from(this.reviews.values()).filter(
      (review) => review.agentId === agentId
    );
    
    if (reviews.length === 0) return;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round(totalRating / reviews.length);
    
    const agentProfile = Array.from(this.agentProfiles.values()).find(
      (profile) => profile.userId === agentId
    );
    
    if (agentProfile) {
      const updatedProfile = { 
        ...agentProfile, 
        rating: averageRating,
        reviewCount: reviews.length
      };
      this.agentProfiles.set(agentProfile.id, updatedProfile);
    }
  }
  
  // Trip preferences
  async createTripPreference(preference: InsertTripPreference): Promise<TripPreference> {
    const id = this.tripPreferenceCurrentId++;
    const createdAt = new Date();
    const tripPreference: TripPreference = { ...preference, id, createdAt };
    this.tripPreferences.set(id, tripPreference);
    return tripPreference;
  }

  async getTripPreferencesByTravelerId(travelerId: number): Promise<TripPreference[]> {
    return Array.from(this.tripPreferences.values()).filter(
      (preference) => preference.travelerId === travelerId
    );
  }

  async getAllTripPreferences(): Promise<TripPreference[]> {
    return Array.from(this.tripPreferences.values());
  }
  
  // Itineraries
  async createItinerary(itinerary: InsertItinerary): Promise<Itinerary> {
    const id = this.itineraryCurrentId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const newItinerary: Itinerary = { ...itinerary, id, createdAt, updatedAt };
    this.itineraries.set(id, newItinerary);
    return newItinerary;
  }

  async getItineraryById(id: number): Promise<Itinerary | undefined> {
    return this.itineraries.get(id);
  }

  async getItinerariesByTravelerId(travelerId: number): Promise<Itinerary[]> {
    return Array.from(this.itineraries.values()).filter(
      (itinerary) => itinerary.travelerId === travelerId
    );
  }

  async getItinerariesByAgentId(agentId: number): Promise<Itinerary[]> {
    return Array.from(this.itineraries.values()).filter(
      (itinerary) => itinerary.agentId === agentId
    );
  }

  async updateItinerary(id: number, data: Partial<Itinerary>): Promise<Itinerary> {
    const itinerary = this.itineraries.get(id);
    if (!itinerary) {
      throw new Error("Itinerary not found");
    }
    
    const updatedItinerary = { 
      ...itinerary, 
      ...data,
      updatedAt: new Date()
    };
    
    this.itineraries.set(id, updatedItinerary);
    return updatedItinerary;
  }
  
  // Messages
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const sentAt = new Date();
    const newMessage: Message = { ...message, id, sentAt };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMessagesByUserId(userId: number, receiverId?: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter((message) => {
      if (receiverId) {
        return (message.senderId === userId && message.receiverId === receiverId) ||
               (message.senderId === receiverId && message.receiverId === userId);
      }
      return message.senderId === userId || message.receiverId === userId;
    }).sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
  }
  
  // Reviews
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewCurrentId++;
    const createdAt = new Date();
    const newReview: Review = { ...review, id, createdAt };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async getReviewsByAgentId(agentId: number): Promise<(Review & { traveler: Pick<User, 'fullName' | 'profilePicture'> })[]> {
    const reviews = Array.from(this.reviews.values()).filter(
      (review) => review.agentId === agentId
    );
    
    return Promise.all(
      reviews.map(async (review) => {
        const traveler = await this.getUser(review.travelerId);
        return {
          ...review,
          traveler: {
            fullName: traveler?.fullName || "Unknown User",
            profilePicture: traveler?.profilePicture || ""
          }
        };
      })
    );
  }
}

export const storage = new MemStorage();
