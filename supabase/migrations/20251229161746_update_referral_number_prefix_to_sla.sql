/*
  # Update Referral Number Prefix to SLA

  1. Changes
    - Update the `generate_referral_number` function to use "SLA" prefix instead of "SL"
    - Referral numbers will now follow the pattern: SLA-YYYY-NNNN
    - SLA = Sleep Life Australia prefix

  2. Notes
    - This only affects new referrals; existing referral numbers remain unchanged
    - The sequence counter continues from where it left off
*/

-- Update function to generate formatted referral number with SLA prefix
CREATE OR REPLACE FUNCTION generate_referral_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  current_year text;
  next_seq_val integer;
  formatted_number text;
BEGIN
  -- Get the current year
  current_year := EXTRACT(YEAR FROM CURRENT_DATE)::text;
  
  -- Get the next sequence value
  next_seq_val := nextval('referral_number_seq');
  
  -- Format: SLA-YYYY-NNNN (e.g., SLA-2024-0001)
  formatted_number := 'SLA-' || current_year || '-' || LPAD(next_seq_val::text, 4, '0');
  
  RETURN formatted_number;
END;
$$;