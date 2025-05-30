import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const UserActivityChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('/api/user-activities/stats/daily')
      .then(res => {
        const { dates, counts } = res.data;
        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'Activity Count',
              data: counts,
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
          ],
        });
      })
      .catch(err => console.error('Chart load error:', err));
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">User Activity (Last 7 Days)</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default UserActivityChart;
