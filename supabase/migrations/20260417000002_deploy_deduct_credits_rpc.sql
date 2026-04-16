-- ==========================================
-- Migration: Deploy Atomic Credit Deduction RPC
-- Date: 2026-04-17
-- Problem: recordTokenTransaction() in token-service.ts performs 3 separate
--          DB operations (read → update → insert) without a transaction.
--          Two concurrent requests can cause race conditions leading to:
--          - Double-spend (user gets free analyses)
--          - Negative balance
-- Fix: A SECURITY DEFINER function with FOR UPDATE row lock ensures
--      the entire deduction is atomic.
-- ==========================================

CREATE OR REPLACE FUNCTION public.deduct_credits_atomic(
  p_user_id uuid,
  p_amount   integer,
  p_reason   text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public   -- Prevent search_path injection
AS $$
DECLARE
  v_tokens      integer;
  v_role        text;
  v_new_balance integer;
  v_exempt      boolean := false;
  v_exempt_roles text[] := ARRAY['admin','institution_admin','platform_admin','super_admin'];
BEGIN
  -- Lock the row to prevent concurrent deductions (eliminates race condition)
  SELECT tokens, role::text
  INTO v_tokens, v_role
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Admin/exempt roles bypass credit deduction
  v_exempt := v_role = ANY(v_exempt_roles);

  IF v_exempt THEN
    -- Log zero-cost transaction for audit trail
    INSERT INTO public.token_transactions(user_id, amount, type, description, balance_after)
    VALUES (p_user_id, 0, 'spend_analysis', '[Exempt] ' || p_reason, v_tokens);

    RETURN jsonb_build_object(
      'success', true,
      'new_balance', v_tokens,
      'exempt', true
    );
  END IF;

  -- Insufficient balance check
  IF v_tokens < p_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient credits',
      'current_balance', v_tokens
    );
  END IF;

  v_new_balance := v_tokens - p_amount;

  -- Atomic update: balance + total_spent in one statement
  UPDATE public.profiles
  SET
    tokens      = v_new_balance,
    total_spent = COALESCE(total_spent, 0) + p_amount,
    updated_at  = now()
  WHERE id = p_user_id;

  -- Insert transaction record in same transaction
  INSERT INTO public.token_transactions(user_id, amount, type, description, balance_after)
  VALUES (p_user_id, -p_amount, 'spend_analysis', p_reason, v_new_balance);

  RETURN jsonb_build_object(
    'success', true,
    'new_balance', v_new_balance,
    'exempt', false
  );
END;
$$;

-- Grant execute to authenticated users only (anon cannot call this)
REVOKE ALL ON FUNCTION public.deduct_credits_atomic(uuid, integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.deduct_credits_atomic(uuid, integer, text) TO authenticated;

-- ==========================================
-- Also create an atomic earn/award RPC for server-side token rewards
-- (replaces the non-atomic recordTokenTransaction for positive amounts)
-- ==========================================

CREATE OR REPLACE FUNCTION public.award_credits_atomic(
  p_user_id    uuid,
  p_amount     integer,
  p_type       text,
  p_reason     text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tokens      integer;
  v_new_balance integer;
BEGIN
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Amount must be positive');
  END IF;

  SELECT tokens INTO v_tokens
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  v_new_balance := v_tokens + p_amount;

  UPDATE public.profiles
  SET
    tokens       = v_new_balance,
    total_earned = COALESCE(total_earned, 0) + p_amount,
    updated_at   = now()
  WHERE id = p_user_id;

  INSERT INTO public.token_transactions(user_id, amount, type, description, balance_after)
  VALUES (p_user_id, p_amount, p_type, p_reason, v_new_balance);

  RETURN jsonb_build_object(
    'success', true,
    'new_balance', v_new_balance
  );
END;
$$;

-- Only service_role (server-side) should award credits
REVOKE ALL ON FUNCTION public.award_credits_atomic(uuid, integer, text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.award_credits_atomic(uuid, integer, text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.award_credits_atomic(uuid, integer, text, text) TO service_role;
