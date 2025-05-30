import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/login-page';
import Dashboard from './pages/Dashboard';
import Unauthorized from "./pages/Unauthorized";
import Banned from "./pages/Banned"; 
import ProtectedRoute from './utils/ProtectedRoute';
import DashboardLayout from './pages/DashboardLayout';
import AdminUsers from './pages/Users';
import Subjects from './pages/Subjects';
import Chapters from './pages/Chapters';
import Questions from './pages/Questions';
import PastExams from './pages/PastExams';
import MockExams from './pages/MockExams';
import Challenges from './pages/Challenges';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/banned" element={<Banned />} /> 
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="chapters" element={<Chapters />} />
            <Route path="questions" element={<Questions />} />
            <Route path="past-exams" element={<PastExams />} />
            <Route path="mock-exams" element={<MockExams />} />
            <Route path="challenges" element={<Challenges />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}


export default App;
