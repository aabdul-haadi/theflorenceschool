/*
  # Add activity tracking for CRM events

  1. New Tables
    - activities: Track all CRM activities
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Safely create activity_type enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE activity_type AS ENUM (
    'fee_update',
    'teacher_update',
    'student_update',
    'schedule_update'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type activity_type NOT NULL,
  description text NOT NULL,
  performed_by uuid REFERENCES auth.users(id),
  performed_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow authenticated users to read activities" ON activities;

-- Create policy
CREATE POLICY "Allow authenticated users to read activities"
  ON activities FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_performed_at ON activities(performed_at);
CREATE INDEX IF NOT EXISTS idx_activities_performed_by ON activities(performed_by);