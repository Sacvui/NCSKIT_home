-- ==========================================
-- Migration: Fix Feedback Table RLS
-- Date: 2026-04-17
-- Problem: Policy "Anyone can insert feedback" allows anonymous spam
--          because user_id is nullable and there is no auth check.
-- Fix: Require authenticated user (auth.uid() IS NOT NULL) for INSERT.
--      Anonymous feedback is disabled — users must be logged in.
-- ==========================================

-- Drop the overly permissive anonymous insert policy
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.user_feedback;

-- New policy: only authenticated users can insert their own feedback
-- auth.uid() = user_id ensures users cannot submit feedback as someone else
CREATE POLICY "Authenticated users can insert own feedback"
ON public.user_feedback FOR INSERT
WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
);

-- Keep the existing SELECT policy (users see their own feedback)
-- "Users can see their own feedback" ON SELECT USING (auth.uid() = user_id)
-- No changes needed.

-- Note: The feedback API route (/api/feedback) already checks for user session
-- before inserting. This RLS policy adds a database-level enforcement layer.
