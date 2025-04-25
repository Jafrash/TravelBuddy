import { db } from "./db";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { users, agentProfiles, UserRole } from "@shared/schema";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase(force = false) {
  console.log("🌱 Starting database seeding...");

  // Check if we already have agent users
  const existingAgents = await db.select().from(users).where(eq(users.role, "agent"));
  
  if (existingAgents.length > 0 && !force) {
    console.log("✅ Database already has agent data. Skipping seed.");
    return;
  }
  
  // If force is true, we'll delete existing agent data first
  if (force && existingAgents.length > 0) {
    console.log("🗑️ Force flag set. Removing existing agent data...");
    
    // Get all agent user IDs
    const agentIds = existingAgents.map(agent => agent.id);
    
    // Delete agent profiles first (due to foreign key constraints)
    if (agentIds.length > 0) {
      // Delete agent profiles linked to these users
      for (const agentId of agentIds) {
        await db.delete(agentProfiles).where(eq(agentProfiles.userId, agentId));
      }
    }
    
    // Delete agent users
    await db.delete(users).where(eq(users.role, "agent"));
    
    console.log("✅ Existing agent data removed.");
  }

  // Sample agent data with profiles
  const agentData = [
    {
      user: {
        username: "japanadventures",
        password: await hashPassword("password123"),
        email: "akiko@travels.example",
        fullName: "Akiko Tanaka",
        role: UserRole.AGENT,
        profilePicture: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop",
        bio: "Japan travel specialist with 8 years of experience. Born and raised in Tokyo."
      },
      profile: {
        specialization: "Japan Excursions",
        experience: 8,
        rating: 5, // Rounded from 4.8 to match integer schema
        languages: ["English", "Japanese"],
        regions: ["Japan", "South Korea", "Taiwan"],
        travelStyles: ["Cultural", "Culinary", "Adventure"],
        priceRange: "$$$"
      }
    },
    {
      user: {
        username: "eurotraveller",
        password: await hashPassword("password123"),
        email: "pierre@travels.example",
        fullName: "Pierre Dubois",
        role: UserRole.AGENT,
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
        bio: "European travel expert with deep knowledge of hidden gems across the continent."
      },
      profile: {
        specialization: "European Hidden Gems",
        experience: 12,
        rating: 5, // Rounded from 4.9 to match integer schema
        languages: ["English", "French", "Italian"],
        regions: ["France", "Italy", "Spain", "Portugal", "Greece"],
        travelStyles: ["Luxury", "Cultural", "Food & Wine"],
        priceRange: "$$$$"
      }
    },
    {
      user: {
        username: "safariseeker",
        password: await hashPassword("password123"),
        email: "amara@travels.example",
        fullName: "Amara Okafor",
        role: UserRole.AGENT,
        profilePicture: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&h=200&auto=format&fit=crop",
        bio: "Born and raised in Kenya, I specialize in authentic safari experiences across Africa."
      },
      profile: {
        specialization: "African Safaris",
        experience: 7,
        rating: 5, // Rounded from 4.7 to match integer schema
        languages: ["English", "Swahili"],
        regions: ["Kenya", "Tanzania", "South Africa", "Botswana", "Namibia"],
        travelStyles: ["Wildlife", "Adventure", "Photography"],
        priceRange: "$$$"
      }
    },
    {
      user: {
        username: "caribbeancruiser",
        password: await hashPassword("password123"),
        email: "miguel@travels.example",
        fullName: "Miguel Rodriguez",
        role: UserRole.AGENT,
        profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop",
        bio: "Caribbean specialist focusing on unique island experiences and cruises."
      },
      profile: {
        specialization: "Caribbean Islands",
        experience: 6,
        rating: 5, // Rounded from 4.5 to match integer schema
        languages: ["English", "Spanish"],
        regions: ["Cuba", "Jamaica", "Dominican Republic", "Bahamas", "Puerto Rico"],
        travelStyles: ["Beach", "Cruise", "All-Inclusive"],
        priceRange: "$$"
      }
    },
    {
      user: {
        username: "asiawanderer",
        password: await hashPassword("password123"),
        email: "lin@travels.example",
        fullName: "Lin Chen",
        role: UserRole.AGENT,
        profilePicture: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=200&h=200&auto=format&fit=crop",
        bio: "Southeast Asia expert specializing in authentic cultural experiences."
      },
      profile: {
        specialization: "Southeast Asia",
        experience: 9,
        rating: 5, // Rounded from 4.6 to match integer schema
        languages: ["English", "Mandarin", "Thai"],
        regions: ["Thailand", "Vietnam", "Cambodia", "Laos", "Indonesia"],
        travelStyles: ["Backpacking", "Cultural", "Adventure"],
        priceRange: "$$"
      }
    }
  ];

  // Insert agent users and profiles
  for (const agent of agentData) {
    // Insert the user first
    const [insertedUser] = await db.insert(users).values(agent.user).returning();
    
    // Then insert the agent profile with the user ID
    await db.insert(agentProfiles).values({
      ...agent.profile,
      userId: insertedUser.id
    });
    
    console.log(`✅ Created agent: ${agent.user.fullName}`);
  }

  console.log("✅ Database seeding completed successfully!");
}

// Only run the seeding when this script is executed directly
// In ESM, we can use import.meta.url === process.argv[1]
if (import.meta.url.startsWith('file:')) {
  const modulePath = import.meta.url.slice(process.platform === 'win32' ? 8 : 7);
  if (modulePath === process.argv[1]) {
    // Check if the force flag is provided
    const forceFlag = process.argv.includes('--force') || process.argv.includes('-f');
    
    seedDatabase(forceFlag)
      .then(() => process.exit(0))
      .catch((error) => {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
      });
  }
}

export { seedDatabase };