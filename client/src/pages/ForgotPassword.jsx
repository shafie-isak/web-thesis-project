import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/forgot-password/send-otp`, { email });
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7A4DDF] to-[#3B2A8E]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <input
          className="border w-full p-2 mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;