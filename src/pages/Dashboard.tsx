import React, { useState } from 'react';
import { Users, UserCheck, BookOpen, DollarSign } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import StatCard from '../components/StatCard';
import { MONTHS } from '../types';

const Dashboard: React.FC = () => {
  const { 
    students, 
    teachers, 
    feeRecords, 
    getPassedOutStudents,
    selectedYear 
  } = useData();
  
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  
  const activeStudents = students.filter(s => s.status === 'active' && s.academic_year === selectedYear);
  const passedOutStudents = getPassedOutStudents();
  const activeTeachers = teachers.filter(t => t.status === 'Active');
  
  const paidFeesForMonth = feeRecords.filter(
    record => record.month === selectedMonth && 
    record.year === selectedYear && 
    record.status === 'Paid'
  );
  
  const calculateFeeStats = () => {
    const result = [];
    
    for (let i = 0; i < 12; i++) {
      const recordsForMonth = feeRecords.filter(
        record => record.month === i && record.year === selectedYear
      );
      
      const paidCount = recordsForMonth.filter(
        record => record.status === 'Paid'
      ).length;
      
      const totalStudentsCount = activeStudents.length;
      
      result.push({
        month: MONTHS[i],
        paidCount,
        totalCount: totalStudentsCount,
        percentage: totalStudentsCount ? Math.round((paidCount / totalStudentsCount) * 100) : 0
      });
    }
    
    return result;
  };
  
  const feeStats = calculateFeeStats();
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={activeStudents.length}
          icon={<Users className="h-6 w-6 text-primary-500" />}
          color="bg-primary-100"
        />
        
        <StatCard
          title="Passed Out Students"
          value={passedOutStudents.length}
          icon={<UserCheck className="h-6 w-6 text-green-500" />}
          color="bg-green-100"
        />
        
        <StatCard
          title="Total Teachers"
          value={activeTeachers.length}
          icon={<BookOpen className="h-6 w-6 text-purple-500" />}
          color="bg-purple-100"
        />
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`rounded-full p-3 bg-yellow-100`}>
              <DollarSign className="h-6 w-6 text-yellow-500" />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              {MONTHS.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600 font-medium">Fees Paid</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {paidFeesForMonth.length}/{activeStudents.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {activeStudents.length > 0 
              ? `${Math.round((paidFeesForMonth.length / activeStudents.length) * 100)}% collected`
              : 'No active students'}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Monthly Fee Payment Status</h2>
          <p className="text-sm text-gray-500">Number of students who paid fees out of total students</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {feeStats.map((stat) => (
              <div key={stat.month} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700">{stat.month}</h3>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary-600 h-full rounded-full" 
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
                      {stat.paidCount}/{stat.totalCount}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.percentage}% paid
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;