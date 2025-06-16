import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/forgot-password/reset`, { email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7A4DDF] to-[#3B2A8E]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <input
          className="border w-full p-2 mb-2"
          placeholder="New Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          className="border w-full p-2 mb-4"
          placeholder="Confirm Password"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;