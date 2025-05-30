import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const UsersGrowthChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'This month',
        data: [65, 59, 80, 81, 56, 55, 70],
        backgroundColor: '#00C3FF',
      },
      {
        label: 'Last month',
        data: [50, 42, 60, 74, 63, 60, 68],
        backgroundColor: '#FFB946',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { display: false },
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
    },
  };

  return (
    <div className="bg-white bg-opacity-10 p-5 rounded-2xl shadow-md w-full h-65">
      <div className="flex justify-between mb-2">
        <h2 className="text-white text-lg font-semibold">Users Growth</h2>
        <span className="text-white text-sm opacity-60">Monthly</span>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default UsersGrowthChart;
