import React from 'react';
import { TeacherStatus, FeeStatus, getStatusColor } from '../types';

interface StatusBadgeProps {
  status: TeacherStatus | FeeStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClass = getStatusColor(status);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;