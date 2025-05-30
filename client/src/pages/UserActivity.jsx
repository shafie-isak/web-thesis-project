import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const UserActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [types, setTypes] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, [typeFilter, userFilter]);

 useEffect(() => {
  const enableSocket = () => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log("🔌 Connected to socket:", socket.id);
    });

    socket.on('new-activity', (newActivity) => {
      setActivities(prev => [newActivity, ...prev]);

      const name = newActivity?.userId?.name || "Unknown";
      toast.info(`🔔 New activity by ${name}: ${newActivity.action}`);

        const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
    });

    window.removeEventListener('click', enableSocket); // only bind once
  };

  window.addEventListener('click', enableSocket);
}, []);




  const fetchActivities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/activities/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          ...(typeFilter && { type: typeFilter }),
          ...(userFilter && { userId: userFilter }),
        },
      });

      setActivities(res.data.activities);

      // Auto-populate type list and users list from returned data
      const uniqueTypes = new Set(res.data.activities.map(a => a.type));
      const uniqueUsers = new Map();
      res.data.activities.forEach(a => {
        if (a.userId) uniqueUsers.set(a.userId._id, a.userId);
      });
      setTypes(Array.from(uniqueTypes));
      setUsers(Array.from(uniqueUsers.values()));
    } catch (err) {
      console.error("Error fetching activities", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-white">Loading activity logs...</p>;

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">User Activity Log</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <select
          className="bg-white/10 border border-white/20 text-white p-2 rounded"
          onChange={(e) => setUserFilter(e.target.value)}
          value={userFilter}
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>

        <select
          className="bg-white/10 border border-white/20 text-white p-2 rounded"
          onChange={(e) => setTypeFilter(e.target.value)}
          value={typeFilter}
        >
          <option value="">All Types</option>
          {types.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-white/80 bg-white/10">
            <th className="p-2">User</th>
            <th className="p-2">Type</th>
            <th className="p-2">Action</th>
            <th className="p-2">Label</th>
            <th className="p-2">Description</th>
            <th className="p-2">IP</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a, i) => (
            <tr key={i} className="border-t border-white/10 hover:bg-white/5 transition">
              <td className="p-2 flex items-center gap-2">
                {a.userId?.profilePicture && (
                  <img
                    src={`http://localhost:5000/uploads/profiles/${a.userId.profilePicture}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <div className="font-semibold">{a.userId?.name || "N/A"}</div>
                  <div className="text-xs text-white/60">{a.userId?.role}</div>
                </div>
              </td>
              <td className="p-2">{a.type}</td>
              <td className="p-2">{a.action}</td>
              <td className="p-2">{a.metadata?.label || "-"}</td>
              <td className="p-2">{a.metadata?.description || "-"}</td>
              <td className="p-2 text-sm text-white/60">{a.metadata?.ip || "-"}</td>
              <td className="p-2 text-sm text-white/60">
                {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                <br />
                <span className="text-xs">
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default UserActivity;
