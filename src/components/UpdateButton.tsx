import React from 'react';
import { motion } from 'framer-motion';

interface UpdateButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({ 
  onClick, 
  isLoading = false, 
  disabled = false,
  className = ''
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        disabled || isLoading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-primary-600 text-white hover:bg-primary-700'
      } ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Updating...
        </div>
      ) : (
        'Update'
      )}
    </motion.button>
  );
};

export default UpdateButton