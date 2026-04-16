-- ==========================================
-- Migration: Support Ratings in Feedback
-- Date: 2026-04-18
-- ==========================================

-- Add rating column to user_feedback
ALTER TABLE public.user_feedback 
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);

-- Update RLS (no changes needed, existing policies apply to new columns)

-- Add comment
COMMENT ON COLUMN public.user_feedback.rating IS 'User rating from 1 to 5 stars';
