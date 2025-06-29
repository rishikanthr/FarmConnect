import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = res.data;
      if (!user?.role) {
        setError("Invalid login response: role missing");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setShowSuccess(true);
      setTimeout(() => {
        if (user.role === "farmer") navigate("/farmer");
        else if (user.role === "consumer") navigate("/consumer");
        else if (user.role === "admin") navigate("/admin");
        else setError("Unrecognized user role");
      }, 2000);
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError(err.response?.data?.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-16 w-40 h-40 bg-amber-500 rounded-full opacity-20 animate-pulse blur-3xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-green-400 rounded-full opacity-15 animate-bounce blur-2xl" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-24 left-1/4 w-48 h-48 bg-lime-400 rounded-full opacity-10 animate-pulse blur-3xl" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-32 right-16 w-36 h-36 bg-yellow-400 rounded-full opacity-20 animate-bounce blur-2xl" style={{ animationDuration: '3s', animationDelay: '0.8s' }}></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-lg">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-amber-500 to-orange-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

            <div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl p-8 border border-green-200/20 shadow-2xl">
              {/* Logo & Title */}
              <div className="text-center mb-8">
                <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-spin-slow border-4 border-amber-400">
                  <span className="text-4xl animate-pulse">🌾</span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-300 via-amber-300 to-orange-300 bg-clip-text text-transparent animate-pulse">
                  Farm Market
                </h1>
                <p className="text-green-200 text-sm">Fresh from Farm to Table</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-400/40 rounded-xl text-red-300 text-center backdrop-blur-xl animate-shake">
                  🌿 {error}
                </div>
              )}

              {/* Success Animation */}
              {showSuccess && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-xl z-20">
                  <div className="text-center text-white">
                    <div className="text-5xl mb-4 animate-bounce">✅</div>
                    <div className="text-xl font-bold mb-2 text-green-300">Login Successful</div>
                    <div className="text-sm opacity-80">Redirecting to your dashboard...</div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-green-900/30 border border-green-300/30 rounded-xl px-4 py-3 text-white placeholder-green-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400/50 backdrop-blur-xl"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-green-900/30 border border-green-300/30 rounded-xl px-4 py-3 text-white placeholder-green-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400/50 backdrop-blur-xl"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-green-600 via-amber-500 to-orange-500 py-3 font-semibold text-white shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </button>
              </form>

              {/* Extra Links */}
              <div className="mt-6 text-center text-green-300 text-sm">
                <Link to="/register" className="hover:underline block">
                  🌱 Don’t have an account? Register
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-green-400/80 text-xs">
            🛡️ Farm Fresh Security • Organic Data Protection 🌿
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
