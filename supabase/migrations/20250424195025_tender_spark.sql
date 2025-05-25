/*
  # Schema update for Florence School Management System

  1. Tables
    - profiles: User profiles with admin role
    - students: Student records
    - teachers: Teacher information
    - fee_records: Fee payment records
    - class_schedules: Class schedules
    - promotion_history: Track class promotions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Set up admin-only access where needed
*/

-- Create custom types safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'student_status') THEN
    CREATE TYPE student_status AS ENUM ('active', 'pass-out');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'teacher_status') THEN
    CREATE TYPE teacher_status AS ENUM ('Active', 'On Leave', 'Resigned', 'Pending');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fee_status') THEN
    CREATE TYPE fee_status AS ENUM ('Paid', 'Unpaid', 'Partial');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'class_type') THEN
    CREATE TYPE class_type AS ENUM (
      'Nursery', 'KG1', 'KG2', 
      'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
      'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
    );
  END IF;
END$$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
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

CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone_number text NOT NULL,
  joining_date date NOT NULL,
  status teacher_status NOT NULL DEFAULT 'Active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fee_records (
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

CREATE TABLE IF NOT EXISTS class_schedules (
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

CREATE TABLE IF NOT EXISTS promotion_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promoted_at timestamptz NOT NULL DEFAULT now(),
  promoted_by uuid REFERENCES auth.users(id),
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON profiles;
DROP POLICY IF EXISTS "Admin users can manage students" ON students;
DROP POLICY IF EXISTS "Allow authenticated users to read students" ON students;
DROP POLICY IF EXISTS "Admin users can manage teachers" ON teachers;
DROP POLICY IF EXISTS "Allow authenticated users to read teachers" ON teachers;
DROP POLICY IF EXISTS "Admin users can manage fee records" ON fee_records;
DROP POLICY IF EXISTS "Allow authenticated users to read fee records" ON fee_records;
DROP POLICY IF EXISTS "Admin users can manage class schedules" ON class_schedules;
DROP POLICY IF EXISTS "Allow authenticated users to read class schedules" ON class_schedules;
DROP POLICY IF EXISTS "Admin users can manage promotion history" ON promotion_history;
DROP POLICY IF EXISTS "Allow authenticated users to read promotion history" ON promotion_history;

-- Create policies
CREATE POLICY "Admin users can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles profiles_1
    WHERE profiles_1.id = auth.uid()
    AND profiles_1.role = 'admin'
  ));

CREATE POLICY "Allow authenticated users to read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage students"
  ON students FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Allow authenticated users to read students"
  ON students FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage teachers"
  ON teachers FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Allow authenticated users to read teachers"
  ON teachers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage fee records"
  ON fee_records FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Allow authenticated users to read fee records"
  ON fee_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage class schedules"
  ON class_schedules FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Allow authenticated users to read class schedules"
  ON class_schedules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage promotion history"
  ON promotion_history FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Allow authenticated users to read promotion history"
  ON promotion_history FOR SELECT
  TO authenticated
  USING (true);

-- Create function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_auth_user_created()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, role)
  VALUES (new.id, 'admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_auth_user_created();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_fee_records_student_year ON fee_records(student_id, year);
CREATE INDEX IF NOT EXISTS idx_fee_records_month_year ON fee_records(month, year);
CREATE INDEX IF NOT EXISTS idx_class_schedules_class ON class_schedules(class);
CREATE INDEX IF NOT EXISTS idx_teachers_status ON teachers(status);