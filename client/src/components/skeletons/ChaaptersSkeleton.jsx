import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaFileExport } from "react-icons/fa";

const ChaptersSkeleton = () => {
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
    <div className="px-6 h-[87vh] overflow-hidden text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="h-8 w-40 bg-white/20 rounded" style={shimmerStyle}></div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div 
            className="px-4 py-2 border border-white/30 rounded-full bg-white/10 flex items-center gap-2 w-full md:w-36"
            style={shimmerStyle}
          >
            <div className="h-4 w-4 bg-white/20 rounded-full"></div>
            <div className="h-4 w-20 bg-white/20 rounded hidden md:block"></div>
          </div>
          <div 
            className="px-4 py-2 border border-white/30 rounded-full bg-white/10 flex items-center gap-2 w-full md:w-36"
            style={shimmerStyle}
          >
            <div className="h-4 w-4 bg-white/20 rounded-full"></div>
            <div className="h-4 w-20 bg-white/20 rounded hidden md:block"></div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Search Input */}
          <div 
            className="flex items-center bg-white/10 border border-white/30 rounded-full px-4 py-2 w-full"
            style={shimmerStyle}
          >
            <FaSearch className="text-white/30 mr-2 z-10" />
            <div className="h-4 w-full bg-white/20 rounded z-10"></div>
          </div>

          {/* Subject Filter */}
          <div 
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-full w-full sm:w-48"
            style={shimmerStyle}
          ></div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="h-4 w-16 bg-white/20 rounded hidden lg:block" style={shimmerStyle}></div>
          <div 
            className="px-4 py-2 border border-white/30 rounded-full bg-white/10 w-full lg:w-36"
            style={shimmerStyle}
          ></div>
          <div 
            className="px-3 py-2 rounded-full bg-white/10 border border-white/20 w-20"
            style={shimmerStyle}
          ></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl h-[72vh] overflow-hidden border border-white/30">
        {/* Table Header */}
        <div className="bg-purple-800 grid grid-cols-12 gap-4 p-3">
          {['#', 'Chapter', 'Questions', 'Subject', 'Actions'].map((_, i) => (
            <div 
              key={i} 
              className={`h-6 bg-white/30 rounded ${i === 4 ? 'col-start-10 col-span-3' : 'col-span-2'}`}
              style={shimmerStyle}
            ></div>
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/10">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="grid grid-cols-12 gap-4 p-3 hover:bg-white/10 transition"
              style={shimmerStyle}
            >
              {/* Chapter Number */}
              <div className="col-span-2 h-6 bg-white/20 rounded z-10"></div>
              
              {/* Chapter Name */}
              <div className="col-span-3 h-6 bg-white/20 rounded z-10"></div>
              
              {/* Question Count */}
              <div className="col-span-2 h-6 bg-white/20 rounded z-10"></div>
              
              {/* Subject */}
              <div className="col-span-3 h-6 bg-white/20 rounded z-10"></div>
              
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

export default ChaptersSkeleton;