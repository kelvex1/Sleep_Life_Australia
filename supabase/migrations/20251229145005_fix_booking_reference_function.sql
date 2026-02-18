/*
  # Fix Booking Reference Generation Function

  ## Changes
  - Update the generate_booking_reference function to properly reference the public schema
  - Fix the table reference to use fully qualified name (public.appointment_bookings)
  - This ensures the function works correctly with the empty search_path security setting

  ## Security
  - Maintains SECURITY DEFINER with empty search_path
  - Uses fully qualified table names for proper schema resolution
*/

-- Drop and recreate the function with proper schema references
DROP FUNCTION IF EXISTS generate_booking_reference();

CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_reference text;
  reference_exists boolean;
BEGIN
  LOOP
    -- Generate reference in format: BK-YYYYMMDD-XXXX (e.g., BK-20251229-A7K9)
    new_reference := 'BK-' || 
                     to_char(current_timestamp, 'YYYYMMDD') || '-' || 
                     upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
    
    -- Check if reference already exists (use fully qualified table name)
    SELECT EXISTS(
      SELECT 1 FROM public.appointment_bookings 
      WHERE booking_reference_number = new_reference
    ) INTO reference_exists;
    
    -- Exit loop if reference is unique
    EXIT WHEN NOT reference_exists;
  END LOOP;
  
  RETURN new_reference;
END;
$$;