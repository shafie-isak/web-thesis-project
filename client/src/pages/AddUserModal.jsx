import React, { useState } from 'react';
import axios from 'axios';

const AddUserModal = ({ onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be numeric';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const response = await axios.post(
        'http://54.173.216.17:5000/api/users/add-user',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.success) {
        onAdded();
        onClose();
      }
    } catch (err) {
      console.error('❌ Failed to add user:', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>

        <input
          className="border w-full p-2 mb-1"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <p className="text-sm text-red-500 mb-2">{errors.name}</p>}

        <input
          className="border w-full p-2 mb-1"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <p className="text-sm text-red-500 mb-2">{errors.email}</p>}

        <input
          className="border w-full p-2 mb-1"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        {errors.phone && <p className="text-sm text-red-500 mb-2">{errors.phone}</p>}

        <input
          className="border w-full p-2 mb-1"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {errors.password && <p className="text-sm text-red-500 mb-2">{errors.password}</p>}

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
          <button className="text-gray-500" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
