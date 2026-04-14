CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  SELECT (role = 'admin') INTO v_is_admin FROM public.profiles WHERE id = auth.uid();
  RETURN coalesce(v_is_admin, false);
END;
$$;

DROP POLICY IF EXISTS "profiles_admin_select" ON profiles;
CREATE POLICY "profiles_admin_select" ON profiles FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "profiles_admin_update" ON profiles;
CREATE POLICY "profiles_admin_update" ON profiles FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "projects_admin_select" ON projects;
CREATE POLICY "projects_admin_select" ON projects FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "user_sessions_admin_select" ON user_sessions;
CREATE POLICY "user_sessions_admin_select" ON user_sessions FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "feedback_admin_select" ON feedback;
CREATE POLICY "feedback_admin_select" ON feedback FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "scales_admin_manage" ON scales;
CREATE POLICY "scales_admin_manage" ON scales FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "scale_items_admin_manage" ON scale_items;
CREATE POLICY "scale_items_admin_manage" ON scale_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "knowledge_articles_admin_manage" ON knowledge_articles;
CREATE POLICY "knowledge_articles_admin_manage" ON knowledge_articles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "system_config_admin_manage" ON system_config;
CREATE POLICY "system_config_admin_manage" ON system_config FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "token_transactions_admin_select" ON token_transactions;
CREATE POLICY "token_transactions_admin_select" ON token_transactions FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "activity_logs_admin_select" ON activity_logs;
CREATE POLICY "activity_logs_admin_select" ON activity_logs FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "invitations_admin_all" ON invitations;
CREATE POLICY "invitations_admin_all" ON invitations FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
