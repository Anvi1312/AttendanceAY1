import React, { useState } from 'react';
import { ALL_SUBJECTS, SUBJECT_COLORS } from '../lib/schedule';
import { useAttendance } from '../hooks/useAttendance';
import { format } from 'date-fns';
import { Calendar, Check, X, Ban, ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react';

export const SubjectDetails: React.FC = () => {
  const { getSubjectStats, getSubjectRecords } = useAttendance();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  if (selectedSubject) {
    const records = getSubjectRecords(selectedSubject);
    const stats = getSubjectStats(selectedSubject);
    const subjectColor = SUBJECT_COLORS[selectedSubject] || '#6B7280';

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedSubject(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{selectedSubject}</h2>
            <p className="text-gray-600">Detailed attendance records</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className={`text-2xl font-bold ${stats.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.percentage.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className={`w-6 h-6 ${stats.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
              <X className="w-6 h-6 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-orange-600">{stats.cancelled}</p>
              </div>
              <Ban className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Smart Suggestion */}
        {stats.percentage < 75 && stats.needToAttend && stats.needToAttend > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Attendance Alert</h4>
                <p className="text-red-700 text-sm mt-1">
                  Your attendance is below 75%. You need to attend <strong>{stats.needToAttend} more classes</strong> to reach the minimum requirement.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Records List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Attendance History</h3>
            <p className="text-sm text-gray-600 mt-1">{records.length} total records</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {records.length > 0 ? (
              records.map((record) => (
                <div key={record.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subjectColor }}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {format(new Date(record.date), 'EEEE, MMMM d, yyyy')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(record.date), 'MMM d')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          record.status === 'Present'
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'Absent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {record.status === 'Present' && <Check className="w-3 h-3 mr-1" />}
                        {record.status === 'Absent' && <X className="w-3 h-3 mr-1" />}
                        {record.status === 'Cancelled' && <Ban className="w-3 h-3 mr-1" />}
                        {record.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No attendance records found for {selectedSubject}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Subject Details</h2>
        <p className="text-gray-600 mt-1">Click on any subject to view detailed attendance records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_SUBJECTS.map(subject => {
          const stats = getSubjectStats(subject);
          const records = getSubjectRecords(subject);
          const subjectColor = SUBJECT_COLORS[subject] || '#6B7280';
          const isLowAttendance = stats.percentage < 75 && stats.total > 0;

          return (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: subjectColor }}
                  ></div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {subject}
                  </h3>
                </div>
                {isLowAttendance && (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="font-medium">{stats.present} / {stats.total}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min(stats.percentage, 100)}%`,
                      backgroundColor: isLowAttendance ? '#EF4444' : subjectColor
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-lg font-bold ${
                    isLowAttendance ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {stats.percentage.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500">
                    {records.length} records
                  </span>
                </div>

                {isLowAttendance && (
                  <div className="text-xs text-red-600 font-medium">
                    Low Attendance Warning
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};