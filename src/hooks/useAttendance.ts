import { useState, useEffect } from 'react';
import { supabase, AttendanceRecord, AttendanceStats, SubjectStats } from '../lib/supabase';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ALL_SUBJECTS } from '../lib/schedule';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (date: Date, subject: string, status: 'Present' | 'Absent' | 'Cancelled') => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('attendance')
        .select('id')
        .eq('date', dateStr)
        .eq('subject', subject);

      if (fetchError) throw fetchError;

      if (existing && existing.length > 0) {
        const { error } = await supabase
          .from('attendance')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', existing[0].id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('attendance')
          .insert([{ date: dateStr, subject, status }]);

        if (error) throw error;
      }

      await fetchAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        alert('Connection error: Unable to connect to the database. Please check your internet connection and Supabase configuration.');
      } else {
        alert(`Error marking attendance: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const deleteAttendance = async (date: Date, subject?: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    try {
      let query = supabase.from('attendance').delete().eq('date', dateStr);
      
      if (subject) {
        query = query.eq('subject', subject);
      }

      const { error } = await query;
      if (error) throw error;

      await fetchAttendance();
    } catch (error) {
      console.error('Error deleting attendance:', error);
      alert(`Error deleting attendance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getAttendanceForDate = (date: Date, subject: string): 'Present' | 'Absent' | 'Cancelled' | null => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = attendance.find(
      record => record.date === dateStr && record.subject === subject
    );
    return record ? record.status : null;
  };

  const calculateStats = (records: AttendanceRecord[]): AttendanceStats => {
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const cancelled = records.filter(r => r.status === 'Cancelled').length;
    const total = present + absent; // Exclude cancelled from total
    const percentage = total > 0 ? (present / total) * 100 : 0;

    return { present, absent, cancelled, total, percentage };
  };

  const getSubjectStats = (subject: string, period: 'all' | 'week' | 'month' = 'all'): SubjectStats => {
    let filteredRecords = attendance.filter(record => record.subject === subject);

    if (period === 'week') {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      filteredRecords = filteredRecords.filter(record => 
        isWithinInterval(new Date(record.date), { start: weekStart, end: weekEnd })
      );
    } else if (period === 'month') {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      filteredRecords = filteredRecords.filter(record => 
        isWithinInterval(new Date(record.date), { start: monthStart, end: monthEnd })
      );
    }

    const stats = calculateStats(filteredRecords);
    
    // Calculate how many more classes needed to reach 75%
    let needToAttend = 0;
    if (stats.percentage < 75 && stats.total > 0) {
      // Formula: (present + x) / (total + x) = 0.75
      // Solving for x: x = (0.75 * total - present) / 0.25
      needToAttend = Math.ceil((0.75 * stats.total - stats.present) / 0.25);
    }

    return { ...stats, subject, needToAttend };
  };

  const getGlobalStats = (period: 'all' | 'week' | 'month' = 'all'): AttendanceStats & { needToAttend?: number } => {
    let filteredRecords = attendance;

    if (period === 'week') {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      filteredRecords = filteredRecords.filter(record => 
        isWithinInterval(new Date(record.date), { start: weekStart, end: weekEnd })
      );
    } else if (period === 'month') {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      filteredRecords = filteredRecords.filter(record => 
        isWithinInterval(new Date(record.date), { start: monthStart, end: monthEnd })
      );
    }

    const stats = calculateStats(filteredRecords);
    
    // Calculate how many more classes needed to reach 75%
    let needToAttend = 0;
    if (stats.percentage < 75 && stats.total > 0) {
      needToAttend = Math.ceil((0.75 * stats.total - stats.present) / 0.25);
    }

    return { ...stats, needToAttend };
  };

  const getSubjectRecords = (subject: string): AttendanceRecord[] => {
    return attendance
      .filter(record => record.subject === subject)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return {
    attendance,
    loading,
    markAttendance,
    deleteAttendance,
    getAttendanceForDate,
    getSubjectStats,
    getGlobalStats,
    getSubjectRecords,
    refetch: fetchAttendance
  };
};