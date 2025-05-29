import React from "react";

const MockExamsSkeleton = () => {
  return (
    <div className="px-6 text-white h-[85vvh] overflow-hidden" >
      {/* Header Skeleton */}
      <div className="h-8 w-48 bg-white/20 rounded mb-6 shimmer"></div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 flex-wrap">
          {/* Search Bar Skeleton */}
          <div className="flex items-center px-4 py-2 bg-white/10 rounded-full border border-white/30 w-64 h-10 shimmer"></div>
          
          {/* Subject Filter Skeleton */}
          <div className="px-4 py-2 bg-white/10 rounded-full w-40 h-10 shimmer"></div>
        </div>

        {/* Create Button Skeleton */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/50 rounded-full w-24 h-10 shimmer"></div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl max-h-[67vh] border border-white/20 bg-white/10 backdrop-blur-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-purple-700">
            <tr>
              {[...Array(6)].map((_, i) => (
                <th key={i} className="text-left p-3">
                  <div className="h-4 w-24 bg-white/20 shimmer"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(12)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t border-white/10">
                {[...Array(6)].map((_, cellIndex) => (
                  <td key={cellIndex} className="p-3">
                    <div className={`h-4 ${cellIndex === 5 ? 'w-20' : 'w-32'} bg-white/10 shimmer`}></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center mt-4 gap-4 text-white">
        <div className="px-4 py-1 bg-purple-700 rounded w-20 h-8 shimmer"></div>
        <div className="w-24 h-4 bg-white/10 shimmer"></div>
        <div className="px-4 py-1 bg-purple-700 rounded w-20 h-8 shimmer"></div>
      </div>

      {/* CSS for shimmer effect */}
      <style jsx>{`
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default MockExamsSkeleton;