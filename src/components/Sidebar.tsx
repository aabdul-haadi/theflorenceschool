import React from 'react';
import { NavLink } from 'react-router-dom';
import { School, Users, BookOpen, DollarSign, LayoutDashboard, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  
  return (
    <div className="h-screen w-64 bg-white shadow-lg text-gray-900 flex flex-col fixed">
      <div className="p-6 flex items-center space-x-3 border-b border-gray-100">
        <School className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="font-bold text-xl">The Florence</h1>
          <p className="text-xs text-gray-500">School Management</p>
        </div>
      </div>
      
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <p className="text-xs text-gray-500 mb-4 pl-4">MENU</p>
        <nav className="space-y-1">
          <NavLink 
            to="/dashboard" 
            className={({isActive}) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-50 text-primary-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/students" 
            className={({isActive}) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-50 text-primary-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Users className="h-5 w-5" />
            <span>Students</span>
          </NavLink>
          
          <NavLink 
            to="/teachers" 
            className={({isActive}) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-50 text-primary-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <BookOpen className="h-5 w-5" />
            <span>Teachers</span>
          </NavLink>
          
          <NavLink 
            to="/fees" 
            className={({isActive}) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-50 text-primary-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <DollarSign className="h-5 w-5" />
            <span>Fees</span>
          </NavLink>

          <NavLink 
            to="/calendar" 
            className={({isActive}) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-50 text-primary-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Calendar className="h-5 w-5" />
            <span>Calendar</span>
          </NavLink>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;