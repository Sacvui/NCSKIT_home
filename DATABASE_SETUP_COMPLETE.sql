-- ============================================================================
-- ncsStat2 - Complete Database Setup Script
-- ============================================================================
-- Run this script in Supabase SQL Editor to set up the complete database
-- Project: ncsstat.ncskit.org
-- Supabase Project: qshimpxmirkyfenhklfh
-- Last Updated: January 26, 2026
-- ============================================================================

-- ============================================================================
-- STEP 1: Enable Required Extensions
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- STEP 2: Create Custom Types
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'researcher');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- STEP 3: Create Core Tables
-- ============================================================================

-- 3.1 Profiles Table (Main User Table)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    
    -- Token/Credit System
    tokens INTEGER DEFAULT 100000,
    total_earned INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    
    -- Referral System
    referral_code TEXT UNIQUE,
    referred_by_code TEXT,
    referral_count INTEGER DEFAULT 0,
    
    -- ORCID Integration
    orcid_id TEXT UNIQUE,
    provider TEXT DEFAULT 'google', -- 'google', 'orcid', 'linkedin'
    
    -- Profile Fields
    academic_level TEXT,
    research_field TEXT,
    organization TEXT,
    phone_number TEXT,
    date_of_birth DATE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT username_length CHECK (char_length(full_name) >= 3)
);

-- 3.2 Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    analysis_type TEXT, -- 'cronbach', 'efa', 'cfa', 'sem', etc.
    data JSONB DEFAULT '{}'::jsonb,
    results JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'draft', -- 'draft', 'active', 'archived'
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT one_feedback_per_user UNIQUE (user_id)
);

-- 3.4 System Configuration Table
CREATE TABLE IF NOT EXISTS public.system_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- ============================================================================
-- STEP 4: Token/Activity Tracking Tables
-- ============================================================================

-- 4.1 User Sessions (Login/Logout Tracking)
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    login_at TIMESTAMPTZ DEFAULT NOW(),
    logout_at TIMESTAMPTZ,
    duration_minutes INTEGER,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.2 Activity Logs (Feature Usage Tracking)
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'login', 'logout', 'analysis', 'export', 'page_view'
    action_details JSONB DEFAULT '{}',
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    duration_seconds INTEGER DEFAULT 0
);

-- 4.3 Token Transactions (Credit History)
CREATE TABLE IF NOT EXISTS public.token_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- positive = earn, negative = spend
    type TEXT NOT NULL, -- 'signup_bonus', 'earn_invite', 'spend_analysis', etc.
    description TEXT,
    related_id UUID,
    balance_after INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.4 Invitations (Referral Tracking)
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    inviter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    invitee_email TEXT NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
    tokens_rewarded INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    invitee_id UUID REFERENCES public.profiles(id)
);

-- ============================================================================
-- STEP 5: Create Indexes for Performance
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_orcid_id ON public.profiles(orcid_id);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by_code ON public.profiles(referred_by_code);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON public.profiles(last_active);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON public.projects(updated_at);

-- Activity tracking indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_login_at ON public.user_sessions(login_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_action_type ON public.user_activity(action_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_session_id ON public.user_activity(session_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id ON public.token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_created_at ON public.token_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_invitations_inviter_id ON public.invitations(inviter_id);
CREATE INDEX IF NOT EXISTS idx_invitations_invite_code ON public.invitations(invite_code);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);

-- ============================================================================
-- STEP 6: Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 7: Create RLS Policies
-- ============================================================================

-- 7.1 Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 7.2 Projects Policies
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects" 
    ON public.projects FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects" 
    ON public.projects FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects" 
    ON public.projects FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects" 
    ON public.projects FOR DELETE 
    USING (auth.uid() = user_id);

-- 7.3 Feedback Policies
DROP POLICY IF EXISTS "Users can insert own feedback" ON public.feedback;
CREATE POLICY "Users can insert own feedback" 
    ON public.feedback FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own feedback" ON public.feedback;
CREATE POLICY "Users can view own feedback" 
    ON public.feedback FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;
CREATE POLICY "Admins can view all feedback" 
    ON public.feedback FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 7.4 System Config Policies
DROP POLICY IF EXISTS "Anyone can read config" ON public.system_config;
CREATE POLICY "Anyone can read config" 
    ON public.system_config FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Admins can update config" ON public.system_config;
CREATE POLICY "Admins can update config" 
    ON public.system_config FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can insert config" ON public.system_config;
CREATE POLICY "Admins can insert config" 
    ON public.system_config FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 7.5 User Sessions Policies
DROP POLICY IF EXISTS "Users can view own sessions" ON public.user_sessions;
CREATE POLICY "Users can view own sessions" 
    ON public.user_sessions FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own sessions" ON public.user_sessions;
CREATE POLICY "Users can insert own sessions" 
    ON public.user_sessions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;
CREATE POLICY "Admins can view all sessions" 
    ON public.user_sessions FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 7.6 User Activity Policies
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity;
CREATE POLICY "Users can view own activity" 
    ON public.user_activity FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own activity" ON public.user_activity;
CREATE POLICY "Users can insert own activity" 
    ON public.user_activity FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all activity" ON public.user_activity;
CREATE POLICY "Admins can view all activity" 
    ON public.user_activity FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 7.7 Token Transactions Policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.token_transactions;
CREATE POLICY "Users can view own transactions" 
    ON public.token_transactions FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all transactions" ON public.token_transactions;
CREATE POLICY "Admins can view all transactions" 
    ON public.token_transactions FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can insert transactions" ON public.token_transactions;
CREATE POLICY "Admins can insert transactions" 
    ON public.token_transactions FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 7.8 Invitations Policies
DROP POLICY IF EXISTS "Users can view own invitations" ON public.invitations;
CREATE POLICY "Users can view own invitations" 
    ON public.invitations FOR SELECT 
    USING (auth.uid() = inviter_id);

DROP POLICY IF EXISTS "Users can create invitations" ON public.invitations;
CREATE POLICY "Users can create invitations" 
    ON public.invitations FOR INSERT 
    WITH CHECK (auth.uid() = inviter_id);

DROP POLICY IF EXISTS "Admins can view all invitations" ON public.invitations;
CREATE POLICY "Admins can view all invitations" 
    ON public.invitations FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- ============================================================================
-- STEP 8: Create Functions and Triggers
-- ============================================================================

-- 8.1 Function: Handle New User Registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, email, provider)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
        NEW.raw_user_meta_data->>'avatar_url', 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'provider', 'google')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8.2 Trigger: On Auth User Created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

