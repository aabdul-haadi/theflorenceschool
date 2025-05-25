import React from 'react';
import { useData } from '../contexts/DataContext';
import { YEARS } from '../types';

const YearSelector: React.FC = () => {
  const { selectedYear, setSelectedYear } = useData();

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="year-select" className="text-sm font-medium text-gray-700">
        Year:
      </label>
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
        className="block w-24 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {YEARS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearSelector;