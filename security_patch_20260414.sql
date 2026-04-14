-- =====================================================
-- SECURITY PATCH: Fix profiles RLS policy
-- Date: 2026-04-14
-- Issue: "Public profiles are viewable by everyone" with qual=true
--        exposes ALL user data (email, phone, tokens, role, DOB) 
--        to unauthenticated users
-- =====================================================

-- Step 1: Remove the dangerous policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Step 2: Ensure users can still read their OWN profile
-- (This policy already exists but we add IF NOT EXISTS logic)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'profiles_select_own'
  ) THEN
    CREATE POLICY "profiles_select_own" ON profiles
      FOR SELECT TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

-- Step 3: Ensure admin can still read all profiles
-- (This policy already exists but we add IF NOT EXISTS logic)  
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'profiles_admin_select'
  ) THEN
    CREATE POLICY "profiles_admin_select" ON profiles
      FOR SELECT TO public
      USING (is_admin());
  END IF;
END $$;

-- Step 4: Create atomic token deduction function to prevent race conditions
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID, 
  p_amount INT, 
  p_reason TEXT
)
RETURNS JSON 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE 
  v_balance INT;
  v_role TEXT;
  v_new_balance INT;
  v_is_exempt BOOLEAN := false;
BEGIN
  -- Lock the row to prevent concurrent deductions (race condition fix)
  SELECT tokens, role::text INTO v_balance, v_role 
  FROM profiles 
  WHERE id = p_user_id 
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- Check admin exemption
  IF v_role IN ('institution_admin', 'platform_admin', 'super_admin', 'admin') THEN
    v_is_exempt := true;
    -- Log admin bypass transaction
    INSERT INTO token_transactions (user_id, amount, type, description, balance_after)
    VALUES (p_user_id, 0, 'spend_analysis', '[Admin Bypass] ' || p_reason, v_balance);
    
    RETURN json_build_object(
      'success', true, 
      'newBalance', v_balance, 
      'isExempt', true
    );
  END IF;
  
  -- Check sufficient balance
  IF v_balance < p_amount THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Insufficient balance',
      'currentBalance', v_balance,
      'required', p_amount
    );
  END IF;
  
  -- Deduct
  v_new_balance := v_balance - p_amount;
  
  UPDATE profiles 
  SET tokens = v_new_balance, 
      total_spent = COALESCE(total_spent, 0) + p_amount,
      updated_at = now()
  WHERE id = p_user_id;
  
  -- Log transaction
  INSERT INTO token_transactions (user_id, amount, type, description, balance_after)
  VALUES (p_user_id, -p_amount, 'spend_analysis', p_reason, v_new_balance);
  
  RETURN json_build_object(
    'success', true, 
    'newBalance', v_new_balance, 
    'isExempt', false
  );
END;
$$;

-- Verify: List remaining policies on profiles
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'profiles';
