import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";



const Login = () => {

    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
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
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-5 py-3 rounded-full bg-white/10 text-white border border-white/20 placeholder-white/70 focus:outline-none focus:border-white/70"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 px-5 py-3 rounded-full bg-white/10  border border-white/20 text-white placeholder-white/70 focus:outline-none focus:border-white/70"
        />
        <div className="text-right text-sm text-white mb-4">
          <a href="#" className="hover:underline">Forget Password</a>
        </div>

        <button  type="submit" disabled={loading} className="w-full bg-white text-[#7A4DDF] font-semibold py-3 rounded-full hover:bg-gray-100 transition">
          {loading ? "Logging in..." : "LOGIN IN"}
        </button>
        </form>

        <div className="flex items-center justify-center my-4 text-white">
          <hr className="flex-1 border-white/20" />
          <span className="mx-2 text-sm">OR</span>
          <hr className="flex-1 border-white/20" />
        </div>
        <button  className="w-full flex items-center justify-center gap-2 border border-white/30 text-white py-3 rounded-full hover:bg-white/10 transition">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.1H2.18V16.94C4 20.53 7.7 23 12 23Z" fill="#34A853"/>
              <path d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91V7.07H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.93L5.84 14.09Z" fill="#FBBC05"/>
              <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 4 3.47 2.18 7.07L5.84 9.91C6.71 7.31 9.14 5.38 12 5.38Z" fill="#EA4335"/>
            </svg>
          Continue with Google
        </button>

        <p className="text-center text-xs text-white mt-6 opacity-60">
          All ©Copyrights reserved by Elite coders
        </p>
      </div>
    </div>
  );
};

export default Login;
