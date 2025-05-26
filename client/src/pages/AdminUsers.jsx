import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, banUser } from "../utils/api";
import { FaEdit, FaTrash, FaUserLock, FaCrown, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import EditUserModal from "./EditUserModel";
import AddUserModal from "./AddUserModal";



const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);



    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };


    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(userId);
                fetchUsers();
            } catch (err) {
                console.error("❌ Failed to delete user:", err);
            }
        }
    };

    const handleBan = async (userId) => {
        if (window.confirm("Ban this user? They will no longer be able to log in.")) {
            try {
                await banUser(userId);
                fetchUsers();
            } catch (err) {
                console.error("❌ Failed to ban user:", err);
            }
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="px-6 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Users</h1>
                    <p className="text-sm text-gray-300">
                        {users.length} {users.length === 1 ? 'user' : 'users'} registered
                    </p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-white/10 px-5 py-3 border border-white/30 text-white rounded-full">
                    Add User
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/5 backdrop-blur-sm  rounded-2xl overflow-hidden border border-white/10 shadow-xl"
                >
                    <div className="mx-h[80vh] h-[73vh]  overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-purple-700 to-indigo-800">
                                <tr className="text-white font-medium">
                                    <th className="px-6 py-4 text-left">User</th>
                                    <th className="px-6 py-4 text-left">Contact</th>
                                    <th className="px-6 py-4 text-center">Progress</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-centerf">Role</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <motion.tbody
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="divide-y divide-white/10"
                            >
                                {users.map((user) => (
                                    <motion.tr
                                        key={user._id}
                                        variants={rowVariants}
                                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                                        className="text-gray-300"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-900/50 flex items-center justify-center">
                                                    {user.role === 'admin' ? (
                                                        <FaCrown className="text-yellow-400" />
                                                    ) : (
                                                        <FaUser className="text-purple-300" />
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">{user.name}</div>
                                                    <div className="text-xs text-gray-400">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-white">{user.email}</div>
                                            <div className="text-xs text-gray-400">{user.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center">
                                                <div className="flex space-x-4">
                                                    <div className="text-center">
                                                        <div className="text-sm font-bold text-purple-300">{user.coins}</div>
                                                        <div className="text-xs text-gray-400">Coins</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm font-bold text-green-300">{user.xp}</div>
                                                        <div className="text-xs text-gray-400">XP</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm font-bold text-blue-300">{user.level}</div>
                                                        <div className="text-xs text-gray-400">Level</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                                ${user.status === 'active'
                                                    ? 'bg-green-900/30 text-green-300'
                                                    : 'bg-red-900/30 text-red-300'}`}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                                ${user.role === 'admin'
                                                    ? 'bg-amber-900/30 text-amber-300'
                                                    : 'bg-gray-800/30 text-gray-300'}`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleEdit(user)}
                                                    className="text-blue-400 hover:text-blue-300 bg-blue-900/30 p-2 rounded-lg transition-colors"
                                                    aria-label="Edit user"
                                                >
                                                    <FaEdit />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDelete(user._id)}
                                                    className="text-red-400 hover:text-red-300 bg-red-900/30 p-2 rounded-lg transition-colors"
                                                    aria-label="Delete user"
                                                >
                                                    <FaTrash />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleBan(user._id)}
                                                    className="text-yellow-400 hover:text-yellow-300 bg-yellow-900/30 p-2 rounded-lg transition-colors"
                                                    aria-label="Ban user"
                                                >
                                                    <FaUserLock />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </motion.tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {isModalOpen && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onUpdated={(updatedUser) => {
                        setUsers((prev) =>
                            prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
                        );
                    }}
                />
            )}'

            {isAddModalOpen && (
                <AddUserModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdded={fetchUsers}
                />
            )}

        </div>

    );
};

export default AdminUsers;