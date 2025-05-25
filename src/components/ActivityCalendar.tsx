import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { Activity } from '../types';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface ActivityCalendarProps {
  onSelectDate: (date: Date) => void;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .gte('performed_at', start.toISOString())
          .lte('performed_at', end.toISOString());

        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [currentDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onSelectDate(date);
  };

  const nextMonth = () => {
    setCurrentDate(current => new Date(current.getFullYear(), current.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(current => new Date(current.getFullYear(), current.getMonth() - 1));
  };

  const getActivityCountForDate = (date: Date) => {
    return activities.filter(activity => 
      isSameDay(parseISO(activity.performed_at), date)
    ).length;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
          Activities Calendar
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-medium text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {days.map(day => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const activityCount = getActivityCountForDate(day);
          
          return (
            <motion.button
              key={day.toString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDateClick(day)}
              className={`
                relative p-2 text-sm rounded-lg transition-colors
                ${!isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-gray-900'}
                ${isSelected ? 'bg-primary-100 text-primary-900' : 'hover:bg-gray-100'}
              `}
            >
              <span>{format(day, 'd')}</span>
              {activityCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                  {activityCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" />
        </div>
      )}
    </div>
  );
};

export default ActivityCalendar;