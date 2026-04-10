-- =========================================================================
-- SQL Migration: UPDATE RLS POLICIES FOR ADMIN & ACTIVITY
-- Run this script in the Supabase SQL Editor
-- =========================================================================

-- 1. Policies for 'system_config'
-- Enable RLS
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read system configs
CREATE POLICY "Allow public read system_config" 
  ON system_config 
  FOR SELECT 
  USING (true);

-- Allow Admins to Insert/Update system config
CREATE POLICY "Allow admins to manage system_config" 
  ON system_config 
  FOR ALL 
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- 2. Policies for 'user_activity'
-- Enable RLS
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own activity
CREATE POLICY "Allow users to log own activity" 
  ON user_activity 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to view all activity
CREATE POLICY "Allow admins to view all activity" 
  ON user_activity 
  FOR SELECT 
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Allow users to view their own activity
CREATE POLICY "Allow users to view own activity" 
  ON user_activity 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);
