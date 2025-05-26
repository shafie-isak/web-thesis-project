// pages/Users.jsx
import React, { useEffect, useState } from 'react';
import { getUsers, promoteUser, deleteUser } from '../utils/api';
import { FaUserShield, FaTrash } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    const data = await getUsers(); // backend GET /api/users/all
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (id) => {
    await promoteUser(id);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-white">Users Management</h2>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 rounded w-full bg-white/10 text-white placeholder-white/50"
      />

      <div className="overflow-x-auto bg-white/5 rounded-xl">
        <table className="w-full text-left text-sm text-white">
          <thead className="bg-white/10 text-white/80">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user._id} className="border-b border-white/10">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-green-500' : 'bg-gray-500'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 flex gap-2">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handlePromote(user._id)}
                      className="text-green-400 hover:text-green-600"
                      title="Promote to Admin"
                    >
                      <FaUserShield />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-400 hover:text-red-600"
                    title="Delete User"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="p-4 text-white/60 text-sm text-center">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
