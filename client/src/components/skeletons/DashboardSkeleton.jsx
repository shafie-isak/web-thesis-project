import React, { useState, useEffect } from "react";

const DashboardSkeleton = () => {
  const [cardCount, setCardCount] = useState(6);
  const [chartWidth, setChartWidth] = useState(360);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardCount(4);
        setChartWidth('100%');
      } else if (window.innerWidth < 1024) {
        setCardCount(6);
        setChartWidth('100%');
      } else {
        setCardCount(6);
        setChartWidth(360);
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

  return (
    <div className="px-4 relative h-[87vh] ml-2 rounded-xl">
      {/* Overview Section */}
      <div className="mb-8" >
        <div style={shimmerStyle} className="h-8 w-32 bg-white/20 rounded mb-6 z-10"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {[...Array(cardCount)].map((_, i) => (
            <div 
              key={i} 
              className="bg-white/5 backdrop-blur-sm rounded-lg p-4 h-24 z-10"
              style={shimmerStyle}
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 bg-white/20 rounded"></div>
                <div className="h-6 w-6 bg-white/20 rounded-full"></div>
              </div>
              <div className="h-8 w-16 bg-white/20 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex flex-col xl:flex-row gap-6 mt-8">
        {/* Top Users Skeleton */}
        <div 
          className="p-4 rounded-lg bg-white/5 w-full"
          style={{ ...shimmerStyle, maxWidth: chartWidth }}
        >
          <div className="h-6 w-24 bg-white/20 rounded mb-4 z-10"></div>
          <ul className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-white/10 px-4 py-3 rounded-lg z-10"
                style={shimmerStyle}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                  <div>
                    <div className="h-4 w-32 bg-white/20 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-white/20 rounded"></div>
                  </div>
                </div>
                <div className="h-5 w-12 bg-white/20 rounded"></div>
              </li>
            ))}
          </ul>
        </div>

        {/* Users Growth Chart Skeleton */}
        <div 
          className="bg-white/10 p-5 rounded-2xl w-full h-60"
          style={{ ...shimmerStyle, maxWidth: chartWidth }}
        >
          <div className="flex justify-between mb-4 z-10">
            <div className="h-6 w-32 bg-white/20 rounded"></div>
            <div className="h-5 w-16 bg-white/20 rounded"></div>
          </div>
          <div className="flex justify-between items-end h-40 mt-2 z-10">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className="w-4 md:w-6 bg-white/20 rounded-t" 
                style={{ height: `${Math.random() * 70 + 30}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 z-10">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-3 w-4 md:w-6 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>

        {/* Earnings Chart Skeleton */}
        <div 
          className="bg-white/10 p-5 rounded-2xl w-full h-60"
          style={{ ...shimmerStyle, maxWidth: chartWidth }}
        >
          <div className="flex justify-between mb-4 z-10">
            <div className="h-6 w-24 bg-white/20 rounded"></div>
            <div className="h-5 w-16 bg-white/20 rounded"></div>
          </div>
          <div className="relative h-40 w-full z-10">
            <div className="absolute bottom-0 w-full h-px bg-white/20"></div>
            <div className="absolute left-0 w-full h-px bg-white/20"></div>
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className="absolute bottom-0 w-4 md:w-6 bg-white/20 rounded-t" 
                style={{
                  left: `${i * 12 + 6}%`,
                  height: `${Math.random() * 80 + 20}%`
                }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 z-10">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-3 w-4 md:w-6 bg-white/20 rounded"></div>
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

export default DashboardSkeleton;