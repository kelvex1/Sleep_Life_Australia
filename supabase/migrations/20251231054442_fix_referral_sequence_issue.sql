/*
  # Fix Referral Number Sequence Issue

  ## Problem
  The `generate_referral_number()` function references `referral_forms_id_seq` which doesn't exist.
  The original sequence was named `referral_number_seq`.

  ## Solution
  Create the missing `referral_forms_id_seq` sequence with proper starting value based on existing data.

  ## Changes
  1. Create `referral_forms_id_seq` sequence
  2. Set the sequence value to continue from the highest existing referral number
*/

-- Create the sequence if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS referral_forms_id_seq START WITH 1;

-- Set the sequence to the next value after the highest existing referral number
DO $$
DECLARE
  max_num integer;
BEGIN
  -- Extract the numeric part from existing referral numbers
  SELECT COALESCE(MAX(CAST(SUBSTRING(referral_number FROM 'SLA-(\d+)') AS integer)), 0)
  INTO max_num
  FROM referral_forms
  WHERE referral_number IS NOT NULL;
  
  -- Set the sequence to start after the highest existing number
  PERFORM setval('referral_forms_id_seq', max_num + 1, false);
END $$;