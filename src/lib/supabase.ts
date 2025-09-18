import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project-id.supabase.co' || supabaseAnonKey === 'your-anon-public-key') {
  console.error('Supabase configuration:', { supabaseUrl, supabaseAnonKey: supabaseAnonKey ? 'Set' : 'Missing' });
  throw new Error('Missing or invalid Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set with your actual Supabase project credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AttendanceRecord {
  id?: string;
  date: string;
  subject: string;
  status: 'Present' | 'Absent' | 'Cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  cancelled: number;
  total: number;
  percentage: number;
}

export interface SubjectStats extends AttendanceStats {
  subject: string;
  needToAttend?: number;
}