import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login-page';
import Dashboard from './pages/Dashboard';
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from './utils/ProtectedRoute'


function App() {
  return (

    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

    </Routes>

  );
}

export default App;
