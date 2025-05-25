import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ALL_CLASSES, DAYS_OF_WEEK, ClassType, ClassSchedule } from '../../types';
import UpdateButton from '../../components/UpdateButton';

const ClassScheduleComponent: React.FC = () => {
  const { teachers, schedules, addSchedule, updateSchedule } = useData();
  const [selectedClass, setSelectedClass] = useState<ClassType>('Class 1');
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [pendingChanges, setPendingChanges] = useState<Record<string, Partial<ClassSchedule>>>({});
  
  const existingSchedule = schedules.filter(s => s.class === selectedClass);

  const handleAddTimeSlot = async (day: string) => {
    const dayIndex = DAYS_OF_WEEK.indexOf(day);
    if (dayIndex === -1) return;

    const slotKey = `${selectedClass}-${dayIndex}-new`;
    setIsUpdating(prev => ({ ...prev, [slotKey]: true }));

    try {
      const newSlot: Omit<ClassSchedule, 'id'> = {
        class: selectedClass,
        day_of_week: dayIndex,
        start_time: '08:00',
        end_time: '09:00',
        subject: '',
        teacher_id: null
      };

      await addSchedule(newSlot);
    } catch (error) {
      // Error handling is done in DataContext
    } finally {
      setIsUpdating(prev => ({ ...prev, [slotKey]: false }));
    }
  };

  const handleInputChange = (schedule: ClassSchedule, field: keyof ClassSchedule, value: any) => {
    const scheduleKey = `${schedule.id}`;
    const currentChanges = pendingChanges[scheduleKey] || {};
    
    // Only track the change if it's different from the original value
    if (value !== schedule[field]) {
      setPendingChanges(prev => ({
        ...prev,
        [scheduleKey]: {
          ...currentChanges,
          [field]: value
        }
      }));
    } else {
      // If the value is the same as original, remove it from pending changes
      const { [field]: removed, ...remainingChanges } = currentChanges;
      if (Object.keys(remainingChanges).length === 0) {
        setPendingChanges(prev => {
          const { [scheduleKey]: removed, ...rest } = prev;
          return rest;
        });
      } else {
        setPendingChanges(prev => ({
          ...prev,
          [scheduleKey]: remainingChanges
        }));
      }
    }
  };

  const handleUpdateTimeSlot = async (schedule: ClassSchedule) => {
    const scheduleKey = `${schedule.id}`;
    const updates = pendingChanges[scheduleKey];
    
    if (!updates) return;

    setIsUpdating(prev => ({ ...prev, [scheduleKey]: true }));

    try {
      const updatedSchedule: ClassSchedule = {
        ...schedule,
        ...updates
      };

      await updateSchedule(updatedSchedule);
      
      // Clear pending changes after successful update
      setPendingChanges(prev => {
        const { [scheduleKey]: removed, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      // Error handling is done in DataContext
    } finally {
      setIsUpdating(prev => ({ ...prev, [scheduleKey]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Class Schedule</h1>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value as ClassType)}
          className="border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          {ALL_CLASSES.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-gray-200">
          {DAYS_OF_WEEK.map((day) => {
            const dayIndex = DAYS_OF_WEEK.indexOf(day);
            const daySchedules = existingSchedule.filter(s => s.day_of_week === dayIndex);
            
            return (
              <div key={day} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{day}</h3>
                  <button
                    onClick={() => handleAddTimeSlot(day)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Add Time Slot
                  </button>
                </div>
                
                <div className="space-y-3">
                  {daySchedules.map((schedule) => {
                    const scheduleKey = `${schedule.id}`;
                    const hasChanges = Boolean(pendingChanges[scheduleKey]);
                    
                    return (
                      <div key={schedule.id} className="flex items-center space-x-4">
                        <input
                          type="time"
                          value={pendingChanges[scheduleKey]?.start_time || schedule.start_time}
                          onChange={(e) => handleInputChange(schedule, 'start_time', e.target.value)}
                          className="border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={pendingChanges[scheduleKey]?.end_time || schedule.end_time}
                          onChange={(e) => handleInputChange(schedule, 'end_time', e.target.value)}
                          className="border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                        <input
                          type="text"
                          value={pendingChanges[scheduleKey]?.subject || schedule.subject}
                          onChange={(e) => handleInputChange(schedule, 'subject', e.target.value)}
                          placeholder="Subject"
                          className="flex-1 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                        <select
                          value={pendingChanges[scheduleKey]?.teacher_id || schedule.teacher_id || ''}
                          onChange={(e) => handleInputChange(schedule, 'teacher_id', e.target.value || null)}
                          className="border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select Teacher</option>
                          {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </option>
                          ))}
                        </select>
                        <UpdateButton
                          onClick={() => handleUpdateTimeSlot(schedule)}
                          isLoading={isUpdating[scheduleKey]}
                          disabled={!hasChanges}
                          className="ml-2"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClassScheduleComponent;