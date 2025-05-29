import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaFileExport } from "react-icons/fa";

const QuestionsSkeleton = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

const shimmerStyle = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite'
  };

  return (
    <div className="px-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-white/20 rounded" style={shimmerStyle}></div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3 w-full">
          {/* Search Input */}
          <div 
            className="flex items-center bg-white/10 border border-white/30 rounded-full px-4 py-2 w-full"
            style={shimmerStyle}
          >
            <FaSearch className="text-white/30 mr-2 z-10" />
            <div className="h-4 w-full bg-white/20 rounded z-10"></div>
          </div>

          {/* Filters - Stack on mobile */}
          <div className="flex gap-3 w-full">
            <div className="w-full md:w-48 h-10 bg-white/10 rounded-full" style={shimmerStyle}></div>
            <div className="w-full md:w-48 h-10 bg-white/10 rounded-full" style={shimmerStyle}></div>
            <div className="w-full md:w-48 h-10 bg-white/10 rounded-full" style={shimmerStyle}></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full lg:w-auto">
          <div 
            className="px-4 py-2 border border-white/30 rounded-full bg-white/10 flex items-center gap-2 w-full lg:w-36"
            style={shimmerStyle}
          >
            <div className="h-4 w-4 bg-white/20 rounded-full"></div>
            <div className="h-4 w-20 bg-white/20 rounded hidden lg:block"></div>
          </div>
          <div 
            className="px-4 py-2 border border-white/30 rounded-full bg-white/10 flex items-center gap-2 w-full lg:w-36"
            style={shimmerStyle}
          >
            <div className="h-4 w-4 bg-white/20 rounded-full"></div>
            <div className="h-4 w-20 bg-white/20 rounded hidden lg:block"></div>
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl h-[70vh] overflow-hidden border border-white/20">
        {/* Table Header */}
        <div className="bg-purple-700 grid grid-cols-12 gap-4 p-3">
          {['Question', 'Answer', 'Level', 'Chapter', 'Subject', 'Actions'].map((_, i) => (
            <div 
              key={i} 
              className={`h-6 bg-white/30 rounded ${i === 5 ? 'col-start-11 col-span-2' : 'col-span-2'}`}
              style={shimmerStyle}
            ></div>
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/10">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="grid grid-cols-12 gap-4 p-3 hover:bg-white/5 transition"
              style={shimmerStyle}
            >
              {/* Question */}
              <div className="col-span-3 h-6 bg-white/20 rounded z-10"></div>
              
              {/* Answer */}
              <div className="col-span-2 h-6 bg-white/20 rounded z-10"></div>
              
              {/* Difficulty Level */}
              <div className="col-span-1 h-6 bg-white/20 rounded z-10"></div>
              
              {/* Chapter */}
              <div className="col-span-2 h-6 bg-white/20 rounded z-10"></div>
              
              {/* Subject */}
              <div className="col-span-2 h-6 bg-white/20 rounded z-10"></div>
              
              {/* Actions */}
              <div className="col-span-2 flex justify-end gap-2 z-10">
                <div className="h-8 w-8 bg-white/20 rounded"></div>
                <div className="h-8 w-8 bg-white/20 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shimmer Animation CSS */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default QuestionsSkeleton;