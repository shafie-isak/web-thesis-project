import React,{useEffect} from "react";
import { Outlet } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === "banned") {
          localStorage.clear();
          navigate("/banned");
        }
      }
    };

    fetchStatus();
  }, [navigate]);

  return (
    <div className="flex min-h-screen"
         style={{ background: 'radial-gradient(at center, #7A4DDF, #3B2A8E)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
