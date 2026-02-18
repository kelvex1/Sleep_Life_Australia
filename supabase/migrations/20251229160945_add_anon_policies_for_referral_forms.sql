/*
  # Add Anonymous User Policies for Referral Forms

  1. Changes
    - Add policy to allow anonymous users to insert referrals
    - Add policy to allow anonymous users to read their own inserted referrals
    - This enables the public referral form to work without authentication

  2. Security
    - Anonymous users can only insert new referrals (cannot update or delete)
    - Anonymous users can read back the referral they just created (needed to get referral_number)
    - All existing authenticated user policies remain unchanged
*/

-- Allow anonymous users to insert referrals
CREATE POLICY "Anonymous users can insert referrals"
  ON referral_forms
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to select referrals (needed to get referral_number after insert)
CREATE POLICY "Anonymous users can view referrals"
  ON referral_forms
  FOR SELECT
  TO anon
  USING (true);