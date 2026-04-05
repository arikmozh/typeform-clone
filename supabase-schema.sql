-- Create leads table for fitness coaching form
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Basic Info
  name TEXT,
  age TEXT,
  gender TEXT,
  phone TEXT,
  email TEXT,

  -- Context
  why_now TEXT,
  real_reason TEXT,
  main_blocker TEXT,

  -- Fitness Goals
  main_goal TEXT,
  training_experience TEXT,
  training_days TEXT,

  -- Health & History
  injuries TEXT,
  tried_before TEXT,

  -- Preference & Investment
  format_preference TEXT,
  investment TEXT,

  -- Complete answers as JSON
  answers JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow reading all leads (for admin view later)
CREATE POLICY "Anyone can view leads" ON leads
  FOR SELECT
  USING (true);
