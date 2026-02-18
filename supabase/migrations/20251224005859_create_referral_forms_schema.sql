/*
  # Create Referral Forms Schema

  ## Overview
  This migration creates the database schema for the Sleep Life Referral Form system with encryption support for sensitive patient data.

  ## New Tables

  ### `referral_forms`
  Main table storing all referral form submissions
  - `id` (uuid, primary key) - Unique identifier for each referral
  - `created_at` (timestamptz) - Submission timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `form_status` (text) - Status: draft, submitted, reviewed
  - `encrypted_data` (text) - Encrypted JSON containing sensitive patient information
  - `encryption_key_id` (text) - Reference to encryption key version
  
  ### Non-encrypted fields (for querying/reporting):
  - `referral_date` (date) - Date of referral
  - `referring_physician` (text) - Name of referring doctor
  - `patient_initials` (text) - Patient initials only (not full name)
  - `has_insurance` (boolean) - Insurance availability flag

  ### Assessment scores (stored separately for reporting):
  - `osa50_score` (integer) - OSA-50 total score
  - `stopbang_score` (integer) - STOPBANG total score
  - `epworth_score` (integer) - Epworth Sleepiness Scale score

  ### Email tracking:
  - `email_sent` (boolean) - Whether notification email was sent
  - `email_sent_at` (timestamptz) - When email was sent
  - `pdf_generated` (boolean) - Whether PDF was generated

  ## Security
  - Enable RLS on all tables
  - Policies restrict access to authenticated users only
  - Sensitive patient data is encrypted at application level
  - Only metadata and scores stored unencrypted for analytics
*/

-- Create referral_forms table
CREATE TABLE IF NOT EXISTS referral_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Form status
  form_status text DEFAULT 'submitted' CHECK (form_status IN ('draft', 'submitted', 'reviewed', 'completed')),
  
  -- Encrypted sensitive data
  encrypted_data text NOT NULL,
  encryption_key_id text DEFAULT 'v1',
  
  -- Non-sensitive metadata for queries
  referral_date date DEFAULT CURRENT_DATE,
  referring_physician text,
  patient_initials text,
  has_insurance boolean DEFAULT false,
  
  -- Assessment scores
  osa50_score integer,
  stopbang_score integer,
  epworth_score integer,
  
  -- Email tracking
  email_sent boolean DEFAULT false,
  email_sent_at timestamptz,
  pdf_generated boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE referral_forms ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Authenticated users can view all referrals"
  ON referral_forms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert referrals"
  ON referral_forms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update referrals"
  ON referral_forms
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_referral_forms_created_at ON referral_forms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_forms_status ON referral_forms(form_status);
CREATE INDEX IF NOT EXISTS idx_referral_forms_email_sent ON referral_forms(email_sent);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_referral_forms_updated_at
  BEFORE UPDATE ON referral_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();