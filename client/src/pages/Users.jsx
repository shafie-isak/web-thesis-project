import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUsers, deleteUser, banUser } from "../utils/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaEdit,
  FaTrash,
  FaUserLock,
  FaCrown,
  FaUser,
  FaPlus,
  FaFileExport,
  FaSearch,
  FaPrint,
} from "react-icons/fa";
import { motion } from "framer-motion";
import EditUserModal from "../components/EditUserModel";
import AddUserModal from "./AddUserModal";
import Swal from "sweetalert2";
import UsersSkeleton from "../components/skeletons/AdminUsersSkeleton";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.phone || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .filter((user) => (filterRole ? user.role === filterRole : true))
    .filter((user) => (filterStatus ? user.status === filterStatus : true))
    .sort((a, b) => {
      if (!sortBy) return 0;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "email") return a.email.localeCompare(b.email);
      if (sortBy === "coins") return b.coins - a.coins;
      if (sortBy === "xp") return b.xp - a.xp;
      if (sortBy === "level") return b.level - a.level;
      return 0;
    });

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("User Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    const tableColumnHeaders = [
      "Name",
      "Email",
      "Phone",
      "Coins",
      "XP",
      "Level",
      "Status",
      "Role",
    ];

    const tableRows = filteredUsers.map((user) => [
      user.name,
      user.email,
      user.phone || "No phone",
      user.coins,
      user.xp,
      user.level,
      user.status,
      user.role,
    ]);

    autoTable(doc, {
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [80, 80, 160] },
    });

    doc.save(`user_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Coins",
      "XP",
      "Level",
      "Status",
      "Role",
      "Joined",
    ];
    const rows = filteredUsers.map((user) => [
      user.name,
      user.email,
      user.phone || "N/A",
      user.coins,
      user.xp,
      user.level,
      user.status,
      user.role,
      new Date(user.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const filename = `users_${yyyy}_${mm}_${dd}.csv`;

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

    if (userId === currentUserId) {
      toast.error("❌ You cannot delete your own account.");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete user!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await deleteUser(userId);
        Swal.close();
        await fetchUsers();

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "User has been deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      } catch (err) {
        Swal.close();
        const message =
          err.response?.data?.message || "❌ Failed to delete user.";
        toast.error(message);
      }
    }
  };

  const handleBan = async (userId) => {
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

    if (userId === currentUserId) {
      toast.error("You cannot ban yourself.");
      return;
    }

    if (
      window.confirm("Ban this user? They will no longer be able to log in.")
    ) {
      try {
        await banUser(userId);
        toast.success("🚫 User banned successfully.");
        fetchUsers();
      } catch (err) {
        const message = err.response?.data?.message || "❌ Failed to ban user.";
        toast.error(message);
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const handlePrint = () => {
    window.print();
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) return <UsersSkeleton />;

  return (
    <div className="px-6 ]]overflow-y-auto  relative h-[87vh] ml-2 rounded-xl overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="text-sm text-gray-300">
          {users.length} {users.length === 1 ? "user" : "users"} registered
        </p>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-wrap flex-1 gap-4 mt-4">
          <div className="flex items-center bg-white/10 text-white border border-white/30 rounded-full px-4 py-2 w-full max-w-sm">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name, email or phone"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent focus:outline-none text-sm placeholder-gray-400 w-full"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-md focus:outline-none focus:border-white/50"
          >
            <option className="text-black/30" value="">
              Sort by
            </option>
            <option className="text-black/70" value="name">
              Name
            </option>
            <option className="text-black/70" value="email">
              Email
            </option>
            <option className="text-black/70" value="coins">
              Coins
            </option>
            <option className="text-black/70" value="xp">
              XP
            </option>
            <option className="text-black/70" value="level">
              Level
            </option>
          </select>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-md focus:outline-none focus:border-white/50"
          >
            <option className="text-black/30" value="">
              Filter Role
            </option>
            <option className="text-black/70" value="admin">
              Admin
            </option>
            <option className="text-black/70" value="user">
              User
            </option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-md focus:outline-none focus:border-white/50"
          >
            <option className="text-black/30" value="">
              Filter Status
            </option>
            <option className="text-black/70" value="active">
              Active
            </option>
            <option className="text-black/70" value="banned">
              Banned
            </option>
          </select>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white/10 px-5 py-2 border flex gap-2 justify-between items-center border-white/30 text-white rounded-full"
          >
            <FaPlus /> Add User
          </button>
          <button
            onClick={exportToCSV}
            className="bg-white/10 px-5 py-2 border flex gap-2 justify-between items-center border-white/30 text-white rounded-full"
          >
            <FaFileExport /> Export CSV
          </button>
          <button
            onClick={exportToPDF}
            className="bg-white/10 px-5 py-2 border flex gap-2 justify-between items-center border-white/30 text-white rounded-full"
          >
            <FaFileExport /> Export PDF
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 backdrop-blur-sm  rounded-2xl overflow-hidden border border-white/10 shadow-xl"
      >
        <div className="mx-h[80vh] h-[69vh]  overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-700 to-indigo-800">
              <tr className="text-white font-medium">
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Contact</th>
                <th className="px-6 py-4 text-center">Progress</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-centerf">Role</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-white/10"
            >
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user._id}
                  variants={rowVariants}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                  className="text-gray-300"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-900/50 flex items-center justify-center">
                        {user.role === "admin" ? (
                          <FaCrown className="text-yellow-400" />
                        ) : (
                          <FaUser className="text-purple-300" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{user.email}</div>
                    <div className="text-xs text-gray-400">
                      {user.phone || "No phone"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <div className="flex space-x-4">
                        <div className="text-center">
                          <div className="text-sm font-bold text-purple-300">
                            {user.coins}
                          </div>
                          <div className="text-xs text-gray-400">Coins</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-green-300">
                            {user.xp}
                          </div>
                          <div className="text-xs text-gray-400">XP</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-blue-300">
                            {user.level}
                          </div>
                          <div className="text-xs text-gray-400">Level</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                                ${
                                                  user.status === "active"
                                                    ? "bg-green-900/30 text-green-300"
                                                    : "bg-red-900/30 text-red-300"
                                                }`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                                ${
                                                  user.role === "admin"
                                                    ? "bg-amber-900/30 text-amber-300"
                                                    : "bg-gray-800/30 text-gray-300"
                                                }`}
                    >
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
                      {user._id !==
                        JSON.parse(localStorage.getItem("user"))?.id && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(user._id)}
                          className="text-red-400 hover:text-red-300 bg-red-900/30 p-2 rounded-lg transition-colors"
                          aria-label="Delete user"
                        >
                          <FaTrash />
                        </motion.button>
                      )}

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

      {isModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onUpdated={(updatedUser) => {
            toast.success("✅ User updated successfully.");
            setUsers((prev) =>
              prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
            );
          }}
        />
      )}

      {isAddModalOpen && (
        <AddUserModal
          onClose={() => setIsAddModalOpen(false)}
          onAdded={() => {
            toast.success("✅ New user added.");
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

export default AdminUsers;
