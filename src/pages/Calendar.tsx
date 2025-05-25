import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Activity } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '' });
  const { user } = useAuth();

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

    // Set up real-time subscription
    const subscription = supabase
      .channel('activities')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'activities' 
      }, payload => {
        setActivities(current => [...current, payload.new as Activity]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
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

  const handleAddEvent = async () => {
    if (!selectedDate || !newEvent.title) return;

    try {
      const { error } = await supabase
        .from('activities')
        .insert([{
          type: 'schedule_update',
          description: newEvent.title,
          performed_by: user?.id,
          performed_at: selectedDate.toISOString(),
          metadata: { description: newEvent.description }
        }]);

      if (error) throw error;

      setNewEvent({ title: '', description: '' });
      setShowEventModal(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const selectedDateActivities = selectedDate
    ? activities.filter(activity => isSameDay(parseISO(activity.performed_at), selectedDate))
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CalendarIcon className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">School Calendar</h2>
          </div>
          <div className="flex items-center space-x-4">
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
      </div>

      {selectedDate && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Events for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <button
              onClick={() => setShowEventModal(true)}
              className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Event
            </button>
          </div>

          <div className="space-y-4">
            {selectedDateActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <p className="font-medium text-gray-900">{activity.description}</p>
                {activity.metadata?.description && (
                  <p className="text-sm text-gray-500 mt-1">{activity.metadata.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {format(parseISO(activity.performed_at), 'h:mm a')}
                </p>
              </motion.div>
            ))}
            {selectedDateActivities.length === 0 && (
              <p className="text-gray-500 text-center py-4">No events for this date</p>
            )}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-96"
          >
            <h3 className="text-lg font-semibold mb-4">Add New Event</h3>
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded-md mb-4"
            />
            <textarea
              placeholder="Event Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded-md mb-4"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Add Event
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" />
        </div>
      )}
    </div>
  );
};

export default Calendar;