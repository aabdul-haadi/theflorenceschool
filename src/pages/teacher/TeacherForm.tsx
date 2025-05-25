import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Teacher } from '../../types';

const TeacherForm: React.FC = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const { getTeacherById, addTeacher, updateTeacher } = useData();
  const isEditMode = Boolean(teacherId);
  
  const initialFormState: Teacher = {
    id: '',
    name: '',
    phone_number: '',
    joining_date: new Date().toISOString().split('T')[0],
    status: 'Active'
  };
  
  const [formData, setFormData] = useState<Teacher>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof Teacher, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (isEditMode && teacherId) {
      const teacher = getTeacherById(teacherId);
      if (teacher) {
        try {
          const joiningDate = teacher.joining_date 
            ? new Date(teacher.joining_date).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0];
          
          setFormData({ ...teacher, joining_date: joiningDate });
        } catch (error) {
          console.error('Error processing joining date:', error);
          setFormData({ 
            ...teacher, 
            joining_date: new Date().toISOString().split('T')[0] 
          });
        }
      } else {
        navigate('/teachers');
      }
    }
  }, [isEditMode, teacherId, getTeacherById, navigate]);
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Teacher, string>> = {};
    
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone_number || !formData.phone_number.trim()) {
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
    if (errors[name as keyof Teacher]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const isValid = validateForm();
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }
      
      if (isEditMode) {
        await updateTeacher(formData);
      } else {
        await addTeacher(formData);
      }
      
      navigate('/teachers');
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">
            {isEditMode ? 'Edit Teacher' : 'Add New Teacher'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
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
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/teachers')}
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
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;