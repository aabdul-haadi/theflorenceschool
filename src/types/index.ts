export type ClassType = 'Nursery' | 'KG1' | 'KG2' | 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5' | 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10';

export const ALL_CLASSES: ClassType[] = [
  'Nursery', 'KG1', 'KG2', 
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];

export type TeacherStatus = 'Active' | 'On Leave' | 'Resigned' | 'Pending';

export type FeeStatus = 'Paid' | 'Unpaid' | 'Partial';

export type ActivityType = 'fee_update' | 'teacher_update' | 'student_update' | 'schedule_update';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  performed_by: string;
  performed_at: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Student {
  id: string;
  registration_id: string;
  name: string;
  father_name: string;
  phone_number: string;
  class: ClassType;
  status: 'active' | 'pass-out';
  joining_date: string;
  academic_year: number;
}

export interface Teacher {
  id: string;
  name: string;
  phone_number: string;
  joining_date: string;
  status: TeacherStatus;
}

export interface FeeRecord {
  id: string;
  student_id: string;
  month: number;
  year: number;
  amount: number;
  status: FeeStatus;
  paid_date?: string;
}

export interface ClassSchedule {
  id: string;
  class: ClassType;
  day_of_week: number;
  start_time: string;
  end_time: string;
  subject: string;
  teacher_id: string;
}

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const YEARS = Array.from(
  { length: 2050 - new Date().getFullYear() + 1 }, 
  (_, i) => new Date().getFullYear() + i
);

export const getStatusColor = (status: FeeStatus | TeacherStatus): string => {
  switch (status) {
    case 'Paid':
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Unpaid':
    case 'Resigned':
      return 'bg-red-100 text-red-800';
    case 'Partial':
      return 'bg-yellow-100 text-yellow-800';
    case 'On Leave':
      return 'bg-blue-100 text-blue-800';
    case 'Pending':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getNextClass = (currentClass: ClassType): ClassType | null => {
  const currentIndex = ALL_CLASSES.indexOf(currentClass);
  if (currentIndex === -1 || currentIndex === ALL_CLASSES.length - 1) {
    return null;
  }
  return ALL_CLASSES[currentIndex + 1];
};