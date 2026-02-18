/*
  # Fix Security Issues

  ## Changes Made
  
  1. **Remove Unused Indexes**
     - Drop `idx_bookings_referral_number` from `appointment_bookings`
     - Drop `idx_bookings_created_at` from `appointment_bookings`
     - Drop `idx_bookings_status` from `appointment_bookings`
     - Drop `idx_referral_forms_referral_number` from `referral_forms`
     - Drop `idx_quiz_results_created_at` from `quiz_results`
     - Drop `idx_quiz_results_risk_level` from `quiz_results`
  
  2. **Fix Function Search Path Issues**
     - Update `assign_referral_number` function with immutable search_path
     - Update `generate_referral_number` function with immutable search_path
  
  ## Security Notes
  - Unused indexes have been removed to reduce maintenance overhead
  - Functions now have immutable search paths to prevent security vulnerabilities
  - Auth DB Connection Strategy should be changed to percentage-based in Supabase dashboard
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_bookings_referral_number;
DROP INDEX IF EXISTS idx_bookings_created_at;
DROP INDEX IF EXISTS idx_bookings_status;
DROP INDEX IF EXISTS idx_referral_forms_referral_number;
DROP INDEX IF EXISTS idx_quiz_results_created_at;
DROP INDEX IF EXISTS idx_quiz_results_risk_level;

-- Recreate assign_referral_number function with immutable search_path
CREATE OR REPLACE FUNCTION public.assign_referral_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.referral_number := generate_referral_number();
  RETURN NEW;
END;
$$;

-- Recreate generate_referral_number function with immutable search_path
CREATE OR REPLACE FUNCTION public.generate_referral_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_id bigint;
  new_number text;
BEGIN
  -- Get the next sequence value
  SELECT nextval('referral_forms_id_seq') INTO next_id;
  
  -- Format as SLA-XXXXXX (6 digits, zero-padded)
  new_number := 'SLA-' || LPAD(next_id::text, 6, '0');
  
  RETURN new_number;
END;
$$;