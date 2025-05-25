import React, { ReactNode } from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow p-6 flex items-center transform-gpu"
    >
      <div className={`rounded-full p-3 mr-4 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">
          {typeof value === 'number' ? (
            <CountUp 
              end={value} 
              duration={2} 
              separator="," 
              decimal="."
              decimals={0}
            />
          ) : (
            value
          )}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;