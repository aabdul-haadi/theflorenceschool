import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const StudentDetail: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { getStudentById, deleteStudent, getFeeRecordsByStudent, selectedYear } = useData();
  
  if (!studentId) {
    navigate('/students');
    return null;
  }
  
  const student = getStudentById(studentId);
  
  if (!student) {
    navigate('/students');
    return null;
  }
  
  const feeRecords = getFeeRecordsByStudent(studentId, selectedYear);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      deleteStudent(studentId);
      navigate('/students');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/students" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Students
        </Link>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Student Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and records</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/students/${studentId}/edit`)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Registration ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student.registration_id}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student.name}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Father's name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student.father_name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student.phone_number}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Class</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student.class}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  student.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {student.status === 'active' ? 'Active' : 'Passed Out'}
                </span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Joining date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(student.joining_date)}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Academic year</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student.academic_year}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Fee Records</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Payment status for {selectedYear}</p>
          </div>
          <Link
            to={`/fees/student/${studentId}`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Manage Fees
          </Link>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {feeRecords.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, index) => {
                const feeRecord = feeRecords.find(record => record.month === index);
                
                return (
                  <div 
                    key={index} 
                    className={`rounded-lg border p-4 ${
                      feeRecord 
                        ? feeRecord.status === 'Paid' 
                          ? 'border-green-200 bg-green-50' 
                          : feeRecord.status === 'Partial' 
                            ? 'border-yellow-200 bg-yellow-50' 
                            : 'border-red-200 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(0, index).toLocaleString('default', { month: 'long' })}
                    </p>
                    <div className="mt-2">
                      {feeRecord ? (
                        <>
                          <p className={`text-xs font-medium ${
                            feeRecord.status === 'Paid' 
                              ? 'text-green-800' 
                              : feeRecord.status === 'Partial' 
                                ? 'text-yellow-800' 
                                : 'text-red-800'
                          }`}>
                            {feeRecord.status}
                          </p>
                          {feeRecord.paid_date && feeRecord.status !== 'Unpaid' && (
                            <p className="text-xs text-gray-500 mt-1">
                              Paid on: {formatDate(feeRecord.paid_date)}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-gray-500">No record</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No fee records found for {selectedYear}.</p>
              <Link
                to={`/fees/student/${studentId}`}
                className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Fee Records
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;