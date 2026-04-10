-- =========================================================================
-- NCSKIT 2026 - FULL DATABASE UPGRADE & RLS POLICIES
-- Run this script in Supabase SQL Editor
-- =========================================================================

-- ============================
-- STEP 0: Table rename (ALREADY DONE)
-- user_activity was renamed to activity_logs
-- ============================

-- Add points columns to match new schema (if missing)
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS points_earned integer DEFAULT 0;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS points_spent integer DEFAULT 0;


-- ============================
-- 1. system_config
-- ============================
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "system_config_select_public" ON system_config;
CREATE POLICY "system_config_select_public"
  ON system_config FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "system_config_admin_manage" ON system_config;
CREATE POLICY "system_config_admin_manage"
  ON system_config FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 2. activity_logs (was user_activity)
-- ============================
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_logs_insert_own" ON activity_logs;
CREATE POLICY "activity_logs_insert_own"
  ON activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "activity_logs_select_own" ON activity_logs;
CREATE POLICY "activity_logs_select_own"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "activity_logs_admin_select" ON activity_logs;
CREATE POLICY "activity_logs_admin_select"
  ON activity_logs FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 3. token_transactions
-- ============================
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "token_transactions_select_own" ON token_transactions;
CREATE POLICY "token_transactions_select_own"
  ON token_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "token_transactions_admin_select" ON token_transactions;
CREATE POLICY "token_transactions_admin_select"
  ON token_transactions FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "token_transactions_insert_auth" ON token_transactions;
CREATE POLICY "token_transactions_insert_auth"
  ON token_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);


-- ============================
-- 4. user_sessions
-- ============================
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_sessions_insert_own" ON user_sessions;
CREATE POLICY "user_sessions_insert_own"
  ON user_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_sessions_select_own" ON user_sessions;
CREATE POLICY "user_sessions_select_own"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_sessions_update_own" ON user_sessions;
CREATE POLICY "user_sessions_update_own"
  ON user_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_sessions_admin_select" ON user_sessions;
CREATE POLICY "user_sessions_admin_select"
  ON user_sessions FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 5. invitations
-- ============================
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "invitations_insert_own" ON invitations;
CREATE POLICY "invitations_insert_own"
  ON invitations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = inviter_id);

DROP POLICY IF EXISTS "invitations_select_own" ON invitations;
CREATE POLICY "invitations_select_own"
  ON invitations FOR SELECT
  TO authenticated
  USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

DROP POLICY IF EXISTS "invitations_admin_all" ON invitations;
CREATE POLICY "invitations_admin_all"
  ON invitations FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 6. projects
-- ============================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_insert_own" ON projects;
CREATE POLICY "projects_insert_own"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_select_own" ON projects;
CREATE POLICY "projects_select_own"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_update_own" ON projects;
CREATE POLICY "projects_update_own"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_delete_own" ON projects;
CREATE POLICY "projects_delete_own"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_admin_select" ON projects;
CREATE POLICY "projects_admin_select"
  ON projects FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 7. feedback
-- ============================
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "feedback_insert_auth" ON feedback;
CREATE POLICY "feedback_insert_auth"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "feedback_select_own" ON feedback;
CREATE POLICY "feedback_select_own"
  ON feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "feedback_admin_select" ON feedback;
CREATE POLICY "feedback_admin_select"
  ON feedback FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 8. profiles
-- ============================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_admin_select" ON profiles;
CREATE POLICY "profiles_admin_select"
  ON profiles FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "profiles_admin_update" ON profiles;
CREATE POLICY "profiles_admin_update"
  ON profiles FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 9. knowledge_articles
-- ============================
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "knowledge_articles_public_read" ON knowledge_articles;
CREATE POLICY "knowledge_articles_public_read"
  ON knowledge_articles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "knowledge_articles_admin_manage" ON knowledge_articles;
CREATE POLICY "knowledge_articles_admin_manage"
  ON knowledge_articles FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 10. scales
-- ============================
ALTER TABLE scales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scales_public_read" ON scales;
CREATE POLICY "scales_public_read"
  ON scales FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "scales_admin_manage" ON scales;
CREATE POLICY "scales_admin_manage"
  ON scales FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ============================
-- 11. scale_items
-- ============================
ALTER TABLE scale_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scale_items_public_read" ON scale_items;
CREATE POLICY "scale_items_public_read"
  ON scale_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "scale_items_admin_manage" ON scale_items;
CREATE POLICY "scale_items_admin_manage"
  ON scale_items FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- =========================================================================
-- DONE! All 11 tables now have proper Row Level Security policies.
-- =========================================================================
