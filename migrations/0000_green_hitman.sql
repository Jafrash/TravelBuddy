CREATE TABLE "agent_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"specialization" text NOT NULL,
	"languages" text[] NOT NULL,
	"experience" integer NOT NULL,
	"regions" text[] NOT NULL,
	"travel_styles" text[] NOT NULL,
	"rating" integer,
	"review_count" integer DEFAULT 0,
	"is_verified" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "itineraries" (
	"id" serial PRIMARY KEY NOT NULL,
	"traveler_id" integer NOT NULL,
	"agent_id" integer NOT NULL,
	"trip_preference_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"total_price" integer NOT NULL,
	"status" text NOT NULL,
	"details" json NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"sent_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"traveler_id" integer NOT NULL,
	"agent_id" integer NOT NULL,
	"itinerary_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trip_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"traveler_id" integer NOT NULL,
	"destination" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"budget" text NOT NULL,
	"travel_styles" text[] NOT NULL,
	"additional_info" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"role" text NOT NULL,
	"profile_picture" text,
	"bio" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
