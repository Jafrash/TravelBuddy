-- Create the itineraries table
CREATE TABLE IF NOT EXISTS "itineraries" (
  id SERIAL PRIMARY KEY,
  "travelerId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "agentId" INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "totalPrice" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_itineraries_traveler_id ON "itineraries"("travelerId");
CREATE INDEX IF NOT EXISTS idx_itineraries_agent_id ON "itineraries"("agentId");
CREATE INDEX IF NOT EXISTS idx_itineraries_status ON "itineraries"(status);
CREATE INDEX IF NOT EXISTS idx_itineraries_created_at ON "itineraries"("createdAt");

-- Create a GIN index for JSONB queries on the details field
CREATE INDEX IF NOT EXISTS idx_itineraries_details_gin ON "itineraries" USING GIN (details jsonb_path_ops);

-- Create a function to update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updatedAt column
CREATE TRIGGER update_itineraries_updated_at
BEFORE UPDATE ON "itineraries"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
