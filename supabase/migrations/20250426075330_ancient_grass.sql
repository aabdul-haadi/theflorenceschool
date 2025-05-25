/*
  # Fix database schema for Florence School Management System

  1. Changes
    - Drop and recreate tables with correct column names
    - Add proper constraints and indexes
    - Update column types and defaults
    - Fix promotion history structure

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Drop existing tables
DROP TABLE IF EXISTS promotion_history CASCADE;
DROP TABLE IF EXISTS class_schedules CASCADE;
DROP TABLE IF EXISTS fee_records CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS student_status CASCADE;
DROP TYPE IF EXISTS teacher_status CASCADE;
DROP TYPE IF EXISTS fee_status CASCADE;
DROP TYPE IF EXISTS class_type CASCADE;

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin');
CREATE TYPE student_status AS ENUM ('active', 'pass-out');
CREATE TYPE teacher_status AS ENUM ('Active', 'On Leave', 'Resigned', 'Pending');
CREATE TYPE fee_status AS ENUM ('Paid', 'Unpaid', 'Partial');
CREATE TYPE class_type AS ENUM (
  'Nursery', 'KG1', 'KG2', 
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
);

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create students table
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id text UNIQUE NOT NULL,
  name text NOT NULL,
  father_name text NOT NULL,
  phone_number text NOT NULL,
  class class_type NOT NULL,
  status student_status NOT NULL DEFAULT 'active',
  joining_date date NOT NULL,
  academic_year integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create teachers table
CREATE TABLE teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone_number text NOT NULL,
  joining_date date NOT NULL,
  status teacher_status NOT NULL DEFAULT 'Active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fee_records table
CREATE TABLE fee_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  month integer NOT NULL CHECK (month >= 0 AND month <= 11),
  year integer NOT NULL,
  amount decimal(10,2) NOT NULL,
  status fee_status NOT NULL DEFAULT 'Unpaid',
  paid_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, month, year)
);

-- Create class_schedules table
CREATE TABLE class_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class class_type NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 4),
  start_time time NOT NULL,
  end_time time NOT NULL,
  subject text NOT NULL,
  teacher_id uuid REFERENCES teachers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(class, day_of_week, start_time)
);

-- Create promotion_history table
CREATE TABLE promotion_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promoted_at timestamptz NOT NULL DEFAULT now(),
  promoted_by uuid,
  previous_state jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all access to authenticated users"
  ON students FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to authenticated users"
  ON teachers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to authenticated users"
  ON fee_records FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to authenticated users"
  ON class_schedules FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to authenticated users"
  ON promotion_history FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_students_class ON students(class);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_academic_year ON students(academic_year);
CREATE INDEX idx_fee_records_student_year ON fee_records(student_id, year);
CREATE INDEX idx_fee_records_month_year ON fee_records(month, year);
CREATE INDEX idx_class_schedules_class ON class_schedules(class);
CREATE INDEX idx_teachers_status ON teachers(status);