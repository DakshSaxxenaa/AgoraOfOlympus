import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/auth/register", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-[#111827] rounded shadow text-white">
      <h2 className="text-2xl font-bold mb-4 text-white">Register</h2>

      {error && (
        <div className="bg-red-600 bg-opacity-20 text-red-400 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full border border-gray-600 bg-[#1f2937] text-white p-2 rounded focus:outline-none focus:ring focus:ring-purple-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-600 bg-[#1f2937] text-white p-2 rounded focus:outline-none focus:ring focus:ring-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-600 bg-[#1f2937] text-white p-2 rounded focus:outline-none focus:ring focus:ring-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white p-2 rounded transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white p-2 rounded transition"
        >
          Home
        </button>
      </form>
    </div>
  );
};

export default Register;
