import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", { email, password });

      localStorage.setItem(
        "user",
        JSON.stringify({ user: res.data.user, token: res.data.token })
      );

      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-md p-8 bg-[#1f2937]/80 backdrop-blur-lg rounded-xl shadow-lg text-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">
          Login to Agora of Olympus
        </h2>

        {error && (
          <div className="bg-red-700 bg-opacity-30 text-red-400 p-2 mb-4 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-600 bg-[#111827] p-3 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-600 bg-[#111827] p-3 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold p-3 rounded transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold p-3 rounded transition-all"
          >
            Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
