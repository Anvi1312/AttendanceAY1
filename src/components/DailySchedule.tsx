import React from 'react';
import { format } from 'date-fns';
import { WEEKLY_SCHEDULE, SUBJECT_COLORS } from '../lib/schedule';
import { useAttendance } from '../hooks/useAttendance';
import { Check, X, Ban, Clock, Trash2 } from 'lucide-react';

interface DailyScheduleProps {
  selectedDate: Date;
}

export const DailySchedule: React.FC<DailyScheduleProps> = ({ selectedDate }) => {
  const { markAttendance, getAttendanceForDate, deleteAttendance } = useAttendance();
  
  const dayName = format(selectedDate, 'EEEE');
  const schedule = WEEKLY_SCHEDULE[dayName] || [];

  const handleAttendanceClick = async (subject: string, status: 'Present' | 'Absent' | 'Cancelled') => {
    await markAttendance(selectedDate, subject, status);
  };

  const handleDeleteAttendance = async (subject: string) => {
    if (window.confirm(`Delete attendance record for ${subject}?`)) {
      await deleteAttendance(selectedDate, subject);
    }
  };

  const clearAllAttendance = async () => {
    if (window.confirm(`Clear all attendance for ${format(selectedDate, 'MMMM d, yyyy')}?`)) {
      await deleteAttendance(selectedDate);
    }
  };

  if (schedule.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Classes Today</h3>
        <p className="text-gray-500">No classes are scheduled for {dayName}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">
          Today's Schedule ({schedule.length} {schedule.length === 1 ? 'class' : 'classes'})
        </h3>
        <button
          onClick={clearAllAttendance}
          className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm">Clear All</span>
        </button>
      </div>

      <div className="grid gap-4">
        {schedule.map((subject, index) => {
          const attendanceStatus = getAttendanceForDate(selectedDate, subject.name);
          const subjectColor = SUBJECT_COLORS[subject.name] || '#6B7280';
          
          return (
            <div
              key={`${subject.name}-${index}`}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: subjectColor }}
                  ></div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{subject.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {subject.time}
                      </span>
                      <span>
                        {subject.sessions === 1 ? '1 session' : `${subject.sessions} sessions`}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAttendanceClick(subject.name, 'Present')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        attendanceStatus === 'Present'
                          ? 'bg-green-500 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span className="font-medium">Present</span>
                    </button>
                    
                    <button
                      onClick={() => handleAttendanceClick(subject.name, 'Absent')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        attendanceStatus === 'Absent'
                          ? 'bg-red-500 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span className="font-medium">Absent</span>
                    </button>
                    
                    <button
                      onClick={() => handleAttendanceClick(subject.name, 'Cancelled')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        attendanceStatus === 'Cancelled'
                          ? 'bg-orange-500 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-700'
                      }`}
                    >
                      <Ban className="w-4 h-4" />
                      <span className="font-medium">Cancelled</span>
                    </button>
                  </div>
                  
                  {attendanceStatus && (
                    <button
                      onClick={() => handleDeleteAttendance(subject.name)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};