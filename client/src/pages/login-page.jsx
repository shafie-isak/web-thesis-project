import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";
import axios from "axios";



const Login = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");




  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Basic form validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }



    setLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");


      await axios.post("http://localhost:5000/api/activities/log", {
        userId: data.user._id,
        type: "User",
        action: "Login",
        metadata: {
          label: "Login Form",
          description: `${data.user.name} logged in via email`,
        }
      }, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        }
      });


    } catch (err) {
      if (err.message.includes("banned")) {
        navigate("/banned"); // ✅ redirect to banned screen
      } else {
        setError(err.message || "Login failed");
      }
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <div className=" min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7A4DDF] to-[#3B2A8E]">
      <div className="w-full max-w-md px-8 py-10 bg-white/5 backdrop-blur-md rounded-2xl ">
        <h2 className="text-2xl font-bold text-white text-center mb-6">LOGIN IN</h2>
        {error && (
          <p className="bg-red-500 text-white px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <input
            type=""
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full mb-4 px-5 py-3 rounded-full bg-white/10 text-white border ${error ? 'border-red-500' : 'border-white/20'
              } placeholder-white/70 focus:outline-none focus:border-white/70`}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full mb-2 px-5 py-3 rounded-full bg-white/10 text-white border ${error ? 'border-red-500' : 'border-white/20'
              } placeholder-white/70 focus:outline-none focus:border-white/70`}
          />

          <Link className='text-white' to="/forgot-password">Forget passsword</Link>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-white text-[#7A4DDF] font-semibold py-3 mt-6 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "LOGIN IN"}
          </button>
        </form>
        <p className="text-center text-xs text-white mt-6 opacity-60">
          All ©Copyrights reserved by Elite coders
        </p>
      </div>
    </div>
  );
};

export default Login;
