-- ==========================================
-- Migration: Fix Feedback Table RLS
-- Date: 2026-04-17
-- Problem: Policy "Anyone can insert feedback" allows anonymous spam
--          because user_id is nullable and there is no auth check.
-- Fix: Require authenticated user (auth.uid() IS NOT NULL) for INSERT.
--      Anonymous feedback is disabled — users must be logged in.
--
-- NOTE: Handles both possible table names (feedback and user_feedback)
--       using IF EXISTS to avoid errors if one doesn't exist.
-- ==========================================

-- Fix for table named "feedback" (existing on DB)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'feedback'
  ) THEN
    -- Drop the overly permissive anonymous insert policy
    DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.feedback;
    DROP POLICY IF EXISTS "Authenticated users can insert feedback" ON public.feedback;

    -- New policy: only authenticated users can insert their own feedback
    EXECUTE $policy$
      CREATE POLICY "Authenticated users can insert own feedback"
      ON public.feedback FOR INSERT
      WITH CHECK (
          auth.uid() IS NOT NULL
          AND auth.uid() = user_id
      )
    $policy$;
  END IF;
END $$;

-- Fix for table named "user_feedback" (from migration 20260128)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_feedback'
  ) THEN
    DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.user_feedback;
    DROP POLICY IF EXISTS "Authenticated users can insert feedback" ON public.user_feedback;

    EXECUTE $policy$
      CREATE POLICY "Authenticated users can insert own feedback"
      ON public.user_feedback FOR INSERT
      WITH CHECK (
          auth.uid() IS NOT NULL
          AND auth.uid() = user_id
      )
    $policy$;
  END IF;
END $$;
