import React, { useState } from 'react';
import axios from 'axios';

const EditUserModal = ({ user, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.toString().trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be numeric';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    setErrors({});
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/${user._id}/edit`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        onUpdated(response.data.user);
        onClose();
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setErrors((prev) => ({ ...prev, email: "Email already exists" }));
      } else if (status === 410) {
        setErrors((prev) => ({ ...prev, phone: "Phone number already exists" }));
      } else {
        console.error("❌ Update failed:", err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <input
          className="border w-full p-2 mb-1"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
        />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

        <input
          className="border w-full p-2 mb-1"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

        <input
          className="border w-full p-2 mb-1"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Phone"
        />
        {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone}</p>}

        <select
          className="border w-full p-2 mb-2"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <select
          className="border w-full p-2 mb-4"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>

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
