import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
    location: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await axios.post(`${BASE_URL}/api/auth/register`, form);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsLoading(false);
        alert(`Welcome to Farm Market, ${form.name}!`);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setIsLoading(false);
    }
  };

  const roleIcons = {
    farmer: "👨‍🌾",
    consumer: "🛒",
    admin: "⚙️",
  };

  const roleDescriptions = {
    farmer: "Sell your fresh produce",
    consumer: "Buy farm-fresh products",
    admin: "Manage the marketplace",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white/5 border border-green-300/20 rounded-3xl backdrop-blur-xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2 animate-pulse">🌾</div>
          <h1 className="text-3xl font-bold text-green-200">Join Farm Market</h1>
          <p className="text-green-300 mt-2">🌿 Growing Together, Selling Fresh</p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-600/10 border border-green-400 text-green-300 rounded-lg text-center animate-pulse">
            🌱 Account created! Redirecting...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-400 text-red-300 rounded-lg text-center animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-green-900/30 text-white placeholder-green-300 border border-green-500/30 focus:ring-2 focus:ring-amber-400"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-green-900/30 text-white placeholder-green-300 border border-green-500/30 focus:ring-2 focus:ring-amber-400"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-green-900/30 text-white placeholder-green-300 border border-green-500/30 focus:ring-2 focus:ring-amber-400"
          />

          <input
            name="location"
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-green-900/30 text-white placeholder-green-300 border border-green-500/30 focus:ring-2 focus:ring-amber-400"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-green-900/30 text-white border border-green-500/30 focus:ring-2 focus:ring-amber-400"
          >
            <option value="farmer">👨‍🌾 Farmer</option>
            <option value="consumer">🛒 Consumer</option>
            <option value="admin">⚙️ Admin</option>
          </select>

          <p className="text-green-200 text-sm ml-1">{roleDescriptions[form.role]}</p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-amber-500 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-transform disabled:opacity-60"
          >
            {isLoading ? "Creating Account..." : "🌱 Start Farming"}
          </button>
        </form>

        <div className="mt-6 text-center text-green-200">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="underline text-amber-400 hover:text-orange-300"
          >
            Login here
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Register;
