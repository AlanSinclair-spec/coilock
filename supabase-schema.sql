-- Create early_access table for email collection
CREATE TABLE IF NOT EXISTS early_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  monthly_installs VARCHAR(20),
  ab_test_version VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_early_access_email ON early_access(email);
CREATE INDEX IF NOT EXISTS idx_early_access_created_at ON early_access(created_at);

-- Disable Row Level Security for now to allow inserts
ALTER TABLE early_access DISABLE ROW LEVEL SECURITY;

-- Optional: Create analytics_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);

-- Enable RLS for analytics
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert and read analytics
CREATE POLICY "Allow service role analytics access" ON analytics_events
  FOR ALL USING (auth.role() = 'service_role');

-- Optional: Create blocked_transactions table for webhook logging
CREATE TABLE IF NOT EXISTS blocked_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for blocked transactions
ALTER TABLE blocked_transactions ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage blocked transactions
CREATE POLICY "Allow service role blocked transactions access" ON blocked_transactions
  FOR ALL USING (auth.role() = 'service_role');
