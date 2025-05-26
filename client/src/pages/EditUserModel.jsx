import React, { useState } from 'react';
import axios from 'axios'

const EditUserModal = ({ user, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${user._id}/edit`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        onUpdated(response.data.user);
        onClose();
      }
    } catch (err) {
      console.error("Update failed:", err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <input
          className="border w-full p-2 mb-2"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
        />
        <input
          className="border w-full p-2 mb-2"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        <input
          className="border w-full p-2 mb-2"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Phone"
        />
        <select
          className="border w-full p-2 mb-2"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={formData.banned}
            onChange={(e) => setFormData({ ...formData, banned: e.target.checked })}
          />
          <span>Ban User</span>
        </label>

        <div className="flex justify-end gap-2">
          <button className="text-sm text-gray-500" onClick={onClose}>Cancel</button>
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-4 py-2 rounded"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
