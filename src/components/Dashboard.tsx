import React, { useState } from 'react';
import { ALL_SUBJECTS, SUBJECT_COLORS } from '../lib/schedule';
import { useAttendance } from '../hooks/useAttendance';
import { AlertTriangle, TrendingUp, Calendar, Target, Download } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { getSubjectStats, getGlobalStats, attendance } = useAttendance();
  const [period, setPeriod] = useState<'all' | 'week' | 'month'>('all');

  const globalStats = getGlobalStats(period);
  const subjectStats = ALL_SUBJECTS.map(subject => getSubjectStats(subject, period));

  const exportToCSV = () => {
    const headers = ['Date', 'Subject', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...attendance.map(record => [
        record.date,
        record.subject,
        record.status,
        record.created_at ? format(new Date(record.created_at), 'yyyy-MM-dd HH:mm:ss') : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const pieData = [
    { name: 'Present', value: globalStats.present, color: '#10B981' },
    { name: 'Absent', value: globalStats.absent, color: '#EF4444' },
  ];

  const barData = subjectStats.map(stat => ({
    subject: stat.subject,
    percentage: stat.percentage,
    present: stat.present,
    total: stat.total,
    color: SUBJECT_COLORS[stat.subject] || '#6B7280'
  }));

  const periodLabels = {
    all: 'Till-Date',
    week: 'This Week',
    month: 'This Month'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Track your attendance performance and insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Till-Date</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Global Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Global Attendance</p>
              <p className="text-3xl font-bold text-gray-800">{globalStats.percentage.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">{globalStats.present} / {globalStats.total} classes</p>
            </div>
            <div className={`p-3 rounded-full ${globalStats.percentage >= 75 ? 'bg-green-100' : 'bg-red-100'}`}>
              <TrendingUp className={`w-6 h-6 ${globalStats.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          {globalStats.percentage < 75 && globalStats.needToAttend && globalStats.needToAttend > 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">
                <Target className="w-4 h-4 inline mr-1" />
                Attend {globalStats.needToAttend} more classes to reach 75%
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Classes Attended</p>
              <p className="text-3xl font-bold text-green-600">{globalStats.present}</p>
              <p className="text-sm text-gray-500">{periodLabels[period]}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Classes Missed</p>
              <p className="text-3xl font-bold text-red-600">{globalStats.absent}</p>
              <p className="text-sm text-gray-500">{periodLabels[period]}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled Classes</p>
              <p className="text-3xl font-bold text-orange-600">{globalStats.cancelled}</p>
              <p className="text-sm text-gray-500">{periodLabels[period]}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Attendance Distribution</h3>
          {globalStats.total > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} classes`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No data available for the selected period
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject-wise Attendance</h3>
          {barData.some(d => d.total > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Attendance']} />
                <Bar dataKey="percentage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No data available for the selected period
            </div>
          )}
        </div>
      </div>

      {/* Subject Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Subject-wise Performance ({periodLabels[period]})</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectStats.map(stat => {
              const isLowAttendance = stat.percentage < 75 && stat.total > 0;
              const subjectColor = SUBJECT_COLORS[stat.subject] || '#6B7280';

              return (
                <div
                  key={stat.subject}
                  className={`p-6 rounded-lg border-l-4 ${
                    isLowAttendance ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-300'
                  }`}
                  style={{ borderLeftColor: isLowAttendance ? '#EF4444' : subjectColor }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{stat.subject}</h4>
                    {isLowAttendance && (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Attended:</span>
                      <span className="font-medium">{stat.present} / {stat.total}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(stat.percentage, 100)}%`,
                          backgroundColor: isLowAttendance ? '#EF4444' : subjectColor
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className={`text-lg font-bold ${
                        isLowAttendance ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {stat.percentage.toFixed(1)}%
                      </span>
                      {isLowAttendance && (
                        <span className="text-xs text-red-600 font-medium">Low Attendance!</span>
                      )}
                    </div>

                    {stat.needToAttend && stat.needToAttend > 0 && (
                      <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-700">
                        <Target className="w-3 h-3 inline mr-1" />
                        Need {stat.needToAttend} more classes for 75%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {attendance.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Available</h3>
          <p className="text-gray-500">Start marking your attendance to see analytics and insights here.</p>
        </div>
      )}
    </div>
  );
};