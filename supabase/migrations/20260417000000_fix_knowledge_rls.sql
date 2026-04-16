-- ==========================================
-- Migration: Fix knowledge_articles RLS
-- Date: 2026-04-17
-- Problem: Admin email 'sacvui@gmail.com' was hardcoded in RLS policy.
--          This is a security risk (exposes admin identity) and makes
--          admin management require a new migration every time.
-- Fix: Replace email-based check with role-based check using profiles.role
--
-- NOTE: role column uses a user_role enum type.
--       We cast to TEXT for comparison to avoid enum value errors.
-- ==========================================

-- Drop the old policy with hardcoded email
DROP POLICY IF EXISTS "Admins can manage articles" ON public.knowledge_articles;

-- Create new role-based policy
-- Cast role::text to safely compare regardless of enum definition
CREATE POLICY "Admins can manage articles"
ON public.knowledge_articles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role::text IN ('admin', 'platform_admin', 'super_admin', 'institution_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role::text IN ('admin', 'platform_admin', 'super_admin', 'institution_admin')
  )
);

-- The public read policy remains unchanged:
-- "Public articles are viewable by everyone" ON SELECT USING (true)
-- No changes needed for that policy.

-- To promote a user to admin (no migration needed):
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
