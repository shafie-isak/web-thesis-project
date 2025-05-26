import axios from 'axios'
const API_URL = "http://localhost:5000";
const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  return res.json(); // returns { token, user }
};

export const fetchDashboardData = async (token) => {
  const res = await fetch(`${API_URL}/api/admin/dashboard-summary`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return await res.json();
};

export const getTopUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/users/top`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch top users");
  return res.json();
};

export const getUsers = async () => {
  const res = await fetch(`${API_URL}/api/users/all`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

export const updateUser = (id, data) => axios.put(`${API_URL}/api/users/${id}`, data, { headers });
export const deleteUser = (id) => axios.delete(`${API_URL}/api/users/${id}`, { headers });
export const banUser = (id) => axios.put(`${API_URL}/api/users/${id}/ban`, {}, { headers });
