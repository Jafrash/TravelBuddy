import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export enum UserRole {
  TRAVELER = "traveler",
  AGENT = "agent"
}

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  profilePicture: true,
  bio: true,
});

// Agent profile schema
export const agentProfiles = pgTable("agent_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  specialization: text("specialization").notNull(),
  languages: text("languages").array().notNull(),
  experience: integer("experience").notNull(), // in years
  regions: text("regions").array().notNull(),
  travelStyles: text("travel_styles").array().notNull(),
  rating: integer("rating"),
  reviewCount: integer("review_count").default(0),
  isVerified: boolean("is_verified").default(false),
});

export const insertAgentProfileSchema = createInsertSchema(agentProfiles).pick({
  userId: true,
  specialization: true,
  languages: true,
  experience: true,
  regions: true,
  travelStyles: true,
  rating: true,
  reviewCount: true,
  isVerified: true,
});

// Trip preferences schema
export const tripPreferences = pgTable("trip_preferences", {
  id: serial("id").primaryKey(),
  travelerId: integer("traveler_id").notNull(),
  destination: text("destination").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  budget: text("budget").notNull(),
  travelStyles: text("travel_styles").array().notNull(),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTripPreferenceSchema = createInsertSchema(tripPreferences).pick({
  travelerId: true,
  destination: true,
  startDate: true,
  endDate: true,
  budget: true,
  travelStyles: true,
  additionalInfo: true,
});

// Itinerary schema
export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  travelerId: integer("traveler_id").notNull(),
  agentId: integer("agent_id").notNull(),
  tripPreferenceId: integer("trip_preference_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull(), // draft, proposed, confirmed, completed, cancelled
  details: json("details").notNull(), // Array of day-by-day activities
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertItinerarySchema = createInsertSchema(itineraries).pick({
  travelerId: true,
  agentId: true,
  tripPreferenceId: true,
  title: true,
  description: true,
  totalPrice: true,
  status: true,
  details: true,
});

// Messages schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  sentAt: timestamp("sent_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  receiverId: true,
  content: true,
  isRead: true,
});

// Reviews schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  travelerId: integer("traveler_id").notNull(),
  agentId: integer("agent_id").notNull(),
  itineraryId: integer("itinerary_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  travelerId: true,
  agentId: true,
  itineraryId: true,
  rating: true,
  comment: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type AgentProfile = typeof agentProfiles.$inferSelect;
export type InsertAgentProfile = z.infer<typeof insertAgentProfileSchema>;

export type TripPreference = typeof tripPreferences.$inferSelect;
export type InsertTripPreference = z.infer<typeof insertTripPreferenceSchema>;

export type Itinerary = typeof itineraries.$inferSelect;
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