-- 8.3 Function: Generate Referral Code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        -- Generate unique 8-character code
        NEW.referral_code := 'NCS-' || UPPER(substring(md5(random()::text) from 1 for 8));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8.4 Trigger: On Profile Created
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
    BEFORE INSERT ON public.profiles
    FOR EACH ROW 
    EXECUTE FUNCTION public.generate_referral_code();

-- 8.5 Function: Record Token Transaction
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
    SELECT tokens INTO v_current_balance 
    FROM public.profiles 
    WHERE id = p_user_id;
    
    v_new_balance := v_current_balance + p_amount;
    
    -- Update profile
    UPDATE public.profiles 
    SET 
        tokens = v_new_balance,
        total_earned = CASE WHEN p_amount > 0 THEN total_earned + p_amount ELSE total_earned END,
        total_spent = CASE WHEN p_amount < 0 THEN total_spent + ABS(p_amount) ELSE total_spent END,
        last_active = NOW()
    WHERE id = p_user_id;
    
    -- Insert transaction
    INSERT INTO public.token_transactions (user_id, amount, type, description, related_id, balance_after)
    VALUES (p_user_id, p_amount, p_type, p_description, p_related_id, v_new_balance)
    RETURNING * INTO v_transaction;
    
    RETURN v_transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8.6 Function: Log Activity
CREATE OR REPLACE FUNCTION public.log_activity(
    p_user_id UUID,
    p_action_type TEXT,
    p_details JSONB DEFAULT '{}',
    p_session_id TEXT DEFAULT NULL
)
RETURNS public.user_activity AS $$
DECLARE
    v_log public.user_activity;
BEGIN
    INSERT INTO public.user_activity (user_id, action_type, action_details, session_id)
    VALUES (p_user_id, p_action_type, p_details, p_session_id)
    RETURNING * INTO v_log;
    
    -- Update last_active
    UPDATE public.profiles 
    SET last_active = NOW() 
    WHERE id = p_user_id;
    
    RETURN v_log;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8.7 Grant Execute Permissions
GRANT EXECUTE ON FUNCTION public.record_token_transaction TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_activity TO authenticated;

-- ============================================================================
-- STEP 9: Insert Initial Configuration Data
-- ============================================================================

-- Default NCS balance for new users
INSERT INTO public.system_config (key, value, description) 
VALUES ('default_ncs_balance', '100000', 'Default NCS credits for new users')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Analysis costs configuration
INSERT INTO public.system_config (key, value, description) 
VALUES ('analysis_costs', '{
    "descriptive": 100,
    "cronbach": 500,
    "omega": 600,
    "correlation": 300,
    "ttest": 400,
    "ttest-indep": 400,
    "ttest-paired": 400,
    "anova": 600,
    "efa": 1000,
    "cfa": 2000,
    "sem": 3000,
    "regression": 800,
    "moderation": 1200,
    "mediation": 1500,
    "logistic": 900,
    "chisquare": 400,
    "mann-whitney": 400,
    "cluster": 800,
    "ai_explain": 1500,
    "export_pdf": 200
}'::jsonb, 'Cost per analysis type in NCS credits')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Referral rewards configuration
INSERT INTO public.system_config (key, value, description) 
VALUES ('referral_rewards', '{
    "inviter_bonus": 5000,
    "invitee_bonus": 2000
}'::jsonb, 'Rewards for referral system')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================================================
-- STEP 10: Create Admin User (MANUAL STEP)
-- ============================================================================

-- IMPORTANT: After running this script, manually promote your user to admin:
-- 
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE email = 'your-email@example.com';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check all indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check system configuration
SELECT * FROM public.system_config ORDER BY key;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- 
-- Next Steps:
-- 1. Promote your user to admin (see STEP 10 above)
-- 2. Configure Google OAuth in Supabase Dashboard
-- 3. Configure ORCID OAuth (optional)
-- 4. Test user registration and login
-- 5. Verify token system is working
-- 
-- ============================================================================
