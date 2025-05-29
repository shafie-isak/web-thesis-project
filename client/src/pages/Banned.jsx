import React from "react";
import { useNavigate } from "react-router-dom";

const Banned = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Account Banned</h1>
        <p className="text-gray-700 mb-4">
          Your account has been banned. Please contact support if you believe this is a mistake.
        </p>
        <button
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Banned;
