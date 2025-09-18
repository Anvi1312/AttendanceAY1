/*
  # Enhanced Attendance Tracking System

  1. New Tables
    - `attendance`
      - `id` (uuid, primary key)
      - `date` (date)
      - `subject` (text)
      - `status` (text) - Present, Absent, or Cancelled
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `attendance` table
    - Add policy for public access (single user app)

  3. Constraints
    - Status must be one of: Present, Absent, Cancelled
    - Unique constraint on date + subject combination
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS attendance;

CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  subject text NOT NULL,
  status text NOT NULL CHECK (status IN ('Present', 'Absent', 'Cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(date, subject)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Allow public access for single user app
CREATE POLICY "Allow public access to attendance"
  ON attendance
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_subject ON attendance(subject);
CREATE INDEX idx_attendance_status ON attendance(status);
CREATE INDEX idx_attendance_date_subject ON attendance(date, subject);