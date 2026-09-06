-- ====================================================================
-- PHẦN CÒN THIẾU CỦA DATABASE (NCSKIT)
-- Hướng dẫn: Copy toàn bộ nội dung file này và chạy trên Supabase SQL Editor
-- (Đã lược bỏ các bảng cũ như profiles, projects để tránh lỗi already exists)
-- ====================================================================

-- 1. Create system_config table cho NCS Credit System
CREATE TABLE IF NOT EXISTS public.system_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users
);

ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read config" ON system_config;
DROP POLICY IF EXISTS "Admins can update config" ON system_config;
DROP POLICY IF EXISTS "Admins can insert config" ON system_config;

CREATE POLICY "Anyone can read config" ON system_config FOR SELECT USING (true);

CREATE POLICY "Admins can update config" ON system_config FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admins can insert config" ON system_config FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

INSERT INTO system_config (key, value, description) VALUES
  ('default_ncs_balance', '100000', 'Default NCS credits for new users'),
  ('analysis_costs', '{"descriptive": 100, "cronbach": 500, "correlation": 300, "ttest": 400, "ttest-indep": 400, "ttest-paired": 400, "anova": 600, "efa": 1000, "cfa": 2000, "sem": 3000, "regression": 800, "chisquare": 400, "mann-whitney": 400, "ai_explain": 1500, "export_pdf": 200}', 'Cost per analysis type in NCS credits')
ON CONFLICT (key) DO NOTHING;

-- 2. Hệ Thống Token & Hoạt Động (Token/Points System Database Schema)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tokens INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS total_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES public.profiles(id);

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

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, 
  action_details JSONB DEFAULT '{}',
  points_earned INTEGER DEFAULT 0,
  points_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.token_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, 
  type TEXT NOT NULL, 
  description TEXT,
  related_id UUID, 
  balance_after INTEGER, 
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending', 
  tokens_rewarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  invitee_id UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, 
    action_details JSONB DEFAULT '{}', 
    session_id TEXT, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_seconds INTEGER DEFAULT 0 
);

-- Bật RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- 3. Xoá Policy cũ (nếu có) để đè lên dễ dàng
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view own sessions" ON public.user_sessions;
    DROP POLICY IF EXISTS "Users can insert own sessions" ON public.user_sessions;
    DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;
    
    DROP POLICY IF EXISTS "Users can view own activity" ON public.activity_logs;
    DROP POLICY IF EXISTS "Users can insert own activity" ON public.activity_logs;
    DROP POLICY IF EXISTS "Admins can view all activity" ON public.activity_logs;
    
    DROP POLICY IF EXISTS "Users can view own transactions" ON public.token_transactions;
    DROP POLICY IF EXISTS "Admins can view all transactions" ON public.token_transactions;
    DROP POLICY IF EXISTS "Admins can insert transactions" ON public.token_transactions;
    
    DROP POLICY IF EXISTS "Users can view own invitations" ON public.invitations;
    DROP POLICY IF EXISTS "Users can create invitations" ON public.invitations;
    DROP POLICY IF EXISTS "Admins can view all invitations" ON public.invitations;
    
    DROP POLICY IF EXISTS "Admin can view all activities" ON public.user_activity;
    DROP POLICY IF EXISTS "Users can insert own activity" ON public.user_activity;
    DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Tạo Policies mới
CREATE POLICY "Users can view own sessions" ON public.user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all sessions" ON public.user_sessions FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view own activity" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all activity" ON public.activity_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view own transactions" ON public.token_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON public.token_transactions FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can insert transactions" ON public.token_transactions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view own invitations" ON public.invitations FOR SELECT USING (auth.uid() = inviter_id);
CREATE POLICY "Users can create invitations" ON public.invitations FOR INSERT WITH CHECK (auth.uid() = inviter_id);
CREATE POLICY "Admins can view all invitations" ON public.invitations FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can view all activities" ON user_activity FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "Users can insert own activity" ON user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own activity" ON user_activity FOR SELECT USING (auth.uid() = user_id);

-- 4. Bảng Feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text,
  rating integer,
  created_at timestamptz default now(),
  constraint one_feedback_per_user unique (user_id)
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can insert own feedback" ON public.feedback;
    DROP POLICY IF EXISTS "Users can view own feedback" ON public.feedback;
    DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

CREATE POLICY "Users can insert own feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own feedback" ON public.feedback FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own feedback" ON public.feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all feedback" ON public.feedback FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- 5. Avatar Bucket
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;
DO $$ BEGIN
    DROP POLICY IF EXISTS "Authenticated users can upload avatars" on storage.objects;
    DROP POLICY IF EXISTS "Public can view avatars" on storage.objects;
    DROP POLICY IF EXISTS "Users can update own avatars" on storage.objects;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

create policy "Authenticated users can upload avatars" on storage.objects for insert to authenticated with check ( bucket_id = 'avatars' );
create policy "Public can view avatars" on storage.objects for select to public using ( bucket_id = 'avatars' );
create policy "Users can update own avatars" on storage.objects for update to authenticated using ( bucket_id = 'avatars' AND auth.uid() = owner );

-- 6. Cấp Quyền Admin cho 2 Email
update public.profiles set role = 'admin' where email in ('phuchai.le@gmail.com', 'foreverlove3004@gmail.com');

NOTIFY pgrst, 'reload schema';
