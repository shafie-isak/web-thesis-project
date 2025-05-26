import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import TopUsers from '../components/TopUsers';
import UsersGrowthChart from '../components/UsersGrowthChart';
import EarningsChart from '../components/EarningsChart';
import { fetchDashboardData } from '../utils/api';
import AdminUsers from './AdminUsers'

const Dashboard = () => {

    const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchDashboardData(token)
      .then(setStats)
      .catch(err => console.error("Dashboard Error:", err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-white p-4">Loading...</p>;

    return (
        <div
            className="flex min-h-screen p-2"
            style={{
                background: 'radial-gradient(at center, #7A4DDF, #3B2A8E)'
            }}
        >
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar />
                

                <AdminUsers/>
            </div>
        </div>
    );
};

export default Dashboard;