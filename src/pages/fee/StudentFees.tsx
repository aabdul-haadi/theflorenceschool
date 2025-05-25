import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { FeeRecord, FeeStatus, MONTHS } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import UpdateButton from '../../components/UpdateButton';
import { toast } from 'sonner';

const StudentFees: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { 
    getStudentById, 
    getFeeRecordsByStudent, 
    createFeeRecord, 
    updateFeeRecord,
    selectedYear 
  } = useData();
  
  const [showAmounts, setShowAmounts] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [pendingChanges, setPendingChanges] = useState<Record<string, { amount?: number; status?: FeeStatus }>>({});
  
  if (!studentId) {
    navigate('/fees');
    return null;
  }
  
  const student = getStudentById(studentId);
  
  if (!student) {
    navigate('/fees');
    return null;
  }
  
  const feeRecords = getFeeRecordsByStudent(studentId, selectedYear);
  
  const toggleAmountVisibility = (month: number) => {
    setShowAmounts(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };
  
  const getMonthRecord = (month: number) => {
    return feeRecords.find(record => record.month === month);
  };

  const handleStatusChange = (month: number, status: FeeStatus) => {
    setPendingChanges(prev => ({
      ...prev,
      [month]: { ...prev[month], status }
    }));
  };

  const handleAmountChange = (month: number, amount: number) => {
    setPendingChanges(prev => ({
      ...prev,
      [month]: { ...prev[month], amount }
    }));
  };
  
  const handleUpdate = async (month: number) => {
    const changes = pendingChanges[month];
    if (!changes) return;

    setIsUpdating(prev => ({ ...prev, [month]: true }));
    try {
      const existingRecord = getMonthRecord(month);
      
      if (existingRecord) {
        await updateFeeRecord({
          ...existingRecord,
          amount: changes.amount ?? existingRecord.amount,
          status: changes.status ?? existingRecord.status
        });
      } else {
        await createFeeRecord({
          student_id: studentId,
          month,
          year: selectedYear,
          amount: changes.amount ?? 0,
          status: changes.status ?? 'Unpaid'
        });
      }

      // Clear pending changes for this month
      setPendingChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[month];
        return newChanges;
      });
    } catch (error) {
      console.error('Error updating fee record:', error);
      toast.error('Failed to update fee record');
    } finally {
      setIsUpdating(prev => ({ ...prev, [month]: false }));
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/fees" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Fees
        </Link>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Fee Management</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {student.name} ({student.registration_id}) - {student.class} - {selectedYear}
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {MONTHS.map((monthName, index) => {
                  const record = getMonthRecord(index);
                  const changes = pendingChanges[index] || {};
                  const status = changes.status || record?.status || 'Unpaid';
                  const amount = changes.amount ?? record?.amount ?? 0;
                  const isAmountVisible = showAmounts[index.toString()];
                  const isUpdatingRecord = isUpdating[index.toString()];
                  const hasChanges = Boolean(pendingChanges[index]);
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {monthName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(index, e.target.value as FeeStatus)}
                          disabled={isUpdatingRecord}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                        >
                          <option value="Paid">Paid</option>
                          <option value="Unpaid">Unpaid</option>
                          <option value="Partial">Partial</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <input
                            type={isAmountVisible ? "number" : "password"}
                            value={amount}
                            onChange={(e) => handleAmountChange(index, Number(e.target.value))}
                            disabled={isUpdatingRecord}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => toggleAmountVisibility(index)}
                            disabled={isUpdatingRecord}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 disabled:opacity-50"
                          >
                            {isAmountVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record?.paid_date && status !== 'Unpaid' && (
                          <span className="text-xs text-gray-500">
                            {new Date(record.paid_date).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <UpdateButton
                          onClick={() => handleUpdate(index)}
                          isLoading={isUpdatingRecord}
                          disabled={!hasChanges}
                          className="w-full sm:w-auto"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Link
          to={`/students/${studentId}`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View Student Details
        </Link>
      </div>
    </div>
  );
};

export default StudentFees;