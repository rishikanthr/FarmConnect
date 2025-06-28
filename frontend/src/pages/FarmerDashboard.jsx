import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import LogoutButton from "../components/LogOutButton";
import AddProduct from "../components/AddProduct";

const FarmerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/farmer/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-lg border border-red-200 rounded-2xl p-8 shadow-2xl">
          <div className="text-red-600 text-lg font-medium">{error}</div>
        </div>
      </div>
    );

  if (!dashboardData)
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-lg border border-emerald-200 rounded-2xl p-12 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-emerald-700 text-xl font-medium">Loading your dashboard...</div>
          </div>
        </div>
      </div>
    );

  const { profile } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header: Title and Buttons */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
          {/* Left Side - Welcome */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">🌾</span>
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 bg-clip-text text-transparent">
                Farmer Dashboard
              </h1>
              <p className="text-emerald-600/80 text-lg font-medium mt-1">
                Welcome back, {profile?.name}
              </p>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {/* Wallet */}
            <Link
              to="/wallet"
              className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              💰 Wallet
            </Link>

            {/* Chat */}
            <button
              onClick={() => navigate("/chat")}
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              💬 Chat
            </button>

            {/* Logout */}
            <LogoutButton />
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8 mb-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/80">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">👨‍🌾</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">Full Name</label>
              <p className="text-lg text-gray-800 mt-1">{profile.name}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">Farmer ID</label>
              <p className="text-lg font-mono text-gray-800 mt-1">{profile._id}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">Email</label>
              <p className="text-lg text-gray-800 mt-1">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">Role</label>
              <p className="text-lg text-gray-800 mt-1 capitalize">{profile.role}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">Location</label>
              <p className="text-lg text-gray-800 mt-1">{profile.location}</p>
            </div>
          </div>
        </div>

        {/* Add Product Section */}
        <div className="mb-16">
          <AddProduct onProductAdded={fetchDashboard} />
        </div>

        {/* Cards Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Products */}
          <div
            onClick={() => navigate("/farmer/products")}
            className="group cursor-pointer relative overflow-hidden bg-gradient-to-br from-emerald-100 to-green-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-2xl font-bold text-emerald-800 mb-3">My Products</h3>
            <p className="text-emerald-700/80 text-base">
              View and manage all your listed products with analytics and tools.
            </p>
          </div>

          {/* Disease Predictor */}
          <div
            onClick={() => navigate("/farmer/disease-predictor")}
            className="group cursor-pointer relative overflow-hidden bg-gradient-to-br from-amber-100 to-yellow-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <span className="text-3xl">🦠</span>
            </div>
            <h3 className="text-2xl font-bold text-amber-800 mb-3">Disease Prediction</h3>
            <p className="text-amber-700/80 text-base">
              Upload crop images and detect diseases using AI technology.
            </p>
          </div>

          {/* AI Assistant */}
          <div
            onClick={() => navigate("/farmer/ai-assistant")}
            className="group cursor-pointer relative overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-2xl font-bold text-indigo-800 mb-3">AI Assistant</h3>
            <p className="text-indigo-700/80 text-base">
              Get personalized advice on farming, crops, weather, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
