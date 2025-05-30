import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const EarningsChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Earnings',
        data: [100, 250, 300, 510, 400, 320, 450],
        borderColor: '#B084F8',
        backgroundColor: '#B084F8',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
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
        <h2 className="text-white text-lg font-semibold">Earnings</h2>
        <span className="text-white text-sm opacity-60">Weekly</span>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default EarningsChart;
