-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create User Roles Enum safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'researcher');
    END IF;
END$$;

-- 2. Create Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role user_role default 'user',
  referral_code text unique,
  referred_by_code text, -- Store the code of the referrer
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  constraint username_length check (char_length(full_name) >= 3)
);

-- 3. Create Projects Table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  data jsonb default '{}'::jsonb, -- Store flexible research data
  status text default 'draft', -- draft, active, archived
  is_local boolean default false, -- Flag if user wants to keep it 'private/local' concept
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Enable RLS
alter table public.profiles enable row level security;
alter table public.projects enable row level security;

-- 5. Policies for Profiles
create policy "Public profiles are viewable by everyone." 
  on profiles for select using (true);

create policy "Users can update own profile." 
  on profiles for update using ((select auth.uid()) = id);

-- 6. Policies for Projects
create policy "Users can view own projects" 
  on projects for select using ((select auth.uid()) = user_id);

create policy "Users can insert own projects" 
  on projects for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own projects" 
  on projects for update using ((select auth.uid()) = user_id);

create policy "Users can delete own projects" 
  on projects for delete using ((select auth.uid()) = user_id);

-- 7. Triggers for User Creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 8. Trigger for Referral Code Generation
create or replace function generate_referral_code()
returns trigger as $$
begin
  if new.referral_code is null then
    -- Generate 8 char random code
    new.referral_code := substring(md5(random()::text) from 1 for 8);
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profile_created on profiles;
create trigger on_profile_created
  before insert on profiles
  for each row execute procedure generate_referral_code();
-- Migration: Create system_config table for NCS Credit System
-- Run this in Supabase SQL Editor

-- Create system_config table
CREATE TABLE IF NOT EXISTS public.system_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users
);

-- Enable RLS
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can read config" ON system_config;
DROP POLICY IF EXISTS "Admins can update config" ON system_config;

-- RLS Policies
-- Anyone can read config (needed for client-side cost display)
CREATE POLICY "Anyone can read config"
  ON system_config FOR SELECT
  USING (true);

-- Only admins can update config
CREATE POLICY "Admins can update config"
  ON system_config FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Only admins can insert config
CREATE POLICY "Admins can insert config"
  ON system_config FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Initial configuration data
INSERT INTO system_config (key, value, description) VALUES
  ('default_ncs_balance', '100000', 'Default NCS credits for new users')
ON CONFLICT (key) DO NOTHING;

INSERT INTO system_config (key, value, description) VALUES
  ('analysis_costs', '{
    "descriptive": 100,
    "cronbach": 500,
    "correlation": 300,
    "ttest": 400,
    "ttest-indep": 400,
    "ttest-paired": 400,
    "anova": 600,
    "efa": 1000,
    "cfa": 2000,
    "sem": 3000,
    "regression": 800,
    "chisquare": 400,
    "mann-whitney": 400,
    "ai_explain": 1500,
    "export_pdf": 200
  }', 'Cost per analysis type in NCS credits')
ON CONFLICT (key) DO NOTHING;

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
-- ncsStat Token/Points System Database Schema
-- Run this in Supabase SQL Editor

-- 1. Add tokens column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tokens INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS total_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES public.profiles(id);

-- 2. Create user_sessions table for login tracking
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  login_at TIMESTAMPTZ DEFAULT now(),
  logout_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'login', 'analysis', 'export', 'share', 'feedback', 'invite'
  action_details JSONB DEFAULT '{}',
  points_earned INTEGER DEFAULT 0,
  points_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create token_transactions table
CREATE TABLE IF NOT EXISTS public.token_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- positive = earn, negative = spend
  type TEXT NOT NULL, -- 'signup_bonus', 'earn_invite', 'earn_share', 'earn_feedback', 'spend_analysis', 'spend_export', 'admin_adjust', 'daily_bonus'
  description TEXT,
  related_id UUID, -- ID of related entity (invite, analysis, etc.)
  balance_after INTEGER, -- Balance after this transaction
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create invitations table
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
  tokens_rewarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  invitee_id UUID REFERENCES public.profiles(id)
);

-- 6. Enable RLS on all tables
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" ON public.user_sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 8. RLS Policies for activity_logs
CREATE POLICY "Users can view own activity" ON public.activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity" ON public.activity_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 9. RLS Policies for token_transactions
CREATE POLICY "Users can view own transactions" ON public.token_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.token_transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert transactions" ON public.token_transactions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 10. RLS Policies for invitations
CREATE POLICY "Users can view own invitations" ON public.invitations
  FOR SELECT USING (auth.uid() = inviter_id);

