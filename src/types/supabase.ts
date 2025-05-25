export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'admin'
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          role?: 'admin'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          role?: 'admin'
          created_at?: string | null
          updated_at?: string | null
        }
      }
      students: {
        Row: {
          id: string
          registration_id: string
          name: string
          father_name: string
          phone_number: string
          class: string
          status: 'active' | 'pass-out'
          joining_date: string
          academic_year: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          registration_id: string
          name: string
          father_name: string
          phone_number: string
          class: string
          status?: 'active' | 'pass-out'
          joining_date: string
          academic_year: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          registration_id?: string
          name?: string
          father_name?: string
          phone_number?: string
          class?: string
          status?: 'active' | 'pass-out'
          joining_date?: string
          academic_year?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      teachers: {
        Row: {
          id: string
          name: string
          phone_number: string
          joining_date: string
          status: 'Active' | 'On Leave' | 'Resigned' | 'Pending'
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          phone_number: string
          joining_date: string
          status?: 'Active' | 'On Leave' | 'Resigned' | 'Pending'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone_number?: string
          joining_date?: string
          status?: 'Active' | 'On Leave' | 'Resigned' | 'Pending'
          created_at?: string | null
          updated_at?: string | null
        }
      }
      fee_records: {
        Row: {
          id: string
          student_id: string
          month: number
          year: number
          amount: number
          status: 'Paid' | 'Unpaid' | 'Partial'
          paid_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          month: number
          year: number
          amount: number
          status?: 'Paid' | 'Unpaid' | 'Partial'
          paid_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          month?: number
          year?: number
          amount?: number
          status?: 'Paid' | 'Unpaid' | 'Partial'
          paid_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      class_schedules: {
        Row: {
          id: string
          class: string
          day_of_week: number
          start_time: string
          end_time: string
          subject: string
          teacher_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          class: string
          day_of_week: number
          start_time: string
          end_time: string
          subject: string
          teacher_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          class?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          subject?: string
          teacher_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      promotion_history: {
        Row: {
          id: string
          promoted_at: string
          promoted_by: string | null
          previous_state: Json
          created_at: string | null
        }
        Insert: {
          id?: string
          promoted_at?: string
          promoted_by?: string | null
          previous_state: Json
          created_at?: string | null
        }
        Update: {
          id?: string
          promoted_at?: string
          promoted_by?: string | null
          previous_state?: Json
          created_at?: string | null
        }
      }
    }
  }
}