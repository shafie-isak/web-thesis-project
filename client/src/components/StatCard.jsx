import React from 'react';
import { FiUsers, FiBookOpen, FiBookmark, FiFileText, FiClock, FiAward } from 'react-icons/fi';

const iconMap = {
  users: <FiUsers size={28} />,
  subjects: <FiBookOpen size={28} />,
  chapters: <FiBookmark size={28} />,
  mockExams: <FiFileText size={28} />,
  pastExams: <FiClock size={28} />,
  challenges: <FiAward size={28} />,
};

const bgColorMap = {
  users: 'bg-blue-500',
  subjects: 'bg-green-500',
  chapters: 'bg-purple-500',
  mockExams: 'bg-pink-600',
  pastExams: 'bg-red-500',
  challenges: 'bg-yellow-400',
};

const StatCard = ({ type, label, value }) => {
  return (
    <div className={`flex justify-between items-center ${bgColorMap[type]} text-white px-6 py-4 rounded-xl shadow-md`}>
      <div>
        <p className="text-sm opacity-90">{label}</p>
        <h2 className="text-2xl font-bold mt-1">+{value}</h2>
      </div>
      <div className="opacity-80">{iconMap[type]}</div>
    </div>
  );
};

export default StatCard;
