/*
  # Create attendance tracking table

  1. New Tables
    - `attendance`
      - `id` (uuid, primary key)
      - `date` (date) - The date of the attendance
      - `subject` (text) - Subject name (DIVP, SOOAD, AI, etc.)
      - `status` (text) - Present or Absent
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `attendance` table
    - Add policy for public access (since this is a simple demo)
*/

CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  subject text NOT NULL,
  status text NOT NULL CHECK (status IN ('Present', 'Absent')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to attendance"
  ON attendance
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_date_subject ON attendance(date, subject);