CREATE POLICY "Users can create invitations" ON public.invitations
  FOR INSERT WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Admins can view all invitations" ON public.invitations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 11. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_login_at ON public.user_sessions(login_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type ON public.activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id ON public.token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_inviter_id ON public.invitations(inviter_id);
CREATE INDEX IF NOT EXISTS idx_invitations_invite_code ON public.invitations(invite_code);

-- 12. Function to record token transaction and update balance
CREATE OR REPLACE FUNCTION public.record_token_transaction(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_related_id UUID DEFAULT NULL
)
RETURNS public.token_transactions AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_transaction public.token_transactions;
BEGIN
  -- Get current balance
  SELECT tokens INTO v_current_balance FROM public.profiles WHERE id = p_user_id;
  v_new_balance := v_current_balance + p_amount;
  
  -- Update profile
  UPDATE public.profiles 
  SET 
    tokens = v_new_balance,
    total_earned = CASE WHEN p_amount > 0 THEN total_earned + p_amount ELSE total_earned END,
    total_spent = CASE WHEN p_amount < 0 THEN total_spent + ABS(p_amount) ELSE total_spent END,
    last_active = now()
  WHERE id = p_user_id;
  
  -- Insert transaction
  INSERT INTO public.token_transactions (user_id, amount, type, description, related_id, balance_after)
  VALUES (p_user_id, p_amount, p_type, p_description, p_related_id, v_new_balance)
  RETURNING * INTO v_transaction;
  
  RETURN v_transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Function to log activity
CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id UUID,
  p_action_type TEXT,
  p_details JSONB DEFAULT '{}',
  p_points_earned INTEGER DEFAULT 0,
  p_points_spent INTEGER DEFAULT 0
)
RETURNS public.activity_logs AS $$
DECLARE
  v_log public.activity_logs;
BEGIN
  INSERT INTO public.activity_logs (user_id, action_type, action_details, points_earned, points_spent)
  VALUES (p_user_id, p_action_type, p_details, p_points_earned, p_points_spent)
  RETURNING * INTO v_log;
  
  -- Update last_active
  UPDATE public.profiles SET last_active = now() WHERE id = p_user_id;
  
  RETURN v_log;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.record_token_transaction TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_activity TO authenticated;
-- User Activity Log Schema
-- Tracks login/logout events, feature usage, and time spent in app

-- Create user_activity table
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'login', 'logout', 'analysis', 'export', 'page_view'
    action_details JSONB DEFAULT '{}', -- Additional context (analysis type, page name, etc.)
    session_id TEXT, -- To group activities in same session
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_seconds INTEGER DEFAULT 0 -- For sessions: time spent
);

-- Indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_action_type ON user_activity(action_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_session_id ON user_activity(session_id);

-- Enable RLS
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Admin can view all activities
CREATE POLICY "Admin can view all activities" ON user_activity
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Users can insert their own activity
CREATE POLICY "Users can insert own activity" ON user_activity
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can view their own activity
CREATE POLICY "Users can view own activity" ON user_activity
    FOR SELECT
    USING (auth.uid() = user_id);
-- Create a new private bucket 'avatars'
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Policy: Allow authenticated users to upload files to 'avatars'
create policy "Authenticated users can upload avatars"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'avatars' );

-- Policy: Allow public to view avatars
create policy "Public can view avatars"
on storage.objects for select
to public
using ( bucket_id = 'avatars' );

-- Policy: Allow users to update/delete their own avatars (optional but good practice)
-- Assuming file name contains user_id or similar, but for now simple insert/select is key.
create policy "Users can update own avatars"
on storage.objects for update
to authenticated
using ( bucket_id = 'avatars' AND auth.uid() = owner );
-- 1. Create Feedback Table with Unique Constraint (One per user)
create table if not exists public.feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text,
  rating integer,
  created_at timestamptz default now(),
  constraint one_feedback_per_user unique (user_id)
);

-- 2. Enable RLS
alter table public.feedback enable row level security;

-- 3. Policies for Feedback
-- Users can only insert their own feedback
create policy "Users can insert own feedback" 
  on public.feedback for insert 
  with check ((select auth.uid()) = user_id);

-- Users can view their own feedback
create policy "Users can view own feedback" 
  on public.feedback for select 
  using ((select auth.uid()) = user_id);

-- Admins can view ALL feedback
create policy "Admins can view all feedback" 
  on public.feedback for select 
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
    )
  );

-- 4. Helper to promote user to admin (Run this manually for your user)
update public.profiles set role = 'admin' where email in ('phuchai.le@gmail.com', 'foreverlove3004@gmail.com');
