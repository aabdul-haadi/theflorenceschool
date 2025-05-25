import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Student, ALL_CLASSES, ClassType } from '../../types';

const StudentForm: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { getStudentById, addStudent, updateStudent, selectedYear, checkRegistrationId } = useData();
  const isEditMode = Boolean(studentId);
  
  const initialFormState = {
    id: '',
    registration_id: '',
    name: '',
    father_name: '',
    phone_number: '',
    class: 'Class 1' as ClassType,
    status: 'active' as 'active' | 'pass-out',
    joining_date: new Date().toISOString().split('T')[0],
    academic_year: selectedYear
  };
  
  const [formData, setFormData] = useState<Student>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof Student, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (isEditMode && studentId) {
      const student = getStudentById(studentId);
      if (student) {
        // Format date for the date input
        const joining_date = new Date(student.joining_date).toISOString().split('T')[0];
        setFormData({ ...student, joining_date });
      } else {
        navigate('/students');
      }
    } else {
      setFormData({ ...initialFormState, academic_year: selectedYear });
    }
  }, [isEditMode, studentId, getStudentById, navigate, selectedYear]);
  
  const validateForm = async (): Promise<boolean> => {
    const newErrors: Partial<Record<keyof Student, string>> = {};
    
    if (!formData.registration_id.trim()) {
      newErrors.registration_id = 'Registration ID is required';
    } else {
      // Check if registration ID exists
      const exists = await checkRegistrationId(formData.registration_id, isEditMode ? studentId : undefined);
      if (exists) {
        newErrors.registration_id = 'Registration ID already exists';
      }
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.father_name.trim()) {
      newErrors.father_name = 'Father\'s name is required';
    }
    
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone_number.replace(/\D/g, ''))) {
      newErrors.phone_number = 'Enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof Student]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const isValid = await validateForm();
      if (!isValid) {
        return;
      }
      
      if (isEditMode) {
        await updateStudent(formData);
      } else {
        await addStudent(formData);
      }
      
      navigate('/students');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">
            {isEditMode ? 'Edit Student' : 'Add New Student'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="registration_id" className="block text-sm font-medium text-gray-700 mb-1">
                Registration ID
              </label>
              <input
                type="text"
                id="registration_id"
                name="registration_id"
                value={formData.registration_id}
                onChange={handleChange}
                className={`block w-full rounded-md ${
                  errors.registration_id 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.registration_id && (
                <p className="mt-1 text-sm text-red-600">{errors.registration_id}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full rounded-md ${
                  errors.name 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="father_name" className="block text-sm font-medium text-gray-700 mb-1">
                Father's Name
              </label>
              <input
                type="text"
                id="father_name"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                className={`block w-full rounded-md ${
                  errors.father_name 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.father_name && (
                <p className="mt-1 text-sm text-red-600">{errors.father_name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={`block w-full rounded-md ${
                  errors.phone_number 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.phone_number && (
                <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                {ALL_CLASSES.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="joining_date" className="block text-sm font-medium text-gray-700 mb-1">
                Joining Date
              </label>
              <input
                type="date"
                id="joining_date"
                name="joining_date"
                value={formData.joining_date}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="active">Active</option>
                <option value="pass-out">Passed Out</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="academic_year" className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <input
                type="number"
                id="academic_year"
                name="academic_year"
                value={formData.academic_year}
                onChange={handleChange}
                min="2000"
                max="2050"
                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/students')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;