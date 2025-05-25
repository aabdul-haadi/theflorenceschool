import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Student, Teacher, FeeRecord, ClassSchedule, Activity } from '../types';

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  feeRecords: FeeRecord[];
  schedules: ClassSchedule[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  loadStudents: () => Promise<void>;
  loadTeachers: () => Promise<void>;
  loadFeeRecords: () => Promise<void>;
  loadSchedules: () => Promise<void>;
  getStudentById: (id: string) => Student | undefined;
  getTeacherById: (id: string) => Teacher | undefined;
  getFeeRecordsByStudent: (studentId: string, year: number) => FeeRecord[];
  deleteStudent: (id: string) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  updateStudent: (student: Student) => Promise<void>;
  updateTeacher: (teacher: Teacher) => Promise<void>;
  updateFeeRecord: (record: FeeRecord) => Promise<void>;
  createFeeRecord: (record: Omit<FeeRecord, 'id'>) => Promise<void>;
  addStudent: (student: Student) => Promise<void>;
  addTeacher: (teacher: Teacher) => Promise<void>;
  addSchedule: (schedule: Omit<ClassSchedule, 'id'>) => Promise<void>;
  updateSchedule: (schedule: ClassSchedule) => Promise<void>;
  checkRegistrationId: (id: string, excludeId?: string) => Promise<boolean>;
  promoteClass: (className: string) => Promise<void>;
  promoteAllClasses: () => Promise<void>;
  undoPromotion: () => Promise<void>;
  getPassedOutStudents: () => Student[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
    }
  };

  const loadTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error loading teachers:', error);
      toast.error('Failed to load teachers');
    }
  };

  const loadFeeRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('fee_records')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });
      
      if (error) throw error;
      setFeeRecords(data || []);
    } catch (error) {
      console.error('Error loading fee records:', error);
      toast.error('Failed to load fee records');
    }
  };

  const loadSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('class_schedules')
        .select('*')
        .order('class')
        .order('day_of_week')
        .order('start_time');
      
      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast.error('Failed to load class schedules');
    }
  };

  const getStudentById = (id: string) => students.find(s => s.id === id);
  const getTeacherById = (id: string) => teachers.find(t => t.id === id);
  const getFeeRecordsByStudent = (studentId: string, year: number) => 
    feeRecords.filter(r => r.student_id === studentId && r.year === year);
  const getPassedOutStudents = () => students.filter(s => s.status === 'pass-out');

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      await supabase.from('activities').insert([{
        type: 'student_update',
        description: 'Student deleted',
        performed_by: user?.id,
        metadata: { student_id: id }
      }]);
      
      toast.success('Student deleted successfully');
      await loadStudents();
      await loadFeeRecords();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
      throw error;
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      await supabase.from('activities').insert([{
        type: 'teacher_update',
        description: 'Teacher deleted',
        performed_by: user?.id,
        metadata: { teacher_id: id }
      }]);
      
      toast.success('Teacher deleted successfully');
      await loadTeachers();
      await loadSchedules();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete teacher');
      throw error;
    }
  };

  const updateStudent = async (student: Student) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({
          registration_id: student.registration_id,
          name: student.name,
          father_name: student.father_name,
          phone_number: student.phone_number,
          class: student.class,
          status: student.status,
          joining_date: student.joining_date,
          academic_year: student.academic_year
        })
        .eq('id', student.id);

      if (error) throw error;

      await supabase.from('activities').insert([{
        type: 'student_update',
        description: 'Student information updated',
        performed_by: user?.id,
        metadata: { student_id: student.id }
      }]);

      toast.success('Student updated successfully');
      await loadStudents();
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
      throw error;
    }
  };

  const updateTeacher = async (teacher: Teacher) => {
    try {
      const { error } = await supabase
        .from('teachers')
        .update({
          name: teacher.name,
          phone_number: teacher.phone_number,
          joining_date: teacher.joining_date,
          status: teacher.status
        })
        .eq('id', teacher.id);

      if (error) throw error;

      await supabase.from('activities').insert([{
        type: 'teacher_update',
        description: 'Teacher information updated',
        performed_by: user?.id,
        metadata: { teacher_id: teacher.id }
      }]);

      toast.success('Teacher updated successfully');
      await loadTeachers();
    } catch (error) {
      console.error('Error updating teacher:', error);
      toast.error('Failed to update teacher');
      throw error;
    }
  };

  const updateFeeRecord = async (record: FeeRecord) => {
    try {
      const { error } = await supabase
        .from('fee_records')
        .update({
          amount: record.amount,
          status: record.status,
          paid_date: record.status !== 'Unpaid' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', record.id);

      if (error) throw error;

      await supabase.from('activities').insert([{
        type: 'fee_update',
        description: `Fee status updated to ${record.status}`,
        performed_by: user?.id,
        metadata: { fee_record_id: record.id, student_id: record.student_id }
      }]);

      toast.success('Fee record updated successfully');
      await loadFeeRecords();
    } catch (error) {
      console.error('Error updating fee record:', error);
      toast.error('Failed to update fee record');
      throw error;
    }
  };

  const createFeeRecord = async (record: Omit<FeeRecord, 'id'>) => {
    try {
      const { error } = await supabase
        .from('fee_records')
        .insert([record]);

      if (error) throw error;

      await supabase.from('activities').insert([{
        type: 'fee_update',
        description: 'New fee record created',
        performed_by: user?.id,
        metadata: { student_id: record.student_id }
      }]);

      toast.success('Fee record created successfully');
      await loadFeeRecords();
    } catch (error) {
      console.error('Error creating fee record:', error);
      toast.error('Failed to create fee record');
      throw error;
    }
  };

  const addStudent = async (student: Student) => {
    try {
      const { error } = await supabase
        .from('students')
        .insert([{
          registration_id: student.registration_id,
          name: student.name,
          father_name: student.father_name,
          phone_number: student.phone_number,
          class: student.class,
          status: student.status,
          joining_date: student.joining_date,
          academic_year: student.academic_year
        }]);

      if (error) throw error;

      await supabase.from('activities').insert([{
        type: 'student_update',
        description: 'New student added',
        performed_by: user?.id,
        metadata: { registration_id: student.registration_id }
      }]);

      toast.success('Student added successfully');
      await loadStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
      throw error;
    }
  };

  const addTeacher = async (teacher: Teacher) => {
    try {
      const { error } = await supabase
        .from('teachers')
        .insert([{
          name: teacher.name,
          phone_number: teacher.phone_number,
          joining_date: teacher.joining_date,
          status: teacher.status
        }]);

      if (error) throw error;

      await supabase.from('activities').insert([{
        type: 'teacher_update',
        description: 'New teacher added',
        performed_by: user?.id,
        metadata: { teacher_name: teacher.name }
      }]);

      toast.success('Teacher added successfully');
      await loadTeachers();
    } catch (error) {
      console.error('Error adding teacher:', error);
      toast.error('Failed to add teacher');
      throw error;
    }
  };

  const addSchedule = async (schedule: Omit<ClassSchedule, 'id'>) => {
    try {
      const { error } = await supabase
        .from('class_schedules')
        .insert([schedule]);

      if (error) throw error;

      await supabase.from('activities').insert([{
        type: 'schedule_update',
        description: 'New class schedule added',
        performed_by: user?.id,
        metadata: { class: schedule.class, day: schedule.day_of_week }
      }]);

      toast.success('Schedule added successfully');
      await loadSchedules();
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast.error('Failed to add schedule');
      throw error;
    }
  };

  const updateSchedule = async (schedule: ClassSchedule) => {
    try {
      const { error } = await supabase
        .from('class_schedules')
        .update({
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          subject: schedule.subject,
          teacher_id: schedule.teacher_id
        })
        .eq('id', schedule.id);

      if (error) throw error;

      await supabase.from('activities').insert([{
        type: 'schedule_update',
        description: 'Class schedule updated',
        performed_by: user?.id,
        metadata: { schedule_id: schedule.id }
      }]);

      toast.success('Schedule updated successfully');
      await loadSchedules();
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('Failed to update schedule');
      throw error;
    }
  };

  const checkRegistrationId = async (id: string, excludeId?: string) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id')
        .eq('registration_id', id);

      if (error) throw error;

      if (!data?.length) return false;
      if (excludeId && data[0].id === excludeId) return false;
      return true;
    } catch (error) {
      console.error('Error checking registration ID:', error);
      return true; // Assume exists on error to prevent duplicates
    }
  };

  const promoteClass = async (className: string) => {
    try {
      const studentsToPromote = students.filter(s => 
        s.status === 'active' && 
        s.class === className && 
        s.academic_year === selectedYear
      );

      const previousState = studentsToPromote.map(s => ({
        id: s.id,
        class: s.class,
        academic_year: s.academic_year
      }));

      for (const student of studentsToPromote) {
        const nextClass = getNextClass(student.class);
        if (!nextClass) {
          await updateStudent({
            ...student,
            status: 'pass-out'
          });
        } else {
          await updateStudent({
            ...student,
            class: nextClass,
            academic_year: selectedYear + 1
          });
        }
      }

      await supabase.from('promotion_history').insert([{
        promoted_by: user?.id,
        previous_state: previousState
      }]);

      toast.success('Class promoted successfully');
    } catch (error) {
      console.error('Error promoting class:', error);
      toast.error('Failed to promote class');
    }
  };

  const promoteAllClasses = async () => {
    try {
      const activeStudents = students.filter(s => 
        s.status === 'active' && 
        s.academic_year === selectedYear
      );

      const previousState = activeStudents.map(s => ({
        id: s.id,
        class: s.class,
        academic_year: s.academic_year
      }));

      for (const student of activeStudents) {
        const nextClass = getNextClass(student.class);
        if (!nextClass) {
          await updateStudent({
            ...student,
            status: 'pass-out'
          });
        } else {
          await updateStudent({
            ...student,
            class: nextClass,
            academic_year: selectedYear + 1
          });
        }
      }

      await supabase.from('promotion_history').insert([{
        promoted_by: user?.id,
        previous_state: previousState
      }]);

      toast.success('All classes promoted successfully');
    } catch (error) {
      console.error('Error promoting classes:', error);
      toast.error('Failed to promote classes');
    }
  };

  const undoPromotion = async () => {
    try {
      const { data: history, error: historyError } = await supabase
        .from('promotion_history')
        .select('*')
        .order('promoted_at', { ascending: false })
        .limit(1);

      if (historyError) throw historyError;
      if (!history?.length) {
        toast.error('No promotion history found');
        return;
      }

      const previousState = history[0].previous_state;
      for (const state of previousState) {
        const student = students.find(s => s.id === state.id);
        if (student) {
          await updateStudent({
            ...student,
            class: state.class,
            academic_year: state.academic_year,
            status: 'active'
          });
        }
      }

      await supabase
        .from('promotion_history')
        .delete()
        .eq('id', history[0].id);

      toast.success('Last promotion undone successfully');
    } catch (error) {
      console.error('Error undoing promotion:', error);
      toast.error('Failed to undo promotion');
    }
  };

  useEffect(() => {
    loadStudents();
    loadTeachers();
    loadFeeRecords();
    loadSchedules();
  }, []);

  return (
    <DataContext.Provider value={{
      students,
      teachers,
      feeRecords,
      schedules,
      selectedYear,
      setSelectedYear,
      loadStudents,
      loadTeachers,
      loadFeeRecords,
      loadSchedules,
      getStudentById,
      getTeacherById,
      getFeeRecordsByStudent,
      deleteStudent,
      deleteTeacher,
      updateStudent,
      updateTeacher,
      updateFeeRecord,
      createFeeRecord,
      addStudent,
      addTeacher,
      addSchedule,
      updateSchedule,
      checkRegistrationId,
      promoteClass,
      promoteAllClasses,
      undoPromotion,
      getPassedOutStudents
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const getNextClass = (currentClass: string) => {
  const classes = [
    'Nursery', 'KG1', 'KG2',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
  ];
  const currentIndex = classes.indexOf(currentClass);
  if (currentIndex === -1 || currentIndex === classes.length - 1) {
    return null;
  }
  return classes[currentIndex + 1];
};