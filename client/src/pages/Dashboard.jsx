import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import TopUsers from '../components/TopUsers';
import UsersGrowthChart from '../components/UsersGrowthChart';
import EarningsChart from '../components/EarningsChart';

const Dashboard = () => {
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
                <main className="p-6 overflow-y-auto  relative h-[87vh] ml-2 rounded-xl  border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-4">Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        <StatCard
                            type="users"
                            label="Users"
                            value="1024"
                            className="bg-white/90 backdrop-blur-sm"
                        />
                        <StatCard
                            type="subjects"
                            label="Subjects"
                            value="12"
                            className="bg-white/90 backdrop-blur-sm"
                        />
                        <StatCard
                            type="chapters"
                            label="Chapters"
                            value="135"
                            className="bg-white/90 backdrop-blur-sm"
                        />
                        <StatCard
                            type="mockExams"
                            label="Mock exams"
                            value="50"
                            className="bg-white/90 backdrop-blur-sm"
                        />
                        <StatCard
                            type="pastExams"
                            label="Past federal exams"
                            value="50"
                            className="bg-white/90 backdrop-blur-sm"
                        />
                        <StatCard
                            type="challenges"
                            label="Challenges"
                            value="50"
                            className="bg-white/90 backdrop-blur-sm"
                        />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-6 mt-8">
                        <TopUsers />
                        <UsersGrowthChart />
                            <EarningsChart />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;