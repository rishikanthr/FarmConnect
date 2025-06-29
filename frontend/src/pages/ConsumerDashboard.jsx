import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import LogOutButton from "../components/LogOutButton";
import CartButton from "../components/CartButton";

const BASE_URL = import.meta.env.VITE_API_URL;

const ConsumerDashboard = () => {
  const [consumerData, setConsumerData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/consumer/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConsumerData(res.data);
      } catch (err) {
        console.error("Dashboard error", err);
        setError("Failed to load dashboard");
      }
    })();
  }, []);

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-lg border border-red-200 rounded-2xl p-8 shadow-2xl">
          <div className="text-red-600 text-lg font-medium">{error}</div>
        </div>
      </div>
    );

  if (!consumerData)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-lg border border-indigo-200 rounded-2xl p-12 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-indigo-700 text-xl font-medium">Loading your dashboard...</div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">🛒</span>
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 bg-clip-text text-transparent">
                Consumer Dashboard
              </h1>
              <p className="text-indigo-600/80 text-lg font-medium mt-1">
                Welcome back, {consumerData.name}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Link
              to="/wallet"
              className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              💰 Wallet
            </Link>
            <CartButton />
            <button
              onClick={() => navigate("/chat")}
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              💬 Chat
            </button>
            <LogOutButton />
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8 mb-12 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">Name</label>
              <p className="text-lg text-gray-800 mt-1">{consumerData.name}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">Email</label>
              <p className="text-lg text-gray-800 mt-1">{consumerData.email}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">Role</label>
              <p className="text-lg text-gray-800 mt-1 capitalize">{consumerData.role}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">User ID</label>
              <p className="text-lg text-gray-800 mt-1">{consumerData.id}</p>
            </div>
          </div>
        </div>

        {/* Feature Buttons */}
        <div className="grid sm:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/search-title")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300"
          >
            🔍 Search by Title
          </button>

          <button
            onClick={() => navigate("/search-farmer")}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-6 py-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300"
          >
            🧑‍🌾 Search by Farmer
          </button>

          <button
            onClick={() => navigate("/ask-ai")}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300"
          >
            🤖 Ask AI Assistant
          </button>

          <button
            onClick={() => navigate("/order-tracker")}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-6 py-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300"
          >
            📦 Track My Orders
          </button>
        </div>

        {/* All Products Center-Aligned */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate("/all-products")}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold px-8 py-5 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 text-lg"
          >
            🌽 Explore All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
