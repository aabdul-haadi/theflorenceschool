import React from 'react';
import { useLocation } from 'react-router-dom';
import YearSelector from './YearSelector';
import NotificationBell from './NotificationBell';
import { useData } from '../contexts/DataContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { selectedYear } = useData();
  
  const getPageTitle = (): string => {
    const path = location.pathname;
    
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/students') return 'Student Management';
    if (path.startsWith('/students/')) {
      if (path.includes('/edit')) return 'Edit Student';
      if (path.includes('/add')) return 'Add Student';
      return 'Student Details';
    }
    if (path === '/teachers') return 'Teacher Management';
    if (path.startsWith('/teachers/')) {
      if (path.includes('/edit')) return 'Edit Teacher';
      if (path.includes('/add')) return 'Add Teacher';
      return 'Teacher Details';
    }
    if (path === '/fees') return 'Fee Management';
    if (path.startsWith('/fees/')) return 'Fee Details';
    if (path === '/calendar') return 'Calendar';
    
    return 'The Florence School';
  };
  
  return (
    <header className="bg-white border-b border-gray-200 flex justify-between items-center px-8 py-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
        <div className="text-sm text-gray-500 flex items-center">
          <span>Academic Year: {selectedYear}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <NotificationBell />
        <YearSelector />
      </div>
    </header>
  );
};

export default Header;