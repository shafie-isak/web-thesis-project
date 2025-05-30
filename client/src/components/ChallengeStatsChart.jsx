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
    return (
      <div className="bg-white shadow-md rounded-lg border border-gray-200 p-4 text-sm">
        <div className="font-semibold text-gray-800">{label}</div>
        <div className="text-blue-600">👥 Participants: <strong>{payload[0].value}</strong></div>
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
  const COLORS = ['#0ea5e9', '#a855f7', '#f59e0b', '#ef4444', '#10b981'];

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const data = await fetchChallengeStats();

        const now = new Date();
        const filteredData = data.filter((item) => {
          const end = new Date(item.endDate || item.startDate);
          const daysAgo = (now - end) / (1000 * 60 * 60 * 24);
          return (timeRange === "all" || daysAgo <= parseInt(timeRange)) && (filterType === "all" || item.type === filterType);
        });

        setStats(filteredData);
        setError(null);
      } catch (err) {
        toast.error("❌ Failed to load challenge stats");
        setError("Could not load challenge stats.");
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, [filterType, timeRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-56">
        <div className="animate-spin h-10 w-10 border-t-4 border-b-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-white shadow-xl border border-white/10 w-full max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">📊 Challenge Participation</h3>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/10 border border-white/30 text-white rounded-md px-3 py-1 text-sm backdrop-blur-sm focus:outline-none focus:border-white/50"
          >
            <option className="text-black/70" value="all">All Time</option>
            <option className="text-black/70" value="7">Last 7 Days</option>
            <option className="text-black/70" value="30">Last 30 Days</option>
            <option className="text-black/70" value="90">Last 90 Days</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/10 border border-white/30 text-white rounded-md px-3 py-1 text-sm backdrop-blur-sm focus:outline-none focus:border-white/50"
          >
            <option className="text-black/70" value="all">All Types</option>
            <option className="text-black/70" value="daily">Daily</option>
            <option className="text-black/70" value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      {error || stats.length === 0 ? (
        <div className="text-center text-purple-200 py-10">
          No data available for the selected filters
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stats} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
            <XAxis type="number" stroke="#ffffffcc" tick={{ fontSize: 12 }} />
            <YAxis dataKey="title" type="category" stroke="#ffffffcc" tick={{ fontSize: 12 }} width={130} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: 'white' }} />
            <Bar dataKey="participants" name="Participants" radius={[0, 5, 5, 0]}>
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      <p className="text-sm text-white/30 text-center mt-4">
            Hover for details.
          </p>
    </div>
  );
};

export default ChallengeStatsChart;
