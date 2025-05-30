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
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [users, setUsers] = useState([]);

    const [isMuted, setIsMuted] = useState(() => {
        return localStorage.getItem("muteSound") === "true";
    });


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

                if (!isMuted) {
                    const audio = new Audio('/notification.wav');
                    audio.play().catch(() => { });
                }
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
                    ...(typeFilter && { role: typeFilter }),
                    ...(userFilter && { userId: userFilter }),
                    ...(startDate && { from: startDate }),
                    ...(endDate && { to: endDate }),
                },
            });

            setActivities(res.data.activities);

            // Auto-populate type list and users list from returned data
            const uniqueTypes = new Set(res.data.activities.map(a => a.type));
            const uniqueUsers = new Map();
            res.data.activities.forEach(a => {
                if (a.userId) uniqueUsers.set(a.userId._id, a.userId);
            });
            setUsers(Array.from(uniqueUsers.values()));
        } catch (err) {
            console.error("Error fetching activities", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-white">Loading activity logs...</p>;

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl px-6 py-4 text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">User Activity Log</h2>

                <button
                    onClick={() => {
                        const newMute = !isMuted;
                        setIsMuted(newMute);
                        localStorage.setItem("muteSound", newMute.toString());
                    }}
                    className="bg-white/10 border border-white/30 px-4 py-2 rounded-full text-sm hover:bg-white/20 transition"
                >
                    {isMuted ? "🔇 Sound Off" : "🔊 Sound On"}
                </button>
            </div>


            <div className="flex flex-wrap gap-4 mb-4">
                <select
                    className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full focus:outline-none focus:border-white/50"
                    onChange={(e) => setUserFilter(e.target.value)}
                    value={userFilter}
                >
                    <option className="text-black/50" value="">All Users</option>
                    {users.map((user) => (
                        <option className="text-black/70" key={user._id} value={user._id}>
                            {user.name} ({user.role})
                        </option>
                    ))}
                </select>

                <select
                    className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full focus:outline-none focus:border-white/50"
                    onChange={(e) => setTypeFilter(e.target.value)}
                    value={typeFilter}
                >
                    <option className="text-black/50" value="">All Roles</option>
                    {["admin", "user"].map((role) => (
                        <option className="text-black/70" key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full focus:outline-none focus:border-white/50"
                />

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full focus:outline-none focus:border-white/50"
                />

                <button
                    onClick={() => {
                        setStartDate("");
                        setEndDate("");
                        setTypeFilter("");
                        setUserFilter("");
                    }}
                    className="text-sm bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30"
                >
                    Clear Filters
                </button>



            </div>

            <div className="relative max-h-[70vh] overflow-y-auto rounded">
                <table className="w-full text-left border-collapse rounded-2xl">
                    <thead className="sticky top-0 bg-black/30 backdrop-blur z-10 rounded-t-2xl">
                        <tr className="text-white/80">
                            <th className="p-2">User</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Action</th>
                            <th className="p-2">Description</th>
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
                                        <div className="text-xs text-white/60">{a.userId?.email || "N/A"}</div>
                                    </div>
                                </td>
                                <td className="p-2">{a.userId?.role || "Unknown"}</td>
                                <td className="p-2">{a.action}</td>
                                <td className="p-2">{a.metadata?.description || "-"}</td>
                                <td className="p-2 text-sm text-white/60">
                                    {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                                    <br />
                                    <span className="text-xs">{new Date(a.createdAt).toLocaleString()}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ToastContainer />
        </div>
    );
};

export default UserActivity;
