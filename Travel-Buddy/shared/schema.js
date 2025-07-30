"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertReviewSchema = exports.reviews = exports.insertMessageSchema = exports.messages = exports.insertItinerarySchema = exports.itineraries = exports.insertTripPreferenceSchema = exports.tripPreferences = exports.insertAgentProfileSchema = exports.agentProfiles = exports.insertUserSchema = exports.users = exports.UserRole = exports.budgetEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
var zod_1 = require("zod");
// Enums
exports.budgetEnum = (0, pg_core_1.pgEnum)('budget', ['low', 'medium', 'high']);
var UserRole;
(function (UserRole) {
    UserRole["TRAVELER"] = "traveler";
    UserRole["AGENT"] = "agent";
})(UserRole || (exports.UserRole = UserRole = {}));
// User schema
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    fullName: (0, pg_core_1.text)("full_name").notNull(),
    role: (0, pg_core_1.text)("role").notNull(),
    profilePicture: (0, pg_core_1.text)("profile_picture"),
    bio: (0, pg_core_1.text)("bio"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    username: true,
    password: true,
    email: true,
    fullName: true,
    role: true,
    profilePicture: true,
    bio: true,
});
// Agent profile schema
exports.agentProfiles = (0, pg_core_1.pgTable)("agent_profiles", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    specialization: (0, pg_core_1.text)("specialization").notNull(),
    languages: (0, pg_core_1.text)("languages").array().notNull(),
    experience: (0, pg_core_1.integer)("experience").notNull(), // in years
    regions: (0, pg_core_1.text)("regions").array().notNull(),
    travelStyles: (0, pg_core_1.text)("travel_styles").array().notNull(),
    rating: (0, pg_core_1.integer)("rating"),
    reviewCount: (0, pg_core_1.integer)("review_count").default(0),
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
});
var baseAgentProfileSchema = (0, drizzle_zod_1.createInsertSchema)(exports.agentProfiles).pick({
    userId: true,
    specialization: true,
    languages: true,
    regions: true,
    travelStyles: true,
    rating: true,
    reviewCount: true,
    isVerified: true,
});
exports.insertAgentProfileSchema = baseAgentProfileSchema.extend({
    experience: zod_1.z.union([
        zod_1.z.number().int().positive(),
        zod_1.z.string().transform(function (val) { return parseInt(val, 10); }),
    ]),
});
// Trip preferences schema
exports.tripPreferences = (0, pg_core_1.pgTable)("trip_preferences", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    travelerId: (0, pg_core_1.integer)("traveler_id").notNull(),
    destination: (0, pg_core_1.text)("destination").notNull(),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date").notNull(),
    budget: (0, exports.budgetEnum)("budget").notNull(),
    travelStyles: (0, pg_core_1.text)("travel_styles").array().notNull(),
    additionalInfo: (0, pg_core_1.text)("additional_info"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.insertTripPreferenceSchema = (0, drizzle_zod_1.createInsertSchema)(exports.tripPreferences).pick({
    travelerId: true,
    destination: true,
    startDate: true,
    endDate: true,
    budget: true,
    travelStyles: true,
    additionalInfo: true
});
// Itinerary schema
exports.itineraries = (0, pg_core_1.pgTable)("itineraries", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    travelerId: (0, pg_core_1.integer)("traveler_id").notNull(),
    agentId: (0, pg_core_1.integer)("agent_id").notNull(),
    tripPreferenceId: (0, pg_core_1.integer)("trip_preference_id").notNull(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    totalPrice: (0, pg_core_1.integer)("total_price").notNull(),
    status: (0, pg_core_1.text)("status").notNull(), // draft, proposed, confirmed, completed, cancelled
    details: (0, pg_core_1.json)("details").notNull(), // Array of day-by-day activities
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.insertItinerarySchema = (0, drizzle_zod_1.createInsertSchema)(exports.itineraries).pick({
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
exports.messages = (0, pg_core_1.pgTable)("messages", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    senderId: (0, pg_core_1.integer)("sender_id").notNull(),
    receiverId: (0, pg_core_1.integer)("receiver_id").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    isRead: (0, pg_core_1.boolean)("is_read").default(false),
    sentAt: (0, pg_core_1.timestamp)("sent_at").defaultNow(),
});
exports.insertMessageSchema = (0, drizzle_zod_1.createInsertSchema)(exports.messages).pick({
    senderId: true,
    receiverId: true,
    content: true,
    isRead: true,
});
// Reviews schema
exports.reviews = (0, pg_core_1.pgTable)("reviews", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    agentId: (0, pg_core_1.integer)("agent_id").notNull(),
    rating: (0, pg_core_1.integer)("rating").notNull(),
    comment: (0, pg_core_1.text)("comment"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.insertReviewSchema = (0, drizzle_zod_1.createInsertSchema)(exports.reviews).pick({
    userId: true,
    agentId: true,
    rating: true,
    comment: true,
});
