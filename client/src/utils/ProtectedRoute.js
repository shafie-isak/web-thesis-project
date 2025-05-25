import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("🔐 User:", user);

  if (!token || !user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user.role)) {
    console.warn("❌ Access denied. Role:", user.role);
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};


export default ProtectedRoute;
