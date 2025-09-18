import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    onDateChange(newDate);
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isFuture = selectedDate > new Date();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousDay}
          className="p-3 rounded-lg hover:bg-gray-100 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {format(selectedDate, 'EEEE')}
            </h2>
            <p className="text-lg text-gray-600">
              {format(selectedDate, 'MMMM d, yyyy')}
            </p>
            {isToday && (
              <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Today
              </span>
            )}
            {isFuture && (
              <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                Future Date
              </span>
            )}
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={handleDateInputChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <button
          onClick={handleNextDay}
          className="p-3 rounded-lg hover:bg-gray-100 transition-colors group"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
        </button>
      </div>
    </div>
  );
};