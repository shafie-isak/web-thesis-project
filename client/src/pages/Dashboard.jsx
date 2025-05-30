import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import TopUsers from '../components/TopUsers';
import UsersGrowthChart from '../components/UsersGrowthChart';
import EarningsChart from '../components/EarningsChart';
import { fetchDashboardData } from '../utils/api';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import ChallengeStatsChart,{fe} from "../components/ChallengeStatsChart";

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

    if (loading) return <DashboardSkeleton/>;

    return (
        <div>
            <main className="p-4 overflow-y-auto relative h-[87vh] ml-2 rounded-xl border border-white/10">
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    <div className="lg:col-span-1">
                        <TopUsers />
                    </div>
                    <div className="lg:col-span-2 lg:row-span-2">
                        <ChallengeStatsChart />
                    </div>
                    <div className="lg:col-span-1">
                        <UsersGrowthChart />
                    </div>
                    <div className="lg:col-span-1">
                        <EarningsChart />
                    </div>
                    
                </div>
            </main>
        </div>
    );
};

export default Dashboard;