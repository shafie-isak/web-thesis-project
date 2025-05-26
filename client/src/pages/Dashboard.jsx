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
                {/* <main className="p-6 overflow-y-auto  relative h-[87vh] ml-2 rounded-xl  border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-4">Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        <StatCard
                            type="users"
                            label="Users"
                            count={stats.users}
                            className="bg-white/90 backdrop-blur-sm"
                        />
                        <StatCard
                            type="subjects"
                            label="Subjects"
                           count={stats.subjects}
                            className="bg-white/90 backdrop-blur-sm"
                        />
                        <StatCard
                            type="chapters"
                            label="Chapters"
                            count={stats.chapters}
                            className="bg-white/90 backdrop-blur-sm"
                        />
                        <StatCard
                            type="mockExams"
                            label="Mock exams"
                            count={stats.mockExams}
                            className="bg-white/90 backdrop-blur-sm"
                        />
                        <StatCard
                            type="pastExams"
                            label="Past federal exams"
                            count={stats.pastExams}
                            className="bg-white/90 backdrop-blur-sm"
                        />
                        <StatCard
                            type="challenges"
                            label="Challenges"
                            count={stats.challenges}
                            className="bg-white/90 backdrop-blur-sm"
                        />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-6 mt-8">
                        <TopUsers />
                        <UsersGrowthChart />
                            <EarningsChart />
                    </div>
                </main> */}

                <AdminUsers/>
            </div>
        </div>
    );
};

export default Dashboard;