import React from 'react';
import { Activity } from '../types';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

interface ActivityListProps {
  activities: Activity[];
  date: Date;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, date }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'fee_update':
        return '💰';
      case 'teacher_update':
        return '👨‍🏫';
      case 'student_update':
        return '👨‍🎓';
      case 'schedule_update':
        return '📅';
      default:
        return '📝';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Activities for {format(date, 'MMMM d, yyyy')}
      </h3>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No activities for this date</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">{getActivityIcon(activity.type)}</span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{activity.description}</p>
                <p className="text-sm text-gray-500">
                  {format(parseISO(activity.performed_at), 'h:mm a')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityList;