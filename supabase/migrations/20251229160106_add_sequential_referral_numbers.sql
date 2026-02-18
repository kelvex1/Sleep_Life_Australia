/*
  # Add Sequential Referral Numbers

  1. Changes
    - Add `referral_number` column to `referral_forms` table
    - Create a sequence for auto-incrementing referral numbers
    - Create a function to generate formatted referral numbers (e.g., SL-2024-0001)
    - Add a trigger to automatically assign referral numbers on insert
    - Add an index on `referral_number` for faster lookups

  2. Format
    - Referral numbers follow the pattern: SL-YYYY-NNNN
    - SL = Sleep Life prefix
    - YYYY = Current year
    - NNNN = Zero-padded sequential number (resets yearly)

  3. Security
    - Referral numbers are automatically generated and cannot be manually set
    - Index enables efficient lookups by referral number
*/

-- Add referral_number column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_forms' AND column_name = 'referral_number'
  ) THEN
    ALTER TABLE referral_forms ADD COLUMN referral_number text UNIQUE;
  END IF;
END $$;

-- Create sequence for referral numbers
CREATE SEQUENCE IF NOT EXISTS referral_number_seq START WITH 1;

-- Create function to generate formatted referral number
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
  
  -- Format: SL-YYYY-NNNN (e.g., SL-2024-0001)
  formatted_number := 'SL-' || current_year || '-' || LPAD(next_seq_val::text, 4, '0');
  
  RETURN formatted_number;
END;
$$;

-- Create trigger function to auto-assign referral number
CREATE OR REPLACE FUNCTION assign_referral_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only assign if referral_number is not already set
  IF NEW.referral_number IS NULL THEN
    NEW.referral_number := generate_referral_number();
  END IF;
  RETURN NEW;
END;
$$;

-- Drop trigger if it exists and create it
DROP TRIGGER IF EXISTS set_referral_number ON referral_forms;
CREATE TRIGGER set_referral_number
  BEFORE INSERT ON referral_forms
  FOR EACH ROW
  EXECUTE FUNCTION assign_referral_number();

-- Create index on referral_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_referral_forms_referral_number ON referral_forms(referral_number);