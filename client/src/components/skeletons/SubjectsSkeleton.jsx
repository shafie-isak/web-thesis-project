import React from "react";
import { FaSearch, FaPlus, FaFileExport, FaSortAlphaDown } from "react-icons/fa";

const SubjectsSkeleton = () => {
  // Responsive column count
  const getColumnCount = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 768) return 2;
    return 3;
  };

  const shimmerStyle = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite'
  };

  return (
    <div className="p-6 h-[86vh] overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Search Input */}
        <div 
          className="relative flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2 w-full max-w-sm overflow-hidden"
          style={shimmerStyle}
        >
          <FaSearch className="text-white/30 mr-2 z-10" />
          <div className="h-4 w-full bg-white/20 rounded z-10"></div>
        </div>
        
        {/* Action Buttons - Responsive Stacking */}
        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
          <div 
            className="relative bg-white/10 px-4 sm:px-5 py-2 border flex gap-2 items-center border-white/20 rounded-full h-10 w-full sm:w-32 overflow-hidden"
            style={shimmerStyle}
          >
            <FaPlus className="text-white/30 z-10" />
            <div className="h-4 w-16 bg-white/20 rounded z-10 hidden sm:block"></div>
          </div>
          <div 
            className="relative bg-white/10 px-4 sm:px-5 py-2 border flex gap-2 items-center border-white/20 rounded-full h-10 w-full sm:w-32 overflow-hidden"
            style={shimmerStyle}
          >
            <FaFileExport className="text-white/30 z-10" />
            <div className="h-4 w-16 bg-white/20 rounded z-10 hidden sm:block"></div>
          </div>
        </div>
      </div>

      {/* Title and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="h-8 w-40 bg-white/20 rounded relative overflow-hidden" style={shimmerStyle}></div>
        <div className="flex items-center gap-2 text-white/50 relative overflow-hidden rounded-full px-3 py-1" style={shimmerStyle}>
          <FaSortAlphaDown className="text-white/30 z-10" />
          <div className="h-4 w-16 bg-white/20 rounded z-10"></div>
        </div>
      </div>

      {/* Subjects Grid - Responsive Columns */}
      <div 
        className={`grid gap-4 p-2 rounded-xl h-[68.3vh] overflow-y-auto`}
        style={{
          gridTemplateColumns: `repeat(${getColumnCount()}, minmax(0, 1fr))`
        }}
      >
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white/10 backdrop-blur-xl rounded-lg shadow-md p-4 flex items-center justify-between border border-white/20 relative overflow-hidden"
            style={shimmerStyle}
          >
            <div className="flex items-center h-11 gap-3 z-10">
              <div className="w-10 h-10 bg-white/20 rounded-full"></div>
              <div className="h-4 w-32 bg-white/20 rounded"></div>
            </div>
            <div className="flex gap-2 z-10">
              <div className="w-8 h-8 bg-white/20 rounded"></div>
              <div className="w-8 h-8 bg-white/20 rounded"></div>
            </div>
          </div>
        ))}
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

export default SubjectsSkeleton;