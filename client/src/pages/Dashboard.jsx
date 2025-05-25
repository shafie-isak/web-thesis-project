import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';

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
        <main className="p-6">
          <h3 className="text-2xl font-bold text-white mb-4">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-4">
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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;