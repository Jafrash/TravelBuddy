-- Create the itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  destination VARCHAR(255) NOT NULL,
  duration INTEGER NOT NULL CHECK (duration > 0),
  interests TEXT[] NOT NULL,
  budget VARCHAR(50) NOT NULL CHECK (budget IN ('low', 'medium', 'high')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);

-- Create an index for faster lookups by destination
CREATE INDEX IF NOT EXISTS idx_itineraries_destination ON itineraries(destination);

-- Create a composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_itineraries_user_destination_duration 
  ON itineraries(user_id, destination, duration);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_itineraries_updated_at
BEFORE UPDATE ON itineraries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
