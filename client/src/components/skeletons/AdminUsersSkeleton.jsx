import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaFileExport } from "react-icons/fa";

const AdminUsersSkeleton = () => {
  const [columns, setColumns] = useState(6);
  const [rowCount, setRowCount] = useState(7);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColumns(4);
        setRowCount(5);
      } else if (window.innerWidth < 1024) {
        setColumns(5);
        setRowCount(6);
      } else {
        setColumns(6);
        setRowCount(7);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shimmerStyle = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
    position: 'relative',
    overflow: 'hidden'
  };

  const columnConfig = {
    6: ['User', 'Contact', 'Progress', 'Status', 'Role', 'Actions'],
    5: ['User', 'Contact', 'Progress', 'Status', 'Actions'],
    4: ['User', 'Contact', 'Status', 'Actions']
  };

  return (
    <div className="px-6 relative h-[87vh] ml-2 rounded-xl overflow-hidden">
      {/* Header Section */}
      <div className="mb-6">
        <div style={shimmerStyle} className="h-8 w-40 bg-white/20 rounded mb-2 z-10"></div>
        <div style={shimmerStyle} className="h-4 w-32 bg-white/20 rounded z-10"></div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-wrap flex-1 gap-4 w-full">
          {/* Search Input */}
          <div 
            className="flex items-center bg-white/10 rounded-full px-4 py-2 w-full max-w-sm"
            style={shimmerStyle}
          >
            <FaSearch className="text-white/30 mr-2 z-10" />
            <div className="h-4 w-full bg-white/20 rounded z-10"></div>
          </div>

          {/* Sort/Filter Dropdowns - Responsive */}
          {[...Array(columns > 5 ? 3 : 2)].map((_, i) => (
            <div 
              key={i} 
              className="px-4 py-2 rounded-full bg-white/5 h-10 w-32"
              style={shimmerStyle}
            ></div>
          ))}
        </div>

        {/* Action Buttons - Responsive */}
        <div className="flex gap-2 md:gap-4 w-full md:w-auto">
          <div 
            className="bg-white/10 px-4 md:px-5 py-2 flex gap-2 items-center rounded-full h-10 w-full md:w-28"
            style={shimmerStyle}
          >
            <FaPlus className="text-white/30 z-10" />
            <div className="h-4 w-16 bg-white/20 rounded z-10 hidden md:block"></div>
          </div>
          <div 
            className="bg-white/10 px-4 md:px-5 py-2 flex gap-2 items-center rounded-full h-10 w-full md:w-28"
            style={shimmerStyle}
          >
            <FaFileExport className="text-white/30 z-10" />
            <div className="h-4 w-16 bg-white/20 rounded z-10 hidden md:block"></div>
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
        <div className="max-h-[80vh] h-[69vh]">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800">
            <div className={`grid gap-4 px-6 py-4`} style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
            }}>
              {columnConfig[columns].map((item, i) => (
                <div key={i} className="h-6 bg-white/30 rounded z-10"></div>
              ))}
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/10">
            {[...Array(rowCount)].map((_, rowIndex) => (
              <div 
                key={rowIndex} 
                className={`grid gap-4 px-6 py-4`}
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  ...shimmerStyle
                }}
              >
                {/* User Column (Always visible) */}
                <div className="flex items-center z-10">
                  <div className="h-10 w-10 rounded-full bg-white/20 mr-2 md:mr-4"></div>
                  <div>
                    <div className="h-4 w-24 md:w-32 bg-white/20 rounded mb-2"></div>
                    <div className="h-3 w-20 md:w-24 bg-white/20 rounded"></div>
                  </div>
                </div>

                {/* Contact Column (Hidden on smallest screens) */}
                {columns > 3 && (
                  <div className="z-10">
                    <div className="h-4 w-32 md:w-40 bg-white/20 rounded mb-2"></div>
                    <div className="h-3 w-20 md:w-24 bg-white/20 rounded"></div>
                  </div>
                )}

                {/* Progress Column (Only on larger screens) */}
                {columns > 4 && (
                  <div className="flex justify-center z-10">
                    <div className="flex space-x-2 md:space-x-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="text-center">
                          <div className="h-4 w-6 md:w-8 bg-white/20 rounded mb-1"></div>
                          <div className="h-3 w-6 md:w-8 bg-white/20 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Column */}
                <div className="flex justify-center z-10">
                  <div className="h-6 w-12 md:w-16 bg-white/20 rounded-full"></div>
                </div>

                {/* Role Column (Hidden on medium screens) */}
                {columns > 5 && (
                  <div className="flex justify-center z-10">
                    <div className="h-6 w-12 md:w-16 bg-white/20 rounded-full"></div>
                  </div>
                )}

                {/* Actions Column (Always visible) */}
                <div className="flex justify-end space-x-1 md:space-x-2 z-10">
                  {[...Array(columns > 4 ? 3 : 2)].map((_, i) => (
                    <div key={i} className="h-8 w-8 bg-white/20 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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

export default AdminUsersSkeleton;