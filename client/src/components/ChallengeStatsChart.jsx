import React, { useEffect, useState } from "react";
import { fetchChallengeStats } from "../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import { toast } from "react-toastify";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 text-sm min-w-[220px]">
        <div className="font-bold text-gray-800 mb-1">{data.title}</div>
        <div className="flex items-center text-blue-600">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <span>Participants: <strong>{data.participantCount.toLocaleString()}</strong></span>
        </div>
        <div className="flex items-center text-gray-600 mt-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize mr-2">
            {data.type}
          </span>
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {data.timeLimit} sec
          </span>
        </div>
        <div className="flex items-center text-gray-500 text-xs mt-3 pt-2 border-t border-gray-100">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {new Date(data.startDate).toLocaleDateString()} - {new Date(data.endDate).toLocaleDateString()}
        </div>
      </div>
    );
  }
  return null;
};

const ChallengeStatsChart = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [timeRange, setTimeRange] = useState("7");
  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const data = await fetchChallengeStats();
        
        const now = new Date();
        const filteredData = data.filter((item) => {
          if (!item.startDate || !item.endDate) return false;
          
          const endDate = new Date(item.endDate);
          const daysAgo = (now - endDate) / (1000 * 60 * 60 * 24);
          return (
            (timeRange === "all" || daysAgo <= parseInt(timeRange)) && 
            (filterType === "all" || item.type === filterType)
          );
        });

        const sortedData = [...filteredData].sort((a, b) => b.participantCount - a.participantCount);
        setStats(sortedData.slice(0, 10));
        setError(null);
      } catch (err) {
        toast.error("Failed to load challenge stats", {
          icon: "⚠️",
          className: "bg-red-50 text-red-800",
        });
        setError("Could not load challenge stats. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, [filterType, timeRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent mb-3"></div>
          <p className="text-blue-500 font-medium">Loading challenge data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/10 w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Challenge Participation Analytics
          </h3>
          <p className="text-sm text-white/70 mt-1">Track performance and engagement across challenges</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 pr-8 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/70">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 pr-8 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
            >
              <option value="all">All Types</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/70">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {error || stats.length === 0 ? (
        <div className="text-center py-12 rounded-lg bg-white/5 border border-white/10">
          <svg className="mx-auto h-10 w-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="mt-3 text-lg font-medium text-white">
            {error ? "Data Loading Error" : "No Data Available"}
          </h4>
          <p className="mt-1 text-sm text-purple-100 max-w-md mx-auto">
            {error || "No challenges match your current filters. Try adjusting the time range or challenge type."}
          </p>
        </div>
      ) : (
        <>
          <div className="relative h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stats} 
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                <XAxis 
                  type="number" 
                  stroke="#ffffff80" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.toLocaleString()}
                  label={{ 
                    value: 'Number of Participants', 
                    position: 'insideBottom', 
                    offset: -10,
                    fill: '#ffffffcc',
                    fontSize: 12
                  }}
                />
                <YAxis 
                  dataKey="title" 
                  type="category" 
                  stroke="#ffffff80" 
                  tick={{ fontSize: 12 }} 
                  width={150}
                  tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                <Bar 
                  dataKey="participantCount" 
                  name="Participants"
                  radius={[0, 4, 4, 0]}
                  animationDuration={1500}
                >
                  {stats.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'daily' ? COLORS[0] : COLORS[1]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-white/90">Daily Challenges</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm text-white/90">Weekly Challenges</span>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-xs text-white/50">
          Showing top {stats.length} challenges by participation • Data updates in real-time
        </p>
      </div>
    </div>
  );
};

export default ChallengeStatsChart;