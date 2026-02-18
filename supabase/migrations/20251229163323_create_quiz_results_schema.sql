/*
  # Create Quiz Results Schema

  1. New Tables
    - `quiz_results`
      - `id` (uuid, primary key) - Unique identifier for each quiz submission
      - `created_at` (timestamptz) - Timestamp of quiz completion
      - `total_score` (integer) - Total score from all questions (0-8)
      - `risk_level` (text) - Calculated risk level: 'low', 'moderate', or 'high'
      - `question_answers` (jsonb) - JSON object containing all question answers
      
  2. Security
    - Enable RLS on `quiz_results` table
    - Add policy for anonymous users to insert their own quiz results
    - Add policy for authenticated users to read aggregated data (for analytics)
    
  3. Important Notes
    - All quiz submissions are anonymous (no user identification)
    - Data is stored for business intelligence and service improvement
    - No personal information is collected or stored
*/

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  total_score integer NOT NULL CHECK (total_score >= 0 AND total_score <= 8),
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high')),
  question_answers jsonb NOT NULL
);

-- Enable Row Level Security
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone (including anonymous users) to insert quiz results
CREATE POLICY "Anyone can submit quiz results"
  ON quiz_results
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to read all quiz results (for analytics)
CREATE POLICY "Authenticated users can view quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for faster querying by date
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at DESC);

-- Create index for faster querying by risk level
CREATE INDEX IF NOT EXISTS idx_quiz_results_risk_level ON quiz_results(risk_level);