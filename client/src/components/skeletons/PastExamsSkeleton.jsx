import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaFilePdf } from "react-icons/fa";

const PastExamsSkeleton = () => {
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
    animation: 'shimmer 1.5s infinite',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div className="px-6 text-white max-h-[88.5vh] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="h-8 w-48 bg-white/20 rounded" style={shimmerStyle}></div>
        <div 
          className="px-4 py-2 border border-white/30 rounded-full bg-white/10 flex items-center gap-2 w-full md:w-36"
          style={shimmerStyle}
        >
          <div className="h-4 w-4 bg-white/20 rounded-full"></div>
          <div className="h-4 w-20 bg-white/20 rounded hidden md:block"></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Search Input */}
        <div 
          className="flex items-center bg-white/10 border border-white/30 rounded-full px-4 py-2 w-full"
          style={shimmerStyle}
        >
          <FaSearch className="text-white/30 mr-2 z-10" />
          <div className="h-4 w-full bg-white/20 rounded z-10"></div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="h-10 bg-white/10 rounded-full"
              style={shimmerStyle}
            ></div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-purple-700 grid grid-cols-12 gap-4 p-3">
          {['Title', 'Year', 'Subject', 'Category', 'PDF', 'Actions'].map((_, i) => (
            <div 
              key={i}
              className={`h-6 bg-white/30 rounded ${
                i === 4 ? 'col-span-1' : 
                i === 5 ? 'col-span-2' : 'col-span-2'
              }`}
              style={shimmerStyle}
            ></div>
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/10">
          {[...Array(8)].map((_, rowIndex) => (
            <div 
              key={rowIndex}
              className="grid grid-cols-12 gap-4 p-3 hover:bg-white/5 transition"
              style={shimmerStyle}
            >
              {/* Title */}
              <div className="col-span-2 h-6 bg-white/20 rounded z-10"></div>
              
              {/* Year */}
              <div className="col-span-2 h-6 bg-white/20 rounded z-10"></div>
              
              {/* Subject */}
              <div className="col-span-2 h-6 bg-white/20 rounded z-10"></div>
              
              {/* Category */}
              <div className="col-span-2 h-6 bg-white/20 rounded z-10"></div>
              
              {/* PDF */}
              <div className="col-span-1 flex items-center z-10">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <FaFilePdf className="text-white/30" />
                </div>
              </div>
              
              {/* Actions */}
              <div className="col-span-2 flex justify-end gap-2 z-10">
                <div className="h-8 w-8 bg-white/20 rounded"></div>
                <div className="h-8 w-8 bg-white/20 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <div className="h-10 w-24 bg-white/10 rounded-full" style={shimmerStyle}></div>
        <div className="h-4 w-32 bg-white/10 rounded" style={shimmerStyle}></div>
        <div className="h-10 w-24 bg-white/10 rounded-full" style={shimmerStyle}></div>
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

export default PastExamsSkeleton;