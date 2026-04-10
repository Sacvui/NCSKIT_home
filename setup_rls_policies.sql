-- =========================================================================
-- NCSKIT 2026 - FULL DATABASE RLS POLICIES
-- Run this script in Supabase SQL Editor (Dashboard > SQL Editor > + New Query)
-- =========================================================================

-- ============================
-- 1. system_config
-- ============================
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Everyone can read system config
CREATE POLICY "system_config_select_public"
  ON system_config FOR SELECT
  USING (true);

-- Only admins can manage system config
CREATE POLICY "system_config_admin_manage"
  ON system_config FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 2. activity_logs
-- ============================
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can insert their own activity
CREATE POLICY "activity_logs_insert_own"
  ON activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own activity
CREATE POLICY "activity_logs_select_own"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all activity
CREATE POLICY "activity_logs_admin_select"
  ON activity_logs FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 3. token_transactions
-- ============================
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "token_transactions_select_own"
  ON token_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "token_transactions_admin_select"
  ON token_transactions FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- System/Admins can insert transactions
CREATE POLICY "token_transactions_admin_insert"
  ON token_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);


-- ============================
-- 4. user_sessions
-- ============================
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can insert their own sessions
CREATE POLICY "user_sessions_insert_own"
  ON user_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own sessions
CREATE POLICY "user_sessions_select_own"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own sessions (for logout_at)
CREATE POLICY "user_sessions_update_own"
  ON user_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all sessions
CREATE POLICY "user_sessions_admin_select"
  ON user_sessions FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 5. invitations
-- ============================
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Users can create invitations
CREATE POLICY "invitations_insert_own"
  ON invitations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = inviter_id);

-- Users can view their own invitations (sent or received)
CREATE POLICY "invitations_select_own"
  ON invitations FOR SELECT
  TO authenticated
  USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

-- Admins can manage all invitations
CREATE POLICY "invitations_admin_all"
  ON invitations FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 6. projects
-- ============================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can manage their own projects
CREATE POLICY "projects_insert_own"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_select_own"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "projects_update_own"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_delete_own"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all projects
CREATE POLICY "projects_admin_select"
  ON projects FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 7. feedback
-- ============================
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users can submit feedback
CREATE POLICY "feedback_insert_auth"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own feedback
CREATE POLICY "feedback_select_own"
  ON feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all feedback
CREATE POLICY "feedback_admin_select"
  ON feedback FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 8. profiles
-- ============================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "profiles_admin_select"
  ON profiles FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Admins can update all profiles (role, tokens)
CREATE POLICY "profiles_admin_update"
  ON profiles FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 9. knowledge_articles (Public Read)
-- ============================
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;

-- Everyone can read articles
CREATE POLICY "knowledge_articles_public_read"
  ON knowledge_articles FOR SELECT
  USING (true);

-- Only admins can manage articles
CREATE POLICY "knowledge_articles_admin_manage"
  ON knowledge_articles FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 10. scales (Public Read)
-- ============================
ALTER TABLE scales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scales_public_read"
  ON scales FOR SELECT
  USING (true);

CREATE POLICY "scales_admin_manage"
  ON scales FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 11. scale_items (Public Read)
-- ============================
ALTER TABLE scale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scale_items_public_read"
  ON scale_items FOR SELECT
  USING (true);

CREATE POLICY "scale_items_admin_manage"
  ON scale_items FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
