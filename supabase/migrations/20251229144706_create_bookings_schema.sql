/*
  # Create Bookings Schema

  ## Overview
  This migration creates the database schema for the appointment booking system with referral number verification and booking reference number generation.

  ## New Tables

  ### `appointment_bookings`
  Main table storing all appointment bookings
  - `id` (uuid, primary key) - Unique identifier for each booking
  - `created_at` (timestamptz) - Booking creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `referral_number` (text, required) - Patient's referral number for verification
  - `booking_reference_number` (text, unique, required) - Auto-generated unique booking reference
  - `clinic_location` (text) - Selected clinic location
  - `patient_name` (text) - Patient's full name
  - `patient_email` (text) - Patient's email address
  - `patient_phone` (text) - Patient's contact number
  - `booking_status` (text) - Status: pending, confirmed, completed, cancelled
  - `google_calendar_booked` (boolean) - Whether Google Calendar booking was completed
  - `notes` (text) - Additional booking notes

  ## Security
  - Enable RLS on bookings table
  - Policies allow public insert for new bookings
  - Only authenticated users can view/update bookings

  ## Indexes
  - Index on referral_number for quick lookups
  - Index on booking_reference_number for verification
  - Index on created_at for chronological queries
*/

-- Create appointment_bookings table
CREATE TABLE IF NOT EXISTS appointment_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Referral and booking reference
  referral_number text NOT NULL,
  booking_reference_number text UNIQUE NOT NULL,
  
  -- Booking details
  clinic_location text NOT NULL,
  patient_name text NOT NULL,
  patient_email text,
  patient_phone text,
  
  -- Status tracking
  booking_status text DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  google_calendar_booked boolean DEFAULT false,
  
  -- Additional information
  notes text
);

-- Enable RLS
ALTER TABLE appointment_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public booking creation
CREATE POLICY "Anyone can create bookings"
  ON appointment_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all bookings"
  ON appointment_bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON appointment_bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_referral_number ON appointment_bookings(referral_number);
CREATE INDEX IF NOT EXISTS idx_bookings_reference_number ON appointment_bookings(booking_reference_number);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON appointment_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON appointment_bookings(booking_status);

-- Create updated_at trigger for bookings
CREATE TRIGGER update_appointment_bookings_updated_at
  BEFORE UPDATE ON appointment_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate unique booking reference numbers
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
    
    -- Check if reference already exists
    SELECT EXISTS(
      SELECT 1 FROM appointment_bookings 
      WHERE booking_reference_number = new_reference
    ) INTO reference_exists;
    
    -- Exit loop if reference is unique
    EXIT WHEN NOT reference_exists;
  END LOOP;
  
  RETURN new_reference;
END;
$$;