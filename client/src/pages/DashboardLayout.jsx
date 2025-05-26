import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen p-2"
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
