import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { MONTHS, ALL_CLASSES, ClassType } from '../../types';
import StatusBadge from '../../components/StatusBadge';

const FeeList: React.FC = () => {
  const { students, feeRecords, selectedYear } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedClass, setSelectedClass] = useState<ClassType | 'all'>('all');
  
  const activeStudents = students.filter(student => {
    // Filter by active status and year
    if (student.status !== 'active' || student.academic_year !== selectedYear) return false;
    
    // Filter by class
    if (selectedClass !== 'all' && student.class !== selectedClass) return false;
    
    // Filter by search term
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.registration_id.toLowerCase().includes(searchLower) ||
      student.class.toLowerCase().includes(searchLower)
    );
  });
  
  const getStudentFeeStatus = (studentId: string, month: number) => {
    const record = feeRecords.find(
      fee => fee.student_id === studentId && fee.month === month && fee.year === selectedYear
    );
    
    return record ? record.status : 'Unpaid';
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Fee Management</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div className="sm:w-48 flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedMonth === 'all' ? 'all' : selectedMonth.toString()}
              onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Months</option>
              {MONTHS.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>

          <div className="sm:w-48 flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as ClassType | 'all')}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Classes</option>
              {ALL_CLASSES.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>
        
        {activeStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reg. ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  {selectedMonth === 'all' ? (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee Status
                    </th>
                  ) : (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {MONTHS[selectedMonth as number]}
                    </th>
                  )}
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.registration_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.class}
                    </td>
                    {selectedMonth === 'all' ? (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {Array.from({ length: 12 }).map((_, index) => {
                            const status = getStudentFeeStatus(student.id, index);
                            return (
                              <div 
                                key={index} 
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                                style={{
                                  backgroundColor: 
                                    status === 'Paid' ? '#DCFCE7' : 
                                    status === 'Partial' ? '#FEF9C3' : '#FEE2E2',
                                  color: 
                                    status === 'Paid' ? '#166534' : 
                                    status === 'Partial' ? '#854D0E' : '#991B1B'
                                }}
                                title={`${MONTHS[index]}: ${status}`}
                              >
                                {MONTHS[index].charAt(0)}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    ) : (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={getStudentFeeStatus(student.id, selectedMonth as number)} />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/fees/student/${student.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Manage Fees
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No active students found for {selectedYear}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeList;